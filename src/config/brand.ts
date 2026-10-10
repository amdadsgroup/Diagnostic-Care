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
  // Primary Glassmorphism Healthcare Palette (Extracted directly from Diagnostic Care Logo)
  primary: '#0060FA', // Primary Logo Signal Blue
  primaryHover: '#004ED1', // Deep Cobalt
  primaryActive: '#003FA8',
  primaryLight: '#EBF3FF', // Ice Blue Tint
  primaryFaint: 'rgba(0, 96, 250, 0.08)',
  primaryGlow: 'rgba(0, 96, 250, 0.22)',

  // Logo Deep Ink & Accents
  deepTeal: '#004ED1',
  deepNavy: '#090D14', // Primary Dark Slate / Ink from Logo
  freshMint: '#EBF3FF', // Ice Blue Tint
  secondaryBlue: '#E0F2FE',
  accentCerulean: '#00A3FF', // Subtle Gradient Shift
  healthcareTeal: '#0060FA',

  // Glassmorphism Surfaces & Canvas
  background: '#F8FAFC', // Soft Healthcare Canvas Background
  surface: 'rgba(255, 255, 255, 0.72)', // Translucent Glass Surface
  surfaceSubtle: 'rgba(255, 255, 255, 0.55)',
  surfaceElevated: 'rgba(255, 255, 255, 0.88)',
  glassSurface: 'rgba(255, 255, 255, 0.72)',
  glassBorder: 'rgba(255, 255, 255, 0.85)',
  glassCardShadow: '0 12px 32px -4px rgba(0, 96, 250, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03), inset 0 1px 1px 0 rgba(255, 255, 255, 0.95)',
  glassBtnPrimaryShadow: '0 8px 22px -2px rgba(0, 96, 250, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
  glassPillShadow: '0 4px 14px rgba(0, 96, 250, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.85)',

  // Typography & Neutrals (High Contrast WCAG AA)
  text: '#090D14', // Primary Text (Logo Ink)
  textDark: '#090D14', // Deep Heading
  textSecondary: '#475569', // Secondary Text (Slate)
  textMuted: '#64748B',
  textLight: '#94A3B8',

  // Glass Borders
  border: 'rgba(255, 255, 255, 0.85)',
  borderSubtle: 'rgba(255, 255, 255, 0.60)',
  borderStrong: 'rgba(0, 96, 250, 0.22)',
  borderBrand: 'rgba(0, 96, 250, 0.35)',

  // Fixed colors
  white: '#FFFFFF',
  black: '#090D14',

  // Semantic Medical Status Tokens (Strictly distinguishable from brand blue)
  success: '#10B981', // Clinical Emerald
  successBg: 'rgba(16, 185, 129, 0.12)',
  warning: '#F59E0B', // Amber Hold
  warningBg: 'rgba(245, 158, 11, 0.12)',
  danger: '#EF4444', // Red Critical
  dangerBg: 'rgba(239, 68, 68, 0.12)',
  error: '#EF4444',
  info: '#0060FA',
  infoBg: 'rgba(0, 96, 250, 0.10)',
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
