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
  runTransaction
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '@/lib/firebase/config';
import { Business, CreditPurchaseRequest, Order } from '@/lib/types';
import { generateOrderNumber } from '@/lib/utils/helpers';

export class BusinessService {
  // Get business profile
  static async getProfile(businessId: string): Promise<Business | null> {
    try {
      const docRef = doc(db, 'businesses', businessId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Business;
      }
      return null;
    } catch (error) {
      console.error('Error getting business profile:', error);
      throw error;
    }
  }

  // Update business profile
  static async updateProfile(
    businessId: string,
    data: Partial<Business>
  ): Promise<void> {
    try {
      const docRef = doc(db, 'businesses', businessId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating business profile:', error);
      throw error;
    }
  }

  // Create order
  static async createOrder(
    businessId: string,
    orderData: {
      customerName: string;
      customerPhone: string;
      deliveryAddress: string;
      deliveryCoordinates: { lat: number; lng: number };
      amountToCollect: number;
      paymentMethod: 'CASH' | 'CARD';
      notes?: string;
    }
  ): Promise<{ success: boolean; orderId: string }> {
    try {
      const createOrderFunction = httpsCallable(functions, 'createOrderWithCredits');

      const result = await createOrderFunction({
        businessId,
        orderNumber: generateOrderNumber(),
        ...orderData
      });

      return result.data as { success: boolean; orderId: string };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Get business orders
  static async getOrders(
    businessId: string,
    limit: number = 25
  ): Promise<Order[]> {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('businessId', '==', businessId),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  }

  // Get order details
  static async getOrder(orderId: string): Promise<Order | null> {
    try {
      const docRef = doc(db, 'orders', orderId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Order;
      }
      return null;
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  }

  // Purchase credits with card
  static async purchaseCreditsWithCard(
    businessId: string,
    packageId: string
  ): Promise<{ sessionUrl: string }> {
    try {
      const purchaseFunction = httpsCallable(functions, 'createStripeCheckoutSession');

      const result = await purchaseFunction({
        businessId,
        packageId
      });

      return result.data as { sessionUrl: string };
    } catch (error) {
      console.error('Error purchasing credits with card:', error);
      throw error;
    }
  }

  // Request manual credit purchase (bank transfer)
  static async requestManualCreditPurchase(
    businessId: string,
    packageData: {
      packageName: string;
      packageCost: number;
      proofOfPayment: File;
    }
  ): Promise<void> {
    try {
      // Upload proof of payment
      const uploadFunction = httpsCallable(functions, 'uploadProofOfPayment');
      const uploadResult = await uploadFunction({
        file: packageData.proofOfPayment,
        businessId
      });

      const { downloadURL } = uploadResult.data as { downloadURL: string };

      // Create purchase request
      const requestRef = doc(collection(db, 'creditPurchaseRequests'));
      await setDoc(requestRef, {
        businessId,
        packageName: packageData.packageName,
        packageCost: packageData.packageCost,
        proofOfPaymentUrl: downloadURL,
        status: 'pending',
        requestDate: serverTimestamp()
      });
    } catch (error) {
      console.error('Error requesting manual credit purchase:', error);
      throw error;
    }
  }

  // Get credit purchase requests
  static async getCreditPurchaseRequests(
    businessId: string
  ): Promise<CreditPurchaseRequest[]> {
    try {
      const requestsRef = collection(db, 'creditPurchaseRequests');
      const q = query(
        requestsRef,
        where('businessId', '==', businessId),
        orderBy('requestDate', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CreditPurchaseRequest[];
    } catch (error) {
      console.error('Error getting credit purchase requests:', error);
      throw error;
    }
  }

  // Check available credits
  static async checkCredits(businessId: string): Promise<number> {
    try {
      const business = await this.getProfile(businessId);
      return business?.availableCredits || 0;
    } catch (error) {
      console.error('Error checking credits:', error);
      throw error;
    }
  }

  // Get business statistics
  static async getStatistics(businessId: string): Promise<{
    totalOrders: number;
    completedOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    availableCredits: number;
  }> {
    try {
      const getStatsFunction = httpsCallable(functions, 'getBusinessStatistics');

      const result = await getStatsFunction({ businessId });
      return result.data as any;
    } catch (error) {
      console.error('Error getting business statistics:', error);
      throw error;
    }
  }
}
