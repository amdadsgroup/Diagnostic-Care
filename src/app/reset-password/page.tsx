'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordInput from '@/components/auth/PasswordInput';
import { AuthError, AuthSuccess } from '@/components/auth/AuthAlerts';
import LoadingButton from '@/components/auth/LoadingButton';
import { useLanguage } from '@/context/LanguageContext';
import { AuthService } from '@/services/auth.service';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password.length < 8) {
      setErrorMessage(
        language === 'bn'
          ? 'পাসওয়ার্ড ন্যূনতম ৮ অক্ষরের হতে হবে।'
          : 'Password must be at least 8 characters long.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t.authRegisterPasswordMismatch);
      return;
    }

    setLoading(true);

    try {
      const result = await AuthService.updatePassword(password);

      if (result.error) {
        setErrorMessage(result.error);
        setLoading(false);
        return;
      }

      setSuccessMessage(t.authResetSuccess);
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Password update failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t.authResetTitle}
      subtitle={t.authResetSubtitle}
    >
      <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
        {errorMessage && <AuthError message={errorMessage} onDismiss={() => setErrorMessage('')} />}
        {successMessage && <AuthSuccess message={successMessage} />}

        <div style={{ marginBottom: '16px' }}>
          <PasswordInput
            id="reset-password"
            label={t.authResetNewPassword}
            placeholder={t.authRegisterPasswordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <PasswordInput
            id="reset-confirm-password"
            label={t.authResetConfirmPassword}
            placeholder={t.authRegisterConfirmPasswordPlaceholder}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <LoadingButton
          type="submit"
          loading={loading}
          loadingText={t.authResetLoading}
        >
          {t.authResetSubmit}
        </LoadingButton>
      </form>
    </AuthLayout>
  );
}
