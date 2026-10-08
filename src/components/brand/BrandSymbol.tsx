'use client';

import React from 'react';
import Image from 'next/image';
import { BRAND_LOGOS } from '@/config/brand';

interface BrandSymbolProps {
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark' | 'monochrome';
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  altText?: string;
}

const SIZES = {
  xs: 20,
  sm: 28,
  md: 40,
  lg: 56,
  xl: 72,
};

/**
 * Diagnostic Care Official Brand Symbol
 * Blue D-shaped healthcare symbol with medical cross, location pin, and connected orbit.
 */
export const BrandSymbol: React.FC<BrandSymbolProps> = ({
  size = 'md',
  theme = 'light',
  className = '',
  style = {},
  priority = false,
  altText = 'Diagnostic Care Symbol',
}) => {
  const pixelSize = typeof size === 'number' ? size : SIZES[size] || 40;

  let src: string = BRAND_LOGOS.symbolTransparent;
  if (theme === 'dark') {
    src = BRAND_LOGOS.symbolMonoWhite;
  } else if (theme === 'monochrome') {
    src = BRAND_LOGOS.symbolMonoBlack;
  }

  return (
    <div
      className={`brand-symbol ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
        flexShrink: 0,
        position: 'relative',
        ...style,
      }}
    >
      <Image
        src={src}
        alt={altText}
        width={pixelSize}
        height={pixelSize}
        priority={priority}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );
};

export default BrandSymbol;
