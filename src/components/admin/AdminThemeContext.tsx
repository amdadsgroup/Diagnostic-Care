'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BRAND_COLORS } from '@/config/brand';

export type AdminThemeMode = 'light' | 'dark';

export interface AdminThemeTokens {
  mode: AdminThemeMode;
  bg: string;
  bgCanvas: string;
  ambientGlow: string;
  sidebarBg: string;
  sidebarBorder: string;
  topNavBg: string;
  topNavBorder: string;
  cardBg: string;
  cardBgSubtle: string;
  cardBgElevated: string;
  cardBorder: string;
  cardBorderSubtle: string;
  cardShadow: string;
  cardShadowHover: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  tableHeaderBg: string;
  tableRowHover: string;
  tableBorder: string;
  inputBg: string;
  inputBorder: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  backdropBlur: string;
}

export const ADMIN_THEME_TOKENS: Record<AdminThemeMode, AdminThemeTokens> = {
  light: {
    mode: 'light',
    bg: '#F8FAFC',
    bgCanvas: '#F8FAFC',
    ambientGlow:
      'radial-gradient(circle at 15% 10%, rgba(0, 96, 250, 0.05) 0%, transparent 45%), radial-gradient(circle at 85% 90%, rgba(0, 163, 255, 0.04) 0%, transparent 45%)',
    sidebarBg: '#0B132B',
    sidebarBorder: 'rgba(255, 255, 255, 0.08)',
    topNavBg: 'rgba(255, 255, 255, 0.85)',
    topNavBorder: '#E2E8F0',
    cardBg: 'rgba(255, 255, 255, 0.82)',
    cardBgSubtle: '#F8FAFC',
    cardBgElevated: '#FFFFFF',
    cardBorder: '#E2E8F0',
    cardBorderSubtle: '#F1F5F9',
    cardShadow: '0 8px 24px -4px rgba(0, 96, 250, 0.05), 0 2px 8px -2px rgba(0, 0, 0, 0.03)',
    cardShadowHover: '0 14px 34px -4px rgba(0, 96, 250, 0.10), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
    textPrimary: '#090D14',
    textSecondary: '#334155',
    textMuted: '#64748B',
    tableHeaderBg: '#F8FAFC',
    tableRowHover: '#F1F5F9',
    tableBorder: '#F1F5F9',
    inputBg: '#F8FAFC',
    inputBorder: '#E2E8F0',
    primary: BRAND_COLORS.primary,
    primaryHover: BRAND_COLORS.primaryHover,
    primaryLight: BRAND_COLORS.primaryLight,
    backdropBlur: 'blur(16px)',
  },
  dark: {
    mode: 'dark',
    bg: '#070B12',
    bgCanvas: '#070B12',
    ambientGlow:
      'radial-gradient(circle at 18% 12%, rgba(0, 96, 250, 0.12) 0%, transparent 50%), radial-gradient(circle at 85% 85%, rgba(0, 163, 255, 0.08) 0%, transparent 50%)',
    sidebarBg: '#060A14',
    sidebarBorder: 'rgba(255, 255, 255, 0.06)',
    topNavBg: 'rgba(11, 19, 43, 0.82)',
    topNavBorder: 'rgba(255, 255, 255, 0.08)',
    cardBg: 'rgba(15, 23, 42, 0.72)',
    cardBgSubtle: 'rgba(15, 23, 42, 0.50)',
    cardBgElevated: 'rgba(22, 33, 56, 0.85)',
    cardBorder: 'rgba(255, 255, 255, 0.09)',
    cardBorderSubtle: 'rgba(255, 255, 255, 0.05)',
    cardShadow: '0 12px 36px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
    cardShadowHover: '0 18px 45px rgba(0, 96, 250, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.08)',
    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    tableHeaderBg: 'rgba(15, 23, 42, 0.90)',
    tableRowHover: 'rgba(30, 41, 59, 0.45)',
    tableBorder: 'rgba(255, 255, 255, 0.06)',
    inputBg: 'rgba(15, 23, 42, 0.75)',
    inputBorder: 'rgba(255, 255, 255, 0.12)',
    primary: '#38BDF8',
    primaryHover: '#0284C7',
    primaryLight: 'rgba(56, 189, 248, 0.15)',
    backdropBlur: 'blur(20px)',
  },
};

interface AdminThemeContextType {
  theme: AdminThemeMode;
  setTheme: (t: AdminThemeMode) => void;
  toggleTheme: () => void;
  tokens: AdminThemeTokens;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminThemeMode>('light');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('dc_admin_theme') as AdminThemeMode | null;
    if (saved === 'dark' || saved === 'light') {
      setThemeState(saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('dark');
    }
  }, []);

  const setTheme = (newTheme: AdminThemeMode) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dc_admin_theme', newTheme);
    }
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  const tokens = ADMIN_THEME_TOKENS[theme];

  return (
    <AdminThemeContext.Provider value={{ theme, setTheme, toggleTheme, tokens }}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (!context) {
    return {
      theme: 'light' as AdminThemeMode,
      setTheme: () => {},
      toggleTheme: () => {},
      tokens: ADMIN_THEME_TOKENS.light,
    };
  }
  return context;
}
