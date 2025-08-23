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
exports.healthCheck = exports.sendEmailNotification = exports.sendOrderNotification = exports.processUserRegistration = exports.setUserCustomClaims = exports.processManualPayment = exports.handleStripeWebhook = exports.createStripeCheckoutSession = exports.cancelOrder = exports.updateOrderStatus = exports.assignOrderToDriver = exports.createOrderWithCredits = void 0;
const app_1 = require("firebase-admin/app");
const functions = __importStar(require("firebase-functions"));
const orderFunctions = __importStar(require("./orders"));
const paymentFunctions = __importStar(require("./payments"));
const authFunctions = __importStar(require("./auth"));
const notificationFunctions = __importStar(require("./notifications"));
// Initialize Firebase Admin
(0, app_1.initializeApp)();
// Export all functions
exports.createOrderWithCredits = orderFunctions.createOrderWithCredits;
exports.assignOrderToDriver = orderFunctions.assignOrderToDriver;
exports.updateOrderStatus = orderFunctions.updateOrderStatus;
exports.cancelOrder = orderFunctions.cancelOrder;
exports.createStripeCheckoutSession = paymentFunctions.createStripeCheckoutSession;
exports.handleStripeWebhook = paymentFunctions.handleStripeWebhook;
exports.processManualPayment = paymentFunctions.processManualPayment;
exports.setUserCustomClaims = authFunctions.setUserCustomClaims;
exports.processUserRegistration = authFunctions.processUserRegistration;
exports.sendOrderNotification = notificationFunctions.sendOrderNotification;
exports.sendEmailNotification = notificationFunctions.sendEmailNotification;
// Health check function
exports.healthCheck = functions.https.onRequest((req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
//# sourceMappingURL=index.js.map