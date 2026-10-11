export type SubscriptionTier = 'basic' | 'professional' | 'premium' | 'enterprise';

export type BillingInterval = 'monthly' | 'annual' | 'custom';

export type SubscriptionStatus =
  | 'pending_payment'
  | 'active'
  | 'payment_overdue'
  | 'grace_period'
  | 'suspended'
  | 'cancelled'
  | 'expired'
  | 'pending_renewal';

export type InvoiceStatus = 'unpaid' | 'paid' | 'overdue' | 'void' | 'refunded';

export type PaymentGatewayName = 'sslcommerz' | 'bkash' | 'nagad' | 'bank_transfer' | 'cash_manual';

export interface SubscriptionPlan {
  id: string;
  code: string;
  name: string;
  nameBn: string;
  tier: SubscriptionTier;
  description?: string;
  descriptionBn?: string;
  providerCategories: string[];
  billingInterval: BillingInterval;
  priceBdt: number;
  branchLimit: number;
  serviceListingLimit: number;
  staffAccountLimit: number;
  hasFeaturedBadge: boolean;
  hasPriorityListing: boolean;
  hasAdvancedAnalytics: boolean;
  hasCustomBranding: boolean;
  features: string[];
  trialDays: number;
  isPublished: boolean;
  isArchived: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderSubscription {
  id: string;
  providerType: 'diagnostic_center' | 'hospital' | 'clinic';
  providerId: string;
  providerName?: string;
  providerNameBn?: string;
  providerPhone?: string;
  providerDistrict?: string;
  planId: string;
  plan?: SubscriptionPlan;
  status: SubscriptionStatus;
  billingInterval: BillingInterval;
  priceBdt: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextRenewalDate: string;
  gracePeriodEnd?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  autoRenew: boolean;
  billingContactName?: string;
  billingContactEmail?: string;
  billingContactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionInvoice {
  id: string;
  invoiceNumber: string;
  subscriptionId: string;
  providerType: string;
  providerId: string;
  providerName?: string;
  planName: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  issueDate: string;
  dueDate: string;
  subtotalBdt: number;
  discountBdt: number;
  taxBdt: number;
  totalBdt: number;
  amountPaidBdt: number;
  status: InvoiceStatus;
  paidAt?: string;
  paymentMethod?: string;
  paymentReference?: string;
  notes?: string;
  createdAt: string;
}

export interface SubscriptionPayment {
  id: string;
  invoiceId: string;
  subscriptionId: string;
  providerId: string;
  paymentReference: string;
  gatewayName: PaymentGatewayName;
  gatewayTransactionId?: string;
  idempotencyKey?: string;
  amountBdt: number;
  currency: string;
  status: 'initiated' | 'verified' | 'failed' | 'refunded';
  gatewayResponse?: any;
  verifiedAt?: string;
  verifiedByAdmin?: string;
  createdAt: string;
}

export interface SubscriptionAuditLog {
  id: string;
  subscriptionId?: string;
  action: string;
  performedByAdmin?: string;
  adminEmail?: string;
  mandatoryReason: string;
  previousState?: any;
  newState?: any;
  ipAddress?: string;
  createdAt: string;
}

export interface SubscriptionRevenueMetrics {
  mrrBdt: number;
  arrBdt: number;
  cashCollectedBdt: number;
  totalSubscribers: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  expiringSoonCount: number;
  overdueCount: number;
  gracePeriodCount: number;
  cancelledCount: number;
  expiredCount: number;
  arpuBdt: number;
  churnRatePercent: number;
  renewalSuccessRatePercent: number;
  revenueByTier: Record<SubscriptionTier, number>;
  revenueByInterval: {
    monthly: number;
    annual: number;
  };
  revenueByProviderCategory: {
    diagnosticCenters: number;
    hospitals: number;
    clinics: number;
  };
}

export interface EntitlementCheckResult {
  isAllowed: boolean;
  reason?: string;
  planName: string;
  tier: SubscriptionTier;
  limit: number;
  currentCount?: number;
  hasFeature: boolean;
  status: SubscriptionStatus;
}
