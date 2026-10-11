'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';

interface ReportsAnalyticsTabProps {
  language: 'en' | 'bn';
  adminEmail: string;
}

export default function ReportsAnalyticsTab({ language, adminEmail }: ReportsAnalyticsTabProps) {
  const [reportPeriod, setReportPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  const exportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Count,Growth Rate,Status\n' +
      'Patient Registrations,1248,+18.4%,Active\n' +
      'BMDC Verified Doctors,48,+12.0%,Verified\n' +
      'Diagnostic Centers,24,+8.5%,Operational\n' +
      'Appointments Completed,3840,+22.1%,Fulfilled\n' +
      'Appointment Cancellation Rate,4.2%,-1.5%,Optimal\n' +
      'Gross Platform Volume BDT,1420000,+26.3%,Healthy\n';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `diagnostic-care-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header with Export Button */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '18px 20px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            {language === 'bn' ? 'অপারেশনাল অ্যানালিটিক্স ও পারফরম্যান্স রিপোর্ট' : 'Operational Reports & Analytics'}
          </h3>
          <p style={{ fontSize: '12.5px', color: '#64748B', margin: '4px 0 0 0' }}>
            Aggregated system metrics and provider performance across Bangladesh
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            border: 'none',
            padding: '9px 16px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Download size={15} />
          <span>{language === 'bn' ? 'রিপোর্ট এক্সপোর্ট (CSV)' : 'Export Report (CSV)'}</span>
        </button>
      </div>

      {/* Analytics KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '22px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Appointment Completion Rate</div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#16A34A', marginTop: '6px' }}>94.2%</div>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
            Only 4.2% cancellations / 1.6% no-shows
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '22px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Doctor Verification Speed</div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#2563EB', marginTop: '6px' }}>14.2 Hours</div>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
            Average turnaround for BMDC license audits
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '22px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Diagnostic Investigation Demand</div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#7C3AED', marginTop: '6px' }}>+34.8%</div>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
            Top demands: CBC, HbA1c, Whole Abdomen USG
          </div>
        </div>
      </div>
    </div>
  );
}
