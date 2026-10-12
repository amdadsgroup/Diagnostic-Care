'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import {
  INITIAL_ORGANIZATIONS,
  INITIAL_DOCTORS,
  INITIAL_DOCTOR_ASSOCIATIONS,
} from '@/lib/mock-data';
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
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

const CITY_INFO: Record<
  string,
  { en: string; bn: string; division: string; descEn: string; descBn: string }
> = {
  moulvibazar: {
    en: 'Moulvibazar',
    bn: 'মৌলভীবাজার',
    division: 'Sylhet Division',
    descEn:
      'Explore verified diagnostic test centers, specialist doctor chambers, and hospital facilities across Moulvibazar Sadar, Sreemangal, Kamalganj, and Kulaura.',
    descBn:
      'মৌলভীবাজার সদর, শ্রীমঙ্গল ও কুলাউড়ার যাচাইকৃত ডায়াগনস্টিক সেন্টার, স্পেশালিস্ট ডাক্তার এবং হাসপাতালের তথ্য জানুন।',
  },
  sylhet: {
    en: 'Sylhet',
    bn: 'সিলেট',
    division: 'Sylhet Division',
    descEn:
      'Find leading general hospitals, MRI & CT scan laboratories, and BMDC-registered professors across Subidbazar, Zindabazar, and Osmani Medical Road in Sylhet.',
    descBn:
      'সিলেটের সুবহানীঘাট, সুবিদবাজার ও জিন্দাবাজারের শীর্ষ হাসপাতাল এবং বিশেষজ্ঞ ডাক্তারদের চেম্বারের শিডিউল।',
  },
  dhaka: {
    en: 'Dhaka',
    bn: 'ঢাকা',
    division: 'Dhaka Division',
    descEn:
      'Discover accredited diagnostic complexes, tertiary hospitals, and clinical specialists in Dhaka. Connect with 24/7 patient customer care.',
    descBn:
      'ঢাকার শীর্ষ ডায়াগনস্টিক সেন্টার, স্পেশালাইজড হাসপাতাল এবং অভিজ্ঞ ডাক্তারদের তালিকা।',
  },
  chittagong: {
    en: 'Chittagong',
    bn: 'চট্টগ্রাম',
    division: 'Chittagong Division',
    descEn:
      'Healthcare directories, diagnostic test pricing, and specialist chambers across Chattogram metropolitan and district hubs.',
    descBn:
      'চট্টগ্রামের বিশ্বস্ত হাসপাতাল, ল্যাবরেটরি ও বিশেষজ্ঞ চিকিৎসকদের চেম্বার অনুসন্ধান করুন।',
  },
};

