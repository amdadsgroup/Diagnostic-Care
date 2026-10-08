'use client';

import React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';
import { useLanguage } from '@/context/LanguageContext';

export default function RegisterPage() {
  const { t } = useLanguage();

  return (
    <AuthLayout
      title={t.authRegisterTitle}
      subtitle={t.authRegisterSubtitle}
      badge={t.authRegisterBadge}
      activeMode="register"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
