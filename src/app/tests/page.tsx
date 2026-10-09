'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import TestBookingModal from '@/components/diagnostic/TestBookingModal';
import AuthModal from '@/components/auth/AuthModal';
import LocationModal from '@/components/location/LocationModal';
import { useLanguage } from '@/context/LanguageContext';
import { DiagnosticService } from '@/services/diagnostic.service';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import { INITIAL_APP_STATE } from '@/lib/store';
import { DiagnosticTest } from '@/types';
import { BRAND_CONSTANTS, BRAND_COLORS } from '@/config/brand';
import {
  Search,
  MapPin,
  TestTube2,
  Building2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Home,
  FileText,
  AlertCircle,
  Filter,
  ChevronRight,
  Sparkles,
  Phone,
  X,
} from 'lucide-react';

export default function DiagnosticTestsPage() {
  const { language, setLanguage, t, formatCurrency } = useLanguage();
  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Moulvibazar');

  // Tests Data
  const [tests, setTests] = useState<DiagnosticTest[]>(INITIAL_APP_STATE.diagnosticTests);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCenter, setSelectedCenter] = useState<string>('ALL');
  const [onlyHomeCollection, setOnlyHomeCollection] = useState(false);
  const [sortBy, setSortBy] = useState<'PRICE_LOW' | 'PRICE_HIGH' | 'POPULAR'>('POPULAR');

  // Modal State
  const [selectedTestToBook, setSelectedTestToBook] = useState<DiagnosticTest | null>(null);
  const [confirmedBookingNotice, setConfirmedBookingNotice] = useState<any | null>(null);

  useEffect(() => {
    AuthService.getCurrentUser().then((u) => {
      if (u) setCurrentUser(u);
    });

    const savedLoc = localStorage.getItem('dc_user_location');
    if (savedLoc) setSelectedLocation(savedLoc);

    DiagnosticService.getLabTests()
      .then((dbTests) => {
        if (dbTests && dbTests.length > 0) {
          setTests(dbTests);
        }
      })
      .catch((err) => {
        console.warn('Diagnostic tests load notice:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const categories = [
    { id: 'ALL', labelEn: 'All Tests', labelBn: 'সকল টেস্ট' },
    { id: 'PATHOLOGY', labelEn: 'Blood & Pathology', labelBn: 'রক্ত ও প্যাথলজি' },
    { id: 'BIOCHEMISTRY', labelEn: 'Biochemistry & Organ Function', labelBn: 'বায়োকেমিস্ট্রি' },
    { id: 'DIABETES', labelEn: 'Diabetes & Hormones', labelBn: 'ডায়াবেটিস ও হরমোন' },
    { id: 'ULTRASOUND', labelEn: 'Ultrasonography (USG)', labelBn: 'আল্ট্রাসনোগ্রাফি' },
    { id: 'RADIOLOGY', labelEn: 'X-Ray & Radiology', labelBn: 'এক্স-রে ও রেডিওলজি' },
    { id: 'CARDIOLOGY', labelEn: 'ECG & Cardiology', labelBn: 'ইসিজি ও হৃদরোগ পরীক্ষা' },
  ];

  const centers = [
    { id: 'ALL', labelEn: 'All Accredited Centers', labelBn: 'সকল ডায়াগনস্টিক সেন্টার' },
    { id: 'Popular Diagnostic Center', labelEn: 'Popular Diagnostic Center', labelBn: 'পপুলার ডায়াগনস্টিক সেন্টার' },
    { id: 'Ibn Sina', labelEn: 'Ibn Sina Diagnostic Centre', labelBn: 'ইবনে সিনা ডায়াগনস্টিক সেন্টার' },
  ];

  const filteredTests = useMemo(() => {
    return tests
      .filter((test) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = test.name.toLowerCase().includes(q);
          const matchOrg = test.organizationName?.toLowerCase().includes(q) || false;
          const matchCat = test.category?.toLowerCase().includes(q) || false;
          if (!matchName && !matchOrg && !matchCat) return false;
        }

        // Category filter
        if (selectedCategory !== 'ALL') {
          const testCat = test.category?.toUpperCase() || '';
          if (!testCat.includes(selectedCategory)) return false;
        }

        // Center filter
        if (selectedCenter !== 'ALL') {
          if (!test.organizationName?.toLowerCase().includes(selectedCenter.toLowerCase())) {
            return false;
          }
        }

        // Home collection filter
        if (onlyHomeCollection && !test.homeCollectionAvailable) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        if (sortBy === 'PRICE_LOW') return priceA - priceB;
        if (sortBy === 'PRICE_HIGH') return priceB - priceA;
        return 0; // POPULAR
      });
  }, [tests, searchQuery, selectedCategory, selectedCenter, onlyHomeCollection, sortBy]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F7FAFE' }}>
      <Header
        language={language}
        setLanguage={setLanguage}
        activeTab="tests"
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
        {/* Hero Banner */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2EAF4',
            padding: '36px 0 32px 0',
          }}
        >
          <div className="container">
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748B', marginBottom: '12px' }}>
              <Link href="/" style={{ color: '#1769F5', fontWeight: 600 }}>
                {language === 'en' ? 'Home' : 'হোম'}
              </Link>
              <ChevronRight size={14} color="#94A3B8" />
              <span style={{ color: '#10294F', fontWeight: 700 }}>
                {language === 'en' ? 'Diagnostic Tests' : 'ডায়াগনস্টিক টেস্ট'}
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
                  <span>{language === 'en' ? 'Accredited Pathology Labs' : 'অ্যাক্রিডিটেড প্যাথলজি ও ডায়াগনস্টিক ল্যাব'}</span>
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
                  {language === 'en' ? 'Diagnostic Tests Marketplace' : 'ডায়াগনস্টিক টেস্ট ও ল্যাব ইনভেস্টিগেশন'}
                </h1>
                <p style={{ fontSize: '15px', color: '#64748B', maxWidth: '640px' }}>
                  {language === 'en'
                    ? 'Book pathology, biochemistry, and radiology tests with transparent provider-verified prices. Choose between Center Visit and Home Sample Collection.'
                    : 'স্বচ্ছ মূল্য ও অভিজ্ঞ ল্যাব টেকনিশিয়ানের মাধ্যমে রক্ত, প্রস্রাব ও রেডিওলজি টেস্ট বুক করুন। সেন্টারে গিয়ে বা বাসায় স্যাম্পল কালেকশন সুবিধা।'}
                </p>
              </div>

              {/* Total Tests Metric */}
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
                  <TestTube2 size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#10294F' }}>
                    {filteredTests.length} {language === 'en' ? 'Tests' : 'টি পরীক্ষা'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                    {language === 'en' ? 'Available to Book' : 'বুকিংয়ের জন্য উন্মুক্ত'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Toolbar & Filters */}
        <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2EAF4', padding: '16px 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', alignItems: 'center' }}>
              {/* Search input */}
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
                      ? 'Search tests by name (e.g. CBC, Lipid, HbA1c, USG, X-Ray)...'
                      : 'টেস্টের নাম দিয়ে সার্চ করুন (সিবিসি, লিপিড, আল্ট্রাসনোগ্রাফি, সুগার)...'
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
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ color: '#94A3B8', cursor: 'pointer' }}>
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Category Select */}
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
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
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
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {language === 'en' ? c.labelEn : c.labelBn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Diagnostic Center Select */}
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
                <Building2 size={15} color="#1769F5" />
                <select
                  value={selectedCenter}
                  onChange={(e) => setSelectedCenter(e.target.value)}
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
                  {centers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {language === 'en' ? c.labelEn : c.labelBn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Home Sample Toggle */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: onlyHomeCollection ? '#EAF2FF' : '#F8FAFC',
                  border: onlyHomeCollection ? '1px solid #1769F5' : '1px solid #E2EAF4',
                  borderRadius: '10px',
                  padding: '9px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: onlyHomeCollection ? '#1769F5' : '#10294F',
                }}
              >
                <input
                  type="checkbox"
                  checked={onlyHomeCollection}
                  onChange={(e) => setOnlyHomeCollection(e.target.checked)}
                  style={{ accentColor: '#1769F5' }}
                />
                <Home size={15} />
                <span>{language === 'en' ? 'Home Sample Collection' : 'হোম স্যাম্পল কালেকশন'}</span>
              </label>

              {/* Sort By Select */}
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
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
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
                  <option value="POPULAR">{language === 'en' ? 'Most Popular' : 'জনপ্রিয় টেস্ট'}</option>
                  <option value="PRICE_LOW">{language === 'en' ? 'Price: Low to High' : 'মূল্য: কম থেকে বেশি'}</option>
                  <option value="PRICE_HIGH">{language === 'en' ? 'Price: High to Low' : 'মূল্য: বেশি থেকে কম'}</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Confirmed Booking Notice */}
        {confirmedBookingNotice && (
          <div className="container" style={{ marginTop: '24px' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #C4EED9',
                padding: '24px',
                boxShadow: '0 8px 24px rgba(21, 151, 106, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#E8F8F1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#15976A',
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#10294F' }}>
                    {language === 'en' ? 'Test Booking Confirmed!' : 'টেস্ট বুকিং নিশ্চিত হয়েছে!'}
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#64748B', marginTop: '3px' }}>
                    Booking Code: <strong>{confirmedBookingNotice.bookingCode}</strong> • Center: {confirmedBookingNotice.organizationName || 'Diagnostic Center'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setConfirmedBookingNotice(null)}
                style={{
                  backgroundColor: '#F0F5FD',
                  border: '1px solid #E2EAF4',
                  color: '#10294F',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {language === 'en' ? 'Dismiss' : 'ঠিক আছে'}
              </button>
            </div>
          </div>
        )}

        {/* Diagnostic Test Cards Grid */}
        <section className="container" style={{ marginTop: '32px' }}>
          {isLoading ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748B' }}>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>
                {language === 'en' ? 'Loading test catalog...' : 'টেস্ট ক্যাটালগ লোড হচ্ছে...'}
              </div>
            </div>
          ) : filteredTests.length === 0 ? (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2EAF4',
                padding: '60px 24px',
                textAlign: 'center',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#EAF2FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  color: '#1769F5',
                }}
              >
                <TestTube2 size={28} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#10294F', marginBottom: '8px' }}>
                {language === 'en' ? 'No diagnostic tests found' : 'কোনো টেস্ট পাওয়া যায়নি'}
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '20px' }}>
                {language === 'en'
                  ? 'Try clearing the search query or changing the category filter.'
                  : 'সার্চ ফিল্টার রিসেট করে পুনরায় চেষ্টা করুন।'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                  setSelectedCenter('ALL');
                  setOnlyHomeCollection(false);
                }}
                style={{
                  backgroundColor: '#1769F5',
                  color: '#FFFFFF',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {language === 'en' ? 'Reset Filters' : 'ফিল্টার মুছুন'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px' }}>
              {filteredTests.map((test) => {
                const effectivePrice = test.discountPrice || test.price;

                return (
                  <div
                    key={test.id}
                    className="healthcare-card"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E2EAF4',
                      padding: '22px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 8px rgba(16, 41, 79, 0.04)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div>
                      {/* Top Header: Category & Home Collection Pill */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#1769F5',
                            backgroundColor: '#EAF2FF',
                            padding: '3px 10px',
                            borderRadius: '14px',
                            textTransform: 'uppercase',
                          }}
                        >
                          {test.category || 'Pathology'}
                        </span>

                        {test.homeCollectionAvailable && (
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#15976A',
                              backgroundColor: '#E8F8F1',
                              padding: '3px 10px',
                              borderRadius: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Home size={12} />
                            <span>Home Sample</span>
                          </span>
                        )}
                      </div>

                      {/* Test Name & Center */}
                      <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#10294F', marginBottom: '6px', lineHeight: 1.3 }}>
                        {test.name}
                      </h3>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748B', marginBottom: '14px' }}>
                        <Building2 size={14} color="#1769F5" />
                        <span style={{ fontWeight: 600 }}>{test.organizationName || 'Accredited Center'}</span>
                      </div>

                      {/* Clinical Information Box */}
                      <div
                        style={{
                          backgroundColor: '#F8FAFC',
                          borderRadius: '10px',
                          border: '1px solid #EDF3F9',
                          padding: '12px',
                          marginBottom: '18px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          fontSize: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748B' }}>Preparation:</span>
                          <span style={{ fontWeight: 600, color: '#10294F' }}>
                            {test.preparationInstructions || (language === 'en' ? 'Normal diet / No fasting' : 'স্বাভাবিক আহার')}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748B' }}>Report Delivery:</span>
                          <span style={{ fontWeight: 700, color: '#1769F5' }}>
                            {test.expectedDeliveryHours ? `${test.expectedDeliveryHours} Hours` : (language === 'en' ? '4-6 Hours' : '৪-৬ ঘণ্টা')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action Row */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '14px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                            {language === 'en' ? 'Total Test Fee:' : 'মোট ফি:'}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <span style={{ fontSize: '20px', fontWeight: 800, color: '#10294F' }}>
                              ৳ {effectivePrice}
                            </span>
                            {test.discountPrice && (
                              <span style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'line-through' }}>
                                ৳ {test.price}
                              </span>
                            )}
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#15976A',
                            backgroundColor: '#E8F8F1',
                            padding: '3px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          100% Price Guaranteed
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedTestToBook(test)}
                        style={{
                          width: '100%',
                          backgroundColor: '#1769F5',
                          color: '#FFFFFF',
                          padding: '11px',
                          borderRadius: '10px',
                          border: 'none',
                          fontSize: '13.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(23, 105, 245, 0.2)',
                        }}
                      >
                        <TestTube2 size={16} />
                        <span>{language === 'en' ? 'Book Diagnostic Test' : 'টেস্ট বুক করুন'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Test Booking Modal */}
      {selectedTestToBook && (
        <TestBookingModal
          test={selectedTestToBook}
          isOpen={!!selectedTestToBook}
          onClose={() => setSelectedTestToBook(null)}
          onBookingSuccess={(booking) => {
            setConfirmedBookingNotice(booking);
            setSelectedTestToBook(null);
          }}
        />
      )}

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
