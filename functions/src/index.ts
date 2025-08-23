import { initializeApp } from 'firebase-admin/app';
import * as functions from 'firebase-functions';
import * as orderFunctions from './orders';
import * as paymentFunctions from './payments';
import * as authFunctions from './auth';
import * as notificationFunctions from './notifications';

// Initialize Firebase Admin
initializeApp();

// Export all functions
export const createOrderWithCredits = orderFunctions.createOrderWithCredits;
export const assignOrderToDriver = orderFunctions.assignOrderToDriver;
export const updateOrderStatus = orderFunctions.updateOrderStatus;
export const cancelOrder = orderFunctions.cancelOrder;

export const createStripeCheckoutSession = paymentFunctions.createStripeCheckoutSession;
export const handleStripeWebhook = paymentFunctions.handleStripeWebhook;
export const processManualPayment = paymentFunctions.processManualPayment;

export const setUserCustomClaims = authFunctions.setUserCustomClaims;
export const processUserRegistration = authFunctions.processUserRegistration;

export const sendOrderNotification = notificationFunctions.sendOrderNotification;
export const sendEmailNotification = notificationFunctions.sendEmailNotification;

// Health check function
export const healthCheck = functions.https.onRequest((req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});