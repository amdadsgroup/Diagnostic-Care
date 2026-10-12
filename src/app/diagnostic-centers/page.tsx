'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_ORGANIZATIONS } from '@/lib/mock-data';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';
import {
  TestTube2,
  MapPin,
  Phone,
  ShieldCheck,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function DiagnosticCentersDirectoryPage() {
  const { language, setLanguage } = useLanguage();
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');

  const diagnosticCenters = INITIAL_ORGANIZATIONS.filter(
    (org) => org.orgType === 'DIAGNOSTIC_CENTER'
  );

  const filteredCenters = diagnosticCenters.filter((dc) => {
    const matchesSearch =
      !search ||
      dc.name.toLowerCase().includes(search.toLowerCase()) ||
      dc.branches.some((b) => b.districtName.toLowerCase().includes(search.toLowerCase()));
    const matchesDistrict =
      districtFilter === 'ALL' ||
      dc.branches.some((b) => b.districtName.toLowerCase() === districtFilter.toLowerCase());
    return matchesSearch && matchesDistrict;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      <Header
        language={language}
        setLanguage={setLanguage}
        activeTab="marketplace"
        setActiveTab={() => {}}
      />

      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '36px 20px 80px' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(0, 96, 250, 0.08)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 800,
              color: '#0060FA',
              marginBottom: '12px',
            }}
          >
            <TestTube2 size={14} />
            <span>{language === 'bn' ? 'বাংলাদেশ ডায়াগনস্টিক ল্যাব ডিরেক্টরি' : 'ACCREDITED DIAGNOSTIC LABS'}</span>
          </div>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 900,
              color: '#0F172A',
              margin: '0 0 12px',
              letterSpacing: '-0.02em',
            }}
          >
            {language === 'bn'
              ? 'অনুমোদিত ডায়াগনস্টিক ও প্যাথলজি সেন্টার সমূহ'
              : 'Certified Diagnostic Centers & Pathology Laboratories'}
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: '#64748B',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {language === 'bn'
              ? 'সঠিক রিপোর্ট ও ডিজিটাল ডেলিভারির জন্য মৌলভীবাজার, সিলেট ও ঢাকা জুড়ে শীর্ষ ডায়াগনস্টিক সেন্টারের সেবা ও টেস্টের দাম জানুন।'
              : 'Compare diagnostic investigations, computerized pathology analyzers, home sample collection, and verified test pricing across Bangladesh.'}
          </p>
        </div>

        {/* Filter Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px 20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <div style={{ flex: '1 1 280px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#F8FAFC', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <Search size={18} color="#94A3B8" />
            <input
              type="text"
              placeholder={language === 'bn' ? 'ডায়াগনস্টিক সেন্টারের নাম দিয়ে খুঁজুন...' : 'Search by diagnostic center name or area...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '14px',
                color: '#0F172A',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['ALL', 'Moulvibazar', 'Sylhet', 'Dhaka'].map((dist) => (
              <button
                key={dist}
                onClick={() => setDistrictFilter(dist)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: districtFilter === dist ? 700 : 500,
                  backgroundColor: districtFilter === dist ? BRAND_COLORS.primary : '#F1F5F9',
                  color: districtFilter === dist ? '#FFFFFF' : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {dist === 'ALL' ? (language === 'bn' ? 'সকল জেলা' : 'All Districts') : dist}
              </button>
            ))}
          </div>
        </div>

        {/* Diagnostic Centers Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '24px',
          }}
        >
          {filteredCenters.map((dc) => {
            const mainBranch = dc.branches[0];
            return (
              <div
                key={dc.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#8B5CF6',
                      }}
                    >
                      <TestTube2 size={24} />
                    </div>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: '#DCFCE7',
                        color: '#15803D',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      <ShieldCheck size={13} />
                      Verified Lab
                    </span>
                  </div>

                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>
                    {dc.name}
                  </h2>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '13px', marginBottom: '16px' }}>
                    <MapPin size={14} color="#8B5CF6" />
                    <span>{mainBranch?.addressLine || 'Moulvibazar, Bangladesh'}</span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '10px',
                      backgroundColor: '#F8FAFC',
                      padding: '12px',
                      borderRadius: '12px',
                      marginBottom: '20px',
                    }}
                  >
                    <div style={{ fontSize: '12px', color: '#475569' }}>
                      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '15px' }}>
                        ★ {dc.rating || 4.9}
                      </div>
                      <div>{dc.reviewCount || 95}+ Reviews</div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>
                      <div style={{ fontWeight: 800, color: '#15803D', fontSize: '13px' }}>
                        Home Sample
                      </div>
                      <div>Available</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                  <a
                    href={`tel:${dc.contactPhone}`}
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      borderRadius: '10px',
                      backgroundColor: '#F1F5F9',
                      color: '#0F172A',
                      fontSize: '13px',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    <Phone size={14} color="#8B5CF6" />
                    <span>{dc.contactPhone}</span>
                  </a>

                  <Link
                    href={`/diagnostic-centers/${dc.id}`}
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      borderRadius: '10px',
                      backgroundColor: '#8B5CF6',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    <span>{language === 'bn' ? 'টেস্ট তালিকা' : 'View Tests'}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
