'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';
import { AlertCircle, RefreshCw, Home, Phone } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Diagnostic Care] Application Error caught by boundary:', error);

    // If chunk loading failed (e.g. new deployment deployed on Vercel), automatically reload once
    if (
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('ChunkLoadError') ||
      error?.name === 'ChunkLoadError'
    ) {
      const hasReloaded = sessionStorage.getItem('dc_chunk_reload');
      if (!hasReloaded) {
        sessionStorage.setItem('dc_chunk_reload', 'true');
        window.location.reload();
      }
    }
  }, [error]);

  const handleReload = () => {
    sessionStorage.removeItem('dc_chunk_reload');
    if (typeof window !== 'undefined') {
      window.location.reload();
    } else {
      reset();
    }
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        backgroundColor: 'var(--canvas-bg, #F8FAFC)',
        fontFamily: 'inherit',
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '520px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '36px 28px',
          boxShadow: '0 20px 50px rgba(0, 96, 250, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(0, 96, 250, 0.15)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(0, 96, 250, 0.12) 0%, rgba(6, 182, 212, 0.15) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: BRAND_COLORS.primary,
          }}
        >
          <AlertCircle size={32} />
        </div>

        <h1
          style={{
            fontSize: '22px',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '10px',
          }}
        >
          Something went wrong / সাময়িক সমস্যা হয়েছে
        </h1>

        <p
          style={{
            fontSize: '14px',
            color: '#64748B',
            lineHeight: 1.55,
            marginBottom: '24px',
          }}
        >
          A recent platform update or network interruption occurred. Please reload the page to load the latest verified healthcare view.
          <br />
          <span style={{ fontSize: '13px', color: '#94A3B8', marginTop: '6px', display: 'inline-block' }}>
            প্ল্যাটফর্মের নতুন আপডেট পেতে পৃষ্ঠাটি পুনরায় রিলোড করুন।
          </span>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          <button
            onClick={handleReload}
            className="btn-primary"
            style={{
              padding: '13px 20px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: BRAND_COLORS.primary,
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(0, 96, 250, 0.25)',
            }}
          >
            <RefreshCw size={16} />
            <span>Reload Page / রিলোড করুন</span>
          </button>

          <Link
            href="/"
            onClick={() => {
              sessionStorage.removeItem('dc_chunk_reload');
            }}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '13.5px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textDecoration: 'none',
              backgroundColor: '#F1F5F9',
              color: '#334155',
              border: '1px solid #E2E8F0',
            }}
          >
            <Home size={16} />
            <span>Back to Home / হোমে ফিরে যান</span>
          </Link>
        </div>

        <div
          style={{
            paddingTop: '18px',
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '12.5px',
            color: '#64748B',
          }}
        >
          <Phone size={13} color={BRAND_COLORS.primary} />
          <span>Need help? 24/7 Helpline: </span>
          <a
            href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
            style={{ color: BRAND_COLORS.primary, fontWeight: 700, textDecoration: 'none' }}
          >
            {BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}
          </a>
        </div>
      </div>
    </div>
  );
}
