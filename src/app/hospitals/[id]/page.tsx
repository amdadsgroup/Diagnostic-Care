'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_ORGANIZATIONS, INITIAL_DOCTOR_ASSOCIATIONS } from '@/lib/mock-data';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';
import {
  Building2,
  MapPin,
  Phone,
  ShieldCheck,
  Clock,
  Bed,
  Stethoscope,
  ChevronLeft,
  ArrowRight,
  HeartPulse,
  Mail,
  CheckCircle2,
} from 'lucide-react';

export default function HospitalDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || '';
  const { language, setLanguage } = useLanguage();

  const hospital =
    INITIAL_ORGANIZATIONS.find((org) => org.id === id) ||
    INITIAL_ORGANIZATIONS.find((org) => org.orgType === 'HOSPITAL') ||
    INITIAL_ORGANIZATIONS[0];

  const affiliatedAssocs = INITIAL_DOCTOR_ASSOCIATIONS.filter(
    (a) => a.organizationId === hospital.id
  );

  const mainBranch = hospital.branches[0];

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
          href="/hospitals"
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
          <span>{language === 'bn' ? 'সকল হাসপাতালে ফিরে যান' : 'Back to Hospitals'}</span>
        </Link>

        {/* Hospital Hero Banner */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
            border: '1px solid #E2E8F0',
            marginBottom: '30px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '18px',
                backgroundColor: 'rgba(0, 96, 250, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: BRAND_COLORS.primary,
                flexShrink: 0,
              }}
            >
              <Building2 size={36} />
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
                  DGHS Accredited
                </span>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  License: {hospital.tradeLicenseNumber || 'TRAD/2026/091'}
                </span>
              </div>

              <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: '0 0 10px' }}>
                {hospital.name}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '14px', marginBottom: '16px' }}>
                <MapPin size={16} color="#0060FA" />
                <span>{mainBranch?.addressLine || 'Sylhet, Bangladesh'}</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <a
                  href={`tel:${hospital.contactPhone}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: BRAND_COLORS.primary,
                    color: '#FFFFFF',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <Phone size={15} />
                  <span>Call Hospital: {hospital.contactPhone}</span>
                </a>

                <Link
                  href="/hospital/portal"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#F1F5F9',
                    color: '#0F172A',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <span>Hospital Staff Portal</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Facilities & Key Features */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {[
            { label: '24/7 Emergency Care', desc: 'Always open for trauma & emergency admissions', icon: HeartPulse, color: '#EF4444' },
            { label: 'ICU & Critical Care', desc: 'State of the art multi-bed intensive care unit', icon: Bed, color: '#0060FA' },
            { label: 'Specialist Chambers', desc: 'Daily outpatient consultations & serial booking', icon: Stethoscope, color: '#10B981' },
            { label: 'Verified DGHS Status', desc: 'Official government healthcare registration', icon: ShieldCheck, color: '#8B5CF6' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '18px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
                }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, marginBottom: '10px' }}>
                  <Icon size={20} />
                </div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>{item.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Affiliated Specialist Doctors */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Stethoscope size={20} color="#0060FA" />
            <span>{language === 'bn' ? 'হাসপাতালে উপস্থিত বিশেষজ্ঞ চিকিৎসকগণ' : 'Specialist Doctors with Chambers at this Hospital'}</span>
          </h2>

          {affiliatedAssocs.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {affiliatedAssocs.map((assoc) => (
                <div
                  key={assoc.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                    {assoc.doctor?.fullName || 'Specialist Consultant'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#0060FA', fontWeight: 600, marginBottom: '8px' }}>
                    {assoc.doctor?.specialization || 'Clinical Specialist'}
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
                    <span>View Chamber Schedule & Book</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', color: '#64748B', fontSize: '14px' }}>
              {language === 'bn'
                ? 'অনলাইন সিরিয়াল বুকিং বর্তমানে চালুকৃত ডাক্তারদের জন্য উন্মুক্ত রয়েছে।'
                : 'Doctors are available for walk-in OPD consultations and emergency intake 24/7. Call hospital helpline for appointment serial details.'}
            </div>
          )}
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
