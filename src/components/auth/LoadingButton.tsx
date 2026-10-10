'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { BRAND_COLORS } from '@/config/brand';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  loading = false,
  loadingText,
  variant = 'primary',
  fullWidth = true,
  disabled,
  style,
  ...props
}) => {
  const getBackgroundColor = () => {
    if (disabled || loading) return '#94A3B8';
    if (variant === 'secondary') return 'rgba(241, 245, 249, 0.85)';
    if (variant === 'outline') return 'transparent';
    return BRAND_COLORS.primary;
  };

  const getTextColor = () => {
    if (variant === 'secondary') return 'var(--color-text-primary)';
    if (variant === 'outline') return BRAND_COLORS.primary;
    return '#FFFFFF';
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={{
        width: fullWidth ? '100%' : 'auto',
        height: '48px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '0 20px',
        fontSize: '15px',
        fontWeight: 700,
        borderRadius: '12px',
        backgroundColor: getBackgroundColor(),
        backgroundImage: variant === 'primary' && !disabled && !loading
          ? 'linear-gradient(135deg, #0060FA 0%, #004ED1 100%)'
          : undefined,
        color: getTextColor(),
        border: variant === 'outline' ? `1.5px solid ${BRAND_COLORS.primary}` : 'none',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        boxShadow:
          variant === 'primary' && !disabled && !loading
            ? '0 6px 16px rgba(0, 96, 250, 0.25)'
            : 'none',
        ...style,
      }}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          <span>{loadingText || children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export const AuthButton = LoadingButton;
export default LoadingButton;

