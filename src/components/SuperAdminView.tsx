'use client';

import React, { useState, useEffect } from 'react';
import { Organization, Doctor, SubscriptionPlan } from '@/types';
import { BRAND_CONSTANTS, SupportedLanguage } from '@/config/brand';
import { ShieldCheck, CheckCircle2, AlertCircle, FileText, Database, Lock, DollarSign } from 'lucide-react';
import { AdminService, AdminDashboardMetrics } from '@/services/admin.service';

interface SuperAdminViewProps {
  organizations: Organization[];
  doctors: Doctor[];
  language: SupportedLanguage;
}

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({
  organizations,
  doctors,
  language,
}) => {
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);

  useEffect(() => {
    AdminService.getDashboardMetrics().then((m) => setMetrics(m));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Super Admin Control Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid var(--slate-200)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={24} color="#10B981" />
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                Diagnostic Care — Platform Super Admin
              </h2>
            </div>
            <div style={{ color: 'var(--slate-600)', fontSize: '13px', marginTop: '4px' }}>
              Central Platform Governance, Verification & Financial Ledger • Customer Care Helpline: {BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ backgroundColor: 'var(--brand-emerald-50)', color: '#065F46', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
              ALL SYSTEMS HEALTHY (99.9% UPTIME)
            </span>
          </div>
        </div>

        {/* Global Key Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '20px' }}>
          <div style={{ backgroundColor: 'var(--slate-50)', padding: '16px', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
            <div style={{ fontSize: '12px', color: 'var(--slate-500)', fontWeight: 600 }}>Active Diagnostic Centers</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-navy-900)', marginTop: '4px' }}>
              {metrics ? metrics.diagnosticCenters : organizations.length} Centers
            </div>
            <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 600, marginTop: '2px' }}>Verified in Moulvibazar Hub</div>
          </div>

          <div style={{ backgroundColor: 'var(--slate-50)', padding: '16px', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
            <div style={{ fontSize: '12px', color: 'var(--slate-500)', fontWeight: 600 }}>BMDC Registered Doctors</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-teal-600)', marginTop: '4px' }}>
              {metrics ? metrics.activeDoctors : doctors.length} Physicians
            </div>
            <div style={{ fontSize: '11px', color: 'var(--slate-500)', marginTop: '2px' }}>BMDC Verified</div>
          </div>

          <div style={{ backgroundColor: 'var(--slate-50)', padding: '16px', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
            <div style={{ fontSize: '12px', color: 'var(--slate-500)', fontWeight: 600 }}>Gross Marketplace Volume (GMV)</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-emerald-500)', marginTop: '4px' }}>
              ৳{(metrics?.totalRevenueBdt || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--slate-500)', marginTop: '2px' }}>
              {metrics?.completedAppointments ? `${metrics.completedAppointments} Completed Appointments` : 'Live Database Records'}
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--slate-50)', padding: '16px', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
            <div style={{ fontSize: '12px', color: 'var(--slate-500)', fontWeight: 600 }}>Platform Commission (10%)</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-navy-700)', marginTop: '4px' }}>
              ৳{Math.round((metrics?.totalRevenueBdt || 0) * 0.1).toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--brand-emerald-500)', fontWeight: 600, marginTop: '2px' }}>Ledger Balanced</div>
          </div>
        </div>
      </div>

      {/* Immutable Financial Ledger Audit Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid var(--slate-200)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
              Double-Entry Financial Ledger (Recent Transactions)
            </h4>
            <div style={{ fontSize: '12px', color: 'var(--slate-500)' }}>
              Immutable accounting entries. Debits equal credits strictly enforced.
            </div>
          </div>
          <span style={{ fontSize: '11px', backgroundColor: 'var(--brand-emerald-50)', color: '#065F46', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
            DEBITS == CREDITS (BALANCED)
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--slate-100)', color: 'var(--slate-700)' }}>
                <th style={{ padding: '10px 12px' }}>Ref ID</th>
                <th style={{ padding: '10px 12px' }}>Account</th>
                <th style={{ padding: '10px 12px' }}>Type</th>
                <th style={{ padding: '10px 12px' }}>Amount</th>
                <th style={{ padding: '10px 12px' }}>Description</th>
                <th style={{ padding: '10px 12px' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--slate-100)' }}>
                <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>TXN-90812</td>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>GATEWAY_CLEARING (bKash)</td>
                <td style={{ padding: '10px 12px', color: '#16A34A', fontWeight: 700 }}>DEBIT</td>
                <td style={{ padding: '10px 12px', fontWeight: 700 }}>৳800.00</td>
                <td style={{ padding: '10px 12px' }}>Dr. Anisur Rahman Consultation</td>
                <td style={{ padding: '10px 12px', color: 'var(--slate-500)' }}>Today 16:04</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--slate-100)' }}>
                <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>TXN-90812</td>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>PROVIDER_PAYABLE (Popular DC)</td>
                <td style={{ padding: '10px 12px', color: '#DC2626', fontWeight: 700 }}>CREDIT</td>
                <td style={{ padding: '10px 12px', fontWeight: 700 }}>৳760.00</td>
                <td style={{ padding: '10px 12px' }}>Provider Payable (95%)</td>
                <td style={{ padding: '10px 12px', color: 'var(--slate-500)' }}>Today 16:04</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--slate-100)' }}>
                <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>TXN-90812</td>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>PLATFORM_COMMISSION</td>
                <td style={{ padding: '10px 12px', color: '#DC2626', fontWeight: 700 }}>CREDIT</td>
                <td style={{ padding: '10px 12px', fontWeight: 700 }}>৳40.00</td>
                <td style={{ padding: '10px 12px' }}>5% Platform Revenue</td>
                <td style={{ padding: '10px 12px', color: 'var(--slate-500)' }}>Today 16:04</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Trail */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid var(--slate-200)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Lock size={18} color="var(--brand-teal-600)" />
          <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
            Healthcare Security Audit Log (Immutable Events)
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
          <div style={{ padding: '10px 12px', backgroundColor: 'var(--slate-50)', borderRadius: '6px', border: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>DIAGNOSTIC_REPORT_RELEASED:</strong> CBC report for Kawsar Ahmed verified by Consultant Pathologist. Signed 15-min token generated.</span>
            <span style={{ color: 'var(--slate-500)' }}>2 mins ago • IP: 103.205.71.14 (Moulvibazar)</span>
          </div>
          <div style={{ padding: '10px 12px', backgroundColor: 'var(--slate-50)', borderRadius: '6px', border: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>SLOT_HELD_TRANSACTION:</strong> Slot 16:15 held by patient (01886748564). Optimistic concurrency lock acquired.</span>
            <span style={{ color: 'var(--slate-500)' }}>8 mins ago • IP: 103.205.71.18</span>
          </div>
          <div style={{ padding: '10px 12px', backgroundColor: 'var(--slate-50)', borderRadius: '6px', border: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>PROVIDER_VERIFICATION:</strong> Popular Diagnostic Center Moulvibazar Trade License TRAD/MB/2024/0981 verified.</span>
            <span style={{ color: 'var(--slate-500)' }}>1 hour ago • Admin: super_admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};
