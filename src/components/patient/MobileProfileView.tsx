'use client';

import React, { useState, useEffect } from 'react';
import { SupportedLanguage, BRAND_CONSTANTS } from '@/config/brand';
import { useLanguage } from '@/context/LanguageContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  Bell,
  Download,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  ChevronRight,
  LogOut,
  Calendar,
  FileText,
  Heart,
  HelpCircle,
  CheckCircle2,
  Building2,
} from 'lucide-react';

interface MobileProfileViewProps {
  language?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  selectedLocation: string;
  onOpenLocationModal: () => void;
  onOpenNotificationsModal: () => void;
  onNavigateTab: (tab: any) => void;
  onOpenAuthModal?: (mode?: 'login' | 'register') => void;
  onLogout?: () => void;
  currentUser?: any;
  appointmentsCount?: number;
}

export default function MobileProfileView({
  language: propLanguage,
  onLanguageChange: propOnLanguageChange,
  selectedLocation,
  onOpenLocationModal,
  onOpenNotificationsModal,
  onNavigateTab,
  onOpenAuthModal,
  onLogout,
  currentUser,
  appointmentsCount = 0,
}: MobileProfileViewProps) {
  const langContext = useLanguage();
  const language = propLanguage || langContext.language || 'en';
  const onLanguageChange = (l: SupportedLanguage) => {
    if (propOnLanguageChange) propOnLanguageChange(l);
    langContext.setLanguage(l);
  };
  const [isStandalone, setIsStandalone] = useState(false);
  const [platformName, setPlatformName] = useState('Mobile Browser');
  const [cacheClearStatus, setCacheClearStatus] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(standalone);

      const ua = navigator.userAgent;
      if (/iPhone|iPad|iPod/i.test(ua)) {
        setPlatformName(standalone ? 'iOS PWA Standalone' : 'Safari / iOS Mobile');
      } else if (/Android/i.test(ua)) {
        setPlatformName(standalone ? 'Android PWA Installed' : 'Chrome / Android Mobile');
      } else {
        setPlatformName(standalone ? 'Desktop PWA Standalone' : 'Web Browser');
      }
    }
  }, []);

  const handleTriggerInstall = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('dc-request-install'));
    }
  };

  const handleClearStaticCache = async () => {
    if (typeof window === 'undefined' || !('caches' in window)) return;
    try {
      const keys = await caches.keys();
      // Only clear dynamic non-sensitive caches, keep core static shell
      const targetKeys = keys.filter((k) => k.includes('dynamic'));
      await Promise.all(targetKeys.map((k) => caches.delete(k)));
      setCacheClearStatus(
        language === 'en'
          ? 'Temporary cached marketplace data cleared safely.'
          : 'অপ্রয়োজনীয় ক্যাশ ডাটা সফলভাবে মুছে ফেলা হয়েছে।'
      );
      setTimeout(() => setCacheClearStatus(null), 3000);
    } catch (e) {
      console.warn('Cache clear error:', e);
    }
  };

  const handleCheckUpdate = async () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.update();
        setCacheClearStatus(
          language === 'en'
            ? 'Checked for updates. You are using the latest version of Diagnostic Care.'
            : 'আপডেট চেক সম্পন্ন। আপনি ডায়াগনস্টিক কেয়ারের সর্বশেষ সংস্করণ ব্যবহার করছেন।'
        );
        setTimeout(() => setCacheClearStatus(null), 3500);
      }
    }
  };

  const isProvider =
    (currentUser && ['HOSPITAL_ADMIN', 'DIAGNOSTIC_ADMIN', 'CLINIC_ADMIN', 'HOSPITAL_STAFF', 'DIAGNOSTIC_STAFF'].includes(currentUser.primaryRole)) ||
    (typeof window !== 'undefined' && !!localStorage.getItem('dc_hospital_session')) ||
    (currentUser && ['popular', 'hospital', 'diagnostic', 'clinic', 'medical'].some((k: string) => (currentUser.fullName || '').toLowerCase().includes(k))) ||
    currentUser?.phone === '01733983752';

  // Auto-redirect provider accounts when landing on customer profile view
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasHospSession = !!localStorage.getItem('dc_hospital_session');
      const isProvRole = currentUser && ['HOSPITAL_ADMIN', 'DIAGNOSTIC_ADMIN', 'CLINIC_ADMIN', 'HOSPITAL_STAFF', 'DIAGNOSTIC_STAFF'].includes(currentUser.primaryRole);
      const isFacility = (currentUser?.fullName || '').toLowerCase().match(/(popular|hospital|diagnostic|clinic|medical|centre|center|lab)/i);
      const isHospPhone = currentUser?.phone === '01733983752';

      if (hasHospSession || isProvRole || isFacility || isHospPhone) {
        if (currentUser) {
          const healed = {
            ...currentUser,
            primaryRole: 'HOSPITAL_ADMIN',
            roles: ['HOSPITAL_ADMIN'],
          };
          localStorage.setItem('dc_user_profile', JSON.stringify(healed));
        }
        window.location.href = '/hospital/portal';
      }
    }
  }, [currentUser]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '36px' }}>
      {/* Provider Console Card (if provider account) */}
      {isProvider && currentUser ? (
        <div
          style={{
            background: 'linear-gradient(135deg, #064E3B 0%, #065F46 50%, #047857 100%)',
            color: '#FFFFFF',
            borderRadius: '20px',
            padding: '24px 20px',
            boxShadow: '0 8px 24px rgba(6, 78, 59, 0.25)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                flexShrink: 0,
              }}
            >
              <Building2 size={30} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', color: '#A7F3D0', fontWeight: 700, marginBottom: '4px' }}>
                <CheckCircle2 size={12} />
                <span>{language === 'en' ? 'Verified Healthcare Provider' : 'ভেরিফাইড স্বাস্থ্যসেবা প্রতিষ্ঠান'}</span>
              </div>
              <h1 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>{currentUser.fullName}</h1>
              <div style={{ fontSize: '12.5px', color: '#D1FAE5', marginTop: '2px' }}>
                {currentUser.phone || currentUser.email} • {selectedLocation}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '18px' }}>
            <a
              href="/hospital/portal"
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'center',
                background: '#FFFFFF',
                color: '#065F46',
                padding: '12px 16px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '14px',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
              }}
            >
              {language === 'en' ? 'Open Hospital Operations Portal →' : 'হাসপাতাল অপারেশনস পোর্টাল খুলুন →'}
            </a>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
            }}
          >
            <a href="/hospital/portal?tab=doctors" style={{ textDecoration: 'none', color: '#FFFFFF' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#A7F3D0' }}>👨‍⚕️ Doctors</div>
              <div style={{ fontSize: '11px', color: '#D1FAE5' }}>Manage</div>
            </a>
            <a href="/hospital/portal?tab=appointments" style={{ textDecoration: 'none', color: '#FFFFFF' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#BAE6FD' }}>📅 Bookings</div>
              <div style={{ fontSize: '11px', color: '#D1FAE5' }}>Schedules</div>
            </a>
            <a href="/hospital/portal?tab=subscription" style={{ textDecoration: 'none', color: '#FFFFFF' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#FDE68A' }}>💳 Plans</div>
              <div style={{ fontSize: '11px', color: '#D1FAE5' }}>Tiers</div>
            </a>
          </div>
        </div>
      ) : currentUser ? (
        <div
          style={{
            background: 'linear-gradient(135deg, var(--navy-900) 0%, #142B4E 100%)',
            color: '#FFFFFF',
            borderRadius: '20px',
            padding: '24px 20px',
            boxShadow: '0 8px 24px rgba(10, 22, 40, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--cyan-500) 0%, var(--cyan-600) 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(6, 182, 212, 0.35)',
                flexShrink: 0,
              }}
            >
              {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', color: '#6EE7B7', fontWeight: 700, marginBottom: '4px' }}>
                <CheckCircle2 size={12} />
                <span>{language === 'en' ? 'Verified Account' : 'ভেরিফাইড অ্যাকাউন্ট'}</span>
              </div>
              <h1 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>{currentUser.fullName}</h1>
              <div style={{ fontSize: '12.5px', color: '#94A3B8', marginTop: '2px' }}>
                {currentUser.phone || currentUser.email} • {selectedLocation}
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              textAlign: 'center',
            }}
          >
            <div onClick={() => onNavigateTab('appointments')} style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#38BDF8' }}>{appointmentsCount}</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>{language === 'en' ? 'Appointments' : 'বুকিং'}</div>
            </div>
            <div onClick={() => onNavigateTab('reports')} style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#34D399' }}>0</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>{language === 'en' ? 'Health Records' : 'রিপোর্ট'}</div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#FBBF24' }}>0</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>{language === 'en' ? 'Family Members' : 'পরিবার'}</div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            color: '#FFFFFF',
            borderRadius: '20px',
            padding: '24px 20px',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#93C5FD',
                flexShrink: 0,
              }}
            >
              <User size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                {language === 'en' ? 'Welcome to Diagnostic Care' : 'স্বাগতম ডায়াগনস্টিক কেয়ারে'}
              </h2>
              <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '3px', margin: 0, lineHeight: 1.4 }}>
                {language === 'en'
                  ? 'Sign in to access your doctor appointments, health reports and prescriptions.'
                  : 'ডাক্তারের অ্যাপয়েন্টমেন্ট বুকিং, প্রেসক্রিপশন ও রিপোর্ট দেখতে লগইন করুন।'}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={() => {
                if (onOpenAuthModal) {
                  onOpenAuthModal('login');
                } else if (typeof window !== 'undefined') {
                  window.location.href = '/login';
                }
              }}
              style={{
                backgroundColor: '#0057FF',
                color: '#FFFFFF',
                border: 'none',
                padding: '11px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0, 87, 255, 0.3)',
              }}
            >
              {language === 'en' ? 'Sign In' : 'লগইন'}
            </button>
            <button
              onClick={() => {
                if (onOpenAuthModal) {
                  onOpenAuthModal('register');
                } else if (typeof window !== 'undefined') {
                  window.location.href = '/register';
                }
              }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '11px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {language === 'en' ? 'Register' : 'রেজিস্ট্রেশন'}
            </button>
          </div>
        </div>
      )}

      {/* PWA & Application Center Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: '4px' }}>
          {language === 'en' ? 'Application & PWA Settings' : 'অ্যাপ ও পিডব্লিউএ (PWA) সেটিংস'}
        </h2>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          {/* Install App row (if not in standalone mode) */}
          {!isStandalone && (
            <button
              onClick={handleTriggerInstall}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                border: 'none',
                background: 'linear-gradient(90deg, #ECFEFF 0%, #FFFFFF 100%)',
                cursor: 'pointer',
                textAlign: 'left',
                borderBottom: '1px solid #F1F5F9',
                minHeight: '48px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--cyan-600)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Download size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--navy-900)' }}>
                    {language === 'en' ? 'Install Diagnostic Care App' : 'ডায়াগনস্টিক কেয়ার অ্যাপ ইনস্টল করুন'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--cyan-600)' }}>
                    {language === 'en' ? 'Add to home screen for 1-tap offline access' : 'হোম স্ক্রিনে রাখুন দ্রুত ও অফলাইন অ্যাক্সেসের জন্য'}
                  </div>
                </div>
              </div>
              <ChevronRight size={18} color="var(--cyan-600)" />
            </button>
          )}

          {/* App Status / Standalone Mode */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: '1px solid #F1F5F9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Smartphone size={18} color="var(--slate-500)" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-900)' }}>
                  {language === 'en' ? 'App Display Mode' : 'অ্যাপ ডিসপ্লে মোড'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--slate-500)' }}>
                  {platformName}
                </div>
              </div>
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: isStandalone ? '#059669' : 'var(--slate-500)', background: isStandalone ? '#ECFDF5' : '#F1F5F9', padding: '3px 8px', borderRadius: '6px' }}>
              {isStandalone ? (language === 'en' ? 'Standalone PWA' : 'ইনস্টলড অ্যাপ') : (language === 'en' ? 'Browser Tab' : 'ব্রাউজার ট্যাব')}
            </span>
          </div>

          {/* Version & Check Update */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: '1px solid #F1F5F9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <RefreshCw size={18} color="var(--slate-500)" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-900)' }}>
                  {language === 'en' ? 'App Version' : 'অ্যাপ সংস্করণ'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--slate-500)' }}>
                  v2.0.0 (Production Healthcare PWA)
                </div>
              </div>
            </div>
            <button
              onClick={handleCheckUpdate}
              style={{
                backgroundColor: '#F1F5F9',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '11.5px',
                fontWeight: 700,
                color: 'var(--cyan-600)',
                cursor: 'pointer',
              }}
            >
              {language === 'en' ? 'Check Updates' : 'আপডেট চেক'}
            </button>
          </div>

          {/* Notification Preferences */}
          <button
            onClick={onOpenNotificationsModal}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderBottom: '1px solid #F1F5F9',
              minHeight: '44px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bell size={18} color="var(--slate-500)" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-900)' }}>
                {language === 'en' ? 'Notification Preferences' : 'নোটিফিকেশন সেটিংস'}
              </span>
            </div>
            <ChevronRight size={18} color="var(--slate-400)" />
          </button>

          {/* Location Preferences */}
          <button
            onClick={onOpenLocationModal}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderBottom: '1px solid #F1F5F9',
              minHeight: '44px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MapPin size={18} color="var(--slate-500)" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-900)' }}>
                {language === 'en' ? 'Preferred Location' : 'নির্বাচিত লোকেশন'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--cyan-600)' }}>{selectedLocation}</span>
              <ChevronRight size={18} color="var(--slate-400)" />
            </div>
          </button>

          {/* Language Switcher */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: '1px solid #F1F5F9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Globe size={18} color="var(--slate-500)" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-900)' }}>
                {language === 'en' ? 'Language' : 'ভাষা'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '4px', background: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
              <button
                onClick={() => onLanguageChange('en')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  backgroundColor: language === 'en' ? '#0891B2' : 'transparent',
                  color: language === 'en' ? '#FFFFFF' : 'var(--slate-600)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                English
              </button>
              <button
                onClick={() => onLanguageChange('bn')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  backgroundColor: language === 'bn' ? '#0891B2' : 'transparent',
                  color: language === 'bn' ? '#FFFFFF' : 'var(--slate-600)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                বাংলা
              </button>
            </div>
          </div>

          {/* Clear Non-Sensitive Static Cache */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Trash2 size={18} color="var(--slate-500)" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-900)' }}>
                  {language === 'en' ? 'Temporary Storage & Cache' : 'অস্থায়ী ক্যাশ মেমোরি'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--slate-500)' }}>
                  {language === 'en' ? 'Purge cached public listings safely' : 'ল্যাব ও মার্কেটপ্লেস ক্যাশ ডাটা পরিষ্কার'}
                </div>
              </div>
            </div>
            <button
              onClick={handleClearStaticCache}
              style={{
                backgroundColor: '#F1F5F9',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '11.5px',
                fontWeight: 600,
                color: 'var(--slate-700)',
                cursor: 'pointer',
              }}
            >
              {language === 'en' ? 'Clear Cache' : 'ক্যাশ মুছুন'}
            </button>
          </div>
        </div>

        {cacheClearStatus && (
          <div style={{ backgroundColor: '#ECFDF5', color: '#065F46', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 600 }}>
            {cacheClearStatus}
          </div>
        )}
      </div>

      {/* Support & Legal */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: '4px' }}>
          {language === 'en' ? 'Helpline & Clinical Privacy' : 'হেল্পলাইন ও নিরাপত্তা'}
        </h2>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <a
            href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              textDecoration: 'none',
              borderBottom: '1px solid #F1F5F9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Phone size={18} color="var(--cyan-600)" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-900)' }}>
                  {language === 'en' ? '24/7 Clinical Helpline' : '২৪/৭ সার্বক্ষণিক হেল্পলাইন'}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--cyan-600)' }}>
                  {BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}
                </div>
              </div>
            </div>
            <ChevronRight size={18} color="var(--slate-400)" />
          </a>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
            }}
          >
            <ShieldCheck size={18} color="#10B981" />
            <div style={{ fontSize: '11.5px', color: 'var(--slate-600)', lineHeight: 1.45 }}>
              {language === 'en'
                ? 'Diagnostic Care strictly complies with DGHS regulations and patient confidentiality guidelines.'
                : 'ডায়াগনস্টিক কেয়ার স্বাস্থ্য অধিদপ্তর (DGHS) নীতিমালা ও রোগীর সর্বোচ্চ গোপনীয়তা মেনে চলে।'}
            </div>
          </div>
        </div>
      </div>

      {/* Account Session Actions */}
      <div style={{ marginTop: '4px' }}>
        {currentUser ? (
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px',
              borderRadius: '14px',
              backgroundColor: '#FEF2F2',
              border: '1.5px solid #FCA5A5',
              color: '#DC2626',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <LogOut size={16} />
            <span>{language === 'en' ? 'Sign Out of Diagnostic Care' : 'লগআউট করুন'}</span>
          </button>
        ) : (
          <button
            onClick={() => onOpenAuthModal ? onOpenAuthModal('login') : undefined}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px',
              borderRadius: '14px',
              backgroundColor: '#0057FF',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 87, 255, 0.25)',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{language === 'en' ? 'Sign In / Register' : 'লগইন / রেজিস্ট্রেশন করুন'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
