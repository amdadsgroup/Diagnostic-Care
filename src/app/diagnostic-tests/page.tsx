'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase/client';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';
import { fetchWithCache, getCachedData } from '@/lib/cache';
import { CardSkeleton } from '@/components/ui/CardSkeleton';
import {
  TestTube2,
  Clock,
  Search,
  Filter,
  Phone,
  CheckCircle2,
  AlertCircle,
  Home,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface LabTestRecord {
  id: string;
  name: string;
  nameBn?: string;
  category: string;
  sampleType?: string;
  turnaroundHours: number;
  preparationInstructions?: string;
  price: number;
  discountPrice?: number;
  isHomeSampleSupported: boolean;
  diagnosticCenterName?: string;
}

export default function DiagnosticTestsCatalogPage() {
  const { language, setLanguage } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Synchronous cache hydration for instant 0ms first render
  const cachedTests = typeof window !== 'undefined' ? getCachedData<LabTestRecord[]>('lab_tests_catalog_active_all', true) : null;
  const [tests, setTests] = useState<LabTestRecord[]>(cachedTests || []);
  const [isLoading, setIsLoading] = useState(!cachedTests || cachedTests.length === 0);
  const [isError, setIsError] = useState(false);

  const fetchLabTests = async () => {
    try {
      setIsError(false);
      if (!cachedTests || cachedTests.length === 0) {
        setIsLoading(true);
      }

      const { data } = await fetchWithCache('lab_tests_catalog_active_all', async () => {
        const { data: dbData, error: dbError } = await supabase
          .from('lab_tests')
          .select(`
            id,
            name,
            name_bn,
            category,
            sample_type,
            turnaround_hours,
            preparation_instructions,
            price,
            discount_price,
            is_home_sample_supported,
            diagnostic_centers (
              name
            )
          `)
          .eq('status', 'active');

        if (dbError) throw dbError;

        return (dbData || []).map((t: any) => {
          const dc = Array.isArray(t.diagnostic_centers) ? t.diagnostic_centers[0] : t.diagnostic_centers;
          return {
            id: t.id,
            name: t.name,
            nameBn: t.name_bn,
            category: t.category,
            sampleType: t.sample_type,
            turnaroundHours: t.turnaround_hours || 24,
            preparationInstructions: t.preparation_instructions,
            price: Number(t.price) || 0,
            discountPrice: t.discount_price ? Number(t.discount_price) : undefined,
            isHomeSampleSupported: Boolean(t.is_home_sample_supported),
            diagnosticCenterName: dc?.name || 'Accredited Diagnostic Partner',
          };
        });
      }, { ttlMs: 10 * 60 * 1000 });

      if (data) {
        setTests(data);
      }
    } catch (err) {
      console.warn('Lab tests fetch notice:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLabTests();
  }, []);

  const categories = [
    'ALL',
    'Pathology & Hematology',
    'Biochemistry',
    'Radiology & Imaging',
    'Cardiology Diagnostics',
  ];

  const filteredTests = tests.filter((t) => {
    const matchesSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.nameBn && t.nameBn.includes(search)) ||
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

      <main style={{ flex: 1, maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '36px 16px 80px' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#EFF6FF',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#0060FA',
              marginBottom: '10px',
              border: '1px solid #BFDBFE',
            }}
          >
            <TestTube2 size={14} />
            <span>{language === 'bn' ? 'ডায়াগনস্টিক টেস্ট ক্যাটালগ' : 'DIAGNOSTIC TEST CATALOG'}</span>
          </div>
          <h1
            style={{
              fontSize: '30px',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 10px',
              letterSpacing: '-0.02em',
            }}
          >
            {language === 'bn'
              ? 'মেডিকেল টেস্ট ও প্যাথলজি প্যাকেজ সমূহ'
              : 'Laboratory Tests & Pathology Pricing Catalog'}
          </h1>
          <p
            style={{
              fontSize: '14.5px',
              color: '#475569',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {language === 'bn'
              ? 'স্বচ্ছ মূল্য তালিকা, টেস্টের প্রস্তুতি নির্দেশিকা ও দ্রুত রিপোর্ট ডেলিভারি সুবিধা।'
              : 'Transparent catalog pricing, sample collection requirements, and turnaround times from accredited diagnostic centers.'}
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            marginBottom: '28px',
          }}
        >
          <div style={{ flex: '1 1 280px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <Search size={16} color="#64748B" />
            <input
              type="text"
              placeholder={language === 'bn' ? 'টেস্টের নাম দিয়ে খুঁজুন (উদা. CBC, Lipid, X-Ray)...' : 'Search test name (e.g. CBC, Lipid, X-Ray)...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '13.5px',
                color: '#0F172A',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: selectedCategory === cat ? 600 : 500,
                  backgroundColor: selectedCategory === cat ? '#0060FA' : '#F1F5F9',
                  color: selectedCategory === cat ? '#FFFFFF' : '#475569',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? '#0060FA' : '#E2E8F0',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat === 'ALL' ? (language === 'bn' ? 'সকল টেস্ট' : 'All Tests') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Count Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
            {isLoading && tests.length === 0 ? (
              <span style={{ color: '#0060FA' }}>
                {language === 'bn' ? 'টেস্ট তালিকা যাচাই হচ্ছে...' : 'Checking test catalog...'}
              </span>
            ) : (
              `${filteredTests.length} ${language === 'bn' ? 'টি অনুমোদিত টেস্ট পাওয়া গেছে' : 'Available Diagnostic Tests'}`
            )}
          </div>
        </div>

        {/* Tests List or Clean Empty State */}
        {isLoading && tests.length === 0 ? (
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#0060FA', fontSize: '13px', fontWeight: 600 }}>
              <RefreshCw size={16} className="animate-spin" />
              <span>{language === 'bn' ? 'অনুমোদিত টেস্টের তালিকা প্রস্তুত হচ্ছে...' : 'Loading verified diagnostic tests...'}</span>
            </div>
            <CardSkeleton count={6} type="test" />
          </div>
        ) : isError && tests.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #FED7D7',
              padding: '48px 24px',
              textAlign: 'center',
              maxWidth: '540px',
              margin: '0 auto',
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#C53030', marginBottom: '8px' }}>
              {language === 'bn' ? 'টেস্ট ক্যাটালগ লোড করা যায়নি' : 'Unable to load test catalog'}
            </div>
            <p style={{ fontSize: '13px', color: '#718096', marginBottom: '20px' }}>
              {language === 'bn' ? 'সংযোগ চেক করুন অথবা পুনরায় চেষ্টা করুন।' : 'Please check your connection or retry.'}
            </p>
            <button
              onClick={fetchLabTests}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#0060FA',
                color: '#FFFFFF',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <RefreshCw size={16} />
              <span>{language === 'bn' ? 'পুনরায় লোড করুন' : 'Retry'}</span>
            </button>
          </div>
        ) : filteredTests.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
            }}
          >
            {filteredTests.map((test) => (
              <div
                key={test.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: '#EFF6FF',
                        color: '#0060FA',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: '1px solid #BFDBFE',
                      }}
                    >
                      {test.category}
                    </span>
                    {test.sampleType && (
                      <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                        Sample: <strong>{test.sampleType}</strong>
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>
                    {language === 'bn' && test.nameBn ? test.nameBn : test.name}
                  </h3>

                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px' }}>
                    {test.diagnosticCenterName}
                  </div>

                  {test.preparationInstructions && (
                    <div
                      style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: '6px',
                        padding: '8px 10px',
                        fontSize: '11.5px',
                        color: '#475569',
                        marginBottom: '14px',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <strong>Prep:</strong> {test.preparationInstructions}
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingTop: '10px', borderTop: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748B' }}>
                      <Clock size={13} />
                      <span>{test.turnaroundHours}h delivery</span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                        {BRAND_CONSTANTS.CURRENCY_SYMBOL}{test.price}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/diagnostic-centers?search=${encodeURIComponent(test.name)}`}
                    className="btn-primary"
                    style={{ width: '100%', padding: '8px', fontSize: '12.5px', textAlign: 'center' }}
                  >
                    <span>{language === 'bn' ? 'ল্যাব বুকিং দেখুন' : 'Find Available Labs'}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '56px 24px',
              textAlign: 'center',
              maxWidth: '540px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                backgroundColor: '#EFF6FF',
                color: '#0060FA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <TestTube2 size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
              {language === 'bn' ? 'কোনো ডায়াগনস্টিক টেস্ট পাওয়া যায়নি' : 'No diagnostic tests found'}
            </h3>
            <p style={{ color: '#64748B', fontSize: '13.5px', lineHeight: 1.5, marginBottom: '20px' }}>
              {language === 'bn'
                ? 'অনুমোদিত ডায়াগনস্টিক সেন্টার তাদের টেস্ট ক্যাটালগ সরাসরি কনফিগার করে।'
                : 'Laboratory test catalogs are published directly by approved diagnostic centers. Browse centers or adjust your search filter.'}
            </p>
            <Link href="/diagnostic-centers" className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
              {language === 'bn' ? 'ডায়াগনস্টিক সেন্টার সমূহ দেখুন' : 'Browse Diagnostic Centers'}
            </Link>
          </div>
        )}
      </main>

      <Footer language={language} />
    </div>
  );
}
