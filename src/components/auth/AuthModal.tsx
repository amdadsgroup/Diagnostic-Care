'use client';

import React, { useState, useEffect } from 'react';
import { BRAND, BRAND_COLORS } from '@/config/brand';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { AuthUserProfile } from '@/services/auth.service';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { X } from 'lucide-react';

export type AuthMode = 'login' | 'register' | 'forgot-password';

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

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode, isOpen]);

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
          maxWidth: '500px',
          width: '100%',
          padding: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'min(92dvh, 760px)',
          margin: '0 auto',
          position: 'relative',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 96, 250, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Prominent Red Close Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--glass-border)',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BrandLogo variant="horizontal" size={28} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LanguageSwitcher variant="pills" showIcon={false} />
            <button
              type="button"
              onClick={onClose}
              id="auth-modal-close-btn"
              aria-label={t.commonClose || 'Close'}
              title={t.commonClose || 'Close'}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                border: '1.5px solid #FCA5A5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#DC2626',
                transition: 'all 0.15s ease',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(220, 38, 38, 0.15)',
              }}
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Tab Switcher (Login / Register) */}
        {mode !== 'forgot-password' && (
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--glass-border)',
              backgroundColor: 'rgba(244, 248, 250, 0.95)',
              flexShrink: 0,
              position: 'sticky',
              top: '70px',
              zIndex: 35,
            }}
          >
            <button
              type="button"
              onClick={() => setMode('login')}
              style={{
                flex: 1,
                padding: '13px',
                fontSize: '14px',
                fontWeight: 700,
                color: mode === 'login' ? BRAND_COLORS.primary : 'var(--color-text-secondary)',
                backgroundColor: mode === 'login' ? '#FFFFFF' : 'transparent',
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
                padding: '13px',
                fontSize: '14px',
                fontWeight: 700,
                color: mode === 'register' ? BRAND_COLORS.primary : 'var(--color-text-secondary)',
                backgroundColor: mode === 'register' ? '#FFFFFF' : 'transparent',
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

        {/* Scrollable Modal Body */}
        <div
          style={{
            padding: '20px 22px',
            overflowY: 'auto',
            flex: 1,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {mode === 'login' && (
            <LoginForm
              isModal
              onClose={onClose}
              onSuccess={handleSuccess}
              onNavigateToRegister={() => setMode('register')}
              onNavigateToForgot={() => setMode('forgot-password')}
            />
          )}

          {mode === 'register' && (
            <RegisterForm
              isModal
              onClose={onClose}
              onSuccess={handleSuccess}
              onNavigateToLogin={() => setMode('login')}
            />
          )}

          {mode === 'forgot-password' && (
            <ForgotPasswordForm
              onClose={onClose}
              onBackToLogin={() => setMode('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
