'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase/client';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';
import {
  MapPin,
  Building2,
  Stethoscope,
  Microscope,
  Phone,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
} from 'lucide-react';

const CITY_INFO: Record<
  string,
  { en: string; bn: string; division: string; descEn: string; descBn: string }
> = {
  dhaka: {
    en: 'Dhaka Division',
    bn: 'ঢাকা বিভাগ',
    division: 'Dhaka Division (National Gateway)',
    descEn:
      'Discover leading tertiary hospitals, accredited diagnostic complexes, and renowned BMDC specialist doctors across Dhaka metropolitan and surrounding districts.',
    descBn:
      'ঢাকা মেট্রোপলিটন ও পার্শ্ববর্তী জেলাসমূহের শীর্ষ হাসপাতাল, স্বনামধন্য ডায়াগনস্টিক কমপ্লেক্স এবং অভিজ্ঞ বিশেষজ্ঞ চিকিৎসকদের তালিকা।',
  },
  chattogram: {
    en: 'Chattogram Division',
    bn: 'চট্টগ্রাম বিভাগ',
    division: 'Chattogram Division',
    descEn:
      'Healthcare directories, diagnostic test pricing, and specialist chambers across Chattogram, Cox\'s Bazar, and regional districts.',
    descBn:
      'চট্টগ্রাম, কক্সবাজার ও পার্শ্ববর্তী অঞ্চলের অনুমোদিত হাসপাতাল, ল্যাবরেটরি ও বিশেষজ্ঞ চিকিৎসকদের চেম্বার অনুসন্ধান করুন।',
  },
  chittagong: {
    en: 'Chattogram Division',
    bn: 'চট্টগ্রাম বিভাগ',
    division: 'Chattogram Division',
    descEn:
      'Healthcare directories, diagnostic test pricing, and specialist chambers across Chattogram, Cox\'s Bazar, and regional districts.',
    descBn:
      'চট্টগ্রাম, কক্সবাজার ও পার্শ্ববর্তী অঞ্চলের অনুমোদিত হাসপাতাল, ল্যাবরেটরি ও বিশেষজ্ঞ চিকিৎসকদের চেম্বার অনুসন্ধান করুন।',
  },
  rajshahi: {
    en: 'Rajshahi Division',
    bn: 'রাজশাহী বিভাগ',
    division: 'Rajshahi Division',
    descEn:
      'Search medical institutions, specialized diagnostic centers, and consultant doctor serials across Rajshahi, Bogura, and northern districts.',
    descBn:
      'রাজশাহী, বগুড়া ও উত্তরাঞ্চলের জেলাসমূহের অনুমোদিত মেডিকেল প্রতিষ্ঠান, ডায়াগনস্টিক ল্যাব ও বিশেষজ্ঞ ডাক্তার তালিকা।',
  },
  khulna: {
    en: 'Khulna Division',
    bn: 'খুলনা বিভাগ',
    division: 'Khulna Division',
    descEn:
      'Explore clinical facilities, hospital beds, and certified pathology centers across Khulna, Jashore, and southwestern districts.',
    descBn:
      'খুলনা, যশোর ও দক্ষিণ-পশ্চিমাঞ্চলের রেজিস্টার্ড ক্লিনিক, ডায়াগনস্টিক ল্যাব ও বিশেষজ্ঞ ডাক্তারদের চেম্বার তথ্য।',
  },
  barishal: {
    en: 'Barishal Division',
    bn: 'বরিশাল বিভাগ',
    division: 'Barishal Division',
    descEn:
      'Verified hospitals, emergency ambulance networks, and diagnostic services across Barishal, Patuakhali, and coastal districts.',
    descBn:
      'বরিশাল, পটুয়াখালী ও উপকূলীয় জেলাসমূহের হাসপাতাল, জরুরি অ্যাম্বুলেন্স এবং ডায়াগনস্টিক সেন্টারের বিস্তারিত তথ্য।',
  },
  sylhet: {
    en: 'Sylhet Division',
    bn: 'সিলেট বিভাগ',
    division: 'Sylhet Division',
    descEn:
      'Find leading hospitals, accredited diagnostic labs, and renowned medical consultants across Sylhet, Moulvibazar, Habiganj, and Sunamganj.',
    descBn:
      'সিলেটের সুবহানীঘাট, সুবিদবাজার ও জিন্দাবাজারের শীর্ষ হাসপাতাল এবং বিশেষজ্ঞ ডাক্তারদের চেম্বারের শিডিউল।',
  },
  rangpur: {
    en: 'Rangpur Division',
    bn: 'রংপুর বিভাগ',
    division: 'Rangpur Division',
    descEn:
      'Explore healthcare infrastructure, verified diagnostic laboratories, and doctor consultation chambers in Rangpur, Dinajpur, and surrounding districts.',
    descBn:
      'রংপুর, দিনাজপুর ও পার্শ্ববর্তী উত্তরাঞ্চলের অনুমোদিত স্বাস্থ্য কেন্দ্র, ডায়াগনস্টিক ল্যাব ও বিশেষজ্ঞ ডাক্তার।',
  },
  mymensingh: {
    en: 'Mymensingh Division',
    bn: 'ময়মনসিংহ বিভাগ',
    division: 'Mymensingh Division',
    descEn:
      'Search hospitals, diagnostic clinics, and doctor appointments across Mymensingh, Jamalpur, Netrokona, and Sherpur.',
    descBn:
      'ময়মনসিংহ, জামালপুর, নেত্রকোণা ও শেরপুরের হাসপাতাল, ডায়াগনস্টিক সেন্টার ও বিশেষজ্ঞ ডাক্তারদের তথ্য।',
  },
  moulvibazar: {
    en: 'Moulvibazar',
    bn: 'মৌলভীবাজার',
    division: 'Sylhet Division',
    descEn:
      'Explore verified diagnostic test centers, specialist doctor chambers, and hospital facilities across Moulvibazar Sadar, Sreemangal, Kamalganj, and Kulaura.',
    descBn:
      'মৌলভীবাজার সদর, শ্রীমঙ্গল, কুলাউড়া ও কমলগঞ্জের অনুমোদিত হাসপাতাল, ডায়াগনস্টিক ল্যাব এবং বিশেষজ্ঞ ডাক্তারদের তালিকা।',
  },
};

