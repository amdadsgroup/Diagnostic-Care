'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import PasswordInput from './PasswordInput';
import FormField from './FormField';
import { AuthError, AuthSuccess } from './AuthAlerts';
import LoadingButton from './LoadingButton';
import { BRAND_COLORS } from '@/config/brand';
import { Building2, PhoneCall } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: (user: AuthUserProfile) => void;
  onNavigateToRegister?: () => void;
  onNavigateToForgot?: () => void;
  redirectTo?: string;
  isModal?: boolean;
  onClose?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onNavigateToRegister,
  onNavigateToForgot,
  redirectTo,
  isModal = false,
  onClose,
}) => {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validate = (): boolean => {
    const errors: { identifier?: string; password?: string } = {};

    const cleanId = identifier.trim();
    if (!cleanId) {
      errors.identifier =
        language === 'bn'
          ? 'মোবাইল নম্বর অথবা ইমেইল ঠিকানা প্রদান করুন।'
          : 'Please enter your mobile number or email.';
    } else if (!cleanId.includes('@')) {
      const normalizedPhone = AuthService.normalizePhoneNumber(cleanId);
      if (!AuthService.isValidBangladeshPhone(normalizedPhone)) {
        errors.identifier =
          language === 'bn'
            ? 'সঠিক ১১-সংখ্যার বাংলাদেশী মোবাইল নম্বর লিখুন (০১XXXXXXXXX)।'
            : 'Enter a valid 11-digit Bangladesh phone number (01XXXXXXXXX).';
      }
    }

    if (!password) {
      errors.password =
        language === 'bn' ? 'পাসওয়ার্ড প্রদান করুন।' : 'Please enter your password.';
    } else if (password.length < 6) {
      errors.password =
        language === 'bn'
          ? 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।'
          : 'Password must be at least 6 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validate()) return;

    setLoading(true);

    try {
      const result = await AuthService.signIn(identifier, password);

      if (result.error) {
        if (result.isSuspended) {
          setErrorMessage(t.authLoginAccountSuspended);
        } else if (
          result.error.toLowerCase().includes('invalid') ||
          result.error.toLowerCase().includes('credentials')
        ) {
          setErrorMessage(t.authLoginInvalidCredentials);
        } else {
          setErrorMessage(result.error);
        }
        setLoading(false);
        return;
      }

      setSuccessMessage(t.authLoginSuccess);

      // Handle session persistence preference
      if (typeof window !== 'undefined' && rememberMe) {
        localStorage.setItem('dc_remember_me', 'true');
      }

      // If callback provided (e.g. inside modal)
      if (result.profile && onSuccess) {
        setTimeout(() => {
          onSuccess(result.profile!);
        }, 300);
      } else {
        // Redirect to appropriate dashboard or target URL
        const target = redirectTo || result.redirectPath || '/';
        setTimeout(() => {
          if (isModal) {
            window.location.href = target;
          } else {
            router.push(target);
          }
        }, 400);
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || t.authLoginNetworkError || 'An unexpected error occurred during login.'
      );
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
      {errorMessage && <AuthError message={errorMessage} onDismiss={() => setErrorMessage('')} />}
      {successMessage && <AuthSuccess message={successMessage} />}

      {/* Identifier Input */}
      <FormField
        label={t.authLoginIdentifier}
        required
        error={fieldErrors.identifier}
        id="login-identifier"
      >
        <div style={{ position: 'relative' }}>
          <input
            id="login-identifier"
            type="text"
            autoComplete="username"
            placeholder={t.authLoginIdentifierPlaceholder}
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (fieldErrors.identifier) setFieldErrors((prev) => ({ ...prev, identifier: undefined }));
            }}
            disabled={loading}
            className="glass-input"
            style={{
              width: '100%',
              height: '46px',
              padding: '10px 14px',
              fontSize: '14px',
              color: 'var(--color-text-primary)',
              border: fieldErrors.identifier ? '1.5px solid #EF4444' : '1px solid var(--glass-border)',
              borderRadius: '12px',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = BRAND_COLORS.primary;
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 96, 250, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = fieldErrors.identifier ? '#EF4444' : 'var(--glass-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
      </FormField>

      {/* Password Input */}
      <div style={{ marginBottom: '14px' }}>
        <PasswordInput
          id="login-password"
          label={t.authLoginPassword}
          placeholder={t.authLoginPasswordPlaceholder}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={fieldErrors.password}
          autoComplete="current-password"
          disabled={loading}
          required
        />
      </div>

      {/* Remember Me & Forgot Password */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          fontSize: '13px',
        }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={loading}
            style={{
              width: '16px',
              height: '16px',
              accentColor: BRAND_COLORS.primary,
              cursor: 'pointer',
            }}
          />
          <span>{t.authLoginRememberMe}</span>
        </label>

        {onNavigateToForgot ? (
          <button
            type="button"
            onClick={onNavigateToForgot}
            style={{
              background: 'none',
              border: 'none',
              color: BRAND_COLORS.primary,
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0,
              fontSize: '13px',
            }}
          >
            {t.authLoginForgotPassword}
          </button>
        ) : (
          <a
            href="/forgot-password"
            style={{
              color: BRAND_COLORS.primary,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            {t.authLoginForgotPassword}
          </a>
        )}
      </div>

      {/* Submit Button */}
      <LoadingButton
        type="submit"
        loading={loading}
        loadingText={t.authLoginLoading}
      >
        {t.authLoginSubmit}
      </LoadingButton>

      {/* Explicit Cancel / Close Action */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          id="login-cancel-btn"
          style={{
            width: '100%',
            marginTop: '10px',
            padding: '11px',
            borderRadius: '12px',
            border: '1.5px solid #CBD5E1',
            backgroundColor: '#F8FAFC',
            color: '#475569',
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <span>✕ {language === 'bn' ? 'বাতিল করুন (Cancel)' : 'Cancel & Close'}</span>
        </button>
      )}

      {/* Switch to Register */}
      <div
        style={{
          marginTop: '20px',
          textAlign: 'center',
          fontSize: '13.5px',
          color: 'var(--color-text-secondary)',
        }}
      >
        <span>{t.authLoginNoAccount} </span>
        {onNavigateToRegister ? (
          <button
            type="button"
            onClick={onNavigateToRegister}
            style={{
              background: 'none',
              border: 'none',
              color: BRAND_COLORS.primary,
              fontWeight: 800,
              cursor: 'pointer',
              padding: '0 4px',
            }}
          >
            {t.authLoginCreateAccount}
          </button>
        ) : (
          <a
            href="/register"
            style={{
              color: BRAND_COLORS.primary,
              fontWeight: 800,
              textDecoration: 'none',
            }}
          >
            {t.authLoginCreateAccount}
          </a>
        )}
      </div>

      {/* Provider Onboarding Notice */}
      <div
        className="glass-inset"
        style={{
          marginTop: '24px',
          padding: '12px 14px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          fontSize: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 size={16} color={BRAND_COLORS.primary} />
          <span style={{ color: '#475569', fontWeight: 500 }}>
            {t.authLoginProviderNotice}
          </span>
        </div>
        <a
          href="/provider/onboard"
          style={{
            color: BRAND_COLORS.primary,
            fontWeight: 700,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {t.authLoginProviderCta} →
        </a>
      </div>

      {/* Customer Care Helpline */}
      <div
        style={{
          marginTop: '14px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#94A3B8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
      >
        <PhoneCall size={12} />
        <span>{t.commonCustomerCareText || 'Customer Care: 01886748564'}</span>
      </div>
    </form>
  );
};

export default LoginForm;
