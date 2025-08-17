export interface Driver {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  rfc: string;
  nss: string;
  curp: string;
  onboardingDate: Date;
  status: 'ACTIVE' | 'SUSPENDED' | 'ALTA_PROVISIONAL' | 'ACTIVO_COTIZANDO';

  // Vehicle info (CRITICAL for labor classification)
  vehicleType: 'auto' | 'moto' | 'bici';
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  vehiclePlates: string;
  vehicleColor: string;

  // Financial
  walletBalance: number;
  driverDebtLimit: number;
  ingreso_bruto_mensual: number;

  // Labor classification
  currentClassification: 'Empleado Cotizante' | 'Independiente';
  lastClassificationDate?: Date;
  factorExclusion: number;

  // KPIs
  kpis: {
    totalOrders: number;
    onTimeRate: number;
    acceptanceRate: number;
    averageRating: number;
    totalDistance: number;
    totalDeliveryTime: number;
  };

  // Integration
  shipdayId?: string;
  imssStatus: 'PROVISIONAL' | 'COTIZANDO' | 'INACTIVE';

  createdAt: Date;
  updatedAt: Date;
}

export interface DriverApplication {
  id: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    rfc: string;
    nss: string;
    curp: string;
    address: string;
  };
  vehicleInfo: {
    type: 'auto' | 'moto' | 'bici';
    brand: string;
    model: string;
    year: number;
    plates: string;
    color: string;
  };
  bankInfo: {
    bankName: string;
    clabe: string;
  };
  documents: {
    ineFrontUrl: string;
    ineBackUrl: string;
    licenseUrl: string;
    addressProofUrl: string;
    vehicleInsuranceUrl: string;
  };
  legal: {
    signatureData: string;
    acceptedTerms: boolean;
  };
  training: {
    score: number;
    thermalBagPhotoUrl: string;
  };
  status: 'pending_review' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
  submissionDate: Date;
}

export interface DebtPayment {
  id: string;
  driverId: string;
  driverName: string;
  amountPaid: number;
  proofUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
}
