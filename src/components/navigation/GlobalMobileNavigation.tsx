'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import { BRAND_COLORS } from '@/config/brand';
import {
  Home,
  Compass,
  CalendarCheck,
  MessageSquare,
  User,
  Building2,
  QrCode,
} from 'lucide-react';

function MobileBottomDockInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useLanguage();
  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(null);

  useEffect(() => {
    AuthService.getCurrentUser().then((u) => {
      if (u) setCurrentUser(u);
    });
  }, [pathname]);

  const tabParam = searchParams?.get('tab');

  const isProvider =
    (currentUser && ['HOSPITAL_ADMIN', 'DIAGNOSTIC_ADMIN', 'CLINIC_ADMIN', 'HOSPITAL_STAFF', 'DIAGNOSTIC_STAFF'].includes(currentUser.primaryRole)) ||
    (typeof window !== 'undefined' && !!localStorage.getItem('dc_hospital_session')) ||
    (currentUser && ['popular', 'hospital', 'diagnostic', 'clinic', 'medical'].some((k) => (currentUser.fullName || '').toLowerCase().includes(k))) ||
    currentUser?.phone === '01733983752';

  // Determine active tab reactively based on current route and search params
  const isHomeActive = pathname === '/' && (!tabParam || tabParam === 'marketplace');
  const isDiscoverActive =
    pathname === '/doctors' ||
    pathname.startsWith('/doctors/') ||
    tabParam === 'search' ||
    tabParam === 'discover';
  const isScanActive = pathname === '/scan';
  const isBookingsActive =
    pathname === '/appointments' ||
    pathname.startsWith('/appointments/') ||
    tabParam === 'appointments' ||
    tabParam === 'bookings' ||
    tabParam === 'queue';
  const isMessagesActive = pathname === '/messages' || tabParam === 'messages';
  const isAccountActive =
    pathname.startsWith('/hospital/portal') ||
    pathname.startsWith('/doctor/portal') ||
    pathname === '/patient/dashboard' ||
    pathname === '/login' ||
    pathname === '/register' ||
    tabParam === 'profile' ||
    tabParam === 'reports';

  const handleNavigate = (target: 'home' | 'discover' | 'scan' | 'bookings' | 'messages' | 'account') => {
    if (target === 'home') {
      if (pathname === '/' && (!tabParam || tabParam === 'marketplace')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        router.push('/');
      }
    } else if (target === 'discover') {
      if (pathname === '/doctors') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        router.push('/doctors');
      }
    } else if (target === 'scan') {
      router.push('/scan');
    } else if (target === 'bookings') {
      if (pathname === '/appointments') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        router.push('/appointments');
      }
    } else if (target === 'messages') {
      if (pathname === '/messages') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        router.push('/messages');
      }
    } else if (target === 'account') {
      if (isProvider) {
        router.push('/hospital/portal');
      } else if (currentUser) {
        if (['DOCTOR', 'DOCTOR_ASSISTANT'].includes(currentUser.primaryRole)) {
          router.push('/doctor/portal');
        } else {
          router.push('/patient/dashboard');
        }
      } else {
        router.push('/login');
      }
    }
  };

  return (
    <nav
      className="mobile-bottom-dock"
      role="navigation"
      aria-label="Mobile Navigation Dock"
    >
      {/* 1. Home */}
      <button
        onClick={() => handleNavigate('home')}
        className={`mobile-dock-btn ${isHomeActive ? 'active' : ''}`}
        aria-label={language === 'en' ? 'Home' : 'হোম'}
      >
        <Home
          size={20}
          color={isHomeActive ? BRAND_COLORS.primary : '#64748B'}
          strokeWidth={isHomeActive ? 2.4 : 1.8}
        />
        <span className="mobile-dock-label">
          {language === 'en' ? 'Home' : 'হোম'}
        </span>
      </button>

      {/* 2. Discover */}
      <button
        onClick={() => handleNavigate('discover')}
        className={`mobile-dock-btn ${isDiscoverActive ? 'active' : ''}`}
        aria-label={language === 'en' ? 'Discover' : 'ডিসকভার'}
      >
        <Compass
          size={20}
          color={isDiscoverActive ? BRAND_COLORS.primary : '#64748B'}
          strokeWidth={isDiscoverActive ? 2.4 : 1.8}
        />
        <span className="mobile-dock-label">
          {language === 'en' ? 'Doctors' : 'ডাক্তার'}
        </span>
      </button>

      {/* 3. Scan QR */}
      <button
        onClick={() => handleNavigate('scan')}
        className={`mobile-dock-btn ${isScanActive ? 'active' : ''}`}
        aria-label={language === 'en' ? 'Scan QR' : 'স্ক্যান'}
      >
        <div
          style={{
            background: isScanActive ? '#0060FA' : 'rgba(0, 96, 250, 0.12)',
            borderRadius: '12px',
            padding: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2px',
            transition: 'all 0.2s ease',
          }}
        >
          <QrCode
            size={18}
            color={isScanActive ? '#FFFFFF' : '#0060FA'}
            strokeWidth={2.2}
          />
        </div>
        <span className="mobile-dock-label" style={{ fontWeight: isScanActive ? 800 : 600, color: isScanActive ? '#0060FA' : '#64748B' }}>
          {language === 'en' ? 'Scan QR' : 'স্ক্যান'}
        </span>
      </button>

      {/* 4. Bookings */}
      <button
        onClick={() => handleNavigate('bookings')}
        className={`mobile-dock-btn ${isBookingsActive ? 'active' : ''}`}
        aria-label={language === 'en' ? 'Bookings' : 'বুকিংস'}
      >
        <CalendarCheck
          size={20}
          color={isBookingsActive ? BRAND_COLORS.primary : '#64748B'}
          strokeWidth={isBookingsActive ? 2.4 : 1.8}
        />
        <span className="mobile-dock-label">
          {language === 'en' ? 'Bookings' : 'বুকিংস'}
        </span>
      </button>

      {/* 5. Account / Hospital Portal */}
      <button
        onClick={() => handleNavigate('account')}
        className={`mobile-dock-btn ${isAccountActive ? 'active' : ''}`}
        aria-label={isProvider ? (language === 'en' ? 'Hospital Portal' : 'হাসপাতাল পোর্টাল') : (language === 'en' ? 'Account' : 'অ্যাকাউন্ট')}
      >
        {isProvider ? (
          <Building2
            size={20}
            color={isAccountActive ? BRAND_COLORS.primary : '#64748B'}
            strokeWidth={isAccountActive ? 2.4 : 1.8}
          />
        ) : (
          <User
            size={20}
            color={isAccountActive ? BRAND_COLORS.primary : '#64748B'}
            strokeWidth={isAccountActive ? 2.4 : 1.8}
          />
        )}
        <span className="mobile-dock-label">
          {isProvider
            ? (language === 'en' ? 'Portal' : 'পোর্টাল')
            : (language === 'en' ? 'Account' : 'অ্যাকাউন্ট')}
        </span>
      </button>
    </nav>
  );
}

export default function GlobalMobileNavigation() {
  return (
    <Suspense fallback={null}>
      <MobileBottomDockInner />
    </Suspense>
  );
}
