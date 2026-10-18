'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { useLanguage } from '@/context/LanguageContext';

function LoginContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || undefined;
  return <LoginForm targetAudience="patient" redirectTo={redirectTo} />;
}

export default function LoginPage() {
  const { language } = useLanguage();

  const title =
    language === 'bn' ? 'রোগী সেবা পোর্টাল লগইন' : 'Patient Portal Sign In';
  const subtitle =
    language === 'bn'
      ? 'ডাক্তার অ্যাপয়েন্টমেন্ট গ্রহণ, চেম্বার সিরিয়াল ট্র্যাকিং এবং ডিজিটাল টেস্ট রিপোর্ট দেখতে লগইন করুন।'
      : 'Sign in to book doctor appointments, track chamber queue serials, and access medical test reports.';
  const badge =
    language === 'bn' ? 'রোগী সেবা লগইন' : 'Patient Care Sign In';

  return (
    <AuthLayout
      title={title}
      subtitle={subtitle}
      badge={badge}
      activeMode="login"
    >
      <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>Loading...</div>}>
        <LoginContent />
      </Suspense>
    </AuthLayout>
  );
}
