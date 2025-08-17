export interface User {
  uid: string;
  email: string;
  displayName?: string;
  emailVerified: boolean;
  customClaims?: CustomClaims;
}

export interface CustomClaims {
  SUPER_ADMIN?: boolean;
  ADMIN?: boolean;
  CONTADORA?: boolean;
  BUSINESS?: boolean;
  DRIVER?: boolean;
  businessId?: string;
  driverId?: string;
}

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'CONTADORA' | 'BUSINESS' | 'DRIVER';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, additionalData?: any) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}
