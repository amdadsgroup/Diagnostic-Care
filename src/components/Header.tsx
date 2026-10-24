'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { BRAND_COLORS, SupportedLanguage } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import { useLanguage } from '@/context/LanguageContext';
import { UserRole } from '@/types';
import { BrandLogo } from '@/components/brand/BrandLogo';
import {
  Search,
  MapPin,
  Globe,
  User,
  ChevronDown,
  LogOut,
  Home,
  Stethoscope,
  CalendarCheck,
  MessageSquare,
  Building2,
  QrCode,
} from 'lucide-react';
import QRScannerModal from '@/components/qr/QRScannerModal';
import { GeoService } from '@/services/geo.service';

interface HeaderProps {
  language?: SupportedLanguage;
  setLanguage?: (lang: SupportedLanguage) => void;
  currentRole?: UserRole;
  setCurrentRole?: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
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
  selectedLocation = 'Dhaka',
  onSelectCategory,
  currentUser,
  onLogout,
}) => {
  const langContext = useLanguage();
  const currentLanguage = language || langContext.language || 'en';
  const handleSetLanguage = (l: SupportedLanguage) => {
    if (setLanguage) setLanguage(l);
    langContext.setLanguage(l);
  };
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isGpsActive, setIsGpsActive] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const loc = GeoService.getStoredUserLocation();
    if (loc?.isGps) setIsGpsActive(true);

    const unsub = GeoService.subscribe((newLoc) => {
      setIsGpsActive(Boolean(newLoc?.isGps));
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsub();
    };
  }, []);

  const handleNavClick = (tab: string, category?: string) => {
    if (typeof window !== 'undefined' && pathname !== '/' && tab !== 'doctors') {
      router.push(tab === 'marketplace' ? '/' : `/?tab=${tab}`);
      return;
    }
    setActiveTab(tab);
    if (category && onSelectCategory) {
      onSelectCategory(category);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-header"
      className="header-glass"
    >
      {/* Top Utility Bar (Mobile & Desktop) */}
      <div
        style={{
          backgroundColor: 'rgba(21, 49, 59, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: '#F4F8FA',
          padding: '5px 0',
          fontSize: '11px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 16px',
            gap: '8px',
          }}
        >
          {/* Left on Desktop: Location */}
          <div className="d-desktop-flex" style={{ alignItems: 'center', gap: '14px' }}>
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
                color: '#EBF3FF',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <MapPin size={11} color="#5EEAD4" />
              <span>Location: <strong>{selectedLocation}</strong></span>
              {isGpsActive && (
                <span
                  style={{
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    fontSize: '9px',
                    fontWeight: 800,
                    padding: '1px 5px',
                    borderRadius: '4px',
                    marginLeft: '2px',
                  }}
                >
                  GPS
                </span>
              )}
              <ChevronDown size={10} color="#94A3B8" />
            </button>
          </div>

          {/* Left/Center: Doctor & Hospital Provider Pathway (Visible on Mobile & Desktop) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              href="/provider/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(59, 130, 246, 0.28)',
                border: '1px solid rgba(96, 165, 250, 0.55)',
                color: '#93C5FD',
                padding: '2.5px 10px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 700,
                textDecoration: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <Building2 size={12} color="#93C5FD" />
              <span>{language === 'en' ? 'Doctor & Hospital Login' : 'ডাক্তার ও হাসপাতাল লগইন'}</span>
            </Link>
          </div>

          {/* Right: Language Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                type="button"
                onClick={() => handleSetLanguage('en')}
                aria-pressed={currentLanguage === 'en'}
                aria-label="Switch language to English"
                style={{
                  color: currentLanguage === 'en' ? '#FFFFFF' : '#EBF3FF',
                  background: currentLanguage === 'en' ? 'var(--brand-primary)' : 'transparent',
                  fontWeight: 700,
                  fontSize: '10.5px',
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  lineHeight: 1.2,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleSetLanguage('bn')}
                aria-pressed={currentLanguage === 'bn'}
                aria-label="বাংলা ভাষায় পরিবর্তন করুন"
                style={{
                  color: currentLanguage === 'bn' ? '#FFFFFF' : '#EBF3FF',
                  background: currentLanguage === 'bn' ? 'var(--brand-primary)' : 'transparent',
                  fontWeight: 700,
                  fontSize: '10.5px',
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  lineHeight: 1.2,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      {/* Primary Navigation Bar */}
      <div className="container">
        <div className="header-nav-container">
          {/* Left: Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onClick={() => handleNavClick('marketplace')}
            >
              <BrandLogo
                variant="horizontal"
                size={30}
                priority
                altText="Diagnostic Care"
              />
            </div>
          </div>

          {/* Center: Desktop Navigation Bar (Auto-adapting to screen sizes) */}
          <nav
            className="d-desktop-flex header-desktop-nav"
            aria-label="Desktop Primary Navigation"
          >
            {/* 1. Home */}
            <Link
              href="/"
              onClick={() => handleNavClick('marketplace')}
              className="header-nav-btn"
              style={{
                fontWeight: (pathname === '/' && activeTab === 'marketplace') ? 800 : 600,
                color: (pathname === '/' && activeTab === 'marketplace') ? '#FFFFFF' : '#334155',
                backgroundColor: (pathname === '/' && activeTab === 'marketplace') ? BRAND_COLORS.primary : 'transparent',
              }}
            >
              <Home size={14} />
              <span>{language === 'en' ? 'Home' : 'হোম'}</span>
            </Link>

            {/* 2. Find Doctors */}
            <Link
              href="/doctors"
              className="header-nav-btn"
              style={{
                fontWeight: (pathname === '/doctors' || activeTab === 'search' || activeTab === 'discover') ? 800 : 600,
                color: (pathname === '/doctors' || activeTab === 'search' || activeTab === 'discover') ? '#FFFFFF' : '#334155',
                backgroundColor: (pathname === '/doctors' || activeTab === 'search' || activeTab === 'discover') ? BRAND_COLORS.primary : 'transparent',
              }}
            >
              <Stethoscope size={14} />
              <span>{language === 'en' ? 'Doctors' : 'ডাক্তার'}</span>
            </Link>

            {/* 3. My Appointments / Bookings */}
            <Link
              href="/appointments"
              className="header-nav-btn"
              style={{
                fontWeight: (pathname === '/appointments' || activeTab === 'appointments' || activeTab === 'bookings') ? 800 : 600,
                color: (pathname === '/appointments' || activeTab === 'appointments' || activeTab === 'bookings') ? '#FFFFFF' : '#334155',
                backgroundColor: (pathname === '/appointments' || activeTab === 'appointments' || activeTab === 'bookings') ? BRAND_COLORS.primary : 'transparent',
              }}
            >
              <CalendarCheck size={14} />
              <span>{language === 'en' ? 'Appointments' : 'অ্যাপয়েন্টমেন্ট'}</span>
            </Link>

            {/* 4. Messages & Help Desk */}
            <Link
              href="/messages"
              className="header-nav-btn"
              style={{
                fontWeight: (pathname === '/messages' || activeTab === 'messages') ? 800 : 600,
                color: (pathname === '/messages' || activeTab === 'messages') ? '#FFFFFF' : '#334155',
                backgroundColor: (pathname === '/messages' || activeTab === 'messages') ? BRAND_COLORS.primary : 'transparent',
                textDecoration: 'none',
              }}
            >
              <MessageSquare size={14} />
              <span>{language === 'en' ? 'Help Desk' : 'হেল্প ডেস্ক'}</span>
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="header-actions-right">
            {/* Search Trigger (Desktop only) */}
            <button
              onClick={onOpenSearch || (() => handleNavClick('search'))}
              aria-label="Search Healthcare Services"
              className="clay-pill d-desktop-flex header-search-btn"
              style={{ color: 'var(--brand-text-dark)' }}
            >
              <Search size={15} color={BRAND_COLORS.primary} />
              <span className="d-desktop-inline">{language === 'en' ? 'Search' : 'সার্চ'}</span>
            </button>

            {/* Scan QR Button */}
            <button
              onClick={() => setIsScannerOpen(true)}
              aria-label={currentLanguage === 'en' ? 'Scan QR Code' : 'কিউআর কোড স্ক্যান করুন'}
              className="clay-pill header-scan-btn"
              style={{
                color: '#0060FA',
                borderColor: 'rgba(0, 96, 250, 0.3)',
                background: 'rgba(235, 243, 255, 0.75)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              <QrCode size={14} color="#0060FA" />
              <span>{currentLanguage === 'en' ? 'Scan QR' : 'স্ক্যান'}</span>
            </button>

            {/* Location Trigger */}
            <button
              onClick={onOpenLocation}
              aria-label="Select Location Hub"
              className="clay-pill header-location-btn"
              style={{ color: 'var(--brand-text-dark)' }}
            >
              <MapPin size={13} color={BRAND_COLORS.primary} />
              <span className="header-location-text">
                {selectedLocation}
              </span>
              {isGpsActive && (
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    marginLeft: '4px',
                  }}
                  title="GPS Active"
                />
              )}
            </button>

            {/* Auth Button */}
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Link
                  href={
                    ['HOSPITAL_ADMIN', 'DIAGNOSTIC_ADMIN', 'CLINIC_ADMIN', 'DIAGNOSTIC_STAFF', 'HOSPITAL_STAFF'].includes(currentUser.primaryRole)
                      ? '/hospital/portal'
                      : ['DOCTOR', 'DOCTOR_ASSISTANT'].includes(currentUser.primaryRole)
                        ? '/doctor/portal'
                        : currentUser.primaryRole === 'SUPER_ADMIN'
                          ? '/admin'
                          : '/patient/dashboard'
                  }
                  className="clay-pill"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    gap: '6px',
                    padding: '6px 10px',
                    color: '#0F172A',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <User size={13} color={BRAND_COLORS.primary} />
                  <span
                    style={{
                      maxWidth: '90px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {currentUser.fullName || (language === 'en' ? 'Profile' : 'প্রোফাইল')}
                  </span>
                </Link>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    title={language === 'en' ? 'Sign Out' : 'লগআউট'}
                    aria-label={language === 'en' ? 'Sign Out' : 'লগআউট'}
                    className="clay-bubble"
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#FEF2F2',
                      border: '1.5px solid #FCA5A5',
                      color: '#DC2626',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <LogOut size={13} />
                  </button>
                )}
              </div>
            ) : (
              onOpenAuth && (
                <button
                  onClick={() => onOpenAuth('login')}
                  className="btn-secondary header-auth-btn d-desktop-flex"
                  style={{
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 14px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span>{language === 'en' ? 'Sign In' : 'লগইন'}</span>
                </button>
              )
            )}

          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {isScannerOpen && (
        <QRScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          language={currentLanguage}
        />
      )}
    </header>
  );
};

export default Header;
