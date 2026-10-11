'use client';

import React from 'react';
import LedgerViewer from '@/components/finance/LedgerViewer';
import { DollarSign, ShieldCheck, TrendingUp, CreditCard, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { BRAND_CONSTANTS, BRAND_COLORS } from '@/config/brand';

interface FinanceTabProps {
  language: 'en' | 'bn';
  adminEmail: string;
}

export default function FinanceTab({ language, adminEmail }: FinanceTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Financial Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
              {language === 'bn' ? 'প্ল্যাটফর্ম টেক-রেট (কমিশন)' : 'Platform Take-Rate (Commission)'}
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A' }}>10.0%</div>
          <div style={{ fontSize: '11.5px', color: '#16A34A', marginTop: '4px', fontWeight: 600 }}>
            {language === 'bn' ? 'সকল কনসালটেশন ও সার্ভিসে প্রযোজ্য' : 'Standard marketplace commission'}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
              {language === 'bn' ? 'অনুমোদিত পেমেন্ট মেথড' : 'Active Payment Gateways'}
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FDF2F8', color: '#DB2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={16} />
            </div>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>bKash • Nagad • Cash</div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px' }}>
            Direct Desk Settlement Enabled
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
              {language === 'bn' ? 'অ্যাকাউন্টিং স্ট্যান্ডার্ড' : 'Ledger Integrity'}
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={16} />
            </div>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Double-Entry Verified</div>
          <div style={{ fontSize: '11.5px', color: '#10B981', marginTop: '4px', fontWeight: 600 }}>
            Debit / Credit Balanced in Real-Time
          </div>
        </div>
      </div>

      {/* Embedded High Fidelity Ledger Viewer */}
      <LedgerViewer />
    </div>
  );
}
