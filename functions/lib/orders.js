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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.updateOrderStatus = exports.assignOrderToDriver = exports.createOrderWithCredits = void 0;
const firestore_1 = require("firebase-admin/firestore");
const functions = __importStar(require("firebase-functions"));
const db = (0, firestore_1.getFirestore)();
// Create order with credits deduction
exports.createOrderWithCredits = functions.https.onCall(async (data, context) => {
    // Verify user authentication
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { businessId, orderNumber, customerName, customerPhone, deliveryAddress, deliveryCoordinates, amountToCollect, paymentMethod, notes } = data;
    try {
        return await db.runTransaction(async (transaction) => {
            var _a;
            // Get business document
            const businessRef = db.collection('businesses').doc(businessId);
            const businessDoc = await transaction.get(businessRef);
            if (!businessDoc.exists) {
                throw new functions.https.HttpsError('not-found', 'Business not found');
            }
            const businessData = businessDoc.data();
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
                pickupAddress: ((_a = businessData.location) === null || _a === void 0 ? void 0 : _a.address) || '',
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
                        timestamp: firestore_1.FieldValue.serverTimestamp(),
                        notes: 'Order created'
                    }],
                createdAt: firestore_1.FieldValue.serverTimestamp(),
                orderDate: firestore_1.FieldValue.serverTimestamp()
            };
            // Create order
            transaction.set(orderRef, order);
            // Deduct credit from business
            transaction.update(businessRef, {
                availableCredits: firestore_1.FieldValue.increment(-1),
                usedCredits: firestore_1.FieldValue.increment(1),
                updatedAt: firestore_1.FieldValue.serverTimestamp()
            });
            // Log transaction
            const transactionRef = db.collection('creditTransactions').doc();
            transaction.set(transactionRef, {
                businessId,
                type: 'DEBIT',
                amount: 1,
                reason: 'ORDER_CREATED',
                orderId,
                timestamp: firestore_1.FieldValue.serverTimestamp()
            });
            return { success: true, orderId };
        });
    }
    catch (error) {
        console.error('Error creating order:', error);
        throw new functions.https.HttpsError('internal', 'Failed to create order');
    }
});
// Assign order to driver
exports.assignOrderToDriver = functions.https.onCall(async (data, context) => {
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
            const orderData = orderDoc.data();
            if (orderData.status !== 'created') {
                throw new functions.https.HttpsError('failed-precondition', 'Order already assigned or completed');
            }
            // Update order
            transaction.update(orderRef, {
                driverId,
                status: 'assigned',
                assignedAt: firestore_1.FieldValue.serverTimestamp(),
                timeline: firestore_1.FieldValue.arrayUnion({
                    status: 'assigned',
                    timestamp: firestore_1.FieldValue.serverTimestamp(),
                    notes: `Assigned to driver ${driverId}`
                })
            });
            // Update driver active orders count
            transaction.update(driverRef, {
                activeOrders: firestore_1.FieldValue.increment(1),
                totalAssignedOrders: firestore_1.FieldValue.increment(1),
                updatedAt: firestore_1.FieldValue.serverTimestamp()
            });
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error assigning order:', error);
        throw new functions.https.HttpsError('internal', 'Failed to assign order');
    }
});
// Update order status
exports.updateOrderStatus = functions.https.onCall(async (data, context) => {
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
            const updateData = {
                status,
                timeline: firestore_1.FieldValue.arrayUnion({
                    status,
                    timestamp: firestore_1.FieldValue.serverTimestamp(),
                    notes: notes || '',
                    location: location || null
                }),
                updatedAt: firestore_1.FieldValue.serverTimestamp()
            };
            if (status === 'delivered') {
                updateData.completedAt = firestore_1.FieldValue.serverTimestamp();
                // Update driver stats
                const orderData = orderDoc.data();
                if (orderData.driverId) {
                    const driverRef = db.collection('drivers').doc(orderData.driverId);
                    transaction.update(driverRef, {
                        activeOrders: firestore_1.FieldValue.increment(-1),
                        completedOrders: firestore_1.FieldValue.increment(1),
                        updatedAt: firestore_1.FieldValue.serverTimestamp()
                    });
                }
            }
            transaction.update(orderRef, updateData);
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error updating order status:', error);
        throw new functions.https.HttpsError('internal', 'Failed to update order status');
    }
});
// Cancel order
exports.cancelOrder = functions.https.onCall(async (data, context) => {
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
            const orderData = orderDoc.data();
            if (['delivered', 'cancelled'].includes(orderData.status)) {
                throw new functions.https.HttpsError('failed-precondition', 'Order cannot be cancelled');
            }
            // Update order
            transaction.update(orderRef, {
                status: 'cancelled',
                cancelledAt: firestore_1.FieldValue.serverTimestamp(),
                cancelReason: reason,
                timeline: firestore_1.FieldValue.arrayUnion({
                    status: 'cancelled',
                    timestamp: firestore_1.FieldValue.serverTimestamp(),
                    notes: reason || 'Order cancelled'
                })
            });
            // Refund credit if requested
            if (refundCredit) {
                const businessRef = db.collection('businesses').doc(orderData.businessId);
                transaction.update(businessRef, {
                    availableCredits: firestore_1.FieldValue.increment(1),
                    usedCredits: firestore_1.FieldValue.increment(-1),
                    updatedAt: firestore_1.FieldValue.serverTimestamp()
                });
                // Log refund transaction
                const transactionRef = db.collection('creditTransactions').doc();
                transaction.set(transactionRef, {
                    businessId: orderData.businessId,
                    type: 'CREDIT',
                    amount: 1,
                    reason: 'ORDER_CANCELLED_REFUND',
                    orderId,
                    timestamp: firestore_1.FieldValue.serverTimestamp()
                });
            }
            // Update driver stats if assigned
            if (orderData.driverId) {
                const driverRef = db.collection('drivers').doc(orderData.driverId);
                transaction.update(driverRef, {
                    activeOrders: firestore_1.FieldValue.increment(-1),
                    updatedAt: firestore_1.FieldValue.serverTimestamp()
                });
            }
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error cancelling order:', error);
        throw new functions.https.HttpsError('internal', 'Failed to cancel order');
    }
});
//# sourceMappingURL=orders.js.map