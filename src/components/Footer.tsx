'use client';

import React from 'react';
import Link from 'next/link';
import { BRAND_CONSTANTS, BRAND_COLORS, SupportedLanguage } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { SocialIcon } from '@/components/brand/SocialIcon';
import {
  Phone,
  MapPin,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Globe,
  HeartPulse,
  ExternalLink,
} from 'lucide-react';

interface FooterProps {
  language: SupportedLanguage;
  setLanguage?: (lang: SupportedLanguage) => void;
  onNavigateTab?: (tab: string, category?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, setLanguage, onNavigateTab }) => {
  const t = TRANSLATIONS[language];

  const handleLinkClick = (tab: string, category?: string) => {
    if (onNavigateTab) {
      onNavigateTab(tab, category);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: '#15313B',
        color: '#FFFFFF',
        marginTop: '80px',
        borderTop: '3px solid #0F766E',
        position: 'relative',
      }}
    >
      {/* 24/7 Helpline Ribbon Banner */}
      <div
        style={{
          background: 'linear-gradient(90deg, #0F2027 0%, #15313B 50%, #0F2027 100%)',
          padding: '24px 0',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            padding: '0 24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'rgba(15, 118, 110, 0.25)',
                border: '1px solid rgba(94, 234, 212, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5EEAD4',
                flexShrink: 0,
              }}
            >
              <Phone size={22} />
            </div>
            <div>
              <div
                style={{
                  fontSize: '17px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>{language === 'en' ? '24/7 Healthcare Helpline' : '২৪/৭ জাতীয় স্বাস্থ্যসেবা হেল্পলাইন'}</span>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 6px #10B981',
                  }}
                />
              </div>
              <div style={{ color: '#94A3B8', fontSize: '13px', marginTop: '2px' }}>
                {language === 'en'
                  ? 'Doctor consultation, diagnostic bookings & emergency ambulance dispatch'
                  : 'ডাক্তার অ্যাপয়েন্টমেন্ট, ল্যাব টেস্ট বুকিং ও জরুরি অ্যাম্বুলেন্স'}
              </div>
            </div>
          </div>

          <a
            href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
            id="footer-call-helpline-cta"
            className="btn-primary"
            style={{
              padding: '12px 26px',
              fontSize: '15px',
              borderRadius: '10px',
              textDecoration: 'none',
            }}
          >
            <Phone size={17} />
            <span>
              Call Now: <strong>{BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}</strong>
            </span>
          </a>
        </div>
      </div>

      {/* Main Footer Links Directory */}
      <div
        className="container"
        style={{
          padding: '56px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '36px',
        }}
      >
        {/* Brand Information & Mission */}
        <div>
          {/* Official Horizontal Diagnostic Care Logo */}
          <div style={{ marginBottom: '14px' }}>
            <BrandLogo variant="horizontal" theme="dark" size={36} />
          </div>

          <div
            style={{
              fontSize: '13px',
              color: '#60A5FA',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}
          >
            {BRAND_CONSTANTS.TAGLINE}
          </div>

          <p style={{ color: '#94A3B8', fontSize: '13.5px', lineHeight: 1.65, marginBottom: '20px' }}>
            Bangladesh&apos;s digital healthcare marketplace connecting patients with verified diagnostic centers, specialist doctors, hospitals, clinics, pharmacies and 24/7 emergency ambulance services.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#CBD5E1',
              fontSize: '12.5px',
              marginBottom: '20px',
            }}
          >
            <MapPin size={15} color="#60A5FA" />
            <span>HQ: {BRAND_CONSTANTS.HQ_ADDRESS}</span>
          </div>

          {/* Social Icons with consistent unified style */}
          <div>
            <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', fontWeight: 600 }}>
              Follow Diagnostic Care:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Diagnostic Care on Facebook"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  transition: 'background 0.15s ease',
                }}
              >
                <SocialIcon platform="facebook" size={17} color="#FFFFFF" />
              </a>

              <a
                href={`https://wa.me/88${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Diagnostic Care on WhatsApp"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  transition: 'background 0.15s ease',
                }}
              >
                <SocialIcon platform="whatsapp" size={17} color="#FFFFFF" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Diagnostic Care on LinkedIn"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  transition: 'background 0.15s ease',
                }}
              >
                <SocialIcon platform="linkedin" size={17} color="#FFFFFF" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Diagnostic Care on YouTube"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  transition: 'background 0.15s ease',
                }}
              >
                <SocialIcon platform="youtube" size={17} color="#FFFFFF" />
              </a>
            </div>
          </div>
        </div>

        {/* Column 2: Healthcare Services */}
        <div>
          <h4
            style={{
              fontSize: '13.5px',
              fontWeight: 800,
              marginBottom: '18px',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Healthcare Services
          </h4>
          <ul
            style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '13px',
              color: '#94A3B8',
            }}
          >
            <li>
              <Link href="/doctors" style={{ color: 'inherit', textDecoration: 'none' }}>
                Find Doctors
              </Link>
            </li>
            <li>
              <Link href="/tests" style={{ color: 'inherit', textDecoration: 'none' }}>
                Diagnostic Tests
              </Link>
            </li>
            <li>
              <Link href="/diagnostic-centers" style={{ color: 'inherit', textDecoration: 'none' }}>
                Diagnostic Centers
              </Link>
            </li>
            <li>
              <Link href="/hospitals" style={{ color: 'inherit', textDecoration: 'none' }}>
                Hospitals & Clinics
              </Link>
            </li>
            <li>
              <Link href="/pharmacies" style={{ color: 'inherit', textDecoration: 'none' }}>
                Pharmacies & Medicines
              </Link>
            </li>
            <li>
              <Link href="/ambulance" style={{ color: 'inherit', textDecoration: 'none' }}>
                Ambulance Dispatch 24/7
              </Link>
            </li>
            <li>
              <Link href="/home-care" style={{ color: 'inherit', textDecoration: 'none' }}>
                Home Healthcare & Phlebotomy
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Platform & Company */}
        <div>
          <h4
            style={{
              fontSize: '13.5px',
              fontWeight: 800,
              marginBottom: '18px',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Company & Support
          </h4>
          <ul
            style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '13px',
              color: '#94A3B8',
            }}
          >
            <li>
              <a href="#about" style={{ color: 'inherit' }}>About Diagnostic Care</a>
            </li>
            <li>
              <a href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`} style={{ color: 'inherit' }}>
                Contact Support (24/7): {BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}
              </a>
            </li>
            <li>
              <a href={`mailto:${BRAND_CONSTANTS.COMPANY_EMAIL}`} style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={13} color="#60A5FA" /> {BRAND_CONSTANTS.COMPANY_EMAIL}
              </a>
            </li>
            <li>
              <button
                onClick={() => handleLinkClick('queue')}
                style={{ color: 'inherit', textAlign: 'left', cursor: 'pointer' }}
              >
                Live Chamber Queue
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLinkClick('reports')}
                style={{ color: 'inherit', textAlign: 'left', cursor: 'pointer' }}
              >
                Digital Health Vault
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLinkClick('portal')}
                style={{ color: 'inherit', textAlign: 'left', cursor: 'pointer' }}
              >
                Provider & Partner Portal
              </button>
            </li>
            <li>
              <a href="#help" style={{ color: 'inherit' }}>Help Center & FAQ</a>
            </li>
          </ul>
        </div>

        {/* Column 4: Legal, Trust & Security */}
        <div>
          <h4
            style={{
              fontSize: '13.5px',
              fontWeight: 800,
              marginBottom: '18px',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Trust & Security
          </h4>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '14px',
              borderRadius: '10px',
              marginBottom: '14px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: 1.5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontWeight: 700, marginBottom: '4px' }}>
                <ShieldCheck size={14} /> BMDC & DGHS Compliance
              </div>
              All doctors and diagnostic centers listed are independently verified under Bangladesh healthcare regulations.
            </div>
          </div>

          <ul
            style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '13px',
              color: '#94A3B8',
            }}
          >
            <li>
              <a href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            </li>
            <li>
              <a href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
            </li>
            <li>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#93C5FD', fontSize: '12px', marginTop: '6px' }}>
                <Lock size={13} />
                <span>256-Bit Encrypted Health Vault</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright & Localization */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '20px 0',
          fontSize: '12px',
          color: '#64748B',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '0 24px',
          }}
        >
          <div>
            © {BRAND_CONSTANTS.COPYRIGHT_YEAR} {BRAND_CONSTANTS.BRAND_NAME}. {BRAND_CONSTANTS.TAGLINE}. All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span>{BRAND_CONSTANTS.INITIAL_LAUNCH_LOCATION} Hub • Bangladesh</span>
            {setLanguage && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Globe size={12} color="#60A5FA" />
                <button
                  onClick={() => setLanguage('en')}
                  style={{
                    color: language === 'en' ? '#60A5FA' : '#94A3B8',
                    fontWeight: language === 'en' ? 700 : 400,
                    cursor: 'pointer',
                  }}
                >
                  English
                </button>
                <span>/</span>
                <button
                  onClick={() => setLanguage('bn')}
                  style={{
                    color: language === 'bn' ? '#60A5FA' : '#94A3B8',
                    fontWeight: language === 'bn' ? 700 : 400,
                    cursor: 'pointer',
                  }}
                >
                  বাংলা
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
