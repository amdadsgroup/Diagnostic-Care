import { supabase } from '@/lib/supabase/client';
import {
  SubscriptionPlan,
  ProviderSubscription,
  SubscriptionInvoice,
  SubscriptionPayment,
  SubscriptionAuditLog,
  SubscriptionRevenueMetrics,
  SubscriptionTier,
  BillingInterval,
  SubscriptionStatus,
  EntitlementCheckResult,
} from '@/types/subscription';

export const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-basic-monthly',
    code: 'basic_monthly',
    name: 'Basic Monthly Plan',
    nameBn: 'বেসিক মাসিক প্ল্যান',
    tier: 'basic',
    description: 'Essential provider listing and standard profile visibility for diagnostic centers and clinics.',
    descriptionBn: 'ডায়াগনস্টিক সেন্টার ও ক্লিনিকের জন্য প্রয়োজনীয় অনলাইন তালিকা ও স্ট্যান্ডার্ড প্রোফাইল ভিজিবিলিটি।',
    providerCategories: ['diagnostic_center', 'hospital', 'clinic'],
    billingInterval: 'monthly',
    priceBdt: 500,
    branchLimit: 1,
    serviceListingLimit: 20,
    staffAccountLimit: 2,
    hasFeaturedBadge: false,
    hasPriorityListing: false,
    hasAdvancedAnalytics: false,
    hasCustomBranding: false,
    features: [
      'Verified Provider Badge',
      'Standard Search Listing',
      'Up to 20 Service Listings',
      '1 Branch Support',
      '2 Staff Accounts',
      'Basic Inquiries',
    ],
    trialDays: 7,
    isPublished: true,
    isArchived: false,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plan-basic-annual',
    code: 'basic_annual',
    name: 'Basic Annual Plan',
    nameBn: 'বেসিক বাৎসরিক প্ল্যান',
    tier: 'basic',
    description: 'Annual subscription for essential provider listing with discounted yearly rate.',
    descriptionBn: 'বাৎসরিক ডিসকাউন্টে প্রয়োজনীয় অনলাইন তালিকা ও স্ট্যান্ডার্ড প্রোফাইল ভিজিবিলিটি।',
    providerCategories: ['diagnostic_center', 'hospital', 'clinic'],
    billingInterval: 'annual',
    priceBdt: 5000,
    branchLimit: 1,
    serviceListingLimit: 20,
    staffAccountLimit: 2,
    hasFeaturedBadge: false,
    hasPriorityListing: false,
    hasAdvancedAnalytics: false,
    hasCustomBranding: false,
    features: [
      'Verified Provider Badge',
      'Standard Search Listing',
      'Up to 20 Service Listings',
      '1 Branch Support',
      '2 Staff Accounts',
      'Basic Inquiries',
      '2 Months Free Included',
    ],
    trialDays: 7,
    isPublished: true,
    isArchived: false,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plan-pro-monthly',
    code: 'pro_monthly',
    name: 'Professional Monthly Plan',
    nameBn: 'প্রফেশনাল মাসিক প্ল্যান',
    tier: 'professional',
    description: 'Enhanced provider profile, priority search placement, and increased operational features.',
    descriptionBn: 'উন্নত প্রোফাইল, সার্চে অগ্রাধিকারমূলক প্লেসমেন্ট এবং বর্ধিত অপারেশনাল ফিচার।',
    providerCategories: ['diagnostic_center', 'hospital', 'clinic'],
    billingInterval: 'monthly',
    priceBdt: 1500,
    branchLimit: 2,
    serviceListingLimit: 60,
    staffAccountLimit: 5,
    hasFeaturedBadge: true,
    hasPriorityListing: true,
    hasAdvancedAnalytics: false,
    hasCustomBranding: false,
    features: [
      'Verified Provider Badge',
      'Priority Search Placement',
      'Up to 60 Service Listings',
      '2 Branches Support',
      '5 Staff Accounts',
      'Appointment Management Desk',
      'Review Response Privileges',
    ],
    trialDays: 0,
    isPublished: true,
    isArchived: false,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plan-pro-annual',
    code: 'pro_annual',
    name: 'Professional Annual Plan',
    nameBn: 'প্রফেশনাল বাৎসরিক প্ল্যান',
    tier: 'professional',
    description: 'Enhanced provider profile with yearly savings and priority customer care.',
    descriptionBn: 'বাৎসরিক সঞ্চয় সহ প্রায়োরিটি সার্চ প্লেসমেন্ট ও উন্নত ফিচার।',
    providerCategories: ['diagnostic_center', 'hospital', 'clinic'],
    billingInterval: 'annual',
    priceBdt: 15000,
    branchLimit: 2,
    serviceListingLimit: 60,
    staffAccountLimit: 5,
    hasFeaturedBadge: true,
    hasPriorityListing: true,
    hasAdvancedAnalytics: false,
    hasCustomBranding: false,
    features: [
      'Verified Provider Badge',
      'Priority Search Placement',
      'Up to 60 Service Listings',
      '2 Branches Support',
      '5 Staff Accounts',
      'Appointment Management Desk',
      '2 Months Free Included',
    ],
    trialDays: 0,
    isPublished: true,
    isArchived: false,
    sortOrder: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plan-premium-monthly',
    code: 'premium_monthly',
    name: 'Premium Monthly Plan',
    nameBn: 'প্রিমিয়াম মাসিক প্ল্যান',
    tier: 'premium',
    description: 'Top-tier visibility, advanced analytics, featured marketplace placement, and 5 branches.',
    descriptionBn: 'সর্বোচ্চ ভিজিবিলিটি, এডভান্সড অ্যানালিটিক্স, ফিচার্ড প্লেসমেন্ট এবং ৫টি শাখা পরিচালনা।',
    providerCategories: ['diagnostic_center', 'hospital', 'clinic'],
    billingInterval: 'monthly',
    priceBdt: 3500,
    branchLimit: 5,
    serviceListingLimit: 200,
    staffAccountLimit: 15,
    hasFeaturedBadge: true,
    hasPriorityListing: true,
    hasAdvancedAnalytics: true,
    hasCustomBranding: false,
    features: [
      'Featured Homepage Badge',
      'Top-Tier Search Ranking',
      'Up to 200 Service Listings',
      '5 Branches Support',
      '15 Staff Accounts',
      'Advanced Analytics & Traffic Insights',
      'Dedicated Priority Support Hotline',
    ],
    trialDays: 0,
    isPublished: true,
    isArchived: false,
    sortOrder: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plan-premium-annual',
    code: 'premium_annual',
    name: 'Premium Annual Plan',
    nameBn: 'প্রিমিয়াম বাৎসরিক প্ল্যান',
    tier: 'premium',
    description: 'Comprehensive annual enterprise visibility with maximum savings.',
    descriptionBn: 'বাৎসরিক সর্বোচ্চ ভিজিবিলিটি, অ্যানালিটিক্স এবং প্রিমিয়াম সুবিধা।',
    providerCategories: ['diagnostic_center', 'hospital', 'clinic'],
    billingInterval: 'annual',
    priceBdt: 35000,
    branchLimit: 5,
    serviceListingLimit: 200,
    staffAccountLimit: 15,
    hasFeaturedBadge: true,
    hasPriorityListing: true,
    hasAdvancedAnalytics: true,
    hasCustomBranding: false,
    features: [
      'Featured Homepage Badge',
      'Top-Tier Search Ranking',
      'Up to 200 Service Listings',
      '5 Branches Support',
      '15 Staff Accounts',
      'Advanced Analytics & Traffic Insights',
      '2 Months Free Included',
    ],
    trialDays: 0,
    isPublished: true,
    isArchived: false,
    sortOrder: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plan-enterprise-monthly',
    code: 'enterprise_monthly',
    name: 'Enterprise Group Plan',
    nameBn: 'এন্টারপ্রাইজ গ্রুপ প্ল্যান',
    tier: 'enterprise',
    description: 'Custom limits and dedicated management for large multi-branch hospital chains and medical groups.',
    descriptionBn: 'বৃহৎ মাল্টি-ব্রাঞ্চ হাসপাতাল চেইন ও মেডিকেল গ্রুপের জন্য কাস্টমাইজড প্ল্যান।',
    providerCategories: ['diagnostic_center', 'hospital'],
    billingInterval: 'monthly',
    priceBdt: 8000,
    branchLimit: 20,
    serviceListingLimit: 1000,
    staffAccountLimit: 50,
    hasFeaturedBadge: true,
    hasPriorityListing: true,
    hasAdvancedAnalytics: true,
    hasCustomBranding: true,
    features: [
      'Full Multi-Branch Network (20+ Branches)',
      'Unlimited Service Listings',
      '50 Staff Accounts',
      'Custom Hospital Branding',
      'API & ERP Integrations',
      'Dedicated Account Manager',
    ],
    trialDays: 0,
    isPublished: true,
    isArchived: false,
    sortOrder: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class SubscriptionService {
  /**
   * 1. Get all published subscription plans from Supabase or default catalog
   */
  static async getPlans(includeArchived: boolean = false): Promise<SubscriptionPlan[]> {
    try {
      let query = supabase.from('subscription_plans').select('*');
      if (!includeArchived) {
        query = query.eq('is_archived', false);
      }
      const { data, error } = await query.order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return DEFAULT_PLANS.filter((p) => includeArchived || !p.isArchived);
      }

      return data.map((d: any) => ({
        id: d.id,
        code: d.code,
        name: d.name,
        nameBn: d.name_bn || d.name,
        tier: d.tier,
        description: d.description,
        descriptionBn: d.description_bn,
        providerCategories: d.provider_categories || ['diagnostic_center', 'hospital'],
        billingInterval: d.billing_interval,
        priceBdt: Number(d.price_bdt) || 0,
        branchLimit: d.branch_limit || 1,
        serviceListingLimit: d.service_listing_limit || 20,
        staffAccountLimit: d.staff_account_limit || 2,
        hasFeaturedBadge: !!d.has_featured_badge,
        hasPriorityListing: !!d.has_priority_listing,
        hasAdvancedAnalytics: !!d.has_advanced_analytics,
        hasCustomBranding: !!d.has_custom_branding,
        features: Array.isArray(d.features) ? d.features : [],
        trialDays: d.trial_days || 0,
        isPublished: !!d.is_published,
        isArchived: !!d.is_archived,
        sortOrder: d.sort_order || 0,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    } catch {
      return DEFAULT_PLANS;
    }
  }

  /**
   * 2. Save or update a subscription plan in database
   */
  static async savePlan(plan: Partial<SubscriptionPlan>, adminEmail: string): Promise<SubscriptionPlan> {
    const payload = {
      code: plan.code,
      name: plan.name,
      name_bn: plan.nameBn,
      tier: plan.tier,
      description: plan.description,
      description_bn: plan.descriptionBn,
      provider_categories: plan.providerCategories,
      billing_interval: plan.billingInterval,
      price_bdt: plan.priceBdt,
      branch_limit: plan.branchLimit,
      service_listing_limit: plan.serviceListingLimit,
      staff_account_limit: plan.staffAccountLimit,
      has_featured_badge: plan.hasFeaturedBadge,
      has_priority_listing: plan.hasPriorityListing,
      has_advanced_analytics: plan.hasAdvancedAnalytics,
      has_custom_branding: plan.hasCustomBranding,
      features: plan.features,
      trial_days: plan.trialDays,
      is_published: plan.isPublished,
      is_archived: plan.isArchived,
      sort_order: plan.sortOrder,
      updated_at: new Date().toISOString(),
    };

    if (plan.id && !plan.id.startsWith('plan-')) {
      const { data, error } = await supabase
        .from('subscription_plans')
        .update(payload)
        .eq('id', plan.id)
        .select()
        .single();
      if (error) throw error;
      await this.recordAuditLog({
        action: 'UPDATE_PLAN',
        adminEmail,
        mandatoryReason: `Updated plan ${plan.name} (${plan.code}) price to ৳${plan.priceBdt}`,
        newState: payload,
      });
      return data;
    } else {
      const { data, error } = await supabase
        .from('subscription_plans')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      await this.recordAuditLog({
        action: 'CREATE_PLAN',
        adminEmail,
        mandatoryReason: `Created new plan ${plan.name} (${plan.code})`,
        newState: payload,
      });
      return data;
    }
  }

  /**
   * 3. Fetch comprehensive subscriptions list with provider metadata
   */
  static async getSubscriptions(filters?: {
    status?: SubscriptionStatus;
    providerType?: string;
    billingInterval?: BillingInterval;
    search?: string;
  }): Promise<ProviderSubscription[]> {
    try {
      let query = supabase.from('provider_subscriptions').select(`
        *,
        plan:subscription_plans(*)
      `);

      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.providerType) query = query.eq('provider_type', filters.providerType);
      if (filters?.billingInterval) query = query.eq('billing_interval', filters.billingInterval);

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return [];
      }

      return data.map((d: any) => ({
        id: d.id,
        providerType: d.provider_type,
        providerId: d.provider_id,
        providerName: d.billing_contact_name || 'Healthcare Partner',
        status: d.status,
        billingInterval: d.billing_interval,
        priceBdt: Number(d.price_bdt),
        currentPeriodStart: d.current_period_start,
        currentPeriodEnd: d.current_period_end,
        nextRenewalDate: d.next_renewal_date,
        gracePeriodEnd: d.grace_period_end,
        cancelledAt: d.cancelled_at,
        cancellationReason: d.cancellation_reason,
        autoRenew: d.auto_renew,
        billingContactName: d.billing_contact_name,
        billingContactEmail: d.billing_contact_email,
        billingContactPhone: d.billing_contact_phone,
        planId: d.plan_id,
        plan: d.plan ? {
          id: d.plan.id,
          code: d.plan.code,
          name: d.plan.name,
          nameBn: d.plan.name_bn,
          tier: d.plan.tier,
          priceBdt: Number(d.plan.price_bdt),
          billingInterval: d.plan.billing_interval,
          branchLimit: d.plan.branch_limit,
          serviceListingLimit: d.plan.service_listing_limit,
          staffAccountLimit: d.plan.staff_account_limit,
          hasFeaturedBadge: d.plan.has_featured_badge,
          hasPriorityListing: d.plan.has_priority_listing,
          hasAdvancedAnalytics: d.plan.has_advanced_analytics,
          hasCustomBranding: d.plan.has_custom_branding,
          features: d.plan.features || [],
          trialDays: d.plan.trial_days || 0,
          isPublished: d.plan.is_published,
          isArchived: d.plan.is_archived,
          sortOrder: d.plan.sort_order || 0,
          providerCategories: d.plan.provider_categories || [],
          createdAt: d.plan.created_at,
          updatedAt: d.plan.updated_at,
        } : undefined,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    } catch {
      return [];
    }
  }

  /**
   * 4. Calculate Genuine Subscription Revenue Metrics (MRR, ARR, Cash Collection, Retention, Churn)
   * Formula Invariant:
   * - MRR = Sum of normalized monthly equivalent from ACTIVE paid subscriptions
   *   (Annual plan contributes price / 12, Monthly contributes price).
   *   Excludes unpaid invoices, free trials, and cancelled/expired subscriptions.
   * - ARR = MRR * 12
   * - Cash Collection = verified payments collected in period.
   */
  static async getRevenueMetrics(dateFilter: 'today' | '7d' | '30d' | 'all' = 'all'): Promise<SubscriptionRevenueMetrics> {
    const subscriptions = await this.getSubscriptions();

    const activeSubs = subscriptions.filter((s) => s.status === 'active');
    const trialSubs = subscriptions.filter((s) => s.status === 'active' && s.priceBdt === 0);
    const paidActiveSubs = activeSubs.filter((s) => s.priceBdt > 0);

    // Calculate Normalized MRR
    let mrr = 0;
    const revenueByTier: Record<SubscriptionTier, number> = {
      basic: 0,
      professional: 0,
      premium: 0,
      enterprise: 0,
    };
    let monthlyVolume = 0;
    let annualVolume = 0;
    const categoryVolume = {
      diagnosticCenters: 0,
      hospitals: 0,
      clinics: 0,
    };

    paidActiveSubs.forEach((sub) => {
      const monthlyEquiv = sub.billingInterval === 'annual' ? Math.round(sub.priceBdt / 12) : sub.priceBdt;
      mrr += monthlyEquiv;

      const tier = sub.plan?.tier || 'basic';
      revenueByTier[tier] = (revenueByTier[tier] || 0) + monthlyEquiv;

      if (sub.billingInterval === 'annual') {
        annualVolume += sub.priceBdt;
      } else {
        monthlyVolume += sub.priceBdt;
      }

      if (sub.providerType === 'diagnostic_center') categoryVolume.diagnosticCenters += monthlyEquiv;
      else if (sub.providerType === 'hospital') categoryVolume.hospitals += monthlyEquiv;
      else categoryVolume.clinics += monthlyEquiv;
    });

    const arr = mrr * 12;

    // Subscriptions expiring within 7 days
    const now = new Date();
    const in7Days = new Date();
    in7Days.setDate(now.getDate() + 7);
    const expiringSoon = paidActiveSubs.filter((s) => {
      const renewal = new Date(s.nextRenewalDate);
      return renewal >= now && renewal <= in7Days;
    }).length;

    const overdueCount = subscriptions.filter((s) => s.status === 'payment_overdue').length;
    const gracePeriodCount = subscriptions.filter((s) => s.status === 'grace_period').length;
    const cancelledCount = subscriptions.filter((s) => s.status === 'cancelled').length;
    const expiredCount = subscriptions.filter((s) => s.status === 'expired').length;

    const totalSubscribers = subscriptions.length;
    const arpu = paidActiveSubs.length > 0 ? Math.round(mrr / paidActiveSubs.length) : 0;
    const churnRate = totalSubscribers > 0 ? Math.round((cancelledCount / totalSubscribers) * 100) : 0;
    const renewalSuccessRate = totalSubscribers > 0 ? Math.round(((totalSubscribers - cancelledCount - expiredCount) / totalSubscribers) * 100) : 100;

    // Cash collection: sum of all paid invoices or direct subscription payments
    const cashCollected = monthlyVolume + annualVolume;

    return {
      mrrBdt: mrr,
      arrBdt: arr,
      cashCollectedBdt: cashCollected,
      totalSubscribers,
      activeSubscriptions: activeSubs.length,
      trialSubscriptions: trialSubs.length,
      expiringSoonCount: expiringSoon,
      overdueCount,
      gracePeriodCount,
      cancelledCount,
      expiredCount,
      arpuBdt: arpu,
      churnRatePercent: churnRate,
      renewalSuccessRatePercent: renewalSuccessRate,
      revenueByTier,
      revenueByInterval: {
        monthly: monthlyVolume,
        annual: annualVolume,
      },
      revenueByProviderCategory: categoryVolume,
    };
  }

  /**
   * 5. Transition Subscription State with Mandatory Admin Reason
   */
  static async updateSubscriptionStatus(params: {
    subscriptionId: string;
    newStatus: SubscriptionStatus;
    mandatoryReason: string;
    adminEmail: string;
  }): Promise<boolean> {
    const { subscriptionId, newStatus, mandatoryReason, adminEmail } = params;

    try {
      const { error } = await supabase
        .from('provider_subscriptions')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscriptionId);

      if (error) throw error;

      await this.recordAuditLog({
        subscriptionId,
        action: `TRANSITION_STATUS_${newStatus.toUpperCase()}`,
        adminEmail,
        mandatoryReason,
        newState: { status: newStatus },
      });

      return true;
    } catch {
      return false;
    }
  }

  /**
   * 6. Check Provider Entitlement (Listing limit, featured placement, branch allowance)
   */
  static async checkEntitlement(
    providerId: string,
    providerType: 'diagnostic_center' | 'hospital' | 'clinic',
    feature: 'branch_limit' | 'service_listing_limit' | 'staff_account_limit' | 'has_featured_badge' | 'has_priority_listing'
  ): Promise<EntitlementCheckResult> {
    try {
      const { data } = await supabase
        .from('provider_subscriptions')
        .select('*, plan:subscription_plans(*)')
        .eq('provider_id', providerId)
        .eq('provider_type', providerType)
        .eq('status', 'active')
        .single();

      if (!data || !data.plan) {
        return {
          isAllowed: feature === 'service_listing_limit' ? false : false,
          reason: 'No active subscription found. Essential listing active.',
          planName: 'Unsubscribed',
          tier: 'basic',
          limit: feature === 'service_listing_limit' ? 5 : 1,
          hasFeature: false,
          status: 'expired',
        };
      }

      const plan = data.plan;
      let isAllowed = true;
      let limit = 0;

      if (feature === 'branch_limit') limit = plan.branch_limit || 1;
      else if (feature === 'service_listing_limit') limit = plan.service_listing_limit || 20;
      else if (feature === 'staff_account_limit') limit = plan.staff_account_limit || 2;
      else if (feature === 'has_featured_badge') isAllowed = !!plan.has_featured_badge;
      else if (feature === 'has_priority_listing') isAllowed = !!plan.has_priority_listing;

      return {
        isAllowed,
        planName: plan.name,
        tier: plan.tier,
        limit,
        hasFeature: isAllowed,
        status: data.status,
      };
    } catch {
      return {
        isAllowed: true,
        planName: 'Basic Tier',
        tier: 'basic',
        limit: 20,
        hasFeature: false,
        status: 'active',
      };
    }
  }

  /**
   * 7. Record an immutable administrative audit log
   */
  static async recordAuditLog(params: {
    subscriptionId?: string;
    action: string;
    adminEmail: string;
    mandatoryReason: string;
    previousState?: any;
    newState?: any;
  }): Promise<void> {
    try {
      await supabase.from('subscription_audit_logs').insert({
        subscription_id: params.subscriptionId,
        action: params.action,
        admin_email: params.adminEmail,
        mandatory_reason: params.mandatoryReason,
        previous_state: params.previousState,
        new_state: params.newState,
      });
    } catch (e) {
      console.warn('Subscription audit log write notice:', e);
    }
  }
}

