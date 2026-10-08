'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

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
    if (variant === 'secondary') return '#F1F5F9';
    if (variant === 'outline') return 'transparent';
    return '#0057FF';
  };

  const getTextColor = () => {
    if (variant === 'secondary') return '#0F172A';
    if (variant === 'outline') return '#0057FF';
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
        borderRadius: '10px',
        backgroundColor: getBackgroundColor(),
        color: getTextColor(),
        border: variant === 'outline' ? '1.5px solid #0057FF' : 'none',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        boxShadow:
          variant === 'primary' && !disabled && !loading
            ? '0 4px 14px rgba(0, 87, 255, 0.28)'
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
