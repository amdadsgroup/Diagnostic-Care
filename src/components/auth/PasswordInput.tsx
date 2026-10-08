'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  showToggle?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  showToggle = true,
  className = '',
  disabled,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();

  const toggleVisibility = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (!disabled) {
      setShowPassword((prev) => !prev);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: '#1E293B',
            marginBottom: '6px',
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <input
          {...props}
          type={showPassword ? 'text' : 'password'}
          disabled={disabled}
          style={{
            width: '100%',
            height: '46px',
            padding: '10px 44px 10px 14px',
            fontSize: '14px',
            color: '#0F172A',
            backgroundColor: disabled ? '#F1F5F9' : '#FFFFFF',
            border: error ? '1.5px solid #EF4444' : '1.5px solid #E2E8F0',
            borderRadius: '10px',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            fontFamily: showPassword ? 'inherit' : 'monospace',
            letterSpacing: showPassword ? 'normal' : '0.12em',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#0057FF';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 87, 255, 0.12)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? '#EF4444' : '#E2E8F0';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        {showToggle && (
          <button
            type="button"
            onClick={toggleVisibility}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggleVisibility(e);
              }
            }}
            tabIndex={0}
            disabled={disabled}
            aria-label={showPassword ? (t.commonHidePassword || 'Hide password') : (t.commonShowPassword || 'Show password')}
            title={showPassword ? (t.commonHidePassword || 'Hide password') : (t.commonShowPassword || 'Show password')}
            style={{
              position: 'absolute',
              right: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              padding: '6px',
              borderRadius: '6px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              color: '#64748B',
              transition: 'color 0.15s ease',
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p
          role="alert"
          style={{
            fontSize: '12px',
            color: '#EF4444',
            marginTop: '5px',
            fontWeight: 500,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
