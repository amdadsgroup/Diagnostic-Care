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
  Pill,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Star,
  Search,
  ChevronRight,
  Truck,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  FileText,
  AlertCircle,
  Package,
} from 'lucide-react';

export default function PharmaciesPage() {
  const { language, setLanguage, t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Moulvibazar');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [quickOrderNotice, setQuickOrderNotice] = useState<string | null>(null);

  useEffect(() => {
    AuthService.getCurrentUser().then((u) => {
      if (u) setCurrentUser(u);
    });

    const savedLoc = localStorage.getItem('dc_user_location');
    if (savedLoc) setSelectedLocation(savedLoc);
  }, []);

  const pharmaciesData = [
    {
      id: 'pharma-lazz-sylhet',
      nameEn: 'Lazz Pharma (Sylhet Hub)',
      nameBn: 'লাজ ফার্মা (সিলেট বিভাগীয় হাব)',
      licenseNumber: 'DRUG/SYL/2022/4119',
      district: 'Sylhet',
      addressEn: 'Airport Road, Amberkhana Point, Sylhet',
      addressBn: 'এয়ারপোর্ট রোড, আম্বরখানা পয়েন্ট, সিলেট',
      phone: BRAND_CONSTANTS.CUSTOMER_CARE_PHONE,
      openingHoursEn: '08:00 AM - 11:30 PM Daily',
      openingHoursBn: 'প্রতিদিন সকাল ৮:০০ - রাত ১১:৩০',
      rating: 4.8,
      servicesEn: ['100% Genuine Medicines', 'Cold-Chain Insulin Storage', 'Prescription Delivery Helpline', 'Surgical Items'],
      servicesBn: ['১০০% জেনুইন ঔষধ', 'কোল্ড-চেইন ইনসুলিন সংরক্ষণ', 'প্রেসক্রিপশন ডেলিভারি হেল্পলাইন', 'সার্জিক্যাল সামগ্রী'],
    },
    {
      id: 'pharma-model-moulvibazar',
      nameEn: 'Central Model Pharmacy (Moulvibazar)',
      nameBn: 'সেন্ট্রাল মডেল ফার্মেসি (মৌলভীবাজার)',
      licenseNumber: 'DRUG/MB/2023/1820',
      district: 'Moulvibazar',
      addressEn: 'Choumohona, Syed Mujtoba Ali Road, Moulvibazar Sadar',
      addressBn: 'চৌমোহনা, সৈয়দ মুজতবা আলী রোড, মৌলভীবাজার সদর',
      phone: BRAND_CONSTANTS.CUSTOMER_CARE_PHONE,
      openingHoursEn: '24/7 Open Emergency Service',
      openingHoursBn: 'সার্বক্ষণিক ২৪ ঘণ্টা জরুরি সেবা খোলা',
      rating: 4.9,
      servicesEn: ['24/7 Emergency Counter', 'Critical Care Injections', 'Baby Food & Diapers', 'Home Delivery in Sadar'],
      servicesBn: ['২৪/৭ জরুরি কাউন্টার', 'জরুরি ইনজেকশন ও স্যালাইন', 'বেবি ফুড ও ডায়াপার', 'সদর এলাকায় হোম ডেলিভারি'],
    },
    {
      id: 'pharma-tamanna-dhaka',
      nameEn: 'Tamanna Pharmacy (Dhaka)',
      nameBn: 'তমন্না ফার্মেসি (ঢাকা)',
      licenseNumber: 'DRUG/DHK/2021/8722',
      district: 'Dhaka',
      addressEn: 'Mirpur-10 Main Circle, Dhaka 1216',
      addressBn: 'মিরপুর-১০ গোলচত্বর, ঢাকা ১২১৬',
      phone: BRAND_CONSTANTS.CUSTOMER_CARE_PHONE,
      openingHoursEn: '24/7 Open Non-Stop',
      openingHoursBn: 'সার্বক্ষণিক ২৪ ঘণ্টা উন্মুক্ত',
      rating: 4.7,
      servicesEn: ['Imported Life-Saving Drugs', 'Oxygen Cylinders', 'Nebulizers & BP Monitors', 'Prescription Fulfillment'],
      servicesBn: ['আমদানিকৃত জীবনরক্ষাকারী ঔষধ', 'অক্সিজেন সিলিন্ডার', 'নেবুলাইজার ও বিপি মেশিন', 'প্রেসক্রিপশন সেবা'],
    },
  ];

  const filteredPharmacies = pharmaciesData.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.nameEn.toLowerCase().includes(q) || p.nameBn.includes(q);
      const matchAddr = p.addressEn.toLowerCase().includes(q) || p.addressBn.includes(q);
      if (!matchName && !matchAddr) return false;
    }
    if (selectedDistrict !== 'ALL') {
      if (p.district.toLowerCase() !== selectedDistrict.toLowerCase()) return false;
    }
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F7FAFE' }}>
      <Header
        language={language}
        setLanguage={setLanguage}
        activeTab="pharmacies"
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
                {language === 'en' ? 'Pharmacies' : 'ফার্মেসি ও ঔষধ'}
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
                  <span>{language === 'en' ? '100% Genuine & DGDA Licensed' : 'ডিজিডিএ অনুমোদিত জেনুইন ফার্মেসি'}</span>
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
                  {language === 'en' ? 'Verified Pharmacies & Medicines' : 'অনুমোদিত ফার্মেসি ও প্রেসক্রিপশন সেবা'}
                </h1>
                <p style={{ fontSize: '15px', color: '#64748B', maxWidth: '640px' }}>
                  {language === 'en'
                    ? 'Find licensed retail pharmacies and cold-chain medical dispensaries in Moulvibazar, Sylhet, and Dhaka. Call for verified prescription fulfillment.'
                    : 'লাইসেন্সপ্রাপ্ত ফার্মেসি ও সঠিক তাপমাত্রায় সংরক্ষিত জীবনরক্ষাকারী ঔষধের সন্ধান। হেল্পলাইনের মাধ্যমে প্রেসক্রিপশন অর্ডার সেবা।'}
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
                  <Pill size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#10294F' }}>
                    {filteredPharmacies.length} {language === 'en' ? 'Pharmacies' : 'টি ফার্মেসি'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                    {language === 'en' ? 'Genuine Medicines' : 'যাচাইকৃত ঔষধাগার'}
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
                      ? 'Search pharmacy by name or road address...'
                      : 'ফার্মেসির নাম বা রোড ঠিকানা দিয়ে খুঁজুন...'
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

        {/* Quick Prescription Help Banner */}
        <section className="container" style={{ marginTop: '24px' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2EAF4',
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              boxShadow: '0 2px 8px rgba(16, 41, 79, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#EAF2FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1769F5',
                  flexShrink: 0,
                }}
              >
                <FileText size={22} />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#10294F' }}>
                  {language === 'en' ? 'Have a Doctor Prescription?' : 'ডাক্তারের প্রেসক্রিপশন আছে?'}
                </div>
                <div style={{ fontSize: '13px', color: '#64748B' }}>
                  {language === 'en'
                    ? `Call our 24/7 dedicated helpline at ${BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY} for authentic medicine verification and delivery.`
                    : `সরাসরি আমাদের হেল্পলাইনে ${BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY} নাম্বারে যোগাযোগ করে ওষুধ নিশ্চিত করুন।`}
                </div>
              </div>
            </div>

            <a
              href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
              style={{
                backgroundColor: '#1769F5',
                color: '#FFFFFF',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '13.5px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(23, 105, 245, 0.25)',
              }}
            >
              <PhoneCall size={16} />
              <span>Call Helpline Now</span>
            </a>
          </div>
        </section>

        {/* Pharmacies Listing Grid */}
        <section className="container" style={{ marginTop: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
            {filteredPharmacies.map((pharmacy) => (
              <div
                key={pharmacy.id}
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
                  {/* Name and License */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#10294F', margin: 0, lineHeight: 1.25 }}>
                          {language === 'en' ? pharmacy.nameEn : pharmacy.nameBn}
                        </h2>
                        <ShieldCheck size={18} color="#15976A" />
                      </div>
                      <div style={{ fontSize: '12px', color: '#1769F5', fontWeight: 600 }}>
                        License: {pharmacy.licenseNumber}
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
                      <span>{pharmacy.rating}</span>
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
                      <span>{language === 'en' ? pharmacy.addressEn : pharmacy.addressBn}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                      <Clock size={15} color="#15976A" style={{ flexShrink: 0 }} />
                      <span>
                        {language === 'en' ? pharmacy.openingHoursEn : pharmacy.openingHoursBn}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                      <Phone size={15} color="#1769F5" style={{ flexShrink: 0 }} />
                      <span>
                        Store Helpline: <strong>{pharmacy.phone}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Services and Reassurance */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#10294F', marginBottom: '8px' }}>
                      {language === 'en' ? 'Quality & Storage Standards:' : 'মান ও সংরক্ষণ মানদণ্ড:'}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {(language === 'en' ? pharmacy.servicesEn : pharmacy.servicesBn).map((srv, idx) => (
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
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', paddingTop: '14px', borderTop: '1px solid #EDF3F9' }}>
                  <a
                    href={`tel:${pharmacy.phone}`}
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
                    <span>{language === 'en' ? 'Call Store' : 'ফার্মেসিতে কল করুন'}</span>
                  </a>

                  <a
                    href={`https://wa.me/88${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}?text=${encodeURIComponent(
                      `Hello Diagnostic Care, I want to inquire about medicines from ${pharmacy.nameEn}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      backgroundColor: '#E8F8F1',
                      color: '#15976A',
                      border: '1px solid #C4EED9',
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
                    <span>WhatsApp</span>
                  </a>
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
