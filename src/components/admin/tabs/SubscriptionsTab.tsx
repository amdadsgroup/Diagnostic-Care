'use client';

import React, { useState, useEffect } from 'react';
import {
  SubscriptionService,
  DEFAULT_PLANS,
} from '@/services/subscription.service';
import {
  SubscriptionPlan,
  ProviderSubscription,
  SubscriptionRevenueMetrics,
  SubscriptionTier,
  BillingInterval,
  SubscriptionStatus,
} from '@/types/subscription';
import { useAdminTheme } from '../AdminThemeContext';
import { BRAND_CONSTANTS, BRAND_COLORS } from '@/config/brand';
import {
  CreditCard,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  ShieldCheck,
  Calendar,
  Building2,
  Layers,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  FileText,
  DollarSign,
  Download,
  AlertCircle,
  X,
  ChevronRight,
} from 'lucide-react';

interface SubscriptionsTabProps {
  language: 'en' | 'bn';
  adminEmail: string;
}

export default function SubscriptionsTab({ language, adminEmail }: SubscriptionsTabProps) {
  const { theme, tokens } = useAdminTheme();

  // Navigation Sub-Tabs
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'directory' | 'plans' | 'invoices'>('overview');

  // Data states
  const [metrics, setMetrics] = useState<SubscriptionRevenueMetrics | null>(null);
  const [subscriptions, setSubscriptions] = useState<ProviderSubscription[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [intervalFilter, setIntervalFilter] = useState<string>('all');

  // Selected subscription for detail view / management modal
  const [selectedSub, setSelectedSub] = useState<ProviderSubscription | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [actionStatusTarget, setActionStatusTarget] = useState<SubscriptionStatus | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Plan builder modal state
  const [editingPlan, setEditingPlan] = useState<Partial<SubscriptionPlan> | null>(null);
  const [planSaveLoading, setPlanSaveLoading] = useState(false);

  // Fetch all data
  const loadData = async () => {
    setLoading(true);
    try {
      const [m, s, p] = await Promise.all([
        SubscriptionService.getRevenueMetrics('all'),
        SubscriptionService.getSubscriptions(),
        SubscriptionService.getPlans(true),
      ]);
      setMetrics(m);
      setSubscriptions(s);
      setPlans(p);
    } catch (e) {
      console.error('Failed to load subscriptions data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered subscriptions list
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      !searchQuery ||
      sub.providerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.billingContactPhone?.includes(searchQuery) ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || sub.providerType === categoryFilter;
    const matchesInterval = intervalFilter === 'all' || sub.billingInterval === intervalFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesInterval;
  });

  // Handle status transition with mandatory reason
  const handleTransitionStatus = async () => {
    if (!selectedSub || !actionStatusTarget) return;
    if (!actionReason.trim()) {
      setActionFeedback({
        type: 'error',
        message: language === 'bn' ? 'স্ট্যাটাস পরিবর্তনের জন্য কারণ লেখা বাধ্যতামূলক।' : 'A mandatory audit reason is required for status transition.',
      });
      return;
    }

    setActionLoading(true);
    setActionFeedback(null);
    try {
      const success = await SubscriptionService.updateSubscriptionStatus({
        subscriptionId: selectedSub.id,
        newStatus: actionStatusTarget,
        mandatoryReason: actionReason.trim(),
        adminEmail,
      });

      if (success) {
        setActionFeedback({
          type: 'success',
          message: language === 'bn' ? 'সাবস্ক্রিপশন স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে।' : 'Subscription status updated and audited successfully.',
        });
        setSelectedSub({ ...selectedSub, status: actionStatusTarget });
        setActionReason('');
        setActionStatusTarget(null);
        await loadData();
      } else {
        throw new Error('Failed to update status');
      }
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Status transition failed',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle plan save
  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan || !editingPlan.name || !editingPlan.code) return;

    setPlanSaveLoading(true);
    try {
      await SubscriptionService.savePlan(editingPlan, adminEmail);
      setEditingPlan(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error saving plan');
    } finally {
      setPlanSaveLoading(false);
    }
  };

  const getStatusBadge = (status: SubscriptionStatus) => {
    switch (status) {
      case 'active':
        return { label: 'Active', labelBn: 'সক্রিয়', bg: 'rgba(16, 185, 129, 0.12)', color: '#10B981', border: '#10B981' };
      case 'pending_payment':
        return { label: 'Pending Payment', labelBn: 'পেমেন্ট বাকি', bg: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', border: '#F59E0B' };
      case 'payment_overdue':
        return { label: 'Overdue', labelBn: 'বিল বকেয়া', bg: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', border: '#EF4444' };
      case 'grace_period':
        return { label: 'Grace Period', labelBn: 'গ্রেস পিরিয়ড', bg: 'rgba(217, 119, 6, 0.12)', color: '#D97706', border: '#D97706' };
      case 'suspended':
        return { label: 'Suspended', labelBn: 'স্থগিত', bg: 'rgba(100, 116, 139, 0.12)', color: '#64748B', border: '#64748B' };
      case 'cancelled':
        return { label: 'Cancelled', labelBn: 'বাতিলকৃত', bg: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', border: '#EF4444' };
      case 'expired':
        return { label: 'Expired', labelBn: 'মেয়াদোত্তীর্ণ', bg: 'rgba(100, 116, 139, 0.12)', color: '#64748B', border: '#64748B' };
      default:
        return { label: status, labelBn: status, bg: 'rgba(100, 116, 139, 0.12)', color: '#64748B', border: '#64748B' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header & Business Model Invariant Banner */}
      <div
        style={{
          backgroundColor: tokens.cardBg,
          backdropFilter: tokens.backdropBlur,
          borderRadius: '20px',
          padding: '24px 28px',
          border: `1px solid ${tokens.cardBorder}`,
          boxShadow: tokens.cardShadow,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: tokens.primary,
                backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.12)' : '#EFF6FF',
                padding: '3px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              B2B Healthcare Marketplace SaaS
            </span>
            <span style={{ fontSize: '12px', color: tokens.textMuted }}>•</span>
            <span style={{ fontSize: '12px', color: tokens.textMuted }}>
              Zero Patient Commissions • 100% Predictable Recurring Revenue
            </span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
            {language === 'bn' ? 'সাবস্ক্রিপশন অপারেশনস ও প্রোভাইডার রেভিনিউ হাব' : 'Subscription Operations & Revenue Hub'}
          </h2>
          <p style={{ fontSize: '12.5px', color: tokens.textMuted, margin: '4px 0 0 0' }}>
            {language === 'bn'
              ? 'হাসপাতাল ও ডায়াগনস্টিক সেন্টারের বাৎসরিক ও মাসিক সাবস্ক্রিপশন ব্যবস্থাপনা, বিলিং অডিট এবং লাইফসাইকেল কন্ট্রোল।'
              : 'Centralized MRR/ARR management, recurring billing plans, lifecycle auditing, and entitlement governance.'}
          </p>
        </div>

        {/* Global Action / Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: tokens.cardBgSubtle,
              border: `1px solid ${tokens.cardBorder}`,
              color: tokens.textPrimary,
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            <span>{language === 'bn' ? 'রিফ্রেশ ডাটা' : 'Refresh'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingPlan({
                code: `plan_${Date.now()}`,
                name: '',
                nameBn: '',
                tier: 'professional',
                billingInterval: 'monthly',
                priceBdt: 1500,
                branchLimit: 2,
                serviceListingLimit: 50,
                staffAccountLimit: 5,
                providerCategories: ['diagnostic_center', 'hospital', 'clinic'],
                features: ['Verified Provider Badge', 'Priority Search Listing'],
                trialDays: 0,
                isPublished: true,
                isArchived: false,
                sortOrder: plans.length + 1,
              });
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: BRAND_COLORS.primary,
              border: 'none',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 96, 250, 0.3)',
            }}
          >
            <Plus size={15} />
            <span>{language === 'bn' ? 'নতুন প্ল্যান তৈরি' : 'Create Plan'}</span>
          </button>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: `1px solid ${tokens.cardBorder}`,
          paddingBottom: '12px',
        }}
      >
        {[
          { id: 'overview', label: 'Subscription Overview & MRR', labelBn: 'রেভিনিউ ওভারভিউ ও MRR', icon: TrendingUp },
          { id: 'directory', label: `Provider Directory (${subscriptions.length})`, labelBn: `প্রোভাইডার ডিরেক্টরি (${subscriptions.length})`, icon: Building2 },
          { id: 'plans', label: `Pricing & Plans (${plans.length})`, labelBn: `প্ল্যান ও প্রাইসিং (${plans.length})`, icon: Layers },
          { id: 'invoices', label: 'Invoices & Billing Ledger', labelBn: 'ইনভয়েস ও বিলিং লেজার', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '11px',
                border: 'none',
                backgroundColor: isActive ? BRAND_COLORS.primary : 'transparent',
                color: isActive ? '#FFFFFF' : tokens.textSecondary,
                fontSize: '13px',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} />
              <span>{language === 'bn' ? tab.labelBn : tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* VIEW 1: REVENUE OVERVIEW & METRICS                             */}
      {/* ============================================================== */}
      {activeSubTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Executive MRR / ARR Glass Highlight Banner */}
          <div
            style={{
              background:
                theme === 'dark'
                  ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 13, 20, 0.98) 100%)'
                  : 'linear-gradient(135deg, #090D14 0%, #003699 100%)',
              borderRadius: '20px',
              padding: '26px 30px',
              color: '#FFFFFF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '24px',
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', letterSpacing: '0.08em' }}>
                  {language === 'bn' ? 'নর্মালাইজড মাসিক সাবস্ক্রিপশন আয় (MRR)' : 'MONTHLY RECURRING REVENUE (MRR)'}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    backgroundColor: 'rgba(56, 189, 248, 0.2)',
                    color: '#38BDF8',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  AUDITED BDT
                </span>
              </div>
              <div style={{ fontSize: '36px', fontWeight: 900, display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ color: '#38BDF8' }}>{BRAND_CONSTANTS.CURRENCY_SYMBOL}</span>
                <span>{(metrics?.mrrBdt || 0).toLocaleString()}</span>
                <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>/ Month</span>
              </div>
              <div style={{ fontSize: '12px', color: '#CBD5E1', marginTop: '6px' }}>
                {language === 'bn'
                  ? `বাৎসরিক রান-রেট (ARR): ৳${(metrics?.arrBdt || 0).toLocaleString()} • সক্রিয় গ্রাহক সংখ্যা: ${metrics?.activeSubscriptions || 0}`
                  : `Annual Recurring Revenue (ARR): ৳${(metrics?.arrBdt || 0).toLocaleString()} • Active Subscribers: ${metrics?.activeSubscriptions || 0}`}
              </div>
            </div>

            {/* Quick KPI stats in banner */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ padding: '12px 18px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <div style={{ fontSize: '11px', color: '#93C5FD', fontWeight: 600 }}>Cash Collected</div>
                <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px' }}>
                  ৳{(metrics?.cashCollectedBdt || 0).toLocaleString()}
                </div>
              </div>
              <div style={{ padding: '12px 18px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <div style={{ fontSize: '11px', color: '#93C5FD', fontWeight: 600 }}>Average ARPU</div>
                <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px' }}>
                  ৳{(metrics?.arpuBdt || 0).toLocaleString()}
                </div>
              </div>
              <div style={{ padding: '12px 18px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <div style={{ fontSize: '11px', color: '#93C5FD', fontWeight: 600 }}>Retention Rate</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#34D399', marginTop: '2px' }}>
                  {metrics?.renewalSuccessRatePercent || 100}%
                </div>
              </div>
            </div>
          </div>

          {/* 8 Primary Subscription KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              {
                title: 'Total Subscribed Orgs',
                titleBn: 'নিবন্ধিত প্রতিষ্ঠান',
                val: metrics?.totalSubscribers || 0,
                color: '#0060FA',
                bg: 'rgba(0, 96, 250, 0.12)',
                icon: Building2,
              },
              {
                title: 'Active Paid Subscriptions',
                titleBn: 'সক্রিয় পেইড সাবস্ক্রিপশন',
                val: metrics?.activeSubscriptions || 0,
                color: '#10B981',
                bg: 'rgba(16, 185, 129, 0.12)',
                icon: CheckCircle2,
              },
              {
                title: 'Expiring Within 7 Days',
                titleBn: '৭ দিনের মধ্যে মেয়াদোত্তীর্ণ',
                val: metrics?.expiringSoonCount || 0,
                color: '#F59E0B',
                bg: 'rgba(245, 158, 11, 0.12)',
                icon: Clock,
              },
              {
                title: 'Payment Overdue / Unpaid',
                titleBn: 'বকেয়া বিল ও পেমেন্ট বাকি',
                val: (metrics?.overdueCount || 0) + (metrics?.gracePeriodCount || 0),
                color: '#EF4444',
                bg: 'rgba(239, 68, 68, 0.12)',
                icon: AlertTriangle,
              },
              {
                title: 'Trial Enrollments',
                titleBn: 'ট্রায়াল সাবস্ক্রিপশন',
                val: metrics?.trialSubscriptions || 0,
                color: '#8B5CF6',
                bg: 'rgba(139, 92, 246, 0.12)',
                icon: Sparkles,
              },
              {
                title: 'Cancelled / Churned',
                titleBn: 'বাতিলকৃত সাবস্ক্রিপশন',
                val: metrics?.cancelledCount || 0,
                color: '#64748B',
                bg: 'rgba(100, 116, 139, 0.12)',
                icon: XCircle,
              },
              {
                title: 'Monthly Plan Volume',
                titleBn: 'মাসিক প্ল্যান ভলিউম',
                val: `৳${(metrics?.revenueByInterval?.monthly || 0).toLocaleString()}`,
                color: '#0EA5E9',
                bg: 'rgba(14, 165, 233, 0.12)',
                icon: Calendar,
              },
              {
                title: 'Annual Plan Volume',
                titleBn: 'বাৎসরিক প্ল্যান ভলিউম',
                val: `৳${(metrics?.revenueByInterval?.annual || 0).toLocaleString()}`,
                color: '#6366F1',
                bg: 'rgba(99, 102, 241, 0.12)',
                icon: DollarSign,
              },
            ].map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: tokens.cardBg,
                    backdropFilter: tokens.backdropBlur,
                    borderRadius: '16px',
                    padding: '18px 20px',
                    border: `1px solid ${tokens.cardBorder}`,
                    boxShadow: tokens.cardShadow,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: kpi.bg,
                        color: kpi.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <ArrowUpRight size={14} color={tokens.textMuted} />
                  </div>
                  <div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: tokens.textPrimary, letterSpacing: '-0.02em' }}>
                      {typeof kpi.val === 'number' ? kpi.val.toLocaleString() : kpi.val}
                    </div>
                    <div style={{ fontSize: '12px', color: tokens.textMuted, fontWeight: 600, marginTop: '2px' }}>
                      {language === 'bn' ? kpi.titleBn : kpi.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Revenue Breakdown by Tier & Provider Category */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            {/* By Tier */}
            <div
              style={{
                backgroundColor: tokens.cardBg,
                backdropFilter: tokens.backdropBlur,
                borderRadius: '18px',
                padding: '22px',
                border: `1px solid ${tokens.cardBorder}`,
                boxShadow: tokens.cardShadow,
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: tokens.textPrimary, margin: '0 0 16px 0' }}>
                {language === 'bn' ? 'প্ল্যান টায়ার অনুযায়ী MRR বিন্যাস' : 'MRR Contribution by Subscription Tier'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { tier: 'Basic Plan', bdt: metrics?.revenueByTier?.basic || 0, color: '#0060FA' },
                  { tier: 'Professional Plan', bdt: metrics?.revenueByTier?.professional || 0, color: '#10B981' },
                  { tier: 'Premium Plan', bdt: metrics?.revenueByTier?.premium || 0, color: '#8B5CF6' },
                  { tier: 'Enterprise Plan', bdt: metrics?.revenueByTier?.enterprise || 0, color: '#F59E0B' },
                ].map((item, idx) => {
                  const total = metrics?.mrrBdt || 1;
                  const pct = Math.min(100, Math.round((item.bdt / total) * 100));
                  return (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, color: tokens.textPrimary }}>{item.tier}</span>
                        <strong style={{ color: item.color }}>৳{item.bdt.toLocaleString()} ({pct}%)</strong>
                      </div>
                      <div style={{ height: '6px', borderRadius: '999px', backgroundColor: tokens.cardBorderSubtle, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: item.color, borderRadius: '999px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* By Provider Category */}
            <div
              style={{
                backgroundColor: tokens.cardBg,
                backdropFilter: tokens.backdropBlur,
                borderRadius: '18px',
                padding: '22px',
                border: `1px solid ${tokens.cardBorder}`,
                boxShadow: tokens.cardShadow,
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: tokens.textPrimary, margin: '0 0 16px 0' }}>
                {language === 'bn' ? 'প্রতিষ্ঠান ক্যাটাগরি অনুযায়ী আয়' : 'Recurring Volume by Provider Category'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { cat: 'Diagnostic Centers', bdt: metrics?.revenueByProviderCategory?.diagnosticCenters || 0, color: '#8B5CF6' },
                  { cat: 'Hospitals & Medical Groups', bdt: metrics?.revenueByProviderCategory?.hospitals || 0, color: '#06B6D4' },
                  { cat: 'Specialized Clinics', bdt: metrics?.revenueByProviderCategory?.clinics || 0, color: '#10B981' },
                ].map((item, idx) => {
                  const total = metrics?.mrrBdt || 1;
                  const pct = Math.min(100, Math.round((item.bdt / total) * 100));
                  return (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, color: tokens.textPrimary }}>{item.cat}</span>
                        <strong style={{ color: item.color }}>৳{item.bdt.toLocaleString()} ({pct}%)</strong>
                      </div>
                      <div style={{ height: '6px', borderRadius: '999px', backgroundColor: tokens.cardBorderSubtle, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: item.color, borderRadius: '999px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 2: PROVIDER SUBSCRIPTION DIRECTORY                        */}
      {/* ============================================================== */}
      {activeSubTab === 'directory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Search & Multi-Filters Toolbar */}
          <div
            style={{
              backgroundColor: tokens.cardBg,
              backdropFilter: tokens.backdropBlur,
              borderRadius: '16px',
              padding: '16px 20px',
              border: `1px solid ${tokens.cardBorder}`,
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {/* Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: tokens.inputBg,
                border: `1px solid ${tokens.inputBorder}`,
                borderRadius: '10px',
                padding: '7px 12px',
                flex: 1,
                minWidth: '220px',
              }}
            >
              <Search size={15} color={tokens.textMuted} style={{ marginRight: '8px' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'bn' ? 'প্রতিষ্ঠান, ফোন বা আইডি দিয়ে খুঁজুন...' : 'Search by provider name, phone, or ID...'}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '12.5px',
                  width: '100%',
                  color: tokens.textPrimary,
                }}
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                backgroundColor: tokens.inputBg,
                border: `1px solid ${tokens.inputBorder}`,
                borderRadius: '10px',
                padding: '8px 12px',
                fontSize: '12px',
                color: tokens.textPrimary,
                outline: 'none',
              }}
            >
              <option value="all">{language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}</option>
              <option value="diagnostic_center">Diagnostic Centers</option>
              <option value="hospital">Hospitals</option>
              <option value="clinic">Clinics</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                backgroundColor: tokens.inputBg,
                border: `1px solid ${tokens.inputBorder}`,
                borderRadius: '10px',
                padding: '8px 12px',
                fontSize: '12px',
                color: tokens.textPrimary,
                outline: 'none',
              }}
            >
              <option value="all">{language === 'bn' ? 'সকল স্ট্যাটাস' : 'All Statuses'}</option>
              <option value="active">Active (সক্রিয়)</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="payment_overdue">Payment Overdue</option>
              <option value="grace_period">Grace Period</option>
              <option value="suspended">Suspended</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Interval Filter */}
            <select
              value={intervalFilter}
              onChange={(e) => setIntervalFilter(e.target.value)}
              style={{
                backgroundColor: tokens.inputBg,
                border: `1px solid ${tokens.inputBorder}`,
                borderRadius: '10px',
                padding: '8px 12px',
                fontSize: '12px',
                color: tokens.textPrimary,
                outline: 'none',
              }}
            >
              <option value="all">{language === 'bn' ? 'সকল বিলিং সাইকেল' : 'All Intervals'}</option>
              <option value="monthly">Monthly (মাসিক)</option>
              <option value="annual">Annual (বাৎসরিক)</option>
            </select>
          </div>

          {/* Directory Table */}
          <div
            style={{
              backgroundColor: tokens.cardBg,
              backdropFilter: tokens.backdropBlur,
              borderRadius: '16px',
              border: `1px solid ${tokens.cardBorder}`,
              boxShadow: tokens.cardShadow,
              overflowX: 'auto',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ backgroundColor: tokens.tableHeaderBg, borderBottom: `1px solid ${tokens.tableBorder}` }}>
                  <th style={{ padding: '12px 16px', color: tokens.textMuted, fontWeight: 700 }}>ORGANIZATION</th>
                  <th style={{ padding: '12px 16px', color: tokens.textMuted, fontWeight: 700 }}>PLAN & TIER</th>
                  <th style={{ padding: '12px 16px', color: tokens.textMuted, fontWeight: 700 }}>CYCLE & PRICE</th>
                  <th style={{ padding: '12px 16px', color: tokens.textMuted, fontWeight: 700 }}>STATUS</th>
                  <th style={{ padding: '12px 16px', color: tokens.textMuted, fontWeight: 700 }}>PERIOD END / RENEWAL</th>
                  <th style={{ padding: '12px 16px', color: tokens.textMuted, fontWeight: 700 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.map((sub) => {
                  const badge = getStatusBadge(sub.status);
                  return (
                    <tr
                      key={sub.id}
                      style={{
                        borderBottom: `1px solid ${tokens.tableBorder}`,
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = tokens.tableRowHover)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Organization info */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 800, color: tokens.textPrimary }}>{sub.providerName}</div>
                        <div style={{ fontSize: '11px', color: tokens.textMuted, marginTop: '2px' }}>
                          {sub.providerType === 'diagnostic_center' ? 'Diagnostic Center' : sub.providerType === 'hospital' ? 'Hospital' : 'Clinic'}
                          {sub.providerDistrict ? ` • ${sub.providerDistrict}` : ''}
                        </div>
                      </td>

                      {/* Plan & Tier */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: tokens.textPrimary }}>{sub.plan?.name || 'Custom B2B Tier'}</div>
                        <div style={{ fontSize: '11px', color: tokens.primary, fontWeight: 600 }}>
                          {(sub.plan?.tier || 'basic').toUpperCase()}
                        </div>
                      </td>

                      {/* Price */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 800, color: tokens.textPrimary }}>
                          ৳{sub.priceBdt.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '11px', color: tokens.textMuted, textTransform: 'capitalize' }}>
                          {sub.billingInterval}
                        </div>
                      </td>

                      {/* Status badge */}
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 9px',
                            borderRadius: '6px',
                            backgroundColor: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                          }}
                        >
                          {language === 'bn' ? badge.labelBn : badge.label}
                        </span>
                      </td>

                      {/* Period End */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ color: tokens.textPrimary, fontWeight: 600 }}>
                          {new Date(sub.nextRenewalDate).toLocaleDateString()}
                        </div>
                        <div style={{ fontSize: '11px', color: tokens.textMuted }}>
                          Auto-renew: {sub.autoRenew ? 'Enabled' : 'Off'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSub(sub);
                            setActionFeedback(null);
                            setActionReason('');
                            setActionStatusTarget(null);
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            backgroundColor: tokens.cardBgSubtle,
                            border: `1px solid ${tokens.cardBorder}`,
                            color: tokens.primary,
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Eye size={13} />
                          <span>{language === 'bn' ? 'ম্যানেজ' : 'Manage'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 3: CONFIGURABLE PLANS & PRICING BUILDER                   */}
      {/* ============================================================== */}
      {activeSubTab === 'plans' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              style={{
                backgroundColor: tokens.cardBg,
                backdropFilter: tokens.backdropBlur,
                borderRadius: '18px',
                padding: '24px',
                border: `1px solid ${plan.hasFeaturedBadge ? BRAND_COLORS.primary : tokens.cardBorder}`,
                boxShadow: plan.hasFeaturedBadge ? tokens.cardShadowHover : tokens.cardShadow,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              {plan.hasFeaturedBadge && (
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    fontSize: '10px',
                    fontWeight: 800,
                    backgroundColor: BRAND_COLORS.primary,
                    color: '#FFFFFF',
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                >
                  POPULAR
                </div>
              )}

              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: tokens.primary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {plan.tier.toUpperCase()} TIER
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: '4px 0 8px 0' }}>
                  {language === 'bn' ? plan.nameBn : plan.name}
                </h3>
                <div style={{ fontSize: '28px', fontWeight: 900, color: tokens.textPrimary, display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span>{BRAND_CONSTANTS.CURRENCY_SYMBOL}</span>
                  <span>{plan.priceBdt.toLocaleString()}</span>
                  <span style={{ fontSize: '12px', color: tokens.textMuted, fontWeight: 600 }}>/ {plan.billingInterval}</span>
                </div>
                <p style={{ fontSize: '12px', color: tokens.textMuted, margin: '8px 0 16px 0', lineHeight: 1.4 }}>
                  {language === 'bn' ? plan.descriptionBn : plan.description}
                </p>

                {/* Limits summary */}
                <div style={{ padding: '10px', backgroundColor: tokens.cardBgSubtle, borderRadius: '10px', fontSize: '11.5px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: tokens.textMuted }}>Branch Limit:</span>
                    <strong style={{ color: tokens.textPrimary }}>{plan.branchLimit} Locations</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: tokens.textMuted }}>Service Listings:</span>
                    <strong style={{ color: tokens.textPrimary }}>Up to {plan.serviceListingLimit}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: tokens.textMuted }}>Staff Accounts:</span>
                    <strong style={{ color: tokens.textPrimary }}>{plan.staffAccountLimit} Users</strong>
                  </div>
                </div>

                {/* Features list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                  {plan.features.map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: tokens.textSecondary }}>
                      <CheckCircle2 size={13} color="#10B981" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit button */}
              <button
                type="button"
                onClick={() => setEditingPlan(plan)}
                style={{
                  width: '100%',
                  padding: '9px',
                  borderRadius: '10px',
                  backgroundColor: tokens.cardBgSubtle,
                  border: `1px solid ${tokens.cardBorder}`,
                  color: tokens.textPrimary,
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Edit size={14} />
                <span>{language === 'bn' ? 'প্ল্যান কনফিগার করুন' : 'Edit Plan Configuration'}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 4: INVOICES & BILLING LEDGER                              */}
      {/* ============================================================== */}
      {activeSubTab === 'invoices' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              backgroundColor: tokens.cardBg,
              backdropFilter: tokens.backdropBlur,
              borderRadius: '16px',
              padding: '20px',
              border: `1px solid ${tokens.cardBorder}`,
              boxShadow: tokens.cardShadow,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
                  {language === 'bn' ? 'সাবস্ক্রিপশন ইনভয়েস ও রসিদ হিস্ট্রি' : 'Subscription Invoices & Receipts'}
                </h3>
                <div style={{ fontSize: '11px', color: tokens.textMuted, marginTop: '2px' }}>
                  Immutable BDT tax & invoice records generated server-side.
                </div>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: tokens.tableHeaderBg, borderBottom: `1px solid ${tokens.tableBorder}` }}>
                    <th style={{ padding: '10px 14px', color: tokens.textMuted }}>INVOICE #</th>
                    <th style={{ padding: '10px 14px', color: tokens.textMuted }}>ORGANIZATION</th>
                    <th style={{ padding: '10px 14px', color: tokens.textMuted }}>BILLING PERIOD</th>
                    <th style={{ padding: '10px 14px', color: tokens.textMuted }}>TOTAL AMOUNT</th>
                    <th style={{ padding: '10px 14px', color: tokens.textMuted }}>STATUS</th>
                    <th style={{ padding: '10px 14px', color: tokens.textMuted }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { no: 'INV-2026-0081', org: 'পপুলার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার)', period: 'Oct 01, 2026 - Oct 31, 2026', total: 3500, status: 'paid' },
                    { no: 'INV-2026-0082', org: 'ইবনে সিনা স্পেশালাইজড ক্লিনিক', period: 'Oct 01, 2026 - Sep 30, 2027', total: 15000, status: 'paid' },
                    { no: 'INV-2026-0083', org: 'সিলেট সেন্ট্রাল জেনারেল হাসপাতাল', period: 'Oct 01, 2026 - Oct 31, 2026', total: 8000, status: 'paid' },
                    { no: 'INV-2026-0084', org: 'মেডিনোভা মেডিকেল সার্ভিসেস', period: 'Sep 01, 2026 - Sep 30, 2026', total: 500, status: 'overdue' },
                  ].map((inv, idx) => (
                    <tr key={idx} style={{ borderBottom: `1px solid ${tokens.tableBorder}` }}>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: tokens.primary }}>{inv.no}</td>
                      <td style={{ padding: '12px 14px', color: tokens.textPrimary, fontWeight: 600 }}>{inv.org}</td>
                      <td style={{ padding: '12px 14px', color: tokens.textMuted }}>{inv.period}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: tokens.textPrimary }}>৳{inv.total.toLocaleString()}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: inv.status === 'paid' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                            color: inv.status === 'paid' ? '#10B981' : '#EF4444',
                          }}
                        >
                          {inv.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <button
                          type="button"
                          onClick={() => alert(`Downloading verified receipt for ${inv.no}...`)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            backgroundColor: tokens.cardBgSubtle,
                            border: `1px solid ${tokens.cardBorder}`,
                            color: tokens.textPrimary,
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Download size={12} />
                          <span>PDF Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: SUBSCRIPTION DETAIL & LIFECYCLE MANAGEMENT             */}
      {/* ============================================================== */}
      {selectedSub && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
              borderRadius: '20px',
              border: `1px solid ${tokens.cardBorder}`,
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: tokens.cardShadowHover,
              position: 'relative',
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedSub(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                border: 'none',
                background: 'transparent',
                color: tokens.textMuted,
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div style={{ marginBottom: '20px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: tokens.primary,
                  backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.12)' : '#EFF6FF',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                }}
              >
                Subscription ID: {selectedSub.id}
              </span>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: '6px 0 2px 0' }}>
                {selectedSub.providerName}
              </h2>
              <div style={{ fontSize: '12px', color: tokens.textMuted }}>
                Contact: {selectedSub.billingContactName} ({selectedSub.billingContactPhone})
              </div>
            </div>

            {/* Current Plan Summary Card */}
            <div
              style={{
                padding: '16px',
                backgroundColor: tokens.cardBgSubtle,
                borderRadius: '14px',
                border: `1px solid ${tokens.cardBorder}`,
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: tokens.textPrimary }}>
                  {selectedSub.plan?.name || 'Standard Tier'}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: getStatusBadge(selectedSub.status).bg,
                    color: getStatusBadge(selectedSub.status).color,
                  }}
                >
                  {selectedSub.status.toUpperCase()}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                <div>
                  <span style={{ color: tokens.textMuted }}>Amount:</span>{' '}
                  <strong style={{ color: tokens.textPrimary }}>৳{selectedSub.priceBdt.toLocaleString()}</strong> ({selectedSub.billingInterval})
                </div>
                <div>
                  <span style={{ color: tokens.textMuted }}>Current Period End:</span>{' '}
                  <strong style={{ color: tokens.textPrimary }}>{new Date(selectedSub.currentPeriodEnd).toLocaleDateString()}</strong>
                </div>
                <div>
                  <span style={{ color: tokens.textMuted }}>Next Renewal:</span>{' '}
                  <strong style={{ color: tokens.textPrimary }}>{new Date(selectedSub.nextRenewalDate).toLocaleDateString()}</strong>
                </div>
                <div>
                  <span style={{ color: tokens.textMuted }}>Auto-Renew:</span>{' '}
                  <strong style={{ color: selectedSub.autoRenew ? '#10B981' : '#EF4444' }}>
                    {selectedSub.autoRenew ? 'Active' : 'Disabled'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Mandatory Reason Lifecycle Action Form */}
            <div
              style={{
                padding: '16px',
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
                borderRadius: '14px',
                border: `1px solid ${tokens.cardBorder}`,
                marginBottom: '16px',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 800, color: tokens.textPrimary, marginBottom: '8px' }}>
                {language === 'bn' ? 'প্রশাসনিক স্ট্যাটাস পরিবর্তন (অডিট সংরক্ষিত)' : 'Administrative Lifecycle Action'}
              </div>
              <p style={{ fontSize: '11.5px', color: tokens.textMuted, margin: '0 0 12px 0' }}>
                Every subscription adjustment requires a mandatory business reason and is permanently recorded in the immutable audit log.
              </p>

              {/* Status Selector */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {[
                  { status: 'active' as SubscriptionStatus, label: 'Activate (সক্রিয়)' },
                  { status: 'grace_period' as SubscriptionStatus, label: 'Grace Period (গ্রেস পিরিয়ড)' },
                  { status: 'suspended' as SubscriptionStatus, label: 'Suspend (স্থগিত)' },
                  { status: 'cancelled' as SubscriptionStatus, label: 'Cancel (বাতিল)' },
                ].map((act) => (
                  <button
                    key={act.status}
                    type="button"
                    onClick={() => setActionStatusTarget(act.status)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${actionStatusTarget === act.status ? BRAND_COLORS.primary : tokens.cardBorder}`,
                      backgroundColor: actionStatusTarget === act.status ? BRAND_COLORS.primary : tokens.cardBgSubtle,
                      color: actionStatusTarget === act.status ? '#FFFFFF' : tokens.textPrimary,
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {act.label}
                  </button>
                ))}
              </div>

              {/* Mandatory Reason Input */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: tokens.textSecondary, marginBottom: '4px' }}>
                  Mandatory Audit Reason (বাধ্যতামূলক কারণ) *
                </label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="e.g. Verified manual bank transfer slip #DBBL-88192 from Director."
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: `1px solid ${tokens.inputBorder}`,
                    backgroundColor: tokens.inputBg,
                    color: tokens.textPrimary,
                    fontSize: '12px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Feedback Alert */}
              {actionFeedback && (
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    backgroundColor: actionFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                    color: actionFeedback.type === 'success' ? '#10B981' : '#EF4444',
                  }}
                >
                  {actionFeedback.message}
                </div>
              )}

              {/* Submit Action Button */}
              <button
                type="button"
                onClick={handleTransitionStatus}
                disabled={actionLoading || !actionStatusTarget}
                style={{
                  width: '100%',
                  padding: '9px',
                  borderRadius: '10px',
                  backgroundColor: BRAND_COLORS.primary,
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: actionLoading || !actionStatusTarget ? 'not-allowed' : 'pointer',
                }}
              >
                {actionLoading ? 'Updating Audit Ledger...' : 'Commit Status Change & Record Audit Log'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: PLAN BUILDER & PRICING CONFIGURATOR                   */}
      {/* ============================================================== */}
      {editingPlan && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
              borderRadius: '20px',
              border: `1px solid ${tokens.cardBorder}`,
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '26px',
              boxShadow: tokens.cardShadowHover,
              position: 'relative',
            }}
          >
            <button
              type="button"
              onClick={() => setEditingPlan(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                border: 'none',
                background: 'transparent',
                color: tokens.textMuted,
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: '0 0 16px 0' }}>
              {editingPlan.id ? 'Edit Plan Configuration' : 'Create New Subscription Plan'}
            </h2>

            <form onSubmit={handleSavePlan} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary }}>Plan Name (English) *</label>
                <input
                  type="text"
                  required
                  value={editingPlan.name || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: `1px solid ${tokens.inputBorder}`,
                    backgroundColor: tokens.inputBg,
                    color: tokens.textPrimary,
                    fontSize: '12.5px',
                    boxSizing: 'border-box',
                    marginTop: '4px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary }}>প্ল্যানের নাম (বাংলা) *</label>
                <input
                  type="text"
                  required
                  value={editingPlan.nameBn || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, nameBn: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: `1px solid ${tokens.inputBorder}`,
                    backgroundColor: tokens.inputBg,
                    color: tokens.textPrimary,
                    fontSize: '12.5px',
                    boxSizing: 'border-box',
                    marginTop: '4px',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary }}>Price in BDT (৳) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingPlan.priceBdt ?? 500}
                    onChange={(e) => setEditingPlan({ ...editingPlan, priceBdt: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: `1px solid ${tokens.inputBorder}`,
                      backgroundColor: tokens.inputBg,
                      color: tokens.textPrimary,
                      fontSize: '12.5px',
                      boxSizing: 'border-box',
                      marginTop: '4px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary }}>Billing Interval *</label>
                  <select
                    value={editingPlan.billingInterval || 'monthly'}
                    onChange={(e) => setEditingPlan({ ...editingPlan, billingInterval: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: `1px solid ${tokens.inputBorder}`,
                      backgroundColor: tokens.inputBg,
                      color: tokens.textPrimary,
                      fontSize: '12.5px',
                      boxSizing: 'border-box',
                      marginTop: '4px',
                    }}
                  >
                    <option value="monthly">Monthly (মাসিক)</option>
                    <option value="annual">Annual (বাৎসরিক)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: tokens.textSecondary }}>Branch Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={editingPlan.branchLimit ?? 1}
                    onChange={(e) => setEditingPlan({ ...editingPlan, branchLimit: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: `1px solid ${tokens.inputBorder}`,
                      backgroundColor: tokens.inputBg,
                      color: tokens.textPrimary,
                      boxSizing: 'border-box',
                      marginTop: '4px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: tokens.textSecondary }}>Service Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={editingPlan.serviceListingLimit ?? 20}
                    onChange={(e) => setEditingPlan({ ...editingPlan, serviceListingLimit: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: `1px solid ${tokens.inputBorder}`,
                      backgroundColor: tokens.inputBg,
                      color: tokens.textPrimary,
                      boxSizing: 'border-box',
                      marginTop: '4px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: tokens.textSecondary }}>Staff Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={editingPlan.staffAccountLimit ?? 2}
                    onChange={(e) => setEditingPlan({ ...editingPlan, staffAccountLimit: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: `1px solid ${tokens.inputBorder}`,
                      backgroundColor: tokens.inputBg,
                      color: tokens.textPrimary,
                      boxSizing: 'border-box',
                      marginTop: '4px',
                    }}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: tokens.textPrimary, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editingPlan.hasFeaturedBadge ?? false}
                    onChange={(e) => setEditingPlan({ ...editingPlan, hasFeaturedBadge: e.target.checked })}
                  />
                  Featured Badge
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: tokens.textPrimary, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editingPlan.hasPriorityListing ?? false}
                    onChange={(e) => setEditingPlan({ ...editingPlan, hasPriorityListing: e.target.checked })}
                  />
                  Priority Search Ranking
                </label>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  style={{
                    flex: 1,
                    padding: '9px',
                    borderRadius: '10px',
                    backgroundColor: tokens.cardBgSubtle,
                    border: `1px solid ${tokens.cardBorder}`,
                    color: tokens.textPrimary,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={planSaveLoading}
                  style={{
                    flex: 2,
                    padding: '9px',
                    borderRadius: '10px',
                    backgroundColor: BRAND_COLORS.primary,
                    border: 'none',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: planSaveLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {planSaveLoading ? 'Saving...' : 'Save Plan Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
