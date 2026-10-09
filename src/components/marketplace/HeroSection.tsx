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
      id="hero-section"
      style={{
        position: 'relative',
        backgroundColor: 'var(--clay-bg)',
        backgroundImage:
          'radial-gradient(circle at 10% 20%, rgba(23, 105, 245, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(17, 184, 165, 0.08) 0%, transparent 40%)',
        padding: '56px 0 64px 0',
        borderBottom: '1.5px solid rgba(226, 234, 244, 0.85)',
        overflow: 'hidden',
      }}
    >
      {/* Soft Subtle Background Accents */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          right: '5%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(23, 105, 245, 0.06) 0%, transparent 70%)',
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
          background: 'radial-gradient(circle, rgba(17, 184, 165, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.28fr) minmax(0, 1fr)',
            gap: '44px',
            alignItems: 'center',
          }}
          className="hero-grid-responsive"
        >
          {/* Left Column: Headline, Reassurance, Clean Search */}
          <div>
            {/* National Healthcare Infrastructure Pill */}
            <div
              className="clay-pill"
              style={{
                marginBottom: '18px',
                padding: '8px 18px',
                fontSize: '12px',
                color: '#1769F5',
              }}
            >
              <Sparkles size={14} color="#1769F5" />
              <span>{t.heroBadge}</span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#1769F5' }} />
              <span style={{ color: '#10294F', fontWeight: 600 }}>
                {BRAND_CONSTANTS.INITIAL_LAUNCH_LOCATION} Hub • Bangladesh
              </span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(32px, 3.8vw, 48px)',
                fontWeight: 800,
                lineHeight: 1.18,
                letterSpacing: '-0.03em',
                marginBottom: '16px',
                color: '#10294F',
              }}
            >
              {t.heroHeadline}
            </h1>

            {/* Subheadline */}
            <p
              style={{
                fontSize: '16px',
                color: '#576982',
                lineHeight: 1.65,
                maxWidth: '620px',
                marginBottom: '28px',
              }}
            >
              {t.heroSubheadline}
            </p>

            {/* Clean Healthcare Claymorphic Search Card */}
            <div
              className="clay-card"
              style={{
                padding: '16px',
                marginBottom: '20px',
              }}
            >
              {/* Category Filter Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  padding: '4px 4px 14px 4px',
                  borderBottom: '1.5px solid rgba(226, 234, 244, 0.7)',
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
                    onClick={() => {
                      setActiveSearchTab(item.id as any);
                      if (onSelectCategory && item.id !== 'ALL') {
                        onSelectCategory(item.id);
                      }
                    }}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '9999px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      background: activeSearchTab === item.id ? 'linear-gradient(145deg, #2563EB 0%, #1769F5 100%)' : '#FFFFFF',
                      color: activeSearchTab === item.id ? '#FFFFFF' : '#475569',
                      border: activeSearchTab === item.id ? '1px solid rgba(255, 255, 255, 0.45)' : '1.5px solid rgba(255, 255, 255, 0.95)',
                      boxShadow: activeSearchTab === item.id ? 'var(--clay-btn-primary-shadow)' : 'var(--clay-pill-shadow)',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      cursor: 'pointer',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Input Row: Location Select + Search Input + Search Action */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  paddingTop: '12px',
                  flexWrap: 'wrap',
                }}
              >
                {/* Location Filter Selector */}
                <div
                  className="clay-inset"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 14px',
                    minWidth: '150px',
                  }}
                >
                  <MapPin size={16} color="#1769F5" />
                  <select
                    id="hero-district-select"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#10294F',
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
                  className="clay-inset"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flex: 1,
                    minWidth: '220px',
                    padding: '10px 16px',
                  }}
                >
                  <Search size={17} color="#1769F5" />
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
                      color: '#14243D',
                      fontSize: '13.5px',
                      fontWeight: 500,
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{ color: '#94A3B8', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Submit Action */}
                <button
                  id="hero-execute-search-btn"
                  onClick={onSearchSubmit}
                  className="btn-primary"
                  style={{
                    padding: '11px 24px',
                    fontSize: '13.5px',
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
                  color: '#1769F5',
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
                  className="clay-pill"
                  style={{
                    fontSize: '11.5px',
                    padding: '5px 12px',
                    cursor: 'pointer',
                    color: '#10294F',
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
              className="clay-card"
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
                  borderBottom: '1.5px solid rgba(226, 234, 244, 0.7)',
                  marginBottom: '18px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BrandSymbol size={26} altText="Diagnostic Care" />
                  <span style={{ fontSize: '14.5px', fontWeight: 800, color: '#10294F', letterSpacing: '-0.01em' }}>
                    {t.telemetryTitle}
                  </span>
                </div>
                <div
                  className="clay-badge-emerald"
                  style={{
                    padding: '5px 12px',
                    borderRadius: '9999px',
                  }}
                >
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: '#15976A',
                      display: 'inline-block',
                      boxShadow: '0 0 6px #15976A',
                    }}
                  />
                  <span style={{ fontSize: '11px', fontWeight: 800 }}>LIVE NETWORK</span>
                </div>
              </div>

              {/* Verified Features / Real Status Nodes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Node 1: Active Doctor Chamber */}
                <div
                  className="clay-card-sm"
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
                      className="clay-bubble"
                      style={{
                        width: '42px',
                        height: '42px',
                        backgroundColor: '#EAF2FF',
                        color: '#1769F5',
                        flexShrink: 0,
                      }}
                    >
                      <Stethoscope size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#10294F' }}>
                        Dr. Anisur Rahman • Room 204
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#576982', fontWeight: 500 }}>
                        Cardiologist • Popular Diagnostic Center
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      className="clay-badge-emerald"
                      style={{
                        fontSize: '10.5px',
                        padding: '4px 10px',
                      }}
                    >
                      CHAMBER ACTIVE
                    </span>
                    <div style={{ fontSize: '11px', color: '#1769F5', marginTop: '3px', fontWeight: 700 }}>
                      Live Queue Token #02
                    </div>
                  </div>
                </div>

                {/* Node 2: Live Queue Chamber Status */}
                <div
                  className="clay-card-sm"
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
                      className="clay-bubble"
                      style={{
                        width: '42px',
                        height: '42px',
                        backgroundColor: '#FEF8EA',
                        color: '#D99116',
                        flexShrink: 0,
                      }}
                    >
                      <Clock size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#10294F' }}>
                        Live Chamber Queue Engine
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#576982', fontWeight: 500 }}>
                        4 Patients in Waiting Room • ~15m Wait
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#D99116' }}>
                      Token #03 Next
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#576982', fontWeight: 600 }}>5-Min Atomic Slot Lock</div>
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
                    className="clay-card-sm"
                    style={{
                      padding: '14px 16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1769F5', marginBottom: '6px' }}>
                      <TestTube2 size={16} />
                      <span style={{ fontSize: '12px', fontWeight: 800 }}>Pathology Lab</span>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#10294F' }}>4 Hours</div>
                    <div style={{ fontSize: '11px', color: '#576982', fontWeight: 500 }}>Avg. CBC & Urine Delivery</div>
                  </div>

                  {/* Ambulance Readiness */}
                  <div
                    className="clay-card-sm"
                    style={{
                      padding: '14px 16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#DC4545', marginBottom: '6px' }}>
                      <Ambulance size={16} />
                      <span style={{ fontSize: '12px', fontWeight: 800 }}>Ambulance 24/7</span>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#10294F' }}>12 Mins</div>
                    <div style={{ fontSize: '11px', color: '#576982', fontWeight: 500 }}>Avg. Response in Moulvibazar</div>
                  </div>
                </div>
              </div>

              {/* Bottom Reassurance Bar */}
              <div
                style={{
                  marginTop: '18px',
                  paddingTop: '16px',
                  borderTop: '1.5px solid rgba(226, 234, 244, 0.7)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11.5px',
                  color: '#576982',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="#15976A" />
                  <span style={{ fontWeight: 700, color: '#10294F' }}>BMDC Registered & DGHS Verified</span>
                </span>
                <button
                  onClick={onOpenHelpline}
                  className="clay-pill"
                  style={{
                    color: '#1769F5',
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
