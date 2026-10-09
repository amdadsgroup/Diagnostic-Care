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
  // Primary brand color
  primary: '#1769F5', // Healthcare Primary Blue
  primaryHover: '#0F56D2',
  primaryActive: '#0B45AD',
  primaryLight: '#EAF2FF',
  primaryFaint: 'rgba(23, 105, 245, 0.08)',

  // Deep Navy & Secondary Accent
  deepNavy: '#10294F',
  secondaryBlue: '#EAF2FF',
  healthcareTeal: '#11B8A5',

  // Secondary & surfaces
  background: '#F7FAFE', // Soft clean healthcare canvas
  surface: '#FFFFFF', // Clean White
  surfaceSubtle: '#F0F5FD', // Soft subtle tint
  surfaceElevated: '#FFFFFF',

  // Typography & Neutrals
  text: '#14243D', // Primary Navy Text
  textDark: '#10294F', // Deep Navy
  textSecondary: '#64748B', // Neutral Slate 600
  textMuted: '#94A3B8', // Neutral Slate 400
  textLight: '#CBD5E1',

  // Contrast & borders
  border: '#E2EAF4', // Soft healthcare border
  borderSubtle: '#EDF3F9',
  borderStrong: '#CBD5E1',
  borderBrand: 'rgba(23, 105, 245, 0.25)',

  // Fixed colors
  white: '#FFFFFF',
  black: '#10294F',

  // Semantic Status Tokens (Clinically accurate & accessible)
  success: '#15976A',
  successBg: '#E8F8F1',
  warning: '#D99116',
  warningBg: '#FEF8EA',
  danger: '#DC4545',
  dangerBg: '#FDF2F2',
  info: '#1769F5',
  infoBg: '#EAF2FF',
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
