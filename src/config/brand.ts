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
  COMPANY_EMAIL: 'diagonosticcare@gmail.com',
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
  // Primary Glassmorphism Healthcare Palette
  primary: '#0F766E', // Primary Healthcare Teal
  primaryHover: '#115E59', // Deep Teal
  primaryActive: '#0B4E4A',
  primaryLight: '#DDF7F0', // Fresh Mint
  primaryFaint: 'rgba(15, 118, 110, 0.08)',

  // Deep Teal & Accents
  deepTeal: '#115E59',
  deepNavy: '#15313B', // Primary Dark Slate
  freshMint: '#DDF7F0', // Fresh Mint
  secondaryBlue: '#E0F2FE',
  healthcareTeal: '#0F766E',

  // Glassmorphism Surfaces & Canvas
  background: '#F4F8FA', // Soft Healthcare Canvas Background
  surface: 'rgba(255, 255, 255, 0.68)', // Translucent Glass Surface
  surfaceSubtle: 'rgba(255, 255, 255, 0.52)',
  surfaceElevated: 'rgba(255, 255, 255, 0.85)',
  glassSurface: 'rgba(255, 255, 255, 0.68)',
  glassBorder: 'rgba(255, 255, 255, 0.78)',
  glassCardShadow: '0 10px 30px -4px rgba(15, 118, 110, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03), inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)',
  glassBtnPrimaryShadow: '0 8px 20px -2px rgba(15, 118, 110, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
  glassPillShadow: '0 4px 12px rgba(15, 118, 110, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.8)',

  // Typography & Neutrals (High Contrast WCAG AA)
  text: '#15313B', // Primary Text
  textDark: '#15313B', // Deep Heading
  textSecondary: '#627680', // Secondary Text
  textMuted: '#8FA0AA',
  textLight: '#CBD5E1',

  // Glass Borders
  border: 'rgba(255, 255, 255, 0.78)',
  borderSubtle: 'rgba(255, 255, 255, 0.55)',
  borderStrong: 'rgba(15, 118, 110, 0.22)',
  borderBrand: 'rgba(15, 118, 110, 0.35)',

  // Fixed colors
  white: '#FFFFFF',
  black: '#15313B',

  // Semantic Status Tokens
  success: '#15803D',
  successBg: 'rgba(21, 128, 61, 0.12)',
  warning: '#B45309',
  warningBg: 'rgba(180, 83, 9, 0.12)',
  danger: '#B91C1C',
  dangerBg: 'rgba(185, 28, 28, 0.12)',
  error: '#B91C1C',
  info: '#0F766E',
  infoBg: 'rgba(15, 118, 110, 0.1)',
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
  themeColor: '#1769F5', // Healthcare Primary Blue
  backgroundColor: '#EBF2F9', // Tactile Porcelain Clay Canvas
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
