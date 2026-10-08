'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import { translate as i18nTranslate, formatLocalizedNumber, formatLocalizedCurrency } from '@/i18n';
import { AuthService } from '@/services/auth.service';

export type TranslationDictionary = { [K in keyof typeof TRANSLATIONS.en]: string };

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleLanguage: () => void;
  t: TranslationDictionary;
  translate: (key: string, fallback?: string) => string;
  formatNumber: (num: number | string) => string;
  formatCurrency: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // English is unconditionally the default language for new visitors
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Restore language preference from localStorage if set
    const saved = localStorage.getItem('dc_lang') as SupportedLanguage | null;
    if (saved === 'en' || saved === 'bn') {
      setLanguageState(saved);
      document.documentElement.lang = saved;
    } else {
      // Default to English
      setLanguageState('en');
      document.documentElement.lang = 'en';
    }

    // Check if authenticated user has a saved language preference in database
    AuthService.getCurrentUser().then((user) => {
      if (user && user.languagePreference && (user.languagePreference === 'en' || user.languagePreference === 'bn')) {
        setLanguageState(user.languagePreference);
        localStorage.setItem('dc_lang', user.languagePreference);
        document.documentElement.lang = user.languagePreference;
      }
    });
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dc_lang', lang);
      document.documentElement.lang = lang;
    }

    // If user is authenticated, persist to profile in database
    AuthService.getCurrentUser().then((user) => {
      if (user) {
        AuthService.updateLanguagePreference(user.id, lang);
      }
    });
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'bn' : 'en';
    setLanguage(nextLang);
  };

  const t = (TRANSLATIONS[language] || TRANSLATIONS.en) as unknown as TranslationDictionary;

  const translate = (key: string, fallback?: string) => {
    return i18nTranslate(language, key, fallback);
  };

  const formatNumber = (num: number | string) => {
    return formatLocalizedNumber(num, language);
  };

  const formatCurrency = (amount: number) => {
    return formatLocalizedCurrency(amount, language);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        translate,
        formatNumber,
        formatCurrency,
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
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: TRANSLATIONS.en as unknown as TranslationDictionary,
      translate: (key, fallback) => i18nTranslate('en', key, fallback),
      formatNumber: (n) => String(n),
      formatCurrency: (a) => `৳${a}`,
    };
  }
  return context;
}
