'use client';

import React, { useState } from 'react';
import { BRAND_CONSTANTS, BRAND_COLORS, SupportedLanguage } from '@/config/brand';
import { BrandSymbol } from '@/components/brand/BrandSymbol';
import { TRANSLATIONS } from '@/i18n/translations';
import {
  Search,
  MapPin,
  Sparkles,
  Stethoscope,
  TestTube2,
  Building2,
  Ambulance,
  Phone,
  Clock,
  ShieldCheck,
  Activity,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

interface HeroSectionProps {
  language: SupportedLanguage;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  onSearchSubmit: () => void;
  onOpenHelpline: () => void;
  onSelectCategory?: (category: any) => void;
}

export default function HeroSection({
  language,
  searchQuery,
  setSearchQuery,
  selectedDistrict,
  setSelectedDistrict,
  onSearchSubmit,
  onOpenHelpline,
  onSelectCategory,
}: HeroSectionProps) {
  const t = TRANSLATIONS[language];
  const [activeSearchTab, setActiveSearchTab] = useState<string>('ALL');

  const popularSearches = [
    { labelEn: 'Dr. Anisur Rahman (Cardiologist)', labelBn: 'ডাঃ আনিসুর রহমান (হৃদরোগ)', query: 'Anisur' },
    { labelEn: 'Gynecologist in Moulvibazar', labelBn: 'স্ত্রী ও প্রসূতিরোগ বিশেষজ্ঞ', query: 'Gynecologist' },
    { labelEn: 'Pediatrician (Child Specialist)', labelBn: 'শিশু রোগ বিশেষজ্ঞ', query: 'Pediatrics' },
    { labelEn: 'Medicine & Diabetologist', labelBn: 'মেডিসিন ও ডায়াবেটিস বিশেষজ্ঞ', query: 'Medicine' },
    { labelEn: 'Orthopedic Surgeon', labelBn: 'অর্থোপেডিক ও ট্রমা বিশেষজ্ঞ', query: 'Orthopedics' },
  ];

  return (
    <section
      id="hero-section"
      style={{
        position: 'relative',
        backgroundColor: 'var(--brand-bg)',
        backgroundImage:
          'radial-gradient(circle at 10% 20%, rgba(15, 118, 110, 0.09) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(221, 247, 240, 0.7) 0%, transparent 45%)',
        padding: '56px 0 64px 0',
        borderBottom: '1px solid var(--glass-border)',
        overflow: 'hidden',
      }}
    >
      {/* Soft Ambient Glow Elements */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          right: '5%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15, 118, 110, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-100px',
          left: '2%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(221, 247, 240, 0.8) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-grid-responsive">
          {/* Left Column: Headline, Reassurance, Clean Search */}
          <div style={{ maxWidth: '100%', minWidth: 0 }}>
            {/* National Healthcare Infrastructure Pill */}
            <div
              className="glass-pill"
              style={{
                marginBottom: '14px',
                padding: '6px 14px',
                fontSize: '11px',
                color: '#0F766E',
                background: 'var(--brand-fresh-mint)',
                borderColor: 'rgba(15, 118, 110, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                maxWidth: '100%',
                flexWrap: 'wrap',
                lineHeight: 1.4,
              }}
            >
              <Sparkles size={13} color="#0F766E" />
              <span>{t.heroBadge}</span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#0F766E' }} />
              <span style={{ color: '#15313B', fontWeight: 600 }}>
                {BRAND_CONSTANTS.INITIAL_LAUNCH_LOCATION} Hub • Bangladesh
              </span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(20px, 4.6vw, 38px)',
                fontWeight: 800,
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                marginBottom: '14px',
                color: '#15313B',
                wordBreak: 'normal',
                overflowWrap: 'break-word',
                maxWidth: '100%',
              }}
            >
              {language === 'en' ? 'Find the Right Doctor, Book Instant Chamber Serial.' : 'সঠিক ডাক্তার খুঁজুন, তাৎক্ষণিক চেম্বার সিরিয়াল বুক করুন।'}
            </h1>

            {/* Subheadline */}
            <p
              style={{
                fontSize: 'clamp(13px, 2.5vw, 15px)',
                color: '#627680',
                lineHeight: 1.6,
                maxWidth: '620px',
                marginBottom: '20px',
                overflowWrap: 'break-word',
              }}
            >
              {language === 'en' 
                ? 'Discover verified specialist doctors, check real-time chamber schedules, and confirm your appointment with guaranteed slot reservation.'
                : 'অভিজ্ঞ ডাক্তার খুঁজুন, চেম্বারের সময়সূচী দেখুন এবং সহজে নির্ভরযোগ্য অ্যাপয়েন্টমেন্ট বুক করুন।'}
            </p>

            {/* Quick Action CTAs */}
            <div className="hero-cta-group">
              <a
                href="/doctors"
                className="btn-primary hero-cta-btn"
              >
                <Stethoscope size={15} />
                <span>{language === 'en' ? 'Find a Doctor' : 'ডাক্তার খুঁজুন'}</span>
              </a>
              <button
                onClick={() => {
                  const el = document.getElementById('doctor-discovery-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else window.location.href = '/doctors';
                }}
                className="btn-outline hero-cta-btn"
              >
                <Activity size={15} color="#0F766E" />
                <span>{language === 'en' ? 'Chamber Schedules & Queue' : 'চেম্বার শিডিউল ও কিউ'}</span>
              </button>
            </div>

            {/* Clean Healthcare Glassmorphic Search Card */}
            <div
              className="glass-card"
              style={{
                padding: '16px',
                marginBottom: '20px',
              }}
            >
              {/* Category Filter Tabs: Doctor Specialties */}
              <div
                className="hero-tabs-scroll"
                style={{
                  display: 'flex',
                  gap: '8px',
                  padding: '4px 4px 14px 4px',
                  borderBottom: '1.5px solid rgba(226, 234, 244, 0.7)',
                  overflowX: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  maxWidth: '100%',
                }}
              >
                {[
                  { id: 'ALL', label: language === 'en' ? 'All Specialties' : 'সকল বিভাগ' },
                  { id: 'Cardiology', label: language === 'en' ? 'Cardiology' : 'কার্ডিওলজি (হৃদরোগ)' },
                  { id: 'Medicine', label: language === 'en' ? 'Medicine' : 'মেডিসিন' },
                  { id: 'Gynecologist', label: language === 'en' ? 'Gynecology' : 'স্ত্রী ও প্রসূতিরোগ' },
                  { id: 'Pediatrics', label: language === 'en' ? 'Pediatrics' : 'শিশু রোগ' },
                  { id: 'Orthopedics', label: language === 'en' ? 'Orthopedics' : 'অর্থোপেডিকস' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSearchTab(item.id);
                      if (onSelectCategory && item.id !== 'ALL') {
                        onSelectCategory(item.id);
                      }
                    }}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '9999px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      background: activeSearchTab === item.id ? 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)' : 'rgba(255, 255, 255, 0.85)',
                      color: activeSearchTab === item.id ? '#FFFFFF' : '#627680',
                      border: activeSearchTab === item.id ? '1px solid rgba(255, 255, 255, 0.45)' : '1px solid var(--glass-border)',
                      boxShadow: activeSearchTab === item.id ? '0 4px 12px rgba(15, 118, 110, 0.3)' : 'var(--glass-shadow-sm)',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Input Row: Location Select + Search Input + Search Action */}
              <div className="hero-search-inputs-row">
                {/* Location Filter Selector */}
                <div
                  className="glass-inset hero-input-district"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                  }}
                >
                  <MapPin size={16} color="#0F766E" />
                  <select
                    id="hero-district-select"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#15313B',
                      fontSize: '13px',
                      fontWeight: 700,
                      outline: 'none',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    <option value="Moulvibazar">{t.filterMoulvibazar}</option>
                    <option value="Sylhet">{t.filterSylhet}</option>
                    <option value="Dhaka">{t.filterDhaka}</option>
                    <option value="ALL">{t.filterAllDistricts}</option>
                  </select>
                </div>

                {/* Primary Query Input */}
                <div
                  className="glass-inset hero-input-query"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: '12px',
                    minWidth: 0,
                  }}
                >
                  <Search size={17} color="#0F766E" />
                  <input
                    type="text"
                    id="hero-universal-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                    placeholder={t.searchPlaceholder}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#15313B',
                      fontSize: '13.5px',
                      fontWeight: 500,
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{ color: '#8FA0AA', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Submit Action */}
                <button
                  id="hero-execute-search-btn"
                  onClick={onSearchSubmit}
                  className="btn-primary hero-btn-search"
                  style={{
                    padding: '11px 24px',
                    fontSize: '13.5px',
                    flexShrink: 0,
                  }}
                >
                  <span>{t.searchButton}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Trending / Popular Healthcare Searches */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '12px',
                  color: '#0F766E',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <TrendingUp size={13} />
                {t.popularSearchesLabel}
              </span>
              {popularSearches.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(item.query)}
                  className="glass-pill"
                  style={{
                    fontSize: '11.5px',
                    padding: '5px 12px',
                    cursor: 'pointer',
                    color: '#15313B',
                  }}
                >
                  {language === 'en' ? item.labelEn : item.labelBn}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Clean, Reassuring Healthcare Telemetry & Trust Card */}
          <div style={{ position: 'relative' }}>
            <div
              className="glass-card"
              style={{
                padding: '24px',
                position: 'relative',
              }}
            >
              {/* Card Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--glass-border)',
                  marginBottom: '18px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BrandSymbol size={26} altText="Diagnostic Care" />
                  <span style={{ fontSize: '14.5px', fontWeight: 800, color: '#15313B', letterSpacing: '-0.01em' }}>
                    {t.telemetryTitle}
                  </span>
                </div>
                <div
                  className="glass-badge-teal"
                  style={{
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(15, 118, 110, 0.25)',
                  }}
                >
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: '#15803D',
                      display: 'inline-block',
                      boxShadow: '0 0 6px #15803D',
                    }}
                  />
                  <span style={{ fontSize: '11px', fontWeight: 800 }}>LIVE NETWORK</span>
                </div>
              </div>

              {/* Verified Features / Real Status Nodes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Node 1: Active Doctor Chamber */}
                <div
                  className="glass-card-sm"
                  style={{
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--brand-fresh-mint)',
                        color: '#0F766E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(15, 118, 110, 0.2)',
                        flexShrink: 0,
                      }}
                    >
                      <Stethoscope size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#15313B' }}>
                        Dr. Anisur Rahman • Room 204
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#627680', fontWeight: 500 }}>
                        Cardiologist • Popular Diagnostic Center
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      className="glass-badge-teal"
                      style={{
                        fontSize: '10.5px',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                      }}
                    >
                      CHAMBER ACTIVE
                    </span>
                    <div style={{ fontSize: '11px', color: '#0F766E', marginTop: '3px', fontWeight: 700 }}>
                      Live Queue Token #02
                    </div>
                  </div>
                </div>

                {/* Node 2: Live Queue Chamber Status */}
                <div
                  className="glass-card-sm"
                  style={{
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(180, 83, 9, 0.1)',
                        color: '#B45309',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(180, 83, 9, 0.2)',
                        flexShrink: 0,
                      }}
                    >
                      <Clock size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#15313B' }}>
                        Live Chamber Queue Engine
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#627680', fontWeight: 500 }}>
                        4 Patients in Waiting Room • ~15m Wait
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#B45309' }}>
                      Token #03 Next
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#627680', fontWeight: 600 }}>5-Min Atomic Slot Lock</div>
                  </div>
                </div>

                {/* Node 3: Lab Report Turnaround & Emergency Ambulance */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  {/* Lab Telemetry */}
                  <div
                    className="glass-card-sm"
                    style={{
                      padding: '14px 16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F766E', marginBottom: '6px' }}>
                      <TestTube2 size={16} />
                      <span style={{ fontSize: '12px', fontWeight: 800 }}>Pathology Lab</span>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#15313B' }}>4 Hours</div>
                    <div style={{ fontSize: '11px', color: '#627680', fontWeight: 500 }}>Avg. CBC & Urine Delivery</div>
                  </div>

                  {/* Ambulance Readiness */}
                  <div
                    className="glass-card-sm"
                    style={{
                      padding: '14px 16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B91C1C', marginBottom: '6px' }}>
                      <Ambulance size={16} />
                      <span style={{ fontSize: '12px', fontWeight: 800 }}>Ambulance 24/7</span>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#15313B' }}>12 Mins</div>
                    <div style={{ fontSize: '11px', color: '#627680', fontWeight: 500 }}>Avg. Response in Moulvibazar</div>
                  </div>
                </div>
              </div>

              {/* Bottom Reassurance Bar */}
              <div
                style={{
                  marginTop: '18px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--glass-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11.5px',
                  color: '#627680',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="#15803D" />
                  <span style={{ fontWeight: 700, color: '#15313B' }}>BMDC Registered & DGHS Verified</span>
                </span>
                <button
                  onClick={onOpenHelpline}
                  className="glass-pill"
                  style={{
                    color: '#0F766E',
                    fontWeight: 700,
                    fontSize: '11.5px',
                    padding: '5px 12px',
                    cursor: 'pointer',
                  }}
                >
                  Tele-Desk Support →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
