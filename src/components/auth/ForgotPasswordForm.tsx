'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { AuthService } from '@/services/auth.service';
import FormField from './FormField';
import { AuthError, AuthSuccess } from './AuthAlerts';
import LoadingButton from './LoadingButton';
import { ArrowLeft, MailCheck, PhoneCall } from 'lucide-react';
import { BRAND_COLORS } from '@/config/brand';

interface ForgotPasswordFormProps {
  onBackToLogin?: () => void;
  onClose?: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onBackToLogin,
  onClose,
}) => {
  const { t, language } = useLanguage();

  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanId = identifier.trim();
    if (!cleanId) {
      setErrorMessage(
        language === 'bn'
          ? 'অনুগ্রহ করে আপনার নিবন্ধিত ইমেইল বা মোবাইল নম্বর দিন।'
          : 'Please enter your registered email address or mobile number.'
      );
      return;
    }

    setLoading(true);

    try {
      const result = await AuthService.resetPassword(cleanId);

      if (result.error) {
        setErrorMessage(result.error);
        setLoading(false);
        return;
      }

      setIsSubmitted(true);
      setSuccessMessage(t.authForgotSuccess);
      setLoading(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send password recovery instructions.');
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Back button */}
      <div style={{ marginBottom: '18px' }}>
        {onBackToLogin ? (
          <button
            type="button"
            onClick={onBackToLogin}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: BRAND_COLORS.primary,
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <ArrowLeft size={16} />
            <span>{t.authForgotBackToLogin}</span>
          </button>
        ) : (
          <a
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: BRAND_COLORS.primary,
              fontWeight: 700,
              fontSize: '13px',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} />
            <span>{t.authForgotBackToLogin}</span>
          </a>
        )}
      </div>

      {errorMessage && <AuthError message={errorMessage} onDismiss={() => setErrorMessage('')} />}
      {successMessage && <AuthSuccess message={successMessage} />}

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} noValidate>
          <p
            style={{
              fontSize: '13.5px',
              color: '#64748B',
              marginBottom: '20px',
              lineHeight: 1.5,
            }}
          >
            {t.authForgotSubtitle}
          </p>

          <FormField
            label={t.authForgotIdentifier}
            required
            id="forgot-identifier"
          >
            <input
              id="forgot-identifier"
              type="text"
              placeholder={t.authForgotIdentifierPlaceholder}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={loading}
              className="glass-input"
              style={{
                width: '100%',
                height: '46px',
                padding: '10px 14px',
                fontSize: '14px',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = BRAND_COLORS.primary;
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15, 118, 110, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </FormField>

          <LoadingButton
            type="submit"
            loading={loading}
            loadingText={t.authForgotLoading}
          >
            {t.authForgotSubmit}
          </LoadingButton>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
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
              }}
            >
              ✕ {language === 'bn' ? 'বাতিল করুন' : 'Cancel & Close'}
            </button>
          )}
        </form>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '20px 0',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(221, 247, 240, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: BRAND_COLORS.primary,
            }}
          >
            <MailCheck size={28} />
          </div>
          <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.5, marginBottom: '24px' }}>
            {language === 'bn'
              ? 'আমরা আপনার অ্যাকাউন্টে পাসওয়ার্ড রিসেটের নির্দেশাবলী পাঠিয়েছি। অনুগ্রহ করে আপনার ইনবক্স চেক করে পাসওয়ার্ড পরিবর্তন করুন।'
              : 'We have dispatched password reset instructions to your registered account. Please check your messages and follow the link to complete reset.'}
          </p>
          {onBackToLogin ? (
            <button
              type="button"
              onClick={onBackToLogin}
              style={{
                width: '100%',
                height: '44px',
                backgroundColor: '#F1F5F9',
                color: '#0F172A',
                fontWeight: 600,
                fontSize: '14px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              {t.authForgotBackToLogin}
            </button>
          ) : (
            <a
              href="/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '44px',
                backgroundColor: '#F1F5F9',
                color: '#0F172A',
                fontWeight: 600,
                fontSize: '14px',
                borderRadius: '10px',
                textDecoration: 'none',
              }}
            >
              {t.authForgotBackToLogin}
            </a>
          )}
        </div>
      )}

      {/* Helpline Contact */}
      <div
        style={{
          marginTop: '24px',
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
    </div>
  );
};

export default ForgotPasswordForm;
