'use client';

import React, { useState } from 'react';
import {
  Settings,
  Save,
  Phone,
  Shield,
  Percent,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Globe,
} from 'lucide-react';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';

interface SystemSettingsTabProps {
  language: 'en' | 'bn';
  adminEmail: string;
}

export default function SystemSettingsTab({ language, adminEmail }: SystemSettingsTabProps) {
  const [config, setConfig] = useState<{
    brandName: string;
    tagline: string;
    customerCarePhone: string;
    companyEmail: string;
    platformCommissionPercent: number;
    currencySymbol: string;
    smsGatewayActive: boolean;
    maintenanceMode: boolean;
  }>({
    brandName: BRAND_CONSTANTS.BRAND_NAME,
    tagline: BRAND_CONSTANTS.TAGLINE,
    customerCarePhone: BRAND_CONSTANTS.CUSTOMER_CARE_PHONE,
    companyEmail: BRAND_CONSTANTS.COMPANY_EMAIL,
    platformCommissionPercent: 10.0,
    currencySymbol: BRAND_CONSTANTS.CURRENCY_SYMBOL,
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
    <div style={{ maxWidth: '720px' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '28px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
          <Settings size={22} color={BRAND_COLORS.primary} />
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {language === 'bn' ? 'প্ল্যাটফর্ম গ্লোবাল সেটিংস' : 'Platform System Settings'}
            </h3>
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              Centralized marketplace configuration and operational parameters
            </div>
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Brand Name:
            </label>
            <input
              type="text"
              value={config.brandName}
              onChange={(e) => setConfig({ ...config, brandName: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Tagline:
            </label>
            <input
              type="text"
              value={config.tagline}
              onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Customer Care Hotline & Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Customer Care Phone (24/7):
            </label>
            <input
              type="text"
              value={config.customerCarePhone}
              onChange={(e) => setConfig({ ...config, customerCarePhone: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Official Support Email:
            </label>
            <input
              type="email"
              value={config.companyEmail}
              onChange={(e) => setConfig({ ...config, companyEmail: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Commission Rate & Currency */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Default Platform Commission Rate (%):
            </label>
            <input
              type="number"
              step="0.1"
              value={config.platformCommissionPercent}
              onChange={(e) => setConfig({ ...config, platformCommissionPercent: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Default Currency:
            </label>
            <input
              type="text"
              disabled
              value="Bangladeshi Taka (৳ BDT)"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {saved && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#F0FDF4', color: '#16A34A', fontSize: '12.5px', fontWeight: 700, marginBottom: '16px' }}>
            ✓ Platform settings updated successfully.
          </div>
        )}

        <button
          type="submit"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: BRAND_COLORS.primary,
            color: '#FFFFFF',
            border: 'none',
            padding: '11px 22px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Save size={16} />
          <span>{language === 'bn' ? 'সেটিংস সংরক্ষণ করুন' : 'Save System Settings'}</span>
        </button>
      </form>
    </div>
  );
}
