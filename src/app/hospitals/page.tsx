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
  Building2,
  MapPin,
  Phone,
  Bed,
  ShieldCheck,
  Search,
  ArrowRight,
  Clock,
  HeartPulse,
  RefreshCw,
} from 'lucide-react';

interface HospitalRecord {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  phone: string;
  emergencyPhone?: string;
  email?: string;
  totalBeds?: number;
  icuBeds?: number;
  hasIcu: boolean;
  hasNicu: boolean;
  hasEmergency247: boolean;
  dghsRegistrationNumber?: string;
  verificationStatus: string;
  district?: string;
}

export default function HospitalsDirectoryPage() {
  const { language, setLanguage } = useLanguage();
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');

  // Synchronous cache hydration for instant 0ms first render
  const cachedHospitals = typeof window !== 'undefined' ? getCachedData<HospitalRecord[]>('hospitals_directory_active_all', true) : null;
  const [hospitals, setHospitals] = useState<HospitalRecord[]>(cachedHospitals || []);
  const [isLoading, setIsLoading] = useState(!cachedHospitals || cachedHospitals.length === 0);
  const [isError, setIsError] = useState(false);

  const fetchHospitals = async () => {
    try {
      setIsError(false);
      if (!cachedHospitals || cachedHospitals.length === 0) {
        setIsLoading(true);
      }

      const { data } = await fetchWithCache('hospitals_directory_active_all', async () => {
        const { data: dbData, error: dbError } = await supabase
          .from('hospitals')
          .select(`
            id,
            name,
            name_bn,
            slug,
            phone,
            emergency_phone,
            email,
            total_beds,
            icu_beds,
            has_icu,
            has_nicu,
            has_emergency_24_7,
            dghs_registration_number,
            verification_status,
            status
          `)
          .eq('status', 'active');

        if (dbError) throw dbError;

        return (dbData || []).map((h: any) => ({
          id: h.id,
          name: h.name,
          nameBn: h.name_bn,
          slug: h.slug,
          phone: h.phone,
          emergencyPhone: h.emergency_phone,
          email: h.email,
          totalBeds: h.total_beds,
          icuBeds: h.icu_beds,
          hasIcu: Boolean(h.has_icu),
          hasNicu: Boolean(h.has_nicu),
          hasEmergency247: Boolean(h.has_emergency_24_7),
          dghsRegistrationNumber: h.dghs_registration_number,
          verificationStatus: h.verification_status || 'verified',
          district: h.name.includes('Moulvibazar')
            ? 'Moulvibazar'
            : h.name.includes('Sylhet')
            ? 'Sylhet'
            : 'Dhaka',
        }));
      }, { ttlMs: 10 * 60 * 1000 });

      if (data) {
        setHospitals(data);
      }
    } catch (err) {
      console.warn('Hospitals fetch notice:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch =
      !search ||
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      (h.nameBn && h.nameBn.includes(search)) ||
      (h.district && h.district.toLowerCase().includes(search.toLowerCase()));
    const matchesDistrict =
      districtFilter === 'ALL' ||
      (h.district && h.district.toLowerCase() === districtFilter.toLowerCase()) ||
      (h.name && h.name.toLowerCase().includes(districtFilter.toLowerCase()));
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
            <Building2 size={14} />
            <span>{language === 'bn' ? 'বাংলাদেশ হাসপাতাল ডিরেক্টরি' : 'BANGLADESH HOSPITAL DIRECTORY'}</span>
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
              ? 'নিবন্ধিত হাসপাতাল ও স্পেশালাইজড ক্লিনিক সমূহ'
              : 'Verified Hospitals & Specialized Healthcare Facilities'}
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
              ? 'আইসিইউ, জরুরি বিভাগ, ও বিশেষজ্ঞ চিকিৎসক সমন্বিত অনুমোদিত হাসপাতাল সমূহের তালিকা।'
              : 'Discover accredited hospitals with emergency services, intensive care units (ICU), and verified clinical departments across Bangladesh.'}
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
              placeholder={language === 'bn' ? 'হাসপাতালের নাম বা এলাকা দিয়ে খুঁজুন...' : 'Search by hospital name or district...'}
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
            {['ALL', 'Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh', 'Moulvibazar'].map((dist) => (
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
                {dist === 'ALL' ? (language === 'bn' ? 'সকল বিভাগ ও জেলা' : 'All Bangladesh') : dist}
              </button>
            ))}
          </div>
        </div>

        {/* Count Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
            {isLoading && hospitals.length === 0 ? (
              <span style={{ color: '#0060FA' }}>
                {language === 'bn' ? 'হাসপাতাল তালিকা যাচাই হচ্ছে...' : 'Checking hospital directory...'}
              </span>
            ) : (
              `${filteredHospitals.length} ${language === 'bn' ? 'টি অনুমোদিত হাসপাতাল' : 'Verified Hospitals'}`
            )}
          </div>
        </div>

        {/* Hospital Cards Grid or Clean Empty State */}
        {isLoading && hospitals.length === 0 ? (
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#0060FA', fontSize: '13px', fontWeight: 600 }}>
              <RefreshCw size={16} className="animate-spin" />
              <span>{language === 'bn' ? 'অনুমোদিত হাসপাতালের তথ্য আনা হচ্ছে...' : 'Loading verified hospital directory...'}</span>
            </div>
            <CardSkeleton count={6} type="facility" />
          </div>
        ) : isError && hospitals.length === 0 ? (
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
              {language === 'bn' ? 'হাসপাতাল তালিকা লোড করা যায়নি' : 'Unable to load hospital directory'}
            </div>
            <p style={{ fontSize: '13px', color: '#718096', marginBottom: '20px' }}>
              {language === 'bn' ? 'সংযোগ চেক করুন অথবা পুনরায় চেষ্টা করুন।' : 'Please check your connection or retry.'}
            </p>
            <button
              onClick={fetchHospitals}
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
        ) : filteredHospitals.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '20px',
            }}
          >
            {filteredHospitals.map((hosp) => (
              <div
                key={hosp.id}
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
                      <Building2 size={22} />
                    </div>
                    {hosp.dghsRegistrationNumber && (
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
                        <span>DGHS Reg</span>
                      </span>
                    )}
                  </div>

                  <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>
                    {language === 'bn' && hosp.nameBn ? hosp.nameBn : hosp.name}
                  </h2>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '12.5px', marginBottom: '14px' }}>
                    <MapPin size={14} color="#0060FA" />
                    <span>{hosp.district || 'Bangladesh'}</span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                      backgroundColor: '#F8FAFC',
                      padding: '10px',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      border: '1px solid #E2E8F0',
                      textAlign: 'center',
                      fontSize: '11.5px',
                    }}
                  >
                    <div>
                      <div style={{ color: '#64748B' }}>Total Beds</div>
                      <strong style={{ color: '#0F172A', fontSize: '13px' }}>{hosp.totalBeds || 'N/A'}</strong>
                    </div>
                    <div>
                      <div style={{ color: '#64748B' }}>ICU Beds</div>
                      <strong style={{ color: '#0060FA', fontSize: '13px' }}>{hosp.icuBeds || 'N/A'}</strong>
                    </div>
                    <div>
                      <div style={{ color: '#64748B' }}>Emergency</div>
                      <strong style={{ color: hosp.hasEmergency247 ? '#10B981' : '#64748B', fontSize: '13px' }}>
                        {hosp.hasEmergency247 ? '24/7' : 'Standard'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <Link
                    href={`/hospitals/${hosp.id}`}
                    className="btn-primary"
                    style={{ flex: 1, padding: '8px 12px', fontSize: '12.5px', textAlign: 'center' }}
                  >
                    <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Facility'}</span>
                    <ArrowRight size={13} />
                  </Link>
                  {hosp.phone && (
                    <a
                      href={`tel:${hosp.phone}`}
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
              <Building2 size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
              {language === 'bn' ? 'কোনো হাসপাতাল পাওয়া যায়নি' : 'No hospitals found'}
            </h3>
            <p style={{ color: '#64748B', fontSize: '13.5px', lineHeight: 1.5, marginBottom: '20px' }}>
              {language === 'bn'
                ? 'আপনার ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন অথবা হাসপাতাল প্রোভাইডার হিসেবে নিবন্ধন করুন।'
                : 'Try adjusting your district or search filter. Are you a healthcare hospital provider in Bangladesh?'}
            </p>
            <Link href="/provider/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
              {language === 'bn' ? 'হাসপাতাল নিবন্ধন করুন' : 'Register Your Hospital'}
            </Link>
          </div>
        )}
      </main>

      <Footer language={language} />
    </div>
  );
}
