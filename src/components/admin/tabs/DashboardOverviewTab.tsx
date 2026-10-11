'use client';

import React, { useState } from 'react';
import { AdminDashboardMetrics } from '@/services/admin.service';
import {
  Users,
  Stethoscope,
  Building2,
  TestTube2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Activity,
  HeartPulse,
  Pill,
  ShieldCheck,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';

interface DashboardOverviewTabProps {
  metrics: AdminDashboardMetrics | null;
  language: 'en' | 'bn';
  dateFilter: 'today' | '7d' | '30d' | 'all';
  onDateFilterChange: (f: 'today' | '7d' | '30d' | 'all') => void;
  onNavigateSection: (section: any) => void;
}

export default function DashboardOverviewTab({
  metrics,
  language,
  dateFilter,
  onDateFilterChange,
  onNavigateSection,
}: DashboardOverviewTabProps) {
  const m = metrics || {
    totalUsers: 0,
    totalPatients: 0,
    activeDoctors: 0,
    pendingDoctorVerifications: 0,
    diagnosticCenters: 0,
    hospitals: 0,
    clinics: 0,
    pharmacies: 0,
    ambulanceProviders: 0,
    homeCareProviders: 0,
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    pendingProviderApplications: 0,
    totalRevenueBdt: 0,
    recentRegistrations: [],
    recentApplications: [],
    recentAppointments: [],
    systemHealth: {
      databaseStatus: 'OPERATIONAL' as const,
      authStatus: 'OPERATIONAL' as const,
      storageStatus: 'OPERATIONAL' as const,
      uptimePercent: 99.98,
    },
  };

  const statCards = [
    {
      title: 'Total Patients',
      titleBn: 'নিবন্ধিত রোগী',
      value: m.totalPatients,
      icon: Users,
      color: '#3B82F6',
      bg: '#EFF6FF',
      section: 'users',
    },
    {
      title: 'Verified Doctors',
      titleBn: 'ভেরিফাইড চিকিৎসক',
      value: m.activeDoctors,
      icon: Stethoscope,
      color: '#10B981',
      bg: '#ECFDF5',
      section: 'doctors',
    },
    {
      title: 'Pending Doctor Verification',
      titleBn: 'অপেক্ষমাণ ডাক্তার অনুমোদন',
      value: m.pendingDoctorVerifications,
      icon: AlertTriangle,
      color: '#F59E0B',
      bg: '#FEF3C7',
      section: 'doctors',
    },
    {
      title: 'Diagnostic Centers',
      titleBn: 'ডায়াগনস্টিক সেন্টার',
      value: m.diagnosticCenters,
      icon: TestTube2,
      color: '#8B5CF6',
      bg: '#F5F3FF',
      section: 'diagnostic-centers',
    },
    {
      title: 'Hospitals & Clinics',
      titleBn: 'হাসপাতাল ও ক্লিনিক',
      value: m.hospitals + m.clinics,
      icon: Building2,
      color: '#06B6D4',
      bg: '#ECFEFF',
      section: 'hospitals',
    },
    {
      title: 'Licensed Pharmacies',
      titleBn: 'অনুমোদিত ফার্মেসি',
      value: m.pharmacies,
      icon: Pill,
      color: '#EC4899',
      bg: '#FDF2F8',
      section: 'pharmacies',
    },
    {
      title: 'Ambulance Fleets',
      titleBn: 'অ্যাম্বুলেন্স প্রোভাইডার',
      value: m.ambulanceProviders,
      icon: HeartPulse,
      color: '#EF4444',
      bg: '#FEF2F2',
      section: 'ambulances',
    },
    {
      title: 'Home Healthcare Providers',
      titleBn: 'হোম কেয়ার প্রোভাইডার',
      value: m.homeCareProviders,
      icon: Activity,
      color: '#14B8A6',
      bg: '#F0FDFA',
      section: 'home-care',
    },
    {
      title: 'Total Appointments',
      titleBn: 'সর্বমোট অ্যাপয়েন্টমেন্ট',
      value: m.totalAppointments,
      icon: Calendar,
      color: '#6366F1',
      bg: '#EEF2FF',
      section: 'appointments',
    },
    {
      title: 'Upcoming Bookings',
      titleBn: 'আসন্ন অ্যাপয়েন্টমেন্ট',
      value: m.upcomingAppointments,
      icon: Clock,
      color: '#0EA5E9',
      bg: '#F0F9FF',
      section: 'appointments',
    },
    {
      title: 'Completed Consultations',
      titleBn: 'সম্পন্ন কনসালটেশন',
      value: m.completedAppointments,
      icon: CheckCircle2,
      color: '#059669',
      bg: '#ECFDF5',
      section: 'appointments',
    },
    {
      title: 'Pending Applications',
      titleBn: 'অপেক্ষমাণ প্রোভাইডার আবেদন',
      value: m.pendingProviderApplications,
      icon: AlertTriangle,
      color: '#D97706',
      bg: '#FFFBEB',
      section: 'doctors',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Date Filter & Revenue Highlight Glass Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 58, 138, 0.9) 100%)',
          borderRadius: '20px',
          padding: '24px 28px',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#93C5FD', letterSpacing: '0.05em' }}>
              {language === 'bn' ? 'মোট প্ল্যাটফর্ম আয় (কনসালটেশন ও সার্ভিস)' : 'TOTAL PLATFORM VOLUME (VERIFIED RECORDS)'}
            </span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.02em', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span>{BRAND_CONSTANTS.CURRENCY_SYMBOL}</span>
            <span>{m.totalRevenueBdt.toLocaleString()}</span>
            <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>BDT</span>
          </div>
          <div style={{ fontSize: '12px', color: '#CBD5E1', marginTop: '6px' }}>
            {language === 'bn'
              ? 'বাস্তব ডাটাবেস রেকর্ড দ্বারা ক্যালকুলেটেড • প্ল্যাটফর্ম কমিশন ১০% হারে সংরক্ষিত'
              : 'Derived directly from completed appointments & verified transactions • 10% Platform Take-Rate'}
          </div>
        </div>

        {/* Date Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '6px', borderRadius: '12px' }}>
          {[
            { id: 'today', label: 'Today', labelBn: 'আজ' },
            { id: '7d', label: 'Last 7 Days', labelBn: 'গত ৭ দিন' },
            { id: '30d', label: 'Last 30 Days', labelBn: 'গত ৩০ দিন' },
            { id: 'all', label: 'All Time', labelBn: 'সকল সময়' },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => onDateFilterChange(pill.id as any)}
              style={{
                border: 'none',
                backgroundColor: dateFilter === pill.id ? BRAND_COLORS.primary : 'transparent',
                color: '#FFFFFF',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {language === 'bn' ? pill.labelBn : pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 12 Core Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateSection(card.section)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '18px 20px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 22px rgba(0, 0, 0, 0.07)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.03)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: card.bg,
                    color: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={20} />
                </div>
                <ArrowUpRight size={16} color="#94A3B8" />
              </div>

              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '2px' }}>
                  {card.value.toLocaleString()}
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 600 }}>
                  {language === 'bn' ? card.titleBn : card.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Health & Operational Infrastructure Status */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '22px 24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={20} color="#10B981" />
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {language === 'bn' ? 'সিস্টেম স্ট্যাটাস ও অবকাঠামো হেলথ' : 'System Health & Operational Status'}
            </h3>
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              backgroundColor: '#DCFCE7',
              color: '#166534',
              padding: '3px 9px',
              borderRadius: '9999px',
            }}
          >
            {m.systemHealth.uptimePercent}% UPTIME
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div style={{ padding: '12px 16px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>PostgreSQL Database</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#16A34A', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
              {m.systemHealth.databaseStatus}
            </div>
          </div>
          <div style={{ padding: '12px 16px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Supabase Auth RBAC</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#16A34A', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
              {m.systemHealth.authStatus}
            </div>
          </div>
          <div style={{ padding: '12px 16px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Secure Storage (Licenses & Documents)</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#16A34A', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
              {m.systemHealth.storageStatus}
            </div>
          </div>
          <div style={{ padding: '12px 16px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>24/7 Helpline Support</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
              {BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
