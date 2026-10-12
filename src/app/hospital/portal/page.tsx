'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand/BrandLogo';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { BRAND_CONSTANTS, BRAND_COLORS } from '@/config/brand';
import { useAdminTheme } from '@/components/admin/AdminThemeContext';
import {
  HospitalService,
  DEMO_HOSPITAL_ID,
} from '@/services/hospital.service';
import {
  HospitalProfile,
  HospitalBranch,
  HospitalDepartment,
  HospitalDoctorAssociation,
  HospitalAppointment,
  HospitalServiceItem,
  HospitalStaffMember,
  HospitalNotification,
  HospitalDashboardStats,
} from '@/types/hospital';
import {
  Building2,
  Users,
  Stethoscope,
  Calendar,
  Layers,
  CreditCard,
  BarChart3,
  Bell,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  UserCheck,
  FileText,
  DollarSign,
  Download,
  X,
  Menu,
} from 'lucide-react';

export default function HospitalPortalPage() {
  const { language } = useLanguage();
  const { theme, toggleTheme, tokens } = useAdminTheme();

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'profile' | 'branches' | 'doctors' | 'appointments' | 'services' | 'staff' | 'subscription' | 'analytics'
  >('overview');

  // Data states
  const [stats, setStats] = useState<HospitalDashboardStats | null>(null);
  const [profile, setProfile] = useState<HospitalProfile | null>(null);
  const [branches, setBranches] = useState<HospitalBranch[]>([]);
  const [departments, setDepartments] = useState<HospitalDepartment[]>([]);
  const [doctors, setDoctors] = useState<HospitalDoctorAssociation[]>([]);
  const [appointments, setAppointments] = useState<HospitalAppointment[]>([]);
  const [services, setServices] = useState<HospitalServiceItem[]>([]);
  const [staff, setStaff] = useState<HospitalStaffMember[]>([]);
  const [notifications, setNotifications] = useState<HospitalNotification[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('01822334455');
  const [branchLimitNotice, setBranchLimitNotice] = useState<string | null>(null);

  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [inviteDocName, setInviteDocName] = useState('');
  const [inviteBmdc, setInviteBmdc] = useState('');
  const [inviteFee, setInviteFee] = useState(1000);

  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load hospital records
  const loadPortalData = async () => {
    setLoading(true);
    try {
      const [st, pr, br, dp, dc, ap, sv, sf, nt] = await Promise.all([
        HospitalService.getDashboardStats(DEMO_HOSPITAL_ID),
        HospitalService.getHospitalProfile(DEMO_HOSPITAL_ID),
        HospitalService.getBranches(DEMO_HOSPITAL_ID),
        HospitalService.getDepartments(DEMO_HOSPITAL_ID),
        HospitalService.getDoctorAssociations(DEMO_HOSPITAL_ID),
        HospitalService.getAppointments(DEMO_HOSPITAL_ID),
        HospitalService.getServices(DEMO_HOSPITAL_ID),
        HospitalService.getStaff(DEMO_HOSPITAL_ID),
        HospitalService.getNotifications(DEMO_HOSPITAL_ID),
      ]);
      setStats(st);
      setProfile(pr);
      setBranches(br);
      setDepartments(dp);
      setDoctors(dc);
      setAppointments(ap);
      setServices(sv);
      setStaff(sf);
      setNotifications(nt);
    } catch (e) {
      console.error('Failed to load hospital portal data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, []);

  // Filtered appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      !searchQuery ||
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesBranch = branchFilter === 'all' || apt.branchName === branchFilter;
    return matchesSearch && matchesStatus && matchesBranch;
  });

  // Handle add branch with subscription plan limit check
  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim()) return;

    setBranchLimitNotice(null);
    const result = await HospitalService.saveBranch({
      hospitalId: DEMO_HOSPITAL_ID,
      branch: {
        branchName: newBranchName.trim(),
        addressLine: newBranchAddress.trim(),
        phone: newBranchPhone.trim(),
        openingTime: '08:00',
        closingTime: '22:00',
        status: 'active',
      },
      currentBranchCount: branches.length,
      planBranchLimit: stats?.branchLimit || 20,
    });

    if (!result.success) {
      setBranchLimitNotice(result.message);
    } else {
      setIsAddBranchOpen(false);
      setNewBranchName('');
      setNewBranchAddress('');
      await loadPortalData();
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: tokens.bgCanvas,
        backgroundImage: tokens.ambientGlow,
        color: tokens.textPrimary,
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. Portal Top Navigation Bar */}
      <header
        style={{
          height: '70px',
          backgroundColor: tokens.topNavBg,
          backdropFilter: tokens.backdropBlur,
          borderBottom: `1px solid ${tokens.topNavBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        {/* Left: Brand & Hospital Identity Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: tokens.textPrimary,
              cursor: 'pointer',
            }}
            className="hospital-mobile-btn"
          >
            <Menu size={22} />
          </button>

          <Link href="/" style={{ textDecoration: 'none' }}>
            <BrandLogo variant="horizontal" size={28} />
          </Link>

          <span style={{ color: tokens.cardBorder }}>|</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 96, 250, 0.12)',
                color: BRAND_COLORS.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Building2 size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: tokens.textPrimary, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span>{profile?.name || 'Sylhet Central General Hospital'}</span>
                <span title="DGHS & Trade Verified"><ShieldCheck size={14} color="#10B981" /></span>
              </div>
              <div style={{ fontSize: '10.5px', color: tokens.textMuted }}>
                {language === 'bn' ? 'হাসপাতাল অ্যাডমিন কনসোল' : 'Hospital Operations Console'} • {profile?.district || 'Sylhet'}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Theme Toggle, Language, Notifications, Admin Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: tokens.cardBgSubtle,
              border: `1px solid ${tokens.cardBorder}`,
              color: theme === 'dark' ? '#38BDF8' : BRAND_COLORS.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <LanguageSwitcher variant="pills" showIcon />

          {/* Operational Notifications */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: tokens.cardBgSubtle,
                border: `1px solid ${tokens.cardBorder}`,
                color: tokens.textSecondary,
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
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                }}
              />
            </button>

            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '44px',
                  width: '320px',
                  backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                  borderRadius: '14px',
                  border: `1px solid ${tokens.cardBorder}`,
                  boxShadow: tokens.cardShadowHover,
                  padding: '16px',
                  zIndex: 50,
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 800, color: tokens.textPrimary, marginBottom: '10px' }}>
                  {language === 'bn' ? 'অপারেশনাল নোটিফিকেশনস' : 'Hospital Operations Alerts'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: '10px',
                        backgroundColor: tokens.cardBgSubtle,
                        borderRadius: '10px',
                        fontSize: '11.5px',
                        borderLeft: '3px solid #0060FA',
                      }}
                    >
                      <div style={{ fontWeight: 700, color: tokens.textPrimary }}>
                        {language === 'bn' ? n.titleBn || n.title : n.title}
                      </div>
                      <div style={{ color: tokens.textMuted, marginTop: '2px' }}>
                        {language === 'bn' ? n.messageBn || n.message : n.message}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Manager Account Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px 4px 6px',
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#0F172A',
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
                fontSize: '11px',
                fontWeight: 800,
              }}
            >
              SC
            </div>
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 800 }}>Hospital Admin</div>
              <div style={{ fontSize: '9px', color: '#38BDF8', fontWeight: 700 }}>HOSPITAL OWNER</div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Portal Workspace with Tabs */}
      <div style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '24px 20px', flex: 1, boxSizing: 'border-box' }}>
        {/* Navigation Tabs Bar */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '14px',
            borderBottom: `1px solid ${tokens.cardBorder}`,
            marginBottom: '24px',
          }}
        >
          {[
            { id: 'overview', label: 'Executive Dashboard', labelBn: 'ড্যাশবোর্ড ওভারভিউ', icon: BarChart3 },
            { id: 'profile', label: 'Hospital Profile', labelBn: 'হাসপাতাল প্রোফাইল', icon: Building2 },
            { id: 'branches', label: `Branches (${branches.length})`, labelBn: `শাখা সমূহ (${branches.length})`, icon: MapPin },
            { id: 'doctors', label: `Doctors & Departments (${doctors.length})`, labelBn: `ডাক্তার ও বিভাগ (${doctors.length})`, icon: Stethoscope },
            { id: 'appointments', label: `Appointments Desk (${appointments.length})`, labelBn: `অ্যাপয়েন্টমেন্ট কিউ (${appointments.length})`, icon: Calendar },
            { id: 'services', label: `Services & Tests (${services.length})`, labelBn: `সার্ভিস ও টেস্ট ক্যাটালগ (${services.length})`, icon: Layers },
            { id: 'staff', label: `Staff & Access (${staff.length})`, labelBn: `স্টাফ ও পারমিশন (${staff.length})`, icon: Users },
            { id: 'subscription', label: 'Subscription & Billing', labelBn: 'সাবস্ক্রিপশন ও বিলিং', icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 16px',
                  borderRadius: '11px',
                  border: 'none',
                  backgroundColor: isActive ? BRAND_COLORS.primary : 'transparent',
                  color: isActive ? '#FFFFFF' : tokens.textSecondary,
                  fontSize: '13px',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={16} />
                <span>{language === 'bn' ? tab.labelBn : tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: EXECUTIVE DASHBOARD                                     */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Membership & DGHS Verification Glass Banner */}
            <div
              style={{
                background:
                  theme === 'dark'
                    ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 13, 20, 0.98) 100%)'
                    : 'linear-gradient(135deg, #090D14 0%, #0047BA 100%)',
                borderRadius: '20px',
                padding: '24px 28px',
                color: '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', letterSpacing: '0.06em' }}>
                    DGHS LICENSED TERTIARY HOSPITAL
                  </span>
                  <span style={{ fontSize: '11px', color: '#CBD5E1' }}>•</span>
                  <span style={{ fontSize: '11px', color: '#34D399', fontWeight: 800 }}>100% VERIFIED</span>
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>
                  {profile?.name || 'Sylhet Central General Hospital'}
                </h2>
                <div style={{ fontSize: '12px', color: '#CBD5E1', marginTop: '4px' }}>
                  {language === 'bn'
                    ? `সক্রিয় সাবস্ক্রিপশন: ${stats?.currentPlanName} • নবায়ন তারিখ: ${new Date(stats?.nextRenewalDate || '').toLocaleDateString()}`
                    : `Active Membership: ${stats?.currentPlanName} • Next Renewal: ${new Date(stats?.nextRenewalDate || '').toLocaleDateString()}`}
                </div>
              </div>

              {/* Entitlement Pills in Banner */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ padding: '10px 16px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <div style={{ fontSize: '11px', color: '#93C5FD', fontWeight: 700 }}>Branch Limit</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>
                    {branches.length} / {stats?.branchLimit || 20}
                  </div>
                </div>
                <div style={{ padding: '10px 16px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <div style={{ fontSize: '11px', color: '#93C5FD', fontWeight: 700 }}>Associated Doctors</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>
                    {doctors.length} Doctors
                  </div>
                </div>
                <div style={{ padding: '10px 16px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <div style={{ fontSize: '11px', color: '#93C5FD', fontWeight: 700 }}>Today Bookings</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#34D399', marginTop: '2px' }}>
                    {stats?.todayAppointmentsCount || 18} Patients
                  </div>
                </div>
              </div>
            </div>

            {/* 6 Core Operation Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {[
                { title: 'Associated Specialists', titleBn: 'নিবন্ধিত বিশেষজ্ঞ ডাক্তার', val: doctors.length, color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', icon: Stethoscope },
                { title: 'Operational Branches', titleBn: 'সক্রিয় শাখা সমূহ', val: branches.length, color: '#0060FA', bg: 'rgba(0, 96, 250, 0.12)', icon: Building2 },
                { title: 'Active Medical Depts', titleBn: 'চিকিৎসা বিভাগ সমূহ', val: departments.length, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.12)', icon: Layers },
                { title: 'Published Services', titleBn: 'ক্যাটালগ সার্ভিস ও টেস্ট', val: services.length, color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.12)', icon: FileText },
                { title: 'Total Beds Capacity', titleBn: 'মোট শয্যা ও ইনপেশেন্ট', val: `${profile?.totalBeds || 150} Beds`, color: '#EC4899', bg: 'rgba(236, 72, 153, 0.12)', icon: UserCheck },
                { title: 'Critical Care (ICU/NICU)', titleBn: 'আইসিইউ ও সিসিইউ শয্যা', val: `${profile?.icuBeds || 18} ICU`, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)', icon: AlertTriangle },
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: tokens.cardBg,
                      backdropFilter: tokens.backdropBlur,
                      borderRadius: '16px',
                      padding: '18px',
                      border: `1px solid ${tokens.cardBorder}`,
                      boxShadow: tokens.cardShadow,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: card.bg, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={18} />
                      </div>
                      <ArrowRight size={14} color={tokens.textMuted} />
                    </div>
                    <div>
                      <div style={{ fontSize: '22px', fontWeight: 900, color: tokens.textPrimary }}>{card.val}</div>
                      <div style={{ fontSize: '12px', color: tokens.textMuted, fontWeight: 600, marginTop: '2px' }}>
                        {language === 'bn' ? card.titleBn : card.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Today's Appointment Queue Table */}
            <div
              style={{
                backgroundColor: tokens.cardBg,
                backdropFilter: tokens.backdropBlur,
                borderRadius: '18px',
                padding: '22px',
                border: `1px solid ${tokens.cardBorder}`,
                boxShadow: tokens.cardShadow,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
                    {language === 'bn' ? 'আজকের ডাক্তার চেম্বার কিউ ও অ্যাপয়েন্টমেন্ট' : "Today's Patient Queue & Chamber Operations"}
                  </h3>
                  <div style={{ fontSize: '11px', color: tokens.textMuted, marginTop: '2px' }}>
                    Live check-in and doctor room status across authorized branches.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('appointments')}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: tokens.primary,
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{language === 'bn' ? 'সম্পূর্ণ কিউ ডেস্কে যান' : 'Go to Queue Desk'}</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ backgroundColor: tokens.tableHeaderBg, borderBottom: `1px solid ${tokens.tableBorder}` }}>
                      <th style={{ padding: '10px 14px', color: tokens.textMuted }}>CODE</th>
                      <th style={{ padding: '10px 14px', color: tokens.textMuted }}>PATIENT</th>
                      <th style={{ padding: '10px 14px', color: tokens.textMuted }}>DOCTOR & CHAMBER</th>
                      <th style={{ padding: '10px 14px', color: tokens.textMuted }}>TIME</th>
                      <th style={{ padding: '10px 14px', color: tokens.textMuted }}>STATUS</th>
                      <th style={{ padding: '10px 14px', color: tokens.textMuted }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.slice(0, 4).map((apt) => (
                      <tr key={apt.id} style={{ borderBottom: `1px solid ${tokens.tableBorder}` }}>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: tokens.primary }}>{apt.bookingCode}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 700, color: tokens.textPrimary }}>{apt.patientName}</div>
                          <div style={{ fontSize: '11px', color: tokens.textMuted }}>{apt.patientPhone}</div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 700, color: tokens.textPrimary }}>{apt.doctorName}</div>
                          <div style={{ fontSize: '11px', color: tokens.textMuted }}>{apt.chamberRoom || 'Room 302'}</div>
                        </td>
                        <td style={{ padding: '12px 14px', color: tokens.textPrimary, fontWeight: 600 }}>{apt.startTime}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span
                            style={{
                              fontSize: '10.5px',
                              fontWeight: 800,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              backgroundColor: apt.status === 'checked_in' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(14, 165, 233, 0.12)',
                              color: apt.status === 'checked_in' ? '#10B981' : '#0EA5E9',
                            }}
                          >
                            {apt.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <button
                            type="button"
                            onClick={() => alert(`Marked arrival for ${apt.patientName}`)}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              backgroundColor: tokens.cardBgSubtle,
                              border: `1px solid ${tokens.cardBorder}`,
                              color: tokens.primary,
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Check-In
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: HOSPITAL PROFILE MANAGEMENT                            */}
        {/* ============================================================== */}
        {activeTab === 'profile' && profile && (
          <div style={{ maxWidth: '800px' }}>
            <div
              style={{
                backgroundColor: tokens.cardBg,
                backdropFilter: tokens.backdropBlur,
                borderRadius: '18px',
                padding: '28px',
                border: `1px solid ${tokens.cardBorder}`,
                boxShadow: tokens.cardShadow,
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: '0 0 16px 0' }}>
                {language === 'bn' ? 'হাসপাতাল অফিসিয়াল প্রোফাইল ও তথ্য' : 'Official Hospital Organization Profile'}
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    Hospital Name (English)
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    হাসপাতালের নাম (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={profile.nameBn || ''}
                    onChange={(e) => setProfile({ ...profile, nameBn: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    DGHS Registration Number (ডিজিএইচএস লাইসেন্স)
                  </label>
                  <input
                    type="text"
                    value={profile.dghsRegistrationNumber || ''}
                    onChange={(e) => setProfile({ ...profile, dghsRegistrationNumber: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    Trade License Number
                  </label>
                  <input
                    type="text"
                    value={profile.tradeLicenseNumber || ''}
                    onChange={(e) => setProfile({ ...profile, tradeLicenseNumber: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    Emergency Helpline Phone (24/7)
                  </label>
                  <input
                    type="text"
                    value={profile.emergencyPhone || profile.phone}
                    onChange={(e) => setProfile({ ...profile, emergencyPhone: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={profile.email || ''}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Bed capacity */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    Total Inpatient Bed Capacity
                  </label>
                  <input
                    type="number"
                    value={profile.totalBeds}
                    onChange={(e) => setProfile({ ...profile, totalBeds: Number(e.target.value) })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    Dedicated ICU Beds
                  </label>
                  <input
                    type="number"
                    value={profile.icuBeds}
                    onChange={(e) => setProfile({ ...profile, icuBeds: Number(e.target.value) })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert('Hospital Profile saved successfully.')}
                style={{
                  padding: '11px 24px',
                  backgroundColor: BRAND_COLORS.primary,
                  border: 'none',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {language === 'bn' ? 'প্রোফাইল আপডেট সংরক্ষণ করুন' : 'Save Organization Profile'}
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: BRANCH MANAGEMENT (PLAN ENFORCED)                       */}
        {/* ============================================================== */}
        {activeTab === 'branches' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
                  {language === 'bn' ? 'হাসপাতাল শাখা ও লোকেশন নেটওয়ার্ক' : 'Hospital Branches & Campus Locations'}
                </h2>
                <div style={{ fontSize: '12px', color: tokens.textMuted }}>
                  Subscription Limit: <strong>{branches.length} of {stats?.branchLimit || 20} Branches Used</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setBranchLimitNotice(null);
                  setIsAddBranchOpen(true);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  backgroundColor: BRAND_COLORS.primary,
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Plus size={15} />
                <span>{language === 'bn' ? 'নতুন শাখা যুক্ত করুন' : 'Add New Branch'}</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {branches.map((b) => (
                <div
                  key={b.id}
                  style={{
                    backgroundColor: tokens.cardBg,
                    backdropFilter: tokens.backdropBlur,
                    borderRadius: '16px',
                    padding: '20px',
                    border: `1px solid ${b.isMainBranch ? BRAND_COLORS.primary : tokens.cardBorder}`,
                    boxShadow: tokens.cardShadow,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
                        {b.branchName}
                      </h3>
                      {b.isMainBranch && (
                        <span style={{ fontSize: '10px', fontWeight: 800, color: BRAND_COLORS.primary, backgroundColor: 'rgba(0, 96, 250, 0.1)', padding: '2px 6px', borderRadius: '4px', marginTop: '4px', display: 'inline-block' }}>
                          MAIN CAMPUS
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                      OPERATIONAL
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: tokens.textMuted, display: 'flex', flexDirection: 'column', gap: '4px', margin: '12px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} color={tokens.primary} />
                      <span>{b.addressLine}, {b.district}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={13} color={tokens.primary} />
                      <span>{b.phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={13} color={tokens.primary} />
                      <span>{b.openingTime} - {b.closingTime}</span>
                    </div>
                  </div>

                  <div style={{ padding: '8px 12px', backgroundColor: tokens.cardBgSubtle, borderRadius: '8px', fontSize: '11.5px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: tokens.textMuted }}>Assigned Doctors:</span>
                    <strong style={{ color: tokens.textPrimary }}>{b.assignedDoctorsCount || 4} Specialists</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: DOCTORS & DEPARTMENTS ASSOCIATIONS                     */}
        {/* ============================================================== */}
        {activeTab === 'doctors' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
                  {language === 'bn' ? 'চিকিৎসক অ্যাসোসিয়েশন ও চেম্বার শিডিউল' : 'Associated Doctors & Department Specialties'}
                </h2>
                <div style={{ fontSize: '12px', color: tokens.textMuted }}>
                  Doctors retain independent accounts and consent status for hospital chambers.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddDoctorOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  backgroundColor: BRAND_COLORS.primary,
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Plus size={15} />
                <span>{language === 'bn' ? 'নতুন ডাক্তার সংযুক্ত করুন' : 'Invite / Link Doctor'}</span>
              </button>
            </div>

            {/* Doctors Table */}
            <div
              style={{
                backgroundColor: tokens.cardBg,
                backdropFilter: tokens.backdropBlur,
                borderRadius: '16px',
                border: `1px solid ${tokens.cardBorder}`,
                boxShadow: tokens.cardShadow,
                overflowX: 'auto',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: tokens.tableHeaderBg, borderBottom: `1px solid ${tokens.tableBorder}` }}>
                    <th style={{ padding: '12px 16px', color: tokens.textMuted }}>DOCTOR NAME</th>
                    <th style={{ padding: '12px 16px', color: tokens.textMuted }}>SPECIALTY & BMDC</th>
                    <th style={{ padding: '12px 16px', color: tokens.textMuted }}>BRANCH & ROOM</th>
                    <th style={{ padding: '12px 16px', color: tokens.textMuted }}>CONSULTATION FEE</th>
                    <th style={{ padding: '12px 16px', color: tokens.textMuted }}>CONSENT STATUS</th>
                    <th style={{ padding: '12px 16px', color: tokens.textMuted }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doc) => (
                    <tr key={doc.id} style={{ borderBottom: `1px solid ${tokens.tableBorder}` }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 800, color: tokens.textPrimary }}>{doc.doctorName}</div>
                        <div style={{ fontSize: '11px', color: tokens.textMuted }}>{doc.departmentName}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ color: tokens.textPrimary, fontWeight: 600 }}>{doc.doctorSpecialization}</div>
                        <div style={{ fontSize: '11px', color: tokens.primary, fontWeight: 700 }}>{doc.bmdcRegistrationNumber}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ color: tokens.textPrimary, fontWeight: 600 }}>{doc.branchName}</div>
                        <div style={{ fontSize: '11px', color: tokens.textMuted }}>{doc.chamberRoom}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 800, color: tokens.textPrimary }}>
                        ৳{doc.consultationFee} (Followup ৳{doc.followupFee})
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: doc.status === 'active' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                            color: doc.status === 'active' ? '#10B981' : '#F59E0B',
                          }}
                        >
                          {doc.status === 'active' ? 'ACTIVE' : 'PENDING CONSENT'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          type="button"
                          onClick={() => alert(`Opening chamber schedule for ${doc.doctorName}`)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            backgroundColor: tokens.cardBgSubtle,
                            border: `1px solid ${tokens.cardBorder}`,
                            color: tokens.textPrimary,
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Manage Schedule
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: APPOINTMENTS DESK OPERATIONS                            */}
        {/* ============================================================== */}
        {activeTab === 'appointments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Filter toolbar */}
            <div
              style={{
                backgroundColor: tokens.cardBg,
                backdropFilter: tokens.backdropBlur,
                borderRadius: '16px',
                padding: '16px 20px',
                border: `1px solid ${tokens.cardBorder}`,
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: tokens.inputBg,
                  border: `1px solid ${tokens.inputBorder}`,
                  borderRadius: '10px',
                  padding: '7px 12px',
                  flex: 1,
                  minWidth: '220px',
                }}
              >
                <Search size={14} color={tokens.textMuted} style={{ marginRight: '8px' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'bn' ? 'রোগী, বুকিং কোড বা ডাক্তার দিয়ে খুঁজুন...' : 'Search by patient name, booking code, or doctor...'}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '12.5px',
                    width: '100%',
                    color: tokens.textPrimary,
                  }}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  backgroundColor: tokens.inputBg,
                  border: `1px solid ${tokens.inputBorder}`,
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  color: tokens.textPrimary,
                  outline: 'none',
                }}
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked_in">Checked In</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Table */}
            <div
              style={{
                backgroundColor: tokens.cardBg,
                backdropFilter: tokens.backdropBlur,
                borderRadius: '16px',
                border: `1px solid ${tokens.cardBorder}`,
                boxShadow: tokens.cardShadow,
                overflowX: 'auto',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: tokens.tableHeaderBg, borderBottom: `1px solid ${tokens.tableBorder}` }}>
                    <th style={{ padding: '12px 16px', color: tokens.textMuted }}>BOOKING CODE</th>
                    <th style={{ padding: '12px 16px', color: tokens.textMuted }}>PATIENT</th>
                    <th style={{ padding: '12px 16px', color: tokens.textMuted }}>DOCTOR</th>
                    <th style={{ padding: '12px 16px', color: tokens.textMuted }}>BRANCH & ROOM</th>
                    <th style={{ padding: '12px 16px', color: tokens.textMuted }}>DATE & TIME</th>
                    <th style={{ padding: '12px 16px', color: tokens.textMuted }}>STATUS</th>
                    <th style={{ padding: '12px 16px', color: tokens.textMuted }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id} style={{ borderBottom: `1px solid ${tokens.tableBorder}` }}>
                      <td style={{ padding: '14px 16px', fontWeight: 800, color: tokens.primary }}>{apt.bookingCode}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: tokens.textPrimary }}>{apt.patientName}</div>
                        <div style={{ fontSize: '11px', color: tokens.textMuted }}>{apt.patientPhone}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: tokens.textPrimary }}>{apt.doctorName}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div>{apt.branchName}</div>
                        <div style={{ fontSize: '11px', color: tokens.textMuted }}>{apt.chamberRoom}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: tokens.textPrimary }}>{apt.appointmentDate}</div>
                        <div style={{ fontSize: '11px', color: tokens.textMuted }}>{apt.startTime}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor:
                              apt.status === 'checked_in'
                                ? 'rgba(16, 185, 129, 0.12)'
                                : apt.status === 'confirmed'
                                ? 'rgba(14, 165, 233, 0.12)'
                                : 'rgba(245, 158, 11, 0.12)',
                            color:
                              apt.status === 'checked_in'
                                ? '#10B981'
                                : apt.status === 'confirmed'
                                ? '#0EA5E9'
                                : '#F59E0B',
                          }}
                        >
                          {apt.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          type="button"
                          onClick={() => alert(`Updating appointment status for ${apt.bookingCode}...`)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            backgroundColor: tokens.cardBgSubtle,
                            border: `1px solid ${tokens.cardBorder}`,
                            color: tokens.primary,
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: SERVICES & DIAGNOSTIC CATALOG                           */}
        {/* ============================================================== */}
        {activeTab === 'services' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
                  {language === 'bn' ? 'সার্ভিস ও ডায়াগনস্টিক টেস্ট ক্যাটালগ' : 'Healthcare Services & Diagnostic Test Catalog'}
                </h2>
                <div style={{ fontSize: '12px', color: tokens.textMuted }}>
                  Subscription Limit: <strong>{services.length} of {stats?.serviceLimit || 1000} Services Published</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {services.map((srv) => (
                <div
                  key={srv.id}
                  style={{
                    backgroundColor: tokens.cardBg,
                    backdropFilter: tokens.backdropBlur,
                    borderRadius: '16px',
                    padding: '18px',
                    border: `1px solid ${tokens.cardBorder}`,
                    boxShadow: tokens.cardShadow,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '10.5px', fontWeight: 800, color: tokens.primary, backgroundColor: 'rgba(0, 96, 250, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                      {srv.category}
                    </span>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: tokens.textPrimary, margin: '6px 0 2px 0' }}>
                      {srv.name}
                    </h3>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: tokens.textPrimary, margin: '8px 0' }}>
                      ৳{srv.priceBdt.toLocaleString()}
                      {srv.discountPriceBdt && (
                        <span style={{ fontSize: '12px', color: '#10B981', marginLeft: '6px' }}>
                          (Discount ৳{srv.discountPriceBdt.toLocaleString()})
                        </span>
                      )}
                    </div>
                  </div>

                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#10B981' }}>
                    ✓ Available at Main Campus
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: STAFF DIRECTORY & ACCESS CONTROL                        */}
        {/* ============================================================== */}
        {activeTab === 'staff' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
                  {language === 'bn' ? 'হাসপাতাল স্টাফ ও রোল-বেসড এক্সেস' : 'Hospital Staff Directory & Access Control'}
                </h2>
                <div style={{ fontSize: '12px', color: tokens.textMuted }}>
                  Enforce strict role scoping: receptionists cannot view billing or owner credentials.
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {staff.map((st) => (
                <div
                  key={st.id}
                  style={{
                    backgroundColor: tokens.cardBg,
                    backdropFilter: tokens.backdropBlur,
                    borderRadius: '16px',
                    padding: '18px',
                    border: `1px solid ${tokens.cardBorder}`,
                    boxShadow: tokens.cardShadow,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
                        {st.fullName}
                      </h3>
                      <div style={{ fontSize: '11px', color: tokens.primary, fontWeight: 700, marginTop: '2px', textTransform: 'uppercase' }}>
                        {st.role.replace('_', ' ')}
                      </div>
                    </div>
                    <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '2px 6px', borderRadius: '4px' }}>
                      ACTIVE
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: tokens.textMuted, margin: '12px 0' }}>
                    <div>Email: {st.email}</div>
                    <div>Phone: {st.phone}</div>
                  </div>

                  <div style={{ fontSize: '11px', color: tokens.textSecondary, borderTop: `1px solid ${tokens.cardBorderSubtle}`, paddingTop: '8px' }}>
                    Permissions: Appointments ({st.canManageAppointments ? '✓' : '✗'}), Doctors ({st.canManageDoctors ? '✓' : '✗'}), Billing ({st.canManageBilling ? '✓' : '✗'})
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 8: SUBSCRIPTION & BILLING HUB                              */}
        {/* ============================================================== */}
        {activeTab === 'subscription' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                backgroundColor: tokens.cardBg,
                backdropFilter: tokens.backdropBlur,
                borderRadius: '18px',
                padding: '24px',
                border: `1px solid ${tokens.cardBorder}`,
                boxShadow: tokens.cardShadow,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
                    {language === 'bn' ? 'বর্তমান সাবস্ক্রিপশন ও সদস্যপদ' : 'Hospital Membership & Billing Invariant'}
                  </h2>
                  <div style={{ fontSize: '12px', color: tokens.textMuted, marginTop: '2px' }}>
                    Zero patient booking commissions • Fixed predictable recurring SaaS billing.
                  </div>
                </div>

                <Link
                  href="/provider/subscription"
                  style={{
                    padding: '9px 16px',
                    borderRadius: '10px',
                    backgroundColor: BRAND_COLORS.primary,
                    color: '#FFFFFF',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <CreditCard size={15} />
                  <span>{language === 'bn' ? 'প্ল্যান আপগ্রেড / রিনিউ' : 'Upgrade / Renew Plan'}</span>
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontSize: '12.5px' }}>
                <div style={{ padding: '14px', backgroundColor: tokens.cardBgSubtle, borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', color: tokens.textMuted }}>Current Plan</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: tokens.textPrimary, marginTop: '2px' }}>{stats?.currentPlanName}</div>
                </div>
                <div style={{ padding: '14px', backgroundColor: tokens.cardBgSubtle, borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', color: tokens.textMuted }}>Billing Interval</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: tokens.textPrimary, marginTop: '2px' }}>Monthly (৳8,000 / mo)</div>
                </div>
                <div style={{ padding: '14px', backgroundColor: tokens.cardBgSubtle, borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', color: tokens.textMuted }}>Next Renewal Date</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: tokens.textPrimary, marginTop: '2px' }}>
                    {new Date(stats?.nextRenewalDate || '').toLocaleDateString()}
                  </div>
                </div>
                <div style={{ padding: '14px', backgroundColor: tokens.cardBgSubtle, borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', color: tokens.textMuted }}>Allowed Branches</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>
                    Up to {stats?.branchLimit || 20} Locations
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD BRANCH */}
      {isAddBranchOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF', borderRadius: '20px', padding: '26px', maxWidth: '480px', width: '100%', position: 'relative' }}>
            <button type="button" onClick={() => setIsAddBranchOpen(false)} style={{ position: 'absolute', top: '18px', right: '18px', border: 'none', background: 'none', cursor: 'pointer', color: tokens.textMuted }}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: '0 0 14px 0' }}>Add New Branch Campus</h2>
            {branchLimitNotice && (
              <div style={{ padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', borderRadius: '8px', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>
                {branchLimitNotice}
              </div>
            )}
            <form onSubmit={handleCreateBranch} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary }}>Branch Campus Name *</label>
                <input type="text" required value={newBranchName} onChange={(e) => setNewBranchName(e.target.value)} placeholder="e.g. Amberkhana Consultation Unit" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary }}>Address Line *</label>
                <input type="text" required value={newBranchAddress} onChange={(e) => setNewBranchAddress(e.target.value)} placeholder="e.g. Amberkhana Point, Sylhet" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, boxSizing: 'border-box' }} />
              </div>
              <button type="submit" style={{ padding: '11px', borderRadius: '10px', backgroundColor: BRAND_COLORS.primary, border: 'none', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer', marginTop: '6px' }}>Save Branch</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LINK DOCTOR */}
      {isAddDoctorOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF', borderRadius: '20px', padding: '26px', maxWidth: '480px', width: '100%', position: 'relative' }}>
            <button type="button" onClick={() => setIsAddDoctorOpen(false)} style={{ position: 'absolute', top: '18px', right: '18px', border: 'none', background: 'none', cursor: 'pointer', color: tokens.textMuted }}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: '0 0 14px 0' }}>Invite / Link Doctor to Hospital</h2>
            <div style={{ fontSize: '12px', color: tokens.textMuted, marginBottom: '14px' }}>
              Doctors must verify BMDC registration and give consent before consultation slots are published.
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert(`Doctor invitation sent to ${inviteDocName}`); setIsAddDoctorOpen(false); }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary }}>Doctor Full Name *</label>
                <input type="text" required value={inviteDocName} onChange={(e) => setInviteDocName(e.target.value)} placeholder="e.g. Dr. Mahfuzur Rahman" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary }}>BMDC Registration Number *</label>
                <input type="text" required value={inviteBmdc} onChange={(e) => setInviteBmdc(e.target.value)} placeholder="e.g. BMDC-A-44912" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary }}>Consultation Fee in BDT (৳) *</label>
                <input type="number" required value={inviteFee} onChange={(e) => setInviteFee(Number(e.target.value))} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, boxSizing: 'border-box' }} />
              </div>
              <button type="submit" style={{ padding: '11px', borderRadius: '10px', backgroundColor: BRAND_COLORS.primary, border: 'none', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer', marginTop: '6px' }}>Send Association Request</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
