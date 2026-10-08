import { TRANSLATIONS, TranslationKeys } from './translations';
import { SupportedLanguage } from '@/config/brand';

export * from './translations';

/**
 * Map of dot-notated keys (e.g. 'auth.login.title') to camelCase keys ('authLoginTitle')
 */
const DOT_KEY_MAP: Record<string, TranslationKeys> = {
  'auth.login.title': 'authLoginTitle',
  'auth.login.subtitle': 'authLoginSubtitle',
  'auth.login.badge': 'authLoginBadge',
  'auth.login.email': 'authLoginIdentifier',
  'auth.login.identifier': 'authLoginIdentifier',
  'auth.login.password': 'authLoginPassword',
  'auth.login.rememberMe': 'authLoginRememberMe',
  'auth.login.forgotPassword': 'authLoginForgotPassword',
  'auth.login.submit': 'authLoginSubmit',
  'auth.login.noAccount': 'authLoginNoAccount',
  'auth.login.createAccount': 'authLoginCreateAccount',
  'auth.login.success': 'authLoginSuccess',
  'auth.login.invalidCredentials': 'authLoginInvalidCredentials',
  'auth.login.accountSuspended': 'authLoginAccountSuspended',
  'auth.login.networkError': 'authLoginNetworkError',
  'auth.login.loading': 'authLoginLoading',

  'auth.register.title': 'authRegisterTitle',
  'auth.register.subtitle': 'authRegisterSubtitle',
  'auth.register.badge': 'authRegisterBadge',
  'auth.register.fullName': 'authRegisterFullName',
  'auth.register.mobile': 'authRegisterMobile',
  'auth.register.email': 'authRegisterEmail',
  'auth.register.age': 'authRegisterAge',
  'auth.register.gender': 'authRegisterGender',
  'auth.register.genderMale': 'authRegisterGenderMale',
  'auth.register.genderFemale': 'authRegisterGenderFemale',
  'auth.register.genderOther': 'authRegisterGenderOther',
  'auth.register.bloodGroup': 'authRegisterBloodGroup',
  'auth.register.password': 'authRegisterPassword',
  'auth.register.confirmPassword': 'authRegisterConfirmPassword',
  'auth.register.passwordRequirements': 'authRegisterPasswordHint',
  'auth.register.passwordMismatch': 'authRegisterPasswordMismatch',
  'auth.register.termsAgreement': 'authRegisterTermsAgreement',
  'auth.register.submit': 'authRegisterSubmit',
  'auth.register.alreadyHaveAccount': 'authRegisterAlreadyHaveAccount',
  'auth.register.loginLink': 'authRegisterLoginLink',
  'auth.register.success': 'authRegisterSuccess',
  'auth.register.duplicate': 'authRegisterDuplicate',
  'auth.register.loading': 'authRegisterLoading',

  'auth.forgot.title': 'authForgotTitle',
  'auth.forgot.subtitle': 'authForgotSubtitle',
  'auth.forgot.identifier': 'authForgotIdentifier',
  'auth.forgot.submit': 'authForgotSubmit',
  'auth.forgot.success': 'authForgotSuccess',
  'auth.forgot.backToLogin': 'authForgotBackToLogin',
  'auth.forgot.loading': 'authForgotLoading',

  'auth.reset.title': 'authResetTitle',
  'auth.reset.subtitle': 'authResetSubtitle',
  'auth.reset.newPassword': 'authResetNewPassword',
  'auth.reset.confirmPassword': 'authResetConfirmPassword',
  'auth.reset.submit': 'authResetSubmit',
  'auth.reset.success': 'authResetSuccess',
  'auth.reset.loading': 'authResetLoading',

  'common.continue': 'commonContinue',
  'common.cancel': 'commonCancel',
  'common.loading': 'commonLoading',
  'common.error': 'commonError',
  'common.success': 'commonSuccess',
  'common.language': 'commonLanguage',
  'common.back': 'commonBack',
  'common.logout': 'commonLogout',
  'common.showPassword': 'commonShowPassword',
  'common.hidePassword': 'commonHidePassword',
  'common.or': 'commonOr',
};

/**
 * Translate a key into the given language.
 * Supports camelCase key or dot-notation ('auth.login.title').
 */
export function translate(
  lang: SupportedLanguage,
  key: string,
  fallback?: string
): string {
  const dictionary = TRANSLATIONS[lang] || TRANSLATIONS.en;
  
  if (key in dictionary) {
    return (dictionary as any)[key];
  }

  const mappedKey = DOT_KEY_MAP[key];
  if (mappedKey && mappedKey in dictionary) {
    return dictionary[mappedKey];
  }

  return fallback || key;
}

/**
 * Convert numbers to Bengali digits if language is 'bn'
 */
export function formatLocalizedNumber(num: number | string, lang: SupportedLanguage): string {
  if (lang !== 'bn') return String(num);
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (w) => bengaliDigits[+w]);
}

/**
 * Format currency with BDT symbol localized
 */
export function formatLocalizedCurrency(amount: number, lang: SupportedLanguage): string {
  const formatted = formatLocalizedNumber(amount.toLocaleString('en-US'), lang);
  return lang === 'bn' ? `৳${formatted}` : `৳${amount.toLocaleString('en-US')}`;
}
