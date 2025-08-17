import { z } from 'zod';

// Business validation schemas
export const businessSignupSchema = z.object({
  businessName: z.string()
    .min(3, 'El nombre del negocio debe tener al menos 3 caracteres')
    .max(100, 'El nombre del negocio es demasiado largo'),
  contactName: z.string()
    .min(3, 'El nombre de contacto debe tener al menos 3 caracteres')
    .max(100, 'El nombre de contacto es demasiado largo'),
  email: z.string()
    .email('Email inválido')
    .min(1, 'Email es requerido'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  phone: z.string()
    .regex(/^\d{10}$/, 'El teléfono debe tener exactamente 10 dígitos'),
  address: z.string()
    .min(10, 'La dirección debe ser más específica')
    .max(255, 'La dirección es demasiado larga')
});

export const businessLoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña es requerida')
});

// Driver application validation schema
export const driverApplicationSchema = z.object({
  personalInfo: z.object({
    fullName: z.string()
      .min(3, 'Nombre completo requerido')
      .max(100, 'Nombre demasiado largo'),
    email: z.string().email('Email inválido'),
    phone: z.string().regex(/^\d{10}$/, 'Teléfono debe tener 10 dígitos'),
    rfc: z.string()
      .regex(/^[A-ZÑ&]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/, 'RFC inválido'),
    nss: z.string()
      .regex(/^\d{11}$/, 'NSS debe tener 11 dígitos'),
    curp: z.string()
      .regex(/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/, 'CURP inválido'),
    address: z.string().min(10, 'Dirección completa requerida')
  }),
  vehicleInfo: z.object({
    type: z.enum(['auto', 'moto', 'bici'], {
      errorMap: () => ({ message: 'Tipo de vehículo requerido' })
    }),
    brand: z.string().min(1, 'Marca requerida'),
    model: z.string().min(1, 'Modelo requerido'),
    year: z.number()
      .min(2010, 'El vehículo debe ser 2010 o más reciente')
      .max(new Date().getFullYear() + 1, 'Año inválido'),
    plates: z.string()
      .regex(/^[A-Z0-9-]+$/, 'Placas inválidas')
      .min(6, 'Placas deben tener al menos 6 caracteres'),
    color: z.string().min(1, 'Color requerido')
  }),
  bankInfo: z.object({
    bankName: z.string().min(1, 'Banco requerido'),
    clabe: z.string()
      .regex(/^\d{18}$/, 'CLABE debe tener exactamente 18 dígitos')
  })
});

// Order creation validation schema
export const orderCreationSchema = z.object({
  customerName: z.string()
    .min(3, 'Nombre del cliente requerido')
    .max(100, 'Nombre demasiado largo'),
  customerPhone: z.string()
    .regex(/^\d{10}$/, 'Teléfono debe tener 10 dígitos'),
  deliveryAddress: z.string()
    .min(10, 'Dirección de entrega debe ser específica')
    .max(255, 'Dirección demasiado larga'),
  amountToCollect: z.number()
    .min(0, 'El monto no puede ser negativo')
    .max(50000, 'Monto máximo excedido'),
  paymentMethod: z.enum(['CASH', 'CARD'], {
    errorMap: () => ({ message: 'Método de pago requerido' })
  }),
  notes: z.string().max(500, 'Notas demasiado largas').optional()
});

// Credit purchase validation schema
export const creditPurchaseSchema = z.object({
  packageId: z.string().min(1, 'Paquete requerido'),
  paymentMethod: z.enum(['CARD', 'TRANSFER'], {
    errorMap: () => ({ message: 'Método de pago requerido' })
  }),
  proofOfPayment: z.instanceof(File, {
    message: 'Comprobante de pago requerido'
  }).optional()
});

// Admin validation schemas
export const adminLoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida')
});

export const driverApprovalSchema = z.object({
  applicationId: z.string().min(1, 'ID de aplicación requerido'),
  approved: z.boolean(),
  rejectionReason: z.string().optional()
});

// Utility validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

export const validateRFC = (rfc: string): boolean => {
  const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/;
  return rfcRegex.test(rfc.toUpperCase());
};

export const validateCURP = (curp: string): boolean => {
  const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;
  return curpRegex.test(curp.toUpperCase());
};

export const validateCLABE = (clabe: string): boolean => {
  if (!/^\d{18}$/.test(clabe)) return false;

  // CLABE validation algorithm
  const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
  let sum = 0;

  for (let i = 0; i < 17; i++) {
    sum += parseInt(clabe[i]) * weights[i];
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(clabe[17]);
};

export const getPasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
} => {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;

  const levels = [
    { score: 0, label: 'Muy débil', color: 'bg-red-500' },
    { score: 1, label: 'Débil', color: 'bg-red-400' },
    { score: 2, label: 'Regular', color: 'bg-yellow-500' },
    { score: 3, label: 'Buena', color: 'bg-yellow-400' },
    { score: 4, label: 'Fuerte', color: 'bg-green-500' },
    { score: 5, label: 'Muy fuerte', color: 'bg-green-600' },
    { score: 6, label: 'Excelente', color: 'bg-green-700' }
  ];

  return levels[Math.min(score, 6)];
};
