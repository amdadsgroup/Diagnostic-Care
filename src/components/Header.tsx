'use client';

import React from 'react';
import Image from 'next/image';
import { BRAND_CONSTANTS, SupportedLanguage } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import { UserRole } from '@/types';
import { Phone, MapPin, Globe, Shield, UserCheck, Stethoscope, Building2, User } from 'lucide-react';

interface HeaderProps {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: 'marketplace' | 'queue' | 'reports' | 'prescriptions' | 'portal';
  setActiveTab: (tab: 'marketplace' | 'queue' | 'reports' | 'prescriptions' | 'portal') => void;
  onOpenAuth?: () => void;
  onOpenOnboard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  currentRole,
  setCurrentRole,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenOnboard,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="header-glass">
      {/* Top Notification / Customer Care Bar */}
      <div style={{ backgroundColor: 'var(--brand-navy-900)', color: '#FFFFFF', padding: '6px 0', fontSize: '13px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255, 255, 255, 0.12)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>
              <MapPin size={13} color="#10B981" />
              {t.locationBadge}
            </span>
            <span style={{ color: 'var(--slate-300)', fontSize: '12px' }}>
              {t.tagline}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <a
              href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
              id="header-helpline-link"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38BDF8', fontWeight: 600, textDecoration: 'none' }}
              title="Call Diagnostic Care Helpline"
            >
              <Phone size={13} />
              <span>{t.helplineTitle}: <strong>{BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}</strong></span>
            </a>

            {/* Language Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255, 255, 255, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
              <Globe size={13} />
              <button
                onClick={() => setLanguage('en')}
                style={{
                  color: language === 'en' ? '#38BDF8' : '#FFFFFF',
                  fontWeight: language === 'en' ? 700 : 400,
                  fontSize: '11px',
                  padding: '0 4px',
                }}
              >
                EN
              </button>
              <span style={{ opacity: 0.5 }}>|</span>
              <button
                onClick={() => setLanguage('bn')}
                style={{
                  color: language === 'bn' ? '#38BDF8' : '#FFFFFF',
                  fontWeight: language === 'bn' ? 700 : 400,
                  fontSize: '11px',
                  padding: '0 4px',
                }}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Brand Navigation Bar */}
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('marketplace')}>
          <div style={{ width: '42px', height: '42px', position: 'relative', borderRadius: '8px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <Image src="/logo.png" alt="Diagnostic Care Logo" fill style={{ objectFit: 'contain' }} priority />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-navy-900)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {BRAND_CONSTANTS.BRAND_NAME}
            </div>
            <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--brand-teal-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t.tagline}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('marketplace')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: activeTab === 'marketplace' ? 600 : 500,
              color: activeTab === 'marketplace' ? 'var(--brand-navy-900)' : 'var(--slate-600)',
              backgroundColor: activeTab === 'marketplace' ? 'var(--slate-100)' : 'transparent',
              transition: 'all 0.15s ease',
            }}
          >
            {t.navFindDoctors} & {t.navDiagnosticTests}
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: activeTab === 'queue' ? 600 : 500,
              color: activeTab === 'queue' ? 'var(--brand-teal-600)' : 'var(--slate-600)',
              backgroundColor: activeTab === 'queue' ? 'var(--brand-teal-50)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
            {t.navLiveQueue}
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: activeTab === 'reports' ? 600 : 500,
              color: activeTab === 'reports' ? 'var(--brand-navy-900)' : 'var(--slate-600)',
              backgroundColor: activeTab === 'reports' ? 'var(--slate-100)' : 'transparent',
            }}
          >
            {t.navMyReports}
          </button>

          <button
            onClick={() => setActiveTab('prescriptions')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: activeTab === 'prescriptions' ? 600 : 500,
              color: activeTab === 'prescriptions' ? 'var(--brand-navy-900)' : 'var(--slate-600)',
              backgroundColor: activeTab === 'prescriptions' ? 'var(--slate-100)' : 'transparent',
            }}
          >
            {t.navPrescriptions}
          </button>

          <button
            onClick={() => setActiveTab('portal')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#FFFFFF',
              backgroundColor: 'var(--brand-navy-700)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Building2 size={15} />
            {t.navProviderPortal}
          </button>
        </nav>

        {/* Action Buttons: Patient Login & Provider Onboard */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {onOpenOnboard && (
            <button
              onClick={onOpenOnboard}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'var(--brand-teal-50)',
                color: 'var(--brand-teal-600)',
                border: '1px solid var(--brand-teal-500)',
                fontWeight: 700,
                fontSize: '12px',
              }}
            >
              🏥 প্রতিষ্ঠান অনবোর্ডিং
            </button>
          )}

          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'var(--brand-navy-900)',
                color: 'white',
                fontWeight: 600,
                fontSize: '12px',
              }}
            >
              <User size={13} />
              লগইন / সাইন আপ
            </button>
          )}

          {/* Persona / RBAC Switcher Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--slate-100)', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
              Role View:
            </span>
            <select
              id="role-switcher-select"
              value={currentRole}
              onChange={(e) => {
                const role = e.target.value as UserRole;
                setCurrentRole(role);
                if (role !== 'PATIENT') {
                  setActiveTab('portal');
                } else {
                  setActiveTab('marketplace');
                }
              }}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--brand-navy-900)',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="PATIENT">Patient (Marketplace & Health Vault)</option>
              <option value="DOCTOR">Doctor (Dr. Anisur Rahman, Cardiologist)</option>
              <option value="DOCTOR_ASSISTANT">Doctor Assistant (Rahim Uddin - Sandboxed)</option>
              <option value="DIAGNOSTIC_ADMIN">Diagnostic Center Admin (Popular Moulvibazar)</option>
              <option value="SUPER_ADMIN">Platform Super Admin</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
