'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { SupportedLanguage } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import {
  translate as i18nTranslate,
  formatLocalizedNumber,
  formatLocalizedCurrency,
  formatLocalizedDate,
  formatLocalizedTime,
} from '@/i18n';
import { AuthService } from '@/services/auth.service';

export type TranslationDictionary = { [K in keyof typeof TRANSLATIONS.en]: string };

export interface LanguageContextType {
  language: SupportedLanguage;
  isLoaded: boolean;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleLanguage: () => void;
  t: TranslationDictionary;
  translate: (key: string, fallback?: string, params?: Record<string, string | number>) => string;
  formatNumber: (num: number | string) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getInitialLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem('dc_lang') as SupportedLanguage | null;
    if (saved === 'en' || saved === 'bn') return saved;

    // Check cookie fallback
    const match = document.cookie.match(/(?:^|; )dc_lang=([^;]*)/);
    if (match && (match[1] === 'en' || match[1] === 'bn')) {
      return match[1] as SupportedLanguage;
    }
  } catch {
    // ignore
  }
  return 'en';
}

function persistLanguagePreference(lang: SupportedLanguage) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('dc_lang', lang);
    document.cookie = `dc_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
  } catch {
    // ignore
  }
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initialLang = getInitialLanguage();
    setLanguageState(initialLang);
    persistLanguagePreference(initialLang);
    setIsLoaded(true);

    // Sync across browser tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dc_lang' && (e.newValue === 'en' || e.newValue === 'bn')) {
        setLanguageState(e.newValue);
        document.documentElement.lang = e.newValue;
        document.documentElement.setAttribute('data-lang', e.newValue);
      }
    };

    // Listen to custom intra-window event
    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ language: SupportedLanguage }>;
      const nextLang = customEvent.detail?.language;
      if (nextLang === 'en' || nextLang === 'bn') {
        setLanguageState((curr) => (curr !== nextLang ? nextLang : curr));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dc-language-changed', handleCustomChange);

    // If authenticated user has a saved language preference in database, apply it
    AuthService.getCurrentUser().then((user) => {
      if (user && user.languagePreference && (user.languagePreference === 'en' || user.languagePreference === 'bn')) {
        setLanguageState(user.languagePreference);
        persistLanguagePreference(user.languagePreference);
      }
    }).catch(() => {
      // ignore
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dc-language-changed', handleCustomChange);
    };
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    persistLanguagePreference(lang);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('dc-language-changed', { detail: { language: lang } })
      );
    }

    // If user is authenticated, persist to profile in database
    AuthService.getCurrentUser().then((user) => {
      if (user) {
        AuthService.updateLanguagePreference(user.id, lang).catch(() => {});
      }
    }).catch(() => {});
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next = prev === 'en' ? 'bn' : 'en';
      persistLanguagePreference(next);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('dc-language-changed', { detail: { language: next } })
        );
      }
      return next;
    });
  }, []);

  const t = (TRANSLATIONS[language] || TRANSLATIONS.en) as unknown as TranslationDictionary;

  const translate = useCallback(
    (key: string, fallback?: string, params?: Record<string, string | number>) => {
      return i18nTranslate(language, key, fallback, params);
    },
    [language]
  );

  const formatNumber = useCallback(
    (num: number | string) => {
      return formatLocalizedNumber(num, language);
    },
    [language]
  );

  const formatCurrency = useCallback(
    (amount: number) => {
      return formatLocalizedCurrency(amount, language);
    },
    [language]
  );

  const formatDate = useCallback(
    (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
      return formatLocalizedDate(date, language, options);
    },
    [language]
  );

  const formatTime = useCallback(
    (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
      return formatLocalizedTime(date, language, options);
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        isLoaded,
        setLanguage,
        toggleLanguage,
        t,
        translate,
        formatNumber,
        formatCurrency,
        formatDate,
        formatTime,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback for components outside LanguageProvider
    return {
      language: 'en',
      isLoaded: true,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: TRANSLATIONS.en as unknown as TranslationDictionary,
      translate: (key, fallback, params) => i18nTranslate('en', key, fallback, params),
      formatNumber: (n) => String(n),
      formatCurrency: (a) => `৳${Number.isFinite(a) ? a.toLocaleString('en-US') : 0}`,
      formatDate: (d, options) => formatLocalizedDate(d, 'en', options),
      formatTime: (d, options) => formatLocalizedTime(d, 'en', options),
    };
  }
  return context;
}
