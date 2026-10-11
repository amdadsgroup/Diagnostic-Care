'use client';

import React from 'react';
import LedgerViewer from '@/components/finance/LedgerViewer';
import { DollarSign, ShieldCheck, TrendingUp, CreditCard, Repeat, CheckCircle2 } from 'lucide-react';
import { BRAND_CONSTANTS, BRAND_COLORS } from '@/config/brand';
import { useAdminTheme } from '../AdminThemeContext';

interface FinanceTabProps {
  language: 'en' | 'bn';
  adminEmail: string;
}

export default function FinanceTab({ language, adminEmail }: FinanceTabProps) {
  const { theme, tokens } = useAdminTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Financial Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {/* Core Revenue Model Card */}
        <div
          style={{
            backgroundColor: tokens.cardBg,
            backdropFilter: tokens.backdropBlur,
            borderRadius: '16px',
            padding: '20px',
            border: `1px solid ${tokens.cardBorder}`,
            boxShadow: tokens.cardShadow,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: tokens.textMuted }}>
              {language === 'bn' ? 'প্রাথমিক ব্যবসায়িক মডেল' : 'Primary Revenue Architecture'}
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 96, 250, 0.12)',
                color: BRAND_COLORS.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Repeat size={16} />
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: tokens.textPrimary }}>
            B2B Recurring SaaS
          </div>
          <div style={{ fontSize: '11.5px', color: '#10B981', marginTop: '4px', fontWeight: 600 }}>
            {language === 'bn' ? 'হাসপাতাল ও ডায়াগনস্টিক মাসিক/বাৎসরিক ফি' : 'Monthly & Annual Provider Subscriptions'}
          </div>
        </div>

        {/* Patient Zero-Commission Policy Card */}
        <div
          style={{
            backgroundColor: tokens.cardBg,
            backdropFilter: tokens.backdropBlur,
            borderRadius: '16px',
            padding: '20px',
            border: `1px solid ${tokens.cardBorder}`,
            boxShadow: tokens.cardShadow,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: tokens.textMuted }}>
              {language === 'bn' ? 'রোগী বুকিং চার্জ পলিসি' : 'Patient Booking Take-Rate'}
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#10B981' }}>
            ৳0 / 0.0%
          </div>
          <div style={{ fontSize: '11.5px', color: tokens.textMuted, marginTop: '4px' }}>
            {language === 'bn' ? 'রোগীদের ওপর কোনো কমিশন বা বুকিং ফি নেই' : 'Zero commission taken from patient appointments'}
          </div>
        </div>

        {/* Payment Gateways Card */}
        <div
          style={{
            backgroundColor: tokens.cardBg,
            backdropFilter: tokens.backdropBlur,
            borderRadius: '16px',
            padding: '20px',
            border: `1px solid ${tokens.cardBorder}`,
            boxShadow: tokens.cardShadow,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: tokens.textMuted }}>
              {language === 'bn' ? 'পেমেন্ট গেটওয়ে ও সেটেলমেন্ট' : 'Gateway Channels & Settlement'}
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(236, 72, 153, 0.12)',
                color: '#EC4899',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CreditCard size={16} />
            </div>
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: tokens.textPrimary }}>
            SSLCommerz • bKash • Nagad
          </div>
          <div style={{ fontSize: '11.5px', color: tokens.textMuted, marginTop: '4px' }}>
            Direct Bank BEFTN Transfer Supported
          </div>
        </div>

        {/* Ledger Integrity Card */}
        <div
          style={{
            backgroundColor: tokens.cardBg,
            backdropFilter: tokens.backdropBlur,
            borderRadius: '16px',
            padding: '20px',
            border: `1px solid ${tokens.cardBorder}`,
            boxShadow: tokens.cardShadow,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: tokens.textMuted }}>
              {language === 'bn' ? 'অ্যাকাউন্টিং স্ট্যান্ডার্ড' : 'Ledger Integrity'}
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={16} />
            </div>
          </div>
          <div style={{ fontSize: '17px', fontWeight: 800, color: tokens.textPrimary }}>
            Double-Entry Audited
          </div>
          <div style={{ fontSize: '11.5px', color: '#10B981', marginTop: '4px', fontWeight: 600 }}>
            Debits strictly equal Credits in real-time
          </div>
        </div>
      </div>

      {/* Embedded High Fidelity Double-Entry Ledger Hub */}
      <LedgerViewer />
    </div>
  );
}
