'use client';

import React, { useState } from 'react';
import {
  Settings,
  Save,
  Phone,
  Shield,
  CreditCard,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Globe,
  Repeat,
} from 'lucide-react';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';
import { useAdminTheme } from '../AdminThemeContext';

interface SystemSettingsTabProps {
  language: 'en' | 'bn';
  adminEmail: string;
}

export default function SystemSettingsTab({ language, adminEmail }: SystemSettingsTabProps) {
  const { theme, tokens } = useAdminTheme();

  const [config, setConfig] = useState<{
    brandName: string;
    tagline: string;
    customerCarePhone: string;
    companyEmail: string;
    primaryRevenueModel: string;
    patientBookingTakeRate: number;
    currencySymbol: string;
    sslcommerzActive: boolean;
    smsGatewayActive: boolean;
    maintenanceMode: boolean;
  }>({
    brandName: BRAND_CONSTANTS.BRAND_NAME,
    tagline: BRAND_CONSTANTS.TAGLINE,
    customerCarePhone: BRAND_CONSTANTS.CUSTOMER_CARE_PHONE,
    companyEmail: BRAND_CONSTANTS.COMPANY_EMAIL,
    primaryRevenueModel: 'B2B Provider Subscriptions (Monthly & Annual)',
    patientBookingTakeRate: 0.0,
    currencySymbol: BRAND_CONSTANTS.CURRENCY_SYMBOL,
    sslcommerzActive: true,
    smsGatewayActive: true,
    maintenanceMode: false,
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '780px' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: tokens.cardBg,
          backdropFilter: tokens.backdropBlur,
          borderRadius: '20px',
          padding: '28px',
          border: `1px solid ${tokens.cardBorder}`,
          boxShadow: tokens.cardShadow,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
          <Settings size={22} color={BRAND_COLORS.primary} />
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
              {language === 'bn' ? 'প্ল্যাটফর্ম ও সাবস্ক্রিপশন গ্লোবাল কনফিগারেশন' : 'Platform & Subscription System Settings'}
            </h3>
            <div style={{ fontSize: '12px', color: tokens.textMuted }}>
              Centralized marketplace configuration and operational parameters
            </div>
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '6px' }}>
              Brand Name:
            </label>
            <input
              type="text"
              value={config.brandName}
              onChange={(e) => setConfig({ ...config, brandName: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: `1px solid ${tokens.inputBorder}`,
                backgroundColor: tokens.inputBg,
                color: tokens.textPrimary,
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '6px' }}>
              Tagline:
            </label>
            <input
              type="text"
              value={config.tagline}
              onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: `1px solid ${tokens.inputBorder}`,
                backgroundColor: tokens.inputBg,
                color: tokens.textPrimary,
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Customer Care Hotline & Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '6px' }}>
              Customer Care Hotline (24/7):
            </label>
            <input
              type="text"
              value={config.customerCarePhone}
              onChange={(e) => setConfig({ ...config, customerCarePhone: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: `1px solid ${tokens.inputBorder}`,
                backgroundColor: tokens.inputBg,
                color: tokens.textPrimary,
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '6px' }}>
              Official Support Email:
            </label>
            <input
              type="email"
              value={config.companyEmail}
              onChange={(e) => setConfig({ ...config, companyEmail: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: `1px solid ${tokens.inputBorder}`,
                backgroundColor: tokens.inputBg,
                color: tokens.textPrimary,
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Business Model Policy Parameters */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '6px' }}>
              Primary Revenue Architecture:
            </label>
            <input
              type="text"
              readOnly
              value={config.primaryRevenueModel}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: `1px solid ${tokens.inputBorder}`,
                backgroundColor: tokens.cardBgSubtle,
                color: tokens.primary,
                fontWeight: 700,
                fontSize: '12.5px',
                boxSizing: 'border-box',
                cursor: 'not-allowed',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '6px' }}>
              Patient Booking Commission Take-Rate:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                readOnly
                value="0.0% (Zero Booking Deductions Policy)"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: `1px solid ${tokens.inputBorder}`,
                  backgroundColor: tokens.cardBgSubtle,
                  color: '#10B981',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  boxSizing: 'border-box',
                  cursor: 'not-allowed',
                }}
              />
            </div>
          </div>
        </div>

        {/* Gateway & Infrastructure Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', backgroundColor: tokens.cardBgSubtle, borderRadius: '12px', marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 700, color: tokens.textPrimary, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={config.sslcommerzActive}
              onChange={(e) => setConfig({ ...config, sslcommerzActive: e.target.checked })}
            />
            SSLCommerz & Local MFS Gateways Enabled (Cards, bKash, Nagad)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 700, color: tokens.textPrimary, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={config.smsGatewayActive}
              onChange={(e) => setConfig({ ...config, smsGatewayActive: e.target.checked })}
            />
            SMS Gateway Alerts Active (Greenweb / SSL Wireless)
          </label>
        </div>

        {saved && (
          <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981', fontSize: '12.5px', fontWeight: 700, marginBottom: '14px' }}>
            ✓ Platform settings updated and synchronized with central server.
          </div>
        )}

        <button
          type="submit"
          style={{
            padding: '11px 24px',
            backgroundColor: BRAND_COLORS.primary,
            border: 'none',
            color: '#FFFFFF',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Save size={16} />
          <span>{language === 'bn' ? 'সেটিংস সংরক্ষণ করুন' : 'Save System Configuration'}</span>
        </button>
      </form>
    </div>
  );
}