import { getCachedData } from '@/lib/cache';
import { CardSkeleton } from '@/components/ui/CardSkeleton';

export default function LocationCityPage() {
  const params = useParams();
  const rawCity = (params?.city as string) || 'moulvibazar';
  const cityKey = rawCity.toLowerCase();
  const { language, setLanguage } = useLanguage();

  // Fast cache hydration
  const cachedHospitals = typeof window !== 'undefined' ? getCachedData<any[]>('hospitals_directory_active_all', true) : null;
  const cachedCenters = typeof window !== 'undefined' ? getCachedData<any[]>('diagnostic_centers_directory_active_all', true) : null;
  const cachedDoctors = typeof window !== 'undefined' ? getCachedData<any[]>('doctors_list_active_all', true) : null;

  const initHosp = cachedHospitals ? cachedHospitals.filter((h: any) => h.name.toLowerCase().includes(cityKey) || (cityKey === 'moulvibazar' && h.name.includes('Moulvibazar'))) : [];
  const initCenters = cachedCenters ? cachedCenters.filter((d: any) => d.name.toLowerCase().includes(cityKey) || (cityKey === 'moulvibazar' && d.name.includes('Moulvibazar'))) : [];
  const initDocs = cachedDoctors || [];

  const [cityHospitals, setCityHospitals] = useState<any[]>(initHosp);
  const [cityDiagnosticCenters, setCityDiagnosticCenters] = useState<any[]>(initCenters);
  const [cityDoctors, setCityDoctors] = useState<any[]>(initDocs);
  const [isLoading, setIsLoading] = useState(!cachedHospitals && !cachedCenters && !cachedDoctors);

  const cityData = CITY_INFO[cityKey] || {
    en: cityKey.charAt(0).toUpperCase() + cityKey.slice(1),
    bn: rawCity,
    division: 'Bangladesh',
    descEn: `Healthcare facilities, doctor chambers, and diagnostic services in ${cityKey}.`,
    descBn: `${rawCity}-এর স্বাস্থ্যসেবা ও ডাক্তারদের তালিকা।`,
  };

  useEffect(() => {
    async function loadCityData() {
      try {
        const [hospRes, diagRes, docRes] = await Promise.all([
          supabase
            .from('hospitals')
            .select('id, name, name_bn, slug, phone, total_beds, icu_beds, has_emergency_24_7, verification_status')
            .eq('status', 'active'),
          supabase
            .from('diagnostic_centers')
            .select('id, name, name_bn, slug, phone, has_home_sample_collection, verification_status')
            .eq('status', 'active'),
          supabase
            .from('doctors')
            .select('id, specialization, qualifications, bmdc_registration_number, profiles(full_name, avatar_url)')
            .eq('status', 'active'),
        ]);

        if (hospRes.data) {
          setCityHospitals(
            hospRes.data.filter((h: any) =>
              h.name.toLowerCase().includes(cityKey) || (cityKey === 'moulvibazar' && h.name.includes('Moulvibazar'))
            )
          );
        }

        if (diagRes.data) {
          setCityDiagnosticCenters(
            diagRes.data.filter((d: any) =>
              d.name.toLowerCase().includes(cityKey) || (cityKey === 'moulvibazar' && d.name.includes('Moulvibazar'))
            )
          );
        }

        if (docRes.data) {
          setCityDoctors(
            docRes.data.map((d: any) => {
              const profile = Array.isArray(d.profiles) ? d.profiles[0] : d.profiles;
              return {
                id: d.id,
                fullName: profile?.full_name || 'Specialist Doctor',
                specialization: d.specialization,
                qualifications: d.qualifications,
                bmdcNumber: d.bmdc_registration_number,
              };
            })
          );
        }
      } catch (err) {
        console.warn('City data fetch notice:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCityData();
  }, [cityKey]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <Header
        language={language}
        setLanguage={setLanguage}
        activeTab="marketplace"
        setActiveTab={() => {}}
      />

      {/* Hero Banner */}
      <section
        style={{
          backgroundColor: '#0F172A',
          padding: '48px 20px',
          color: '#FFFFFF',
          borderBottom: '1px solid #1E293B',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Link
              href="/doctors"
              style={{
                color: '#93C5FD',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <ChevronLeft size={16} />
              {language === 'bn' ? 'সকল বিভাগ' : 'All Locations'}
            </Link>
            <span style={{ color: '#475569' }}>/</span>
            <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600 }}>
              {cityData.en} ({cityData.bn})
            </span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '6px', backgroundColor: '#1E293B', marginBottom: '14px', border: '1px solid #334155' }}>
            <MapPin size={14} color="#60A5FA" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#93C5FD', textTransform: 'uppercase' }}>
              {cityData.division} • Verified Regional Hub
            </span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1.25, margin: '0 0 10px 0' }}>
            {language === 'bn'
              ? `${cityData.bn}-এর ডাক্তার, হাসপাতাল ও ডায়াগনস্টিক সেন্টার`
              : `Doctors, Hospitals & Diagnostic Centers in ${cityData.en}`}
          </h1>

          <p style={{ fontSize: '15px', color: '#94A3B8', maxWidth: '780px', margin: '0 0 24px 0', lineHeight: 1.6 }}>
            {language === 'bn' ? cityData.descBn : cityData.descEn}
          </p>

          {/* Quick Counts */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #334155' }}>
              <Stethoscope size={16} color="#60A5FA" />
              <span style={{ fontSize: '13px', fontWeight: 600 }}>
                {isLoading && cityDoctors.length === 0 ? '...' : cityDoctors.length} {language === 'bn' ? 'ডাক্তার' : 'Doctors'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #334155' }}>
              <Building2 size={16} color="#60A5FA" />
              <span style={{ fontSize: '13px', fontWeight: 600 }}>
                {isLoading && cityHospitals.length === 0 ? '...' : cityHospitals.length} {language === 'bn' ? 'হাসপাতাল' : 'Hospitals'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #334155' }}>
              <Microscope size={16} color="#60A5FA" />
              <span style={{ fontSize: '13px', fontWeight: 600 }}>
                {isLoading && cityDiagnosticCenters.length === 0 ? '...' : cityDiagnosticCenters.length} {language === 'bn' ? 'ডায়াগনস্টিক সেন্টার' : 'Diagnostic Centers'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px' }}>
        {/* Hospitals in this City */}
        <div style={{ marginBottom: '44px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                {language === 'bn' ? `${cityData.bn}-এর হাসপাতালসমূহ` : `Hospitals in ${cityData.en}`}
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                {language === 'bn'
                  ? '২৪/৭ ইমার্জেন্সি ও ইন-পেশেন্ট সুবিধাসহ অনুমোদিত হাসপাতাল'
                  : 'Licensed healthcare institutions with clinical facilities'}
              </p>
            </div>
            <Link
              href="/hospitals"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#0060FA',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>{language === 'bn' ? 'সকল দেখুন' : 'View All'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {cityHospitals.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {cityHospitals.map((hosp) => (
                <div
                  key={hosp.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '20px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
                      {language === 'bn' && hosp.name_bn ? hosp.name_bn : hosp.name}
                    </h3>
                    <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: '14px' }}>
                      Total Beds: <strong>{hosp.total_beds || 'N/A'}</strong> • ICU: <strong>{hosp.icu_beds || 'N/A'}</strong>
                    </div>
                  </div>
                  <Link
                    href={`/hospitals/${hosp.id}`}
                    className="btn-primary"
                    style={{ padding: '8px', fontSize: '12.5px', textAlign: 'center' }}
                  >
                    <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Facility'}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          ) : isLoading ? (
            <CardSkeleton count={3} type="facility" />
          ) : (
            <div style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center', color: '#64748B', fontSize: '13.5px' }}>
              {language === 'bn' ? 'এই এলাকায় কোনো হাসপাতাল নিবন্ধিত নেই।' : `No hospitals registered yet in ${cityData.en}.`}
            </div>
          )}
        </div>

        {/* Diagnostic Centers in this City */}
        <div style={{ marginBottom: '44px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                {language === 'bn' ? `${cityData.bn}-এর ডায়াগনস্টিক সেন্টারসমূহ` : `Diagnostic Centers in ${cityData.en}`}
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                {language === 'bn'
                  ? 'প্যাথলজি ল্যাব ও টেস্ট সার্ভিস'
                  : 'Certified pathology and imaging facilities'}
              </p>
            </div>
            <Link
              href="/diagnostic-centers"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#0060FA',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>{language === 'bn' ? 'সকল দেখুন' : 'View All'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {cityDiagnosticCenters.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {cityDiagnosticCenters.map((dc) => (
                <div
                  key={dc.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '20px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
                      {language === 'bn' && dc.name_bn ? dc.name_bn : dc.name}
                    </h3>
                    <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: '14px' }}>
                      {dc.has_home_sample_collection ? 'Home Sample Collection Available' : 'In-Center Testing'}
                    </div>
                  </div>
                  <Link
                    href={`/diagnostic-centers/${dc.id}`}
                    className="btn-primary"
                    style={{ padding: '8px', fontSize: '12.5px', textAlign: 'center' }}
                  >
                    <span>{language === 'bn' ? 'টেস্ট তালিকা দেখুন' : 'View Tests'}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          ) : isLoading ? (
            <CardSkeleton count={3} type="facility" />
          ) : (
            <div style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center', color: '#64748B', fontSize: '13.5px' }}>
              {language === 'bn' ? 'এই এলাকায় কোনো ডায়াগনস্টিক সেন্টার নিবন্ধিত নেই।' : `No diagnostic centers registered yet in ${cityData.en}.`}
            </div>
          )}
        </div>
      </div>

      <Footer language={language} />
    </div>
  );
}
