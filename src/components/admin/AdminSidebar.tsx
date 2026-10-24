'use client';

import React, { useState } from 'react';
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
  ChevronDown,
  X,
  CreditCard,
} from 'lucide-react';
import { BRAND_CONSTANTS, BRAND_COLORS } from '@/config/brand';
import { useAdminTheme } from './AdminThemeContext';

interface AdminSidebarProps {
  currentSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  language: 'en' | 'bn';
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  counts?: {
    subscriptions?: number;
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
  isMobileOpen = false,
  onCloseMobile,
  counts = {},
}: AdminSidebarProps) {
  const { theme, tokens } = useAdminTheme();

  // Collapsible category groups
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    overview: true,
    healthcare: true,
    marketplace: true,
    business: true,
    system: true,
  });

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Structured precisely per Section 4 of prompt
  const categories = [
    {
      key: 'overview',
      title: 'Overview',
      titleBn: 'ওভারভিউ',
      items: [
        {
          id: 'dashboard' as AdminSection,
          label: 'Dashboard',
          labelBn: 'ড্যাশবোর্ড',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      key: 'healthcare',
      title: 'Healthcare Operations',
      titleBn: 'স্বাস্থ্যসেবা অপারেশনস',
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
        {
          id: 'appointments' as AdminSection,
          label: 'Appointments',
          labelBn: 'অ্যাপয়েন্টমেন্টস',
          icon: Calendar,
          badge: counts.appointments,
        },
      ],
    },
    {
      key: 'marketplace',
      title: 'Marketplace',
      titleBn: 'মার্কেটপ্লেস',
      items: [
        {
          id: 'services' as AdminSection,
          label: 'Healthcare Services',
          labelBn: 'সার্ভিস ও টেস্ট ক্যাটালগ',
          icon: Layers,
        },
        {
          id: 'content' as AdminSection,
          label: 'Content Management',
          labelBn: 'কনটেন্ট ম্যানেজমেন্ট (CMS)',
          icon: FileText,
        },
      ],
    },
    {
      key: 'business',
      title: 'Business Operations',
      titleBn: 'বিজনেস অপারেশনস',
      items: [
        {
          id: 'subscriptions' as AdminSection,
          label: 'Subscriptions & MRR',
          labelBn: 'সাবস্ক্রিপশন ও রাজস্ব (MRR)',
          icon: CreditCard,
          badge: counts.subscriptions || 'MRR',
          badgeColor: '#10B981',
        },
        {
          id: 'users' as AdminSection,
          label: 'Users and Access',
          labelBn: 'ব্যবহারকারী ও অ্যাক্সেস',
          icon: Users,
          badge: counts.users,
        },
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
        {
          id: 'reports' as AdminSection,
          label: 'Reports and Analytics',
          labelBn: 'রিপোর্টস ও অ্যানালিটিক্স',
          icon: BarChart3,
        },
      ],
    },
    {
      key: 'system',
      title: 'System',
      titleBn: 'সিস্টেম',
      items: [
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

  const handleItemClick = (id: AdminSection) => {
    onSelectSection(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 45,
          }}
          className="admin-sidebar-mobile-backdrop"
        />
      )}

      <aside
        style={{
          width: isCollapsed ? '78px' : '280px',
          minWidth: isCollapsed ? '78px' : '280px',
          backgroundColor: tokens.sidebarBg,
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1), transform 0.22s ease',
          borderRight: `1px solid ${tokens.sidebarBorder}`,
          position: 'relative',
          zIndex: 46,
          boxShadow: '6px 0 28px rgba(0, 0, 0, 0.35)',
        }}
        className={`admin-sidebar ${isMobileOpen ? 'admin-sidebar-mobile-open' : ''}`}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: isCollapsed ? '20px 12px' : '22px 20px',
            borderBottom: `1px solid ${tokens.sidebarBorder}`,
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
                background: 'linear-gradient(135deg, #0060FA 0%, #004ED1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 16px rgba(0, 96, 250, 0.45)',
                flexShrink: 0,
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Shield size={22} />
            </div>
            {!isCollapsed && (
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '15.5px', fontWeight: 900, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                  Diagnostic Care
                </div>
                <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Enterprise Admin
                </div>
              </div>
            )}
          </div>

          {/* Desktop Collapse / Mobile Close */}
          {onCloseMobile && isMobileOpen ? (
            <button
              type="button"
              onClick={onCloseMobile}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#94A3B8',
                borderRadius: '8px',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          ) : (
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
          )}
        </div>

        {/* Nav List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: isCollapsed ? '16px 8px' : '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {categories.map((cat) => {
            const isOpen = openGroups[cat.key] !== false;
            return (
              <div key={cat.key}>
                {!isCollapsed && (
                  <button
                    type="button"
                    onClick={() => toggleGroup(cat.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      padding: '4px 8px 6px 8px',
                      cursor: 'pointer',
                      fontSize: '10.5px',
                      fontWeight: 800,
                      color: '#64748B',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      textAlign: 'left',
                    }}
                  >
                    <span>{language === 'bn' ? cat.titleBn : cat.title}</span>
                    <ChevronDown
                      size={13}
                      style={{
                        transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                        transition: 'transform 0.15s ease',
                        opacity: 0.7,
                      }}
                    />
                  </button>
                )}

                {(isOpen || isCollapsed) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {cat.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentSection === item.id;
                      const itemTitle = language === 'bn' ? item.labelBn : item.label;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleItemClick(item.id)}
                          title={isCollapsed ? itemTitle : undefined}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '11px',
                            padding: isCollapsed ? '12px' : '9px 12px',
                            borderRadius: '10px',
                            border: 'none',
                            backgroundColor: isActive ? 'rgba(0, 96, 250, 0.24)' : 'transparent',
                            color: isActive ? '#60A5FA' : '#CBD5E1',
                            cursor: 'pointer',
                            width: '100%',
                            justifyContent: isCollapsed ? 'center' : 'space-between',
                            position: 'relative',
                            boxShadow: isActive ? 'inset 0 0 0 1px rgba(96, 165, 250, 0.45)' : 'none',
                            transition: 'all 0.15s ease',
                            fontWeight: isActive ? 700 : 500,
                            fontSize: '13px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '11px', minWidth: 0 }}>
                            <Icon
                              size={18}
                              style={{
                                color: isActive ? '#60A5FA' : '#94A3B8',
                                flexShrink: 0,
                                filter: isActive ? 'drop-shadow(0 0 6px rgba(96, 165, 250, 0.4))' : 'none',
                              }}
                            />
                            {!isCollapsed && (
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {itemTitle}
                              </span>
                            )}
                          </div>

                          {!isCollapsed && item.badge !== undefined && item.badge !== null && (
                            <span
                              style={{
                                fontSize: '10.5px',
                                fontWeight: 800,
                                backgroundColor: (item as any).badgeColor || 'rgba(255, 255, 255, 0.12)',
                                color: '#FFFFFF',
                                padding: '2px 7px',
                                borderRadius: '9999px',
                                flexShrink: 0,
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Customer Care Hotline Footer */}
        {!isCollapsed ? (
          <div
            style={{
              padding: '16px',
              borderTop: `1px solid ${tokens.sidebarBorder}`,
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
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
                <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 600 }}>
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
              borderTop: `1px solid ${tokens.sidebarBorder}`,
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
    </>
  );
}
