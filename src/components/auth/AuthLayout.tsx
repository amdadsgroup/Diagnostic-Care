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
        backgroundColor: '#F7FAFE',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          height: '68px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2EAF4',
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
              fontWeight: 600,
              color: '#64748B',
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #E2EAF4',
              backgroundColor: '#FFFFFF',
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
          padding: '32px 16px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1060px',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            boxShadow:
              '0 20px 40px -15px rgba(16, 41, 79, 0.08), 0 1px 3px rgba(16, 41, 79, 0.04)',
            border: '1px solid #E2EAF4',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
          }}
          className="auth-grid-container"
        >
          {/* Desktop Left Side: Futuristic Healthcare Visual & Value Proposition */}
          <div
            className="d-desktop-only"
            style={{
              backgroundColor: '#10294F',
              backgroundImage:
                'radial-gradient(circle at 20% 20%, rgba(23, 105, 245, 0.3) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(17, 184, 165, 0.2) 0%, transparent 50%)',
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
                  'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
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
                  backgroundColor: 'rgba(0, 87, 255, 0.2)',
                  border: '1px solid rgba(0, 87, 255, 0.4)',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#93C5FD',
                  marginBottom: '24px',
                }}
              >
                <Activity size={14} color="#60A5FA" />
                <span>{language === 'bn' ? 'জাতীয় স্বাস্থ্যসেবা অবকাঠামো' : 'National Healthcare Infrastructure'}</span>
              </div>

              <h2
                style={{
                  fontSize: '30px',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  marginBottom: '14px',
                  color: '#FFFFFF',
                }}
              >
                Diagnostic <span style={{ color: '#60A5FA' }}>Care</span>
              </h2>

              <p
                style={{
                  fontSize: '15px',
                  color: '#94A3B8',
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
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 87, 255, 0.15)',
                    border: '1px solid rgba(0, 87, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#60A5FA',
                    flexShrink: 0,
                  }}
                >
                  <Lock size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC' }}>
                    {language === 'bn' ? '২৫৬-বিট এনক্রিপ্টেড হেলথ ভল্ট' : '256-Bit Encrypted Health Vault'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#94A3B8', marginTop: '2px' }}>
                    {language === 'bn'
                      ? 'আপনার মেডিকেল প্রেসক্রিপশন ও ল্যাব টেস্ট রিপোর্ট সম্পূর্ণ নিরাপদ।'
                      : 'Military-grade encryption for all prescriptions and lab reports.'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
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
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC' }}>
                    {language === 'bn' ? 'বিএমডিসি ও ডিজিএইচএস সার্টিফাইড' : 'BMDC & DGHS Standards'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#94A3B8', marginTop: '2px' }}>
                    {language === 'bn'
                      ? 'শুধুমাত্র অনুমোদিত ডাক্তার ও বিশ্বস্ত ক্লিনিক্যাল প্রতিষ্ঠান।'
                      : 'Direct access to verified medical practitioners and certified labs.'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
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
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC' }}>
                    {language === 'bn' ? '২৪/৭ পেশাদার হেল্পলাইন' : '24/7 Dedicated Care Helpline'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#94A3B8', marginTop: '2px' }}>
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
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11.5px',
                color: '#64748B',
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
              backgroundColor: '#FFFFFF',
            }}
          >
            {/* Header / Title */}
            <div style={{ marginBottom: '24px' }}>
              {badge && (
                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#EAF2FF',
                    color: '#1769F5',
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
                  color: '#14243D',
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
                  color: '#64748B',
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
