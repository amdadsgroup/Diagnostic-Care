'use client';

import React from 'react';
import Image from 'next/image';
import { BRAND_LOGOS } from '@/config/brand';

export type LogoVariant = 'full' | 'horizontal' | 'symbol' | 'monochrome';
export type LogoTheme = 'light' | 'dark';
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

interface BrandLogoProps {
  variant?: LogoVariant;
  theme?: LogoTheme;
  size?: LogoSize;
  responsive?: boolean; // When true: horizontal on desktop, symbol on mobile
  showTagline?: boolean;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  altText?: string;
}

const SIZE_CONFIGS = {
  xs: { height: 24, symHeight: 24, fontSize: '13px' },
  sm: { height: 32, symHeight: 32, fontSize: '16px' },
  md: { height: 42, symHeight: 42, fontSize: '20px' },
  lg: { height: 56, symHeight: 56, fontSize: '26px' },
  xl: { height: 72, symHeight: 72, fontSize: '32px' },
};

/**
 * Diagnostic Care Official Brand Logo
 * 
 * Variants:
 * 1. full: Logo symbol + “Diagnostic Care” + tagline
 * 2. horizontal: Logo symbol + “Diagnostic Care” (no tagline)
 * 3. symbol: Symbol only
 * 4. monochrome: Black or white high-contrast version
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  theme = 'light',
  size = 'md',
  responsive = false,
  showTagline = false,
  priority = false,
  className = '',
  style = {},
  onClick,
  altText = 'Diagnostic Care',
}) => {
  const isDark = theme === 'dark';

  // Compute dimensions
  const numSize = typeof size === 'number' ? size : SIZE_CONFIGS[size]?.height || 42;
  const symSize = typeof size === 'number' ? size : SIZE_CONFIGS[size]?.symHeight || 42;

  // Resolve image source based on variant & theme
  let src: string = BRAND_LOGOS.horizontalTransparent;
  let width = Math.round(numSize * 4.2);
  let height = numSize;

  if (variant === 'symbol') {
    src = isDark ? BRAND_LOGOS.symbolMonoWhite : BRAND_LOGOS.symbolTransparent;
    width = symSize;
    height = symSize;
  } else if (variant === 'full' || showTagline) {
    src = isDark ? BRAND_LOGOS.monochromeWhite : BRAND_LOGOS.fullTransparent;
    width = Math.round(numSize * 2.2);
    height = Math.round(numSize * 1.7);
  } else if (variant === 'monochrome') {
    src = isDark ? BRAND_LOGOS.monochromeWhite : BRAND_LOGOS.monochromeBlack;
    width = Math.round(numSize * 4.2);
    height = numSize;
  } else {
    // horizontal
    src = isDark ? BRAND_LOGOS.monochromeWhite : BRAND_LOGOS.horizontalTransparent;
    width = Math.round(numSize * 4.2);
    height = numSize;
  }

  // If responsive, render desktop horizontal & mobile symbol
  if (responsive) {
    return (
      <div
        className={`brand-logo-responsive ${className}`}
        onClick={onClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          cursor: onClick ? 'pointer' : 'default',
          userSelect: 'none',
          ...style,
        }}
      >
        {/* Desktop / Tablet view: Horizontal logo */}
        <div className="d-mobile-none" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Image
            src={isDark ? BRAND_LOGOS.monochromeWhite : BRAND_LOGOS.horizontalTransparent}
            alt={altText}
            width={width}
            height={height}
            priority={priority}
            style={{
              height: `${height}px`,
              width: 'auto',
              maxWidth: '100%',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>

        {/* Mobile view: Symbol only */}
        <div className="d-mobile-flex" style={{ position: 'relative', display: 'none', alignItems: 'center' }}>
          <Image
            src={isDark ? BRAND_LOGOS.symbolMonoWhite : BRAND_LOGOS.symbolTransparent}
            alt={altText}
            width={symSize}
            height={symSize}
            priority={priority}
            style={{
              height: `${symSize}px`,
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`brand-logo ${className}`}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        lineHeight: 1,
        ...style,
      }}
    >
      <Image
        src={src}
        alt={altText}
        width={width}
        height={height}
        priority={priority}
        style={{
          height: `${height}px`,
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );
};

export default BrandLogo;
