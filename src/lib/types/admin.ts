import { UserRole } from './auth';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface SystemMetric {
  id: string;
  timestamp: Date;
  activeDrivers: number;
  activeBusinesses: number;
  ordersToday: number;
  totalRevenue: number;
  errorRate: number;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  actionType: string;
  entityType: string;
  entityId: string;
  performedBy: string; // Admin UID
  changes?: {
    before: any;
    after: any;
  };
  reason?: string;
  ipAddress?: string;
}

export interface IncentiveCampaign {
  id: string;
  campaignName: string;
  startDate: Date;
  endDate: Date;
  rewardType: 'FIXED' | 'PERCENTAGE';
  rewardValue: number;
  conditions: {
    targetType: 'ORDERS_COMPLETED' | 'RATING_MAINTAINED';
    targetValue: number;
  };
  audienceType: 'ALL' | 'SEGMENT' | 'INDIVIDUAL';
  participants: string[]; // driverIds
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  createdAt: Date;
}
