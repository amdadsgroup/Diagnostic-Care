'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { BRAND_CONSTANTS, BRAND_COLORS, SupportedLanguage } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import { UserRole } from '@/types';
import { BrandLogo } from '@/components/brand/BrandLogo';
import {
  Search,
  MapPin,
  Globe,
  User,
  Phone,
  ChevronDown,
  LogOut,
  Home,
  Stethoscope,
  CalendarCheck,
  Clock,
  FileText,
  MessageSquare,
  Building2,
} from 'lucide-react';

interface HeaderProps {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
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
  selectedLocation = 'Moulvibazar',
  onSelectCategory,
  currentUser,
  onLogout,
}) => {
  const t = TRANSLATIONS[language];
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
                color: '#EBF3FF',
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

          {/* Right: Emergency 24/7 Helpline, Provider Hub & Language */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Hospital & Doctor Access Trigger */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('provider-hub');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-hospital-portal', { detail: { mode: 'login' } }));
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(59, 130, 246, 0.25)',
                border: '1px solid rgba(96, 165, 250, 0.45)',
                color: '#93C5FD',
                padding: '2px 9px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Building2 size={12} color="#93C5FD" />
              <span>{language === 'en' ? 'Hospital & Doctor Portal' : 'হাসপাতাল ও ডাক্তার পোর্টাল'}</span>
            </button>

            <a
              href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#EBF3FF',
                fontWeight: 700,
                textDecoration: 'none',
                background: 'rgba(0, 96, 250, 0.35)',
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
                  color: language === 'en' ? '#FFFFFF' : '#EBF3FF',
                  background: language === 'en' ? 'var(--brand-primary)' : 'transparent',
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
                  color: language === 'bn' ? '#FFFFFF' : '#EBF3FF',
                  background: language === 'bn' ? 'var(--brand-primary)' : 'transparent',
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
          padding: '10px 16px',
          gap: '10px',
        }}
      >
        {/* Left: Brand Logo (never shrinks) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            onClick={() => handleNavClick('marketplace')}
          >
            <BrandLogo
              variant="horizontal"
              size={32}
              priority
              altText="Diagnostic Care"
            />
          </div>
        </div>

        {/* Center: Desktop Navigation Bar (All Platform Functions Visible in Web View) */}
        <nav
          className="d-desktop-flex"
          style={{
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(248, 250, 252, 0.8)',
            padding: '4px 6px',
            borderRadius: '14px',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            backdropFilter: 'blur(8px)',
          }}
          aria-label="Desktop Primary Navigation"
        >
          {/* 1. Home */}
          <Link
            href="/"
            onClick={() => handleNavClick('marketplace')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: (pathname === '/' && activeTab === 'marketplace') ? 800 : 600,
              color: (pathname === '/' && activeTab === 'marketplace') ? '#FFFFFF' : '#334155',
              backgroundColor: (pathname === '/' && activeTab === 'marketplace') ? BRAND_COLORS.primary : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Home size={14} />
            <span>{language === 'en' ? 'Home' : 'হোম'}</span>
          </Link>

          {/* 2. Find Doctors */}
          <Link
            href="/doctors"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: (pathname === '/doctors' || activeTab === 'search' || activeTab === 'discover') ? 800 : 600,
              color: (pathname === '/doctors' || activeTab === 'search' || activeTab === 'discover') ? '#FFFFFF' : '#334155',
              backgroundColor: (pathname === '/doctors' || activeTab === 'search' || activeTab === 'discover') ? BRAND_COLORS.primary : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Stethoscope size={14} />
            <span>{language === 'en' ? 'Doctors' : 'ডাক্তার'}</span>
          </Link>

          {/* 3. My Appointments / Bookings */}
          <Link
            href="/appointments"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: (pathname === '/appointments' || activeTab === 'appointments' || activeTab === 'bookings') ? 800 : 600,
              color: (pathname === '/appointments' || activeTab === 'appointments' || activeTab === 'bookings') ? '#FFFFFF' : '#334155',
              backgroundColor: (pathname === '/appointments' || activeTab === 'appointments' || activeTab === 'bookings') ? BRAND_COLORS.primary : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <CalendarCheck size={14} />
            <span>{language === 'en' ? 'Appointments' : 'অ্যাপয়েন্টমেন্ট'}</span>
          </Link>

          {/* 4. Live Chamber Queue */}
          <button
            onClick={() => handleNavClick('queue')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: activeTab === 'queue' ? 800 : 600,
              color: activeTab === 'queue' ? '#FFFFFF' : '#334155',
              backgroundColor: activeTab === 'queue' ? BRAND_COLORS.primary : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Clock size={14} />
            <span>{language === 'en' ? 'Live Queue' : 'লাইভ কিউ'}</span>
          </button>

          {/* 5. Prescriptions Vault */}
          <button
            onClick={() => handleNavClick('prescriptions')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: (activeTab === 'prescriptions' || activeTab === 'reports') ? 800 : 600,
              color: (activeTab === 'prescriptions' || activeTab === 'reports') ? '#FFFFFF' : '#334155',
              backgroundColor: (activeTab === 'prescriptions' || activeTab === 'reports') ? BRAND_COLORS.primary : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <FileText size={14} />
            <span>{language === 'en' ? 'Prescriptions' : 'প্রেসক্রিপশন'}</span>
          </button>

          {/* 6. Messages & Help Desk */}
          <button
            onClick={() => handleNavClick('messages')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: activeTab === 'messages' ? 800 : 600,
              color: activeTab === 'messages' ? '#FFFFFF' : '#334155',
              backgroundColor: activeTab === 'messages' ? BRAND_COLORS.primary : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <MessageSquare size={14} />
            <span>{language === 'en' ? 'Help Desk' : 'হেল্প ডেস্ক'}</span>
          </button>

        </nav>

        {/* Right Side Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Search Trigger (Desktop only) */}
          <button
            onClick={onOpenSearch || (() => handleNavClick('search'))}
            aria-label="Search Healthcare Services"
            className="clay-pill d-desktop-flex"
            style={{
              gap: '6px',
              padding: '6px 10px',
              color: 'var(--brand-text-dark)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Search size={15} color={BRAND_COLORS.primary} />
            <span className="d-desktop-inline">{language === 'en' ? 'Search' : 'সার্চ'}</span>
          </button>

          {/* Location Trigger */}
          <button
            onClick={onOpenLocation}
            aria-label="Select Location Hub"
            className="clay-pill"
            style={{
              gap: '4px',
              padding: '6px 10px',
              color: 'var(--brand-text-dark)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <MapPin size={13} color={BRAND_COLORS.primary} />
            <span style={{ maxWidth: '85px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {selectedLocation}
            </span>
          </button>

          {/* Mobile Quick Language Toggle */}
          <button
            onClick={() => {
              const next = language === 'en' ? 'bn' : 'en';
              setLanguage(next);
              if (typeof window !== 'undefined') localStorage.setItem('dc_lang', next);
            }}
            aria-label="Switch Language"
            className="clay-bubble d-mobile-flex"
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 800,
              color: BRAND_COLORS.primary,
              cursor: 'pointer',
              lineHeight: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {language === 'en' ? 'বাং' : 'EN'}
          </button>

          {/* Auth Button */}
          {currentUser ? (
            <div className="d-desktop-flex" style={{ alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => handleNavClick('profile')}
                className="clay-pill"
                style={{
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
              </button>
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
                className="btn-secondary d-desktop-only"
                style={{
                  gap: '6px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
              >
                <User size={14} color={BRAND_COLORS.primary} />
                <span>{language === 'en' ? 'Sign In / Register' : 'লগইন / সাইন আপ'}</span>
              </button>
            )
          )}

        </div>
      </div>

    </header>
  );
};

export default Header;
