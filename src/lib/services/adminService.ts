import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '@/lib/firebase/config';

export class AdminService {
  // Driver Applications Management
  static async getDriverApplications(status?: string): Promise<any[]> {
    try {
      const applicationsRef = collection(db, 'driverApplications');
      let q = query(applicationsRef, orderBy('submissionDate', 'desc'));

      if (status) {
        q = query(
          applicationsRef,
          where('status', '==', status),
          orderBy('submissionDate', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting driver applications:', error);
      throw error;
    }
  }

  static async getDriverApplication(applicationId: string): Promise<any | null> {
    try {
      const docRef = doc(db, 'driverApplications', applicationId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting driver application:', error);
      throw error;
    }
  }

  static async approveDriverApplication(
    applicationId: string,
    adminId: string
  ): Promise<{ success: boolean; driverId: string }> {
    try {
      const approveFunction = httpsCallable(functions, 'approveDriverApplication');

      const result = await approveFunction({
        applicationId,
        adminId
      });

      return result.data as { success: boolean; driverId: string };
    } catch (error) {
      console.error('Error approving driver application:', error);
      throw error;
    }
  }

  static async rejectDriverApplication(
    applicationId: string,
    rejectionReason: string,
    adminId: string
  ): Promise<void> {
    try {
      const rejectFunction = httpsCallable(functions, 'rejectDriverApplication');

      await rejectFunction({
        applicationId,
        rejectionReason,
        adminId
      });
    } catch (error) {
      console.error('Error rejecting driver application:', error);
      throw error;
    }
  }

  // Driver Management
  static async getDrivers(status?: string): Promise<any[]> {
    try {
      const driversRef = collection(db, 'drivers');
      let q = query(driversRef, orderBy('createdAt', 'desc'));

      if (status) {
        q = query(
          driversRef,
          where('status', '==', status),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting drivers:', error);
      throw error;
    }
  }

  static async getDriver(driverId: string): Promise<any | null> {
    try {
      const docRef = doc(db, 'drivers', driverId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting driver:', error);
      throw error;
    }
  }

  static async updateDriverStatus(
    driverId: string,
    status: string,
    reason?: string
  ): Promise<void> {
    try {
      const updateStatusFunction = httpsCallable(functions, 'updateDriverStatus');

      await updateStatusFunction({
        driverId,
        status,
        reason
      });
    } catch (error) {
      console.error('Error updating driver status:', error);
      throw error;
    }
  }

  static async updateDriverDebtLimit(
    driverId: string,
    newLimit: number,
    reason: string
  ): Promise<void> {
    try {
      const updateLimitFunction = httpsCallable(functions, 'updateDriverDebtLimit');

      await updateLimitFunction({
        driverId,
        newLimit,
        reason
      });
    } catch (error) {
      console.error('Error updating driver debt limit:', error);
      throw error;
    }
  }

  // Business Management
  static async getBusinesses(status?: string): Promise<any[]> {
    try {
      const businessesRef = collection(db, 'businesses');
      let q = query(businessesRef, orderBy('createdAt', 'desc'));

      if (status) {
        q = query(
          businessesRef,
          where('status', '==', status),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting businesses:', error);
      throw error;
    }
  }

  static async getBusiness(businessId: string): Promise<any | null> {
    try {
      const docRef = doc(db, 'businesses', businessId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting business:', error);
      throw error;
    }
  }

  static async adjustBusinessCredits(
    businessId: string,
    adjustment: number,
    reason: string
  ): Promise<void> {
    try {
      const adjustCreditsFunction = httpsCallable(functions, 'adjustBusinessCredits');

      await adjustCreditsFunction({
        businessId,
        adjustment,
        reason
      });
    } catch (error) {
      console.error('Error adjusting business credits:', error);
      throw error;
    }
  }

  // Credit Purchase Requests
  static async getCreditPurchaseRequests(status?: string): Promise<any[]> {
    try {
      const requestsRef = collection(db, 'creditPurchaseRequests');
      let q = query(requestsRef, orderBy('requestDate', 'desc'));

      if (status) {
        q = query(
          requestsRef,
          where('status', '==', status),
          orderBy('requestDate', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting credit purchase requests:', error);
      throw error;
    }
  }

  static async approveCreditPurchase(
    requestId: string,
    adminId: string
  ): Promise<void> {
    try {
      const approveFunction = httpsCallable(functions, 'approveCreditPurchase');

      await approveFunction({
        requestId,
        adminId
      });
    } catch (error) {
      console.error('Error approving credit purchase:', error);
      throw error;
    }
  }

  static async rejectCreditPurchase(
    requestId: string,
    rejectionReason: string,
    adminId: string
  ): Promise<void> {
    try {
      const rejectFunction = httpsCallable(functions, 'rejectCreditPurchase');

      await rejectFunction({
        requestId,
        rejectionReason,
        adminId
      });
    } catch (error) {
      console.error('Error rejecting credit purchase:', error);
      throw error;
    }
  }

  // Orders Management
  static async getOrders(
    filters?: {
      status?: string;
      businessId?: string;
      driverId?: string;
      startDate?: Date;
      endDate?: Date;
    },
    limitCount: number = 50
  ): Promise<any[]> {
    try {
      const ordersRef = collection(db, 'orders');
      let q = query(ordersRef, orderBy('createdAt', 'desc'), limit(limitCount));

      // Apply filters
      if (filters?.status) {
        q = query(ordersRef, where('status', '==', filters.status), orderBy('createdAt', 'desc'), limit(limitCount));
      }
      if (filters?.businessId) {
        q = query(ordersRef, where('businessId', '==', filters.businessId), orderBy('createdAt', 'desc'), limit(limitCount));
      }
      if (filters?.driverId) {
        q = query(ordersRef, where('driverId', '==', filters.driverId), orderBy('createdAt', 'desc'), limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  }

  static async getOrder(orderId: string): Promise<any | null> {
    try {
      const docRef = doc(db, 'orders', orderId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  }

  static async reassignOrder(
    orderId: string,
    newDriverId: string,
    reason: string
  ): Promise<void> {
    try {
      const reassignFunction = httpsCallable(functions, 'reassignOrder');

      await reassignFunction({
        orderId,
        newDriverId,
        reason
      });
    } catch (error) {
      console.error('Error reassigning order:', error);
      throw error;
    }
  }

  static async cancelOrder(
    orderId: string,
    reason: string
  ): Promise<void> {
    try {
      const cancelFunction = httpsCallable(functions, 'cancelOrder');

      await cancelFunction({
        orderId,
        reason
      });
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  }

  // System Statistics
  static async getSystemMetrics(): Promise<{
    activeDrivers: number;
    activeBusinesses: number;
    ordersToday: number;
    ordersInProgress: number;
    totalCreditsInCirculation: number;
    totalDriverDebt: number;
    averageDeliveryTime: number;
    errorRate: number;
  }> {
    try {
      const getMetricsFunction = httpsCallable(functions, 'getSystemMetrics');

      const result = await getMetricsFunction();
      return result.data as any;
    } catch (error) {
      console.error('Error getting system metrics:', error);
      throw error;
    }
  }

  // Payroll Management
  static async getPayrollStatus(month: string): Promise<{
    totalDrivers: number;
    employeesProcessed: number;
    independentsProcessed: number;
    cfdiGenerated: number;
    transfersCompleted: number;
    status: string;
  }> {
    try {
      const getPayrollFunction = httpsCallable(functions, 'getPayrollStatus');

      const result = await getPayrollFunction({ month });
      return result.data as any;
    } catch (error) {
      console.error('Error getting payroll status:', error);
      throw error;
    }
  }

  static async generatePayrollReport(
    month: string,
    format: 'excel' | 'pdf' = 'excel'
  ): Promise<{ downloadUrl: string }> {
    try {
      const generateReportFunction = httpsCallable(functions, 'generatePayrollReport');

      const result = await generateReportFunction({
        month,
        format,
        reportType: 'monthly_closure'
      });

      return result.data as { downloadUrl: string };
    } catch (error) {
      console.error('Error generating payroll report:', error);
      throw error;
    }
  }

  // Audit Logs
  static async getAuditLogs(
    filters?: {
      actionType?: string;
      entityType?: string;
      performedBy?: string;
      startDate?: Date;
      endDate?: Date;
    },
    limitCount: number = 100
  ): Promise<any[]> {
    try {
      const logsRef = collection(db, 'auditLogs');
      let q = query(logsRef, orderBy('timestamp', 'desc'), limit(limitCount));

      if (filters?.actionType) {
        q = query(logsRef, where('actionType', '==', filters.actionType), orderBy('timestamp', 'desc'), limit(limitCount));
      }
      if (filters?.performedBy) {
        q = query(logsRef, where('performedBy', '==', filters.performedBy), orderBy('timestamp', 'desc'), limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting audit logs:', error);
      throw error;
    }
  }

  // Export functions
  static async exportDriverReport(
    driverId: string,
    options: {
      includeFinancial: boolean;
      includePerformance: boolean;
      dateRange: string;
    }
  ): Promise<{ downloadUrl: string }> {
    try {
      const exportFunction = httpsCallable(functions, 'exportDriverReport');

      const result = await exportFunction({
        driverId,
        ...options
      });

      return result.data as { downloadUrl: string };
    } catch (error) {
      console.error('Error exporting driver report:', error);
      throw error;
    }
  }

  static async exportBusinessReport(
    businessId: string,
    dateRange: { start: Date; end: Date }
  ): Promise<{ downloadUrl: string }> {
    try {
      const exportFunction = httpsCallable(functions, 'exportBusinessReport');

      const result = await exportFunction({
        businessId,
        startDate: dateRange.start,
        endDate: dateRange.end
      });

      return result.data as { downloadUrl: string };
    } catch (error) {
      console.error('Error exporting business report:', error);
      throw error;
    }
  }

  // Debt Payments Management
  static async getDebtPayments(status?: string): Promise<any[]> {
    try {
      const paymentsRef = collection(db, 'debtPayments');
      let q = query(paymentsRef, orderBy('requestDate', 'desc'));

      if (status) {
        q = query(
          paymentsRef,
          where('status', '==', status),
          orderBy('requestDate', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting debt payments:', error);
      throw error;
    }
  }

  static async approveDebtPayment(
    paymentId: string,
    adminId: string
  ): Promise<void> {
    try {
      const approveFunction = httpsCallable(functions, 'approveDebtPayment');

      await approveFunction({
        paymentId,
        adminId
      });
    } catch (error) {
      console.error('Error approving debt payment:', error);
      throw error;
    }
  }

  static async rejectDebtPayment(
    paymentId: string,
    rejectionReason: string,
    adminId: string
  ): Promise<void> {
    try {
      const rejectFunction = httpsCallable(functions, 'rejectDebtPayment');

      await rejectFunction({
        paymentId,
        rejectionReason,
        adminId
      });
    } catch (error) {
      console.error('Error rejecting debt payment:', error);
      throw error;
    }
  }

  // System Configuration
  static async getSystemConfig(): Promise<{
    salarioMinimoMensual: number;
    factoresExclusion: {
      auto: number;
      moto: number;
      bici: number;
    };
    comisionEfectivo: number;
    debtLimitDefault: number;
    porcentajeIMSS: number;
    porcentajeISR: number;
  }> {
    try {
      const docRef = doc(db, 'configuration', 'legal');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as any;
      }

      // Return default values if no config exists
      return {
        salarioMinimoMensual: 7468.00, // Based on 2024 minimum wage
        factoresExclusion: {
          auto: 5000,
          moto: 3000,
          bici: 1500
        },
        comisionEfectivo: 15.00,
        debtLimitDefault: -300.00,
        porcentajeIMSS: 3.5,
        porcentajeISR: 10.0
      };
    } catch (error) {
      console.error('Error getting system config:', error);
      throw error;
    }
  }

  static async updateSystemConfig(
    config: Partial<{
      salarioMinimoMensual: number;
      factoresExclusion: {
        auto: number;
        moto: number;
        bici: number;
      };
      comisionEfectivo: number;
      debtLimitDefault: number;
      porcentajeIMSS: number;
      porcentajeISR: number;
    }>,
    adminId: string
  ): Promise<void> {
    try {
      const updateConfigFunction = httpsCallable(functions, 'updateSystemConfig');

      await updateConfigFunction({
        config,
        adminId
      });
    } catch (error) {
      console.error('Error updating system config:', error);
      throw error;
    }
  }
}
