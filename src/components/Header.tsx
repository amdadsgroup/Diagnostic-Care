'use client';

import React, { useState, useEffect } from 'react';
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
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 9950,
        backgroundColor: '#FFFFFF',
        transition: 'all 0.2s ease',
        boxShadow: isScrolled
          ? '0 4px 20px -2px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)'
          : '0 1px 0 #E5E7EB',
      }}
    >
      {/* Top Utility Bar (Desktop only) */}
      <div
        className="d-desktop-only"
        style={{
          backgroundColor: '#0F172A',
          color: '#F8FAFC',
          padding: '6px 0',
          fontSize: '11.5px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
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
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                padding: '2px 8px',
                borderRadius: '6px',
                color: '#93C5FD',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <MapPin size={11} color="#60A5FA" />
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
                color: '#60A5FA',
                fontWeight: 700,
                textDecoration: 'none',
                background: 'rgba(0, 87, 255, 0.15)',
                padding: '2px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(0, 87, 255, 0.3)',
              }}
            >
              <Phone size={11} />
              <span>24/7 Helpline: <strong>{BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}</strong></span>
            </a>

            {/* Language Switcher */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '2px 4px',
                borderRadius: '6px',
              }}
            >
              <Globe size={11} color="#93C5FD" style={{ marginRight: '2px' }} />
              <button
                onClick={() => {
                  setLanguage('en');
                  if (typeof window !== 'undefined') localStorage.setItem('dc_lang', 'en');
                }}
                style={{
                  color: language === 'en' ? '#0F172A' : '#FFFFFF',
                  background: language === 'en' ? '#60A5FA' : 'transparent',
                  fontWeight: 700,
                  fontSize: '10.5px',
                  padding: '2px 6px',
                  borderRadius: '4px',
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
                  color: language === 'bn' ? '#0F172A' : '#FFFFFF',
                  background: language === 'bn' ? '#60A5FA' : 'transparent',
                  fontWeight: 700,
                  fontSize: '10.5px',
                  padding: '2px 6px',
                  borderRadius: '4px',
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
          <button
            onClick={() => handleNavClick('marketplace')}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: activeTab === 'marketplace' ? 700 : 500,
              color: activeTab === 'marketplace' ? BRAND_COLORS.primary : BRAND_COLORS.textDark,
              backgroundColor: activeTab === 'marketplace' ? BRAND_COLORS.primaryLight : 'transparent',
            }}
          >
            {language === 'en' ? 'Home' : 'হোম'}
          </button>

          {/* 2. Find Doctors */}
          <button
            onClick={() => handleNavClick('marketplace', 'DOCTOR')}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: 500,
              color: BRAND_COLORS.textDark,
            }}
          >
            {language === 'en' ? 'Find Doctors' : 'ডাক্তার'}
          </button>

          {/* 3. Diagnostic Centers */}
          <button
            onClick={() => handleNavClick('marketplace', 'DIAGNOSTIC_CENTER')}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: 500,
              color: BRAND_COLORS.textDark,
            }}
          >
            {language === 'en' ? 'Diagnostic Centers' : 'ডায়াগনস্টিক সেন্টার'}
          </button>

          {/* 4. Hospitals & Clinics */}
          <button
            onClick={() => handleNavClick('marketplace', 'HOSPITAL')}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: 500,
              color: BRAND_COLORS.textDark,
            }}
          >
            {language === 'en' ? 'Hospitals & Clinics' : 'হাসপাতাল ও ক্লিনিক'}
          </button>

          {/* 5. Pharmacies */}
          <button
            onClick={() => handleNavClick('marketplace', 'PHARMACY')}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: 500,
              color: BRAND_COLORS.textDark,
            }}
          >
            {language === 'en' ? 'Pharmacies' : 'ফার্মেসি'}
          </button>

          {/* 6. Ambulance */}
          <button
            onClick={() => handleNavClick('marketplace', 'AMBULANCE')}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: 500,
              color: BRAND_COLORS.textDark,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{language === 'en' ? 'Ambulance' : 'অ্যাম্বুলেন্স'}</span>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                boxShadow: '0 0 6px #EF4444',
              }}
            />
          </button>

          {/* 7. Home Healthcare */}
          <button
            onClick={() => handleNavClick('marketplace', 'HOME_CARE')}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: 500,
              color: BRAND_COLORS.textDark,
            }}
          >
            {language === 'en' ? 'Home Healthcare' : 'হোম হেলথকেয়ার'}
          </button>
        </nav>

        {/* Right Side Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch || (() => handleNavClick('search'))}
            aria-label="Search Healthcare Services"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: 'var(--brand-bg)',
              border: '1px solid var(--brand-border)',
              color: 'var(--brand-text-secondary)',
              fontSize: '13px',
              fontWeight: 500,
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
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: 'var(--brand-bg)',
              border: '1px solid var(--brand-border)',
              color: 'var(--brand-text-dark)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <MapPin size={15} color={BRAND_COLORS.primary} />
            <span style={{ maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {selectedLocation}
            </span>
          </button>

          {/* Login Button */}
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                border: '1px solid var(--brand-border)',
                color: 'var(--brand-text-dark)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <User size={14} color={BRAND_COLORS.textDark} />
              <span>{language === 'en' ? 'Login' : 'লগইন'}</span>
            </button>
          )}

          {/* Get Started / Partner Button (Signal Blue #0057FF) */}
          {onOpenOnboard ? (
            <button
              onClick={onOpenOnboard}
              className="btn-primary"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
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
                padding: '8px 16px',
                borderRadius: '8px',
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
            borderTop: '1px solid var(--brand-border)',
            backgroundColor: '#FFFFFF',
            padding: '20px 24px 28px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
            animation: 'slideDown 0.2s ease-out',
          }}
          className="d-mobile-only"
        >
          {/* Logo in drawer header */}
          <div style={{ marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
            <BrandLogo variant="horizontal" size={32} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={() => handleNavClick('marketplace')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                backgroundColor: activeTab === 'marketplace' ? BRAND_COLORS.primaryLight : 'transparent',
                color: activeTab === 'marketplace' ? BRAND_COLORS.primary : 'var(--brand-text-dark)',
                fontWeight: 600,
                fontSize: '14px',
                textAlign: 'left',
              }}
            >
              <Home size={18} color={activeTab === 'marketplace' ? BRAND_COLORS.primary : '#64748B'} />
              <span>{language === 'en' ? 'Home' : 'হোম'}</span>
            </button>

            <button
              onClick={() => handleNavClick('marketplace', 'DOCTOR')}
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
              <Stethoscope size={18} color="#64748B" />
              <span>{language === 'en' ? 'Find Doctors' : 'ডাক্তার খুঁজুন'}</span>
            </button>

            <button
              onClick={() => handleNavClick('marketplace', 'DIAGNOSTIC_CENTER')}
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
              <TestTube2 size={18} color="#64748B" />
              <span>{language === 'en' ? 'Diagnostic Centers & Tests' : 'ডায়াগনস্টিক সেন্টার ও টেস্ট'}</span>
            </button>

            <button
              onClick={() => handleNavClick('marketplace', 'HOSPITAL')}
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
              <Building2 size={18} color="#64748B" />
              <span>{language === 'en' ? 'Hospitals & Clinics' : 'হাসপাতাল ও ক্লিনিক'}</span>
            </button>

            <button
              onClick={() => handleNavClick('marketplace', 'PHARMACY')}
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
              <Pill size={18} color="#64748B" />
              <span>{language === 'en' ? 'Pharmacies & Medicines' : 'ফার্মেসি ও ঔষধ'}</span>
            </button>

            <button
              onClick={() => handleNavClick('marketplace', 'AMBULANCE')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                color: '#DC2626',
                fontWeight: 700,
                fontSize: '14px',
                textAlign: 'left',
              }}
            >
              <Ambulance size={18} color="#DC2626" />
              <span>{language === 'en' ? 'Emergency Ambulance 24/7' : 'জরুরি অ্যাম্বুলেন্স ২৪/৭'}</span>
            </button>

            <button
              onClick={() => handleNavClick('marketplace', 'HOME_CARE')}
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
              <HeartPulse size={18} color="#64748B" />
              <span>{language === 'en' ? 'Home Healthcare' : 'হোম হেলথকেয়ার'}</span>
            </button>

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
