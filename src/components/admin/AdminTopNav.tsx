'use client';

import React, { useState } from 'react';
import { AdminSection } from './AdminTypes';
import {
  Search,
  Bell,
  Globe,
  LogOut,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Menu,
} from 'lucide-react';
import { BRAND_COLORS } from '@/config/brand';
import { AuthUserProfile } from '@/services/auth.service';

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

const SECTION_TITLES: Record<AdminSection, { en: string; bn: string }> = {
  dashboard: { en: 'Operational Overview & Executive Metrics', bn: 'অপারেশনাল ওভারভিউ ও এক্সিকিউটিভ মেট্রিক্স' },
  users: { en: 'User Management & Role-Based Access Control', bn: 'ব্যবহারকারী ব্যবস্থাপনা ও অ্যাক্সেস কন্ট্রোল' },
  doctors: { en: 'Doctor Profiles & BMDC Verification', bn: 'চিকিৎসক প্রোফাইল ও বিএমডিসি ভেরিফিকেশন' },
  hospitals: { en: 'Hospitals & Specialized Clinics Registry', bn: 'হাসপাতাল ও স্পেশালাইজড ক্লিনিক রেজিস্ট্রি' },
  'diagnostic-centers': { en: 'Diagnostic Centers & Test Catalog', bn: 'ডায়াগনস্টিক সেন্টার ও টেস্ট ক্যাটালগ' },
  pharmacies: { en: 'Licensed Pharmacies & Drug Delivery', bn: 'অনুমোদিত ফার্মেসি ও মেডিসিন বিতরণ' },
  ambulances: { en: 'Ambulance Fleet & Emergency Transit', bn: 'অ্যাম্বুলেন্স ফ্লিট ও জরুরি ট্রানজিট' },
  'home-care': { en: 'Home Healthcare & Nursing Providers', bn: 'হোম হেলথকেয়ার ও নার্সিং প্রোভাইডার' },
  appointments: { en: 'Doctor Appointments & Chamber Queues', bn: 'ডাক্তার অ্যাপয়েন্টমেন্টস ও চেম্বার কিউ' },
  services: { en: 'Marketplace Service Categories & Packages', bn: 'সার্ভিস ক্যাটাগরি ও প্যাকেজ ক্যাটালগ' },
  finance: { en: 'Payments Ledger & Financial Settlements', bn: 'পেমেন্টস লেজার ও ফাইন্যান্সিয়াল সেটেলমেন্ট' },
  support: { en: 'Customer Support Desk & Complaints Escalation', bn: 'কাস্টমার সাপোর্ট ডেস্ক ও কমপ্লেইন্টস' },
  content: { en: 'Content Management (CMS) & Public Announcements', bn: 'কনটেন্ট ম্যানেজমেন্ট (CMS) ও ঘোষণা' },
  reports: { en: 'Operational Reports & Data Analytics', bn: 'অপারেশনাল রিপোর্ট ও ডাটা অ্যানালিটিক্স' },
  notifications: { en: 'Notification Center & Broadcast Console', bn: 'নোটিফিকেশন সেন্টার ও ব্রডকাস্ট কনসোল' },
  'audit-logs': { en: 'Administrative Audit Logs & Compliance Trace', bn: 'প্রশাসনিক অডিট লগস ও কমপ্লায়েন্স ট্রেস' },
  settings: { en: 'Platform System Configuration & Rules', bn: 'প্ল্যাটফর্ম সিস্টেম কনফিগারেশন' },
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
  const [showNotifications, setShowNotifications] = useState(false);

  const title = SECTION_TITLES[currentSection]?.[language] || SECTION_TITLES[currentSection]?.en || 'Admin Portal';

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* Left: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {onToggleMobileSidebar && (
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            aria-label="Toggle Navigation"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: '#475569',
              cursor: 'pointer',
              padding: '6px',
            }}
            className="admin-mobile-toggle"
          >
            <Menu size={22} />
          </button>
        )}

        <div>
          <h1 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{title}</h1>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
            Diagnostic Care • Central Governance Console
          </div>
        </div>
      </div>

      {/* Right: Search, Language Switch, Refresh, Notifications, Profile, Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '7px 12px',
            width: '240px',
          }}
        >
          <Search size={15} color="#94A3B8" style={{ marginRight: '8px', flexShrink: 0 }} />
          <input
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
              color: '#0F172A',
            }}
          />
        </div>

        {/* Global Refresh Button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          title={language === 'bn' ? 'ডাটা রিফ্রেশ করুন' : 'Refresh Data'}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <RefreshCw size={16} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
        </button>

        {/* Language Switch Button */}
        <button
          type="button"
          onClick={onToggleLanguage}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            color: BRAND_COLORS.primary,
            padding: '7px 12px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Globe size={14} />
          <span>{language === 'bn' ? 'ENGLISH' : 'বাংলা'}</span>
        </button>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <Bell size={16} />
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                border: '1.5px solid #FFFFFF',
              }}
            />
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '300px',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
                padding: '14px',
                zIndex: 50,
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                {language === 'bn' ? 'সিস্টেম এলার্টস' : 'Operational Alerts'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '8px', backgroundColor: '#F8FAFC', borderRadius: '8px', fontSize: '12px' }}>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>BMDC License Verification</div>
                  <div style={{ color: '#64748B' }}>New specialist application awaiting review</div>
                </div>
                <div style={{ padding: '8px', backgroundColor: '#F8FAFC', borderRadius: '8px', fontSize: '12px' }}>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>Database Status: Operational</div>
                  <div style={{ color: '#16A34A' }}>Supabase PostgreSQL connected healthy</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Super Admin User Info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '4px 12px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            borderRadius: '12px',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: BRAND_COLORS.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 800,
            }}
          >
            AR
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '12px', fontWeight: 800 }}>Amdadur Rahman</div>
            <div style={{ fontSize: '10px', color: '#38BDF8', fontWeight: 700 }}>SUPER ADMIN</div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={onLogout}
          title={language === 'bn' ? 'সাইন আউট' : 'Sign Out'}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
