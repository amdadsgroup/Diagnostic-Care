'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BRAND_CONSTANTS, BRAND_COLORS } from '@/config/brand';
import { BrandLogo } from '@/components/brand/BrandLogo';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft, Building2, Stethoscope, TestTube2, Ambulance, CheckCircle2, ShieldCheck, PhoneCall } from 'lucide-react';
import LoadingButton from '@/components/auth/LoadingButton';
import FormField from '@/components/auth/FormField';
import { AuthError, AuthSuccess } from '@/components/auth/AuthAlerts';

export default function ProviderOnboardPage() {
  const { language } = useLanguage();

  const [providerType, setProviderType] = useState('DIAGNOSTIC_CENTER');
  const [orgName, setOrgName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [email, setEmail] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [district, setDistrict] = useState('Moulvibazar');
  const [address, setAddress] = useState('');

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
          organizationName: orgName.trim(),
          contactPerson: contactName.trim(),
          phone: contactPhone.trim(),
          email: email.trim(),
          licenseNumber: licenseNumber.trim(),
          district,
          address: address.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit provider onboarding application.');
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
      <main style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '40px 36px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            border: '1px solid #E2E8F0',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0057FF', fontWeight: 700, fontSize: '13px', marginBottom: '12px' }}>
            <Building2 size={16} />
            <span>{language === 'bn' ? 'প্রতিষ্ঠান অনবোর্ডিং পোর্টাল' : 'HEALTHCARE PROVIDER NETWORK'}</span>
          </div>

          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', marginBottom: '8px', lineHeight: 1.25 }}>
            {language === 'bn' ? 'ডায়াগনস্টিক কেয়ার নেটওয়ার্কে যোগ দিন' : 'Partner with Diagnostic Care'}
          </h1>

          <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '32px', lineHeight: 1.5 }}>
            {language === 'bn'
              ? 'ডায়াগনস্টিক সেন্টার, হাসপাতাল, ক্লিনিক ও ডাক্তার চেম্বারের জন্য বাংলাদেশের আধুনিকতম ডিজিটাল অপারেটিং সিস্টেম।'
              : 'Join Bangladesh’s connected healthcare marketplace. Expand your patient reach and modernize your pathology lab, clinic, or hospital operating system.'}
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
                {language === 'bn' ? 'আবেদন সফলভাবে গৃহীত হয়েছে!' : 'Application Submitted Successfully!'}
              </h2>
              <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '480px', margin: '0 auto 28px', lineHeight: 1.6 }}>
                {language === 'bn'
                  ? 'আমাদের ভেরিফিকেশন ও অনবোর্ডিং টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে এবং আপনার পোর্টাল অ্যাক্টিভেট করবে।'
                  : 'Our healthcare onboarding operations team will verify your credentials and contact you within 24 hours to activate your provider console.'}
              </p>
              <Link
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '12px 24px',
                  backgroundColor: '#0057FF',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '14px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                }}
              >
                {language === 'bn' ? 'মার্কেটপ্লেসে ফিরুন' : 'Return to Marketplace'}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* Provider Category Selection */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
                  {language === 'bn' ? 'প্রতিষ্ঠানের ধরন' : 'Healthcare Facility Type'} *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                  {[
                    { id: 'DIAGNOSTIC_CENTER', label: language === 'bn' ? 'ডায়াগনস্টিক সেন্টার / ল্যাব' : 'Diagnostic Lab', icon: TestTube2 },
                    { id: 'HOSPITAL', label: language === 'bn' ? 'হাসপাতাল ও ক্লিনিক' : 'Hospital / Clinic', icon: Building2 },
                    { id: 'DOCTOR_CHAMBER', label: language === 'bn' ? 'ডাক্তার চেম্বার' : 'Doctor Chamber', icon: Stethoscope },
                    { id: 'AMBULANCE_PROVIDER', label: language === 'bn' ? 'অ্যাম্বুলেন্স অপারেটর' : 'Ambulance Hub', icon: Ambulance },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = providerType === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setProviderType(cat.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px 14px',
                          borderRadius: '10px',
                          backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                          border: isSelected ? '2px solid #0057FF' : '1.5px solid #E2E8F0',
                          color: isSelected ? '#0057FF' : '#475569',
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '13px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Icon size={16} />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Organization Name */}
              <FormField label={language === 'bn' ? 'প্রতিষ্ঠানের নাম' : 'Organization / Facility Name'} required id="org-name">
                <input
                  id="org-name"
                  type="text"
                  placeholder={language === 'bn' ? 'যেমন: পপুলার ডায়াগনস্টিক সেন্টার' : 'e.g. Popular Diagnostic Center'}
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
                    {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'} *
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

              {/* District & License */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
                    {language === 'bn' ? 'জেলা' : 'Operational District'} *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    style={{ width: '100%', height: '46px', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                  >
                    <option value="Moulvibazar">Moulvibazar (Launch Hub)</option>
                    <option value="Sylhet">Sylhet Sadar</option>
                    <option value="Habiganj">Habiganj</option>
                    <option value="Sunamganj">Sunamganj</option>
                    <option value="Dhaka">Dhaka Division</option>
                    <option value="Chittagong">Chittagong</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
                    {language === 'bn' ? 'ডিজিএইচএস বা ট্রেড লাইসেন্স নম্বর' : 'DGHS License / Registration No.'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DGHS-2026-XXXX"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    style={{ width: '100%', height: '46px', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Address */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
                  {language === 'bn' ? 'প্রতিষ্ঠানের ঠিকানা' : 'Facility Location & Branch Address'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'bn' ? 'রোড, এলাকা ও বিস্তারিত ঠিকানা' : 'Street address, area'}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: '100%', height: '46px', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              {/* Submit Button */}
              <LoadingButton type="submit" loading={loading} loadingText={language === 'bn' ? 'আবেদন পাঠানো হচ্ছে...' : 'Submitting Application...'}>
                {language === 'bn' ? 'অনবোর্ডিং আবেদন জমা দিন' : 'Submit Provider Application'}
              </LoadingButton>

              <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <PhoneCall size={12} />
                <span>{language === 'bn' ? 'অনবোর্ডিং হেল্পলাইন: ০১৮৮৬-৭৪৮৫৬৪' : `Provider Assistance Helpline: ${BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}`}</span>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
