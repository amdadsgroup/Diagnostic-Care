'use client';

import React from 'react';
import { AdminSection } from './AdminTypes';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Building2,
  TestTube2,
  Pill,
  HeartPulse,
  Activity,
  Calendar,
  Layers,
  DollarSign,
  MessageSquare,
  FileText,
  BarChart3,
  Bell,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Phone,
  Shield,
} from 'lucide-react';
import { BRAND_CONSTANTS, BRAND_COLORS } from '@/config/brand';

interface AdminSidebarProps {
  currentSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  language: 'en' | 'bn';
  counts?: {
    users?: number;
    doctors?: number;
    pendingVerif?: number;
    hospitals?: number;
    diagnosticCenters?: number;
    pharmacies?: number;
    ambulances?: number;
    homeCare?: number;
    appointments?: number;
    tickets?: number;
    notifications?: number;
  };
}

export default function AdminSidebar({
  currentSection,
  onSelectSection,
  isCollapsed,
  onToggleCollapse,
  language,
  counts = {},
}: AdminSidebarProps) {
  const categories = [
    {
      title: 'CORE PLATFORM',
      titleBn: 'মূল প্ল্যাটফর্ম',
      items: [
        {
          id: 'dashboard' as AdminSection,
          label: 'Dashboard',
          labelBn: 'ড্যাশবোর্ড',
          icon: LayoutDashboard,
        },
        {
          id: 'users' as AdminSection,
          label: 'Users and Access',
          labelBn: 'ব্যবহারকারী ও অ্যাক্সেস',
          icon: Users,
          badge: counts.users,
        },
      ],
    },
    {
      title: 'HEALTHCARE PROVIDERS',
      titleBn: 'স্বাস্থ্যসেবা প্রোভাইডার',
      items: [
        {
          id: 'doctors' as AdminSection,
          label: 'Doctors',
          labelBn: 'চিকিৎসকবৃন্দ',
          icon: Stethoscope,
          badge: counts.doctors,
        },
        {
          id: 'hospitals' as AdminSection,
          label: 'Hospitals and Clinics',
          labelBn: 'হাসপাতাল ও ক্লিনিক',
          icon: Building2,
          badge: counts.hospitals,
        },
        {
          id: 'diagnostic-centers' as AdminSection,
          label: 'Diagnostic Centers',
          labelBn: 'ডায়াগনস্টিক সেন্টার',
          icon: TestTube2,
          badge: counts.diagnosticCenters,
        },
        {
          id: 'pharmacies' as AdminSection,
          label: 'Pharmacies',
          labelBn: 'ফার্মেসিসমূহ',
          icon: Pill,
          badge: counts.pharmacies,
        },
        {
          id: 'ambulances' as AdminSection,
          label: 'Ambulance Providers',
          labelBn: 'অ্যাম্বুলেন্স সার্ভিস',
          icon: HeartPulse,
          badge: counts.ambulances,
        },
        {
          id: 'home-care' as AdminSection,
          label: 'Home Healthcare',
          labelBn: 'হোম হেলথকেয়ার',
          icon: Activity,
          badge: counts.homeCare,
        },
      ],
    },
    {
      title: 'OPERATIONS',
      titleBn: 'অপারেশনস',
      items: [
        {
          id: 'appointments' as AdminSection,
          label: 'Appointments',
          labelBn: 'অ্যাপয়েন্টমেন্টস',
          icon: Calendar,
          badge: counts.appointments,
        },
        {
          id: 'services' as AdminSection,
          label: 'Healthcare Services',
          labelBn: 'সার্ভিস ও টেস্ট ক্যাটালগ',
          icon: Layers,
        },
      ],
    },
    {
      title: 'FINANCE & SUPPORT',
      titleBn: 'ফাইন্যান্স ও সাপোর্ট',
      items: [
        {
          id: 'finance' as AdminSection,
          label: 'Payments and Finance',
          labelBn: 'পেমেন্ট ও ফাইন্যান্স',
          icon: DollarSign,
        },
        {
          id: 'support' as AdminSection,
          label: 'Support and Complaints',
          labelBn: 'সাপোর্ট ও কমপ্লেইন্টস',
          icon: MessageSquare,
          badge: counts.tickets,
          badgeColor: '#EF4444',
        },
      ],
    },
    {
      title: 'GOVERNANCE & SYSTEM',
      titleBn: 'গভর্নেন্স ও সিস্টেম',
      items: [
        {
          id: 'content' as AdminSection,
          label: 'Content Management',
          labelBn: 'কনটেন্ট ম্যানেজমেন্ট (CMS)',
          icon: FileText,
        },
        {
          id: 'reports' as AdminSection,
          label: 'Reports and Analytics',
          labelBn: 'রিপোর্টস ও অ্যানালিটিক্স',
          icon: BarChart3,
        },
        {
          id: 'notifications' as AdminSection,
          label: 'Notifications',
          labelBn: 'নোটিফিকেশনস',
          icon: Bell,
          badge: counts.notifications,
          badgeColor: '#F59E0B',
        },
        {
          id: 'audit-logs' as AdminSection,
          label: 'Audit Logs',
          labelBn: 'অডিট লগস',
          icon: ShieldCheck,
        },
        {
          id: 'settings' as AdminSection,
          label: 'System Settings',
          labelBn: 'সিস্টেম সেটিংস',
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <aside
      style={{
        width: isCollapsed ? '78px' : '280px',
        minWidth: isCollapsed ? '78px' : '280px',
        backgroundColor: '#0B132B',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        zIndex: 40,
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.25)',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: isCollapsed ? '20px 12px' : '22px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: BRAND_COLORS.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(0, 96, 250, 0.45)',
              flexShrink: 0,
            }}
          >
            <Shield size={22} />
          </div>
          {!isCollapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                Diagnostic Care
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.04em' }}>
                ADMIN CONTROL
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#94A3B8',
            display: isCollapsed ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Nav List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: isCollapsed ? '16px 8px' : '16px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {categories.map((cat, idx) => (
          <div key={idx}>
            {!isCollapsed && (
              <div
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  color: '#64748B',
                  letterSpacing: '0.08em',
                  padding: '4px 10px 8px 10px',
                  textTransform: 'uppercase',
                }}
              >
                {language === 'bn' ? cat.titleBn : cat.title}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {cat.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectSection(item.id)}
                    title={language === 'bn' ? item.labelBn : item.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: isCollapsed ? '12px' : '10px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: isActive ? 'rgba(0, 96, 250, 0.22)' : 'transparent',
                      color: isActive ? '#60A5FA' : '#CBD5E1',
                      cursor: 'pointer',
                      width: '100%',
                      justifyContent: isCollapsed ? 'center' : 'space-between',
                      position: 'relative',
                      boxShadow: isActive ? 'inset 0 0 0 1px rgba(96, 165, 250, 0.4)' : 'none',
                      transition: 'all 0.15s ease',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '13.5px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Icon size={19} style={{ color: isActive ? '#60A5FA' : '#94A3B8', flexShrink: 0 }} />
                      {!isCollapsed && (
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {language === 'bn' ? item.labelBn : item.label}
                        </span>
                      )}
                    </div>

                    {!isCollapsed && item.badge !== undefined && item.badge !== null && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: (item as any).badgeColor || 'rgba(255, 255, 255, 0.12)',
                          color: '#FFFFFF',
                          padding: '2px 7px',
                          borderRadius: '9999px',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Customer Care Hotline Footer */}
      {!isCollapsed ? (
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                color: '#4ADE80',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Phone size={16} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                {language === 'bn' ? '২৪/৭ কাস্টমার কেয়ার' : '24/7 Helpline'}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                {BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Expand Sidebar"
          style={{
            padding: '16px 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ChevronRight size={18} />
        </button>
      )}
    </aside>
  );
}
