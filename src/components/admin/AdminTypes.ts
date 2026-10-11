export type AdminSection =
  | 'dashboard'
  | 'subscriptions'
  | 'users'
  | 'doctors'
  | 'hospitals'
  | 'diagnostic-centers'
  | 'pharmacies'
  | 'ambulances'
  | 'home-care'
  | 'appointments'
  | 'services'
  | 'finance'
  | 'support'
  | 'content'
  | 'reports'
  | 'notifications'
  | 'audit-logs'
  | 'settings';

export interface AdminNavCategory {
  title: string;
  titleBn: string;
  items: AdminNavItem[];
}

export interface AdminNavItem {
  id: AdminSection;
  label: string;
  labelBn: string;
  iconName: string;
  badge?: number | string;
  badgeColor?: string;
  requiredRole?: string;
}

export interface PlatformSettings {
  brandName: string;
  helplinePhone: string;
  companyEmail: string;
  defaultCurrency: string;
  isMaintenanceMode: boolean;
  smsGatewayActive: boolean;
  bmdcVerificationApiActive: boolean;
  primaryRevenueModel: 'SUBSCRIPTION_RECURRING';
}
