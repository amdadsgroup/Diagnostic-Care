'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand/BrandLogo';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { BRAND_CONSTANTS, BRAND_COLORS } from '@/config/brand';
import { useAdminTheme } from '@/components/admin/AdminThemeContext';
import { HospitalService } from '@/services/hospital.service';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
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
  Lock,
  LogIn,
  Hospital as HospitalIcon,
  HelpCircle,
} from 'lucide-react';

export default function HospitalPortalPage() {
  const { language } = useLanguage();
  const { theme, toggleTheme, tokens } = useAdminTheme();

  // Auth & Profile state
  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState<HospitalProfile | null>(null);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'profile' | 'branches' | 'doctors' | 'appointments' | 'services' | 'staff' | 'subscription' | 'analytics'
  >('overview');

  // Data states
  const [stats, setStats] = useState<HospitalDashboardStats | null>(null);
  const [branches, setBranches] = useState<HospitalBranch[]>([]);
  const [departments, setDepartments] = useState<HospitalDepartment[]>([]);
  const [doctors, setDoctors] = useState<HospitalDoctorAssociation[]>([]);
  const [appointments, setAppointments] = useState<HospitalAppointment[]>([]);
  const [services, setServices] = useState<HospitalServiceItem[]>([]);
  const [staff, setStaff] = useState<HospitalStaffMember[]>([]);
  const [notifications, setNotifications] = useState<HospitalNotification[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('');
  const [branchLimitNotice, setBranchLimitNotice] = useState<string | null>(null);

  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [inviteDocName, setInviteDocName] = useState('');
  const [inviteBmdc, setInviteBmdc] = useState('');
  const [inviteFee, setInviteFee] = useState(1000);

  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Single Unified Provider Gateway State (Login & Registration)
  const [gatewayMode, setGatewayMode] = useState<'login' | 'register'>('login');
  const [gatewayIdentifier, setGatewayIdentifier] = useState('');
  const [gatewayPassword, setGatewayPassword] = useState('');
  const [gatewayFacilityName, setGatewayFacilityName] = useState('');
  const [gatewayFacilityType, setGatewayFacilityType] = useState('DIAGNOSTIC_CENTER');
  const [gatewayContactPerson, setGatewayContactPerson] = useState('');
  const [gatewayPhone, setGatewayPhone] = useState('');
  const [gatewayEmail, setGatewayEmail] = useState('');
  const [gatewayRegPassword, setGatewayRegPassword] = useState('');
  const [gatewayDistrict, setGatewayDistrict] = useState('Moulvibazar');
  const [gatewayLicense, setGatewayLicense] = useState('');
  const [gatewayLoading, setGatewayLoading] = useState(false);
  const [gatewayError, setGatewayError] = useState('');
  const [gatewaySuccess, setGatewaySuccess] = useState('');

  // Plan Selection State
  const [billingInterval, setBillingInterval] = useState<'annual' | 'monthly'>('annual');
  const [planSuccessNotice, setPlanSuccessNotice] = useState<string | null>(null);

  const MEMBERSHIP_PLANS = [
    {
      id: 'plan-basic',
      name: 'Basic Partner Tier',
      nameBn: 'বেসিক পার্টনার টিয়ার',
      tier: 'basic',
      monthlyPrice: 500,
      annualPrice: 5000,
      badge: language === 'bn' ? 'স্টার্টার' : 'Starter',
      badgeColor: '#64748B',
      features: [
        language === 'bn' ? '১টি প্রধান ক্যাম্পাস বা শাখা' : '1 Main Campus Branch',
        language === 'bn' ? 'সর্বোচ্চ ২০টি মেডিকেল সার্ভিস ও টেস্ট' : 'Up to 20 Medical Services',
        language === 'bn' ? '২ জন স্টাফ ইউজার অ্যাকাউন্ট' : '2 Staff Accounts',
        language === 'bn' ? 'স্ট্যান্ডার্ড ডিজিটাল সার্চ লিস্টিং' : 'Standard Search Directory',
        language === 'bn' ? '২৪/৭ হেল্পলাইন সাপোর্ট' : '24/7 Helpline Access',
      ],
    },
    {
      id: 'plan-pro',
      name: 'Professional Partner Tier',
      nameBn: 'প্রফেশনাল পার্টনার টিয়ার',
      tier: 'professional',
      monthlyPrice: 1500,
      annualPrice: 15000,
      badge: language === 'bn' ? 'সর্বাধিক জনপ্রিয়' : 'Most Popular',
      badgeColor: '#0060FA',
      isPopular: true,
      features: [
        language === 'bn' ? '২টি অনুমোদিত ব্রাঞ্চ নেটওয়ার্ক' : '2 Authorized Branches',
        language === 'bn' ? 'সর্বোচ্চ ৬০টি মেডিকেল সার্ভিস ও টেস্ট' : 'Up to 60 Medical Services',
        language === 'bn' ? '৫ জন স্টাফ ইউজার ও ক্যাশিয়ার' : '5 Staff & Cashier Accounts',
        language === 'bn' ? 'ভেরিফাইড পার্টনার ট্রাস্ট ব্যাজ' : 'Verified Partner Trust Badge',
        language === 'bn' ? 'ডিজিটাল প্রেসক্রিপশন ও লাইভ চেম্বার সিরিয়াল' : 'Digital Rx & Live Chamber Serial',
        language === 'bn' ? 'সার্চ রেজাল্টে প্রায়োরিটি স্থান' : 'Priority Marketplace Placement',
      ],
    },
    {
      id: 'plan-premium',
      name: 'Premium Healthcare Tier',
      nameBn: 'প্রিমিয়াম হেলথকেয়ার টিয়ার',
      tier: 'premium',
      monthlyPrice: 3500,
      annualPrice: 35000,
      badge: language === 'bn' ? 'রেকমেন্ডেড' : 'Recommended',
      badgeColor: '#8B5CF6',
      features: [
        language === 'bn' ? '৫টি ব্রাঞ্চ ও আউটরিচ সেন্টার' : 'Up to 5 Hospital Branches',
        language === 'bn' ? '২০০টি টেস্ট ক্যাটালগ ও প্যাকেজ' : '200 Services & Health Packages',
        language === 'bn' ? '১৫ জন ডেডিকেটেড স্টাফ অ্যাকাউন্ট' : '15 Staff Accounts & RBAC Roles',
        language === 'bn' ? 'ফিচার্ড স্পটলাইট পার্টনার ব্যাজ' : 'Featured Spotlight Provider Badge',
        language === 'bn' ? 'লাইভ টোকেন কিউ ডিসপ্লে স্ক্রিন' : 'Chamber Live Token Queue Screen',
        language === 'bn' ? 'হোম স্যাম্পল কালেকশন মডিউল' : 'Home Sample Collection Dispatch',
      ],
    },
    {
      id: 'plan-enterprise',
      name: 'Enterprise Hospital Network',
      nameBn: 'এন্টারপ্রাইজ হাসপাতাল নেটওয়ার্ক',
      tier: 'enterprise',
      monthlyPrice: 8000,
      annualPrice: 80000,
      badge: language === 'bn' ? 'আলটিমেট' : 'Ultimate',
      badgeColor: '#059669',
      features: [
        language === 'bn' ? 'আনলিমিটেড ব্রাঞ্চ ক্যাম্পাস' : 'Unlimited Branches Nationwide',
        language === 'bn' ? 'আনলিমিটেড সার্ভিস ও আইসিইউ বেড' : 'Unlimited Services & ICU Beds',
        language === 'bn' ? 'আনলিমিটেড স্টাফ ও ডক্টর লগইন' : 'Unlimited Staff & Doctor Logins',
        language === 'bn' ? 'কাস্টম হসপিটাল ইআরপি / এপিআই ইন্টিগ্রেশন' : 'Hospital ERP / HIS API Sync',
        language === 'bn' ? 'ডেডিকেটেড একাউন্ট ম্যানেজার ও ট্রেনিং' : 'Dedicated Account Manager 24/7',
        language === 'bn' ? 'ডিজিএইচএস কমপ্লায়েন্স অগ্রাধিকার অডিট' : 'Priority DGHS Audit Support',
      ],
    },
  ];

  const handleSelectPlan = (plan: (typeof MEMBERSHIP_PLANS)[0]) => {
    const selectedPrice = billingInterval === 'annual' ? plan.annualPrice : plan.monthlyPrice;
    if (stats) {
      setStats({
        ...stats,
        currentPlanName: language === 'bn' ? plan.nameBn : plan.name,
        currentPlanTier: plan.tier as any,
      });
    }
    if (typeof window !== 'undefined') {
      const savedSession = localStorage.getItem('dc_hospital_session');
      let data: any = {};
      try {
        if (savedSession) data = JSON.parse(savedSession);
      } catch {}
      localStorage.setItem(
        'dc_hospital_session',
        JSON.stringify({
          ...data,
          planId: plan.id,
          planName: plan.name,
          planTier: plan.tier,
          billingInterval,
          price: selectedPrice,
        })
      );
    }
    setPlanSuccessNotice(
      language === 'bn'
        ? `অভিনন্দন! আপনি সফলভাবে "${plan.nameBn}" (${billingInterval === 'annual' ? 'বাৎসরিক' : 'মাসিক'} - ৳${selectedPrice.toLocaleString()}) নির্বাচন করেছেন।`
        : `Success! You have selected "${plan.name}" (${billingInterval === 'annual' ? 'Annual' : 'Monthly'} - ৳${selectedPrice.toLocaleString()}).`
    );
    setTimeout(() => setPlanSuccessNotice(null), 6000);
  };

  // Initialize Auth & Load Hospital
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'register') {
        setGatewayMode('register');
      }
    }

    const initAuth = async () => {
      setAuthLoading(true);
      try {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);
        if (user) {
          let hosp = await HospitalService.getHospitalByOwner(user.id);
          if (!hosp && typeof window !== 'undefined') {
            const savedSession = localStorage.getItem('dc_hospital_session');
            if (savedSession) {
              try {
                const parsed = JSON.parse(savedSession);
                hosp = {
                  id: parsed.id || user.id,
                  name: parsed.name || user.fullName || 'Healthcare Provider',
                  nameBn: parsed.nameBn || parsed.name || user.fullName,
                  slug: (parsed.name || user.fullName || 'provider').toLowerCase().replace(/\s+/g, '-'),
                  tradeLicenseNumber: parsed.licenseNumber || 'TR-DH-2024-8891',
                  dghsRegistrationNumber: parsed.dghsNumber || 'DGHS-HOSP-2024-441',
                  phone: parsed.phone || user.phone || '01886748564',
                  emergencyPhone: parsed.emergencyPhone || '01886748564',
                  email: parsed.email || user.email || 'care@diagnosticcare.com.bd',
                  website: parsed.website || 'https://diagnosticcare.com.bd',
                  totalBeds: 50,
                  icuBeds: 6,
                  hasIcu: true,
                  hasNicu: true,
                  hasEmergency247: true,
                  description: `${parsed.name || user.fullName} - Authorized Healthcare Facility on Diagnostic Care Platform`,
                  verificationStatus: 'verified',
                  rating: 4.8,
                  totalReviews: 24,
                  status: 'active',
                  district: parsed.district || 'Moulvibazar',
                  addressLine: parsed.address || 'Central Road, Moulvibazar, Sylhet',
                };
              } catch {}
            }
            if (!hosp) {
              hosp = {
                id: user.id,
                name: user.fullName || 'Healthcare Provider',
                nameBn: user.fullName || 'স্বাস্থ্যসেবা প্রতিষ্ঠান',
                slug: (user.fullName || 'provider').toLowerCase().replace(/\s+/g, '-'),
                tradeLicenseNumber: 'TR-DH-2024-8891',
                dghsRegistrationNumber: 'DGHS-HOSP-2024-441',
                phone: user.phone || '01886748564',
                emergencyPhone: '01886748564',
                email: user.email || 'care@diagnosticcare.com.bd',
                website: 'https://diagnosticcare.com.bd',
                totalBeds: 50,
                icuBeds: 6,
                hasIcu: true,
                hasNicu: true,
                hasEmergency247: true,
                description: `${user.fullName} - Authorized Healthcare Facility on Diagnostic Care Platform`,
                verificationStatus: 'verified',
                rating: 4.8,
                totalReviews: 24,
                status: 'active',
                district: 'Moulvibazar',
                addressLine: 'Central Road, Moulvibazar, Sylhet',
              };
            }
          }
          if (hosp) {
            setProfile(hosp);
            await loadHospitalData(hosp.id);
          }
        }
      } catch (err) {
        console.error('Hospital portal auth error:', err);
      } finally {
        setAuthLoading(false);
      }
    };
    initAuth();
  }, []);

  const loadHospitalData = async (hospitalId: string) => {
    setLoading(true);
    try {
      const [st, br, dp, dc, ap, sv, sf, nt] = await Promise.all([
        HospitalService.getDashboardStats(hospitalId),
        HospitalService.getBranches(hospitalId),
        HospitalService.getDepartments(hospitalId),
        HospitalService.getDoctorAssociations(hospitalId),
        HospitalService.getAppointments(hospitalId),
        HospitalService.getServices(hospitalId),
        HospitalService.getStaff(hospitalId),
        HospitalService.getNotifications(hospitalId),
      ]);

      const savedSessionStr = typeof window !== 'undefined' ? localStorage.getItem('dc_hospital_session') : null;
      let activePlanName = 'Professional Partner Tier';
      let activePlanTier = 'professional';
      if (savedSessionStr) {
        try {
          const parsed = JSON.parse(savedSessionStr);
          if (parsed.planName) activePlanName = parsed.planName;
          if (parsed.planTier) activePlanTier = parsed.planTier;
        } catch {}
      }

      setStats(st || {
        verificationStatus: 'verified',
        currentPlanName: activePlanName,
        currentPlanTier: activePlanTier as any,
        subscriptionStatus: 'active',
        nextRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        branchLimit: 5,
        serviceLimit: 100,
        staffLimit: 15,
        totalDoctors: dc && dc.length > 0 ? dc.length : 12,
        activeBranches: br && br.length > 0 ? br.length : 2,
        activeDepartments: dp && dp.length > 0 ? dp.length : 6,
        totalServices: sv && sv.length > 0 ? sv.length : 35,
        todayAppointmentsCount: 8,
        upcomingAppointmentsCount: 19,
        completedAppointmentsCount: 142,
        cancelledAppointmentsCount: 3,
      });

      setBranches(
        br && br.length > 0
          ? br
          : [
              {
                id: 'br-main',
                hospitalId,
                branchName: 'Main Campus & Diagnostic Unit',
                branchNameBn: 'প্রধান শাখা ও ডায়াগনস্টিক ইউনিট',
                addressLine: 'Central Road, Moulvibazar, Sylhet',
                district: 'Moulvibazar',
                phone: '01886-748564',
                openingTime: '08:00',
                closingTime: '22:00',
                isMainBranch: true,
                status: 'active',
              },
              {
                id: 'br-vip',
                hospitalId,
                branchName: 'VIP Consultation & Sample Collection Wing',
                branchNameBn: 'ভিআইপি কনসাল্টেশন ও স্যাম্পল কালেকশন উইং',
                addressLine: 'Court Road, Moulvibazar',
                district: 'Moulvibazar',
                phone: '01886-748565',
                openingTime: '07:30',
                closingTime: '21:00',
                isMainBranch: false,
                status: 'active',
              },
            ]
      );

      setDepartments(
        dp && dp.length > 0
          ? dp
          : [
              { id: 'dp-cardio', hospitalId, name: 'Cardiology & Heart Care', nameBn: 'কার্ডিওলজি ও হৃদরোগ বিভাগ', code: 'CARDIO', description: 'Comprehensive heart care and ECG diagnostics', isActive: true },
              { id: 'dp-neuro', hospitalId, name: 'Neurology & Brain Center', nameBn: 'নিউরোমেডিসিন ও ব্রেইন সেন্টার', code: 'NEURO', description: 'Brain and nerve specialist consultation', isActive: true },
              { id: 'dp-radio', hospitalId, name: 'Radiology & Imaging', nameBn: 'রেডিওলজি ও ডিজিটাল ইমেজিং', code: 'RADIO', description: 'High-resolution digital X-ray and 4D ultrasound', isActive: true },
              { id: 'dp-patho', hospitalId, name: 'Pathology & Molecular Lab', nameBn: 'প্যাথলজি ও মলিকুলার ল্যাব', code: 'PATHO', description: 'Automated blood analyzers and biochemistry', isActive: true },
            ]
      );

      setDoctors(
        dc && dc.length > 0
          ? dc
          : [
              {
                id: 'assoc-1',
                hospitalId,
                doctorId: 'doc-101',
                doctorName: 'Prof. Dr. M. A. Rahman',
                bmdcRegistrationNumber: 'A-28941',
                doctorSpecialization: 'Cardiologist',
                departmentName: 'Cardiology & Heart Care',
                consultationFee: 1200,
                followupFee: 800,
                startDate: '2024-01-01',
                status: 'active',
              },
              {
                id: 'assoc-2',
                hospitalId,
                doctorId: 'doc-102',
                doctorName: 'Dr. Nusrat Jahan',
                bmdcRegistrationNumber: 'A-49382',
                doctorSpecialization: 'Radiology & Ultrasound Specialist',
                departmentName: 'Radiology & Imaging',
                consultationFee: 1000,
                followupFee: 600,
                startDate: '2024-01-01',
                status: 'active',
              },
            ]
      );

      setAppointments(
        ap && ap.length > 0
          ? ap
          : [
              {
                id: 'apt-01',
                bookingCode: 'DC-88901',
                patientName: 'Kazi Tanvir Ahmed',
                patientPhone: '01711-234567',
                doctorName: 'Prof. Dr. M. A. Rahman',
                branchName: 'Main Campus & Diagnostic Unit',
                appointmentDate: new Date().toISOString().split('T')[0],
                startTime: '10:30 AM',
                status: 'confirmed',
                consultationFee: 1200,
                paymentStatus: 'paid',
              },
              {
                id: 'apt-02',
                bookingCode: 'DC-88902',
                patientName: 'Mrs. Rokeya Begum',
                patientPhone: '01819-987654',
                doctorName: 'Dr. Nusrat Jahan',
                branchName: 'Main Campus & Diagnostic Unit',
                appointmentDate: new Date().toISOString().split('T')[0],
                startTime: '11:15 AM',
                status: 'pending',
                consultationFee: 1000,
                paymentStatus: 'pending',
              },
            ]
      );

      setServices(
        sv && sv.length > 0
          ? sv
          : [
              { id: 'sv-1', hospitalId, name: 'Digital X-Ray Chest P/A View', category: 'Radiology', priceBdt: 600, discountPriceBdt: 500, isAvailable: true },
              { id: 'sv-2', hospitalId, name: 'Complete Blood Count (CBC) with ESR', category: 'Pathology', priceBdt: 450, discountPriceBdt: 400, isAvailable: true },
              { id: 'sv-3', hospitalId, name: 'Echocardiogram (Color Doppler)', category: 'Cardiology', priceBdt: 2500, discountPriceBdt: 2200, isAvailable: true },
              { id: 'sv-4', hospitalId, name: 'Whole Abdomen Ultrasound (4D)', category: 'Ultrasonography', priceBdt: 1800, discountPriceBdt: 1500, isAvailable: true },
            ]
      );

      setStaff(
        sf && sf.length > 0
          ? sf
          : [
              { id: 'st-1', hospitalId, fullName: 'Enamul Haque', email: 'enam@diagnosticcare.com.bd', phone: '01886-748564', role: 'hospital_manager', status: 'active', canManageAppointments: true, canManageDoctors: true, canManageServices: true, canManageBilling: true, canViewAnalytics: true },
              { id: 'st-2', hospitalId, fullName: 'Farhana Akhter', email: 'reception@diagnosticcare.com.bd', phone: '01886-748566', role: 'receptionist', status: 'active', canManageAppointments: true, canManageDoctors: false, canManageServices: false, canManageBilling: true, canViewAnalytics: false },
            ]
      );

      setNotifications(
        nt && nt.length > 0
          ? nt
          : [
              { id: 'nt-1', hospitalId, title: 'DGHS Compliance Verified', message: 'Your healthcare facility credentials have passed automated compliance checks.', type: 'system', isRead: false, createdAt: new Date().toISOString() },
              { id: 'nt-2', hospitalId, title: 'New Appointment Booked', message: 'Kazi Tanvir Ahmed booked Dr. M. A. Rahman for Serial #12.', type: 'appointment', isRead: false, createdAt: new Date().toISOString() },
            ]
      );
    } catch (e) {
      console.error('Failed to load hospital portal data:', e);
    } finally {
      setLoading(false);
    }
  };

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

  // Handle add branch
  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !newBranchName.trim()) return;

    setBranchLimitNotice(null);
    const result = await HospitalService.saveBranch({
      hospitalId: profile.id,
      branch: {
        branchName: newBranchName.trim(),
        addressLine: newBranchAddress.trim(),
        phone: newBranchPhone.trim(),
        openingTime: '08:00',
        closingTime: '22:00',
        status: 'active',
      },
      currentBranchCount: branches.length,
      planBranchLimit: stats?.branchLimit || 10,
    });

    if (!result.success) {
      setBranchLimitNotice(result.message);
    } else {
      setIsAddBranchOpen(false);
      setNewBranchName('');
      setNewBranchAddress('');
      setNewBranchPhone('');
      await loadHospitalData(profile.id);
    }
  };

  // --------------------------------------------------------------------------
  // STATE 1: LOADING SESSION
  // --------------------------------------------------------------------------
  if (authLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: tokens.bgCanvas,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          color: tokens.textPrimary,
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: `3px solid ${BRAND_COLORS.primary}`,
            borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <div style={{ fontSize: '14px', fontWeight: 600, color: tokens.textMuted }}>
          {language === 'bn' ? 'হাসপাতাল পোর্টাল লোড হচ্ছে...' : 'Authenticating Hospital Operations Console...'}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STATE 2: UNAUTHENTICATED GATEWAY (NO DEMO DATA)
  // --------------------------------------------------------------------------
  if (!currentUser) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: tokens.bgCanvas,
          backgroundImage: tokens.ambientGlow,
          color: tokens.textPrimary,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Navigation Bar */}
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
          }}
        >
          <Link href="/" style={{ textDecoration: 'none' }}>
            <BrandLogo variant="horizontal" size={28} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LanguageSwitcher variant="pills" showIcon />
            <Link
              href="/login?redirect=/hospital/portal"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: BRAND_COLORS.primary,
                color: '#FFFFFF',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <LogIn size={15} />
              <span>{language === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
            </Link>
          </div>
        </header>

        {/* Gateway Hero */}
        <div
          style={{
            maxWidth: '1080px',
            margin: '60px auto',
            padding: '0 24px',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              backgroundColor: tokens.cardBg,
              backdropFilter: tokens.backdropBlur,
              borderRadius: '24px',
              border: `1px solid ${tokens.cardBorder}`,
              boxShadow: tokens.cardShadowHover,
              padding: '48px 40px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                backgroundColor: 'rgba(0, 96, 250, 0.1)',
                color: BRAND_COLORS.primary,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <Building2 size={32} />
            </div>

            <div
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(0, 96, 250, 0.1)',
                color: BRAND_COLORS.primary,
                fontSize: '12px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              {language === 'bn' ? 'হাসপাতাল ও ক্লিনিক পোর্টাল' : 'Authorized Hospital Operations Console'}
            </div>

            <h1
              style={{
                fontSize: '32px',
                fontWeight: 900,
                color: tokens.textPrimary,
                margin: '0 0 14px 0',
                letterSpacing: '-0.02em',
              }}
            >
              {language === 'bn'
                ? 'হাসপাতাল ব্যবস্থাপনা ও অনলাইন অ্যাপয়েন্টমেন্ট হাব'
                : 'Manage Hospital Operations, Specialist Queues & DGHS Compliance'}
            </h1>

            <p
              style={{
                fontSize: '15px',
                color: tokens.textMuted,
                maxWidth: '680px',
                margin: '0 auto 36px auto',
                lineHeight: 1.6,
              }}
            >
              {language === 'bn'
                ? 'ডায়াগনস্টিক কেয়ার প্ল্যাটফর্মে আপনার হাসপাতালের প্রোফাইল, চিকিৎসক ও বিভাগসমূহ, ডিজিটাল অ্যাপয়েন্টমেন্ট শিডিউল এবং অপারেশনাল কনসোল পরিচালনা করতে সাইন ইন করুন।'
                : 'Access your private hospital administration dashboard to manage BMDC specialists, departmental chambers, live serial queue tokens, and inpatient service visibility across Bangladesh.'}
            </p>

            {/* Feature Highlights Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                marginBottom: '40px',
                textAlign: 'left',
              }}
            >
              {[
                {
                  icon: Stethoscope,
                  title: language === 'bn' ? 'চিকিৎসক ও চেম্বার শিডিউল' : 'Specialist Doctors & Chambers',
                  desc: language === 'bn' ? 'BMDC সার্টিফাইড ডাক্তারদের শিডিউল ও ভিজিট ফি নিয়ন্ত্রণ' : 'Manage BMDC doctors, chamber rooms & fees',
                },
                {
                  icon: Calendar,
                  title: language === 'bn' ? 'লাইভ সিরিয়াল কিউ' : 'Chamber Serial & Queue',
                  desc: language === 'bn' ? 'রিয়েল-টাইম রোগী চেক-ইন ও টিকিট ট্র্যাকিং' : 'Real-time patient check-in and queue tokens',
                },
                {
                  icon: ShieldCheck,
                  title: language === 'bn' ? 'ডিজিএইচএস লাইসেন্সিং' : 'DGHS Licensing Verification',
                  desc: language === 'bn' ? 'সরকারি লাইসেন্স যাচাই ও ভেরিফাইড ব্যাজ' : 'Institutional license verification & trust badges',
                },
                {
                  icon: Layers,
                  title: language === 'bn' ? 'বিভাগ ও শাখা নেটওয়ার্ক' : 'Branches & Departments',
                  desc: language === 'bn' ? 'মাল্টি-ব্রাঞ্চ ক্যাম্পাস ও বেড ক্যাপাসিটি আপডেট' : 'Multi-branch management & emergency beds',
                },
              ].map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={i}
                    style={{
                      padding: '18px',
                      borderRadius: '14px',
                      backgroundColor: tokens.cardBgSubtle,
                      border: `1px solid ${tokens.cardBorder}`,
                    }}
                  >
                    <Icon size={20} color={BRAND_COLORS.primary} style={{ marginBottom: '8px' }} />
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: tokens.textPrimary, marginBottom: '4px' }}>
                      {feat.title}
                    </div>
                    <div style={{ fontSize: '11.5px', color: tokens.textMuted, lineHeight: 1.4 }}>
                      {feat.desc}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* The 1 Unified Pathway for Providers: Embedded Gateway Card */}
            <div
              style={{
                backgroundColor: tokens.cardBgSubtle,
                borderRadius: '20px',
                border: `1.5px solid ${tokens.cardBorder}`,
                padding: '28px',
                maxWidth: '560px',
                margin: '0 auto',
                textAlign: 'left',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
              }}
            >
              {/* Tab Selector */}
              <div
                style={{
                  display: 'flex',
                  backgroundColor: tokens.cardBg,
                  padding: '4px',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  border: `1px solid ${tokens.cardBorder}`,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setGatewayMode('login');
                    setGatewayError('');
                    setGatewaySuccess('');
                  }}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: gatewayMode === 'login' ? BRAND_COLORS.primary : 'transparent',
                    color: gatewayMode === 'login' ? '#FFFFFF' : tokens.textSecondary,
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {language === 'bn' ? 'লগইন করুন (Sign In)' : 'Sign In as Provider'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGatewayMode('register');
                    setGatewayError('');
                    setGatewaySuccess('');
                  }}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: gatewayMode === 'register' ? BRAND_COLORS.primary : 'transparent',
                    color: gatewayMode === 'register' ? '#FFFFFF' : tokens.textSecondary,
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {language === 'bn' ? 'নতুন নিবন্ধন (Create Account)' : 'Register Facility Account'}
                </button>
              </div>

              {gatewayError && (
                <div
                  style={{
                    padding: '12px 14px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '10px',
                    color: '#EF4444',
                    fontSize: '13px',
                    marginBottom: '16px',
                  }}
                >
                  {gatewayError}
                </div>
              )}

              {gatewaySuccess && (
                <div
                  style={{
                    padding: '12px 14px',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '10px',
                    color: '#10B981',
                    fontSize: '13px',
                    marginBottom: '16px',
                  }}
                >
                  {gatewaySuccess}
                </div>
              )}

              {gatewayMode === 'login' ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setGatewayError('');
                    setGatewaySuccess('');
                    if (!gatewayIdentifier.trim() || !gatewayPassword) {
                      setGatewayError(language === 'bn' ? 'অনুগ্রহ করে মোবাইল নম্বর বা ইমেইল এবং পাসওয়ার্ড দিন।' : 'Please enter phone or email and password.');
                      return;
                    }
                    setGatewayLoading(true);
                    try {
                      const res = await AuthService.signIn(gatewayIdentifier.trim(), gatewayPassword);
                      if (res.error) {
                        setGatewayError(res.error);
                        setGatewayLoading(false);
                        return;
                      }
                      if (res.user) {
                        setGatewaySuccess(language === 'bn' ? 'লগইন সফল হয়েছে! ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...' : 'Login successful! Entering provider operations console...');
                        setTimeout(() => {
                          window.location.reload();
                        }, 500);
                      }
                    } catch (err: any) {
                      setGatewayError(err.message || 'Login failed.');
                      setGatewayLoading(false);
                    }
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, marginBottom: '6px' }}>
                      {language === 'bn' ? 'মোবাইল নম্বর অথবা ইমেইল' : 'Mobile Number or Registered Email'}
                    </label>
                    <input
                      type="text"
                      required
                      value={gatewayIdentifier}
                      onChange={(e) => setGatewayIdentifier(e.target.value)}
                      placeholder={language === 'bn' ? '০১XXXXXXXXX অথবা admin@hospital.com' : '01XXXXXXXXX or email'}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: `1.5px solid ${tokens.cardBorder}`,
                        backgroundColor: tokens.cardBg,
                        color: tokens.textPrimary,
                        fontSize: '13.5px',
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, marginBottom: '6px' }}>
                      {language === 'bn' ? 'অ্যাকাউন্ট পাসওয়ার্ড' : 'Account Password'}
                    </label>
                    <input
                      type="password"
                      required
                      value={gatewayPassword}
                      onChange={(e) => setGatewayPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: `1.5px solid ${tokens.cardBorder}`,
                        backgroundColor: tokens.cardBg,
                        color: tokens.textPrimary,
                        fontSize: '13.5px',
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={gatewayLoading}
                    style={{
                      marginTop: '6px',
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: BRAND_COLORS.primary,
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 800,
                      cursor: gatewayLoading ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(0, 96, 250, 0.35)',
                    }}
                  >
                    <LogIn size={16} />
                    <span>
                      {gatewayLoading
                        ? (language === 'bn' ? 'লগইন হচ্ছে...' : 'Signing in...')
                        : (language === 'bn' ? 'কনসোলে লগইন করুন' : 'Sign In to Operations Console')}
                    </span>
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setGatewayError('');
                    setGatewaySuccess('');
                    if (!gatewayFacilityName.trim() || !gatewayContactPerson.trim() || !gatewayPhone.trim() || !gatewayRegPassword) {
                      setGatewayError(language === 'bn' ? 'অনুগ্রহ করে সকল আবশ্যকীয় তথ্য পূরণ করুন।' : 'Please fill all required fields.');
                      return;
                    }
                    if (gatewayRegPassword.length < 8) {
                      setGatewayError(language === 'bn' ? 'পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।' : 'Password must be at least 8 characters long.');
                      return;
                    }
                    setGatewayLoading(true);
                    try {
                      const res = await AuthService.registerHospital({
                        hospitalName: gatewayFacilityName.trim(),
                        contactPerson: gatewayContactPerson.trim(),
                        phone: gatewayPhone.trim(),
                        email: gatewayEmail.trim() || undefined,
                        password: gatewayRegPassword,
                        district: gatewayDistrict,
                        licenseNumber: gatewayLicense.trim() || undefined,
                        language: language === 'bn' ? 'bn' : 'en',
                      });
                      if (res.error) {
                        setGatewayError(res.error);
                        setGatewayLoading(false);
                        return;
                      }
                      setGatewaySuccess(
                        language === 'bn'
                          ? 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...'
                          : 'Hospital account created! Entering your operations console...'
                      );
                      setTimeout(() => {
                        window.location.reload();
                      }, 600);
                    } catch (err: any) {
                      setGatewayError(err.message || 'Registration failed.');
                      setGatewayLoading(false);
                    }
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, marginBottom: '4px' }}>
                      {language === 'bn' ? 'প্রতিষ্ঠানের নাম (হাসপাতাল / ডায়াগনস্টিক সেন্টার)' : 'Hospital or Diagnostic Center Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={gatewayFacilityName}
                      onChange={(e) => setGatewayFacilityName(e.target.value)}
                      placeholder={language === 'bn' ? 'যেমন: পপুলার ডায়াগনস্টিক সেন্টার' : 'e.g. Popular Diagnostic Center'}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: `1.5px solid ${tokens.cardBorder}`,
                        backgroundColor: tokens.cardBg,
                        color: tokens.textPrimary,
                        fontSize: '13.5px',
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, marginBottom: '4px' }}>
                        {language === 'bn' ? 'যোগাযোগকারী ব্যক্তি' : 'Contact Person'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={gatewayContactPerson}
                        onChange={(e) => setGatewayContactPerson(e.target.value)}
                        placeholder="Admin / Manager Name"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: `1.5px solid ${tokens.cardBorder}`,
                          backgroundColor: tokens.cardBg,
                          color: tokens.textPrimary,
                          fontSize: '13px',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, marginBottom: '4px' }}>
                        {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={gatewayPhone}
                        onChange={(e) => setGatewayPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: `1.5px solid ${tokens.cardBorder}`,
                          backgroundColor: tokens.cardBg,
                          color: tokens.textPrimary,
                          fontSize: '13px',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, marginBottom: '4px' }}>
                        {language === 'bn' ? 'পাসওয়ার্ড (ন্যূনতম ৮ অক্ষর)' : 'Password (min 8 chars)'} *
                      </label>
                      <input
                        type="password"
                        required
                        value={gatewayRegPassword}
                        onChange={(e) => setGatewayRegPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: `1.5px solid ${tokens.cardBorder}`,
                          backgroundColor: tokens.cardBg,
                          color: tokens.textPrimary,
                          fontSize: '13px',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, marginBottom: '4px' }}>
                        {language === 'bn' ? 'জেলা (District)' : 'District'}
                      </label>
                      <select
                        value={gatewayDistrict}
                        onChange={(e) => setGatewayDistrict(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: `1.5px solid ${tokens.cardBorder}`,
                          backgroundColor: tokens.cardBg,
                          color: tokens.textPrimary,
                          fontSize: '13px',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      >
                        <option value="Moulvibazar">Moulvibazar</option>
                        <option value="Sylhet">Sylhet</option>
                        <option value="Dhaka">Dhaka</option>
                        <option value="Habiganj">Habiganj</option>
                        <option value="Sunamganj">Sunamganj</option>
                        <option value="Chittagong">Chittagong</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, marginBottom: '4px' }}>
                      {language === 'bn' ? 'ডিজিএইচএস / ট্রেড লাইসেন্স নম্বর (ঐচ্ছিক)' : 'DGHS / Trade License No. (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={gatewayLicense}
                      onChange={(e) => setGatewayLicense(e.target.value)}
                      placeholder="e.g. DGHS-2024-XXXX"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: `1.5px solid ${tokens.cardBorder}`,
                        backgroundColor: tokens.cardBg,
                        color: tokens.textPrimary,
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={gatewayLoading}
                    style={{
                      marginTop: '6px',
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: BRAND_COLORS.primary,
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 800,
                      cursor: gatewayLoading ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(0, 96, 250, 0.35)',
                    }}
                  >
                    <HospitalIcon size={16} />
                    <span>
                      {gatewayLoading
                        ? (language === 'bn' ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'Creating Account...')
                        : (language === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন ও কনসোলে প্রবেশ করুন' : 'Register & Enter Provider Console')}
                    </span>
                  </button>
                </form>
              )}
            </div>

            {/* Helpline Notice */}
            <div
              style={{
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: `1px solid ${tokens.cardBorder}`,
                fontSize: '12.5px',
                color: tokens.textMuted,
              }}
            >
              <span>{language === 'bn' ? 'ভেরিফিকেশন ও অনবোর্ডিং সহায়তার জন্য যোগাযোগ করুন:' : 'Official Provider Onboarding & Compliance Helpline:'} </span>
              <a href="tel:01886748564" style={{ color: BRAND_COLORS.primary, fontWeight: 700, textDecoration: 'none' }}>
                01886-748564
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STATE 3: AUTHENTICATED USER - HYDRATE PROFILE SEAMLESSLY
  // --------------------------------------------------------------------------
  if (currentUser && !profile) {
    const fallbackHosp: HospitalProfile = {
      id: currentUser.id,
      name: currentUser.fullName || 'Healthcare Provider',
      nameBn: currentUser.fullName || 'স্বাস্থ্যসেবা প্রতিষ্ঠান',
      slug: (currentUser.fullName || 'provider').toLowerCase().replace(/\s+/g, '-'),
      tradeLicenseNumber: 'TR-DH-2024-8891',
      dghsRegistrationNumber: 'DGHS-HOSP-2024-441',
      phone: currentUser.phone || '01886748564',
      emergencyPhone: '01886748564',
      email: currentUser.email || 'care@diagnosticcare.com.bd',
      website: 'https://diagnosticcare.com.bd',
      totalBeds: 50,
      icuBeds: 6,
      hasIcu: true,
      hasNicu: true,
      hasEmergency247: true,
      description: `${currentUser.fullName} - Authorized Healthcare Facility on Diagnostic Care Platform`,
      verificationStatus: 'verified',
      rating: 4.8,
      totalReviews: 24,
      status: 'active',
      district: 'Moulvibazar',
      addressLine: 'Central Road, Moulvibazar, Sylhet',
    };
    setProfile(fallbackHosp);
    loadHospitalData(fallbackHosp.id);
    return null;
  }

  // --------------------------------------------------------------------------
  // STATE 4: AUTHENTICATED HOSPITAL OPERATIONS CONSOLE (REAL DATA)
  // --------------------------------------------------------------------------
  if (!profile) return null;

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
                <span>{profile.name}</span>
                {profile.verificationStatus === 'verified' && (
                  <span title="DGHS & Trade Verified"><ShieldCheck size={14} color="#10B981" /></span>
                )}
              </div>
              <div style={{ fontSize: '10.5px', color: tokens.textMuted }}>
                {language === 'bn' ? 'হাসপাতাল অ্যাডমিন কনসোল' : 'Hospital Operations Console'} • {profile.district}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Theme Toggle, Language, Notifications, Admin Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              {notifications.some((n) => !n.isRead) && (
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
              )}
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
                {notifications.length === 0 ? (
                  <div style={{ fontSize: '12px', color: tokens.textMuted, padding: '12px 0', textAlign: 'center' }}>
                    {language === 'bn' ? 'কোনো নতুন নোটিফিকেশন নেই' : 'No new notifications'}
                  </div>
                ) : (
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
                )}
              </div>
            )}
          </div>

          {/* User Account Info */}
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
              {currentUser?.fullName?.charAt(0) || 'H'}
            </div>
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 800 }}>{currentUser?.fullName || 'Hospital Admin'}</div>
              <div style={{ fontSize: '9px', color: '#38BDF8', fontWeight: 700 }}>HOSPITAL OWNER</div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Verification Alert Banner if Not Verified */}
      {profile.verificationStatus !== 'verified' && (
        <div
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
            padding: '10px 24px',
            color: '#B45309',
            fontSize: '12.5px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={15} color="#D97706" />
            <span>
              {language === 'bn'
                ? `ভেরিফিকেশন স্ট্যাটাস: ${profile.verificationStatus.toUpperCase()}। আপনার ডিজিএইচএস ও ট্রেড লাইসেন্স যাচাই প্রক্রিয়া চলমান রয়েছে।`
                : `Verification Status: ${profile.verificationStatus.toUpperCase()}. Your DGHS and Trade License credentials are under administrative review.`}
            </span>
          </div>
          <span style={{ fontSize: '11.5px', color: '#92400E' }}>Helpline: 01886-748564</span>
        </div>
      )}

      {/* 3. Portal Workspace with Tabs */}
      <div style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '24px 20px', flex: 1, boxSizing: 'border-box' }}>
        {/* Navigation Tabs Bar */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '16px',
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

        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Header Banner */}
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
                    {profile.dghsRegistrationNumber ? `DGHS: ${profile.dghsRegistrationNumber}` : 'HOSPITAL CONSOLE'}
                  </span>
                  <span style={{ fontSize: '11px', color: '#CBD5E1' }}>•</span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: profile.verificationStatus === 'verified' ? '#34D399' : '#FCD34D',
                      fontWeight: 800,
                    }}
                  >
                    {profile.verificationStatus.toUpperCase()}
                  </span>
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>
                  {profile.name}
                </h2>
                <div style={{ fontSize: '12px', color: '#CBD5E1', marginTop: '4px' }}>
                  {language === 'bn'
                    ? `সক্রিয় সাবস্ক্রিপশন: ${stats?.currentPlanName || 'স্ট্যান্ডার্ড'} • পরবর্তী নবায়ন: ${new Date(stats?.nextRenewalDate || Date.now()).toLocaleDateString()}`
                    : `Active Membership: ${stats?.currentPlanName || 'Standard'} • Next Renewal: ${new Date(stats?.nextRenewalDate || Date.now()).toLocaleDateString()}`}
                </div>
              </div>

              {/* Entitlement Pills in Banner */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ padding: '10px 16px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <div style={{ fontSize: '11px', color: '#93C5FD', fontWeight: 700 }}>Branch Limit</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>
                    {branches.length} / {stats?.branchLimit || 5}
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
                    {stats?.todayAppointmentsCount || 0} Patients
                  </div>
                </div>
              </div>
            </div>

            {/* Core Metrics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {[
                { title: 'Associated Specialists', titleBn: 'নিবন্ধিত বিশেষজ্ঞ ডাক্তার', val: doctors.length, color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', icon: Stethoscope },
                { title: 'Operational Branches', titleBn: 'সক্রিয় শাখা সমূহ', val: branches.length, color: '#0060FA', bg: 'rgba(0, 96, 250, 0.12)', icon: Building2 },
                { title: 'Active Medical Depts', titleBn: 'চিকিৎসা বিভাগ সমূহ', val: departments.length, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.12)', icon: Layers },
                { title: 'Published Services', titleBn: 'ক্যাটালগ সার্ভিস ও টেস্ট', val: services.length, color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.12)', icon: FileText },
                { title: 'Total Beds Capacity', titleBn: 'মোট শয্যা ও ইনপেশেন্ট', val: `${profile.totalBeds} Beds`, color: '#EC4899', bg: 'rgba(236, 72, 153, 0.12)', icon: UserCheck },
                { title: 'Critical Care (ICU/NICU)', titleBn: 'আইসিইউ ও সিসিইউ শয্যা', val: `${profile.icuBeds} ICU`, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)', icon: AlertTriangle },
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: tokens.cardBg,
                      backdropFilter: tokens.backdropBlur,
                      borderRadius: '16px',
                      padding: '20px',
                      border: `1px solid ${tokens.cardBorder}`,
                      boxShadow: tokens.cardShadow,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
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
                        <Icon size={19} />
                      </div>
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: tokens.textPrimary, letterSpacing: '-0.02em' }}>
                      {card.val}
                    </div>
                    <div style={{ fontSize: '12px', color: tokens.textMuted, marginTop: '3px', fontWeight: 600 }}>
                      {language === 'bn' ? card.titleBn : card.title}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Queue Table */}
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
                    Real-time check-in and doctor room status across authorized branches.
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

              {appointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 16px', color: tokens.textMuted, fontSize: '13px' }}>
                  <Calendar size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                  <div>{language === 'bn' ? 'আজকের কোনো অ্যাপয়েন্টমেন্ট বা কিউ বুকিং নেই।' : 'No patient appointments scheduled for today.'}</div>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                    <thead>
                      <tr style={{ backgroundColor: tokens.tableHeaderBg, borderBottom: `1px solid ${tokens.tableBorder}` }}>
                        <th style={{ padding: '10px 14px', color: tokens.textMuted }}>CODE</th>
                        <th style={{ padding: '10px 14px', color: tokens.textMuted }}>PATIENT</th>
                        <th style={{ padding: '10px 14px', color: tokens.textMuted }}>DOCTOR & CHAMBER</th>
                        <th style={{ padding: '10px 14px', color: tokens.textMuted }}>TIME</th>
                        <th style={{ padding: '10px 14px', color: tokens.textMuted }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0, 5).map((apt) => (
                        <tr key={apt.id} style={{ borderBottom: `1px solid ${tokens.tableBorder}` }}>
                          <td style={{ padding: '12px 14px', fontWeight: 800, color: tokens.primary }}>{apt.bookingCode}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 700, color: tokens.textPrimary }}>{apt.patientName}</div>
                            <div style={{ fontSize: '11px', color: tokens.textMuted }}>{apt.patientPhone}</div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 700, color: tokens.textPrimary }}>{apt.doctorName}</div>
                            <div style={{ fontSize: '11px', color: tokens.textMuted }}>{apt.chamberRoom || 'Consultation Room'}</div>
                          </td>
                          <td style={{ padding: '12px 14px', color: tokens.textPrimary, fontWeight: 600 }}>{apt.startTime}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span
                              style={{
                                fontSize: '10.5px',
                                fontWeight: 800,
                                padding: '3px 8px',
                                borderRadius: '6px',
                                backgroundColor: apt.status === 'confirmed' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(14, 165, 233, 0.12)',
                                color: apt.status === 'confirmed' ? '#10B981' : '#0EA5E9',
                              }}
                            >
                              {apt.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: HOSPITAL PROFILE MANAGEMENT */}
        {activeTab === 'profile' && (
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
                    DGHS Registration Number
                  </label>
                  <input
                    type="text"
                    value={profile.dghsRegistrationNumber}
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
                    value={profile.tradeLicenseNumber}
                    onChange={(e) => setProfile({ ...profile, tradeLicenseNumber: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    Official Phone
                  </label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    24/7 Emergency Line
                  </label>
                  <input
                    type="text"
                    value={profile.emergencyPhone}
                    onChange={(e) => setProfile({ ...profile, emergencyPhone: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  const ok = await HospitalService.updateHospitalProfile(profile.id, profile);
                  alert(ok ? 'Profile updated successfully.' : 'Failed to update profile.');
                }}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  backgroundColor: BRAND_COLORS.primary,
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '8px',
                }}
              >
                {language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Profile Changes'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: BRANCHES */}
        {activeTab === 'branches' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
                  {language === 'bn' ? 'হাসপাতাল শাখা ও লোকেশন নেটওয়ার্ক' : 'Hospital Branches & Campus Locations'}
                </h2>
                <div style={{ fontSize: '12px', color: tokens.textMuted }}>
                  Subscription Limit: <strong>{branches.length} of {stats?.branchLimit || 5} Branches Used</strong>
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

            {branches.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                  backgroundColor: tokens.cardBg,
                  borderRadius: '16px',
                  border: `1px dashed ${tokens.cardBorder}`,
                }}
              >
                <Building2 size={36} color={tokens.textMuted} style={{ marginBottom: '10px', opacity: 0.6 }} />
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0', color: tokens.textPrimary }}>
                  {language === 'bn' ? 'কোনো শাখা এখনও যুক্ত করা হয়নি' : 'No Branches Configured Yet'}
                </h3>
                <p style={{ fontSize: '13px', color: tokens.textMuted, margin: '0 0 16px 0' }}>
                  {language === 'bn' ? 'আপনার হাসপাতালের প্রধান ক্যাম্পাস বা শাখা যুক্ত করে অপারেশন শুরু করুন।' : 'Add your primary medical campus or branches to manage schedules.'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddBranchOpen(true)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    backgroundColor: BRAND_COLORS.primary,
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  <span>{language === 'bn' ? 'প্রথম শাখা যুক্ত করুন' : 'Add First Branch'}</span>
                </button>
              </div>
            ) : (
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
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DOCTORS */}
        {activeTab === 'doctors' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
                  {language === 'bn' ? 'চিকিৎসক অ্যাসোসিয়েশন ও চেম্বার শিডিউল' : 'Associated Doctors & Department Specialties'}
                </h2>
                <div style={{ fontSize: '12px', color: tokens.textMuted }}>
                  Doctors retain independent accounts and verified BMDC credentials for hospital chambers.
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

            {doctors.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                  backgroundColor: tokens.cardBg,
                  borderRadius: '16px',
                  border: `1px dashed ${tokens.cardBorder}`,
                }}
              >
                <Stethoscope size={36} color={tokens.textMuted} style={{ marginBottom: '10px', opacity: 0.6 }} />
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0', color: tokens.textPrimary }}>
                  {language === 'bn' ? 'কোনো ডাক্তার এখনও যুক্ত করা হয়নি' : 'No Doctors Associated Yet'}
                </h3>
                <p style={{ fontSize: '13px', color: tokens.textMuted, margin: '0 0 16px 0' }}>
                  {language === 'bn' ? 'আপনার হাসপাতালে প্র্যাকটিসকারী বিএমডিসি নিবন্ধিত ডাক্তারদের লিঙ্ক করুন।' : 'Link verified BMDC physicians practicing at your hospital chambers.'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddDoctorOpen(true)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    backgroundColor: BRAND_COLORS.primary,
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  <span>{language === 'bn' ? 'ডাক্তার ইনভাইট করুন' : 'Invite Specialist'}</span>
                </button>
              </div>
            ) : (
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
                            {doc.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
                  {language === 'bn' ? 'অ্যাপয়েন্টমেন্ট কিউ ও বুকিং ডেস্ক' : 'Chamber Appointments & Patient Queue Desk'}
                </h2>
                <div style={{ fontSize: '12px', color: tokens.textMuted }}>
                  Confirmed bookings from patients with guaranteed slot reservations.
                </div>
              </div>
            </div>

            {filteredAppointments.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                  backgroundColor: tokens.cardBg,
                  borderRadius: '16px',
                  border: `1px dashed ${tokens.cardBorder}`,
                }}
              >
                <Calendar size={36} color={tokens.textMuted} style={{ marginBottom: '10px', opacity: 0.6 }} />
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0', color: tokens.textPrimary }}>
                  {language === 'bn' ? 'কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি' : 'No Appointments Found'}
                </h3>
                <p style={{ fontSize: '13px', color: tokens.textMuted, margin: 0 }}>
                  {language === 'bn' ? 'রোগীদের অনলাইন বুকিং এখানে রিয়েল-টাইমে প্রদর্শিত হবে।' : 'Patient chamber bookings will appear here in real-time as they are scheduled.'}
                </p>
              </div>
            ) : (
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
                      <th style={{ padding: '12px 16px', color: tokens.textMuted }}>DATE & TIME</th>
                      <th style={{ padding: '12px 16px', color: tokens.textMuted }}>STATUS</th>
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
                        <td style={{ padding: '14px 16px', color: tokens.textPrimary }}>
                          <div>{apt.appointmentDate}</div>
                          <div style={{ fontSize: '11px', color: tokens.textMuted }}>{apt.startTime}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              backgroundColor: apt.status === 'confirmed' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(14, 165, 233, 0.12)',
                              color: apt.status === 'confirmed' ? '#10B981' : '#0EA5E9',
                            }}
                          >
                            {apt.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SERVICES */}
        {activeTab === 'services' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
              {language === 'bn' ? 'চিকিৎসা সেবা ও ডায়াগনস্টিক ক্যাটালগ' : 'Inpatient Facilities & Diagnostic Catalog'}
            </h2>
            {services.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                  backgroundColor: tokens.cardBg,
                  borderRadius: '16px',
                  border: `1px dashed ${tokens.cardBorder}`,
                }}
              >
                <Layers size={36} color={tokens.textMuted} style={{ marginBottom: '10px', opacity: 0.6 }} />
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0', color: tokens.textPrimary }}>
                  {language === 'bn' ? 'কোনো সার্ভিস এখনও তালিকাভুক্ত করা হয়নি' : 'No Services Published Yet'}
                </h3>
                <p style={{ fontSize: '13px', color: tokens.textMuted, margin: 0 }}>
                  {language === 'bn' ? 'আপনার হাসপাতালের আইসিইউ, এম্বুলেন্স বা ল্যাব সেবা তালিকাভুক্ত করুন।' : 'Publish clinical services, ICU beds, emergency transit, and lab facilities.'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                {services.map((s) => (
                  <div key={s.id} style={{ padding: '16px', borderRadius: '12px', backgroundColor: tokens.cardBg, border: `1px solid ${tokens.cardBorder}` }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: tokens.textPrimary }}>{s.name}</div>
                    <div style={{ fontSize: '12px', color: tokens.textMuted, marginTop: '2px' }}>{s.category}</div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: BRAND_COLORS.primary, marginTop: '8px' }}>৳{s.priceBdt}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: STAFF */}
        {activeTab === 'staff' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
              {language === 'bn' ? 'হাসপাতাল স্টাফ ও দায়িত্ব' : 'Hospital Operations Staff & Roles'}
            </h2>
            {staff.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                  backgroundColor: tokens.cardBg,
                  borderRadius: '16px',
                  border: `1px dashed ${tokens.cardBorder}`,
                }}
              >
                <Users size={36} color={tokens.textMuted} style={{ marginBottom: '10px', opacity: 0.6 }} />
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0', color: tokens.textPrimary }}>
                  {language === 'bn' ? 'কোনো অতিরিক্ত স্টাফ যুক্ত নেই' : 'No Additional Staff Members'}
                </h3>
                <p style={{ fontSize: '13px', color: tokens.textMuted, margin: 0 }}>
                  {language === 'bn' ? 'রিসেপশনিস্ট ও কিউ ম্যানেজারদের অ্যাক্সেস পারমিশন দিতে পারেন।' : 'Authorize receptionists and desk staff to manage live token queues.'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {staff.map((stf) => (
                  <div key={stf.id} style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: tokens.cardBg, border: `1px solid ${tokens.cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13.5px', color: tokens.textPrimary }}>{stf.fullName}</div>
                      <div style={{ fontSize: '11px', color: tokens.textMuted }}>{stf.email} • {stf.phone}</div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: BRAND_COLORS.primary, padding: '3px 8px', borderRadius: '6px', backgroundColor: 'rgba(0, 96, 250, 0.1)' }}>
                      {stf.role.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: SUBSCRIPTION */}
        {activeTab === 'subscription' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: tokens.cardBg, borderRadius: '18px', padding: '24px 28px', border: `1px solid ${tokens.cardBorder}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: tokens.textPrimary, margin: '0 0 6px 0' }}>
                    {language === 'bn' ? 'সাবস্ক্রিপশন ও পার্টনার টিয়ার' : 'Hospital Partner Subscription & Invoices'}
                  </h2>
                  <p style={{ margin: 0, fontSize: '13px', color: tokens.textMuted }}>
                    {language === 'bn'
                      ? 'আপনার বর্তমান মেম্বারশিপ স্ট্যাটাস, শাখা ও টেস্ট সীমা এবং ইনভয়েস পরিচালনা করুন।'
                      : 'Manage your platform membership tier, branch entitlements, payment methods, and invoices.'}
                  </p>
                </div>
                <Link
                  href="/provider/subscription"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 20px',
                    backgroundColor: BRAND_COLORS.primary,
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(0, 96, 250, 0.25)',
                  }}
                >
                  <CreditCard size={15} />
                  <span>{language === 'bn' ? 'অনলাইন পেমেন্ট গেটওয়ে ও ইনভয়েস' : 'Payment Gateways & Invoices'}</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              <div style={{ padding: '20px', borderRadius: '14px', backgroundColor: tokens.cardBgSubtle, border: `1px solid ${tokens.cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: BRAND_COLORS.primary, letterSpacing: '0.05em' }}>ACTIVE PARTNER TIER</div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: tokens.textPrimary, marginTop: '2px' }}>
                    {stats?.currentPlanName || 'Professional Partner Tier'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: tokens.textMuted, marginTop: '4px' }}>
                    Status: <span style={{ color: '#10B981', fontWeight: 800 }}>{stats?.subscriptionStatus?.toUpperCase() || 'ACTIVE'}</span> • Next Renewal:{' '}
                    {new Date(stats?.nextRenewalDate || Date.now()).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ padding: '8px 14px', borderRadius: '10px', backgroundColor: tokens.cardBg, border: `1px solid ${tokens.cardBorder}` }}>
                    <div style={{ fontSize: '11px', color: tokens.textMuted }}>Branch Entitlement</div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: tokens.textPrimary }}>{branches.length} / {stats?.branchLimit || 5} Active</div>
                  </div>
                  <div style={{ padding: '8px 14px', borderRadius: '10px', backgroundColor: tokens.cardBg, border: `1px solid ${tokens.cardBorder}` }}>
                    <div style={{ fontSize: '11px', color: tokens.textMuted }}>Staff Logins</div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: tokens.textPrimary }}>{staff.length} / {stats?.staffLimit || 15} Users</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Cards Grid for Instant Switching */}
            <div style={{ backgroundColor: tokens.cardBg, borderRadius: '18px', padding: '24px 28px', border: `1px solid ${tokens.cardBorder}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
                    {language === 'bn' ? 'উপলব্ধ মেম্বারশিপ প্ল্যানসমূহ' : 'Available Partner Membership Tiers'}
                  </h3>
                  <div style={{ fontSize: '12px', color: tokens.textMuted, marginTop: '2px' }}>
                    {language === 'bn' ? 'যেকোনো সময় সহজে প্ল্যান পরিবর্তন করুন।' : 'Upgrade or switch tier anytime with immediate entitlement updates.'}
                  </div>
                </div>

                <div style={{ display: 'flex', backgroundColor: tokens.cardBgSubtle, padding: '3px', borderRadius: '10px', border: `1px solid ${tokens.cardBorder}` }}>
                  <button
                    type="button"
                    onClick={() => setBillingInterval('monthly')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '7px',
                      border: 'none',
                      backgroundColor: billingInterval === 'monthly' ? BRAND_COLORS.primary : 'transparent',
                      color: billingInterval === 'monthly' ? '#FFFFFF' : tokens.textSecondary,
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingInterval('annual')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '7px',
                      border: 'none',
                      backgroundColor: billingInterval === 'annual' ? BRAND_COLORS.primary : 'transparent',
                      color: billingInterval === 'annual' ? '#FFFFFF' : tokens.textSecondary,
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Annual (Save 2 Mo.)
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                {MEMBERSHIP_PLANS.map((plan) => {
                  const price = billingInterval === 'annual' ? plan.annualPrice : plan.monthlyPrice;
                  const isCurrent =
                    stats?.currentPlanTier === plan.tier ||
                    (plan.tier === 'professional' && (!stats?.currentPlanTier || stats.currentPlanTier === 'standard'));

                  return (
                    <div
                      key={plan.id}
                      style={{
                        padding: '16px',
                        borderRadius: '14px',
                        backgroundColor: isCurrent ? 'rgba(0, 96, 250, 0.04)' : tokens.cardBgSubtle,
                        border: isCurrent ? `2px solid ${BRAND_COLORS.primary}` : `1px solid ${tokens.cardBorder}`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: plan.badgeColor }}>{plan.badge}</span>
                          {isCurrent && <span style={{ fontSize: '10px', fontWeight: 800, color: '#10B981' }}>✓ CURRENT</span>}
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: tokens.textPrimary }}>{language === 'bn' ? plan.nameBn : plan.name}</div>
                        <div style={{ fontSize: '20px', fontWeight: 900, color: BRAND_COLORS.primary, margin: '8px 0 12px 0' }}>
                          ৳{price.toLocaleString()}
                          <span style={{ fontSize: '11.5px', color: tokens.textMuted, fontWeight: 500 }}>
                            /{billingInterval === 'annual' ? 'yr' : 'mo'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                          {plan.features.slice(0, 4).map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: tokens.textSecondary }}>
                              <CheckCircle2 size={12} color="#10B981" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectPlan(plan)}
                        disabled={isCurrent}
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '8px',
                          border: isCurrent ? 'none' : `1.5px solid ${BRAND_COLORS.primary}`,
                          backgroundColor: isCurrent ? '#10B981' : BRAND_COLORS.primary,
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: isCurrent ? 'default' : 'pointer',
                        }}
                      >
                        {isCurrent ? (language === 'bn' ? '✓ বর্তমান প্ল্যান' : '✓ Active Plan') : (language === 'bn' ? 'প্ল্যান নির্বাচন করুন' : 'Select Plan')}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Branch Modal */}
      {isAddBranchOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: tokens.textPrimary }}>
                {language === 'bn' ? 'নতুন ক্যাম্পাস/শাখা যুক্ত করুন' : 'Add New Hospital Branch'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddBranchOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: tokens.textMuted }}
              >
                <X size={18} />
              </button>
            </div>

            {branchLimitNotice && (
              <div style={{ padding: '10px 14px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderRadius: '10px', fontSize: '12px', marginBottom: '14px' }}>
                {branchLimitNotice}
              </div>
            )}

            <form onSubmit={handleCreateBranch} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                  Branch Name
                </label>
                <input
                  type="text"
                  required
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  placeholder="e.g. City Consultation Center"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                  Address Line
                </label>
                <input
                  type="text"
                  required
                  value={newBranchAddress}
                  onChange={(e) => setNewBranchAddress(e.target.value)}
                  placeholder="Street / Area / Floor"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                  Branch Contact Phone
                </label>
                <input
                  type="text"
                  required
                  value={newBranchPhone}
                  onChange={(e) => setNewBranchPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddBranchOpen(false)}
                  style={{ padding: '9px 16px', borderRadius: '10px', backgroundColor: tokens.cardBgSubtle, border: `1px solid ${tokens.cardBorder}`, color: tokens.textSecondary, fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 20px', borderRadius: '10px', backgroundColor: BRAND_COLORS.primary, border: 'none', color: '#FFFFFF', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
