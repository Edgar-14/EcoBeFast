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
exports.updateUserStatus = exports.approveDriverApplication = exports.processUserRegistration = exports.setUserCustomClaims = void 0;
const auth_1 = require("firebase-admin/auth");
const firestore_1 = require("firebase-admin/firestore");
const functions = __importStar(require("firebase-functions"));
const auth = (0, auth_1.getAuth)();
const db = (0, firestore_1.getFirestore)();
// Set custom claims for user roles
exports.setUserCustomClaims = functions.https.onCall(async (data, context) => {
    // Verify admin permissions
    if (!context.auth || !context.auth.token.SUPER_ADMIN) {
        throw new functions.https.HttpsError('permission-denied', 'Super admin access required');
    }
    const { uid, customClaims } = data;
    try {
        await auth.setCustomUserClaims(uid, customClaims);
        // Log the action
        await db.collection('adminActions').add({
            action: 'SET_CUSTOM_CLAIMS',
            targetUserId: uid,
            customClaims,
            performedBy: context.auth.uid,
            timestamp: firestore_1.FieldValue.serverTimestamp()
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error setting custom claims:', error);
        throw new functions.https.HttpsError('internal', 'Failed to set custom claims');
    }
});
// Process user registration (triggered by Firestore write)
exports.processUserRegistration = functions.firestore
    .document('userRegistrations/{registrationId}')
    .onCreate(async (snap, context) => {
    const registrationData = snap.data();
    const { uid, userType, email } = registrationData;
    try {
        let customClaims = {};
        let collectionName = '';
        let profileData = {
            uid,
            email,
            status: 'pending',
            createdAt: firestore_1.FieldValue.serverTimestamp(),
            updatedAt: firestore_1.FieldValue.serverTimestamp()
        };
        switch (userType) {
            case 'business':
                customClaims = { BUSINESS: true };
                collectionName = 'businesses';
                profileData = Object.assign(Object.assign({}, profileData), { businessName: registrationData.businessName, phone: registrationData.phone, location: registrationData.location, businessType: registrationData.businessType, availableCredits: 5, usedCredits: 0, purchasedCredits: 5, status: 'active' // Auto-approve businesses
                 });
                break;
            case 'driver':
                customClaims = { DRIVER: true };
                collectionName = 'drivers';
                profileData = Object.assign(Object.assign({}, profileData), { personalInfo: registrationData.personalInfo, vehicleInfo: registrationData.vehicleInfo, bankInfo: registrationData.bankInfo, documents: registrationData.documents, status: 'pending', activeOrders: 0, completedOrders: 0, totalEarnings: 0 });
                break;
            case 'admin':
                customClaims = { ADMIN: true };
                collectionName = 'admins';
                profileData = Object.assign(Object.assign({}, profileData), { name: registrationData.name, role: registrationData.role || 'ADMIN', permissions: registrationData.permissions || [] });
                break;
            default:
                throw new Error(`Unknown user type: ${userType}`);
        }
        // Set custom claims
        await auth.setCustomUserClaims(uid, customClaims);
        // Create profile document
        await db.collection(collectionName).doc(uid).set(profileData);
        // Welcome credit transaction for businesses
        if (userType === 'business') {
            await db.collection('creditTransactions').add({
                businessId: uid,
                type: 'CREDIT',
                amount: 5,
                reason: 'WELCOME_BONUS',
                timestamp: firestore_1.FieldValue.serverTimestamp()
            });
        }
        console.log(`Successfully processed ${userType} registration for user ${uid}`);
    }
    catch (error) {
        console.error('Error processing user registration:', error);
        // Update registration status to failed
        await snap.ref.update({
            status: 'failed',
            error: error.message,
            updatedAt: firestore_1.FieldValue.serverTimestamp()
        });
    }
});
// Approve driver application
exports.approveDriverApplication = functions.https.onCall(async (data, context) => {
    // Verify admin permissions
    if (!context.auth || !context.auth.token.ADMIN) {
        throw new functions.https.HttpsError('permission-denied', 'Admin access required');
    }
    const { driverId, approved, rejectionReason } = data;
    try {
        const driverRef = db.collection('drivers').doc(driverId);
        const driverDoc = await driverRef.get();
        if (!driverDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Driver not found');
        }
        const updateData = {
            status: approved ? 'active' : 'rejected',
            reviewedAt: firestore_1.FieldValue.serverTimestamp(),
            reviewedBy: context.auth.uid
        };
        if (!approved && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }
        await driverRef.update(updateData);
        // Log admin action
        await db.collection('adminActions').add({
            action: approved ? 'APPROVE_DRIVER' : 'REJECT_DRIVER',
            targetUserId: driverId,
            reason: rejectionReason || '',
            performedBy: context.auth.uid,
            timestamp: firestore_1.FieldValue.serverTimestamp()
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error processing driver application:', error);
        throw new functions.https.HttpsError('internal', 'Failed to process driver application');
    }
});
// Update user status (suspend, activate, etc.)
exports.updateUserStatus = functions.https.onCall(async (data, context) => {
    // Verify admin permissions
    if (!context.auth || !context.auth.token.ADMIN) {
        throw new functions.https.HttpsError('permission-denied', 'Admin access required');
    }
    const { userId, userType, status, reason } = data;
    try {
        const collectionMap = {
            business: 'businesses',
            driver: 'drivers',
            admin: 'admins'
        };
        const collection = collectionMap[userType];
        if (!collection) {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid user type');
        }
        await db.collection(collection).doc(userId).update({
            status,
            statusReason: reason || '',
            statusUpdatedAt: firestore_1.FieldValue.serverTimestamp(),
            statusUpdatedBy: context.auth.uid
        });
        // Disable Firebase Auth if suspended
        if (status === 'suspended') {
            await auth.updateUser(userId, { disabled: true });
        }
        else if (status === 'active') {
            await auth.updateUser(userId, { disabled: false });
        }
        // Log admin action
        await db.collection('adminActions').add({
            action: 'UPDATE_USER_STATUS',
            targetUserId: userId,
            userType,
            newStatus: status,
            reason: reason || '',
            performedBy: context.auth.uid,
            timestamp: firestore_1.FieldValue.serverTimestamp()
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error updating user status:', error);
        throw new functions.https.HttpsError('internal', 'Failed to update user status');
    }
});
//# sourceMappingURL=auth.js.map