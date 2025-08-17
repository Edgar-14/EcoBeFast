import {
  doc,
  getDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Order } from '@/lib/types';

export class OrderService {
  // Get real-time order updates
  static onOrderUpdate(
    orderId: string,
    callback: (order: Order | null) => void
  ): () => void {
    const docRef = doc(db, 'orders', orderId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as Order);
      } else {
        callback(null);
      }
    });

    return unsubscribe;
  }

  // Get single order details
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
}
