'use client';

import React from 'react';
import Link from 'next/link';
import { SupportedLanguage } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import { useLanguage } from '@/context/LanguageContext';
import {
  Search,
  MapPin,
  Stethoscope,
  TestTube2,
  Building2,
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
  Activity,
} from 'lucide-react';

interface HeroSectionProps {
  language?: SupportedLanguage;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  onSearchSubmit: () => void;
  onOpenHelpline: () => void;
  onSelectCategory?: (category: any) => void;
}

export default function HeroSection({
  language: propLanguage,
  searchQuery,
  setSearchQuery,
  selectedDistrict,
  setSelectedDistrict,
  onSearchSubmit,
  onSelectCategory,
}: HeroSectionProps) {
  const langContext = useLanguage();
  const language = propLanguage || langContext.language || 'en';
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const popularSpecialties = [
    { labelEn: 'Cardiology', labelBn: 'কার্ডিওলজি (হৃদরোগ)', query: 'Cardiology' },
    { labelEn: 'Medicine', labelBn: 'মেডিসিন', query: 'Medicine' },
    { labelEn: 'Gynecology', labelBn: 'স্ত্রী ও প্রসূতিরোগ', query: 'Gynecologist' },
    { labelEn: 'Pediatrics', labelBn: 'শিশু রোগ', query: 'Pediatrics' },
    { labelEn: 'Orthopedics', labelBn: 'অর্থোপেডিকস', query: 'Orthopedics' },
  ];

  const serviceCategories = [
    {
      href: '/doctors',
      icon: Stethoscope,
      titleEn: 'Specialist Doctors',
      titleBn: 'বিশেষজ্ঞ ডাক্তার',
      descEn: 'Consultation & Serials',
      descBn: 'চেম্বার অ্যাপয়েন্টমেন্ট',
    },
    {
      href: '/diagnostic-centers',
      icon: TestTube2,
      titleEn: 'Diagnostic Centers',
      titleBn: 'ডায়াগনস্টিক সেন্টার',
      descEn: 'Pathology & Imaging',
      descBn: 'প্যাথলজি ও ল্যাব টেস্ট',
    },
    {
      href: '/hospitals',
      icon: Building2,
      titleEn: 'Hospitals & Clinics',
      titleBn: 'হাসপাতাল ও ক্লিনিক',
      descEn: 'Verified Inpatient Care',
      descBn: 'অনুমোদিত স্বাস্থ্য কেন্দ্র',
    },
    {
      href: '/diagnostic-tests',
      icon: Activity,
      titleEn: 'Diagnostic Tests',
      titleBn: 'মেডিকেল টেস্ট',
      descEn: 'Price Catalog & Booking',
      descBn: 'টেস্ট তালিকা ও বুকিং',
    },
  ];

  return (
    <section
      id="hero-section"
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '44px 0 36px 0',
      }}
    >
      <div className="container">
        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          {/* Marketplace Title & Tagline */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: '#EFF6FF',
              color: '#0060FA',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '14px',
              border: '1px solid #BFDBFE',
            }}
          >
            <ShieldCheck size={14} />
            <span>{language === 'en' ? 'Your Healthcare Marketplace' : 'আপনার স্বাস্থ্যসেবা মার্কেটপ্লেস'}</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(24px, 3.5vw + 8px, 38px)',
              fontWeight: 800,
              lineHeight: 1.22,
              letterSpacing: '-0.025em',
              color: '#0F172A',
              marginBottom: '12px',
            }}
          >
            {language === 'en'
              ? 'Find Doctors, Hospitals & Diagnostic Centers in Bangladesh'
              : 'বাংলাদেশে ডাক্তার, হাসপাতাল ও ডায়াগনস্টিক সেন্টার খুঁজুন'}
          </h1>

          <p
            style={{
              fontSize: 'clamp(14px, 1.8vw, 16px)',
              color: '#475569',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 28px auto',
            }}
          >
            {language === 'en'
              ? 'Search verified medical specialists, explore accredited healthcare facilities, and book genuine consultation appointments with zero hidden fees.'
              : 'অভিজ্ঞ বিশেষজ্ঞ ডাক্তার খুঁজুন, নির্ভরযোগ্য হাসপাতাল ও ডায়াগনস্টিক সেন্টারের সেবা দেখুন এবং সরাসরি অ্যাপয়েন্টমেন্ট নিশ্চিত করুন।'}
          </p>

          {/* Unified Primary Search Interface */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #CBD5E1',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
              padding: '6px',
              marginBottom: '20px',
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearchSubmit();
              }}
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                flexWrap: 'nowrap',
                width: '100%',
              }}
              className="hero-search-form"
            >
              {/* Keyword / Doctor / Specialty / Test Query */}
              <div
                style={{
                  flex: '1 1 auto',
                  minWidth: 0,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '11px 16px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'en'
                      ? 'Search doctor, specialty, hospital, or diagnostic test...'
                      : 'ডাক্তারের নাম, বিভাগ, হাসপাতাল বা টেস্ট খুঁজুন...'
                  }
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#0F172A',
                    fontSize: '14px',
                    fontWeight: 500,
                    outline: 'none',
                    width: '100%',
                  }}
                />
              </div>

              {/* Submit Action: Search icon beside search box */}
              <button
                type="submit"
                className="btn-primary hero-search-btn"
                aria-label={language === 'en' ? 'Search' : 'খুঁজুন'}
                style={{
                  padding: '11px 22px',
                  fontSize: '14px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '10px',
                }}
              >
                <Search size={18} />
                <span className="hero-search-btn-label">
                  {language === 'en' ? 'Search' : 'খুঁজুন'}
                </span>
              </button>
            </form>
          </div>

          {/* Frequently Searched Specialties */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              flexWrap: 'wrap',
              marginBottom: '32px',
            }}
          >
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
              {language === 'en' ? 'Popular:' : 'জনপ্রিয়:'}
            </span>
            {popularSpecialties.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSearchQuery(item.query);
                  if (onSelectCategory) onSelectCategory(item.query);
                }}
                style={{
                  fontSize: '11.5px',
                  fontWeight: 500,
                  color: '#334155',
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
              >
                {language === 'en' ? item.labelEn : item.labelBn}
              </button>
            ))}
          </div>

          {/* 4 Frequently Used Core Service Categories */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '12px',
              textAlign: 'left',
            }}
          >
            {serviceCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  href={cat.href}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#93C5FD';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 96, 250, 0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: '#EFF6FF',
                      color: '#0060FA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                      {language === 'en' ? cat.titleEn : cat.titleBn}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      {language === 'en' ? cat.descEn : cat.descBn}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
