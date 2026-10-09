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
        backgroundColor: '#FFFFFF',
        backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #F7FAFE 100%)',
        padding: '56px 0 64px 0',
        borderBottom: '1px solid #E2EAF4',
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
          background: 'radial-gradient(circle, rgba(23, 105, 245, 0.05) 0%, transparent 70%)',
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
          background: 'radial-gradient(circle, rgba(17, 184, 165, 0.04) 0%, transparent 70%)',
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
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#EAF2FF',
                border: '1px solid #D0E1FD',
                padding: '6px 14px',
                borderRadius: '24px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#1769F5',
                letterSpacing: '0.02em',
                marginBottom: '18px',
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
                color: '#64748B',
                lineHeight: 1.65,
                maxWidth: '620px',
                marginBottom: '28px',
              }}
            >
              {t.heroSubheadline}
            </p>

            {/* Clean Healthcare Search Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2EAF4',
                padding: '12px',
                boxShadow: '0 8px 30px rgba(16, 41, 79, 0.06)',
                marginBottom: '20px',
              }}
            >
              {/* Category Filter Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  padding: '4px 4px 10px 4px',
                  borderBottom: '1px solid #EDF3F9',
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
                      padding: '5px 13px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: activeSearchTab === item.id ? '#1769F5' : '#F0F5FD',
                      color: activeSearchTab === item.id ? '#FFFFFF' : '#64748B',
                      border: activeSearchTab === item.id ? '1px solid #1769F5' : '1px solid #E2EAF4',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
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
                  paddingTop: '10px',
                  flexWrap: 'wrap',
                }}
              >
                {/* Location Filter Selector */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2EAF4',
                    borderRadius: '10px',
                    padding: '9px 12px',
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
                      fontWeight: 600,
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
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flex: 1,
                    minWidth: '220px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2EAF4',
                    borderRadius: '10px',
                    padding: '9px 14px',
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
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#1769F5',
                    color: '#FFFFFF',
                    padding: '11px 22px',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(23, 105, 245, 0.25)',
                    transition: 'background-color 0.15s ease',
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
                  fontWeight: 600,
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
                  style={{
                    fontSize: '11.5px',
                    color: '#10294F',
                    backgroundColor: '#F0F5FD',
                    border: '1px solid #E2EAF4',
                    padding: '3px 11px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
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
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E2EAF4',
                padding: '24px',
                boxShadow: '0 12px 32px rgba(16, 41, 79, 0.08)',
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
                  borderBottom: '1px solid #EDF3F9',
                  marginBottom: '18px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BrandSymbol size={24} altText="Diagnostic Care" />
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#10294F', letterSpacing: '-0.01em' }}>
                    {t.telemetryTitle}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#E8F8F1',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    border: '1px solid #C4EED9',
                  }}
                >
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: '#15976A',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#15976A' }}>LIVE NETWORK</span>
                </div>
              </div>

              {/* Verified Features / Real Status Nodes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Node 1: Active Doctor Chamber */}
                <div
                  style={{
                    backgroundColor: '#F7FAFE',
                    border: '1px solid #E2EAF4',
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
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: '#EAF2FF',
                        border: '1px solid #D0E1FD',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#1769F5',
                        flexShrink: 0,
                      }}
                    >
                      <Stethoscope size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#10294F' }}>
                        Dr. Anisur Rahman • Room 204
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                        Cardiologist • Popular Diagnostic Center
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#15976A',
                        backgroundColor: '#E8F8F1',
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      CHAMBER ACTIVE
                    </span>
                    <div style={{ fontSize: '11px', color: '#1769F5', marginTop: '2px', fontWeight: 600 }}>
                      Live Queue Token #02
                    </div>
                  </div>
                </div>

                {/* Node 2: Live Queue Chamber Status */}
                <div
                  style={{
                    backgroundColor: '#F7FAFE',
                    border: '1px solid #E2EAF4',
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
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: '#FEF8EA',
                        border: '1px solid #FBE7B5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#D99116',
                        flexShrink: 0,
                      }}
                    >
                      <Clock size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#10294F' }}>
                        Live Chamber Queue Engine
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                        4 Patients in Waiting Room • ~15m Wait
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#D99116' }}>
                      Token #03 Next
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#64748B' }}>5-Min Atomic Slot Lock</div>
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
                    style={{
                      backgroundColor: '#F7FAFE',
                      border: '1px solid #E2EAF4',
                      borderRadius: '12px',
                      padding: '12px 14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1769F5', marginBottom: '4px' }}>
                      <TestTube2 size={15} />
                      <span style={{ fontSize: '11.5px', fontWeight: 700 }}>Pathology Lab</span>
                    </div>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#10294F' }}>4 Hours</div>
                    <div style={{ fontSize: '10.5px', color: '#64748B' }}>Avg. CBC & Urine Delivery</div>
                  </div>

                  {/* Ambulance Readiness */}
                  <div
                    style={{
                      backgroundColor: '#F7FAFE',
                      border: '1px solid #E2EAF4',
                      borderRadius: '12px',
                      padding: '12px 14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#DC4545', marginBottom: '4px' }}>
                      <Ambulance size={15} />
                      <span style={{ fontSize: '11.5px', fontWeight: 700 }}>Ambulance 24/7</span>
                    </div>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#10294F' }}>12 Mins</div>
                    <div style={{ fontSize: '10.5px', color: '#64748B' }}>Avg. Response in Moulvibazar</div>
                  </div>
                </div>
              </div>

              {/* Bottom Reassurance Bar */}
              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '14px',
                  borderTop: '1px solid #EDF3F9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11.5px',
                  color: '#64748B',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ShieldCheck size={15} color="#15976A" />
                  <span style={{ fontWeight: 600, color: '#10294F' }}>BMDC Registered & DGHS Verified</span>
                </span>
                <button
                  onClick={onOpenHelpline}
                  style={{
                    color: '#1769F5',
                    fontWeight: 700,
                    fontSize: '12px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px 4px',
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
