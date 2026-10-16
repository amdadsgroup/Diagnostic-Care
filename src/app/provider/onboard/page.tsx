'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BRAND_CONSTANTS, BRAND_COLORS } from '@/config/brand';
import { BrandLogo } from '@/components/brand/BrandLogo';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft, Building2, TestTube2, CheckCircle2, ShieldCheck, Sparkles, PhoneCall } from 'lucide-react';
import LoadingButton from '@/components/auth/LoadingButton';
import FormField from '@/components/auth/FormField';
import { AuthError, AuthSuccess } from '@/components/auth/AuthAlerts';

export default function ProviderOnboardPage() {
  const { language } = useLanguage();

  const [providerType, setProviderType] = useState<'HOSPITAL' | 'DIAGNOSTIC_CENTER'>('DIAGNOSTIC_CENTER');
  const [orgName, setOrgName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [email, setEmail] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [dghsNumber, setDghsNumber] = useState('');
  const [district, setDistrict] = useState('Moulvibazar');
  const [address, setAddress] = useState('');
  const [selectedPlanTier, setSelectedPlanTier] = useState<'basic' | 'professional' | 'premium' | 'enterprise'>('professional');
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!orgName.trim() || !contactName.trim() || !contactPhone.trim()) {
      setError(
        language === 'bn'
          ? 'অনুগ্রহ করে প্রতিষ্ঠানের নাম, যোগাযোগের ব্যক্তি ও মোবাইল নম্বর লিখুন।'
          : 'Please provide organization name, contact person name, and mobile number.'
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerType,
          businessName: orgName.trim(),
          organizationName: orgName.trim(),
          contactPerson: contactName.trim(),
          phone: contactPhone.trim(),
          email: email.trim(),
          licenseNumber: licenseNumber.trim(),
          dghsNumber: dghsNumber.trim(),
          district,
          districtName: district,
          address: address.trim(),
          selectedPlanTier,
          billingInterval,
        }),
      });

      const resData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to submit provider onboarding application.');
      }

      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Submission error. Please try again or call 01886748564.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F7F4', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header
        style={{
          height: '68px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <BrandLogo variant="horizontal" size={32} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <LanguageSwitcher variant="pills" showIcon />
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#475569',
              textDecoration: 'none',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
            }}
          >
            <ArrowLeft size={14} />
            <span>{language === 'bn' ? 'হোমে ফিরুন' : 'Back to Home'}</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '40px 36px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            border: '1px solid #E2E8F0',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: BRAND_COLORS.primary, fontWeight: 700, fontSize: '13px', marginBottom: '12px' }}>
            <Sparkles size={16} />
            <span>{language === 'bn' ? 'প্রোভাইডার অনবোর্ডিং ও পার্টনারশিপ' : 'HEALTHCARE PROVIDER ONBOARDING'}</span>
          </div>

          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', marginBottom: '8px', lineHeight: 1.25 }}>
            {language === 'bn' ? 'ডায়াগনস্টিক সেন্টার ও হাসপাতাল রেজিস্ট্রি' : 'Diagnostic Center & Hospital Partnership'}
          </h1>

          <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '32px', lineHeight: 1.5 }}>
            {language === 'bn'
              ? 'ডায়াগনস্টিক কেয়ার সাবস্ক্রিপশন প্ল্যাটফর্মে যুক্ত হোন। রোগীদের নিকট আপনার ল্যাব টেস্ট, ডাক্তার চেম্বার ও হাসপাতালের সেবা ডিজিটালাইজ করুন। কোনো রোগী কমিশন নেই।'
              : 'Join Bangladesh’s premier healthcare marketplace. List test catalogs, chamber appointments, and multi-branch services with predictable recurring subscriptions.'}
          </p>

          {error && <AuthError message={error} onDismiss={() => setError('')} />}

          {success ? (
            <div style={{ textAlign: 'center', padding: '36px 16px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#ECFDF5',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
                {language === 'bn' ? 'আবেদন ও প্ল্যান রেজিস্ট্রেশন সম্পন্ন!' : 'Registration & Plan Selection Submitted!'}
              </h2>
              <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '520px', margin: '0 auto 28px', lineHeight: 1.6 }}>
                {language === 'bn'
                  ? `আমাদের ডিজিএইচএস ও লাইসেন্স ভেরিফিকেশন টিম আপনার তথ্য নিরীক্ষা করছে। আপনি সরাসরি আপনার প্রোভাইডার সাবস্ক্রিপশন পোর্টালে গিয়ে বিস্তারিত দেখতে ও বিলিং সেটআপ করতে পারেন।`
                  : `Our DGHS and trade license verification team is reviewing your credentials. You can now access your provider subscription console to manage billing and invoices.`}
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link
                  href="/provider/subscription"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '12px 24px',
                    backgroundColor: BRAND_COLORS.primary,
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '14px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                  }}
                >
                  {language === 'bn' ? 'সাবস্ক্রিপশন পোর্টালে যান' : 'Go to Subscription Portal'}
                </Link>
                <Link
                  href="/"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '12px 24px',
                    backgroundColor: '#F1F5F9',
                    color: '#334155',
                    fontWeight: 700,
                    fontSize: '14px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                  }}
                >
                  {language === 'bn' ? 'মার্কেটপ্লেসে ফিরুন' : 'Return to Marketplace'}
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* Step 1: Provider Category Selection */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
                  {language === 'bn' ? '১. প্রতিষ্ঠানের ধরন নির্বাচন করুন' : '1. Select Healthcare Facility Type'} *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setProviderType('DIAGNOSTIC_CENTER')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: `2px solid ${providerType === 'DIAGNOSTIC_CENTER' ? BRAND_COLORS.primary : '#E2E8F0'}`,
                      backgroundColor: providerType === 'DIAGNOSTIC_CENTER' ? '#EFF6FF' : '#FFFFFF',
                      color: providerType === 'DIAGNOSTIC_CENTER' ? BRAND_COLORS.primary : '#334155',
                      fontWeight: 700,
                      fontSize: '13.5px',
                      cursor: 'pointer',
                    }}
                  >
                    <TestTube2 size={20} />
                    <span>{language === 'bn' ? 'ডায়াগনস্টিক সেন্টার' : 'Diagnostic Center'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProviderType('HOSPITAL')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: `2px solid ${providerType === 'HOSPITAL' ? BRAND_COLORS.primary : '#E2E8F0'}`,
                      backgroundColor: providerType === 'HOSPITAL' ? '#EFF6FF' : '#FFFFFF',
                      color: providerType === 'HOSPITAL' ? BRAND_COLORS.primary : '#334155',
                      fontWeight: 700,
                      fontSize: '13.5px',
                      cursor: 'pointer',
                    }}
                  >
                    <Building2 size={20} />
                    <span>{language === 'bn' ? 'হাসপাতাল ও ক্লিনিক' : 'Hospital & Clinic'}</span>
                  </button>
                </div>
              </div>

              {/* Step 2: Organization Name */}
              <FormField label={language === 'bn' ? 'প্রতিষ্ঠানের নাম' : 'Organization Name'} required id="org-name">
                <input
                  id="org-name"
                  type="text"
                  placeholder={language === 'bn' ? 'যেমন: পপুলার ডায়াগনস্টিক সেন্টার বা ইবনে সিনা হাসপাতাল' : 'e.g. Popular Diagnostic Center'}
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                  style={{ width: '100%', height: '46px', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </FormField>

              {/* Contact Person & Mobile Number */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
                    {language === 'bn' ? 'দায়িত্বপ্রাপ্ত ব্যক্তির নাম' : 'Authorized Contact Person'} *
                  </label>
                  <input
                    type="text"
                    placeholder={language === 'bn' ? 'নাম লিখুন' : 'Full name'}
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    style={{ width: '100%', height: '46px', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
                    {language === 'bn' ? 'মোবাইল নম্বর' : 'Official Phone Number'} *
                  </label>
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                    style={{ width: '100%', height: '46px', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Email & Trade License / DGHS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
                    {language === 'bn' ? 'অফিসিয়াল ইমেইল' : 'Official Email'}
                  </label>
                  <input
                    type="email"
                    placeholder="billing@organization.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', height: '46px', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
                    {language === 'bn' ? 'ট্রেড লাইসেন্স বা ডিজিএইচএস নম্বর' : 'Trade License / DGHS Reg #'}
                  </label>
                  <input
                    type="text"
                    placeholder="TL-XXXXXX or DGHS-XXXXX"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    style={{ width: '100%', height: '46px', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* District & Address */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
                    {language === 'bn' ? 'জেলা' : 'District'} *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    style={{ width: '100%', height: '46px', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                  >
                    <option value="Moulvibazar">Moulvibazar (মৌলভীবাজার)</option>
                    <option value="Sylhet">Sylhet (সিলেট)</option>
                    <option value="Habiganj">Habiganj (হবিগঞ্জ)</option>
                    <option value="Sunamganj">Sunamganj (সুনামগঞ্জ)</option>
                    <option value="Dhaka">Dhaka (ঢাকা)</option>
                    <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
                    {language === 'bn' ? 'প্রতিষ্ঠানের ঠিকানা' : 'Full Address'}
                  </label>
                  <input
                    type="text"
                    placeholder={language === 'bn' ? 'সড়ক, থানা, শহর' : 'Road, Thana, City'}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ width: '100%', height: '46px', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Step 3: Subscription Plan Choice */}
              <div style={{ marginBottom: '28px', padding: '20px', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                    {language === 'bn' ? '২. প্রারম্ভিক সাবস্ক্রিপশন প্ল্যান নির্বাচন করুন' : '2. Select Initial Membership Plan'}
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setBillingInterval('monthly')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: billingInterval === 'monthly' ? BRAND_COLORS.primary : '#E2E8F0',
                        color: billingInterval === 'monthly' ? '#FFFFFF' : '#475569',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingInterval('annual')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: billingInterval === 'annual' ? BRAND_COLORS.primary : '#E2E8F0',
                        color: billingInterval === 'annual' ? '#FFFFFF' : '#475569',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Annual (Save 17%)
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
                  {[
                    { tier: 'basic', name: 'Basic (৭ দিন ট্রায়াল)', bdt: billingInterval === 'annual' ? 5000 : 500 },
                    { tier: 'professional', name: 'Professional', bdt: billingInterval === 'annual' ? 15000 : 1500 },
                    { tier: 'premium', name: 'Premium (Top Tier)', bdt: billingInterval === 'annual' ? 35000 : 3500 },
                    { tier: 'enterprise', name: 'Enterprise Group', bdt: billingInterval === 'annual' ? 80000 : 8000 },
                  ].map((p) => (
                    <div
                      key={p.tier}
                      onClick={() => setSelectedPlanTier(p.tier as any)}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: `1.5px solid ${selectedPlanTier === p.tier ? BRAND_COLORS.primary : '#CBD5E1'}`,
                        backgroundColor: selectedPlanTier === p.tier ? '#EFF6FF' : '#FFFFFF',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>{p.name}</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: BRAND_COLORS.primary, marginTop: '2px' }}>
                        ৳{p.bdt.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <LoadingButton
                type="submit"
                loading={loading}
                variant="primary"
                fullWidth
              >
                {language === 'bn' ? 'আবেদন ও সাবস্ক্রিপশন সম্পন্ন করুন' : 'Submit Healthcare Registration & Plan'}
              </LoadingButton>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', color: '#64748B', fontSize: '12px' }}>
                <ShieldCheck size={16} color="#10B981" />
                <span>DGHS Guidelines & Bangladesh Medical Data Protection Verified</span>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
