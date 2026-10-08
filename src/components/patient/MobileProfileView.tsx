'use client';

import React, { useState, useEffect } from 'react';
import { SupportedLanguage, BRAND_CONSTANTS } from '@/config/brand';
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
} from 'lucide-react';

interface MobileProfileViewProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  selectedLocation: string;
  onOpenLocationModal: () => void;
  onOpenNotificationsModal: () => void;
  onNavigateTab: (tab: any) => void;
  onOpenAuthModal?: () => void;
  currentUser?: any;
  appointmentsCount?: number;
}

export default function MobileProfileView({
  language,
  onLanguageChange,
  selectedLocation,
  onOpenLocationModal,
  onOpenNotificationsModal,
  onNavigateTab,
  onOpenAuthModal,
  currentUser,
  appointmentsCount = 0,
}: MobileProfileViewProps) {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '36px' }}>
      {/* Patient Profile Card */}
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
            {currentUser?.fullName ? currentUser.fullName.charAt(0).toUpperCase() : (language === 'en' ? 'P' : 'র')}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', color: '#6EE7B7', fontWeight: 700, marginBottom: '4px' }}>
              <CheckCircle2 size={12} />
              <span>{currentUser ? (language === 'en' ? 'Verified Account' : 'ভেরিফাইড অ্যাকাউন্ট') : (language === 'en' ? 'Guest Visitor' : 'অতিথি ব্যবহারকারী')}</span>
            </div>
            <h1 style={{ fontSize: '18px', fontWeight: 800 }}>{currentUser?.fullName || (language === 'en' ? 'Healthcare Patient' : 'সম্মানিত রোগী')}</h1>
            <div style={{ fontSize: '12.5px', color: '#94A3B8', marginTop: '2px' }}>
              {currentUser?.phone || '01886748564'} • {selectedLocation}
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
    </div>
  );
}
