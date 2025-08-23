"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processManualPayment = exports.handleStripeWebhook = exports.createStripeCheckoutSession = void 0;
const firestore_1 = require("firebase-admin/firestore");
const functions = __importStar(require("firebase-functions"));
const stripe_1 = __importDefault(require("stripe"));
const db = (0, firestore_1.getFirestore)();
const stripe = new stripe_1.default(functions.config().stripe.secret_key, {
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
exports.createStripeCheckoutSession = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { businessId, packageId } = data;
    const package_ = CREDIT_PACKAGES[packageId];
    if (!package_) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid package ID');
    }
    try {
        // Get business data
        const businessDoc = await db.collection('businesses').doc(businessId).get();
        if (!businessDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Business not found');
        }
        const businessData = businessDoc.data();
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
    }
    catch (error) {
        console.error('Error creating Stripe session:', error);
        throw new functions.https.HttpsError('internal', 'Failed to create payment session');
    }
});
// Handle Stripe webhook
exports.handleStripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = functions.config().stripe.webhook_secret;
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    }
    catch (err) {
        console.error('Webhook signature verification failed:', err);
        res.status(400).send(`Webhook Error: ${err}`);
        return;
    }
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleSuccessfulPayment(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await handleFailedPayment(event.data.object);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        res.json({ received: true });
    }
    catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).send('Webhook handler failed');
    }
});
async function handleSuccessfulPayment(session) {
    const { businessId, packageId, credits } = session.metadata;
    const creditsToAdd = parseInt(credits);
    await db.runTransaction(async (transaction) => {
        const businessRef = db.collection('businesses').doc(businessId);
        const businessDoc = await transaction.get(businessRef);
        if (!businessDoc.exists) {
            throw new Error('Business not found');
        }
        // Update business credits
        transaction.update(businessRef, {
            availableCredits: firestore_1.FieldValue.increment(creditsToAdd),
            purchasedCredits: firestore_1.FieldValue.increment(creditsToAdd),
            updatedAt: firestore_1.FieldValue.serverTimestamp()
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
            timestamp: firestore_1.FieldValue.serverTimestamp()
        });
        // Log payment record
        const paymentRef = db.collection('payments').doc();
        transaction.set(paymentRef, {
            businessId,
            method: 'STRIPE',
            amount: session.amount_total / 100, // Convert from cents
            currency: session.currency,
            status: 'COMPLETED',
            stripeSessionId: session.id,
            packageId,
            creditsAwarded: creditsToAdd,
            timestamp: firestore_1.FieldValue.serverTimestamp()
        });
    });
    console.log(`Successfully processed payment for business ${businessId}: ${creditsToAdd} credits`);
}
async function handleFailedPayment(paymentIntent) {
    var _a, _b;
    const { businessId } = paymentIntent.metadata;
    // Log failed payment
    await db.collection('payments').add({
        businessId,
        method: 'STRIPE',
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: 'FAILED',
        stripePaymentIntentId: paymentIntent.id,
        failureReason: ((_a = paymentIntent.last_payment_error) === null || _a === void 0 ? void 0 : _a.message) || 'Unknown error',
        timestamp: firestore_1.FieldValue.serverTimestamp()
    });
    console.log(`Payment failed for business ${businessId}: ${(_b = paymentIntent.last_payment_error) === null || _b === void 0 ? void 0 : _b.message}`);
}
// Process manual payment (bank transfer)
exports.processManualPayment = functions.https.onCall(async (data, context) => {
    // Verify admin permissions
    if (!context.auth || !context.auth.token.ADMIN) {
        throw new functions.https.HttpsError('permission-denied', 'Admin access required');
    }
    const { businessId, packageId, amount, proofUrl, approved } = data;
    try {
        if (approved) {
            const package_ = CREDIT_PACKAGES[packageId];
            if (!package_) {
                throw new functions.https.HttpsError('invalid-argument', 'Invalid package ID');
            }
            await db.runTransaction(async (transaction) => {
                const businessRef = db.collection('businesses').doc(businessId);
                // Update business credits
                transaction.update(businessRef, {
                    availableCredits: firestore_1.FieldValue.increment(package_.credits),
                    purchasedCredits: firestore_1.FieldValue.increment(package_.credits),
                    updatedAt: firestore_1.FieldValue.serverTimestamp()
                });
                // Log credit transaction
                const transactionRef = db.collection('creditTransactions').doc();
                transaction.set(transactionRef, {
                    businessId,
                    type: 'CREDIT',
                    amount: package_.credits,
                    reason: 'MANUAL_PAYMENT_APPROVED',
                    packageId,
                    approvedBy: context.auth.uid,
                    timestamp: firestore_1.FieldValue.serverTimestamp()
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
                    approvedBy: context.auth.uid,
                    timestamp: firestore_1.FieldValue.serverTimestamp()
                });
            });
        }
        else {
            // Log rejected payment
            await db.collection('payments').add({
                businessId,
                method: 'BANK_TRANSFER',
                amount,
                status: 'REJECTED',
                packageId,
                proofUrl,
                rejectedBy: context.auth.uid,
                timestamp: firestore_1.FieldValue.serverTimestamp()
            });
        }
        return { success: true };
    }
    catch (error) {
        console.error('Error processing manual payment:', error);
        throw new functions.https.HttpsError('internal', 'Failed to process payment');
    }
});
//# sourceMappingURL=payments.js.map