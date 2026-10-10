'use client';

import React from 'react';
import { SupportedLanguage } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import {
  ShieldCheck,
  Award,
  Lock,
  Building2,
  Stethoscope,
  TestTube2,
  CheckCircle2,
  Ambulance,
  HeartPulse,
} from 'lucide-react';

export default function TrustSection({ language }: { language: SupportedLanguage }) {
  const t = TRANSLATIONS[language];

  const metrics = [
    {
      icon: Stethoscope,
      value: '1,200+',
      label: t.statSpecialistDoctors,
      color: '#0891B2',
      bg: 'var(--cyan-50)',
    },
    {
      icon: TestTube2,
      value: '250+',
      label: t.statDiagnosticCenters,
      color: '#0D9488',
      bg: '#CCFBF1',
    },
    {
      icon: Building2,
      value: '85+',
      label: t.statPartnerHospitals,
      color: '#2563EB',
      bg: '#EFF6FF',
    },
    {
      icon: Ambulance,
      value: '45+',
      label: t.statEmergencyHubs,
      color: '#E11D48',
      bg: '#FFF1F2',
    },
  ];

  const badges = [
    {
      icon: Award,
      title: t.trustBadgeBmdc,
      subtitle: language === 'en' ? 'Verified Practitioner Credentials' : 'যাচাইকৃত রেজিস্টার্ড চিকিৎসক',
    },
    {
      icon: ShieldCheck,
      title: t.trustBadgeDgsh,
      subtitle: language === 'en' ? 'Regulated Medical Laboratories' : 'নিয়ন্ত্রিত ও স্বীকৃত প্যাথলজি ল্যাব',
    },
    {
      icon: Lock,
      title: t.trustBadgeVault,
      subtitle: language === 'en' ? 'End-to-End Encrypted Records' : 'সুরক্ষিত ও ব্যক্তিগত স্বাস্থ্য ডাটা',
    },
    {
      icon: CheckCircle2,
      title: t.trustBadgePricing,
      subtitle: language === 'en' ? 'Zero Hidden Fees & Official Receipts' : 'অফিসিয়াল মানি রিসিপ্ট ও স্বচ্ছ ফি',
    },
  ];

  return (
    <section
      style={{
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'var(--blur-card)',
        WebkitBackdropFilter: 'var(--blur-card)',
        borderBottom: '1px solid var(--glass-border)',
        padding: '36px 0 32px 0',
      }}
    >
      <div className="container">
        {/* Metric Cards Row */}
        <div
          className="trust-metrics-grid"
          style={{
            display: 'grid',
            gap: '20px',
            marginBottom: '28px',
          }}
        >
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="glass-card-sm"
                style={{
                  borderRadius: '16px',
                  padding: '20px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: m.bg,
                    color: m.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(15, 118, 110, 0.1)',
                  }}
                >
                  <Icon size={24} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 800,
                      color: 'var(--color-text-primary)',
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {m.value}
                  </div>
                  <div
                    style={{
                      fontSize: '12.5px',
                      color: 'var(--color-text-secondary)',
                      fontWeight: 600,
                      marginTop: '3px',
                    }}
                  >
                    {m.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Verification Guarantee Strip */}
        <div
          className="glass-inset trust-badges-grid"
          style={{
            borderRadius: '16px',
            padding: '16px 22px',
            display: 'grid',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(15, 118, 110, 0.1)',
                    color: 'var(--color-primary)',
                    border: '1px solid rgba(15, 118, 110, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {b.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                    {b.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
