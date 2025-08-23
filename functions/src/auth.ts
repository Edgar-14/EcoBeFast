import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';

const auth = getAuth();
const db = getFirestore();

// Set custom claims for user roles
export const setUserCustomClaims = functions.https.onCall(async (data, context) => {
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
      timestamp: FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error setting custom claims:', error);
    throw new functions.https.HttpsError('internal', 'Failed to set custom claims');
  }
});

// Process user registration (triggered by Firestore write)
export const processUserRegistration = functions.firestore
  .document('userRegistrations/{registrationId}')
  .onCreate(async (snap, context) => {
    const registrationData = snap.data();
    const { uid, userType, email } = registrationData;

    try {
      let customClaims: Record<string, boolean> = {};
      let collectionName = '';
      let profileData: any = {
        uid,
        email,
        status: 'pending',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };

      switch (userType) {
        case 'business':
          customClaims = { BUSINESS: true };
          collectionName = 'businesses';
          profileData = {
            ...profileData,
            businessName: registrationData.businessName,
            phone: registrationData.phone,
            location: registrationData.location,
            businessType: registrationData.businessType,
            availableCredits: 5, // Welcome bonus
            usedCredits: 0,
            purchasedCredits: 5,
            status: 'active' // Auto-approve businesses
          };
          break;

        case 'driver':
          customClaims = { DRIVER: true };
          collectionName = 'drivers';
          profileData = {
            ...profileData,
            personalInfo: registrationData.personalInfo,
            vehicleInfo: registrationData.vehicleInfo,
            bankInfo: registrationData.bankInfo,
            documents: registrationData.documents,
            status: 'pending', // Drivers need approval
            activeOrders: 0,
            completedOrders: 0,
            totalEarnings: 0
          };
          break;

        case 'admin':
          customClaims = { ADMIN: true };
          collectionName = 'admins';
          profileData = {
            ...profileData,
            name: registrationData.name,
            role: registrationData.role || 'ADMIN',
            permissions: registrationData.permissions || []
          };
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
          timestamp: FieldValue.serverTimestamp()
        });
      }

      console.log(`Successfully processed ${userType} registration for user ${uid}`);
    } catch (error) {
      console.error('Error processing user registration:', error);
      
      // Update registration status to failed
      await snap.ref.update({
        status: 'failed',
        error: (error as Error).message,
        updatedAt: FieldValue.serverTimestamp()
      });
    }
  });

// Approve driver application
export const approveDriverApplication = functions.https.onCall(async (data, context) => {
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

    const updateData: any = {
      status: approved ? 'active' : 'rejected',
      reviewedAt: FieldValue.serverTimestamp(),
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
      timestamp: FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error processing driver application:', error);
    throw new functions.https.HttpsError('internal', 'Failed to process driver application');
  }
});

// Update user status (suspend, activate, etc.)
export const updateUserStatus = functions.https.onCall(async (data, context) => {
  // Verify admin permissions
  if (!context.auth || !context.auth.token.ADMIN) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }

  const { userId, userType, status, reason } = data;

  try {
    const collectionMap: Record<string, string> = {
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
      statusUpdatedAt: FieldValue.serverTimestamp(),
      statusUpdatedBy: context.auth.uid
    });

    // Disable Firebase Auth if suspended
    if (status === 'suspended') {
      await auth.updateUser(userId, { disabled: true });
    } else if (status === 'active') {
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
      timestamp: FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating user status:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update user status');
  }
});