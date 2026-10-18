'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { useLanguage } from '@/context/LanguageContext';

function ProviderLoginContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || undefined;
  const roleParam = searchParams?.get('role') || searchParams?.get('portal');
  const modeParam = searchParams?.get('mode') === 'register' ? 'register' : 'login';
  const initialRole =
    roleParam?.toLowerCase().includes('hospital') || roleParam?.toLowerCase().includes('lab')
      ? 'HOSPITAL'
      : 'DOCTOR';

  return (
    <LoginForm
      targetAudience="provider"
      initialRole={initialRole}
      initialMode={modeParam}
      redirectTo={redirectTo}
    />
  );
}

export default function ProviderLoginPage() {
  const { language } = useLanguage();

  const title =
    language === 'bn'
      ? 'ডাক্তার ও হাসপাতাল পার্টনার পোর্টাল'
      : 'Doctor & Hospital Partner Portal';
  const subtitle =
    language === 'bn'
      ? 'BMDC নিবন্ধিত বিশেষজ্ঞ চিকিৎসক, হাসপাতাল, ক্লিনিক এবং ডায়াগনস্টিক সেন্টারের সমন্বিত সাইন-ইন ও একাউন্ট তৈরির পথ।'
      : 'One unified sign-in gateway for BMDC specialist doctors, hospitals, clinics, and diagnostic centers.';
  const badge =
    language === 'bn' ? 'স্বাস্থ্যসেবা প্রোভাইডার অ্যাক্সেস' : 'HEALTHCARE PROVIDER ACCESS';

  return (
    <AuthLayout
      title={title}
      subtitle={subtitle}
      badge={badge}
      activeMode="login"
    >
      <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>Loading Doctor & Hospital Portal...</div>}>
        <ProviderLoginContent />
      </Suspense>
    </AuthLayout>
  );
}
