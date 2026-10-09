'use client';

import React, { useState } from 'react';
import { BRAND, BRAND_COLORS } from '@/config/brand';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { AuthUserProfile } from '@/services/auth.service';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { X } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'forgot-password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  onAuthSuccess?: (user: AuthUserProfile) => void;
  onLoginSuccess?: (user: any) => void;
  language?: any;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
  onLoginSuccess,
  language,
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleSuccess = (profile: AuthUserProfile) => {
    if (onAuthSuccess) {
      onAuthSuccess(profile);
    }
    if (onLoginSuccess) {
      onLoginSuccess(profile);
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Diagnostic Care Authentication"
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-container animate-slide-down"
        style={{
          maxWidth: '480px',
          padding: 0,
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid var(--glass-border)',
            background: 'rgba(255, 255, 255, 0.4)',
          }}
        >
          <BrandLogo variant="horizontal" size={28} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LanguageSwitcher variant="pills" showIcon={false} />
            <button
              type="button"
              onClick={onClose}
              aria-label={t.commonClose || 'Close'}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'rgba(241, 245, 249, 0.8)',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-text-secondary)',
                transition: 'all 0.15s ease',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Switcher (Login / Register) */}
        {mode !== 'forgot-password' && (
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--glass-border)',
              backgroundColor: 'rgba(244, 248, 250, 0.65)',
            }}
          >
            <button
              type="button"
              onClick={() => setMode('login')}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '14px',
                fontWeight: 700,
                color: mode === 'login' ? BRAND_COLORS.primary : 'var(--color-text-secondary)',
                backgroundColor: mode === 'login' ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
                border: 'none',
                borderBottom: mode === 'login' ? `2.5px solid ${BRAND_COLORS.primary}` : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {t.authLoginSubmit || 'Sign In'}
            </button>

            <button
              type="button"
              onClick={() => setMode('register')}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '14px',
                fontWeight: 700,
                color: mode === 'register' ? BRAND_COLORS.primary : 'var(--color-text-secondary)',
                backgroundColor: mode === 'register' ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
                border: 'none',
                borderBottom: mode === 'register' ? `2.5px solid ${BRAND_COLORS.primary}` : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {t.authRegisterBadge || 'Create Account'}
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {mode === 'login' && (
            <LoginForm
              isModal
              onSuccess={handleSuccess}
              onNavigateToRegister={() => setMode('register')}
              onNavigateToForgot={() => setMode('forgot-password')}
            />
          )}

          {mode === 'register' && (
            <RegisterForm
              isModal
              onSuccess={handleSuccess}
              onNavigateToLogin={() => setMode('login')}
            />
          )}

          {mode === 'forgot-password' && (
            <ForgotPasswordForm
              onBackToLogin={() => setMode('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
