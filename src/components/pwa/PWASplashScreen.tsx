'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BRAND_LOGOS, BRAND_CONSTANTS, BRAND_COLORS } from '@/config/brand';

interface PWASplashScreenProps {
  duration?: number;
  onFinished?: () => void;
}

/**
 * Diagnostic Care — Official Minimal PWA Splash / Launch Screen
 * 
 * Centered Diagnostic Care symbol.
 * "Diagnostic Care"
 * "Your Healthcare Marketplace"
 * 
 * Palette:
 * Signal Blue: #0057FF
 * Porcelain: #F8F7F4
 * Black typography
 */
export const PWASplashScreen: React.FC<PWASplashScreenProps> = ({
  duration = 850,
  onFinished,
}) => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Only show on initial app load per session or when in standalone mode
    if (typeof window === 'undefined') return;

    const hasShown = sessionStorage.getItem('dc_splash_shown');
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    // In browser, only show on very first arrival of the session
    if (hasShown && !isStandalone) {
      setVisible(false);
      return;
    }

    sessionStorage.setItem('dc_splash_shown', 'true');

    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, duration);

    const removeTimer = setTimeout(() => {
      setVisible(false);
      onFinished?.();
    }, duration + 350);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onFinished]);

  if (!visible) return null;

  return (
    <div
      id="diagnostic-care-pwa-splash"
      role="status"
      aria-label="Diagnostic Care Loading"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: BRAND_COLORS.background, // Porcelain #F8F7F4
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? 'none' : 'auto',
        transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '24px',
          animation: 'splashScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Centered Diagnostic Care Symbol */}
        <div
          style={{
            width: '92px',
            height: '92px',
            position: 'relative',
            marginBottom: '20px',
            filter: 'drop-shadow(0 6px 16px rgba(0, 87, 255, 0.12))',
          }}
        >
          <Image
            src={BRAND_LOGOS.symbolTransparent}
            alt="Diagnostic Care Symbol"
            fill
            sizes="92px"
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        {/* Brand Name */}
        <div
          style={{
            fontSize: '26px',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: '#000000',
            marginBottom: '6px',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Diagnostic <span style={{ color: BRAND_COLORS.primary }}>Care</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#4B5563',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {BRAND_CONSTANTS.TAGLINE}
        </div>

        {/* Subtle, minimal brand pill indicator */}
        <div
          style={{
            marginTop: '32px',
            width: '36px',
            height: '3px',
            borderRadius: '2px',
            background: 'rgba(0, 87, 255, 0.25)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '60%',
              background: BRAND_COLORS.primary,
              borderRadius: '2px',
              animation: 'splashBar 1.2s infinite ease-in-out',
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes splashScale {
          0% {
            opacity: 0.7;
            transform: scale(0.96);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes splashBar {
          0% {
            left: -60%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default PWASplashScreen;
