'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { BRAND, BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { BrandSymbol } from '@/components/brand/BrandSymbol';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import {
  ShieldCheck,
  Award,
  Activity,
  PhoneCall,
  CheckCircle2,
  Lock,
  ArrowLeft,
} from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
  activeMode?: 'login' | 'register' | 'forgot';
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  badge,
  activeMode = 'login',
}) => {
  const { t, language } = useLanguage();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-soft)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Frosted Navbar */}
      <header
        style={{
          height: '68px',
          backgroundColor: 'rgba(255, 255, 255, 0.78)',
          backdropFilter: 'var(--blur-nav)',
          WebkitBackdropFilter: 'var(--blur-nav)',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              gap: '10px',
            }}
          >
            <BrandLogo variant="horizontal" size={32} />
          </Link>
        </div>

        {/* Right side of Topbar: Language switcher + Back to Home */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <LanguageSwitcher variant="pills" showIcon />

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '12px',
              border: '1px solid var(--glass-border)',
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'var(--blur-card)',
              transition: 'all 0.15s ease',
            }}
          >
            <ArrowLeft size={14} />
            <span className="d-mobile-none">{t.commonBack || 'Back to Marketplace'}</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '36px 16px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1060px',
            borderRadius: '24px',
            border: '1px solid var(--glass-border)',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            boxShadow: 'var(--glass-shadow-lg)',
          }}
          className="auth-grid-container"
        >
          {/* Desktop Left Side: Futuristic Healthcare Visual & Value Proposition */}
          <div
            className="d-desktop-only"
            style={{
              background: 'linear-gradient(145deg, #004ED1 0%, #0060FA 55%, #090D14 100%)',
              color: '#FFFFFF',
              padding: '48px 40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle Grid Lines Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'radial-gradient(circle at 10% 10%, rgba(235, 243, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 90% 90%, rgba(0, 96, 250, 0.4) 0%, transparent 60%)',
                pointerEvents: 'none',
              }}
            />

            {/* Top Brand Statement */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(235, 243, 255, 0.15)',
                  border: '1px solid rgba(235, 243, 255, 0.3)',
                  padding: '5px 14px',
                  borderRadius: '100px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#EBF3FF',
                  marginBottom: '24px',
                  backdropFilter: 'var(--blur-card)',
                }}
              >
                <Activity size={14} color="#EBF3FF" />
                <span>{language === 'bn' ? 'জাতীয় স্বাস্থ্যসেবা অবকাঠামো' : 'National Healthcare Infrastructure'}</span>
              </div>

              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  marginBottom: '14px',
                  color: '#FFFFFF',
                }}
              >
                Diagnostic <span style={{ color: '#EBF3FF' }}>Care</span>
              </h2>

              <p
                style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: 1.6,
                  maxWidth: '380px',
                }}
              >
                {language === 'bn'
                  ? 'বাংলাদেশের রোগীদের জন্য ভেরিফাইড বিএমডিসি ডাক্তার, ডায়াগনস্টিক ল্যাব, জরুরি অ্যাম্বুলেন্স ও এনক্রিপ্টেড ডিজিটাল হেলথ ভল্ট।'
                  : 'Connecting Bangladesh patients with verified BMDC specialist doctors, accredited laboratories, 24/7 ambulances, and encrypted health records.'}
              </p>
            </div>

            {/* Middle Feature Highlights */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                margin: '36px 0',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#EBF3FF',
                    flexShrink: 0,
                  }}
                >
                  <Lock size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                    {language === 'bn' ? '২৫৬-বিট এনক্রিপ্টেড হেলথ ভল্ট' : '256-Bit Encrypted Health Vault'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.75)', marginTop: '2px' }}>
                    {language === 'bn'
                      ? 'আপনার মেডিকেল প্রেসক্রিপশন ও ল্যাব টেস্ট রিপোর্ট সম্পূর্ণ নিরাপদ।'
                      : 'Military-grade encryption for all prescriptions and lab reports.'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#34D399',
                    flexShrink: 0,
                  }}
                >
                  <Award size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                    {language === 'bn' ? 'বিএমডিসি ও ডিজিএইচএস সার্টিফাইড' : 'BMDC & DGHS Standards'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.75)', marginTop: '2px' }}>
                    {language === 'bn'
                      ? 'শুধুমাত্র অনুমোদিত ডাক্তার ও বিশ্বস্ত ক্লিনিক্যাল প্রতিষ্ঠান।'
                      : 'Direct access to verified medical practitioners and certified labs.'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#F87171',
                    flexShrink: 0,
                  }}
                >
                  <PhoneCall size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                    {language === 'bn' ? '২৪/৭ পেশাদার হেল্পলাইন' : '24/7 Dedicated Care Helpline'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.75)', marginTop: '2px' }}>
                    {language === 'bn'
                      ? 'যে কোনো সহায়তায় কল করুন: ০১৮৮৬-৭৪৮৫৬৪'
                      : `Immediate booking & emergency care: ${BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Verification Footer */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11.5px',
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              <span>{BRAND_CONSTANTS.INITIAL_LAUNCH_LOCATION} Sadar • Sylhet</span>
              <span>© {BRAND_CONSTANTS.COPYRIGHT_YEAR} {BRAND_CONSTANTS.BRAND_NAME}</span>
            </div>
          </div>

          {/* Right Side: Auth Form Container */}
          <div
            style={{
              padding: '40px 36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'var(--blur-card)',
            }}
          >
            {/* Header / Title */}
            <div style={{ marginBottom: '24px' }}>
              {badge && (
                <div
                  className="glass-badge-teal"
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '10px',
                  }}
                >
                  {badge}
                </div>
              )}

              <h1
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: '6px',
                  lineHeight: 1.25,
                }}
              >
                {title}
              </h1>

              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {subtitle}
              </p>
            </div>

            {/* Injected Form Component */}
            {children}
          </div>
        </div>
      </main>

      <style jsx global>{`
        @media (min-width: 900px) {
          .auth-grid-container {
            grid-template-columns: 1.05fr 1fr !important;
          }
        }
        @media (max-width: 899px) {
          .d-desktop-only {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
