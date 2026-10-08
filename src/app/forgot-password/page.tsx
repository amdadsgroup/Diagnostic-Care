'use client';

import React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { useLanguage } from '@/context/LanguageContext';

export default function ForgotPasswordPage() {
  const { t } = useLanguage();

  return (
    <AuthLayout
      title={t.authForgotTitle}
      subtitle={t.authForgotSubtitle}
      activeMode="forgot"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
