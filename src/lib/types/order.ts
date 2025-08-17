export interface Order {
  id: string;
  businessId: string;
  driverId?: string;
  orderDate: Date;
  status: OrderStatus;

  // Pickup info
  pickupAddress: string;
  businessName: string;
  businessPhone: string;

  // Delivery info
  deliveryInfo: {
    customerName: string;
    customerPhone: string;
    location: {
      address: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
    amountToCollect: number;
    notes?: string;
  };

  paymentMethod: 'CASH' | 'CARD';

  // Shipday integration
  shipday: {
    shipdayOrderId?: number;
    trackingUrl?: string;
  };

  // Timeline
  timeline: OrderEvent[];

  createdAt: Date;
  assignedAt?: Date;
  completedAt?: Date;
}

export type OrderStatus =
  | 'created'
  | 'assigned'
  | 'at_pickup'
  | 'picked_up'
  | 'at_dropoff'
  | 'delivered'
  | 'cancelled'
  | 'failed';

export interface OrderEvent {
  status: OrderStatus;
  timestamp: Date;
  notes?: string;
}

export interface OrderCreationData {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  amountToCollect: number;
  paymentMethod: 'CASH' | 'CARD';
  notes?: string;
}
