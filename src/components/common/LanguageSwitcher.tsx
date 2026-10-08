'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';
import { BRAND_COLORS } from '@/config/brand';

interface LanguageSwitcherProps {
  variant?: 'pills' | 'minimal' | 'dark' | 'header';
  className?: string;
  showIcon?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'pills',
  className = '',
  showIcon = true,
}) => {
  const { language, setLanguage } = useLanguage();

  if (variant === 'dark' || variant === 'header') {
    return (
      <div
        role="group"
        aria-label="Language selection"
        className={`dc-language-switcher ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2px',
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '2px 4px',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.14)',
        }}
      >
        {showIcon && (
          <Globe
            size={12}
            color="#93C5FD"
            aria-hidden="true"
            style={{ marginRight: '3px', marginLeft: '2px' }}
          />
        )}
        <button
          type="button"
          onClick={() => setLanguage('en')}
          aria-pressed={language === 'en'}
          aria-label="Switch language to English"
          style={{
            color: language === 'en' ? '#0F172A' : '#FFFFFF',
            background: language === 'en' ? '#60A5FA' : 'transparent',
            fontWeight: 700,
            fontSize: '11px',
            padding: '2px 7px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            lineHeight: 1.25,
            transition: 'all 0.15s ease',
          }}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLanguage('bn')}
          aria-pressed={language === 'bn'}
          aria-label="Switch language to Bangla"
          style={{
            color: language === 'bn' ? '#0F172A' : '#FFFFFF',
            background: language === 'bn' ? '#60A5FA' : 'transparent',
            fontWeight: 700,
            fontSize: '11px',
            padding: '2px 7px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            lineHeight: 1.25,
            transition: 'all 0.15s ease',
          }}
        >
          বাংলা
        </button>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div
        role="group"
        aria-label="Language selection"
        className={`dc-language-switcher ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          fontWeight: 600,
        }}
      >
        {showIcon && <Globe size={14} color="#6B7280" aria-hidden="true" />}
        <button
          type="button"
          onClick={() => setLanguage('en')}
          aria-pressed={language === 'en'}
          aria-label="English language"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: language === 'en' ? BRAND_COLORS.primary : '#6B7280',
            fontWeight: language === 'en' ? 700 : 500,
            padding: '2px 4px',
            textDecoration: language === 'en' ? 'underline' : 'none',
            textUnderlineOffset: '3px',
          }}
        >
          English
        </button>
        <span style={{ color: '#D1D5DB' }}>|</span>
        <button
          type="button"
          onClick={() => setLanguage('bn')}
          aria-pressed={language === 'bn'}
          aria-label="বাংলা ভাষা"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: language === 'bn' ? BRAND_COLORS.primary : '#6B7280',
            fontWeight: language === 'bn' ? 700 : 500,
            padding: '2px 4px',
            textDecoration: language === 'bn' ? 'underline' : 'none',
            textUnderlineOffset: '3px',
          }}
        >
          বাংলা
        </button>
      </div>
    );
  }

  // Default 'pills' variant (Light theme)
  return (
    <div
      role="group"
      aria-label="Language selection"
      className={`dc-language-switcher ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        backgroundColor: '#F1F5F9',
        padding: '3px 4px',
        borderRadius: '8px',
        border: '1px solid #E2E8F0',
      }}
    >
      {showIcon && (
        <Globe
          size={14}
          color="#64748B"
          aria-hidden="true"
          style={{ margin: '0 4px 0 2px' }}
        />
      )}
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        aria-label="Switch language to English"
        style={{
          color: language === 'en' ? '#FFFFFF' : '#475569',
          backgroundColor: language === 'en' ? BRAND_COLORS.primary : 'transparent',
          fontWeight: 700,
          fontSize: '12px',
          padding: '4px 10px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          lineHeight: 1.2,
          transition: 'all 0.15s ease',
          boxShadow: language === 'en' ? '0 1px 3px rgba(0, 87, 255, 0.25)' : 'none',
        }}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage('bn')}
        aria-pressed={language === 'bn'}
        aria-label="Switch language to Bangla"
        style={{
          color: language === 'bn' ? '#FFFFFF' : '#475569',
          backgroundColor: language === 'bn' ? BRAND_COLORS.primary : 'transparent',
          fontWeight: 700,
          fontSize: '12px',
          padding: '4px 10px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          lineHeight: 1.2,
          transition: 'all 0.15s ease',
          boxShadow: language === 'bn' ? '0 1px 3px rgba(0, 87, 255, 0.25)' : 'none',
        }}
      >
        বাংলা
      </button>
    </div>
  );
};

export default LanguageSwitcher;
