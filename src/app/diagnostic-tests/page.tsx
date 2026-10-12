'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_DIAGNOSTIC_TESTS } from '@/lib/mock-data';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';
import {
  TestTube2,
  Clock,
  Search,
  Filter,
  Phone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function DiagnosticTestsCatalogPage() {
  const { language, setLanguage } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    'ALL',
    'Pathology & Hematology',
    'Biochemistry',
    'Radiology & Imaging',
    'Cardiology Diagnostics',
    'Advanced Neuro-Imaging',
  ];

  const filteredTests = INITIAL_DIAGNOSTIC_TESTS.filter((t) => {
    const matchesSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'ALL' || t.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
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
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
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
            <span>{language === 'bn' ? 'ডায়াগনস্টিক টেস্টের মূল্য তালিকা' : 'DIAGNOSTIC INVESTIGATION PRICING'}</span>
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
              ? 'ডায়াগনস্টিক টেস্টের মূল্য ও প্রস্তুতি নির্দেশিকা'
              : 'Diagnostic Test Prices & Preparation Guidelines Bangladesh'}
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
              ? 'সিবিসি, লিপিড প্রোফাইল, ইউএসজি, এক্স-রে, ইসিজি, এমআরআই ও সিটি স্ক্যানের সঠিক ল্যাবরেটরি মূল্য ও ডেলিভারি সময়সূচি জানুন।'
              : 'Compare verified pathology, biochemistry, imaging, and scan prices across accredited laboratories with transparent BDT pricing and sample preparation instructions.'}
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
              placeholder={language === 'bn' ? 'টেস্টের নাম দিয়ে খুঁজুন (যেমন: CBC, Lipid, MRI)...' : 'Search test by name or code (e.g. CBC, Lipid, MRI, CT)...'}
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
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  backgroundColor: selectedCategory === cat ? BRAND_COLORS.primary : '#F1F5F9',
                  color: selectedCategory === cat ? '#FFFFFF' : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat === 'ALL' ? (language === 'bn' ? 'সকল বিভাগ' : 'All Categories') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tests Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '24px',
          }}
        >
          {filteredTests.map((test) => (
            <div
              key={test.id}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#0060FA', backgroundColor: 'rgba(0, 96, 250, 0.08)', padding: '3px 8px', borderRadius: '6px' }}>
                    {test.code}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    Report in {test.expectedDeliveryHours} hours
                  </span>
                </div>

                <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
                  {test.name}
                </h2>

                <div style={{ fontSize: '12px', color: '#0060FA', fontWeight: 600, marginBottom: '10px' }}>
                  {test.category} • Sample: {test.sampleType}
                </div>

                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: '0 0 12px' }}>
                  {test.description}
                </p>

                {test.preparationInstructions && (
                  <div
                    style={{
                      backgroundColor: '#F8FAFC',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: '#475569',
                      marginBottom: '16px',
                      borderLeft: '3px solid #0060FA',
                    }}
                  >
                    <strong>Preparation:</strong> {test.preparationInstructions}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Official Price:</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A' }}>
                    ৳ {test.discountPrice || test.price}
                    {test.discountPrice && (
                      <span style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'line-through', marginLeft: '6px' }}>
                        ৳ {test.price}
                      </span>
                    )}
                  </div>
                </div>

                <a
                  href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: BRAND_COLORS.primary,
                    color: '#FFFFFF',
                    padding: '9px 16px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <Phone size={14} />
                  <span>Book Test</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
