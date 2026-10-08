'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BRAND_CONSTANTS, BRAND_COLORS } from '@/config/brand';
import PWASplashScreen from './PWASplashScreen';
import { BrandSymbol } from '@/components/brand/BrandSymbol';
import {
  WifiOff,
  Wifi,
  Download,
  X,
  PhoneCall,
  RefreshCw,
  Bell,
  Sparkles,
  CheckCircle2,
  Smartphone,
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAController() {
  const [isOffline, setIsOffline] = useState(false);
  const [justCameOnline, setJustCameOnline] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  // Detect language from localStorage or document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('dc_lang') as 'en' | 'bn' | null;
      if (savedLang) setLang(savedLang);

      const observer = new MutationObserver(() => {
        const l = localStorage.getItem('dc_lang') as 'en' | 'bn' | null;
        if (l && l !== lang) setLang(l);
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
      return () => observer.disconnect();
    }
  }, [lang]);

  // 1. Detection of Standalone Mode & Platform
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkStandalone = () => {
      const isWindowStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isNavigatorStandalone = (window.navigator as any).standalone === true;
      const isTwa = document.referrer.includes('android-app://');
      const standalone = isWindowStandalone || isNavigatorStandalone || isTwa;
      setIsStandalone(standalone);

      if (standalone) {
        document.documentElement.classList.add('pwa-standalone');
      }
    };

    checkStandalone();
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = () => checkStandalone();
    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  // 2. Service Worker Registration & Update Detection
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        console.log('[Diagnostic Care PWA] Service Worker registered with scope:', reg.scope);

        // Check if there is an existing waiting worker
        if (reg.waiting) {
          setWaitingWorker(reg.waiting);
          setUpdateAvailable(true);
        }

        // Listen for new workers being installed
        reg.addEventListener('updatefound', () => {
          const installingWorker = reg.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New update available
                console.log('[Diagnostic Care PWA] New update installed and waiting');
                setWaitingWorker(installingWorker);
                setUpdateAvailable(true);
              } else {
                console.log('[Diagnostic Care PWA] Content is cached for offline use.');
              }
            }
          });
        });
      } catch (err) {
        console.warn('[Diagnostic Care PWA] Service Worker registration failed:', err);
      }
    };

    // Listen for controllerchange so the app reloads cleanly after SKIP_WAITING
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });

    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW);
      return () => window.removeEventListener('load', registerSW);
    }
  }, []);

  // 3. Online / Offline Connectivity Detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOffline(!navigator.onLine);

    const handleOnline = () => {
      setIsOffline(false);
      setJustCameOnline(true);
      const timer = setTimeout(() => {
        setJustCameOnline(false);
      }, 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setJustCameOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 4. Intelligent PWA Installation Prompt Management
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);

      // Check dismissal timestamp: do not nag repeatedly (wait at least 5 days unless triggered manually)
      const lastDismissed = localStorage.getItem('dc_pwa_prompt_dismissed');
      const fiveDaysMs = 5 * 24 * 60 * 60 * 1000;
      const now = Date.now();

      if (!isStandalone && (!lastDismissed || now - parseInt(lastDismissed, 10) > fiveDaysMs)) {
        // Small delay so page renders first
        const timer = setTimeout(() => {
          setShowInstallPrompt(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    };

    const handleAppInstalled = () => {
      console.log('[Diagnostic Care PWA] Application installed by user');
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
      localStorage.setItem('dc_pwa_installed', 'true');
    };

    // Custom event listener so Settings/Profile can trigger the install prompt on demand
    const handleManualInstallRequest = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(({ outcome }) => {
          if (outcome === 'accepted') {
            setShowInstallPrompt(false);
            setDeferredPrompt(null);
          }
        });
      } else {
        setShowInstallGuide(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('dc-request-install' as any, handleManualInstallRequest);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('dc-request-install' as any, handleManualInstallRequest);
    };
  }, [deferredPrompt, isStandalone, lang]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('[Diagnostic Care PWA] User accepted PWA install prompt');
    }
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('dc_pwa_prompt_dismissed', Date.now().toString());
  };

  const handleApplyUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      {/* 0. Minimal Branded Launch Experience */}
      <PWASplashScreen />

      {/* 1. Offline Alert Banner */}
      {isOffline && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            paddingTop: 'max(10px, env(safe-area-inset-top))',
            paddingBottom: '10px',
            paddingLeft: '16px',
            paddingRight: '16px',
            fontSize: '13px',
            fontWeight: 700,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
            borderBottom: '2px solid #F59E0B',
            animation: 'fadeIn 0.25s ease-out',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-flex', padding: '4px', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '50%' }}>
              <WifiOff size={16} color="#FBBF24" />
            </span>
            <span>
              {lang === 'en'
                ? "You're offline. Saved preferences & chamber listings remain accessible."
                : 'আপনি অফলাইনে আছেন। সংরক্ষিত তথ্য ও তালিকা ব্যবহার করা যাবে।'}
            </span>
          </div>

          <a
            href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
            style={{
              backgroundColor: '#F59E0B',
              color: '#0F172A',
              padding: '4px 10px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              whiteSpace: 'nowrap',
            }}
          >
            <PhoneCall size={12} />
            <span>{BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}</span>
          </a>
        </div>
      )}

      {/* 2. Online Recovery Toast */}
      {justCameOnline && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: 'max(14px, env(safe-area-inset-top))',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#065F46',
            color: '#FFFFFF',
            padding: '10px 20px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 700,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 8px 24px rgba(6, 95, 70, 0.35)',
            border: '1px solid #10B981',
            animation: 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <Wifi size={16} color="#34D399" />
          <span>
            {lang === 'en'
              ? 'Back online — Syncing your data... Everything is up to date.'
              : 'ইন্টারনেট সংযোগ পুনরুদ্ধার হয়েছে — তথ্য সিঙ্ক সম্পন্ন।'}
          </span>
        </div>
      )}

      {/* 3. Service Worker Safe Update Notice */}
      {updateAvailable && (
        <div
          role="alert"
          style={{
            position: 'fixed',
            bottom: 'max(84px, calc(env(safe-area-inset-bottom) + 80px))',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#0A1628',
            color: '#FFFFFF',
            padding: '14px 20px',
            borderRadius: '16px',
            boxShadow: '0 12px 36px rgba(10, 22, 40, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            zIndex: 9990,
            maxWidth: '92%',
            width: '460px',
            border: '1px solid rgba(6, 182, 212, 0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <RefreshCw size={20} color="#22D3EE" className="spin-slow" />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800 }}>
                {lang === 'en' ? 'Update Available' : 'নতুন সংস্করণ উপলভ্য'}
              </div>
              <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>
                {lang === 'en'
                  ? 'A new version of Diagnostic Care is ready.'
                  : 'ডায়াগনস্টিক কেয়ারের উন্নত সংস্করণ প্রস্তুত রয়েছে।'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleApplyUpdate}
              style={{
                backgroundColor: BRAND_COLORS.primary,
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {lang === 'en' ? 'Update Now' : 'আপডেট করুন'}
            </button>
            <button
              onClick={() => setUpdateAvailable(false)}
              aria-label="Dismiss update"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                padding: '6px',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 4. Intelligent PWA Installation Sheet */}
      {showInstallPrompt && !isStandalone && (
        <div
          role="dialog"
          aria-label="Install App"
          style={{
            position: 'fixed',
            bottom: 'max(20px, env(safe-area-inset-bottom))',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#0A1628',
            color: '#FFFFFF',
            padding: '16px 20px',
            borderRadius: '18px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            zIndex: 9995,
            maxWidth: '94%',
            width: '540px',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: BRAND_COLORS.background,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              <BrandSymbol size={36} altText="Diagnostic Care" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{lang === 'en' ? 'Install Diagnostic Care' : 'ডায়াগনস্টিক কেয়ার অ্যাপ ইনস্টল করুন'}</span>
                <span
                  style={{
                    background: 'rgba(0, 87, 255, 0.25)',
                    color: '#60A5FA',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '4px',
                  }}
                >
                  PWA
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px', lineHeight: 1.4 }}>
                {lang === 'en'
                  ? 'Get faster access to doctors, diagnostic tests, hospitals and your health records.'
                  : 'ডাক্তার, ডায়াগনস্টিক টেস্ট ও ডিজিটাল প্রেসক্রিপশনে দ্রুত ও অফলাইন অ্যাক্সেস পান।'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={handleInstallClick}
              style={{
                backgroundColor: BRAND_COLORS.primary,
                color: '#FFFFFF',
                border: 'none',
                padding: '9px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(0, 87, 255, 0.4)',
              }}
            >
              <Download size={15} />
              <span>{lang === 'en' ? 'Install App' : 'ইনস্টল'}</span>
            </button>

            <button
              onClick={handleDismissInstall}
              aria-label="Not Now"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#CBD5E1',
                border: 'none',
                padding: '9px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {lang === 'en' ? 'Not Now' : 'পরে'}
            </button>
          </div>
        </div>
      )}
      {/* 4. Manual Installation Guide Modal */}
      {showInstallGuide && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 22, 40, 0.7)',
            backdropFilter: 'blur(6px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowInstallGuide(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '460px',
              width: '100%',
              padding: '26px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0A1628', margin: 0 }}>
                {lang === 'en' ? 'Install Diagnostic Care' : 'ডায়াগনস্টিক কেয়ার অ্যাপ ইনস্টল'}
              </h3>
              <button
                onClick={() => setShowInstallGuide(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              {lang === 'en'
                ? 'To install on iOS or Android directly from your browser:'
                : 'আপনার ফোনে অ্যাপ হিসেবে সরাসরি ইনস্টল করতে:'}
            </p>
            <ol style={{ fontSize: '13px', color: '#1E293B', lineHeight: 1.7, paddingLeft: '20px', margin: 0 }}>
              <li>
                {lang === 'en'
                  ? 'Tap the Share / Menu button (or 3 dots in Chrome)'
                  : 'ব্রাউজারের শেয়ার (Share) বা থ্রি-ডট মেনু বাটনে চাপুন'}
              </li>
              <li>
                {lang === 'en'
                  ? 'Select "Add to Home Screen" or "Install App"'
                  : '"Add to Home Screen" বা "Install App" অপশনটি সিলেক্ট করুন'}
              </li>
              <li>
                {lang === 'en'
                  ? 'Launch Diagnostic Care directly from your home screen anytime.'
                  : 'এখন থেকে এক ক্লিকেই হোম স্ক্রিন থেকে ডায়াগনস্টিক কেয়ার ব্যবহার করুন।'}
              </li>
            </ol>
            <button
              onClick={() => setShowInstallGuide(false)}
              style={{
                backgroundColor: '#0057FF',
                color: '#FFFFFF',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                marginTop: '6px',
              }}
            >
              {lang === 'en' ? 'Got It' : 'ঠিক আছে'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
