/**
 * Diagnostic Care — Brand Constants & Application Settings
 * Centrally managed application configuration.
 * Never hardcode these values across UI components.
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
  DEFAULT_LANGUAGES: ['Bangla', 'English'] as const,
  CURRENCY_CODE: 'BDT',
  CURRENCY_SYMBOL: '৳',
  SUPPORT_HOURS: '24/7 Helpline',
  HQ_ADDRESS: 'Moulvibazar Sadar, Moulvibazar, Sylhet, Bangladesh',
  COPYRIGHT_YEAR: 2026,
} as const;

export type SupportedLanguage = 'en' | 'bn';
