'use client';

import React, { useState } from 'react';
import { Organization, DiagnosticTest, DoctorAssociation, SubscriptionPlan } from '@/types';
import { BRAND_CONSTANTS, SupportedLanguage } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import { Building2, MapPin, Stethoscope, TestTube2, FileText, DollarSign, Award, Plus, CheckCircle, Upload } from 'lucide-react';

interface DiagnosticAdminViewProps {
  organization: Organization;
  tests: DiagnosticTest[];
  associations: DoctorAssociation[];
  subscriptionPlans: SubscriptionPlan[];
  language: SupportedLanguage;
}

export const DiagnosticAdminView: React.FC<DiagnosticAdminViewProps> = ({
  organization,
  tests,
  associations,
  subscriptionPlans,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedBranchId, setSelectedBranchId] = useState<string>(organization.branches[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'tests' | 'doctors' | 'reports' | 'subscription'>('tests');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const orgTests = tests.filter((t) => t.organizationId === organization.id);
  const orgAssociations = associations.filter((a) => a.organizationId === organization.id);

  const handleUploadReport = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Organization Header & Multi-Branch Switcher */}
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
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                {organization.name}
              </h2>
              <span style={{ backgroundColor: 'var(--brand-teal-50)', color: 'var(--brand-teal-600)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                VERIFIED B2B PROVIDER
              </span>
            </div>
            <div style={{ color: 'var(--slate-600)', fontSize: '13px', marginTop: '4px' }}>
              Trade License: {organization.tradeLicenseNumber} • Helpline: {BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}
            </div>
          </div>

          {/* Multi-Branch Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--slate-100)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
            <MapPin size={16} color="var(--brand-teal-600)" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-600)' }}>Active Branch:</span>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--brand-navy-900)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {organization.branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.upazilaName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Operational Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginTop: '20px',
          }}
        >
          <div style={{ backgroundColor: 'var(--slate-50)', padding: '14px', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
            <div style={{ fontSize: '12px', color: 'var(--slate-500)', fontWeight: 600 }}>Active Doctor Chambers</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-navy-900)', marginTop: '4px' }}>
              {orgAssociations.length} Specialists
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--slate-50)', padding: '14px', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
            <div style={{ fontSize: '12px', color: 'var(--slate-500)', fontWeight: 600 }}>Diagnostic Tests Offered</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-teal-600)', marginTop: '4px' }}>
              {orgTests.length} Tests
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--slate-50)', padding: '14px', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
            <div style={{ fontSize: '12px', color: 'var(--slate-500)', fontWeight: 600 }}>Today’s Total Revenue</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-emerald-500)', marginTop: '4px' }}>
              {BRAND_CONSTANTS.CURRENCY_SYMBOL}18,400
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--slate-50)', padding: '14px', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
            <div style={{ fontSize: '12px', color: 'var(--slate-500)', fontWeight: 600 }}>SaaS Subscription</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-navy-700)', marginTop: '4px' }}>
              ৳500 / mo
            </div>
            <div style={{ fontSize: '11px', color: 'var(--brand-emerald-500)', fontWeight: 600 }}>Active (Pro Plan)</div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '24px', borderBottom: '1px solid var(--slate-200)', paddingBottom: '2px' }}>
          <button
            onClick={() => setActiveTab('tests')}
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 600,
              color: activeTab === 'tests' ? 'var(--brand-navy-900)' : 'var(--slate-500)',
              borderBottom: `2px solid ${activeTab === 'tests' ? 'var(--brand-navy-900)' : 'transparent'}`,
            }}
          >
            Diagnostic Test Catalog ({orgTests.length})
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 600,
              color: activeTab === 'doctors' ? 'var(--brand-navy-900)' : 'var(--slate-500)',
              borderBottom: `2px solid ${activeTab === 'doctors' ? 'var(--brand-navy-900)' : 'transparent'}`,
            }}
          >
            Doctor Chambers ({orgAssociations.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 600,
              color: activeTab === 'reports' ? 'var(--brand-navy-900)' : 'var(--slate-500)',
              borderBottom: `2px solid ${activeTab === 'reports' ? 'var(--brand-navy-900)' : 'transparent'}`,
            }}
          >
            Secure Report Upload
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 600,
              color: activeTab === 'subscription' ? 'var(--brand-navy-900)' : 'var(--slate-500)',
              borderBottom: `2px solid ${activeTab === 'subscription' ? 'var(--brand-navy-900)' : 'transparent'}`,
            }}
          >
            SaaS Plan & Billing
          </button>
        </div>
      </div>

      {/* Tab 1: Diagnostic Test Catalog */}
      {activeTab === 'tests' && (
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
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
              Laboratory & Imaging Menu
            </h4>
            <button
              onClick={() => alert('New test modal: Add test name, sample type, fasting notes, and price.')}
              style={{
                backgroundColor: 'var(--brand-navy-700)',
                color: '#FFFFFF',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={15} />
              Add New Test
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {orgTests.map((test) => (
              <div
                key={test.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--slate-50)',
                  border: '1px solid var(--slate-200)',
                  fontSize: '13px',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--brand-navy-900)' }}>
                    {test.name}
                  </div>
                  <div style={{ color: 'var(--slate-500)', fontSize: '12px', marginTop: '2px' }}>
                    Code: {test.code} • Sample: {test.sampleType} • Turnaround: {test.expectedDeliveryHours} hrs
                  </div>
                  <div style={{ color: 'var(--brand-teal-600)', fontSize: '11px', marginTop: '2px' }}>
                    Instructions: {test.preparationInstructions}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--brand-navy-900)' }}>
                      ৳{test.discountPrice || test.price}
                    </div>
                    {test.discountPrice && (
                      <div style={{ fontSize: '11px', color: 'var(--slate-400)', textDecoration: 'line-through' }}>
                        ৳{test.price}
                      </div>
                    )}
                  </div>
                  <span style={{ backgroundColor: test.homeCollectionAvailable ? 'var(--brand-emerald-50)' : 'var(--slate-200)', color: test.homeCollectionAvailable ? '#065F46' : 'var(--slate-600)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                    {test.homeCollectionAvailable ? 'Home Sample Available' : 'Chamber Only'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Doctor Chambers Management */}
      {activeTab === 'doctors' && (
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
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
              Associated Specialist Consultants
            </h4>
            <button
              onClick={() => alert('Add/Invite Doctor modal: Associate specialist doctor to Moulvibazar Branch.')}
              style={{
                backgroundColor: 'var(--brand-navy-700)',
                color: '#FFFFFF',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={15} />
              Associate Doctor
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orgAssociations.map((assoc) => (
              <div
                key={assoc.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--slate-50)',
                  border: '1px solid var(--slate-200)',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--brand-navy-900)' }}>
                    {assoc.doctor?.fullName}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--brand-teal-600)', fontWeight: 600 }}>
                    {assoc.doctor?.specialization} (BMDC: {assoc.doctor?.bmdcNumber})
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--slate-600)', marginTop: '4px' }}>
                    Chamber: {assoc.chamberRoomNumber} • Branch: {assoc.branchName}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right', fontSize: '13px' }}>
                    <div>Fee: <strong>৳{assoc.consultationFee}</strong></div>
                    <div style={{ color: 'var(--slate-500)', fontSize: '11px' }}>Platform Commission: {assoc.commissionRatePercent}%</div>
                  </div>
                  <span style={{ backgroundColor: 'var(--brand-emerald-50)', color: '#065F46', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                    SCHEDULE ACTIVE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Secure Report Upload */}
      {activeTab === 'reports' && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--slate-200)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-navy-900)', marginBottom: '8px' }}>
            Upload Verified Diagnostic Report (PDF)
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--slate-600)', marginBottom: '20px' }}>
            Pathology reports are protected under Diagnostic Care’s zero-leakage security policy. Reports are stored in encrypted private storage and released to patients via signed 15-minute URLs.
          </p>

          {uploadSuccess && (
            <div
              style={{
                backgroundColor: 'var(--brand-emerald-50)',
                color: '#065F46',
                border: '1px solid #A7F3D0',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle size={18} />
              <span>Report uploaded successfully! Secure download token generated and patient notified via SMS.</span>
            </div>
          )}

          <form onSubmit={handleUploadReport} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', maxWidth: '600px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Booking Code (DC-2026-XXXX)
              </label>
              <input
                type="text"
                required
                defaultValue="DC-2026-1001"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--slate-300)', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Diagnostic Test
              </label>
              <select style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--slate-300)', fontSize: '13px' }}>
                {orgTests.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Verifying Medical Technologist / Pathologist Name
              </label>
              <input
                type="text"
                required
                defaultValue="Dr. S. M. Faruq (Consultant Pathologist)"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--slate-300)', fontSize: '13px' }}
              />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Report PDF Document
              </label>
              <div
                style={{
                  border: '2px dashed var(--slate-300)',
                  borderRadius: '8px',
                  padding: '24px',
                  textAlign: 'center',
                  backgroundColor: 'var(--slate-50)',
                }}
              >
                <Upload size={28} color="var(--brand-teal-600)" style={{ margin: '0 auto 8px auto' }} />
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Click to browse or drop certified PDF report</div>
                <div style={{ fontSize: '11px', color: 'var(--slate-500)', marginTop: '2px' }}>Maximum size: 10MB • Format: PDF only</div>
              </div>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: 'var(--brand-navy-700)',
                  color: '#FFFFFF',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <Upload size={16} />
                Upload & Release Report to Patient
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 4: SaaS Subscription Billing */}
      {activeTab === 'subscription' && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--slate-200)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-navy-900)', marginBottom: '8px' }}>
            Provider SaaS Subscription Tiers
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--slate-600)', marginBottom: '20px' }}>
            Diagnostic Care offers transparent, low-cost B2B subscription tiers designed specifically for Bangladesh diagnostic centers. Pricing is fully dynamic.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {subscriptionPlans.map((plan) => {
              const isCurrent = plan.code === 'PRO_500';
              return (
                <div
                  key={plan.id}
                  style={{
                    borderRadius: '12px',
                    border: `2px solid ${isCurrent ? 'var(--brand-teal-600)' : 'var(--slate-200)'}`,
                    padding: '20px',
                    backgroundColor: isCurrent ? 'var(--brand-teal-50)' : '#FFFFFF',
                    position: 'relative',
                  }}
                >
                  {isCurrent && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '16px',
                        backgroundColor: 'var(--brand-teal-600)',
                        color: '#FFFFFF',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 800,
                        letterSpacing: '0.05em',
                      }}
                    >
                      CURRENT PLAN
                    </span>
                  )}
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                    {plan.name}
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--brand-navy-900)', margin: '12px 0' }}>
                    ৳{plan.monthlyPrice} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--slate-500)' }}>/ month</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--slate-600)', marginBottom: '16px' }}>
                    Up to {plan.maxDoctors} doctors • {plan.maxBranches} branches • {plan.maxStaff} staff
                  </div>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--slate-700)' }}>
                    {plan.features.map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle size={14} color="#10B981" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
