'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase/client';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';
import { BANGLADESH_DIVISIONS, BANGLADESH_DISTRICTS } from '@/data/bangladesh-divisions';
import { fetchWithCache, getCachedData } from '@/lib/cache';
import { CardSkeleton } from '@/components/ui/CardSkeleton';
import {
  TestTube2,
  MapPin,
  Phone,
  ShieldCheck,
  Search,
  ArrowRight,
  CheckCircle2,
  Home,
  RefreshCw,
} from 'lucide-react';

interface DiagnosticCenterRecord {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  phone: string;
  email?: string;
  hasHomeSampleCollection: boolean;
  dghsRegistrationNumber?: string;
  verificationStatus: string;
  district?: string;
}

export default function DiagnosticCentersDirectoryPage() {
  const { language, setLanguage } = useLanguage();
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');

  // Synchronous cache hydration for instant 0ms first render
  const cachedCenters = typeof window !== 'undefined' ? getCachedData<DiagnosticCenterRecord[]>('diagnostic_centers_directory_active_all', true) : null;
  const [centers, setCenters] = useState<DiagnosticCenterRecord[]>(cachedCenters || []);
  const [isLoading, setIsLoading] = useState(!cachedCenters || cachedCenters.length === 0);
  const [isError, setIsError] = useState(false);

  const fetchCenters = async () => {
    try {
      setIsError(false);
      if (!cachedCenters || cachedCenters.length === 0) {
        setIsLoading(true);
      }

      const { data } = await fetchWithCache('diagnostic_centers_directory_active_all', async () => {
        const [{ data: dbData, error: dbError }, { data: locData }] = await Promise.all([
          supabase
            .from('diagnostic_centers')
            .select(`
              id,
              name,
              name_bn,
              slug,
              phone,
              email,
              has_home_sample_collection,
              dghs_registration_number,
              verification_status,
              status
            `)
            .eq('status', 'active'),
          supabase
            .from('provider_locations')
            .select('provider_id, districts(name)')
            .eq('provider_type', 'diagnostic_center'),
        ]);

        if (dbError) throw dbError;

        const locMap: Record<string, string> = {};
        if (locData) {
          for (const loc of locData) {
            if (loc.districts && (loc.districts as any).name) {
              locMap[loc.provider_id] = (loc.districts as any).name;
            }
          }
        }

        return (dbData || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          nameBn: c.name_bn,
          slug: c.slug,
          phone: c.phone,
          email: c.email,
          hasHomeSampleCollection: Boolean(c.has_home_sample_collection),
          dghsRegistrationNumber: c.dghs_registration_number,
          verificationStatus: c.verification_status || 'verified',
          district: locMap[c.id] || (c.name.includes('Moulvibazar')
            ? 'Moulvibazar'
            : c.name.includes('Sylhet')
            ? 'Sylhet'
            : 'Dhaka'),
        }));
      }, { ttlMs: 10 * 60 * 1000 });

      if (data) {
        setCenters(data);
      }
    } catch (err) {
      console.warn('Diagnostic centers fetch notice:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const filteredCenters = centers.filter((dc) => {
    const matchesSearch =
      !search ||
      dc.name.toLowerCase().includes(search.toLowerCase()) ||
      (dc.nameBn && dc.nameBn.includes(search)) ||
      (dc.district && dc.district.toLowerCase().includes(search.toLowerCase()));
    const matchesDistrict =
      districtFilter === 'ALL' ||
      (dc.district && dc.district.toLowerCase() === districtFilter.toLowerCase()) ||
      (dc.name && dc.name.toLowerCase().includes(districtFilter.toLowerCase()));
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
            <span>{language === 'bn' ? 'বাংলাদেশ ডায়াগনস্টিক ল্যাব ডিরেক্টরি' : 'BANGLADESH DIAGNOSTIC LAB DIRECTORY'}</span>
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
              ? 'যাচাইকৃত প্যাথলজি ল্যাব ও ডায়াগনস্টিক সেন্টার'
              : 'Accredited Diagnostic Centers & Pathology Laboratories'}
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
              ? 'সঠিক রিপোর্ট, আধুনিক ইকুইপমেন্ট ও হোম স্যাম্পল কালেকশন সুবিধা সমন্বিত অনুমোদিত ডায়াগনস্টিক সেন্টার।'
              : 'Find certified pathology laboratories with automated test analyzers, digital imaging, and certified medical technologists across Bangladesh.'}
          </p>
        </div>

        {/* Filter Bar */}
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
              placeholder={language === 'bn' ? 'ডায়াগনস্টিক সেন্টারের নাম বা জেলা দিয়ে খুঁজুন...' : 'Search by diagnostic center name or district...'}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <MapPin size={16} color="#0060FA" />
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '13px',
                color: '#0F172A',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <option value="ALL">{language === 'bn' ? 'সমগ্র বাংলাদেশ (৬৪ জেলা)' : 'All Bangladesh (64 Districts)'}</option>
              {BANGLADESH_DIVISIONS.map((div) => {
                const divDistricts = BANGLADESH_DISTRICTS.filter((d) => d.divisionSlug === div.slug);
                return (
                  <optgroup key={div.id} label={language === 'bn' ? div.nameBn : div.nameEn}>
                    {divDistricts.map((d) => (
                      <option key={d.id} value={d.nameEn}>
                        {language === 'bn' ? `${d.nameBn} (${d.nameEn})` : `${d.nameEn} (${d.nameBn})`}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['ALL', 'Dhaka', 'Chattogram', 'Sylhet', 'Moulvibazar'].map((dist) => (
              <button
                key={dist}
                onClick={() => setDistrictFilter(dist)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: districtFilter === dist ? 600 : 500,
                  backgroundColor: districtFilter === dist ? '#0060FA' : '#F1F5F9',
                  color: districtFilter === dist ? '#FFFFFF' : '#475569',
                  border: '1px solid',
                  borderColor: districtFilter === dist ? '#0060FA' : '#E2E8F0',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {dist === 'ALL' ? (language === 'bn' ? 'সকল' : 'All') : dist}
              </button>
            ))}
          </div>
        </div>

        {/* Count Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
            {isLoading && centers.length === 0 ? (
              <span style={{ color: '#0060FA' }}>
                {language === 'bn' ? 'ডায়াগনস্টিক সেন্টার তালিকা যাচাই হচ্ছে...' : 'Checking diagnostic center directory...'}
              </span>
            ) : (
              `${filteredCenters.length} ${language === 'bn' ? 'টি অনুমোদিত ডায়াগনস্টিক সেন্টার' : 'Verified Diagnostic Centers'}`
            )}
          </div>
        </div>

        {/* Diagnostic Center Cards Grid or Clean Empty State */}
        {isLoading && centers.length === 0 ? (
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#0060FA', fontSize: '13px', fontWeight: 600 }}>
              <RefreshCw size={16} className="animate-spin" />
              <span>{language === 'bn' ? 'অনুমোদিত সেন্টারের তথ্য আনা হচ্ছে...' : 'Loading verified diagnostic centers...'}</span>
            </div>
            <CardSkeleton count={6} type="facility" />
          </div>
        ) : isError && centers.length === 0 ? (
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
              {language === 'bn' ? 'ডায়াগনস্টিক সেন্টার তালিকা লোড করা যায়নি' : 'Unable to load diagnostic center directory'}
            </div>
            <p style={{ fontSize: '13px', color: '#718096', marginBottom: '20px' }}>
              {language === 'bn' ? 'সংযোগ চেক করুন অথবা পুনরায় চেষ্টা করুন।' : 'Please check your connection or retry.'}
            </p>
            <button
              onClick={fetchCenters}
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
        ) : filteredCenters.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '20px',
            }}
          >
            {filteredCenters.map((dc) => (
              <div
                key={dc.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '22px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '8px',
                        backgroundColor: '#EFF6FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0060FA',
                      }}
                    >
                      <TestTube2 size={22} />
                    </div>
                    {dc.dghsRegistrationNumber && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: '#ECFDF5',
                          color: '#047857',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          border: '1px solid #A7F3D0',
                        }}
                      >
                        <ShieldCheck size={12} />
                        <span>DGHS Lab Reg</span>
                      </span>
                    )}
                  </div>

                  <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>
                    {language === 'bn' && dc.nameBn ? dc.nameBn : dc.name}
                  </h2>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '12.5px', marginBottom: '14px' }}>
                    <MapPin size={14} color="#0060FA" />
                    <span>{dc.district || 'Bangladesh'}</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#F8FAFC',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                      color: '#334155',
                    }}
                  >
                    <Home size={15} color={dc.hasHomeSampleCollection ? '#10B981' : '#94A3B8'} />
                    <span>
                      {dc.hasHomeSampleCollection
                        ? (language === 'bn' ? 'হোম স্যাম্পল কালেকশন সক্রিয়' : 'Home Sample Collection Available')
                        : (language === 'bn' ? 'সেন্টার স্যাম্পল কালেকশন' : 'In-Center Sample Collection')}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <Link
                    href={`/diagnostic-centers/${dc.id}`}
                    className="btn-primary"
                    style={{ flex: 1, padding: '8px 12px', fontSize: '12.5px', textAlign: 'center' }}
                  >
                    <span>{language === 'bn' ? 'টেস্ট তালিকা দেখুন' : 'View Test Catalog'}</span>
                    <ArrowRight size={13} />
                  </Link>
                  {dc.phone && (
                    <a
                      href={`tel:${dc.phone}`}
                      className="btn-outline"
                      style={{ padding: '8px 12px', fontSize: '12.5px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Phone size={13} />
                      <span>{language === 'bn' ? 'কল' : 'Call'}</span>
                    </a>
                  )}
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
              {language === 'bn' ? 'কোনো ডায়াগনস্টিক সেন্টার পাওয়া যায়নি' : 'No diagnostic centers found'}
            </h3>
            <p style={{ color: '#64748B', fontSize: '13.5px', lineHeight: 1.5, marginBottom: '20px' }}>
              {language === 'bn'
                ? 'আপনার ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন অথবা ডায়াগনস্টিক ল্যাব হিসেবে নিবন্ধন করুন।'
                : 'Try adjusting your district or search filter. Are you a diagnostic lab provider in Bangladesh?'}
            </p>
            <Link href="/provider/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
              {language === 'bn' ? 'ডায়াগনস্টিক সেন্টার নিবন্ধন করুন' : 'Register Your Diagnostic Center'}
            </Link>
          </div>
        )}
      </main>

      <Footer language={language} />
    </div>
  );
}
