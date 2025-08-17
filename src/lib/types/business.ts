export interface Business {
  uid: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  availableCredits: number;
  status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED';
  createdAt: Date;
  updatedAt: Date;
  emailVerifiedAt?: Date;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  bonusCredits: number;
  isFirstTimeBuyer: boolean;
}

export interface CreditPurchaseRequest {
  id: string;
  businessId: string;
  businessName: string;
  packageName: string;
  packageCost: number;
  proofOfPaymentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
}
