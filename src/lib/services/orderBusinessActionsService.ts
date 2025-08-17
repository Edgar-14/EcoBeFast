import {
  collection,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export class OrderBusinessActionsService {
  // Solicitar cancelación de orden (agrega un campo cancelRequested)
  static async requestCancelOrder(orderId: string, businessId: string, reason?: string): Promise<void> {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      cancelRequested: true,
      cancelRequestReason: reason || '',
      cancelRequestedAt: serverTimestamp(),
      cancelRequestedBy: businessId
    });
  }
}
