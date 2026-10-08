'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { useLanguage } from '@/context/LanguageContext';

function LoginContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || undefined;
  return <LoginForm redirectTo={redirectTo} />;
}

export default function LoginPage() {
  const { t } = useLanguage();

  return (
    <AuthLayout
      title={t.authLoginTitle}
      subtitle={t.authLoginSubtitle}
      badge={t.authLoginBadge}
      activeMode="login"
    >
      <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>Loading...</div>}>
        <LoginContent />
      </Suspense>
    </AuthLayout>
  );
}