export default function LocationCityPage() {
  const params = useParams();
  const rawCity = (params?.city as string) || 'moulvibazar';
  const cityKey = rawCity.toLowerCase();
  const { language, setLanguage } = useLanguage();

  const cityData = CITY_INFO[cityKey] || {
    en: cityKey.charAt(0).toUpperCase() + cityKey.slice(1),
    bn: rawCity,
    division: 'Bangladesh',
    descEn: `Healthcare facilities, doctor chambers, and diagnostic services in ${cityKey}.`,
    descBn: `${rawCity}-এর স্বাস্থ্যসেবা ও ডাক্তারদের তালিকা।`,
  };

  // Filter organizations by city
  const cityOrgs = INITIAL_ORGANIZATIONS.filter((org) => {
    return org.branches.some(
      (b) =>
        b.districtName.toLowerCase().includes(cityKey) ||
        b.addressLine.toLowerCase().includes(cityKey) ||
        b.name.toLowerCase().includes(cityKey) ||
        org.name.toLowerCase().includes(cityKey)
    );
  });

  const cityHospitals = cityOrgs.filter((org) => org.orgType === 'HOSPITAL');
  const cityDiagnosticCenters = cityOrgs.filter(
    (org) => org.orgType === 'DIAGNOSTIC_CENTER'
  );

  // Filter doctors having chambers in this city
  const cityDoctorIds = new Set(
    INITIAL_DOCTOR_ASSOCIATIONS.filter((assoc) =>
      cityOrgs.some((org) => org.id === assoc.organizationId)
    ).map((a) => a.doctorId)
  );

  const cityDoctors = INITIAL_DOCTORS.filter((doc) => cityDoctorIds.has(doc.id));

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
          background: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #0f766e 100%)',
          padding: '48px 24px',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Link
              href="/doctors"
              style={{
                color: '#99F6E4',
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
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>
            <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600 }}>
              {cityData.en} ({cityData.bn})
            </span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', marginBottom: '16px' }}>
            <MapPin size={14} color="#5EEAD4" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#CCFBF1', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {cityData.division} • Verified Regional Hub
            </span>
          </div>

          <h1 style={{ fontSize: '36px', fontWeight: 900, lineHeight: 1.2, margin: '0 0 12px 0' }}>
            {language === 'bn'
              ? `${cityData.bn}-এর ডাক্তার, হাসপাতাল ও ডায়াগনস্টিক সেন্টার`
              : `Doctors, Hospitals & Diagnostic Centers in ${cityData.en}`}
          </h1>

          <p style={{ fontSize: '16px', color: '#CCFBF1', maxWidth: '780px', margin: '0 0 24px 0', lineHeight: 1.6 }}>
            {language === 'bn' ? cityData.descBn : cityData.descEn}
          </p>

          {/* Quick Stats Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <Stethoscope size={18} color="#5EEAD4" />
              <span style={{ fontSize: '14px', fontWeight: 700 }}>
                {cityDoctors.length > 0 ? `${cityDoctors.length} Verified Doctors` : 'Growing Network'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <Building2 size={18} color="#5EEAD4" />
              <span style={{ fontSize: '14px', fontWeight: 700 }}>
                {cityHospitals.length} Hospitals
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <Microscope size={18} color="#5EEAD4" />
              <span style={{ fontSize: '14px', fontWeight: 700 }}>
                {cityDiagnosticCenters.length} Diagnostic Centers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Section 1: Hospitals in this City */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                {language === 'bn' ? `${cityData.bn}-এর হাসপাতালসমূহ` : `Hospitals in ${cityData.en}`}
              </h2>
              <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                {language === 'bn'
                  ? '২৪/৭ ইমার্জেন্সি ও ইন-পেশেন্ট সুবিধাসহ অনুমোদিত হাসপাতাল'
                  : 'Licensed healthcare institutions with emergency and clinical inpatient facilities'}
              </p>
            </div>
            <Link
              href="/hospitals"
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#059669',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {language === 'bn' ? 'সকল দেখুন' : 'View all'} <ArrowRight size={16} />
            </Link>
          </div>

          {cityHospitals.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
              {cityHospitals.map((hosp) => (
                <div
                  key={hosp.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    padding: '24px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669', backgroundColor: '#ECFDF5', padding: '4px 10px', borderRadius: '20px' }}>
                        {hosp.branches[0]?.districtName || cityData.en}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={14} /> Verified
                      </span>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
                      {hosp.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px 0', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <MapPin size={16} color="#94A3B8" style={{ flexShrink: 0, marginTop: '2px' }} />
                      {hosp.branches[0]?.addressLine || 'Main Road'}
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} color={'#059669'} /> {hosp.contactPhone}
                    </span>
                    <Link
                      href={`/hospitals/${hosp.id}`}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#0F172A',
                        color: '#FFFFFF',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      {language === 'bn' ? 'বিস্তারিত' : 'View Profile'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <p style={{ color: '#64748B', margin: '0 0 8px 0' }}>
                {language === 'bn'
                  ? `${cityData.bn}-এ আমাদের হাসপাতাল অনবোর্ডিং কার্যক্রম চলমান রয়েছে।`
                  : `Hospital partner onboarding is actively expanding in ${cityData.en}.`}
              </p>
              <Link href="/hospitals" style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}>
                Browse all verified hospitals nationwide &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Section 2: Diagnostic Centers in this City */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                {language === 'bn' ? `${cityData.bn}-এর ডায়াগনস্টিক সেন্টারসমূহ` : `Diagnostic Centers in ${cityData.en}`}
              </h2>
              <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                {language === 'bn'
                  ? 'রক্ত পরীক্ষা, সিটি স্ক্যান, এমআরআই ও এক্স-রে এর জন্য অনুমোদিত ল্যাব'
                  : 'Accredited clinical laboratories for pathology, imaging, ultrasound, and blood tests'}
              </p>
            </div>
            <Link
              href="/diagnostic-centers"
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#059669',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {language === 'bn' ? 'সকল দেখুন' : 'View all'} <ArrowRight size={16} />
            </Link>
          </div>

          {cityDiagnosticCenters.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
              {cityDiagnosticCenters.map((diag) => (
                <div
                  key={diag.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    padding: '24px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '4px 10px', borderRadius: '20px' }}>
                        Diagnostic Lab
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={14} /> Verified
                      </span>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
                      {diag.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px 0', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <MapPin size={16} color="#94A3B8" style={{ flexShrink: 0, marginTop: '2px' }} />
                      {diag.branches[0]?.addressLine || 'Main Branch'}
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} color={'#059669'} /> {diag.contactPhone}
                    </span>
                    <Link
                      href={`/diagnostic-centers/${diag.id}`}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#059669',
                        color: '#FFFFFF',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      {language === 'bn' ? 'টেস্ট তালিকা' : 'View Tests'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <p style={{ color: '#64748B', margin: '0 0 8px 0' }}>
                {language === 'bn'
                  ? `${cityData.bn}-এ আমাদের ডায়াগনস্টিক পার্টনার নেটওয়ার্ক সম্প্রসারণ হচ্ছে।`
                  : `Diagnostic center network in ${cityData.en} is actively expanding.`}
              </p>
              <Link href="/diagnostic-centers" style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}>
                Explore nationwide diagnostic centers &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Section 3: Specialist Doctors in this City */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                {language === 'bn' ? `${cityData.bn}-এর বিশেষজ্ঞ ডাক্তারগণ` : `Specialist Doctors in ${cityData.en}`}
              </h2>
              <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                {language === 'bn'
                  ? 'বিএমডিসি নিবন্ধিত অধ্যাপক, সহকারী অধ্যাপক এবং কনসালটেন্ট'
                  : 'BMDC-registered clinical professors and specialist consultants available for consultation'}
              </p>
            </div>
            <Link
              href="/doctors"
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#059669',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {language === 'bn' ? 'সকল দেখুন' : 'View all'} <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {(cityDoctors.length > 0 ? cityDoctors : INITIAL_DOCTORS.slice(0, 3)).map((doc) => (
              <div
                key={doc.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '24px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F766E', backgroundColor: '#CCFBF1', padding: '4px 10px', borderRadius: '20px' }}>
                      {doc.specialization}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} /> BMDC: {doc.bmdcNumber}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                    {doc.fullName}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#059669', fontWeight: 600, margin: '0 0 8px 0' }}>
                    {doc.title}
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 16px 0' }}>
                    {doc.qualifications}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>
                    {doc.experienceYears}+ years exp
                  </span>
                  <Link
                    href={`/doctors/${doc.id}`}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    {language === 'bn' ? 'অ্যাপয়েন্টমেন্ট' : 'Book Chamber'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Support Card */}
        <div
          style={{
            marginTop: '56px',
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '20px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 700, fontSize: '13px', marginBottom: '8px' }}>
              <Sparkles size={16} /> 24/7 Patient Assistance Hotline
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#14532D', margin: '0 0 6px 0' }}>
              Need Help Finding a Doctor or Hospital in {cityData.en}?
            </h3>
            <p style={{ fontSize: '14px', color: '#15803D', margin: 0, maxWidth: '600px' }}>
              Our dedicated medical coordinators can help verify chamber schedules, test availability, and home sample collection across {cityData.en}.
            </p>
          </div>
          <a
            href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 24px',
              backgroundColor: '#166534',
              color: '#FFFFFF',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '15px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(22, 101, 52, 0.25)',
            }}
          >
            <Phone size={18} /> Call {BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}
          </a>
        </div>
      </div>

      <Footer language={language} />
    </div>
  );
}
