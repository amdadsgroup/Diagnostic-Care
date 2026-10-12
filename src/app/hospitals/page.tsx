'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_ORGANIZATIONS } from '@/lib/mock-data';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';
import {
  Building2,
  MapPin,
  Phone,
  Bed,
  ShieldCheck,
  Search,
  ChevronRight,
  ArrowRight,
  Clock,
  Sparkles,
  HeartPulse,
} from 'lucide-react';

export default function HospitalsDirectoryPage() {
  const { language, setLanguage } = useLanguage();
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');

  const hospitals = INITIAL_ORGANIZATIONS.filter(
    (org) => org.orgType === 'HOSPITAL'
  );

  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch =
      !search ||
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.branches.some((b) => b.districtName.toLowerCase().includes(search.toLowerCase()));
    const matchesDistrict =
      districtFilter === 'ALL' ||
      h.branches.some((b) => b.districtName.toLowerCase() === districtFilter.toLowerCase());
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
            <Building2 size={14} />
            <span>{language === 'bn' ? 'বাংলাদেশ হাসপাতাল ডিরেক্টরি' : 'BANGLADESH HOSPITAL DIRECTORY'}</span>
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
              ? 'সেরা হাসপাতাল ও স্পেশালাইজড ক্লিনিক সমূহ'
              : 'Verified Hospitals & Specialized Healthcare Facilities'}
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
              ? 'সিলেট, মৌলভীবাজার ও ঢাকা জুড়ে শীর্ষ হাসপাতাল সমূহের আইসিইউ, জরুরি সেবা, ও কনসালট্যান্ট চিকিৎসকদের তথ্য জানুন।'
              : 'Discover accredited hospitals with 24/7 emergency services, intensive care units (ICU), specialized departments, and verified specialist doctors across Bangladesh.'}
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
              placeholder={language === 'bn' ? 'হাসপাতালের নাম বা এলাকা দিয়ে খুঁজুন...' : 'Search by hospital name, district, or area...'}
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
            {['ALL', 'Sylhet', 'Moulvibazar', 'Dhaka'].map((dist) => (
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

        {/* Hospital Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '24px',
          }}
        >
          {filteredHospitals.map((hosp) => {
            const mainBranch = hosp.branches[0];
            return (
              <div
                key={hosp.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(0, 96, 250, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: BRAND_COLORS.primary,
                      }}
                    >
                      <Building2 size={24} />
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
                      {language === 'bn' ? 'DGHS ভেরিফাইড' : 'DGHS Verified'}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>
                    {hosp.name}
                  </h2>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '13px', marginBottom: '16px' }}>
                    <MapPin size={14} color="#0060FA" />
                    <span>{mainBranch?.addressLine || 'Sylhet, Bangladesh'}</span>
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
                        {hosp.branches.length}
                      </div>
                      <div>{language === 'bn' ? 'সক্রিয় শাখা' : 'Active Branches'}</div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>
                      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '15px' }}>
                        24/7
                      </div>
                      <div>{language === 'bn' ? 'জরুরি সেবা' : 'Emergency Care'}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                  <a
                    href={`tel:${hosp.contactPhone}`}
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
                    <Phone size={14} color="#0060FA" />
                    <span>{hosp.contactPhone}</span>
                  </a>

                  <Link
                    href={`/hospitals/${hosp.id}`}
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      borderRadius: '10px',
                      backgroundColor: BRAND_COLORS.primary,
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    <span>{language === 'bn' ? 'বিস্তারিত' : 'View Profile'}</span>
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
