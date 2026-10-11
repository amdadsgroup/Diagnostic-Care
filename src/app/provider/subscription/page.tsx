'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand/BrandLogo';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { BRAND_CONSTANTS, BRAND_COLORS } from '@/config/brand';
import {
  SubscriptionService,
  DEFAULT_PLANS,
} from '@/services/subscription.service';
import {
  SubscriptionPlan,
  ProviderSubscription,
  PaymentGatewayName,
} from '@/types/subscription';
import {
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  Download,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  X,
  Phone,
} from 'lucide-react';

export default function ProviderSubscriptionPortalPage() {
  const { language } = useLanguage();

  const [plans, setPlans] = useState<SubscriptionPlan[]>(DEFAULT_PLANS);
  const [currentSub, setCurrentSub] = useState<ProviderSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  // Upgrade / Checkout Modal
  const [checkoutPlan, setCheckoutPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayName>('sslcommerz');
  const [customerPhone, setCustomerPhone] = useState('01886748564');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const p = await SubscriptionService.getPlans();
        setPlans(p);

        // Fetch demo active organization subscription
        const allSubs = await SubscriptionService.getSubscriptions();
        if (allSubs.length > 0) {
          setCurrentSub(allSubs[0]);
        }
      } catch (e) {
        console.error('Failed to load provider subscription portal data:', e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleInitiatePayment = async () => {
    if (!checkoutPlan) return;
    setCheckoutLoading(true);
    setCheckoutSuccess(null);

    try {
      const res = await fetch('/api/subscriptions/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: currentSub?.id || 'sub-provider-01',
          invoiceId: `inv-${Date.now()}`,
          gateway: selectedGateway,
          customerPhone,
          customerName: currentSub?.providerName || 'Healthcare Provider',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Payment initiation failed');
      }

      // Simulate verified server-side callback for instant demonstration
      const verifyRes = await fetch('/api/subscriptions/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentReference: data.paymentReference,
          gatewayTransactionId: `TX-${Date.now()}`,
          subscriptionId: currentSub?.id || 'sub-provider-01',
          invoiceId: `inv-${Date.now()}`,
          amountBdt: checkoutPlan.priceBdt,
          gateway: selectedGateway,
          organizationName: currentSub?.providerName || 'Healthcare Provider',
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        setCheckoutSuccess(
          language === 'bn'
            ? `✓ পেমেন্ট সফল হয়েছে! ${checkoutPlan.nameBn} সফলভাবে অ্যাক্টিভ হয়েছে। রেফারেন্স: ${data.paymentReference}`
            : `✓ Payment verified! ${checkoutPlan.name} is now active. Reference: ${data.paymentReference}`
        );
        if (currentSub) {
          setCurrentSub({
            ...currentSub,
            plan: checkoutPlan,
            priceBdt: checkoutPlan.priceBdt,
            status: 'active',
          });
        }
      }
    } catch (err: any) {
      alert(err.message || 'Payment initiation failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Top Bar */}
      <header
        style={{
          height: '70px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <BrandLogo variant="horizontal" size={30} />
          </Link>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#090D14' }}>
            {language === 'bn' ? 'প্রোভাইডার সাবস্ক্রিপশন ও বিলিং পোর্টাল' : 'Provider Subscription & Billing Portal'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <LanguageSwitcher variant="pills" showIcon />
          <Link
            href="/"
            style={{
              fontSize: '12.5px',
              fontWeight: 700,
              color: '#475569',
              textDecoration: 'none',
            }}
          >
            ← {language === 'bn' ? 'ওয়েবসাইটে ফিরে যান' : 'Back to Home'}
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #090D14 0%, #0047BA 100%)',
            borderRadius: '22px',
            padding: '28px 32px',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.15)',
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(56, 189, 248, 0.2)', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, color: '#38BDF8', marginBottom: '8px' }}>
              <Sparkles size={12} /> B2B HEALTHCARE MEMBERSHIP
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, margin: 0 }}>
              {currentSub?.providerName || 'Healthcare Provider Subscription'}
            </h1>
            <p style={{ fontSize: '13px', color: '#CBD5E1', margin: '6px 0 0 0' }}>
              {language === 'bn'
                ? 'ডায়াগনস্টিক কেয়ার পার্টনারশিপ: রিকারিং সাবস্ক্রিপশনের মাধ্যমে নিশ্চিত করুন শীর্ষ ভিজিবিলিটি ও ব্র্যাঞ্চ ম্যানেজমেন্ট।'
                : 'Manage recurring subscription billing, branch listings, and featured search visibility in Bangladesh.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ padding: '12px 18px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: '11px', color: '#93C5FD', fontWeight: 700 }}>Current Plan</div>
              <div style={{ fontSize: '18px', fontWeight: 900, marginTop: '2px' }}>{currentSub?.plan?.name || 'Professional'}</div>
            </div>
            <div style={{ padding: '12px 18px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: '11px', color: '#93C5FD', fontWeight: 700 }}>Status</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#34D399', marginTop: '2px' }}>ACTIVE</div>
            </div>
          </div>
        </div>

        {/* Current Active Plan Details Card */}
        {currentSub && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              padding: '24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                {language === 'bn' ? 'বর্তমান সাবস্ক্রিপশন ও এনটাইটেলমেন্ট' : 'Current Subscription & Entitlements'}
              </h2>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: '#10B981',
                  padding: '3px 10px',
                  borderRadius: '999px',
                }}
              >
                AUTO-RENEW ACTIVE
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', fontSize: '13px' }}>
              <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Billing Interval & Price</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#090D14', marginTop: '2px' }}>
                  ৳{currentSub.priceBdt.toLocaleString()} / {currentSub.billingInterval}
                </div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Next Renewal Date</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#090D14', marginTop: '2px' }}>
                  {new Date(currentSub.nextRenewalDate).toLocaleDateString()}
                </div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Allowed Branch Locations</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#090D14', marginTop: '2px' }}>
                  {currentSub.plan?.branchLimit || 2} Branches Supported
                </div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Search Visibility Status</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#10B981', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={16} /> Verified Top Tier Placement
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plan Upgrade & Switch Cards */}
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', margin: 0 }}>
              {language === 'bn' ? 'সাবস্ক্রিপশন প্ল্যান পরিবর্তন বা নবায়ন' : 'Upgrade or Switch Subscription Plan'}
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '4px 0 0 0' }}>
              Select an annual or monthly plan suited for your institution. Zero patient booking deductions.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {plans.map((plan) => {
              const isCurrent = currentSub?.plan?.id === plan.id || currentSub?.plan?.code === plan.code;
              return (
                <div
                  key={plan.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '24px',
                    border: isCurrent ? '2px solid #0060FA' : '1px solid #E2E8F0',
                    boxShadow: isCurrent ? '0 8px 24px rgba(0, 96, 250, 0.12)' : '0 4px 14px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#0060FA', textTransform: 'uppercase' }}>
                      {plan.tier} TIER
                    </div>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#090D14', margin: '4px 0' }}>
                      {language === 'bn' ? plan.nameBn : plan.name}
                    </h3>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: '#090D14', margin: '8px 0' }}>
                      ৳{plan.priceBdt.toLocaleString()}{' '}
                      <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>/ {plan.billingInterval}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '16px 0' }}>
                      {plan.features.map((feat, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                          <CheckCircle2 size={14} color="#10B981" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isCurrent}
                    onClick={() => {
                      setCheckoutPlan(plan);
                      setCheckoutSuccess(null);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: isCurrent ? '#F1F5F9' : BRAND_COLORS.primary,
                      color: isCurrent ? '#94A3B8' : '#FFFFFF',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: isCurrent ? 'default' : 'pointer',
                    }}
                  >
                    {isCurrent ? 'Current Active Plan' : language === 'bn' ? 'প্ল্যান বেছে নিন' : 'Select & Upgrade'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dedicated Support Hotline */}
        <div
          style={{
            padding: '20px',
            backgroundColor: '#EFF6FF',
            borderRadius: '16px',
            border: '1px solid #BFDBFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Phone size={24} color="#0060FA" />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#1E3A8A' }}>
                Need Help With Custom Enterprise Group Plans or BEFTN Bank Transfer?
              </div>
              <div style={{ fontSize: '12px', color: '#3B82F6', marginTop: '2px' }}>
                Call Diagnostic Care Dedicated B2B Billing Support: <strong>{BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}</strong>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Checkout Modal */}
      {checkoutPlan && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(6px)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '100%',
              padding: '26px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              position: 'relative',
            }}
          >
            <button
              type="button"
              onClick={() => setCheckoutPlan(null)}
              style={{ position: 'absolute', top: '18px', right: '18px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', margin: '0 0 6px 0' }}>
              Confirm Subscription Upgrade
            </h2>
            <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: '16px' }}>
              Plan: <strong>{checkoutPlan.name}</strong> • Amount: <strong style={{ color: '#0060FA' }}>৳{checkoutPlan.priceBdt.toLocaleString()}</strong> ({checkoutPlan.billingInterval})
            </div>

            {/* Gateway Selection */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Select Payment Gateway:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { id: 'sslcommerz' as PaymentGatewayName, label: 'SSLCommerz (All MFS & Cards)' },
                  { id: 'bkash' as PaymentGatewayName, label: 'bKash Checkout' },
                  { id: 'nagad' as PaymentGatewayName, label: 'Nagad Checkout' },
                  { id: 'bank_transfer' as PaymentGatewayName, label: 'Bank Transfer' },
                ].map((gw) => (
                  <button
                    key={gw.id}
                    type="button"
                    onClick={() => setSelectedGateway(gw.id)}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: `1px solid ${selectedGateway === gw.id ? '#0060FA' : '#E2E8F0'}`,
                      backgroundColor: selectedGateway === gw.id ? '#EFF6FF' : '#F8FAFC',
                      color: selectedGateway === gw.id ? '#0060FA' : '#334155',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {gw.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Phone */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Billing Contact Phone Number:
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {checkoutSuccess && (
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', fontSize: '12px', fontWeight: 700, marginBottom: '14px' }}>
                {checkoutSuccess}
              </div>
            )}

            <button
              type="button"
              disabled={checkoutLoading}
              onClick={handleInitiatePayment}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '11px',
                backgroundColor: BRAND_COLORS.primary,
                border: 'none',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 800,
                cursor: checkoutLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {checkoutLoading ? 'Initiating Gateway Session...' : `Pay ৳${checkoutPlan.priceBdt.toLocaleString()} & Activate Plan`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
