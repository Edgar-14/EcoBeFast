import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import Stripe from 'stripe';

const db = getFirestore();
const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: '2023-10-16',
});

// Credit packages
const CREDIT_PACKAGES = {
  'basic': { name: 'Básico', credits: 50, price: 2500, priceId: 'price_basic' },
  'standard': { name: 'Estándar', credits: 100, price: 4500, priceId: 'price_standard' },
  'premium': { name: 'Premium', credits: 200, price: 8000, priceId: 'price_premium' },
  'enterprise': { name: 'Empresarial', credits: 500, price: 18000, priceId: 'price_enterprise' }
};

// Create Stripe checkout session
export const createStripeCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { businessId, packageId } = data;
  const package_ = CREDIT_PACKAGES[packageId as keyof typeof CREDIT_PACKAGES];

  if (!package_) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid package ID');
  }

  try {
    // Get business data
    const businessDoc = await db.collection('businesses').doc(businessId).get();
    if (!businessDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Business not found');
    }

    const businessData = businessDoc.data()!;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: businessData.email,
      metadata: {
        businessId,
        packageId,
        credits: package_.credits.toString()
      },
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: `Créditos BeFast - ${package_.name}`,
              description: `${package_.credits} créditos para deliveries`,
            },
            unit_amount: package_.price * 100, // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      success_url: `${functions.config().app.url}/delivery/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${functions.config().app.url}/delivery/billing?cancelled=true`,
    });

    return { sessionUrl: session.url };
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create payment session');
  }
});

// Handle Stripe webhook
export const handleStripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = functions.config().stripe.webhook_secret;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    res.status(400).send(`Webhook Error: ${err}`);
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleSuccessfulPayment(event.data.object as Stripe.Checkout.Session);
        break;
      case 'payment_intent.payment_failed':
        await handleFailedPayment(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).send('Webhook handler failed');
  }
});

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const { businessId, packageId, credits } = session.metadata!;
  const creditsToAdd = parseInt(credits);

  await db.runTransaction(async (transaction) => {
    const businessRef = db.collection('businesses').doc(businessId);
    const businessDoc = await transaction.get(businessRef);

    if (!businessDoc.exists) {
      throw new Error('Business not found');
    }

    // Update business credits
    transaction.update(businessRef, {
      availableCredits: FieldValue.increment(creditsToAdd),
      purchasedCredits: FieldValue.increment(creditsToAdd),
      updatedAt: FieldValue.serverTimestamp()
    });

    // Log credit transaction
    const transactionRef = db.collection('creditTransactions').doc();
    transaction.set(transactionRef, {
      businessId,
      type: 'CREDIT',
      amount: creditsToAdd,
      reason: 'STRIPE_PAYMENT',
      packageId,
      stripeSessionId: session.id,
      timestamp: FieldValue.serverTimestamp()
    });

    // Log payment record
    const paymentRef = db.collection('payments').doc();
    transaction.set(paymentRef, {
      businessId,
      method: 'STRIPE',
      amount: session.amount_total! / 100, // Convert from cents
      currency: session.currency,
      status: 'COMPLETED',
      stripeSessionId: session.id,
      packageId,
      creditsAwarded: creditsToAdd,
      timestamp: FieldValue.serverTimestamp()
    });
  });

  console.log(`Successfully processed payment for business ${businessId}: ${creditsToAdd} credits`);
}

async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  const { businessId } = paymentIntent.metadata!;

  // Log failed payment
  await db.collection('payments').add({
    businessId,
    method: 'STRIPE',
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency,
    status: 'FAILED',
    stripePaymentIntentId: paymentIntent.id,
    failureReason: paymentIntent.last_payment_error?.message || 'Unknown error',
    timestamp: FieldValue.serverTimestamp()
  });

  console.log(`Payment failed for business ${businessId}: ${paymentIntent.last_payment_error?.message}`);
}

// Process manual payment (bank transfer)
export const processManualPayment = functions.https.onCall(async (data, context) => {
  // Verify admin permissions
  if (!context.auth || !context.auth.token.ADMIN) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }

  const { businessId, packageId, amount, proofUrl, approved } = data;

  try {
    if (approved) {
      const package_ = CREDIT_PACKAGES[packageId as keyof typeof CREDIT_PACKAGES];
      if (!package_) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid package ID');
      }

      await db.runTransaction(async (transaction) => {
        const businessRef = db.collection('businesses').doc(businessId);
        
        // Update business credits
        transaction.update(businessRef, {
          availableCredits: FieldValue.increment(package_.credits),
          purchasedCredits: FieldValue.increment(package_.credits),
          updatedAt: FieldValue.serverTimestamp()
        });

        // Log credit transaction
        const transactionRef = db.collection('creditTransactions').doc();
        transaction.set(transactionRef, {
          businessId,
          type: 'CREDIT',
          amount: package_.credits,
          reason: 'MANUAL_PAYMENT_APPROVED',
          packageId,
          approvedBy: context.auth!.uid,
          timestamp: FieldValue.serverTimestamp()
        });

        // Log payment record
        const paymentRef = db.collection('payments').doc();
        transaction.set(paymentRef, {
          businessId,
          method: 'BANK_TRANSFER',
          amount,
          status: 'COMPLETED',
          packageId,
          creditsAwarded: package_.credits,
          proofUrl,
          approvedBy: context.auth!.uid,
          timestamp: FieldValue.serverTimestamp()
        });
      });
    } else {
      // Log rejected payment
      await db.collection('payments').add({
        businessId,
        method: 'BANK_TRANSFER',
        amount,
        status: 'REJECTED',
        packageId,
        proofUrl,
        rejectedBy: context.auth!.uid,
        timestamp: FieldValue.serverTimestamp()
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error processing manual payment:', error);
    throw new functions.https.HttpsError('internal', 'Failed to process payment');
  }
});