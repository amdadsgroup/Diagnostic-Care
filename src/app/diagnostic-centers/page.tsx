'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import AuthModal from '@/components/auth/AuthModal';
import LocationModal from '@/components/location/LocationModal';
import { useLanguage } from '@/context/LanguageContext';
import { DiagnosticService } from '@/services/diagnostic.service';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import { INITIAL_APP_STATE } from '@/lib/store';
import { Organization } from '@/types';
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
  TestTube2,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function DiagnosticCentersPage() {
  const { language, setLanguage, t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Moulvibazar');

  const [centers, setCenters] = useState<Organization[]>(INITIAL_APP_STATE.organizations);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');

  useEffect(() => {
    AuthService.getCurrentUser().then((u) => {
      if (u) setCurrentUser(u);
    });

    const savedLoc = localStorage.getItem('dc_user_location');
    if (savedLoc) setSelectedLocation(savedLoc);

    DiagnosticService.getDiagnosticCenters()
      .then((dbOrgs) => {
        if (dbOrgs && dbOrgs.length > 0) {
          setCenters(dbOrgs);
        }
      })
      .catch((err) => {
        console.warn('Diagnostic centers load notice:', err);
      });
  }, []);

  const filteredCenters = centers.filter((org) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = org.name.toLowerCase().includes(q);
      const matchAddress = org.branches?.some((b) => b.addressLine.toLowerCase().includes(q)) || false;
      if (!matchName && !matchAddress) return false;
    }
    if (selectedDistrict !== 'ALL') {
      const matchDist = org.branches?.some((b) => b.districtName?.toLowerCase() === selectedDistrict.toLowerCase());
      if (!matchDist) return false;
    }
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F7FAFE' }}>
      <Header
        language={language}
        setLanguage={setLanguage}
        activeTab="diagnostic-centers"
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
                {language === 'en' ? 'Diagnostic Centers' : 'ডায়াগনস্টিক সেন্টার'}
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
                  <span>{language === 'en' ? 'DGHS Verified Diagnostic Facilities' : 'ডিজিএইচএস অনুমোদিত ডায়াগনস্টিক সেন্টার'}</span>
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
                  {language === 'en' ? 'Accredited Diagnostic Centers' : 'অনুমোদিত ডায়াগনস্টিক সেন্টার ও ল্যাব'}
                </h1>
                <p style={{ fontSize: '15px', color: '#64748B', maxWidth: '640px' }}>
                  {language === 'en'
                    ? 'Discover trusted clinical laboratories and consultation centres in Moulvibazar, Sylhet, and Bangladesh. Compare facilities, timings, and book tests.'
                    : 'মৌলভীবাজার ও সিলেট বিভাগের শীর্ষস্থানীয় প্যাথলজি ল্যাব ও ডায়াগনস্টিক সেন্টারের ঠিকানা, সেবা ও অ্যাপয়েন্টমেন্ট সুবিধা।'}
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
                  <Building2 size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#10294F' }}>
                    {filteredCenters.length} {language === 'en' ? 'Centers' : 'টি সেন্টার'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                    {language === 'en' ? 'Verified in Bangladesh' : 'যাচাইকৃত প্রতিষ্ঠান'}
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
                      ? 'Search diagnostic center by name or road address...'
                      : 'সেন্টারের নাম বা ঠিকানা দিয়ে সার্চ করুন...'
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

        {/* Centers Listing Grid */}
        <section className="container" style={{ marginTop: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
            {filteredCenters.map((org) => {
              const mainBranch = org.branches?.find((b) => b.isMainBranch) || org.branches?.[0];

              return (
                <div
                  key={org.id}
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
                    {/* Header: Name, Verified Badge, Rating */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#10294F', margin: 0 }}>
                            {org.name}
                          </h2>
                          <ShieldCheck size={17} color="#15976A" />
                        </div>
                        <div style={{ fontSize: '12px', color: '#1769F5', fontWeight: 600 }}>
                          {org.tradeLicenseNumber ? `License: ${org.tradeLicenseNumber}` : 'Accredited Healthcare Provider'}
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
                        }}
                      >
                        <Star size={13} fill="#D99116" />
                        <span>{org.rating || 4.9}</span>
                      </div>
                    </div>

                    {/* Address & Hours */}
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
                      {mainBranch && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#475569' }}>
                          <MapPin size={15} color="#1769F5" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <span>{mainBranch.addressLine}</span>
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                        <Clock size={15} color="#15976A" style={{ flexShrink: 0 }} />
                        <span>
                          {language === 'en' ? 'Open Daily:' : 'প্রতিদিন খোলা:'}{' '}
                          <strong>{mainBranch?.openingTime || '07:30'} - {mainBranch?.closingTime || '23:00'}</strong>
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                        <Phone size={15} color="#1769F5" style={{ flexShrink: 0 }} />
                        <span>
                          Helpline: <strong>{org.contactPhone || BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Available Facilities & Tests */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#10294F', marginBottom: '8px' }}>
                        {language === 'en' ? 'Key Facilities & Services:' : 'প্রধান সেবা ও যন্ত্রপাতি:'}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {['Automated Pathology', 'Digital X-Ray', '4D Ultrasonography', 'Specialist Chambers', 'Home Collection'].map((tag, idx) => (
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
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '10px', paddingTop: '14px', borderTop: '1px solid #EDF3F9' }}>
                    <Link
                      href="/tests"
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
                      <TestTube2 size={15} />
                      <span>{language === 'en' ? 'Book Lab Tests' : 'টেস্ট বুক করুন'}</span>
                    </Link>

                    <Link
                      href="/doctors"
                      style={{
                        backgroundColor: '#F0F5FD',
                        color: '#10294F',
                        border: '1px solid #E2EAF4',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        fontSize: '13.5px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>{language === 'en' ? 'Doctors' : 'ডাক্তার'}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
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
