'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BRAND_CONSTANTS, BRAND_COLORS, SupportedLanguage } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import { useLanguage } from '@/context/LanguageContext';
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
  Building2,
  Stethoscope,
  UserPlus,
  LogIn,
} from 'lucide-react';
import HospitalAuthModal from '@/components/provider/HospitalAuthModal';

interface FooterProps {
  language?: SupportedLanguage;
  setLanguage?: (lang: SupportedLanguage) => void;
  onNavigateTab?: (tab: string, category?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, setLanguage, onNavigateTab }) => {
  const langContext = useLanguage();
  const currentLanguage = language || langContext.language || 'en';
  const handleSetLanguage = (l: SupportedLanguage) => {
    if (setLanguage) setLanguage(l);
    langContext.setLanguage(l);
  };
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const [isHospitalAuthOpen, setIsHospitalAuthOpen] = useState(false);
  const [hospitalAuthMode, setHospitalAuthMode] = useState<'login' | 'register'>('login');

  React.useEffect(() => {
    const handleHash = () => {
      if (typeof window !== 'undefined' && window.location.hash === '#provider-hub') {
        const el = document.getElementById('provider-hub');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setIsHospitalAuthOpen(true);
      }
    };

    const handleCustomEvent = (e: any) => {
      const mode = e?.detail?.mode || 'login';
      setHospitalAuthMode(mode);
      setIsHospitalAuthOpen(true);
      const el = document.getElementById('provider-hub');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHash);
    window.addEventListener('open-hospital-portal', handleCustomEvent);

    if (typeof window !== 'undefined' && window.location.hash === '#provider-hub') {
      setIsHospitalAuthOpen(true);
    }

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('open-hospital-portal', handleCustomEvent);
    };
  }, []);

  const handleLinkClick = (tab: string, category?: string) => {
    if (onNavigateTab) {
      onNavigateTab(tab, category);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: '#090D14',
        color: '#FFFFFF',
        marginTop: '80px',
        borderTop: '3px solid var(--brand-primary)',
        position: 'relative',
      }}
    >
      {/* 24/7 Helpline Ribbon Banner */}
      <div
        style={{
          background: 'linear-gradient(90deg, #0F2027 0%, #090D14 50%, #0F2027 100%)',
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
                background: 'rgba(0, 96, 250, 0.25)',
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
                  ? 'Doctor chamber serial booking, specialist consultations & queue support'
                  : 'ডাক্তার চেম্বার সিরিয়াল বুকিং, বিশেষজ্ঞ পরামর্শ ও কিউ সাপোর্ট'}
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

      {/* Hospital, Diagnostic Center & Doctor Provider Portal Hub */}
      <div
        id="provider-hub"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 96, 250, 0.12) 0%, rgba(15, 32, 39, 0.9) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '28px 0',
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
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#60A5FA', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              <Building2 size={16} />
              <span>{language === 'en' ? 'B2B Healthcare Provider Portal' : 'স্বাস্থ্যসেবা প্রদানকারী প্রতিষ্ঠান ও চিকিৎসক পোর্টাল'}</span>
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
              {language === 'en'
                ? 'Hospital, Diagnostic Center & Doctor Management Access'
                : 'হাসপাতাল, ডায়াগনস্টিক সেন্টার ও ডাক্তার লগইন ও নিবন্ধন হাব'}
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0, maxWidth: '640px' }}>
              {language === 'en'
                ? 'Manage laboratory test catalogs, physician consultation chambers, real-time token queues, and digital report delivery from your dedicated provider portal.'
                : 'আপনার ল্যাবরেটরি টেস্ট ক্যাটালগ, বিশেষজ্ঞ চেম্বার সিরিয়াল, লাইভ টোকেন কিউ ও ডিজিটাল রিপোর্ট পরিচালনা করুন সরাসরি প্রোভাইডার কনসোল থেকে।'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Hospital Account Creation Modal Trigger */}
            <button
              type="button"
              onClick={() => {
                setHospitalAuthMode('register');
                setIsHospitalAuthOpen(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 18px',
                backgroundColor: 'rgba(0, 96, 250, 0.25)',
                border: '1.5px solid #3B82F6',
                color: '#93C5FD',
                borderRadius: '10px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <UserPlus size={16} />
              <span>{language === 'en' ? 'Create Hospital Account' : 'হাসপাতাল অ্যাকাউন্ট তৈরি'}</span>
            </button>

            {/* Hospital & Doctor Login Modal Trigger */}
            <button
              type="button"
              onClick={() => {
                setHospitalAuthMode('login');
                setIsHospitalAuthOpen(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 20px',
                backgroundColor: '#0060FA',
                color: '#FFFFFF',
                borderRadius: '10px',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 96, 250, 0.35)',
                transition: 'all 0.15s ease',
              }}
            >
              <Stethoscope size={16} />
              <span>{language === 'en' ? 'Hospital & Doctor Login' : 'হাসপাতাল ও ডাক্তার লগইন'}</span>
            </button>
          </div>
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
            Bangladesh&apos;s digital doctor appointment booking platform connecting patients with verified specialist physicians, real-time chamber serial queues, and accredited medical chambers.
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

        {/* Column 2: Doctor Specialties */}
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
            Doctor Specialties
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
                All Doctors Directory
              </Link>
            </li>
            <li>
              <Link href="/doctors?specialty=Cardiology" style={{ color: 'inherit', textDecoration: 'none' }}>
                Cardiology (Heart Care)
              </Link>
            </li>
            <li>
              <Link href="/doctors?specialty=Medicine" style={{ color: 'inherit', textDecoration: 'none' }}>
                Medicine & Diabetology
              </Link>
            </li>
            <li>
              <Link href="/doctors?specialty=Gynecologist" style={{ color: 'inherit', textDecoration: 'none' }}>
                Gynecology & Obstetrics
              </Link>
            </li>
            <li>
              <Link href="/doctors?specialty=Pediatrics" style={{ color: 'inherit', textDecoration: 'none' }}>
                Pediatrics (Child Specialists)
              </Link>
            </li>
            <li>
              <Link href="/doctors?specialty=Orthopedics" style={{ color: 'inherit', textDecoration: 'none' }}>
                Orthopedics & Trauma
              </Link>
            </li>
            <li>
              <Link href="/appointments" style={{ color: 'inherit', textDecoration: 'none' }}>
                My Appointments Dashboard
              </Link>
            </li>
            <li>
              <button
                onClick={() => handleLinkClick('prescriptions')}
                style={{ color: 'inherit', textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none', padding: 0, font: 'inherit' }}
              >
                Digital Prescriptions Vault
              </button>
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
                onClick={() => handleLinkClick('messages')}
                style={{ color: 'inherit', textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none', padding: 0, font: 'inherit' }}
              >
                Customer Care & Support
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  setHospitalAuthMode('register');
                  setIsHospitalAuthOpen(true);
                }}
                style={{ color: '#60A5FA', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}
              >
                <Building2 size={13} /> {language === 'en' ? 'Hospital Account Registration' : 'হাসপাতাল অ্যাকাউন্ট নিবন্ধন'}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  setHospitalAuthMode('login');
                  setIsHospitalAuthOpen(true);
                }}
                style={{ color: '#60A5FA', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}
              >
                <Stethoscope size={13} /> {language === 'en' ? 'Hospital & Doctor Portal Login' : 'হাসপাতাল ও ডাক্তার পোর্টাল লগইন'}
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Globe size={12} color="#60A5FA" />
              <button
                type="button"
                onClick={() => handleSetLanguage('en')}
                aria-pressed={currentLanguage === 'en'}
                aria-label="Switch language to English"
                style={{
                  color: currentLanguage === 'en' ? '#60A5FA' : '#94A3B8',
                  fontWeight: currentLanguage === 'en' ? 700 : 400,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px 4px',
                }}
              >
                English
              </button>
              <span style={{ color: '#475569' }}>/</span>
              <button
                type="button"
                onClick={() => handleSetLanguage('bn')}
                aria-pressed={currentLanguage === 'bn'}
                aria-label="বাংলা ভাষায় পরিবর্তন করুন"
                style={{
                  color: currentLanguage === 'bn' ? '#60A5FA' : '#94A3B8',
                  fontWeight: currentLanguage === 'bn' ? 700 : 400,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px 4px',
                }}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hospital & Doctor Access Modal (Bottom Portal System) */}
      <HospitalAuthModal
        isOpen={isHospitalAuthOpen}
        onClose={() => setIsHospitalAuthOpen(false)}
        defaultMode={hospitalAuthMode}
      />
    </footer>
  );
};

export default Footer;
