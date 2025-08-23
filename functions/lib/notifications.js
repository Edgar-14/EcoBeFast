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
exports.onOrderStatusChange = exports.sendEmailNotification = exports.sendOrderNotification = void 0;
const firestore_1 = require("firebase-admin/firestore");
const functions = __importStar(require("firebase-functions"));
const nodemailer = __importStar(require("nodemailer"));
const db = (0, firestore_1.getFirestore)();
// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: functions.config().gmail.user,
        pass: functions.config().gmail.password
    }
});
// Send order notification
exports.sendOrderNotification = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { orderId, type, recipientId, message } = data;
    try {
        // Get order details
        const orderDoc = await db.collection('orders').doc(orderId).get();
        if (!orderDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Order not found');
        }
        const orderData = orderDoc.data();
        // Create notification record
        await db.collection('notifications').add({
            orderId,
            type,
            recipientId,
            message,
            orderNumber: orderData.orderNumber,
            status: orderData.status,
            read: false,
            createdAt: firestore_1.FieldValue.serverTimestamp()
        });
        // Send email notification if configured
        if (type === 'order_assigned' || type === 'order_completed') {
            await sendEmailForOrderUpdate(orderData, type, recipientId);
        }
        return { success: true };
    }
    catch (error) {
        console.error('Error sending notification:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send notification');
    }
});
// Send email notification
exports.sendEmailNotification = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { to, subject, template, templateData } = data;
    try {
        const htmlContent = generateEmailTemplate(template, templateData);
        const mailOptions = {
            from: 'BeFast <soporte@befastapp.com.mx>',
            to,
            subject,
            html: htmlContent
        };
        await transporter.sendMail(mailOptions);
        // Log email sent
        await db.collection('emailLogs').add({
            to,
            subject,
            template,
            status: 'sent',
            sentAt: firestore_1.FieldValue.serverTimestamp()
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error sending email:', error);
        // Log email error
        await db.collection('emailLogs').add({
            to,
            subject,
            template,
            status: 'failed',
            error: error.message,
            sentAt: firestore_1.FieldValue.serverTimestamp()
        });
        throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
});
async function sendEmailForOrderUpdate(orderData, type, recipientId) {
    try {
        let recipient;
        let subject;
        let template;
        if (type === 'order_assigned') {
            // Send to driver
            const driverDoc = await db.collection('drivers').doc(recipientId).get();
            if (!driverDoc.exists)
                return;
            recipient = driverDoc.data();
            subject = `Nueva orden asignada - ${orderData.orderNumber}`;
            template = 'order_assigned';
        }
        else if (type === 'order_completed') {
            // Send to business
            const businessDoc = await db.collection('businesses').doc(orderData.businessId).get();
            if (!businessDoc.exists)
                return;
            recipient = businessDoc.data();
            subject = `Orden completada - ${orderData.orderNumber}`;
            template = 'order_completed';
        }
        else {
            return;
        }
        const htmlContent = generateEmailTemplate(template, {
            orderData,
            recipient
        });
        const mailOptions = {
            from: 'BeFast <soporte@befastapp.com.mx>',
            to: recipient.email,
            subject,
            html: htmlContent
        };
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error('Error sending order email:', error);
    }
}
function generateEmailTemplate(template, data) {
    var _a;
    switch (template) {
        case 'order_assigned':
            return `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2D5AA0;">Nueva Orden Asignada</h2>
              <p>Hola ${((_a = data.recipient.personalInfo) === null || _a === void 0 ? void 0 : _a.fullName) || 'Repartidor'},</p>
              <p>Se te ha asignado una nueva orden:</p>
              
              <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <h3>Detalles de la Orden</h3>
                <p><strong>Número:</strong> ${data.orderData.orderNumber}</p>
                <p><strong>Recoger en:</strong> ${data.orderData.pickupAddress}</p>
                <p><strong>Entregar a:</strong> ${data.orderData.deliveryInfo.customerName}</p>
                <p><strong>Dirección:</strong> ${data.orderData.deliveryInfo.location.address}</p>
                <p><strong>Teléfono:</strong> ${data.orderData.deliveryInfo.customerPhone}</p>
                ${data.orderData.deliveryInfo.amountToCollect > 0 ?
                `<p><strong>Monto a cobrar:</strong> $${data.orderData.deliveryInfo.amountToCollect}</p>` :
                ''}
                ${data.orderData.deliveryInfo.notes ?
                `<p><strong>Notas:</strong> ${data.orderData.deliveryInfo.notes}</p>` :
                ''}
              </div>
              
              <p>Por favor, dirígete al punto de recolección y actualiza el estado de la orden en la app.</p>
              
              <p>Saludos,<br>El equipo de BeFast</p>
            </div>
          </body>
        </html>
      `;
        case 'order_completed':
            return `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2D5AA0;">Orden Completada</h2>
              <p>Hola ${data.recipient.businessName},</p>
              <p>Tu orden ha sido entregada exitosamente:</p>
              
              <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <h3>Detalles de la Entrega</h3>
                <p><strong>Número:</strong> ${data.orderData.orderNumber}</p>
                <p><strong>Cliente:</strong> ${data.orderData.deliveryInfo.customerName}</p>
                <p><strong>Dirección:</strong> ${data.orderData.deliveryInfo.location.address}</p>
                <p><strong>Completada:</strong> ${new Date().toLocaleString('es-MX')}</p>
              </div>
              
              <p>Gracias por usar BeFast para tus entregas.</p>
              
              <p>Saludos,<br>El equipo de BeFast</p>
            </div>
          </body>
        </html>
      `;
        case 'welcome_business':
            return `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2D5AA0;">¡Bienvenido a BeFast!</h2>
              <p>Hola ${data.businessName},</p>
              <p>Gracias por registrarte en BeFast. Tu cuenta ha sido activada exitosamente.</p>
              
              <div style="background: #e8f5e8; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <h3>🎁 Bono de Bienvenida</h3>
                <p>Hemos agregado <strong>5 créditos gratuitos</strong> a tu cuenta para que puedas comenzar a usar nuestro servicio.</p>
              </div>
              
              <p>Ya puedes comenzar a crear órdenes de entrega desde tu dashboard.</p>
              
              <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
              
              <p>Saludos,<br>El equipo de BeFast</p>
            </div>
          </body>
        </html>
      `;
        default:
            return `
        <html>
          <body>
            <p>${data.message || 'Notification from BeFast'}</p>
          </body>
        </html>
      `;
    }
}
// Automatic notifications on order status changes
exports.onOrderStatusChange = functions.firestore
    .document('orders/{orderId}')
    .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    // Only process if status changed
    if (before.status === after.status) {
        return;
    }
    const orderId = context.params.orderId;
    try {
        switch (after.status) {
            case 'assigned':
                if (after.driverId) {
                    await db.collection('notifications').add({
                        orderId,
                        type: 'order_assigned',
                        recipientId: after.driverId,
                        message: `Nueva orden asignada: ${after.orderNumber}`,
                        orderNumber: after.orderNumber,
                        status: after.status,
                        read: false,
                        createdAt: firestore_1.FieldValue.serverTimestamp()
                    });
                }
                break;
            case 'delivered':
                await db.collection('notifications').add({
                    orderId,
                    type: 'order_completed',
                    recipientId: after.businessId,
                    message: `Orden completada: ${after.orderNumber}`,
                    orderNumber: after.orderNumber,
                    status: after.status,
                    read: false,
                    createdAt: firestore_1.FieldValue.serverTimestamp()
                });
                break;
        }
    }
    catch (error) {
        console.error('Error sending automatic notification:', error);
    }
});
//# sourceMappingURL=notifications.js.map