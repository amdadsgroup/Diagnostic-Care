'use client';

import React from 'react';
import { SupportedLanguage } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import {
  Home,
  Calendar,
  TestTube2,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function HomeSampleCollectionSection({
  language,
  onRequestHomeCare,
}: {
  language: SupportedLanguage;
  onRequestHomeCare: () => void;
}) {
  const t = TRANSLATIONS[language];

  const steps = [
    {
      step: '01',
      icon: TestTube2,
      title: t.step1Title,
      desc: t.step1Desc,
      tag: language === 'en' ? 'Standard Pricing' : 'স্ট্যান্ডার্ড মূল্য',
    },
    {
      step: '02',
      icon: Calendar,
      title: t.step2Title,
      desc: t.step2Desc,
      tag: language === 'en' ? 'Flexible Slots' : 'পছন্দমতো সময়',
    },
    {
      step: '03',
      icon: ShieldCheck,
      title: t.step3Title,
      desc: t.step3Desc,
      tag: language === 'en' ? 'Sterile Cold-Chain' : 'জীবাণুমুক্ত কিট',
    },
    {
      step: '04',
      icon: FileCheck2,
      title: t.step4Title,
      desc: t.step4Desc,
      tag: language === 'en' ? '6-24 Hours' : '৬-২৪ ঘণ্টা',
    },
  ];

  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #0F1F38 100%)',
        color: '#FFFFFF',
        borderRadius: '20px',
        padding: '40px 32px',
        margin: '40px 0',
        border: '1px solid rgba(6, 182, 212, 0.25)',
        boxShadow: '0 20px 40px -10px rgba(5, 12, 22, 0.4)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '36px',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#67E8F9',
                marginBottom: '10px',
              }}
            >
              <Home size={12} />
              <span>DOORSTEP CLINICAL PHLEBOTOMY</span>
            </div>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '6px',
              }}
            >
              {t.homeCollectionTitle}
            </h2>
            <p style={{ fontSize: '14px', color: '#94A3B8', maxWidth: '640px' }}>
              {t.homeCollectionSubtitle}
            </p>
          </div>

          <button
            onClick={onRequestHomeCare}
            className="btn-cyan"
            style={{
              padding: '12px 24px',
              fontSize: '13.5px',
              borderRadius: '10px',
            }}
          >
            <span>{t.requestHomeSampleBtn}</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* 4-Step Process Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '18px',
          }}
        >
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '22px 18px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '14px',
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: 'rgba(6, 182, 212, 0.15)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        color: '#67E8F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#34D399',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {s.tag}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '15px',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      marginBottom: '8px',
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#94A3B8',
                      lineHeight: 1.5,
                    }}
                  >
                    {s.desc}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: '16px',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '11px',
                    color: '#67E8F9',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}
                >
                  STEP {s.step}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
