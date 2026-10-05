'use client';

import React, { useState, useEffect } from 'react';
import { BRAND_CONSTANTS } from '@/config/brand';
import { WifiOff, Download, X, PhoneCall } from 'lucide-react';

export default function PWAController() {
  const [isOffline, setIsOffline] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // 1. Service Worker Registration
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('Diagnostic Care PWA ServiceWorker registered with scope:', reg.scope);
          })
          .catch((err) => {
            console.warn('Diagnostic Care PWA ServiceWorker registration failed:', err);
          });
      });
    }

    // 2. Connectivity Listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    // 3. PWA Install Prompt Listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User installed Diagnostic Care PWA');
    }
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  return (
    <>
      {/* Offline Alert Banner */}
      {isOffline && (
        <div
          role="status"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: 700,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          }}
        >
          <WifiOff size={16} />
          <span>
            ইন্টারনেট সংযোগ বিচ্ছিন্ন! অফলাইন মোড সক্রিয় রয়েছে। জরুরি সহায়তায় কল করুন:
          </span>
          <a
            href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#DC2626',
              padding: '2px 8px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <PhoneCall size={12} />
            {BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}
          </a>
        </div>
      )}

      {/* PWA Mobile App Install Bar */}
      {showInstallBanner && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--brand-navy-900, #0B2545)',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            zIndex: 9999,
            maxWidth: '90%',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>📱</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800 }}>Diagnostic Care অ্যাপ ইনস্টল করুন</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>দ্রুত ও অফলাইনে প্রেসক্রিপশন ব্যবহারের সুবিধা</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleInstallClick}
              style={{
                backgroundColor: 'var(--brand-teal-500, #134074)',
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Download size={14} />
              ইনস্টল
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              aria-label="Close install banner"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
