'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_ORGANIZATIONS, INITIAL_DIAGNOSTIC_TESTS, INITIAL_DOCTOR_ASSOCIATIONS } from '@/lib/mock-data';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';
import {
  TestTube2,
  MapPin,
  Phone,
  ShieldCheck,
  Clock,
  Stethoscope,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function DiagnosticCenterDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || '';
  const { language, setLanguage } = useLanguage();

  const center =
    INITIAL_ORGANIZATIONS.find((org) => org.id === id) ||
    INITIAL_ORGANIZATIONS.find((org) => org.orgType === 'DIAGNOSTIC_CENTER') ||
    INITIAL_ORGANIZATIONS[0];

  const affiliatedAssocs = INITIAL_DOCTOR_ASSOCIATIONS.filter(
    (a) => a.organizationId === center.id
  );

  const availableTests = INITIAL_DIAGNOSTIC_TESTS.filter(
    (t) => t.organizationId === center.id
  );

  const displayTests = availableTests.length > 0 ? availableTests : INITIAL_DIAGNOSTIC_TESTS.slice(0, 8);
  const mainBranch = center.branches[0];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      <Header
        language={language}
        setLanguage={setLanguage}
        activeTab="marketplace"
        setActiveTab={() => {}}
      />

      <main style={{ flex: 1, maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '32px 20px 80px' }}>
        {/* Back Link */}
        <Link
          href="/diagnostic-centers"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#64748B',
            fontSize: '13px',
            fontWeight: 700,
            textDecoration: 'none',
            marginBottom: '20px',
          }}
        >
          <ChevronLeft size={16} />
          <span>{language === 'bn' ? 'সকল ডায়াগনস্টিক সেন্টারে ফিরে যান' : 'Back to Diagnostic Centers'}</span>
        </Link>

        {/* Hero Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
            border: '1px solid #E2E8F0',
            marginBottom: '30px',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '18px',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8B5CF6',
                flexShrink: 0,
              }}
            >
              <TestTube2 size={36} />
            </div>

            <div style={{ flex: '1 1 320px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    padding: '3px 9px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  <ShieldCheck size={12} />
                  Verified Pathology Lab
                </span>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  License: {center.tradeLicenseNumber || 'TRAD/2026/041'}
                </span>
              </div>

              <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: '0 0 10px' }}>
                {center.name}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '14px', marginBottom: '16px' }}>
                <MapPin size={16} color="#8B5CF6" />
                <span>{mainBranch?.addressLine || 'Moulvibazar, Bangladesh'}</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <a
                  href={`tel:${center.contactPhone}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#8B5CF6',
                    color: '#FFFFFF',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <Phone size={15} />
                  <span>Call Diagnostic Desk: {center.contactPhone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tests & Investigation Catalog */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TestTube2 size={20} color="#8B5CF6" />
            <span>{language === 'bn' ? 'উপলব্ধ ডায়াগনস্টিক টেস্ট ও মূল্য তালিকা' : 'Available Diagnostic Tests & Official Pricing'}</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {displayTests.map((t) => (
              <div
                key={t.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#8B5CF6', backgroundColor: 'rgba(139, 92, 246, 0.08)', padding: '2px 8px', borderRadius: '6px' }}>
                      {t.code}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>
                      <Clock size={11} style={{ display: 'inline', marginRight: '3px' }} />
                      {t.expectedDeliveryHours} hrs
                    </span>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
                    {t.name}
                  </h3>

                  <p style={{ fontSize: '12.5px', color: '#64748B', margin: '0 0 12px', lineHeight: 1.4 }}>
                    {t.description}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>
                    ৳ {t.discountPrice || t.price}
                    {t.discountPrice && (
                      <span style={{ fontSize: '12px', color: '#94A3B8', textDecoration: 'line-through', marginLeft: '6px' }}>
                        ৳ {t.price}
                      </span>
                    )}
                  </div>
                  <a
                    href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: BRAND_COLORS.primary,
                      textDecoration: 'none',
                    }}
                  >
                    Book Test →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specialist Chambers at this center */}
        {affiliatedAssocs.length > 0 && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Stethoscope size={20} color="#0060FA" />
              <span>Specialist Doctor Chambers at this Center</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {affiliatedAssocs.map((assoc) => (
                <div
                  key={assoc.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                    {assoc.doctor?.fullName || 'Specialist Consultant'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#0060FA', fontWeight: 600, marginBottom: '8px' }}>
                    {assoc.doctor?.specialization || 'Consultant'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px' }}>
                    Chamber: {assoc.chamberRoomNumber} • Fee: ৳{assoc.consultationFee}
                  </div>
                  <Link
                    href={`/doctors/${assoc.doctorId}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: BRAND_COLORS.primary,
                      textDecoration: 'none',
                    }}
                  >
                    <span>View Chamber & Book</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer language={language} />
    </div>
  );
}
