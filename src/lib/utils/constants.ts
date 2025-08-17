export const ROUTES = {
  HOME: '/',

  // Auth routes
  BUSINESS_LOGIN: '/delivery/login',
  BUSINESS_SIGNUP: '/delivery/signup',
  BUSINESS_VERIFY_EMAIL: '/delivery/verify-email',
  BUSINESS_FORGOT_PASSWORD: '/delivery/forgot-password',

  DRIVER_LOGIN: '/drivers/login',
  DRIVER_SIGNUP: '/drivers/signup',
  DRIVER_APPLICATION_STATUS: '/drivers/application-status',

  ADMIN_LOGIN: '/admin/login',
  ADMIN_FORGOT_PASSWORD: '/admin/forgot-password',

  // Dashboard routes
  BUSINESS_DASHBOARD: '/dashboard/delivery',
  BUSINESS_ORDERS: '/dashboard/delivery/orders',
  BUSINESS_BILLING: '/dashboard/delivery/billing',
  BUSINESS_SETTINGS: '/dashboard/delivery/settings',

  DRIVER_DASHBOARD: '/dashboard/drivers',
  DRIVER_DOCUMENTS: '/dashboard/drivers/documents',
  DRIVER_BENEFICIARIES: '/dashboard/drivers/beneficiaries',
  DRIVER_PAYROLL: '/dashboard/drivers/payroll',
  DRIVER_REPORTS: '/dashboard/drivers/reports',
  DRIVER_SUPPORT: '/dashboard/drivers/support',

  ADMIN_DASHBOARD: '/dashboard/admin',
  ADMIN_DRIVER_APPLICATIONS: '/dashboard/admin/driver-applications',
  ADMIN_DRIVERS: '/dashboard/admin/drivers',
  ADMIN_BUSINESSES: '/dashboard/admin/businesses',
  ADMIN_ORDERS: '/dashboard/admin/orders',
  ADMIN_PAYROLL: '/dashboard/admin/payroll',
  ADMIN_INCENTIVES: '/dashboard/admin/incentives',
  ADMIN_SUPPORT: '/dashboard/admin/support',
  ADMIN_AUDIT_LOG: '/dashboard/admin/audit-log',
  ADMIN_SETTINGS: '/dashboard/admin/settings',
} as const;

export const CREDIT_PACKAGES = [
  {
    id: 'package_50',
    name: '50 Pedidos',
    credits: 50,
    price: 750,
    bonusCredits: 15,
    description: 'Ideal para empezar'
  },
  {
    id: 'package_100',
    name: '100 Pedidos',
    credits: 100,
    price: 1500,
    bonusCredits: 25,
    description: 'Más popular'
  },
  {
    id: 'package_250',
    name: '250 Pedidos',
    credits: 250,
    price: 3750,
    bonusCredits: 35,
    description: 'Mejor valor'
  }
] as const;

export const BANK_INFO = {
  bankName: 'BBVA',
  accountNumber: '150 480 8078',
  clabe: '012 098 01504808078 9',
  accountHolder: 'BeFast S.A. de C.V.'
} as const;

export const CONTACT_INFO = {
  whatsapp: 'https://wa.me/5213121905494',
  email: 'soporte@befastapp.com.mx',
  facebook: 'https://www.facebook.com/befastmarket1/',
  instagram: 'https://www.instagram.com/befastmarket/',
  supportEmail: 'revisiones@befastapp.com.mx',
  documentsEmail: 'documentos@befastapp.com.mx'
} as const;

export const PERFORMANCE_THRESHOLDS = {
  MIN_RATING: 4.2,
  MIN_ON_TIME_RATE: 85,
  MIN_ACCEPTANCE_RATE: 75,
  MAX_CONSECUTIVE_CANCELLATIONS: 3
} as const;

export const DEBT_LIMITS = {
  DEFAULT_LIMIT: -300.00,
  MINIMUM_LIMIT: -500.00,
  MAXIMUM_LIMIT: 0.00
} as const;

export const VEHICLE_TYPES = {
  AUTO: 'auto',
  MOTO: 'moto',
  BICI: 'bici'
} as const;

export const ORDER_STATUSES = {
  CREATED: 'created',
  ASSIGNED: 'assigned',
  AT_PICKUP: 'at_pickup',
  PICKED_UP: 'picked_up',
  AT_DROPOFF: 'at_dropoff',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  FAILED: 'failed'
} as const;

export const PAYMENT_METHODS = {
  CASH: 'CASH',
  CARD: 'CARD'
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  CONTADORA: 'CONTADORA',
  BUSINESS: 'BUSINESS',
  DRIVER: 'DRIVER'
} as const;

export const DRIVER_STATUSES = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  ALTA_PROVISIONAL: 'ALTA_PROVISIONAL',
  ACTIVO_COTIZANDO: 'ACTIVO_COTIZANDO'
} as const;
