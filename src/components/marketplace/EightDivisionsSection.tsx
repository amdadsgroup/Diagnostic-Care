'use client';

import React from 'react';
import Link from 'next/link';
import { SupportedLanguage } from '@/config/brand';
import { BANGLADESH_DIVISIONS, AdministrativeDivision } from '@/data/bangladesh-divisions';
import { MapPin, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Globe } from 'lucide-react';

interface EightDivisionsSectionProps {
  language: SupportedLanguage;
  onSelectDivision?: (divisionSlug: string) => void;
  activeDivision?: string;
}

export default function EightDivisionsSection({
  language,
  onSelectDivision,
  activeDivision,
}: EightDivisionsSectionProps) {
  const isEn = language === 'en';

  return (
    <section
      id="divisions-discovery-section"
      style={{
        backgroundColor: '#F8FAFC',
        padding: '48px 0 40px 0',
        borderBottom: '1px solid #E2E8F0',
      }}
    >
      <div className="container" style={{ padding: '0 16px' }}>
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '9999px',
                backgroundColor: '#EFF6FF',
                color: '#0060FA',
                fontSize: '11.5px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '8px',
                border: '1px solid #BFDBFE',
              }}
            >
              <Globe size={13} />
              <span>{isEn ? 'Nationwide Healthcare Coverage' : 'সমগ্র বাংলাদেশ স্বাস্থ্যসেবা নেটওয়ার্ক'}</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(22px, 2.5vw, 28px)',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                margin: '0 0 6px 0',
                lineHeight: 1.25,
              }}
            >
              {isEn
                ? "Discover Healthcare Across Bangladesh's 8 Divisions"
                : 'বাংলাদেশের ৮টি প্রশাসনিক বিভাগে স্বাস্থ্যসেবা অনুসন্ধান'}
            </h2>

            <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0, lineHeight: 1.55 }}>
              {isEn
                ? 'Explore verified doctors, accredited diagnostic laboratories, and hospital facilities categorized across all administrative divisions.'
                : 'সকল প্রশাসনিক বিভাগ জুড়ে অনুমোদিত ডাক্তার, ডায়াগনস্টিক ল্যাব ও আধুনিক হাসপাতাল খুঁজে নিন সহজে।'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              href="/doctors"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: '#0060FA',
                fontSize: '12.5px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <span>{isEn ? 'All Bangladesh Doctors' : 'সমগ্র বাংলাদেশের ডাক্তার'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 8 Divisions Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '14px',
          }}
        >
          {BANGLADESH_DIVISIONS.map((division: AdministrativeDivision) => {
            const isHighlighted = division.highlight;
            const isCurrent = activeDivision?.toLowerCase() === division.slug;

            return (
              <Link
                key={division.id}
                href={`/locations/${division.slug}`}
                onClick={(e) => {
                  if (onSelectDivision) {
                    e.preventDefault();
                    onSelectDivision(division.slug);
                  }
                }}
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '18px 18px',
                  borderRadius: '12px',
                  backgroundColor: isCurrent ? '#EFF6FF' : '#FFFFFF',
                  border: isHighlighted
                    ? '1.5px solid #0060FA'
                    : isCurrent
                    ? '1.5px solid #0060FA'
                    : '1px solid #E2E8F0',
                  boxShadow: isHighlighted
                    ? '0 4px 12px rgba(0, 96, 250, 0.08)'
                    : '0 1px 3px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.18s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className="division-card"
              >
                {isHighlighted && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      backgroundColor: '#0060FA',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderBottomLeftRadius: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {isEn ? 'National Gateway' : 'জাতীয় গেটওয়ে'}
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: isHighlighted ? '#EFF6FF' : '#F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isHighlighted ? '#0060FA' : '#475569',
                      }}
                    >
                      <MapPin size={16} />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: '15px',
                          fontWeight: 800,
                          color: '#0F172A',
                          margin: 0,
                          lineHeight: 1.2,
                        }}
                      >
                        {isEn ? division.nameEn : division.nameBn}
                      </h3>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '1px' }}>
                        {isEn ? `${division.districtsCount} Districts` : `${division.districtsCount}টি জেলা`}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid #F1F5F9',
                    fontSize: '11.5px',
                    color: '#0060FA',
                    fontWeight: 600,
                  }}
                >
                  <span>{isEn ? 'Browse Services' : 'সেবা দেখুন'}</span>
                  <ChevronRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
