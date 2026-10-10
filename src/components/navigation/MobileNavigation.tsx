'use client';

import React from 'react';
import { SupportedLanguage, BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import { UserRole } from '@/types';
import {
  Home,
  Compass,
  CalendarCheck,
  MessageSquare,
  User,
  Clock,
  LayoutDashboard,
  FileText,
} from 'lucide-react';

export type ActiveNavTab =
  | 'marketplace'
  | 'search'
  | 'appointments'
  | 'queue'
  | 'reports'
  | 'prescriptions'
  | 'portal'
  | 'profile'
  | 'emergency'
  | 'discover'
  | 'bookings'
  | 'messages';

interface MobileNavigationProps {
  language: SupportedLanguage;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  currentRole?: UserRole;
  onOpenSearch?: () => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
  onOpenHelpline?: () => void;
  unreadCount?: number;
  currentUser?: any;
}

export default function MobileNavigation({
  language,
  activeTab,
  setActiveTab,
  currentRole = 'PATIENT',
  onOpenSearch,
  onOpenAuth,
  onOpenHelpline,
  unreadCount = 0,
  currentUser,
}: MobileNavigationProps) {
  const isPatient = currentRole === 'PATIENT';

  // Active state matching
  const isHomeActive = activeTab === 'marketplace';
  const isDiscoverActive = activeTab === 'discover' || activeTab === 'search';
  const isBookingsActive = activeTab === 'bookings' || activeTab === 'appointments' || activeTab === 'queue';
  const isMessagesActive = activeTab === 'messages';
  const isProfileActive = activeTab === 'profile' || activeTab === 'reports';

  return (
    <nav
      className="mobile-bottom-dock"
      role="navigation"
      aria-label="Mobile Navigation Dock"
      style={{
        position: 'fixed',
        bottom: '10px',
        left: '12px',
        right: '12px',
        maxWidth: 'calc(100vw - 24px)',
        margin: '0 auto',
        boxSizing: 'border-box',
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.85)',
        paddingTop: '6px',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        paddingLeft: '10px',
        paddingRight: '10px',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 9900,
        boxShadow: '0 16px 36px rgba(15, 118, 110, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.95)',
      }}
    >
      {/* 1. Home */}
      <button
        onClick={() => {
          setActiveTab('marketplace');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`mobile-dock-item ${isHomeActive ? 'active' : ''}`}
        aria-label="Home"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          padding: '6px 4px',
          borderRadius: '10px',
          border: 'none',
          background: isHomeActive ? BRAND_COLORS.primaryLight : 'transparent',
          color: isHomeActive ? BRAND_COLORS.primary : '#64748B',
          cursor: 'pointer',
          minHeight: '48px',
          transition: 'all 0.15s ease',
        }}
      >
        <Home
          size={20}
          color={isHomeActive ? BRAND_COLORS.primary : '#64748B'}
          strokeWidth={isHomeActive ? 2.3 : 1.8}
        />
        <span style={{ fontSize: '10.5px', fontWeight: isHomeActive ? 800 : 500 }}>
          {language === 'en' ? 'Home' : 'হোম'}
        </span>
      </button>

      {/* 2. Discover */}
      <button
        onClick={() => {
          setActiveTab('search');
          if (onOpenSearch) onOpenSearch();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`mobile-dock-item ${isDiscoverActive ? 'active' : ''}`}
        aria-label="Discover"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          padding: '6px 4px',
          borderRadius: '10px',
          border: 'none',
          background: isDiscoverActive ? BRAND_COLORS.primaryLight : 'transparent',
          color: isDiscoverActive ? BRAND_COLORS.primary : '#64748B',
          cursor: 'pointer',
          minHeight: '48px',
          transition: 'all 0.15s ease',
        }}
      >
        <Compass
          size={20}
          color={isDiscoverActive ? BRAND_COLORS.primary : '#64748B'}
          strokeWidth={isDiscoverActive ? 2.3 : 1.8}
        />
        <span style={{ fontSize: '10.5px', fontWeight: isDiscoverActive ? 800 : 500 }}>
          {language === 'en' ? 'Discover' : 'আবিষ্কার'}
        </span>
      </button>

      {/* 3. Bookings */}
      <button
        onClick={() => {
          setActiveTab(isPatient ? 'appointments' : 'queue');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`mobile-dock-item ${isBookingsActive ? 'active' : ''}`}
        aria-label="Bookings"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          padding: '6px 4px',
          borderRadius: '10px',
          border: 'none',
          background: isBookingsActive ? BRAND_COLORS.primaryLight : 'transparent',
          color: isBookingsActive ? BRAND_COLORS.primary : '#64748B',
          cursor: 'pointer',
          minHeight: '48px',
          transition: 'all 0.15s ease',
        }}
      >
        <CalendarCheck
          size={20}
          color={isBookingsActive ? BRAND_COLORS.primary : '#64748B'}
          strokeWidth={isBookingsActive ? 2.3 : 1.8}
        />
        <span style={{ fontSize: '10.5px', fontWeight: isBookingsActive ? 800 : 500 }}>
          {language === 'en' ? 'Bookings' : 'বুকিংস'}
        </span>
      </button>

      {/* 4. Messages / Helpline Support */}
      <button
        onClick={() => {
          if (onOpenHelpline) {
            onOpenHelpline();
          } else if (typeof window !== 'undefined') {
            const el = document.getElementById('footer-call-helpline-cta');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.location.href = `tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`;
            }
          }
        }}
        className={`mobile-dock-item ${isMessagesActive ? 'active' : ''}`}
        aria-label="Messages"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          padding: '6px 4px',
          borderRadius: '10px',
          border: 'none',
          background: isMessagesActive ? BRAND_COLORS.primaryLight : 'transparent',
          color: isMessagesActive ? BRAND_COLORS.primary : '#64748B',
          cursor: 'pointer',
          minHeight: '48px',
          position: 'relative',
          transition: 'all 0.15s ease',
        }}
      >
        <div style={{ position: 'relative' }}>
          <MessageSquare
            size={20}
            color={isMessagesActive ? BRAND_COLORS.primary : '#64748B'}
            strokeWidth={isMessagesActive ? 2.3 : 1.8}
          />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-4px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: BRAND_COLORS.primary,
              }}
            />
          )}
        </div>
        <span style={{ fontSize: '10.5px', fontWeight: isMessagesActive ? 800 : 500 }}>
          {language === 'en' ? 'Messages' : 'মেসেজ'}
        </span>
      </button>

      {/* 5. Profile / Account */}
      <button
        onClick={() => {
          setActiveTab(isPatient ? 'profile' : 'portal');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`mobile-dock-item ${isProfileActive ? 'active' : ''}`}
        aria-label="Profile"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          padding: '6px 4px',
          borderRadius: '10px',
          border: 'none',
          background: isProfileActive ? BRAND_COLORS.primaryLight : 'transparent',
          color: isProfileActive ? BRAND_COLORS.primary : '#64748B',
          cursor: 'pointer',
          minHeight: '48px',
          transition: 'all 0.15s ease',
        }}
      >
        <User
          size={20}
          color={isProfileActive ? BRAND_COLORS.primary : '#64748B'}
          strokeWidth={isProfileActive ? 2.3 : 1.8}
        />
        <span style={{ fontSize: '10.5px', fontWeight: isProfileActive ? 800 : 500 }}>
          {currentUser
            ? (language === 'en' ? 'Profile' : 'প্রোফাইল')
            : (language === 'en' ? 'Account' : 'অ্যাকাউন্ট')}
        </span>
      </button>
    </nav>
  );
}
