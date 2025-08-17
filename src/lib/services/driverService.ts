import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '@/lib/firebase/config';
import { Driver, DriverApplication, DebtPayment } from '@/lib/types';
import { generateApplicationId } from '@/lib/utils/helpers';

export class DriverService {
  // Submit driver application
  static async submitApplication(
    applicationData: Omit<DriverApplication, 'id' | 'status' | 'submissionDate'>
  ): Promise<{ success: boolean; applicationId: string }> {
    try {
      const applicationId = generateApplicationId();

      const docRef = doc(db, 'driverApplications', applicationId);
      await setDoc(docRef, {
        ...applicationData,
        id: applicationId,
        status: 'pending_review',
        submissionDate: serverTimestamp()
      });

      // Notify administrators
      const notifyFunction = httpsCallable(functions, 'notifyNewDriverApplication');
      await notifyFunction({ applicationId });

      return { success: true, applicationId };
    } catch (error) {
      console.error('Error submitting driver application:', error);
      throw error;
    }
  }

  // Get application status
  static async getApplicationStatus(email: string): Promise<{
    status: string;
    applicationId?: string;
    submissionDate?: Date;
    reviewedAt?: Date;
    rejectionReason?: string;
  } | null> {
    try {
      const applicationsRef = collection(db, 'driverApplications');
      const q = query(
        applicationsRef,
        where('personalInfo.email', '==', email),
        orderBy('submissionDate', 'desc')
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();

        return {
          status: data.status,
          applicationId: doc.id,
          submissionDate: data.submissionDate?.toDate(),
          reviewedAt: data.reviewedAt?.toDate(),
          rejectionReason: data.rejectionReason
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting application status:', error);
      throw error;
    }
  }

  // Get driver profile
  static async getProfile(driverId: string): Promise<Driver | null> {
    try {
      const docRef = doc(db, 'drivers', driverId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Driver;
      }
      return null;
    } catch (error) {
      console.error('Error getting driver profile:', error);
      throw error;
    }
  }

  // Update driver profile
  static async updateProfile(
    driverId: string,
    data: Partial<Driver>
  ): Promise<void> {
    try {
      const docRef = doc(db, 'drivers', driverId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating driver profile:', error);
      throw error;
    }
  }

  // Get driver orders
  static async getOrders(
    driverId: string,
    limit: number = 25
  ): Promise<any[]> {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('driverId', '==', driverId),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting driver orders:', error);
      throw error;
    }
  }

  // Get wallet transactions
  static async getWalletTransactions(
    driverId: string,
    limit: number = 50
  ): Promise<any[]> {
    try {
      const transactionsRef = collection(db, 'walletTransactions');
      const q = query(
        transactionsRef,
        where('driverId', '==', driverId),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting wallet transactions:', error);
      throw error;
    }
  }

  // Submit debt payment
  static async submitDebtPayment(
    driverId: string,
    paymentData: {
      amountPaid: number;
      proofOfPayment: File;
    }
  ): Promise<void> {
    try {
      // Upload proof of payment
      const uploadFunction = httpsCallable(functions, 'uploadDebtPaymentProof');
      const uploadResult = await uploadFunction({
        file: paymentData.proofOfPayment,
        driverId
      });

      const { downloadURL } = uploadResult.data as { downloadURL: string };

      // Create debt payment request
      const paymentRef = doc(collection(db, 'debtPayments'));
      await setDoc(paymentRef, {
        driverId,
        amountPaid: paymentData.amountPaid,
        proofUrl: downloadURL,
        status: 'pending',
        requestDate: serverTimestamp()
      });

      // Notify administrators
      const notifyFunction = httpsCallable(functions, 'notifyDebtPayment');
      await notifyFunction({
        driverId,
        paymentId: paymentRef.id,
        amount: paymentData.amountPaid
      });
    } catch (error) {
      console.error('Error submitting debt payment:', error);
      throw error;
    }
  }

  // Get debt payments
  static async getDebtPayments(driverId: string): Promise<DebtPayment[]> {
    try {
      const paymentsRef = collection(db, 'debtPayments');
      const q = query(
        paymentsRef,
        where('driverId', '==', driverId),
        orderBy('requestDate', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DebtPayment[];
    } catch (error) {
      console.error('Error getting debt payments:', error);
      throw error;
    }
  }

  // Update documents
  static async updateDocuments(
    driverId: string,
    documents: { [key: string]: File }
  ): Promise<void> {
    try {
      const uploadFunction = httpsCallable(functions, 'uploadDriverDocuments');

      const result = await uploadFunction({
        driverId,
        documents
      });

      const { documentUrls } = result.data as { documentUrls: { [key: string]: string } };

      // Update driver profile with new document URLs
      await this.updateProfile(driverId, {
        documents: documentUrls,
        documentsUpdatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating documents:', error);
      throw error;
    }
  }

  // Get driver statistics
  static async getStatistics(driverId: string): Promise<{
    totalOrders: number;
    completedOrders: number;
    totalEarnings: number;
    currentBalance: number;
    averageRating: number;
    onTimeRate: number;
    acceptanceRate: number;
  }> {
    try {
      const getStatsFunction = httpsCallable(functions, 'getDriverStatistics');

      const result = await getStatsFunction({ driverId });
      return result.data as any;
    } catch (error) {
      console.error('Error getting driver statistics:', error);
      throw error;
    }
  }

  // Submit emergency alert
  static async submitEmergencyAlert(
    driverId: string,
    emergencyData: {
      type: string;
      location: { lat: number; lng: number };
      description: string;
      currentOrderId?: string;
    }
  ): Promise<{ success: boolean; emergencyId: string }> {
    try {
      const emergencyFunction = httpsCallable(functions, 'handleEmergencyAlert');

      const result = await emergencyFunction({
        driverId,
        ...emergencyData
      });

      return result.data as { success: boolean; emergencyId: string };
    } catch (error) {
      console.error('Error submitting emergency alert:', error);
      throw error;
    }
  }

  // Get payroll records
  static async getPayrollRecords(
    driverId: string,
    year?: number
  ): Promise<any[]> {
    try {
      const payrollRef = collection(db, 'payrollRecords');
      let q = query(
        payrollRef,
        where('driverId', '==', driverId),
        orderBy('periodMonth', 'desc')
      );

      if (year) {
        const startDate = Timestamp.fromDate(new Date(year, 0, 1));
        const endDate = Timestamp.fromDate(new Date(year + 1, 0, 1));
        q = query(
          payrollRef,
          where('driverId', '==', driverId),
          where('periodStart', '>=', startDate),
          where('periodStart', '<', endDate),
          orderBy('periodStart', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting payroll records:', error);
      throw error;
    }
  }
}
