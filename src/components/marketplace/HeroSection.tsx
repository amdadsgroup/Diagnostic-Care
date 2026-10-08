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
  Radio,
  FileCheck2,
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
  const [activeSearchTab, setActiveSearchTab] = useState<'ALL' | 'DOCTOR' | 'TEST' | 'CENTER' | 'HOSPITAL'>('ALL');

  const popularSearches = [
    { labelEn: 'Cardiologist in Moulvibazar', labelBn: 'হৃদরোগ বিশেষজ্ঞ মৌলভীবাজার', query: 'Cardiologist' },
    { labelEn: 'Complete Blood Count (CBC)', labelBn: 'সিবিসি টেস্ট (CBC with ESR)', query: 'CBC' },
    { labelEn: 'Popular Diagnostic Center', labelBn: 'পপুলার ডায়াগনস্টিক সেন্টার', query: 'Popular' },
    { labelEn: '4D Ultrasonography (USG)', labelBn: 'আল্ট্রাসনোগ্রাফি (USG)', query: 'Ultrasonography' },
    { labelEn: 'Lipid Profile Fasting', labelBn: 'লিপিড প্রোফাইল টেস্ট', query: 'Lipid' },
  ];

  return (
    <section
      className="medical-dark-grid"
      style={{
        position: 'relative',
        color: '#FFFFFF',
        padding: '64px 0 72px 0',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(6, 182, 212, 0.2)',
      }}
    >
      {/* Background Decorative Ambient Radial Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-150px',
          left: '0%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
            gap: '40px',
            alignItems: 'center',
          }}
          className="hero-grid-responsive"
        >
          {/* Left Column: Headline, Value Proposition, AI Command Search */}
          <div>
            {/* National Healthcare Infrastructure Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                padding: '5px 14px',
                borderRadius: '24px',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#67E8F9',
                letterSpacing: '0.05em',
                marginBottom: '20px',
                boxShadow: '0 0 16px rgba(6, 182, 212, 0.15)',
              }}
            >
              <Sparkles size={13} color="#22D3EE" />
              <span>{t.heroBadge}</span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#67E8F9' }} />
              <span style={{ color: '#E2E8F0' }}>{BRAND_CONSTANTS.INITIAL_LAUNCH_LOCATION} Hub</span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(32px, 4.2vw, 50px)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '18px',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t.heroHeadline}
            </h1>

            {/* Subheadline */}
            <p
              style={{
                fontSize: '15.5px',
                color: '#94A3B8',
                lineHeight: 1.65,
                maxWidth: '620px',
                marginBottom: '28px',
              }}
            >
              {t.heroSubheadline}
            </p>

            {/* AI-Assisted Command Interface Search Bar */}
            <div
              style={{
                background: 'rgba(14, 31, 56, 0.85)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                padding: '10px',
                boxShadow: '0 20px 40px -10px rgba(5, 12, 22, 0.5), 0 0 30px rgba(6, 182, 212, 0.15)',
                marginBottom: '20px',
              }}
            >
              {/* Search Type Filter Chips */}
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  padding: '4px 6px 10px 6px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  overflowX: 'auto',
                }}
              >
                {[
                  { id: 'ALL', label: t.searchTypeUniversal },
                  { id: 'DOCTOR', label: t.searchTypeDoctors },
                  { id: 'TEST', label: t.searchTypeTests },
                  { id: 'CENTER', label: t.searchTypeCenters },
                  { id: 'HOSPITAL', label: t.searchTypeHospitals },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSearchTab(item.id as any)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      background: activeSearchTab === item.id ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                      color: activeSearchTab === item.id ? '#67E8F9' : '#94A3B8',
                      border: activeSearchTab === item.id ? '1px solid rgba(6, 182, 212, 0.45)' : '1px solid transparent',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Input Row: Location Select + Search Input + Search CTA */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  paddingTop: '8px',
                  flexWrap: 'wrap',
                }}
              >
                {/* Location Filter Selector */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    minWidth: '150px',
                  }}
                >
                  <MapPin size={15} color="#22D3EE" />
                  <select
                    id="hero-district-select"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      outline: 'none',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    <option value="Moulvibazar" style={{ background: '#0A1628', color: '#FFF' }}>
                      {t.filterMoulvibazar}
                    </option>
                    <option value="Sylhet" style={{ background: '#0A1628', color: '#FFF' }}>
                      {t.filterSylhet}
                    </option>
                    <option value="ALL" style={{ background: '#0A1628', color: '#FFF' }}>
                      {t.filterAllDistricts}
                    </option>
                  </select>
                </div>

                {/* Primary Query Input */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flex: 1,
                    minWidth: '220px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '8px 14px',
                  }}
                >
                  <Search size={17} color="#67E8F9" />
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
                      color: '#FFFFFF',
                      fontSize: '13.5px',
                      letterSpacing: '-0.01em',
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{ color: '#94A3B8', fontSize: '13px', fontWeight: 700 }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Submit Action */}
                <button
                  id="hero-execute-search-btn"
                  onClick={onSearchSubmit}
                  className="btn-cyan"
                  style={{
                    padding: '10px 22px',
                    fontSize: '13.5px',
                    borderRadius: '10px',
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
                  fontSize: '11.5px',
                  color: '#67E8F9',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <TrendingUp size={12} />
                {t.popularSearchesLabel}
              </span>
              {popularSearches.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(item.query)}
                  style={{
                    fontSize: '11px',
                    color: '#CBD5E1',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '3px 10px',
                    borderRadius: '14px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {language === 'en' ? item.labelEn : item.labelBn}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Futuristic Medical Ecosystem Telemetry Card Visual */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                background: 'linear-gradient(145deg, rgba(14, 31, 56, 0.95) 0%, rgba(10, 22, 40, 0.98) 100%)',
                borderRadius: '20px',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                padding: '24px',
                boxShadow: '0 25px 50px -12px rgba(5, 12, 22, 0.6), 0 0 35px rgba(6, 182, 212, 0.18)',
                position: 'relative',
              }}
            >
              {/* Header Ticker */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  marginBottom: '18px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BrandSymbol size={22} altText="Diagnostic Care" />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                    {t.telemetryTitle}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                  }}
                >
                  <span className="beacon-dot green" style={{ width: '6px', height: '6px' }} />
                  <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#34D399' }}>LIVE MONITOR</span>
                </div>
              </div>

              {/* Floating Telemetry Nodes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Node 1: Active Doctor Chamber Indicator */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: 'rgba(6, 182, 212, 0.15)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#22D3EE',
                        flexShrink: 0,
                      }}
                    >
                      <Stethoscope size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                        Dr. Anisur Rahman • Room 204
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                        Cardiologist • Popular Diagnostic Center
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#10B981',
                        background: 'rgba(16, 185, 129, 0.15)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      CHAMBER ACTIVE
                    </span>
                    <div style={{ fontSize: '10px', color: '#67E8F9', marginTop: '2px' }}>
                      Token #02 In Consultation
                    </div>
                  </div>
                </div>

                {/* Node 2: Live Queue Chamber Status */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FBBF24',
                        flexShrink: 0,
                      }}
                    >
                      <Clock size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                        Live Chamber Queue Engine
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                        4 Patients in Waiting Room • ~15m Wait
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#FBBF24' }}>
                      Token #03 Next
                    </div>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>Slot Held for 5 Mins</div>
                  </div>
                </div>

                {/* Node 3: Lab Report Turnaround & Emergency Ambulance */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                  }}
                >
                  {/* Lab Telemetry */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      padding: '10px 12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#67E8F9', marginBottom: '4px' }}>
                      <TestTube2 size={13} />
                      <span style={{ fontSize: '11px', fontWeight: 700 }}>Pathology Lab</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>4 Hours</div>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>Avg. CBC & Urine Delivery</div>
                  </div>

                  {/* Ambulance Readiness */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      padding: '10px 12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F87171', marginBottom: '4px' }}>
                      <Ambulance size={13} />
                      <span style={{ fontSize: '11px', fontWeight: 700 }}>Ambulance 24/7</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>12 Mins</div>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>Avg. Response in Moulvibazar</div>
                  </div>
                </div>
              </div>

              {/* Bottom Telemetry Verification Bar */}
              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '14px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11px',
                  color: '#94A3B8',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ShieldCheck size={14} color="#10B981" />
                  <span>BMDC Registered & DGHS Verified</span>
                </span>
                <button
                  onClick={onOpenHelpline}
                  style={{
                    color: '#38BDF8',
                    fontWeight: 700,
                    fontSize: '11.5px',
                    background: 'none',
                    padding: '2px 6px',
                  }}
                >
                  Tele-Desk Support →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .hero-grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
