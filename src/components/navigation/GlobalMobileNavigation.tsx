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

  // Determine active tab reactively based on current route and search params
  const isHomeActive = pathname === '/' && (!tabParam || tabParam === 'marketplace');
  const isDiscoverActive =
    pathname === '/doctors' ||
    pathname.startsWith('/doctors/') ||
    tabParam === 'search' ||
    tabParam === 'discover';
  const isBookingsActive =
    pathname === '/appointments' ||
    pathname.startsWith('/appointments/') ||
    tabParam === 'appointments' ||
    tabParam === 'bookings' ||
    tabParam === 'queue';
  const isMessagesActive = tabParam === 'messages';
  const isAccountActive =
    pathname === '/patient/dashboard' ||
    pathname === '/login' ||
    pathname === '/register' ||
    tabParam === 'profile' ||
    tabParam === 'reports';

  const handleNavigate = (target: 'home' | 'discover' | 'bookings' | 'messages' | 'account') => {
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
    } else if (target === 'bookings') {
      if (pathname === '/appointments') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        router.push('/appointments');
      }
    } else if (target === 'messages') {
      router.push('/?tab=messages');
    } else if (target === 'account') {
      if (currentUser) {
        router.push('/?tab=profile');
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
          {language === 'en' ? 'Discover' : 'ডিসকভার'}
        </span>
      </button>

      {/* 3. Bookings */}
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

      {/* 4. Messages */}
      <button
        onClick={() => handleNavigate('messages')}
        className={`mobile-dock-btn ${isMessagesActive ? 'active' : ''}`}
        aria-label={language === 'en' ? 'Messages' : 'মেসেজ'}
      >
        <MessageSquare
          size={20}
          color={isMessagesActive ? BRAND_COLORS.primary : '#64748B'}
          strokeWidth={isMessagesActive ? 2.4 : 1.8}
        />
        <span className="mobile-dock-label">
          {language === 'en' ? 'Messages' : 'মেসেজ'}
        </span>
      </button>

      {/* 5. Account */}
      <button
        onClick={() => handleNavigate('account')}
        className={`mobile-dock-btn ${isAccountActive ? 'active' : ''}`}
        aria-label={language === 'en' ? 'Account' : 'অ্যাকাউন্ট'}
      >
        <User
          size={20}
          color={isAccountActive ? BRAND_COLORS.primary : '#64748B'}
          strokeWidth={isAccountActive ? 2.4 : 1.8}
        />
        <span className="mobile-dock-label">
          {language === 'en' ? 'Account' : 'অ্যাকাউন্ট'}
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
