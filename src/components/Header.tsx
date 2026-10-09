'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BRAND_CONSTANTS, BRAND_COLORS, SupportedLanguage } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import { UserRole } from '@/types';
import { BrandLogo } from '@/components/brand/BrandLogo';
import {
  Search,
  MapPin,
  Globe,
  User,
  Menu,
  X,
  Stethoscope,
  TestTube2,
  Building2,
  HeartPulse,
  Pill,
  Ambulance,
  Home,
  Phone,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Activity,
  FileText,
  LogOut,
} from 'lucide-react';

interface HeaderProps {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  currentRole?: UserRole;
  setCurrentRole?: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onOpenAuth?: () => void;
  onOpenOnboard?: () => void;
  onOpenSearch?: () => void;
  onOpenLocation?: () => void;
  selectedLocation?: string;
  onSelectCategory?: (category: any) => void;
  currentUser?: any;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  currentRole,
  setCurrentRole,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenOnboard,
  onOpenSearch,
  onOpenLocation,
  selectedLocation = 'Moulvibazar',
  onSelectCategory,
  currentUser,
  onLogout,
}) => {
  const t = TRANSLATIONS[language];
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tab: string, category?: string) => {
    setActiveTab(tab);
    if (category && onSelectCategory) {
      onSelectCategory(category);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-header"
      className="header-glass"
    >
      {/* Top Utility Bar (Desktop only) */}
      <div
        className="d-desktop-only"
        style={{
          backgroundColor: 'rgba(21, 49, 59, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: '#F4F8FA',
          padding: '6px 0',
          fontSize: '11.5px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 24px',
          }}
        >
          {/* Left: Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={onOpenLocation}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                padding: '2px 10px',
                borderRadius: '9999px',
                color: '#DDF7F0',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <MapPin size={11} color="#5EEAD4" />
              <span>Location: <strong>{selectedLocation}</strong></span>
              <ChevronDown size={10} color="#94A3B8" />
            </button>
          </div>

          {/* Right: Emergency 24/7 Helpline & Language */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <a
              href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#DDF7F0',
                fontWeight: 700,
                textDecoration: 'none',
                background: 'rgba(15, 118, 110, 0.35)',
                padding: '2px 10px',
                borderRadius: '9999px',
                border: '1px solid rgba(94, 234, 212, 0.35)',
              }}
            >
              <Phone size={11} color="#5EEAD4" />
              <span>24/7 Helpline: <strong>{BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}</strong></span>
            </a>

            {/* Language Switcher */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                padding: '2px 4px',
                borderRadius: '9999px',
              }}
            >
              <Globe size={11} color="#5EEAD4" style={{ margin: '0 2px' }} />
              <button
                onClick={() => {
                  setLanguage('en');
                  if (typeof window !== 'undefined') localStorage.setItem('dc_lang', 'en');
                }}
                style={{
                  color: language === 'en' ? '#FFFFFF' : '#DDF7F0',
                  background: language === 'en' ? '#0F766E' : 'transparent',
                  fontWeight: 700,
                  fontSize: '10.5px',
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  lineHeight: 1.2,
                }}
              >
                EN
              </button>
              <button
                onClick={() => {
                  setLanguage('bn');
                  if (typeof window !== 'undefined') localStorage.setItem('dc_lang', 'bn');
                }}
                style={{
                  color: language === 'bn' ? '#FFFFFF' : '#DDF7F0',
                  background: language === 'bn' ? '#0F766E' : 'transparent',
                  fontWeight: 700,
                  fontSize: '10.5px',
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  lineHeight: 1.2,
                }}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 24px',
          gap: '16px',
        }}
      >
        {/* Left: Horizontal Brand Logo on Desktop, Symbol on Mobile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Desktop & Tablet: Horizontal Logo */}
          <div
            className="d-mobile-none"
            style={{ cursor: 'pointer' }}
            onClick={() => handleNavClick('marketplace')}
          >
            <BrandLogo
              variant="horizontal"
              size={36}
              priority
              altText="Diagnostic Care"
            />
          </div>

          {/* Mobile: Compact Symbol */}
          <div
            className="d-mobile-flex"
            style={{ cursor: 'pointer', display: 'none', alignItems: 'center' }}
            onClick={() => handleNavClick('marketplace')}
          >
            <BrandLogo
              variant="symbol"
              size={34}
              priority
              altText="Diagnostic Care"
            />
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav
          className="d-desktop-flex"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
          }}
        >
          {/* 1. Home */}
          <Link
            href="/"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: activeTab === 'marketplace' || activeTab === 'home' ? 700 : 500,
              color: activeTab === 'marketplace' || activeTab === 'home' ? BRAND_COLORS.primary : BRAND_COLORS.textDark,
              backgroundColor: activeTab === 'marketplace' || activeTab === 'home' ? BRAND_COLORS.primaryLight : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {language === 'en' ? 'Home' : 'হোম'}
          </Link>

          {/* 2. Find Doctors */}
          <Link
            href="/doctors"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: activeTab === 'doctors' || activeTab === 'DOCTOR' ? 700 : 500,
              color: activeTab === 'doctors' || activeTab === 'DOCTOR' ? BRAND_COLORS.primary : BRAND_COLORS.textDark,
              backgroundColor: activeTab === 'doctors' || activeTab === 'DOCTOR' ? BRAND_COLORS.primaryLight : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {language === 'en' ? 'Find Doctors' : 'ডাক্তার'}
          </Link>

          {/* 3. Diagnostic Tests */}
          <Link
            href="/tests"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: activeTab === 'tests' || activeTab === 'DIAGNOSTIC_TESTS' ? 700 : 500,
              color: activeTab === 'tests' || activeTab === 'DIAGNOSTIC_TESTS' ? BRAND_COLORS.primary : BRAND_COLORS.textDark,
              backgroundColor: activeTab === 'tests' || activeTab === 'DIAGNOSTIC_TESTS' ? BRAND_COLORS.primaryLight : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {language === 'en' ? 'Diagnostic Tests' : 'ডায়াগনস্টিক টেস্ট'}
          </Link>

          {/* 4. Diagnostic Centers */}
          <Link
            href="/diagnostic-centers"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: activeTab === 'diagnostic-centers' || activeTab === 'DIAGNOSTIC_CENTER' ? 700 : 500,
              color: activeTab === 'diagnostic-centers' || activeTab === 'DIAGNOSTIC_CENTER' ? BRAND_COLORS.primary : BRAND_COLORS.textDark,
              backgroundColor: activeTab === 'diagnostic-centers' || activeTab === 'DIAGNOSTIC_CENTER' ? BRAND_COLORS.primaryLight : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {language === 'en' ? 'Diagnostic Centers' : 'ডায়াগনস্টিক সেন্টার'}
          </Link>

          {/* 5. Hospitals & Clinics */}
          <Link
            href="/hospitals"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: activeTab === 'hospitals' || activeTab === 'HOSPITAL' ? 700 : 500,
              color: activeTab === 'hospitals' || activeTab === 'HOSPITAL' ? BRAND_COLORS.primary : BRAND_COLORS.textDark,
              backgroundColor: activeTab === 'hospitals' || activeTab === 'HOSPITAL' ? BRAND_COLORS.primaryLight : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {language === 'en' ? 'Hospitals & Clinics' : 'হাসপাতাল ও ক্লিনিক'}
          </Link>

          {/* 6. Pharmacies */}
          <Link
            href="/pharmacies"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: activeTab === 'pharmacies' || activeTab === 'PHARMACY' ? 700 : 500,
              color: activeTab === 'pharmacies' || activeTab === 'PHARMACY' ? BRAND_COLORS.primary : BRAND_COLORS.textDark,
              backgroundColor: activeTab === 'pharmacies' || activeTab === 'PHARMACY' ? BRAND_COLORS.primaryLight : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {language === 'en' ? 'Pharmacies' : 'ফার্মেসি'}
          </Link>

          {/* 7. Ambulance */}
          <Link
            href="/ambulance"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: activeTab === 'ambulance' || activeTab === 'AMBULANCE' ? 700 : 500,
              color: activeTab === 'ambulance' || activeTab === 'AMBULANCE' ? '#DC4545' : BRAND_COLORS.textDark,
              backgroundColor: activeTab === 'ambulance' || activeTab === 'AMBULANCE' ? '#FDF2F2' : 'transparent',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{language === 'en' ? 'Ambulance' : 'অ্যাম্বুলেন্স'}</span>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#DC4545',
                boxShadow: '0 0 6px #DC4545',
              }}
            />
          </Link>

          {/* 8. Home Healthcare */}
          <Link
            href="/home-care"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: activeTab === 'homecare' || activeTab === 'home-care' || activeTab === 'HOME_CARE' ? 700 : 500,
              color: activeTab === 'homecare' || activeTab === 'home-care' || activeTab === 'HOME_CARE' ? BRAND_COLORS.primary : BRAND_COLORS.textDark,
              backgroundColor: activeTab === 'homecare' || activeTab === 'home-care' || activeTab === 'HOME_CARE' ? BRAND_COLORS.primaryLight : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {language === 'en' ? 'Home Healthcare' : 'হোম হেলথকেয়ার'}
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch || (() => handleNavClick('search'))}
            aria-label="Search Healthcare Services"
            className="clay-pill"
            style={{
              gap: '6px',
              padding: '7px 14px',
              color: 'var(--brand-text-dark)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Search size={15} color={BRAND_COLORS.primary} />
            <span className="d-desktop-inline">{language === 'en' ? 'Search' : 'সার্চ'}</span>
          </button>

          {/* Location Trigger (Desktop & Mobile) */}
          <button
            onClick={onOpenLocation}
            aria-label="Select Location Hub"
            className="clay-pill"
            style={{
              gap: '6px',
              padding: '7px 14px',
              color: 'var(--brand-text-dark)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <MapPin size={15} color={BRAND_COLORS.primary} />
            <span style={{ maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {selectedLocation}
            </span>
          </button>

          {/* Auth Button (User Profile if logged in, or Login button if guest) */}
          {currentUser ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => handleNavClick('profile')}
                className="clay-pill"
                style={{
                  gap: '6px',
                  padding: '7px 14px',
                  color: '#0F172A',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <User size={14} color={BRAND_COLORS.primary} />
                <span
                  style={{
                    maxWidth: '110px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {currentUser.fullName || (language === 'en' ? 'Profile' : 'প্রোফাইল')}
                </span>
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  title={language === 'en' ? 'Sign Out' : 'লগআউট'}
                  aria-label={language === 'en' ? 'Sign Out' : 'লগআউট'}
                  className="clay-bubble"
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: '#FEF2F2',
                    border: '1.5px solid #FCA5A5',
                    color: '#DC2626',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <LogOut size={14} />
                </button>
              )}
            </div>
          ) : (
            onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="btn-secondary"
                style={{
                  gap: '6px',
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
              >
                <User size={14} color={BRAND_COLORS.primary} />
                <span>{language === 'en' ? 'Sign In / Register' : 'লগইন / সাইন আপ'}</span>
              </button>
            )
          )}

          {/* Get Started / Partner Button (Signal Blue #0057FF) */}
          {onOpenOnboard ? (
            <button
              onClick={onOpenOnboard}
              className="btn-primary"
              style={{
                padding: '9px 20px',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              <span>{language === 'en' ? 'Get Started' : 'শুরু করুন'}</span>
              <ArrowRight size={13} />
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('marketplace')}
              className="btn-primary"
              style={{
                padding: '9px 20px',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              <span>{language === 'en' ? 'Get Started' : 'শুরু করুন'}</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            className="d-mobile-only"
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid var(--brand-border)',
              backgroundColor: 'var(--brand-bg)',
              color: 'var(--brand-text-dark)',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          style={{
            borderTop: '1px solid var(--glass-border)',
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '20px 24px 28px',
            boxShadow: '0 16px 36px rgba(15, 118, 110, 0.12)',
            animation: 'slideDown 0.2s ease-out',
          }}
          className="d-mobile-only"
        >
          {/* Logo in drawer header */}
          <div style={{ marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid rgba(15, 118, 110, 0.12)' }}>
            <BrandLogo variant="horizontal" size={32} />
          </div>

          {/* User Account / Auth Bar in Mobile Drawer */}
          <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'rgba(244, 248, 250, 0.85)', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
            {currentUser ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: BRAND_COLORS.primary, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' }}>
                    {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#15313B' }}>
                      {currentUser.fullName}
                    </div>
                    <div style={{ fontSize: '11px', color: '#627680' }}>
                      {currentUser.phone || currentUser.email}
                    </div>
                  </div>
                </div>
                {onLogout && (
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(185, 28, 28, 0.1)',
                      border: '1px solid rgba(185, 28, 28, 0.25)',
                      color: '#B91C1C',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {language === 'en' ? 'Sign Out' : 'লগআউট'}
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAuth) onOpenAuth();
                    else window.location.href = '/login';
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '9999px',
                    backgroundColor: BRAND_COLORS.primary,
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(15, 118, 110, 0.25)',
                  }}
                >
                  {language === 'en' ? 'Sign In' : 'লগইন'}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.href = '/register';
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#15313B',
                    border: '1px solid var(--glass-border)',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  {language === 'en' ? 'Register' : 'রেজিস্ট্রেশন'}
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                backgroundColor: activeTab === 'marketplace' || activeTab === 'home' ? BRAND_COLORS.primaryLight : 'transparent',
                color: activeTab === 'marketplace' || activeTab === 'home' ? BRAND_COLORS.primary : 'var(--brand-text-dark)',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              <Home size={18} color={activeTab === 'marketplace' || activeTab === 'home' ? BRAND_COLORS.primary : '#64748B'} />
              <span>{language === 'en' ? 'Home' : 'হোম'}</span>
            </Link>

            <Link
              href="/doctors"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                color: 'var(--brand-text-dark)',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              <Stethoscope size={18} color="#64748B" />
              <span>{language === 'en' ? 'Find Doctors' : 'ডাক্তার খুঁজুন'}</span>
            </Link>

            <Link
              href="/tests"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                color: 'var(--brand-text-dark)',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              <TestTube2 size={18} color="#64748B" />
              <span>{language === 'en' ? 'Diagnostic Tests' : 'ডায়াগনস্টিক টেস্ট'}</span>
            </Link>

            <Link
              href="/diagnostic-centers"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                color: 'var(--brand-text-dark)',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              <Building2 size={18} color="#64748B" />
              <span>{language === 'en' ? 'Diagnostic Centers' : 'ডায়াগনস্টিক সেন্টার'}</span>
            </Link>

            <Link
              href="/hospitals"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                color: 'var(--brand-text-dark)',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              <HeartPulse size={18} color="#64748B" />
              <span>{language === 'en' ? 'Hospitals & Clinics' : 'হাসপাতাল ও ক্লিনিক'}</span>
            </Link>

            <Link
              href="/pharmacies"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                color: 'var(--brand-text-dark)',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              <Pill size={18} color="#64748B" />
              <span>{language === 'en' ? 'Pharmacies & Medicines' : 'ফার্মেসি ও ঔষধ'}</span>
            </Link>

            <Link
              href="/ambulance"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                color: '#DC2626',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              <Ambulance size={18} color="#DC2626" />
              <span>{language === 'en' ? 'Emergency Ambulance 24/7' : 'জরুরি অ্যাম্বুলেন্স ২৪/৭'}</span>
            </Link>

            <Link
              href="/home-care"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                color: 'var(--brand-text-dark)',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              <Home size={18} color="#64748B" />
              <span>{language === 'en' ? 'Home Healthcare' : 'হোম হেলথকেয়ার'}</span>
            </Link>

            <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '8px 0' }} />

            <button
              onClick={() => handleNavClick('queue')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                color: 'var(--brand-text-dark)',
                fontWeight: 600,
                fontSize: '14px',
                textAlign: 'left',
              }}
            >
              <Activity size={18} color={BRAND_COLORS.primary} />
              <span>{language === 'en' ? 'Live Chamber Queue' : 'লাইভ সিরিয়াল কিউ'}</span>
            </button>

            <button
              onClick={() => handleNavClick('reports')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                color: 'var(--brand-text-dark)',
                fontWeight: 600,
                fontSize: '14px',
                textAlign: 'left',
              }}
            >
              <FileText size={18} color="#64748B" />
              <span>{language === 'en' ? 'Digital Health Vault & Reports' : 'হেলথ ভল্ট ও রিপোর্ট'}</span>
            </button>

            {/* Language & Role switch in mobile drawer */}
            <div
              style={{
                marginTop: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                backgroundColor: 'var(--brand-bg)',
                borderRadius: '10px',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Language:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => {
                    setLanguage('en');
                    if (typeof window !== 'undefined') localStorage.setItem('dc_lang', 'en');
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '12px',
                    background: language === 'en' ? BRAND_COLORS.primary : 'transparent',
                    color: language === 'en' ? '#FFFFFF' : 'var(--brand-text-dark)',
                  }}
                >
                  EN
                </button>
                <button
                  onClick={() => {
                    setLanguage('bn');
                    if (typeof window !== 'undefined') localStorage.setItem('dc_lang', 'bn');
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '12px',
                    background: language === 'bn' ? BRAND_COLORS.primary : 'transparent',
                    color: language === 'bn' ? '#FFFFFF' : 'var(--brand-text-dark)',
                  }}
                >
                  বাংলা
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
