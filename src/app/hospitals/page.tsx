'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import AuthModal from '@/components/auth/AuthModal';
import LocationModal from '@/components/location/LocationModal';
import { useLanguage } from '@/context/LanguageContext';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import { BRAND_CONSTANTS, BRAND_COLORS } from '@/config/brand';
import {
  Building2,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Star,
  Search,
  ChevronRight,
  HeartPulse,
  Activity,
  BedDouble,
  Sparkles,
  Ambulance,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';

export default function HospitalsPage() {
  const { language, setLanguage, t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Moulvibazar');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');

  useEffect(() => {
    AuthService.getCurrentUser().then((u) => {
      if (u) setCurrentUser(u);
    });

    const savedLoc = localStorage.getItem('dc_user_location');
    if (savedLoc) setSelectedLocation(savedLoc);
  }, []);

  const hospitalsData = [
    {
      id: 'org-osmani-medical-sylhet',
      nameEn: 'Sylhet MAG Osmani Medical College & Hospital',
      nameBn: 'সিলেট এমএজি ওসমানী মেডিকেল কলেজ ও হাসপাতাল',
      typeEn: 'Government Tertiary Medical Center',
      typeBn: 'সরকারি টারশিয়ারি মেডিকেল কলেজ ও হাসপাতাল',
      district: 'Sylhet',
      addressEn: 'Medical College Road, Kajolshah, Sylhet 3100',
      addressBn: 'মেডিকেল কলেজ রোড, কাজলশাহ, সিলেট ৩০০০',
      phone: BRAND_CONSTANTS.CUSTOMER_CARE_PHONE,
      totalBeds: 900,
      icuBeds: 30,
      hasEmergency24h: true,
      hasBloodBank: true,
      hasAmbulance: true,
      rating: 4.7,
      departmentsEn: ['Emergency & Trauma', 'Internal Medicine', 'Cardiology', 'General Surgery', 'Gynecology & Obs', 'Pediatrics'],
      departmentsBn: ['জরুরি ও ট্রমা কেয়ার', 'ইন্টারনাল মেডিসিন', 'কার্ডিওলজি', 'জেনারেল সার্জারি', 'স্ত্রী ও প্রসূতিরোগ', 'শিশু বিভাগ'],
    },
    {
      id: 'org-moulvibazar-sadar-hospital',
      nameEn: '250 Bed District Sadar Hospital, Moulvibazar',
      nameBn: '২৫০ শয্যা বিশিষ্ট জেলা সদর হাসপাতাল, মৌলভীবাজার',
      typeEn: 'District General Hospital',
      typeBn: 'জেলা সদর জেনারেল হাসপাতাল',
      district: 'Moulvibazar',
      addressEn: 'Hospital Road, Court Area, Moulvibazar Sadar',
      addressBn: 'হাসপাতাল রোড, কোর্ট এরিয়া, মৌলভীবাজার সদর',
      phone: BRAND_CONSTANTS.CUSTOMER_CARE_PHONE,
      totalBeds: 250,
      icuBeds: 12,
      hasEmergency24h: true,
      hasBloodBank: true,
      hasAmbulance: true,
      rating: 4.5,
      departmentsEn: ['24/7 Emergency', 'General Medicine', 'Surgery', 'Orthopedics', 'Maternity Care', 'Pediatrics'],
      departmentsBn: ['২৪/৭ জরুরি বিভাগ', 'জেনারেল মেডিসিন', 'সার্জারি', 'অর্থোপেডিকস', 'প্রসূতি সেবা', 'শিশু স্বাস্থ্য'],
    },
    {
      id: 'org-square-hospital-dhaka',
      nameEn: 'Square Hospitals Ltd. (Dhaka)',
      nameBn: 'স্কয়ার হসপিটালস লি. (ঢাকা)',
      typeEn: 'Super Specialty Tertiary Hospital',
      typeBn: 'সুপার স্পেশালিটি টারশিয়ারি হাসপাতাল',
      district: 'Dhaka',
      addressEn: '18/F Bir Uttam Qazi Nuruzzaman Sarak, Panthapath, Dhaka 1205',
      addressBn: '১৮/এফ বীর উত্তম কাজী নুরুজ্জামান সড়ক, পান্থপথ, ঢাকা ১২০৫',
      phone: BRAND_CONSTANTS.CUSTOMER_CARE_PHONE,
      totalBeds: 450,
      icuBeds: 45,
      hasEmergency24h: true,
      hasBloodBank: true,
      hasAmbulance: true,
      rating: 4.9,
      departmentsEn: ['Cardiology & CCU', 'Neurology & Neuro Surgery', 'Oncology', 'Organ Transplant', 'Trauma & Emergency'],
      departmentsBn: ['কার্ডিওলজি ও সিসিইউ', 'নিউরোলজি ও নিউরো সার্জারি', 'অনকোলজি', 'অর্গান ট্রান্সপ্লান্ট', 'ট্রমা ও ইমার্জেন্সি'],
    },
  ];

  const filteredHospitals = hospitalsData.filter((h) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = h.nameEn.toLowerCase().includes(q) || h.nameBn.includes(q);
      const matchAddr = h.addressEn.toLowerCase().includes(q) || h.addressBn.includes(q);
      const matchDept = h.departmentsEn.some((d) => d.toLowerCase().includes(q));
      if (!matchName && !matchAddr && !matchDept) return false;
    }
    if (selectedDistrict !== 'ALL') {
      if (h.district.toLowerCase() !== selectedDistrict.toLowerCase()) return false;
    }
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F7FAFE' }}>
      <Header
        language={language}
        setLanguage={setLanguage}
        activeTab="hospitals"
        setActiveTab={() => {}}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenLocation={() => setIsLocationModalOpen(true)}
        selectedLocation={selectedLocation}
        currentUser={currentUser}
        onLogout={async () => {
          await AuthService.signOut();
          setCurrentUser(null);
        }}
      />

      <main style={{ flex: 1, paddingBottom: '60px' }}>
        {/* Hero Section */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2EAF4',
            padding: '36px 0 32px 0',
          }}
        >
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748B', marginBottom: '12px' }}>
              <Link href="/" style={{ color: '#1769F5', fontWeight: 600 }}>
                {language === 'en' ? 'Home' : 'হোম'}
              </Link>
              <ChevronRight size={14} color="#94A3B8" />
              <span style={{ color: '#10294F', fontWeight: 700 }}>
                {language === 'en' ? 'Hospitals & Clinics' : 'হাসপাতাল ও ক্লিনিক'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#EAF2FF',
                    color: '#1769F5',
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    marginBottom: '10px',
                  }}
                >
                  <Sparkles size={13} />
                  <span>{language === 'en' ? 'Verified Inpatient & Emergency Networks' : 'যাচাইকৃত হাসপাতাল নেটওয়ার্ক'}</span>
                </div>
                <h1
                  style={{
                    fontSize: 'clamp(26px, 3.2vw, 36px)',
                    fontWeight: 800,
                    color: '#10294F',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    marginBottom: '8px',
                  }}
                >
                  {language === 'en' ? 'Hospitals & Healthcare Facilities' : 'হাসপাতাল ও বিশেষায়িত ক্লিনিক'}
                </h1>
                <p style={{ fontSize: '15px', color: '#64748B', maxWidth: '640px' }}>
                  {language === 'en'
                    ? 'Find tertiary hospitals, district medical centers, and private clinical facilities. Access bed capacity, 24/7 ICU triage, and emergency hotlines.'
                    : 'সিলেট, মৌলভীবাজার ও ঢাকার প্রধান হাসপাতালসমূহের জরুরি বিভাগ, আইসিইউ শয্যা ও চিকিৎসাসেবার বিস্তারিত তথ্য।'}
                </p>
              </div>

              <div
                style={{
                  backgroundColor: '#F0F5FD',
                  border: '1px solid #E2EAF4',
                  borderRadius: '12px',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: '#1769F5',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <HeartPulse size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#10294F' }}>
                    {filteredHospitals.length} {language === 'en' ? 'Hospitals' : 'টি হাসপাতাল'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                    {language === 'en' ? '24/7 Emergency Ready' : 'সার্বক্ষণিক জরুরি সেবা'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Toolbar */}
        <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2EAF4', padding: '16px 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2EAF4',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  gridColumn: 'span 2',
                }}
              >
                <Search size={16} color="#1769F5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'en'
                      ? 'Search hospital by name, department, or location...'
                      : 'হাসপাতালের নাম, বিভাগ বা এলাকা দিয়ে খুঁজুন...'
                  }
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '13.5px',
                    color: '#14243D',
                    width: '100%',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2EAF4',
                  borderRadius: '10px',
                  padding: '9px 12px',
                }}
              >
                <MapPin size={15} color="#1769F5" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '13px',
                    color: '#10294F',
                    fontWeight: 600,
                    width: '100%',
                    cursor: 'pointer',
                  }}
                >
                  <option value="ALL">{language === 'en' ? 'All Districts' : 'সকল জেলা'}</option>
                  <option value="Moulvibazar">Moulvibazar (মৌলভীবাজার)</option>
                  <option value="Sylhet">Sylhet (সিলেট)</option>
                  <option value="Dhaka">Dhaka (ঢাকা)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Hospital Directory Grid */}
        <section className="container" style={{ marginTop: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
            {filteredHospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="healthcare-card"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2EAF4',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(16, 41, 79, 0.04)',
                }}
              >
                <div>
                  {/* Name and Type */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#10294F', margin: 0, lineHeight: 1.25 }}>
                          {language === 'en' ? hospital.nameEn : hospital.nameBn}
                        </h2>
                        <ShieldCheck size={18} color="#15976A" />
                      </div>
                      <div style={{ fontSize: '12px', color: '#1769F5', fontWeight: 600 }}>
                        {language === 'en' ? hospital.typeEn : hospital.typeBn}
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: '#FEF8EA',
                        border: '1px solid #FBE7B5',
                        padding: '3px 8px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#D99116',
                        flexShrink: 0,
                      }}
                    >
                      <Star size={13} fill="#D99116" />
                      <span>{hospital.rating}</span>
                    </div>
                  </div>

                  {/* Bed Stats Pills */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                    <div
                      style={{
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #EDF3F9',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <BedDouble size={18} color="#1769F5" />
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Total Beds</div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#10294F' }}>{hospital.totalBeds}</div>
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #EDF3F9',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <Activity size={18} color="#15976A" />
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>ICU Beds</div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#10294F' }}>{hospital.icuBeds}</div>
                      </div>
                    </div>
                  </div>

                  {/* Address and Contacts */}
                  <div
                    style={{
                      backgroundColor: '#F8FAFC',
                      borderRadius: '10px',
                      border: '1px solid #EDF3F9',
                      padding: '14px',
                      marginBottom: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontSize: '12.5px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#475569' }}>
                      <MapPin size={15} color="#1769F5" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{language === 'en' ? hospital.addressEn : hospital.addressBn}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                      <Clock size={15} color="#15976A" style={{ flexShrink: 0 }} />
                      <span>
                        {language === 'en' ? 'Emergency Dept:' : 'জরুরি বিভাগ:'}{' '}
                        <strong style={{ color: '#15976A' }}>24 Hours Open (সার্বক্ষণিক)</strong>
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                      <Phone size={15} color="#1769F5" style={{ flexShrink: 0 }} />
                      <span>
                        Helpline: <strong>{hospital.phone}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Featured Departments */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#10294F', marginBottom: '8px' }}>
                      {language === 'en' ? 'Key Clinical Departments:' : 'প্রধান চিকিৎসাসেবা বিভাগ:'}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {(language === 'en' ? hospital.departmentsEn : hospital.departmentsBn).map((dept, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            backgroundColor: '#EAF2FF',
                            color: '#1769F5',
                            padding: '3px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', paddingTop: '14px', borderTop: '1px solid #EDF3F9' }}>
                  <a
                    href={`tel:${hospital.phone}`}
                    style={{
                      flex: 1,
                      backgroundColor: '#1769F5',
                      color: '#FFFFFF',
                      padding: '11px',
                      borderRadius: '10px',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      textAlign: 'center',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(23, 105, 245, 0.2)',
                    }}
                  >
                    <PhoneCall size={15} />
                    <span>{language === 'en' ? 'Emergency Call' : 'জরুরি কল'}</span>
                  </a>

                  <Link
                    href="/ambulance"
                    style={{
                      backgroundColor: '#FEF2F2',
                      color: '#DC4545',
                      border: '1px solid #FECACA',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Ambulance size={15} />
                    <span>Ambulance</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          language={language}
          onLoginSuccess={(u) => {
            setCurrentUser(u);
            setIsAuthModalOpen(false);
          }}
        />
      )}

      {/* Location Modal */}
      {isLocationModalOpen && (
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          currentLocation={selectedLocation}
          onSelectLocation={(loc) => {
            setSelectedLocation(loc);
            localStorage.setItem('dc_user_location', loc);
            setIsLocationModalOpen(false);
          }}
          language={language}
        />
      )}

      <Footer language={language} setLanguage={setLanguage} />
    </div>
  );
}
