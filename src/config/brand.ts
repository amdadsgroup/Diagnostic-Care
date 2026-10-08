/**
 * Diagnostic Care — Official Brand Identity & Configuration
 * Centralized design tokens, assets, typography, and metadata.
 * 
 * Brand Name: Diagnostic Care
 * Tagline: Your Healthcare Marketplace
 * Primary Brand Color: Signal Blue #0057FF
 * Secondary Background: Porcelain #F8F7F4
 * Text: Black / Near-Black #000000
 * White: #FFFFFF
 */

export const BRAND_CONSTANTS = {
  BRAND_NAME: 'Diagnostic Care',
  TAGLINE: 'Your Healthcare Marketplace',
  CUSTOMER_CARE_PHONE: '01886748564',
  CUSTOMER_CARE_DISPLAY: '01886-748564',
  COUNTRY: 'Bangladesh',
  INITIAL_LAUNCH_LOCATION: 'Moulvibazar',
  INITIAL_LAUNCH_DISTRICT: 'Moulvibazar',
  INITIAL_LAUNCH_DIVISION: 'Sylhet',
  DEFAULT_LANGUAGES: ['English', 'Bangla'] as const,
  DEFAULT_LANGUAGE: 'en' as const,
  CURRENCY_CODE: 'BDT',
  CURRENCY_SYMBOL: '৳',
  SUPPORT_HOURS: '24/7 Helpline',
  HQ_ADDRESS: 'Moulvibazar Sadar, Moulvibazar, Sylhet, Bangladesh',
  COPYRIGHT_YEAR: 2026,
} as const;

export const BRAND_COLORS = {
  // Primary brand color
  primary: '#0057FF', // Signal Blue
  primaryHover: '#0047D4',
  primaryActive: '#003BB0',
  primaryLight: '#EBF1FF',
  primaryFaint: 'rgba(0, 87, 255, 0.06)',

  // Secondary & surfaces
  background: '#F8F7F4', // Porcelain
  surface: '#FFFFFF', // White
  surfaceSubtle: '#F1EFEA', // Deeper porcelain for muted areas
  surfaceElevated: '#FFFFFF',

  // Typography & Neutrals
  text: '#000000', // Black
  textDark: '#0F172A', // Slate 900
  textSecondary: '#4B5563', // Slate 600
  textMuted: '#6B7280', // Slate 500
  textLight: '#9CA3AF',

  // Contrast & borders
  border: '#E5E7EB', // Neutral light border
  borderSubtle: '#F3F4F6',
  borderStrong: '#CBD5E1',
  borderBrand: 'rgba(0, 87, 255, 0.25)',

  // Fixed colors
  white: '#FFFFFF',
  black: '#000000',

  // Semantic Status Tokens (Clinically accurate & accessible)
  success: '#10B981',
  successBg: '#ECFDF5',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  info: '#0057FF',
  infoBg: '#EBF1FF',
} as const;

export const BRAND_LOGOS = {
  // Official Logo Variants
  full: '/brand/logo-full.png',
  fullTransparent: '/brand/logo-full-transparent.png',
  horizontal: '/brand/logo-horizontal.png',
  horizontalTransparent: '/brand/logo-horizontal-transparent.png',
  symbol: '/brand/logo-symbol.png',
  symbolTransparent: '/brand/logo-symbol-transparent.png',
  monochromeBlack: '/brand/logo-monochrome-black.png',
  monochromeWhite: '/brand/logo-monochrome-white.png',
  symbolMonoBlack: '/brand/symbol-monochrome-black.png',
  symbolMonoWhite: '/brand/symbol-monochrome-white.png',

  // Open Graph Social Preview
  ogImage: '/brand/og-image.png',
} as const;

export const BRAND_FAVICONS = {
  ico: '/favicon.ico',
  s16: '/icons/favicon-16x16.png',
  s32: '/icons/favicon-32x32.png',
  s48: '/icons/favicon-48x48.png',
  s64: '/icons/favicon-64x64.png',
  apple: '/icons/apple-touch-icon.png',
} as const;

export const BRAND_PWA = {
  name: 'Diagnostic Care',
  shortName: 'Diagnostic Care',
  description: 'Your Healthcare Marketplace',
  themeColor: '#0057FF', // Signal Blue
  backgroundColor: '#F8F7F4', // Porcelain
  icon192: '/icons/icon-192x192.png',
  icon512: '/icons/icon-512x512.png',
  maskable512: '/icons/maskable-icon-512x512.png',
} as const;

export const BRAND_TYPOGRAPHY = {
  fontSans: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontBangla: "'Hind Siliguri', 'Plus Jakarta Sans', sans-serif",
  fontMono: "'JetBrains Mono', monospace",
} as const;

export const BRAND = {
  name: BRAND_CONSTANTS.BRAND_NAME,
  tagline: BRAND_CONSTANTS.TAGLINE,
  helpline: BRAND_CONSTANTS.CUSTOMER_CARE_PHONE,
  displayPhone: BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY,
  colors: BRAND_COLORS,
  logos: BRAND_LOGOS,
  favicons: BRAND_FAVICONS,
  pwa: BRAND_PWA,
  typography: BRAND_TYPOGRAPHY,
  ...BRAND_CONSTANTS,
};

export type SupportedLanguage = 'en' | 'bn';
