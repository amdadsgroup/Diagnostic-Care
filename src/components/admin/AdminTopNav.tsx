'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AdminSection } from './AdminTypes';
import {
  Search,
  Bell,
  Globe,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Sun,
  Moon,
  Menu,
  ChevronRight,
  User,
  ExternalLink,
  X,
  Sparkles,
  Command,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Settings as SettingsIcon,
} from 'lucide-react';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';
import { AuthUserProfile } from '@/services/auth.service';
import { useAdminTheme } from './AdminThemeContext';

interface AdminTopNavProps {
  currentSection: AdminSection;
  language: 'en' | 'bn';
  onToggleLanguage: () => void;
  currentUser: AuthUserProfile | null;
  onLogout: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  onToggleMobileSidebar?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

interface SectionMeta {
  category: string;
  categoryBn: string;
  title: string;
  titleBn: string;
}

const SECTION_METADATA: Record<AdminSection, SectionMeta> = {
  dashboard: {
    category: 'Overview',
    categoryBn: 'ওভারভিউ',
    title: 'Operational Overview & Executive Metrics',
    titleBn: 'অপারেশনাল ওভারভিউ ও এক্সিকিউটিভ মেট্রিক্স',
  },
  subscriptions: {
    category: 'Business Operations',
    categoryBn: 'বিজনেস অপারেশনস',
    title: 'Subscription Operations & Provider Billing Hub',
    titleBn: 'সাবস্ক্রিপশন অপারেশনস ও প্রোভাইডার বিলিং হাব',
  },
  doctors: {
    category: 'Healthcare Operations',
    categoryBn: 'হেলথকেয়ার অপারেশনস',
    title: 'Doctor Profiles & BMDC Verification',
    titleBn: 'চিকিৎসক প্রোফাইল ও বিএমডিসি ভেরিফিকেশন',
  },
  hospitals: {
    category: 'Healthcare Operations',
    categoryBn: 'হেলথকেয়ার অপারেশনস',
    title: 'Hospitals & Specialized Clinics Registry',
    titleBn: 'হাসপাতাল ও স্পেশালাইজড ক্লিনিক রেজিস্ট্রি',
  },
  'diagnostic-centers': {
    category: 'Healthcare Operations',
    categoryBn: 'হেলথকেয়ার অপারেশনস',
    title: 'Diagnostic Centers & Test Catalog',
    titleBn: 'ডায়াগনস্টিক সেন্টার ও টেস্ট ক্যাটালগ',
  },
  pharmacies: {
    category: 'Healthcare Operations',
    categoryBn: 'হেলথকেয়ার অপারেশনস',
    title: 'Licensed Pharmacies & Drug Delivery',
    titleBn: 'অনুমোদিত ফার্মেসি ও মেডিসিন বিতরণ',
  },
  ambulances: {
    category: 'Healthcare Operations',
    categoryBn: 'হেলথকেয়ার অপারেশনস',
    title: 'Ambulance Fleet & Emergency Transit',
    titleBn: 'অ্যাম্বুলেন্স ফ্লিট ও জরুরি ট্রানজিট',
  },
  'home-care': {
    category: 'Healthcare Operations',
    categoryBn: 'হেলথকেয়ার অপারেশনস',
    title: 'Home Healthcare & Nursing Providers',
    titleBn: 'হোম হেলথকেয়ার ও নার্সিং প্রোভাইডার',
  },
  appointments: {
    category: 'Healthcare Operations',
    categoryBn: 'হেলথকেয়ার অপারেশনস',
    title: 'Doctor Appointments & Chamber Queues',
    titleBn: 'ডাক্তার অ্যাপয়েন্টমেন্টস ও চেম্বার কিউ',
  },
  services: {
    category: 'Marketplace',
    categoryBn: 'মার্কেটপ্লেস',
    title: 'Healthcare Services & Test Catalog',
    titleBn: 'সার্ভিস ক্যাটাগরি ও প্যাকেজ ক্যাটালগ',
  },
  content: {
    category: 'Marketplace',
    categoryBn: 'মার্কেটপ্লেস',
    title: 'Content Management (CMS) & Announcements',
    titleBn: 'কনটেন্ট ম্যানেজমেন্ট (CMS) ও ঘোষণা',
  },
  users: {
    category: 'Business Operations',
    categoryBn: 'বিজনেস অপারেশনস',
    title: 'User Management & Role-Based Access Control',
    titleBn: 'ব্যবহারকারী ব্যবস্থাপনা ও অ্যাক্সেস কন্ট্রোল',
  },
  finance: {
    category: 'Business Operations',
    categoryBn: 'বিজনেস অপারেশনস',
    title: 'Payments Ledger & Financial Settlements',
    titleBn: 'পেমেন্টস লেজার ও ফাইন্যান্সিয়াল সেটেলমেন্ট',
  },
  support: {
    category: 'Business Operations',
    categoryBn: 'বিজনেস অপারেশনস',
    title: 'Customer Support Desk & Complaints Escalation',
    titleBn: 'কাস্টমার সাপোর্ট ডেস্ক ও কমপ্লেইন্টস',
  },
  reports: {
    category: 'Business Operations',
    categoryBn: 'বিজনেস অপারেশনস',
    title: 'Operational Reports & Data Analytics',
    titleBn: 'অপারেশনাল রিপোর্ট ও ডাটা অ্যানালিটিক্স',
  },
  notifications: {
    category: 'System',
    categoryBn: 'সিস্টেম',
    title: 'Notification Center & Broadcast Console',
    titleBn: 'নোটিফিকেশন সেন্টার ও ব্রডকাস্ট কনসোল',
  },
  'audit-logs': {
    category: 'System',
    categoryBn: 'সিস্টেম',
    title: 'Administrative Audit Logs & Compliance Trace',
    titleBn: 'প্রশাসনিক অডিট লগস ও কমপ্লায়েন্স ট্রেস',
  },
  settings: {
    category: 'System',
    categoryBn: 'সিস্টেম',
    title: 'Platform System Configuration & Rules',
    titleBn: 'প্ল্যাটফর্ম সিস্টেম কনফিগারেশন',
  },
};

export default function AdminTopNav({
  currentSection,
  language,
  onToggleLanguage,
  currentUser,
  onLogout,
  onRefresh,
  isLoading,
  onToggleMobileSidebar,
  searchQuery,
  onSearchChange,
}: AdminTopNavProps) {
  const { theme, toggleTheme, tokens } = useAdminTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const meta = SECTION_METADATA[currentSection] || {
    category: 'Overview',
    categoryBn: 'ওভারভিউ',
    title: 'Central Governance Console',
    titleBn: 'সেন্ট্রাল গভর্নেন্স কনসোল',
  };

  // Close popups on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hotkey Ctrl+K to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const adminName = currentUser?.fullName || 'Amdadur Rahman';
  const adminEmail = currentUser?.email || 'contact.amdadur@gmail.com';
  const initials = adminName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('') || 'AD';

  return (
    <header
      style={{
        height: '72px',
        backgroundColor: tokens.topNavBg,
        backdropFilter: tokens.backdropBlur,
        WebkitBackdropFilter: tokens.backdropBlur,
        borderBottom: `1px solid ${tokens.topNavBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 35,
        transition: 'background-color 0.25s ease, border-color 0.25s ease',
      }}
    >
      {/* LEFT: Mobile Toggle & Hierarchical Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        {onToggleMobileSidebar && (
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            aria-label="Toggle Navigation Sidebar"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
              border: `1px solid ${tokens.cardBorder}`,
              color: tokens.textPrimary,
              cursor: 'pointer',
            }}
          >
            <Menu size={20} />
          </button>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Breadcrumb line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 600,
              color: tokens.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <span style={{ color: tokens.primary, fontWeight: 700 }}>Diagnostic Care</span>
            <ChevronRight size={12} color={tokens.textMuted} />
            <span>{language === 'bn' ? meta.categoryBn : meta.category}</span>
          </div>

          {/* Section Main Title */}
          <h1
            style={{
              fontSize: '16px',
              fontWeight: 800,
              color: tokens.textPrimary,
              margin: '2px 0 0 0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              letterSpacing: '-0.02em',
            }}
          >
            {language === 'bn' ? meta.titleBn : meta.title}
          </h1>
        </div>
      </div>

      {/* RIGHT: Global Search, Quick Actions, Theme, Language, Notifications, Admin Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Global Search Bar */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: tokens.inputBg,
            border: `1px solid ${tokens.inputBorder}`,
            borderRadius: '11px',
            padding: '7px 12px',
            width: '230px',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          className="admin-search-box"
        >
          <Search size={14} color={tokens.textMuted} style={{ marginRight: '8px', flexShrink: 0 }} />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={language === 'bn' ? 'সার্চ করুন...' : 'Search records...'}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              outline: 'none',
              fontSize: '12.5px',
              width: '100%',
              color: tokens.textPrimary,
              fontWeight: 500,
            }}
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              style={{
                border: 'none',
                background: 'transparent',
                color: tokens.textMuted,
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
              }}
            >
              <X size={13} />
            </button>
          ) : (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: tokens.textMuted,
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                padding: '1px 5px',
                borderRadius: '4px',
                marginLeft: '4px',
                userSelect: 'none',
              }}
            >
              ⌘K
            </span>
          )}
        </div>

        {/* Global Refresh Button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          title={language === 'bn' ? 'ডাটা রিফ্রেশ করুন' : 'Refresh Realtime Data'}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '11px',
            backgroundColor: tokens.cardBgSubtle,
            border: `1px solid ${tokens.cardBorder}`,
            color: tokens.textSecondary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <RefreshCw
            size={15}
            style={{
              animation: isLoading ? 'spin 1s linear infinite' : 'none',
            }}
          />
        </button>

        {/* Theme Toggle (Light / Dark Mode) */}
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Futuristic Dark Theme'}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '11px',
            backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.12)' : '#EFF6FF',
            border: `1px solid ${theme === 'dark' ? 'rgba(56, 189, 248, 0.3)' : '#BFDBFE'}`,
            color: theme === 'dark' ? '#38BDF8' : BRAND_COLORS.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Language Switch Button */}
        <button
          type="button"
          onClick={onToggleLanguage}
          title={language === 'bn' ? 'Switch to English' : 'বাংলা ভাষায় পরিবর্তন করুন'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: tokens.cardBgSubtle,
            border: `1px solid ${tokens.cardBorder}`,
            color: tokens.textPrimary,
            padding: '7px 11px',
            borderRadius: '11px',
            fontSize: '11.5px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Globe size={13} color={tokens.primary} />
          <span>{language === 'bn' ? 'ENGLISH' : 'বাংলা'}</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Operational Notifications"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '11px',
              backgroundColor: tokens.cardBgSubtle,
              border: `1px solid ${tokens.cardBorder}`,
              color: tokens.textSecondary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.15s ease',
            }}
          >
            <Bell size={15} />
            <span
              style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                boxShadow: '0 0 6px #EF4444',
              }}
            />
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '320px',
                backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                borderRadius: '14px',
                border: `1px solid ${tokens.cardBorder}`,
                boxShadow: tokens.cardShadowHover,
                padding: '16px',
                zIndex: 50,
                backdropFilter: 'blur(16px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: `1px solid ${tokens.tableBorder}`,
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 800, color: tokens.textPrimary }}>
                  {language === 'bn' ? 'অপারেশনাল নোটিফিকেশন' : 'System & Operations Alerts'}
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    color: '#EF4444',
                    padding: '2px 7px',
                    borderRadius: '999px',
                  }}
                >
                  LIVE
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div
                  style={{
                    padding: '10px',
                    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
                    borderRadius: '10px',
                    borderLeft: '3px solid #F59E0B',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ fontWeight: 700, color: tokens.textPrimary, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <AlertTriangle size={13} color="#F59E0B" /> BMDC License Review
                  </div>
                  <div style={{ color: tokens.textMuted, marginTop: '2px', fontSize: '11px' }}>
                    Specialist doctor applications pending verification check.
                  </div>
                </div>

                <div
                  style={{
                    padding: '10px',
                    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
                    borderRadius: '10px',
                    borderLeft: '3px solid #10B981',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ fontWeight: 700, color: tokens.textPrimary, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CheckCircle2 size={13} color="#10B981" /> Database & Services Online
                  </div>
                  <div style={{ color: tokens.textMuted, marginTop: '2px', fontSize: '11px' }}>
                    PostgreSQL connection pool healthy with atomic locks enabled.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Administrator Profile Pill & Dropdown */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '5px 12px 5px 6px',
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#090D14',
              color: '#FFFFFF',
              borderRadius: '13px',
              border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0,0,0,0.1)'}`,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '9px',
                background: 'linear-gradient(135deg, #0060FA 0%, #00C6FF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11.5px',
                fontWeight: 800,
                color: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(0, 96, 250, 0.35)',
              }}
            >
              {initials}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF' }}>{adminName}</div>
              <div
                style={{
                  fontSize: '9.5px',
                  color: '#38BDF8',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                }}
              >
                SUPER ADMIN
              </div>
            </div>
          </button>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '48px',
                width: '260px',
                backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                borderRadius: '14px',
                border: `1px solid ${tokens.cardBorder}`,
                boxShadow: tokens.cardShadowHover,
                padding: '14px',
                zIndex: 50,
                backdropFilter: 'blur(16px)',
              }}
            >
              <div style={{ paddingBottom: '10px', borderBottom: `1px solid ${tokens.tableBorder}`, marginBottom: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: tokens.textPrimary }}>{adminName}</div>
                <div style={{ fontSize: '11.5px', color: tokens.textMuted, wordBreak: 'break-all' }}>{adminEmail}</div>
                <div
                  style={{
                    display: 'inline-block',
                    marginTop: '6px',
                    fontSize: '10px',
                    fontWeight: 800,
                    color: BRAND_COLORS.primary,
                    backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.12)' : '#EFF6FF',
                    padding: '2px 7px',
                    borderRadius: '6px',
                  }}
                >
                  Root Administrator & Architect
                </div>
              </div>

              <div style={{ fontSize: '11px', color: tokens.textMuted, marginBottom: '10px' }}>
                Care Hotline: <strong style={{ color: tokens.textPrimary }}>{BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}</strong>
              </div>

              <button
                type="button"
                onClick={onLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#EF4444',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <LogOut size={14} />
                <span>{language === 'bn' ? 'সাইন আউট করুন' : 'Sign Out of Admin Console'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
