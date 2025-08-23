import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';

const db = getFirestore();

// Create order with credits deduction
export const createOrderWithCredits = functions.https.onCall(async (data, context) => {
  // Verify user authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const {
    businessId,
    orderNumber,
    customerName,
    customerPhone,
    deliveryAddress,
    deliveryCoordinates,
    amountToCollect,
    paymentMethod,
    notes
  } = data;

  try {
    return await db.runTransaction(async (transaction) => {
      // Get business document
      const businessRef = db.collection('businesses').doc(businessId);
      const businessDoc = await transaction.get(businessRef);

      if (!businessDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Business not found');
      }

      const businessData = businessDoc.data()!;

      // Check available credits
      if (!businessData.availableCredits || businessData.availableCredits < 1) {
        throw new functions.https.HttpsError('failed-precondition', 'Insufficient credits');
      }

      // Create order document
      const orderRef = db.collection('orders').doc();
      const orderId = orderRef.id;

      const order = {
        id: orderId,
        orderNumber,
        businessId,
        status: 'created',
        businessName: businessData.businessName,
        businessPhone: businessData.phone,
        pickupAddress: businessData.location?.address || '',
        deliveryInfo: {
          customerName,
          customerPhone,
          location: {
            address: deliveryAddress,
            coordinates: deliveryCoordinates
          },
          amountToCollect: amountToCollect || 0,
          notes: notes || ''
        },
        paymentMethod,
        shipday: {},
        timeline: [{
          status: 'created',
          timestamp: FieldValue.serverTimestamp(),
          notes: 'Order created'
        }],
        createdAt: FieldValue.serverTimestamp(),
        orderDate: FieldValue.serverTimestamp()
      };

      // Create order
      transaction.set(orderRef, order);

      // Deduct credit from business
      transaction.update(businessRef, {
        availableCredits: FieldValue.increment(-1),
        usedCredits: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp()
      });

      // Log transaction
      const transactionRef = db.collection('creditTransactions').doc();
      transaction.set(transactionRef, {
        businessId,
        type: 'DEBIT',
        amount: 1,
        reason: 'ORDER_CREATED',
        orderId,
        timestamp: FieldValue.serverTimestamp()
      });

      return { success: true, orderId };
    });
  } catch (error) {
    console.error('Error creating order:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create order');
  }
});

// Assign order to driver
export const assignOrderToDriver = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { orderId, driverId } = data;

  try {
    const orderRef = db.collection('orders').doc(orderId);
    const driverRef = db.collection('drivers').doc(driverId);

    await db.runTransaction(async (transaction) => {
      const orderDoc = await transaction.get(orderRef);
      const driverDoc = await transaction.get(driverRef);

      if (!orderDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Order not found');
      }

      if (!driverDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Driver not found');
      }

      const orderData = orderDoc.data()!;
      
      if (orderData.status !== 'created') {
        throw new functions.https.HttpsError('failed-precondition', 'Order already assigned or completed');
      }

      // Update order
      transaction.update(orderRef, {
        driverId,
        status: 'assigned',
        assignedAt: FieldValue.serverTimestamp(),
        timeline: FieldValue.arrayUnion({
          status: 'assigned',
          timestamp: FieldValue.serverTimestamp(),
          notes: `Assigned to driver ${driverId}`
        })
      });

      // Update driver active orders count
      transaction.update(driverRef, {
        activeOrders: FieldValue.increment(1),
        totalAssignedOrders: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp()
      });
    });

    return { success: true };
  } catch (error) {
    console.error('Error assigning order:', error);
    throw new functions.https.HttpsError('internal', 'Failed to assign order');
  }
});

// Update order status
export const updateOrderStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { orderId, status, notes, location } = data;

  try {
    const orderRef = db.collection('orders').doc(orderId);
    
    await db.runTransaction(async (transaction) => {
      const orderDoc = await transaction.get(orderRef);
      
      if (!orderDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Order not found');
      }

      const updateData: any = {
        status,
        timeline: FieldValue.arrayUnion({
          status,
          timestamp: FieldValue.serverTimestamp(),
          notes: notes || '',
          location: location || null
        }),
        updatedAt: FieldValue.serverTimestamp()
      };

      if (status === 'delivered') {
        updateData.completedAt = FieldValue.serverTimestamp();
        
        // Update driver stats
        const orderData = orderDoc.data()!;
        if (orderData.driverId) {
          const driverRef = db.collection('drivers').doc(orderData.driverId);
          transaction.update(driverRef, {
            activeOrders: FieldValue.increment(-1),
            completedOrders: FieldValue.increment(1),
            updatedAt: FieldValue.serverTimestamp()
          });
        }
      }

      transaction.update(orderRef, updateData);
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update order status');
  }
});

// Cancel order
export const cancelOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { orderId, reason, refundCredit = false } = data;

  try {
    const orderRef = db.collection('orders').doc(orderId);

    await db.runTransaction(async (transaction) => {
      const orderDoc = await transaction.get(orderRef);
      
      if (!orderDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Order not found');
      }

      const orderData = orderDoc.data()!;

      if (['delivered', 'cancelled'].includes(orderData.status)) {
        throw new functions.https.HttpsError('failed-precondition', 'Order cannot be cancelled');
      }

      // Update order
      transaction.update(orderRef, {
        status: 'cancelled',
        cancelledAt: FieldValue.serverTimestamp(),
        cancelReason: reason,
        timeline: FieldValue.arrayUnion({
          status: 'cancelled',
          timestamp: FieldValue.serverTimestamp(),
          notes: reason || 'Order cancelled'
        })
      });

      // Refund credit if requested
      if (refundCredit) {
        const businessRef = db.collection('businesses').doc(orderData.businessId);
        transaction.update(businessRef, {
          availableCredits: FieldValue.increment(1),
          usedCredits: FieldValue.increment(-1),
          updatedAt: FieldValue.serverTimestamp()
        });

        // Log refund transaction
        const transactionRef = db.collection('creditTransactions').doc();
        transaction.set(transactionRef, {
          businessId: orderData.businessId,
          type: 'CREDIT',
          amount: 1,
          reason: 'ORDER_CANCELLED_REFUND',
          orderId,
          timestamp: FieldValue.serverTimestamp()
        });
      }

      // Update driver stats if assigned
      if (orderData.driverId) {
        const driverRef = db.collection('drivers').doc(orderData.driverId);
        transaction.update(driverRef, {
          activeOrders: FieldValue.increment(-1),
          updatedAt: FieldValue.serverTimestamp()
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw new functions.https.HttpsError('internal', 'Failed to cancel order');
  }
});