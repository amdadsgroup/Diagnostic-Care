'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { useLanguage } from '@/context/LanguageContext';

function ProviderRegisterContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || undefined;
  const roleParam = searchParams?.get('role') || searchParams?.get('portal');
  const initialRole =
    roleParam?.toLowerCase().includes('hospital') ||
    roleParam?.toLowerCase().includes('lab') ||
    roleParam?.toLowerCase().includes('diagnostic') ||
    roleParam?.toLowerCase().includes('clinic')
      ? 'HOSPITAL'
      : 'DOCTOR';

  return (
    <LoginForm
      targetAudience="provider"
      initialRole={initialRole}
      initialMode="register"
      redirectTo={redirectTo}
    />
  );
}

export default function ProviderRegisterPage() {
  const { language } = useLanguage();

  const title =
    language === 'bn'
      ? 'স্বাস্থ্যসেবা প্রোভাইডার রেজিস্ট্রেশন'
      : 'Healthcare Provider Registration';
  const subtitle =
    language === 'bn'
      ? 'বিএমডিসি নিবন্ধিত বিশেষজ্ঞ ডাক্তার, অনুমোদিত হাসপাতাল ও ডায়াগনস্টিক সেন্টারের জাতীয় ডিজিটাল প্ল্যাটফর্মে অ্যাকাউন্ট তৈরি করুন।'
      : 'Create an official provider account for BMDC specialist doctors, hospitals, clinics, and diagnostic centers.';
  const badge =
    language === 'bn' ? 'প্রোভাইডার অনবোর্ডিং' : 'HEALTHCARE PROVIDER REGISTRATION';

  return (
    <AuthLayout
      title={title}
      subtitle={subtitle}
      badge={badge}
      activeMode="register"
    >
      <Suspense
        fallback={
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>
            Loading Provider Registration Portal...
          </div>
        }
      >
        <ProviderRegisterContent />
      </Suspense>
    </AuthLayout>
  );
}
