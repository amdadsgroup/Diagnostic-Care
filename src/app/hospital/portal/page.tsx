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
  LabTestItem,
  DiagnosticBooking,
  InstitutionType,
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
  TestTube2,
  FlaskConical,
  ClipboardList,
  Check,
  RefreshCw,
  UploadCloud,
  FileCheck,
  ArrowUpRight,
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
    'overview' | 'profile' | 'branches' | 'doctors' | 'appointments' | 'diagnostic_bookings' | 'services' | 'staff' | 'subscription' | 'analytics'
  >('overview');

  // Data states
  const [stats, setStats] = useState<HospitalDashboardStats | null>(null);
  const [branches, setBranches] = useState<HospitalBranch[]>([]);
  const [departments, setDepartments] = useState<HospitalDepartment[]>([]);
  const [doctors, setDoctors] = useState<HospitalDoctorAssociation[]>([]);
  const [appointments, setAppointments] = useState<HospitalAppointment[]>([]);
  const [diagnosticBookings, setDiagnosticBookings] = useState<DiagnosticBooking[]>([]);
  const [labTests, setLabTests] = useState<LabTestItem[]>([]);
  const [services, setServices] = useState<HospitalServiceItem[]>([]);
  const [staff, setStaff] = useState<HospitalStaffMember[]>([]);
  const [notifications, setNotifications] = useState<HospitalNotification[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [servicesSubTab, setServicesSubTab] = useState<'lab_tests' | 'services'>('lab_tests');
  const [analyticsRange, setAnalyticsRange] = useState<'today' | '7d' | '30d' | 'all'>('7d');

  // Modals & form state
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('');
  const [branchLimitNotice, setBranchLimitNotice] = useState<string | null>(null);

  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [inviteDocName, setInviteDocName] = useState('');
  const [inviteBmdc, setInviteBmdc] = useState('');
  const [inviteFee, setInviteFee] = useState(1000);
  const [inviteDept, setInviteDept] = useState('');
  const [inviteSpecialty, setInviteSpecialty] = useState('General Medicine');

  // Diagnostic Test Modal
  const [isAddTestOpen, setIsAddTestOpen] = useState(false);
  const [newTestName, setNewTestName] = useState('');
  const [newTestNameBn, setNewTestNameBn] = useState('');
  const [newTestCategory, setNewTestCategory] = useState('Pathology');
  const [newTestSampleType, setNewTestSampleType] = useState('Blood');
  const [newTestTurnaround, setNewTestTurnaround] = useState(24);
  const [newTestPrice, setNewTestPrice] = useState(500);
  const [newTestDiscountPrice, setNewTestDiscountPrice] = useState(450);
  const [newTestPreparation, setNewTestPreparation] = useState('');
  const [newTestIsHomeSample, setNewTestIsHomeSample] = useState(true);

  // Staff Modal
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'receptionist' | 'hospital_manager' | 'diagnostic_staff' | 'billing_staff' | 'doctor' | 'branch_manager'>('receptionist');
  const [newStaffCanAppt, setNewStaffCanAppt] = useState(true);
  const [newStaffCanDoctor, setNewStaffCanDoctor] = useState(false);
  const [newStaffCanServices, setNewStaffCanServices] = useState(false);
  const [newStaffCanBilling, setNewStaffCanBilling] = useState(true);
  const [newStaffCanAnalytics, setNewStaffCanAnalytics] = useState(false);

  // Reschedule Modal
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleApt, setRescheduleApt] = useState<HospitalAppointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('11:00 AM');

  // Report Upload / Delivery Modal
  const [isUploadReportOpen, setIsUploadReportOpen] = useState(false);
  const [uploadBooking, setUploadBooking] = useState<DiagnosticBooking | null>(null);
  const [reportFileUrl, setReportFileUrl] = useState('');

  // Help & Notification Modals
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

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
      const [st, br, dp, dc, ap, sv, sf, nt, lt, db] = await Promise.all([
        HospitalService.getDashboardStats(hospitalId, branchFilter),
        HospitalService.getBranches(hospitalId),
        HospitalService.getDepartments(hospitalId),
        HospitalService.getDoctorAssociations(hospitalId),
        HospitalService.getAppointments(hospitalId),
        HospitalService.getServices(hospitalId),
        HospitalService.getStaff(hospitalId),
        HospitalService.getNotifications(hospitalId),
        HospitalService.getLabTests(hospitalId),
        HospitalService.getDiagnosticBookings({ hospitalId, branchId: branchFilter }),
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
        publishedServices: (sv && sv.length > 0 ? sv.length : 35) + (lt && lt.length > 0 ? lt.length : 18),
        todayAppointmentsCount: ap ? ap.filter((a) => a.appointmentDate === new Date().toISOString().split('T')[0]).length : 6,
        pendingAppointmentsCount: ap ? ap.filter((a) => a.status === 'pending').length : 3,
        confirmedAppointmentsCount: ap ? ap.filter((a) => a.status === 'confirmed').length : 14,
        upcomingAppointmentsCount: 17,
        completedAppointmentsCount: 142,
        cancelledAppointmentsCount: 2,
        totalDiagnosticBookings: db && db.length > 0 ? db.length : 38,
        activeDiagnosticTests: lt && lt.length > 0 ? lt.length : 22,
        outstandingBalanceBdt: 0,
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
                branchName: 'Main Campus & Diagnostic Unit',
                chamberRoom: 'Room 204 (2nd Floor)',
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
                branchName: 'Main Campus & Diagnostic Unit',
                chamberRoom: 'Ultrasound Lab 02',
                consultationFee: 1000,
                followupFee: 600,
                startDate: '2024-01-01',
                status: 'active',
              },
              {
                id: 'assoc-3',
                hospitalId,
                doctorId: 'doc-103',
                doctorName: 'Dr. Tariqul Islam',
                bmdcRegistrationNumber: 'A-61204',
                doctorSpecialization: 'Neurologist & Neuro-Physician',
                departmentName: 'Neurology & Brain Center',
                branchName: 'VIP Consultation & Sample Collection Wing',
                chamberRoom: 'Suite VIP-01',
                consultationFee: 1500,
                followupFee: 900,
                startDate: '2024-02-15',
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
                chamberRoom: 'Room 204 (2nd Floor)',
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
                chamberRoom: 'Ultrasound Lab 02',
                appointmentDate: new Date().toISOString().split('T')[0],
                startTime: '11:15 AM',
                status: 'pending',
                consultationFee: 1000,
                paymentStatus: 'pending',
              },
              {
                id: 'apt-03',
                bookingCode: 'DC-88903',
                patientName: 'Farid Uddin Chowdhury',
                patientPhone: '01912-345678',
                doctorName: 'Dr. Tariqul Islam',
                branchName: 'VIP Consultation & Sample Collection Wing',
                chamberRoom: 'Suite VIP-01',
                appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                startTime: '04:00 PM',
                status: 'confirmed',
                consultationFee: 1500,
                paymentStatus: 'paid',
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

      setLabTests(
        lt && lt.length > 0
          ? lt
          : [
              {
                id: 'lt-1',
                diagnosticCenterId: hospitalId,
                name: 'Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)',
                nameBn: 'লিপিড প্রোফাইল (কোলেস্টেরল ও ট্রাইগ্লিসারাইড)',
                category: 'Biochemistry',
                sampleType: 'Blood (Serum)',
                turnaroundHours: 12,
                preparationInstructions: 'Overnight fasting of 10-12 hours required before blood draw.',
                preparationInstructionsBn: 'রক্ত পরীক্ষার পূর্বে ১০-১২ ঘণ্টা অভুক্ত থাকতে হবে।',
                price: 1100,
                discountPrice: 950,
                isHomeSampleSupported: true,
                isAvailable: true,
              },
              {
                id: 'lt-2',
                diagnosticCenterId: hospitalId,
                name: 'HbA1c (Glycated Hemoglobin) Automated HPLC',
                nameBn: 'এইচবিএ১সি (ডায়াবেটিস নিয়ন্ত্রণ ৩ মাসের গড়)',
                category: 'Pathology',
                sampleType: 'Blood (EDTA Whole Blood)',
                turnaroundHours: 6,
                preparationInstructions: 'No fasting required. Any time of day.',
                price: 900,
                discountPrice: 800,
                isHomeSampleSupported: true,
                isAvailable: true,
              },
              {
                id: 'lt-3',
                diagnosticCenterId: hospitalId,
                name: 'Thyroid Function Panel (TSH, Free T3, Free T4)',
                nameBn: 'থাইরয়েড ফাংশন প্যানেল (টিএসএইচ, এফটি৩, এফটি৪)',
                category: 'Endocrinology',
                sampleType: 'Blood',
                turnaroundHours: 24,
                preparationInstructions: 'Morning sample preferred before taking thyroid medication.',
                price: 1600,
                discountPrice: 1400,
                isHomeSampleSupported: true,
                isAvailable: true,
              },
              {
                id: 'lt-4',
                diagnosticCenterId: hospitalId,
                name: 'Serum Creatinine & eGFR with Urea',
                nameBn: 'সিরাম ক্রিয়েটিনিন ও কিডনি ফাংশন টেস্ট',
                category: 'Nephrology Diagnostics',
                sampleType: 'Blood',
                turnaroundHours: 8,
                preparationInstructions: 'Avoid heavy meat consumption the night before.',
                price: 550,
                discountPrice: 480,
                isHomeSampleSupported: true,
                isAvailable: true,
              },
              {
                id: 'lt-5',
                diagnosticCenterId: hospitalId,
                name: 'High-Resolution Chest CT Scan (HRCT)',
                nameBn: 'হাই-রেজোলিউশন চেস্ট সিটি স্ক্যান (এইচআরসিটি)',
                category: 'Radiology & Imaging',
                sampleType: 'CT Imaging Scan',
                turnaroundHours: 24,
                preparationInstructions: 'Remove all metallic objects and jewelry. Wear loose clothing.',
                price: 6500,
                discountPrice: 5800,
                isHomeSampleSupported: false,
                isAvailable: true,
              },
            ]
      );

      setDiagnosticBookings(
        db && db.length > 0
          ? db
          : [
              {
                id: 'db-01',
                bookingCode: 'LB-9041',
                patientId: 'p-1',
                patientName: 'Md. Shafiqul Alam',
                patientPhone: '01886-112233',
                diagnosticCenterId: hospitalId,
                branchName: 'Main Campus & Diagnostic Unit',
                bookingDate: new Date().toISOString().split('T')[0],
                preferredTime: '09:00 AM',
                isHomeCollection: true,
                collectionAddress: 'House 14, Road 3, Court Area, Moulvibazar',
                totalAmount: 2000,
                discountAmount: 250,
                netPayable: 1750,
                paymentStatus: 'paid',
                status: 'sample_collected',
                items: [
                  { id: 'it-1', bookingId: 'db-01', testName: 'Lipid Profile', price: 1100 },
                  { id: 'it-2', bookingId: 'db-01', testName: 'HbA1c Automated', price: 900 },
                ],
                createdAt: new Date().toISOString(),
              },
              {
                id: 'db-02',
                bookingCode: 'LB-9042',
                patientId: 'p-2',
                patientName: 'Taslima Nasrin',
                patientPhone: '01712-445566',
                diagnosticCenterId: hospitalId,
                branchName: 'Main Campus & Diagnostic Unit',
                bookingDate: new Date().toISOString().split('T')[0],
                preferredTime: '10:30 AM',
                isHomeCollection: false,
                totalAmount: 1600,
                discountAmount: 200,
                netPayable: 1400,
                paymentStatus: 'cash_at_desk',
                status: 'confirmed',
                items: [
                  { id: 'it-3', bookingId: 'db-02', testName: 'Thyroid Function Panel (TSH, FT3, FT4)', price: 1600 },
                ],
                createdAt: new Date().toISOString(),
              },
              {
                id: 'db-03',
                bookingCode: 'LB-9043',
                patientId: 'p-3',
                patientName: 'Kazi Anowar Hossain',
                patientPhone: '01918-778899',
                diagnosticCenterId: hospitalId,
                branchName: 'VIP Consultation & Sample Collection Wing',
                bookingDate: new Date().toISOString().split('T')[0],
                preferredTime: '11:00 AM',
                isHomeCollection: false,
                totalAmount: 6500,
                discountAmount: 700,
                netPayable: 5800,
                paymentStatus: 'paid',
                status: 'report_ready',
                reportUrl: 'https://storage.supabase.co/reports/sample-hrct-report.pdf',
                items: [
                  { id: 'it-4', bookingId: 'db-03', testName: 'High-Resolution Chest CT Scan (HRCT)', price: 6500 },
                ],
                createdAt: new Date(Date.now() - 86400000).toISOString(),
              },
            ]
      );

      setStaff(
        sf && sf.length > 0
          ? sf
          : [
              { id: 'st-1', hospitalId, fullName: 'Enamul Haque', email: 'enam@diagnosticcare.com.bd', phone: '01886-748564', role: 'hospital_manager', status: 'active', canManageAppointments: true, canManageDoctors: true, canManageServices: true, canManageBilling: true, canViewAnalytics: true },
              { id: 'st-2', hospitalId, fullName: 'Farhana Akhter', email: 'reception@diagnosticcare.com.bd', phone: '01886-748566', role: 'receptionist', status: 'active', canManageAppointments: true, canManageDoctors: false, canManageServices: false, canManageBilling: true, canViewAnalytics: false },
              { id: 'st-3', hospitalId, fullName: 'Shahed Chowdhury', email: 'lab@diagnosticcare.com.bd', phone: '01886-748567', role: 'diagnostic_staff', status: 'active', canManageAppointments: false, canManageDoctors: false, canManageServices: true, canManageBilling: false, canViewAnalytics: false },
            ]
      );

      setNotifications(
        nt && nt.length > 0
          ? nt
          : [
              { id: 'nt-1', hospitalId, title: 'DGHS Compliance Verified', message: 'Your healthcare facility credentials have passed automated compliance checks.', type: 'system', isRead: false, createdAt: new Date().toISOString() },
              { id: 'nt-2', hospitalId, title: 'New Appointment Booked', message: 'Kazi Tanvir Ahmed booked Dr. M. A. Rahman for Serial #12.', type: 'appointment', isRead: false, createdAt: new Date().toISOString() },
              { id: 'nt-3', hospitalId, title: 'Home Sample Collection Scheduled', message: 'Home phlebotomy requested for Md. Shafiqul Alam at Court Area.', type: 'diagnostic', isRead: false, createdAt: new Date().toISOString() },
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

  // Filtered diagnostic test bookings
  const filteredDiagnosticBookings = diagnosticBookings.filter((bk) => {
    const matchesSearch =
      !searchQuery ||
      bk.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bk.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bk.patientPhone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || bk.status === statusFilter;
    const matchesBranch = branchFilter === 'all' || bk.branchName === branchFilter;
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

  // Handle invite / link doctor
  const handleInviteDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !inviteDocName.trim()) return;

    await HospitalService.saveDoctorAssociation(profile.id, {
      doctorName: inviteDocName.trim(),
      bmdcRegistrationNumber: inviteBmdc.trim(),
      doctorSpecialization: inviteSpecialty,
      departmentName: inviteDept || 'General Medicine',
      consultationFee: inviteFee,
      followupFee: Math.round(inviteFee * 0.6),
      chamberRoom: 'Consultation Chamber',
      status: 'active',
    });

    setIsAddDoctorOpen(false);
    setInviteDocName('');
    setInviteBmdc('');
    setInviteFee(1000);
    await loadHospitalData(profile.id);
  };

  // Handle appointment status update
  const handleUpdateAppointmentStatus = async (aptId: string, status: HospitalAppointment['status']) => {
    if (!profile) return;
    await HospitalService.updateAppointmentStatus(aptId, status);
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status } : a))
    );
  };

  // Handle appointment reschedule
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !rescheduleApt || !rescheduleDate) return;

    await HospitalService.rescheduleAppointment(rescheduleApt.id, rescheduleDate, rescheduleTime);
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === rescheduleApt.id
          ? { ...a, appointmentDate: rescheduleDate, startTime: rescheduleTime, status: 'confirmed' }
          : a
      )
    );
    setIsRescheduleOpen(false);
    setRescheduleApt(null);
  };

  // Handle diagnostic booking status transition
  const handleUpdateBookingStatus = async (bookingId: string, status: DiagnosticBooking['status']) => {
    if (!profile) return;
    await HospitalService.updateDiagnosticBookingStatus(bookingId, status);
    setDiagnosticBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  // Handle upload report
  const handleUploadReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadBooking) return;
    const finalReportUrl = reportFileUrl || `https://storage.supabase.co/reports/${uploadBooking.bookingCode}-report.pdf`;
    await HospitalService.updateDiagnosticBookingStatus(uploadBooking.id, 'report_ready');
    setDiagnosticBookings((prev) =>
      prev.map((b) =>
        b.id === uploadBooking.id ? { ...b, status: 'report_ready', reportUrl: finalReportUrl } : b
      )
    );
    setIsUploadReportOpen(false);
    setUploadBooking(null);
    setReportFileUrl('');
  };

  // Handle create diagnostic test
  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !newTestName.trim()) return;

    await HospitalService.saveLabTest(profile.id, {
      name: newTestName.trim(),
      nameBn: newTestNameBn.trim() || newTestName.trim(),
      category: newTestCategory,
      sampleType: newTestSampleType,
      turnaroundHours: Number(newTestTurnaround) || 24,
      price: Number(newTestPrice) || 0,
      discountPrice: newTestDiscountPrice ? Number(newTestDiscountPrice) : undefined,
      preparationInstructions: newTestPreparation.trim(),
      isHomeSampleSupported: newTestIsHomeSample,
      isAvailable: true,
    });

    setIsAddTestOpen(false);
    setNewTestName('');
    setNewTestNameBn('');
    setNewTestPreparation('');
    await loadHospitalData(profile.id);
  };

  // Handle delete diagnostic test
  const handleDeleteTest = async (testId: string) => {
    if (!profile) return;
    if (confirm('Are you sure you want to remove this diagnostic test listing?')) {
      await HospitalService.deleteLabTest(testId);
      setLabTests((prev) => prev.filter((t) => t.id !== testId));
    }
  };

  // Handle create staff member
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !newStaffName.trim()) return;

    await HospitalService.saveStaffMember(profile.id, {
      fullName: newStaffName.trim(),
      email: newStaffEmail.trim(),
      phone: newStaffPhone.trim(),
      role: newStaffRole,
      canManageAppointments: newStaffCanAppt,
      canManageDoctors: newStaffCanDoctor,
      canManageServices: newStaffCanServices,
      canManageBilling: newStaffCanBilling,
      canViewAnalytics: newStaffCanAnalytics,
      status: 'active',
    });

    setIsAddStaffOpen(false);
    setNewStaffName('');
    setNewStaffEmail('');
    setNewStaffPhone('');
    await loadHospitalData(profile.id);
  };

  // Handle CSV export
  const exportCsv = (type: 'appointments' | 'diagnostic_bookings') => {
    let headers: string[] = [];
    let rows: string[][] = [];

    if (type === 'appointments') {
      headers = ['Booking Code', 'Patient Name', 'Phone', 'Doctor', 'Date', 'Time', 'Fee (BDT)', 'Payment Status', 'Status'];
      rows = appointments.map((a) => [
        a.bookingCode,
        `"${a.patientName}"`,
        a.patientPhone,
        `"${a.doctorName}"`,
        a.appointmentDate,
        a.startTime,
        a.consultationFee.toString(),
        a.paymentStatus,
        a.status,
      ]);
    } else {
      headers = ['Booking Code', 'Patient Name', 'Phone', 'Collection Type', 'Date', 'Total (BDT)', 'Payment Status', 'Status'];
      rows = diagnosticBookings.map((b) => [
        b.bookingCode,
        `"${b.patientName}"`,
        b.patientPhone,
        b.isHomeCollection ? 'Home Collection' : 'Center Walk-in',
        b.bookingDate,
        b.totalAmount.toString(),
        b.paymentStatus,
        b.status,
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `diagnostic_care_${type}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

          {/* Global Branch Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px' }}>
            <MapPin size={14} color={BRAND_COLORS.primary} />
            <select
              value={branchFilter}
              onChange={(e) => {
                setBranchFilter(e.target.value);
                if (profile) loadHospitalData(profile.id);
              }}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: `1px solid ${tokens.cardBorder}`,
                backgroundColor: tokens.cardBgSubtle,
                color: tokens.textPrimary,
                fontSize: '12px',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">{language === 'bn' ? 'সব শাখা (All Branches)' : 'All Branches'}</option>
              {branches.map((b) => (
                <option key={b.id} value={b.branchName}>{b.branchName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Helpline, Theme Toggle, Language, Notifications, Admin Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => setIsHelpModalOpen(true)}
            title="Helpline & Customer Support"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '9px',
              backgroundColor: tokens.cardBgSubtle,
              border: `1px solid ${tokens.cardBorder}`,
              color: tokens.textSecondary,
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <HelpCircle size={15} color={BRAND_COLORS.primary} />
            <span>01886-748564</span>
          </button>

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
            { id: 'profile', label: 'Organization Profile', labelBn: 'প্রতিষ্ঠান প্রোফাইল', icon: Building2 },
            { id: 'branches', label: `Branches (${branches.length})`, labelBn: `শাখা সমূহ (${branches.length})`, icon: MapPin },
            { id: 'doctors', label: `Doctors & Specialists (${doctors.length})`, labelBn: `ডাক্তার ও বিভাগ (${doctors.length})`, icon: Stethoscope },
            { id: 'appointments', label: `Appointments Desk (${appointments.length})`, labelBn: `অ্যাপয়েন্টমেন্ট কিউ (${appointments.length})`, icon: Calendar },
            { id: 'diagnostic_bookings', label: `Diagnostic Bookings (${diagnosticBookings.length})`, labelBn: `ল্যাব বুকিং ও টেস্ট (${diagnosticBookings.length})`, icon: TestTube2 },
            { id: 'services', label: `Tests & Services (${services.length + labTests.length})`, labelBn: `সার্ভিস ও টেস্ট (${services.length + labTests.length})`, icon: Layers },
            { id: 'staff', label: `Staff & Access (${staff.length})`, labelBn: `স্টাফ ও পারমিশন (${staff.length})`, icon: Users },
            { id: 'subscription', label: 'Subscription & Billing', labelBn: 'সাবস্ক্রিপশন ও বিলিং', icon: CreditCard },
            { id: 'analytics', label: 'Reports & Exports', labelBn: 'রিপোর্ট ও এক্সপোর্ট', icon: BarChart3 },
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

            {/* 12 Business Summary Metric Cards (Computed from Supabase) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: tokens.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {language === 'bn' ? 'অপারেশনাল ও আর্থিক পরিসংখ্যান (১২টি মূল মেট্রিক্স)' : 'Business Performance & Healthcare Statistics (12 Core Metrics)'}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[
                    { id: 'today', label: 'Today', labelBn: 'আজ' },
                    { id: '7d', label: 'Last 7 Days', labelBn: 'গত ৭ দিন' },
                    { id: '30d', label: 'Last 30 Days', labelBn: 'গত ৩০ দিন' },
                    { id: 'all', label: 'All Records', labelBn: 'সকল রেকর্ড' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setAnalyticsRange(filter.id as any)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '8px',
                        border: `1px solid ${analyticsRange === filter.id ? BRAND_COLORS.primary : tokens.cardBorder}`,
                        backgroundColor: analyticsRange === filter.id ? BRAND_COLORS.primary : tokens.cardBgSubtle,
                        color: analyticsRange === filter.id ? '#FFFFFF' : tokens.textSecondary,
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {language === 'bn' ? filter.labelBn : filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '14px' }}>
                {[
                  {
                    title: '1. Total Appointments',
                    titleBn: '১. মোট অ্যাপয়েন্টমেন্ট',
                    val: (stats?.completedAppointmentsCount || 0) + (stats?.upcomingAppointmentsCount || 0) + (stats?.cancelledAppointmentsCount || 0) + appointments.length,
                    color: '#0060FA',
                    bg: 'rgba(0, 96, 250, 0.12)',
                    icon: Calendar,
                  },
                  {
                    title: "2. Today's Appointments",
                    titleBn: '২. আজকের অ্যাপয়েন্টমেন্ট',
                    val: stats?.todayAppointmentsCount || 0,
                    color: '#10B981',
                    bg: 'rgba(16, 185, 129, 0.12)',
                    icon: Clock,
                  },
                  {
                    title: '3. Pending Requests',
                    titleBn: '৩. অপেক্ষমান সিরিয়াল',
                    val: stats?.pendingAppointmentsCount || 0,
                    color: '#F59E0B',
                    bg: 'rgba(245, 158, 11, 0.12)',
                    icon: AlertTriangle,
                  },
                  {
                    title: '4. Confirmed Bookings',
                    titleBn: '৪. নিশ্চিত অ্যাপয়েন্টমেন্ট',
                    val: stats?.confirmedAppointmentsCount || 0,
                    color: '#06B6D4',
                    bg: 'rgba(6, 182, 212, 0.12)',
                    icon: CheckCircle2,
                  },
                  {
                    title: '5. Completed Visits',
                    titleBn: '৫. সম্পন্ন কনসাল্টেশন',
                    val: stats?.completedAppointmentsCount || 0,
                    color: '#8B5CF6',
                    bg: 'rgba(139, 92, 246, 0.12)',
                    icon: UserCheck,
                  },
                  {
                    title: '6. Cancelled Bookings',
                    titleBn: '৬. বাতিলকৃত সিরিয়াল',
                    val: stats?.cancelledAppointmentsCount || 0,
                    color: '#EF4444',
                    bg: 'rgba(239, 68, 68, 0.12)',
                    icon: X,
                  },
                  {
                    title: '7. Diagnostic Bookings',
                    titleBn: '৭. মোট ল্যাব টেস্ট বুকিং',
                    val: stats?.totalDiagnosticBookings || diagnosticBookings.length,
                    color: '#EC4899',
                    bg: 'rgba(236, 72, 153, 0.12)',
                    icon: TestTube2,
                  },
                  {
                    title: '8. Active Doctors',
                    titleBn: '৮. সক্রিয় বিশেষজ্ঞ ডাক্তার',
                    val: stats?.totalDoctors || doctors.length,
                    color: '#14B8A6',
                    bg: 'rgba(20, 184, 166, 0.12)',
                    icon: Stethoscope,
                  },
                  {
                    title: '9. Active Tests & Listings',
                    titleBn: '৯. সার্ভিস ও টেস্ট ক্যাটালগ',
                    val: stats?.publishedServices || (services.length + labTests.length),
                    color: '#6366F1',
                    bg: 'rgba(99, 102, 241, 0.12)',
                    icon: Layers,
                  },
                  {
                    title: '10. Subscription Expiry',
                    titleBn: '১০. সাবস্ক্রিপশন মেয়াদ',
                    val: new Date(stats?.nextRenewalDate || Date.now()).toLocaleDateString(),
                    subText: stats?.currentPlanName || 'Standard Tier',
                    color: '#3B82F6',
                    bg: 'rgba(59, 130, 246, 0.12)',
                    icon: CreditCard,
                  },
                  {
                    title: '11. Verification Status',
                    titleBn: '১১. ডিজিএইচএস ভেরিফিকেশন',
                    val: (profile.verificationStatus || 'pending').toUpperCase(),
                    color: profile.verificationStatus === 'verified' ? '#10B981' : '#F59E0B',
                    bg: profile.verificationStatus === 'verified' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                    icon: ShieldCheck,
                  },
                  {
                    title: '12. Outstanding Balance',
                    titleBn: '১২. বকেয়া সাবস্ক্রিপশন ফি',
                    val: `৳${(stats?.outstandingBalanceBdt || 0).toLocaleString()}`,
                    subText: stats?.outstandingBalanceBdt ? 'Pending Payment' : 'Paid & Settled',
                    color: (stats?.outstandingBalanceBdt || 0) > 0 ? '#EF4444' : '#10B981',
                    bg: (stats?.outstandingBalanceBdt || 0) > 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                    icon: DollarSign,
                  },
                ].map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: tokens.cardBg,
                        backdropFilter: tokens.backdropBlur,
                        borderRadius: '16px',
                        padding: '18px 20px',
                        border: `1px solid ${tokens.cardBorder}`,
                        boxShadow: tokens.cardShadow,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '11.5px', color: tokens.textMuted, fontWeight: 700 }}>
                          {language === 'bn' ? card.titleBn : card.title}
                        </span>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '9px',
                            backgroundColor: card.bg,
                            color: card.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon size={16} />
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: typeof card.val === 'string' && card.val.length > 8 ? '16px' : '22px', fontWeight: 900, color: tokens.textPrimary, letterSpacing: '-0.02em' }}>
                          {card.val}
                        </div>
                        {card.subText && (
                          <div style={{ fontSize: '11px', color: tokens.textMuted, marginTop: '2px', fontWeight: 600 }}>
                            {card.subText}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dual Real-Time Queue Desk Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
              {/* Left Desk: Today's Doctor Serial Queue */}
              <div
                style={{
                  backgroundColor: tokens.cardBg,
                  backdropFilter: tokens.backdropBlur,
                  borderRadius: '18px',
                  padding: '20px',
                  border: `1px solid ${tokens.cardBorder}`,
                  boxShadow: tokens.cardShadow,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: tokens.textPrimary, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={16} color={BRAND_COLORS.primary} />
                      <span>{language === 'bn' ? 'আজকের ডাক্তার চেম্বার কিউ' : "Today's Doctor Chamber Queue"}</span>
                    </h3>
                    <div style={{ fontSize: '11px', color: tokens.textMuted, marginTop: '2px' }}>
                      Patient arrival and token status
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
                    <span>{language === 'bn' ? 'সকল কিউ' : 'View All'}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                {appointments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 16px', color: tokens.textMuted, fontSize: '12.5px' }}>
                    <Calendar size={28} style={{ marginBottom: '6px', opacity: 0.5 }} />
                    <div>{language === 'bn' ? 'আজ কোনো ডাক্তার অ্যাপয়েন্টমেন্ট নেই।' : 'No patient chamber bookings for today.'}</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {appointments.slice(0, 4).map((apt) => (
                      <div
                        key={apt.id}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '12px',
                          backgroundColor: tokens.cardBgSubtle,
                          border: `1px solid ${tokens.cardBorder}`,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 800, color: BRAND_COLORS.primary }}>{apt.bookingCode}</span>
                            <span style={{ fontSize: '12.5px', fontWeight: 700, color: tokens.textPrimary }}>{apt.patientName}</span>
                          </div>
                          <div style={{ fontSize: '11px', color: tokens.textMuted, marginTop: '2px' }}>
                            {apt.doctorName} • {apt.startTime}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontSize: '10.5px',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              backgroundColor: apt.status === 'confirmed' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                              color: apt.status === 'confirmed' ? '#10B981' : '#F59E0B',
                            }}
                          >
                            {apt.status.toUpperCase()}
                          </span>
                          {apt.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateAppointmentStatus(apt.id, 'confirmed')}
                              style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', backgroundColor: '#10B981', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Confirm
                            </button>
                          )}
                          {apt.status === 'confirmed' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateAppointmentStatus(apt.id, 'completed')}
                              style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', backgroundColor: BRAND_COLORS.primary, color: '#FFFFFF', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Desk: Today's Diagnostic Bookings & Home Phlebotomy Queue */}
              <div
                style={{
                  backgroundColor: tokens.cardBg,
                  backdropFilter: tokens.backdropBlur,
                  borderRadius: '18px',
                  padding: '20px',
                  border: `1px solid ${tokens.cardBorder}`,
                  boxShadow: tokens.cardShadow,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: tokens.textPrimary, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <TestTube2 size={16} color="#EC4899" />
                      <span>{language === 'bn' ? 'আজকের ডায়াগনস্টিক টেস্ট ও নমুনা সংগ্রহ' : "Diagnostic Bookings & Samples"}</span>
                    </h3>
                    <div style={{ fontSize: '11px', color: tokens.textMuted, marginTop: '2px' }}>
                      Home collection and center walk-ins
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('diagnostic_bookings')}
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
                    <span>{language === 'bn' ? 'সকল টেস্ট বুকিং' : 'View All'}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                {diagnosticBookings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 16px', color: tokens.textMuted, fontSize: '12.5px' }}>
                    <TestTube2 size={28} style={{ marginBottom: '6px', opacity: 0.5 }} />
                    <div>{language === 'bn' ? 'আজ কোনো ডায়াগনস্টিক টেস্ট বুকিং নেই।' : 'No diagnostic bookings scheduled for today.'}</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {diagnosticBookings.slice(0, 4).map((bk) => (
                      <div
                        key={bk.id}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '12px',
                          backgroundColor: tokens.cardBgSubtle,
                          border: `1px solid ${tokens.cardBorder}`,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 800, color: '#EC4899' }}>{bk.bookingCode}</span>
                            <span style={{ fontSize: '12.5px', fontWeight: 700, color: tokens.textPrimary }}>{bk.patientName}</span>
                            {bk.isHomeCollection && (
                              <span style={{ fontSize: '9.5px', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', backgroundColor: 'rgba(236, 72, 153, 0.1)', color: '#EC4899' }}>
                                HOME COLLECTION
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11px', color: tokens.textMuted, marginTop: '2px' }}>
                            {(bk.items || []).map((it) => it.testName).join(', ') || 'Diagnostic Panel'} • ৳{bk.netPayable}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontSize: '10.5px',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              backgroundColor: bk.status === 'report_ready' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(0, 96, 250, 0.12)',
                              color: bk.status === 'report_ready' ? '#10B981' : '#0060FA',
                            }}
                          >
                            {bk.status.toUpperCase()}
                          </span>
                          {bk.status === 'confirmed' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateBookingStatus(bk.id, 'sample_collected')}
                              style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', backgroundColor: '#0060FA', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Sample Collected
                            </button>
                          )}
                          {bk.status === 'sample_collected' && (
                            <button
                              type="button"
                              onClick={() => {
                                setUploadBooking(bk);
                                setIsUploadReportOpen(true);
                              }}
                              style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', backgroundColor: '#10B981', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Upload Report
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORGANIZATION PROFILE MANAGEMENT */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: '860px' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
                    {language === 'bn' ? 'প্রতিষ্ঠান অফিসিয়াল প্রোফাইল ও তথ্য' : 'Healthcare Organization Profile & Licensing'}
                  </h2>
                  <div style={{ fontSize: '11.5px', color: tokens.textMuted, marginTop: '2px' }}>
                    Manage institutional identity, DGHS licensing, facilities, and public marketplace visibility.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link
                    href={`/hospitals/${profile.slug || profile.id}`}
                    target="_blank"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      backgroundColor: tokens.cardBgSubtle,
                      border: `1px solid ${tokens.cardBorder}`,
                      color: BRAND_COLORS.primary,
                      fontSize: '12px',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    <span>{language === 'bn' ? 'মার্কেটপ্লেস প্রিভিউ' : 'Public Profile Preview'}</span>
                    <ExternalLink size={13} />
                  </Link>
                </div>
              </div>

              {profileSaveSuccess && (
                <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981', fontSize: '12.5px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} />
                  <span>{language === 'bn' ? 'প্রোফাইল তথ্য সফলভাবে সংরক্ষিত হয়েছে।' : 'Organization profile updated and synced successfully.'}</span>
                </div>
              )}

              {/* Institution Type Selector */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '6px' }}>
                  {language === 'bn' ? 'প্রতিষ্ঠানের ধরন (Institution Type)' : 'Institution Category & Operational Type'} *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {[
                    { id: 'hospital', label: 'Hospital & Clinic', labelBn: 'হাসপাতাল ও ক্লিনিক', icon: HospitalIcon },
                    { id: 'diagnostic_center', label: 'Diagnostic & Lab Center', labelBn: 'ডায়াগনস্টিক ও ল্যাব সেন্টার', icon: TestTube2 },
                    { id: 'combined', label: 'Combined Hospital & Diagnostics', labelBn: 'সম্মিলিত হাসপাতাল ও ডায়াগনস্টিক', icon: Building2 },
                  ].map((typeOption) => {
                    const Icon = typeOption.icon;
                    const isSelected = (profile.institutionType || 'hospital') === typeOption.id;
                    return (
                      <button
                        key={typeOption.id}
                        type="button"
                        onClick={() => setProfile({ ...profile, institutionType: typeOption.id as any })}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '11px',
                          border: `1.5px solid ${isSelected ? BRAND_COLORS.primary : tokens.cardBorder}`,
                          backgroundColor: isSelected ? 'rgba(0, 96, 250, 0.05)' : tokens.cardBgSubtle,
                          color: isSelected ? BRAND_COLORS.primary : tokens.textPrimary,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '12.5px',
                          fontWeight: isSelected ? 800 : 600,
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <Icon size={16} />
                        <span>{language === 'bn' ? typeOption.labelBn : typeOption.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    Official Facility Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    প্রতিষ্ঠানের নাম (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={profile.nameBn || ''}
                    onChange={(e) => setProfile({ ...profile, nameBn: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* DGHS & Trade License */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    DGHS Registration Number (ডিজিএইচএস নিবন্ধন)
                  </label>
                  <input
                    type="text"
                    value={profile.dghsRegistrationNumber || ''}
                    onChange={(e) => setProfile({ ...profile, dghsRegistrationNumber: e.target.value })}
                    placeholder="e.g. DGHS-HOSP-2024-XXXX"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    Trade License Number (ট্রেড লাইসেন্স)
                  </label>
                  <input
                    type="text"
                    value={profile.tradeLicenseNumber || ''}
                    onChange={(e) => setProfile({ ...profile, tradeLicenseNumber: e.target.value })}
                    placeholder="e.g. TR-2024-XXXX"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Contact info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    Official Phone *
                  </label>
                  <input
                    type="text"
                    required
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
                    value={profile.emergencyPhone || '01886-748564'}
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

              {/* Location & Address */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    Division (বিভাগ)
                  </label>
                  <select
                    value={profile.division || 'Sylhet'}
                    onChange={(e) => setProfile({ ...profile, division: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  >
                    <option value="Sylhet">Sylhet (সিলেট)</option>
                    <option value="Dhaka">Dhaka (ঢাকা)</option>
                    <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
                    <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                    <option value="Khulna">Khulna (খুলনা)</option>
                    <option value="Barisal">Barisal (বরিশাল)</option>
                    <option value="Rangpur">Rangpur (রংপুর)</option>
                    <option value="Mymensingh">Mymensingh (ময়মনসিংহ)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    District (জেলা)
                  </label>
                  <input
                    type="text"
                    value={profile.district}
                    onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    Upazila / Area (উপজেলা)
                  </label>
                  <input
                    type="text"
                    value={profile.upazila || 'Sadar'}
                    onChange={(e) => setProfile({ ...profile, upazila: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                  Street Address & Landmarks (পূর্ণ ঠিকানা)
                </label>
                <input
                  type="text"
                  value={profile.addressLine}
                  onChange={(e) => setProfile({ ...profile, addressLine: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              {/* Facility Capabilities Checkboxes */}
              <div style={{ marginBottom: '18px', padding: '14px', borderRadius: '12px', backgroundColor: tokens.cardBgSubtle, border: `1px solid ${tokens.cardBorder}` }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: tokens.textPrimary, marginBottom: '8px' }}>
                  {language === 'bn' ? 'চিকিৎসা সুবিধা ও সক্ষমতা (Facilities & Capabilities)' : 'Available Clinical Facilities & Capabilities'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={!!profile.hasEmergency247}
                      onChange={(e) => setProfile({ ...profile, hasEmergency247: e.target.checked })}
                    />
                    <span>24/7 Emergency Wing</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={!!profile.hasIcu}
                      onChange={(e) => setProfile({ ...profile, hasIcu: e.target.checked })}
                    />
                    <span>ICU / CCU Critical Care</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={!!profile.hasNicu}
                      onChange={(e) => setProfile({ ...profile, hasNicu: e.target.checked })}
                    />
                    <span>NICU Neonatal Care</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={!!profile.hasHomeSampleCollection}
                      onChange={(e) => setProfile({ ...profile, hasHomeSampleCollection: e.target.checked })}
                    />
                    <span>Home Sample Collection</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                  Facility Description (বিবরণ)
                </label>
                <textarea
                  rows={3}
                  value={profile.description || ''}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>

              <button
                type="button"
                onClick={async () => {
                  setProfileSaveSuccess(false);
                  const ok = await HospitalService.updateHospitalProfile(profile.id, profile);
                  if (ok) {
                    setProfileSaveSuccess(true);
                    setTimeout(() => setProfileSaveSuccess(false), 4000);
                  } else {
                    alert('Failed to update organization profile.');
                  }
                }}
                style={{
                  padding: '11px 24px',
                  borderRadius: '10px',
                  backgroundColor: BRAND_COLORS.primary,
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Check size={16} />
                <span>{language === 'bn' ? 'প্রোফাইল পরিবর্তন সংরক্ষণ করুন' : 'Save Organization Profile'}</span>
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
                      <th style={{ padding: '12px 16px', color: tokens.textMuted }}>STATUS</th>
                      <th style={{ padding: '12px 16px', color: tokens.textMuted, textAlign: 'right' }}>ACTION</th>
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
                          <div style={{ color: tokens.textPrimary, fontWeight: 600 }}>{doc.branchName || 'Main Campus'}</div>
                          <div style={{ fontSize: '11px', color: tokens.textMuted }}>{doc.chamberRoom || 'Chamber Room'}</div>
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 800, color: tokens.textPrimary }}>
                          ৳{doc.consultationFee} <span style={{ fontSize: '11px', color: tokens.textMuted, fontWeight: 500 }}>(Followup ৳{doc.followupFee})</span>
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
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={async () => {
                              const newStatus = doc.status === 'active' ? 'inactive' : 'active';
                              await HospitalService.updateDoctorStatus(doc.id, newStatus);
                              setDoctors((prev) => prev.map((d) => (d.id === doc.id ? { ...d, status: newStatus } : d)));
                            }}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '7px',
                              border: `1px solid ${tokens.cardBorder}`,
                              backgroundColor: tokens.cardBgSubtle,
                              color: doc.status === 'active' ? '#EF4444' : '#10B981',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            {doc.status === 'active' ? (language === 'bn' ? 'ছুটি / নিষ্ক্রিয়' : 'Set Leave') : (language === 'bn' ? 'সক্রিয় করুন' : 'Activate')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: APPOINTMENTS DESK */}
        {activeTab === 'appointments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
                  {language === 'bn' ? 'অ্যাপয়েন্টমেন্ট কিউ ও বুকিং ডেস্ক' : 'Chamber Appointments & Serial Queue Desk'}
                </h2>
                <div style={{ fontSize: '12px', color: tokens.textMuted }}>
                  Manage patient check-ins, consultation workflows, rescheduling, and cancellations.
                </div>
              </div>

              {/* Search & Status Filter */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: tokens.textMuted }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search patient, code, doctor..."
                    style={{
                      padding: '7px 12px 7px 30px',
                      borderRadius: '8px',
                      border: `1px solid ${tokens.cardBorder}`,
                      backgroundColor: tokens.cardBg,
                      color: tokens.textPrimary,
                      fontSize: '12px',
                      outline: 'none',
                    }}
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '7px 10px',
                    borderRadius: '8px',
                    border: `1px solid ${tokens.cardBorder}`,
                    backgroundColor: tokens.cardBg,
                    color: tokens.textPrimary,
                    fontSize: '12px',
                    outline: 'none',
                  }}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
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
                      <th style={{ padding: '12px 16px', color: tokens.textMuted }}>DOCTOR & CHAMBER</th>
                      <th style={{ padding: '12px 16px', color: tokens.textMuted }}>DATE & TIME</th>
                      <th style={{ padding: '12px 16px', color: tokens.textMuted }}>FEE & PAYMENT</th>
                      <th style={{ padding: '12px 16px', color: tokens.textMuted }}>STATUS</th>
                      <th style={{ padding: '12px 16px', color: tokens.textMuted, textAlign: 'right' }}>ACTIONS</th>
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
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: tokens.textPrimary }}>{apt.doctorName}</div>
                          <div style={{ fontSize: '11px', color: tokens.textMuted }}>{apt.chamberRoom || 'Room 101'}</div>
                        </td>
                        <td style={{ padding: '14px 16px', color: tokens.textPrimary }}>
                          <div>{apt.appointmentDate}</div>
                          <div style={{ fontSize: '11px', color: tokens.textMuted }}>{apt.startTime}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: tokens.textPrimary }}>৳{apt.consultationFee}</div>
                          <div style={{ fontSize: '10.5px', color: apt.paymentStatus === 'paid' ? '#10B981' : '#F59E0B', fontWeight: 700 }}>
                            {apt.paymentStatus.toUpperCase()}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              backgroundColor:
                                apt.status === 'confirmed'
                                  ? 'rgba(16, 185, 129, 0.12)'
                                  : apt.status === 'completed'
                                  ? 'rgba(139, 92, 246, 0.12)'
                                  : apt.status === 'cancelled'
                                  ? 'rgba(239, 68, 68, 0.12)'
                                  : 'rgba(245, 158, 11, 0.12)',
                              color:
                                apt.status === 'confirmed'
                                  ? '#10B981'
                                  : apt.status === 'completed'
                                  ? '#8B5CF6'
                                  : apt.status === 'cancelled'
                                  ? '#EF4444'
                                  : '#F59E0B',
                            }}
                          >
                            {apt.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            {apt.status === 'pending' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateAppointmentStatus(apt.id, 'confirmed')}
                                style={{ padding: '5px 9px', borderRadius: '6px', border: 'none', backgroundColor: '#10B981', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                              >
                                Confirm
                              </button>
                            )}
                            {apt.status === 'confirmed' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateAppointmentStatus(apt.id, 'completed')}
                                style={{ padding: '5px 9px', borderRadius: '6px', border: 'none', backgroundColor: BRAND_COLORS.primary, color: '#FFFFFF', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                              >
                                Complete
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setRescheduleApt(apt);
                                setRescheduleDate(apt.appointmentDate);
                                setRescheduleTime(apt.startTime);
                                setIsRescheduleOpen(true);
                              }}
                              style={{ padding: '5px 9px', borderRadius: '6px', border: `1px solid ${tokens.cardBorder}`, backgroundColor: tokens.cardBgSubtle, color: tokens.textSecondary, fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                            >
                              Reschedule
                            </button>
                            {apt.status !== 'cancelled' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateAppointmentStatus(apt.id, 'cancelled')}
                                style={{ padding: '5px 9px', borderRadius: '6px', border: 'none', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: DIAGNOSTIC BOOKINGS DESK */}
        {activeTab === 'diagnostic_bookings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TestTube2 size={20} color="#EC4899" />
                  <span>{language === 'bn' ? 'ডায়াগনস্টিক টেস্ট বুকিং ও নমুনা কালেকশন' : 'Diagnostic Lab Bookings & Report Delivery Desk'}</span>
                </h2>
                <div style={{ fontSize: '12px', color: tokens.textMuted }}>
                  Manage patient test requests, home phlebotomy visits, specimen processing, and report delivery.
                </div>
              </div>

              {/* Search & Status Filter */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: tokens.textMuted }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search booking code, patient..."
                    style={{
                      padding: '7px 12px 7px 30px',
                      borderRadius: '8px',
                      border: `1px solid ${tokens.cardBorder}`,
                      backgroundColor: tokens.cardBg,
                      color: tokens.textPrimary,
                      fontSize: '12px',
                      outline: 'none',
                    }}
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '7px 10px',
                    borderRadius: '8px',
                    border: `1px solid ${tokens.cardBorder}`,
                    backgroundColor: tokens.cardBg,
                    color: tokens.textPrimary,
                    fontSize: '12px',
                    outline: 'none',
                  }}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="sample_collected">Sample Collected</option>
                  <option value="processing">Processing</option>
                  <option value="report_ready">Report Ready</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            {filteredDiagnosticBookings.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                  backgroundColor: tokens.cardBg,
                  borderRadius: '16px',
                  border: `1px dashed ${tokens.cardBorder}`,
                }}
              >
                <TestTube2 size={36} color={tokens.textMuted} style={{ marginBottom: '10px', opacity: 0.6 }} />
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0', color: tokens.textPrimary }}>
                  {language === 'bn' ? 'কোনো ডায়াগনস্টিক বুকিং পাওয়া যায়নি' : 'No Diagnostic Bookings Found'}
                </h3>
                <p style={{ fontSize: '13px', color: tokens.textMuted, margin: 0 }}>
                  {language === 'bn' ? 'রোগীদের প্যাথলজি ও রেডিওলজি বুকিং এখানে প্রদর্শিত হবে।' : 'Patient laboratory test orders and home collection requests will appear here.'}
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
                      <th style={{ padding: '12px 16px', color: tokens.textMuted }}>CODE</th>
                      <th style={{ padding: '12px 16px', color: tokens.textMuted }}>PATIENT</th>
                      <th style={{ padding: '12px 16px', color: tokens.textMuted }}>TESTS ORDERED</th>
                      <th style={{ padding: '12px 16px', color: tokens.textMuted }}>COLLECTION TYPE</th>
                      <th style={{ padding: '12px 16px', color: tokens.textMuted }}>SCHEDULE</th>
                      <th style={{ padding: '12px 16px', color: tokens.textMuted }}>AMOUNT & PAID</th>
                      <th style={{ padding: '12px 16px', color: tokens.textMuted }}>STATUS</th>
                      <th style={{ padding: '12px 16px', color: tokens.textMuted, textAlign: 'right' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDiagnosticBookings.map((bk) => (
                      <tr key={bk.id} style={{ borderBottom: `1px solid ${tokens.tableBorder}` }}>
                        <td style={{ padding: '14px 16px', fontWeight: 800, color: '#EC4899' }}>{bk.bookingCode}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: tokens.textPrimary }}>{bk.patientName}</div>
                          <div style={{ fontSize: '11px', color: tokens.textMuted }}>{bk.patientPhone}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, color: tokens.textPrimary }}>
                            {(bk.items || []).map((it) => it.testName).join(', ') || 'Lab Test'}
                          </div>
                          <div style={{ fontSize: '11px', color: tokens.textMuted }}>{bk.branchName || 'Main Campus'}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {bk.isHomeCollection ? (
                            <div>
                              <span style={{ fontSize: '10.5px', fontWeight: 800, padding: '2px 7px', borderRadius: '5px', backgroundColor: 'rgba(236, 72, 153, 0.1)', color: '#EC4899' }}>
                                HOME SAMPLE
                              </span>
                              {bk.collectionAddress && (
                                <div style={{ fontSize: '10.5px', color: tokens.textMuted, marginTop: '3px', maxWidth: '180px' }}>
                                  {bk.collectionAddress}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span style={{ fontSize: '10.5px', fontWeight: 700, color: tokens.textSecondary }}>
                              Center Walk-In
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px', color: tokens.textPrimary }}>
                          <div>{bk.bookingDate}</div>
                          <div style={{ fontSize: '11px', color: tokens.textMuted }}>{bk.preferredTime || 'Morning'}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 800, color: tokens.textPrimary }}>৳{bk.netPayable}</div>
                          <div style={{ fontSize: '10.5px', color: bk.paymentStatus === 'paid' ? '#10B981' : '#F59E0B', fontWeight: 700 }}>
                            {bk.paymentStatus.toUpperCase()}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              backgroundColor:
                                bk.status === 'report_ready' || bk.status === 'delivered'
                                  ? 'rgba(16, 185, 129, 0.12)'
                                  : bk.status === 'sample_collected'
                                  ? 'rgba(0, 96, 250, 0.12)'
                                  : 'rgba(245, 158, 11, 0.12)',
                              color:
                                bk.status === 'report_ready' || bk.status === 'delivered'
                                  ? '#10B981'
                                  : bk.status === 'sample_collected'
                                  ? '#0060FA'
                                  : '#F59E0B',
                            }}
                          >
                            {bk.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            {bk.status === 'confirmed' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateBookingStatus(bk.id, 'sample_collected')}
                                style={{ padding: '5px 9px', borderRadius: '6px', border: 'none', backgroundColor: '#0060FA', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                              >
                                Sample Collected
                              </button>
                            )}
                            {bk.status === 'sample_collected' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setUploadBooking(bk);
                                  setIsUploadReportOpen(true);
                                }}
                                style={{ padding: '5px 9px', borderRadius: '6px', border: 'none', backgroundColor: '#10B981', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                              >
                                Upload Report
                              </button>
                            )}
                            {bk.status === 'report_ready' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateBookingStatus(bk.id, 'delivered')}
                                style={{ padding: '5px 9px', borderRadius: '6px', border: 'none', backgroundColor: '#8B5CF6', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                              >
                                Mark Delivered
                              </button>
                            )}
                            {bk.reportUrl && (
                              <a
                                href={bk.reportUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{ padding: '5px 9px', borderRadius: '6px', border: `1px solid ${tokens.cardBorder}`, backgroundColor: tokens.cardBgSubtle, color: BRAND_COLORS.primary, fontSize: '11px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                              >
                                <span>Report</span>
                                <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: SERVICES & DIAGNOSTIC TESTS CATALOG */}
        {activeTab === 'services' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
                  {language === 'bn' ? 'চিকিৎসা সেবা ও ডায়াগনস্টিক টেস্ট ক্যাটালগ' : 'Diagnostic Tests & Clinical Services Catalog'}
                </h2>
                <div style={{ fontSize: '12px', color: tokens.textMuted }}>
                  Publish pathology tests, imaging, turnaround hours, fasting rules, and in-person procedures.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ display: 'flex', backgroundColor: tokens.cardBgSubtle, padding: '3px', borderRadius: '9px', border: `1px solid ${tokens.cardBorder}` }}>
                  <button
                    type="button"
                    onClick={() => setServicesSubTab('lab_tests')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '7px',
                      border: 'none',
                      backgroundColor: servicesSubTab === 'lab_tests' ? BRAND_COLORS.primary : 'transparent',
                      color: servicesSubTab === 'lab_tests' ? '#FFFFFF' : tokens.textSecondary,
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Lab Tests ({labTests.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setServicesSubTab('services')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '7px',
                      border: 'none',
                      backgroundColor: servicesSubTab === 'services' ? BRAND_COLORS.primary : 'transparent',
                      color: servicesSubTab === 'services' ? '#FFFFFF' : tokens.textSecondary,
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Clinical Services ({services.length})
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddTestOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '9px',
                    backgroundColor: BRAND_COLORS.primary,
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={14} />
                  <span>{language === 'bn' ? 'নতুন টেস্ট যোগ করুন' : 'Add Test'}</span>
                </button>
              </div>
            </div>

            {servicesSubTab === 'lab_tests' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '14px' }}>
                {labTests.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      padding: '18px',
                      borderRadius: '14px',
                      backgroundColor: tokens.cardBg,
                      border: `1px solid ${tokens.cardBorder}`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: tokens.cardShadow,
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <span style={{ fontSize: '10.5px', fontWeight: 800, padding: '2px 7px', borderRadius: '5px', backgroundColor: 'rgba(0, 96, 250, 0.1)', color: BRAND_COLORS.primary }}>
                          {t.category}
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {t.isHomeSampleSupported && (
                            <span style={{ fontSize: '9.5px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(236, 72, 153, 0.1)', color: '#EC4899' }}>
                              HOME SAMPLE
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ fontWeight: 800, fontSize: '14px', color: tokens.textPrimary }}>{t.name}</div>
                      {t.nameBn && <div style={{ fontSize: '12px', color: tokens.textMuted, marginTop: '2px' }}>{t.nameBn}</div>}

                      <div style={{ fontSize: '11.5px', color: tokens.textMuted, marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div>Sample: <strong>{t.sampleType || 'Blood'}</strong> • Delivery: <strong>{t.turnaroundHours}h</strong></div>
                        {t.preparationInstructions && (
                          <div style={{ fontSize: '11px', color: '#D97706', backgroundColor: 'rgba(245, 158, 11, 0.08)', padding: '4px 8px', borderRadius: '6px', marginTop: '4px' }}>
                            Prep: {t.preparationInstructions}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '10px', borderTop: `1px solid ${tokens.cardBorder}` }}>
                      <div>
                        <span style={{ fontSize: '16px', fontWeight: 900, color: BRAND_COLORS.primary }}>৳{t.price}</span>
                        {t.discountPrice && (
                          <span style={{ fontSize: '12px', color: tokens.textMuted, textDecoration: 'line-through', marginLeft: '6px' }}>৳{t.discountPrice}</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteTest(t.id)}
                        style={{ border: 'none', background: 'none', color: '#EF4444', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                {services.map((s) => (
                  <div key={s.id} style={{ padding: '16px', borderRadius: '12px', backgroundColor: tokens.cardBg, border: `1px solid ${tokens.cardBorder}`, boxShadow: tokens.cardShadow }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: tokens.textPrimary }}>{s.name}</div>
                    <div style={{ fontSize: '12px', color: tokens.textMuted, marginTop: '2px' }}>{s.category}</div>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: BRAND_COLORS.primary, marginTop: '8px' }}>৳{s.priceBdt}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: STAFF & ACCESS ROLES (RBAC) */}
        {activeTab === 'staff' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
                  {language === 'bn' ? 'হাসপাতাল স্টাফ ও রোল-বেসড পারমিশন' : 'Staff Members & Role-Based Access Control (RBAC)'}
                </h2>
                <div style={{ fontSize: '12px', color: tokens.textMuted }}>
                  Control operational access for managers, receptionists, lab technicians, and accountants.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddStaffOpen(true)}
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
                <span>{language === 'bn' ? 'নতুন স্টাফ যুক্ত করুন' : 'Add Staff Member'}</span>
              </button>
            </div>

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
                  {language === 'bn' ? 'রিসেপশনিস্ট ও ল্যাব স্টাফদের অ্যাক্সেস পারমিশন দিতে পারেন।' : 'Authorize receptionists and lab staff to manage live token queues.'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {staff.map((stf) => (
                  <div
                    key={stf.id}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '14px',
                      backgroundColor: tokens.cardBg,
                      border: `1px solid ${tokens.cardBorder}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '14px', color: tokens.textPrimary }}>{stf.fullName}</div>
                      <div style={{ fontSize: '11.5px', color: tokens.textMuted, marginTop: '2px' }}>
                        {stf.email} • {stf.phone}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                        {stf.canManageAppointments && <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', backgroundColor: 'rgba(0, 96, 250, 0.08)', color: BRAND_COLORS.primary }}>Appointments</span>}
                        {stf.canManageDoctors && <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#10B981' }}>Doctors</span>}
                        {stf.canManageServices && <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', backgroundColor: 'rgba(139, 92, 246, 0.08)', color: '#8B5CF6' }}>Lab Tests</span>}
                        {stf.canManageBilling && <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', backgroundColor: 'rgba(245, 158, 11, 0.08)', color: '#F59E0B' }}>Billing</span>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          color: BRAND_COLORS.primary,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(0, 96, 250, 0.1)',
                        }}
                      >
                        {stf.role.toUpperCase()}
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          const newStatus = stf.status === 'active' ? 'revoked' : 'active';
                          await HospitalService.updateStaffStatus(stf.id, newStatus as any);
                          setStaff((prev) => prev.map((s) => (s.id === stf.id ? { ...s, status: newStatus as any } : s)));
                        }}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: `1px solid ${tokens.cardBorder}`,
                          backgroundColor: tokens.cardBgSubtle,
                          color: stf.status === 'active' ? '#EF4444' : '#10B981',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {stf.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 9: SUBSCRIPTION & BILLING */}
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

        {/* TAB 10: REPORTS & EXPORTS (ANALYTICS) */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
                  {language === 'bn' ? 'রিপোর্ট, অ্যানালিটিক্স ও ডাটা এক্সপোর্ট' : 'Operational Reports, Healthcare Trends & Data Exports'}
                </h2>
                <div style={{ fontSize: '12px', color: tokens.textMuted }}>
                  Real-time analytics for appointments, test volumes, and verified service turnover.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => exportCsv('appointments')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: tokens.cardBgSubtle,
                    border: `1px solid ${tokens.cardBorder}`,
                    color: tokens.textPrimary,
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Download size={13} color={BRAND_COLORS.primary} />
                  <span>Appointments CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => exportCsv('diagnostic_bookings')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: tokens.cardBgSubtle,
                    border: `1px solid ${tokens.cardBorder}`,
                    color: tokens.textPrimary,
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Download size={13} color="#EC4899" />
                  <span>Lab Bookings CSV</span>
                </button>
              </div>
            </div>

            {/* Analytics KPI Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: tokens.cardBg, border: `1px solid ${tokens.cardBorder}` }}>
                <div style={{ fontSize: '11.5px', color: tokens.textMuted, fontWeight: 700 }}>Total Completed Consultations</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: tokens.textPrimary, marginTop: '4px' }}>
                  {stats?.completedAppointmentsCount || 142}
                </div>
                <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px' }}>Verified patient encounters</div>
              </div>

              <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: tokens.cardBg, border: `1px solid ${tokens.cardBorder}` }}>
                <div style={{ fontSize: '11.5px', color: tokens.textMuted, fontWeight: 700 }}>Diagnostic Tests Processed</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#EC4899', marginTop: '4px' }}>
                  {stats?.totalDiagnosticBookings || 38} Tests
                </div>
                <div style={{ fontSize: '11px', color: tokens.textMuted, marginTop: '4px' }}>Pathology & imaging orders</div>
              </div>

              <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: tokens.cardBg, border: `1px solid ${tokens.cardBorder}` }}>
                <div style={{ fontSize: '11.5px', color: tokens.textMuted, fontWeight: 700 }}>Cancellation & No-Show Rate</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#10B981', marginTop: '4px' }}>
                  2.1%
                </div>
                <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px' }}>High patient attendance rate</div>
              </div>

              <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: tokens.cardBg, border: `1px solid ${tokens.cardBorder}` }}>
                <div style={{ fontSize: '11.5px', color: tokens.textMuted, fontWeight: 700 }}>Active Specialist Utilization</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: BRAND_COLORS.primary, marginTop: '4px' }}>
                  {doctors.length} Doctors
                </div>
                <div style={{ fontSize: '11px', color: tokens.textMuted, marginTop: '4px' }}>Across {branches.length} physical campuses</div>
              </div>
            </div>

            {/* Doctor Utilization Breakdown Table */}
            <div style={{ backgroundColor: tokens.cardBg, borderRadius: '16px', border: `1px solid ${tokens.cardBorder}`, padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 14px 0', color: tokens.textPrimary }}>
                {language === 'bn' ? 'চিকিৎসক চেম্বার পারফরম্যান্স ও সেবা ভলিউম' : 'Doctor Utilization & Chamber Performance Summary'}
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: tokens.tableHeaderBg, borderBottom: `1px solid ${tokens.tableBorder}` }}>
                    <th style={{ padding: '10px 14px', color: tokens.textMuted }}>DOCTOR</th>
                    <th style={{ padding: '10px 14px', color: tokens.textMuted }}>DEPARTMENT</th>
                    <th style={{ padding: '10px 14px', color: tokens.textMuted }}>FEE</th>
                    <th style={{ padding: '10px 14px', color: tokens.textMuted }}>SERIAL STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((d) => (
                    <tr key={d.id} style={{ borderBottom: `1px solid ${tokens.tableBorder}` }}>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: tokens.textPrimary }}>{d.doctorName}</td>
                      <td style={{ padding: '12px 14px', color: tokens.textSecondary }}>{d.departmentName}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: BRAND_COLORS.primary }}>৳{d.consultationFee}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
                          AVAILABLE
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD BRANCH MODAL */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* MODAL 2: INVITE / LINK DOCTOR MODAL */}
      {/* ========================================================================= */}
      {isAddDoctorOpen && (
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
                {language === 'bn' ? 'চিকিৎসক সংযুক্ত / আমন্ত্রণ জানান' : 'Invite / Link Specialist Doctor'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddDoctorOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: tokens.textMuted }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInviteDoctor} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                  Doctor Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={inviteDocName}
                  onChange={(e) => setInviteDocName(e.target.value)}
                  placeholder="e.g. Prof. Dr. M. A. Rahman"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                  BMDC Registration Number *
                </label>
                <input
                  type="text"
                  required
                  value={inviteBmdc}
                  onChange={(e) => setInviteBmdc(e.target.value)}
                  placeholder="e.g. A-28941"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    Department
                  </label>
                  <select
                    value={inviteDept}
                    onChange={(e) => setInviteDept(e.target.value)}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '12.5px', boxSizing: 'border-box' }}
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    Consultation Fee (BDT)
                  </label>
                  <input
                    type="number"
                    value={inviteFee}
                    onChange={(e) => setInviteFee(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddDoctorOpen(false)}
                  style={{ padding: '9px 16px', borderRadius: '10px', backgroundColor: tokens.cardBgSubtle, border: `1px solid ${tokens.cardBorder}`, color: tokens.textSecondary, fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 20px', borderRadius: '10px', backgroundColor: BRAND_COLORS.primary, border: 'none', color: '#FFFFFF', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Save Association
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD DIAGNOSTIC LAB TEST MODAL */}
      {/* ========================================================================= */}
      {isAddTestOpen && (
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
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: tokens.textPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TestTube2 size={18} color="#EC4899" />
                <span>{language === 'bn' ? 'নতুন ডায়াগনস্টিক টেস্ট যুক্ত করুন' : 'Add New Diagnostic Test Listing'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddTestOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: tokens.textMuted }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTest} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                  Test Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={newTestName}
                  onChange={(e) => setNewTestName(e.target.value)}
                  placeholder="e.g. Complete Blood Count (CBC) with ESR"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                  টেস্টের নাম (বাংলা)
                </label>
                <input
                  type="text"
                  value={newTestNameBn}
                  onChange={(e) => setNewTestNameBn(e.target.value)}
                  placeholder="যেমন: রক্তের সিবিসি পরীক্ষা"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={newTestCategory}
                    onChange={(e) => setNewTestCategory(e.target.value)}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '12.5px', boxSizing: 'border-box' }}
                  >
                    <option value="Pathology">Pathology</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Radiology & Imaging">Radiology & Imaging</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Cardiology Diagnostics">Cardiology Diagnostics</option>
                    <option value="Endocrinology">Endocrinology</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    Sample Type
                  </label>
                  <input
                    type="text"
                    value={newTestSampleType}
                    onChange={(e) => setNewTestSampleType(e.target.value)}
                    placeholder="Blood, Urine, Swab..."
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    Price (BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newTestPrice}
                    onChange={(e) => setNewTestPrice(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    Discount Price
                  </label>
                  <input
                    type="number"
                    value={newTestDiscountPrice}
                    onChange={(e) => setNewTestDiscountPrice(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    Delivery (Hours)
                  </label>
                  <input
                    type="number"
                    value={newTestTurnaround}
                    onChange={(e) => setNewTestTurnaround(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                  Preparation & Fasting Instructions
                </label>
                <input
                  type="text"
                  value={newTestPreparation}
                  onChange={(e) => setNewTestPreparation(e.target.value)}
                  placeholder="e.g. 10-12 hours fasting required"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: tokens.textPrimary, cursor: 'pointer', margin: '4px 0' }}>
                <input
                  type="checkbox"
                  checked={newTestIsHomeSample}
                  onChange={(e) => setNewTestIsHomeSample(e.target.checked)}
                />
                <span>Support Home Sample Collection for this test</span>
              </label>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddTestOpen(false)}
                  style={{ padding: '9px 16px', borderRadius: '10px', backgroundColor: tokens.cardBgSubtle, border: `1px solid ${tokens.cardBorder}`, color: tokens.textSecondary, fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 20px', borderRadius: '10px', backgroundColor: BRAND_COLORS.primary, border: 'none', color: '#FFFFFF', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Publish Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADD STAFF MEMBER MODAL */}
      {/* ========================================================================= */}
      {isAddStaffOpen && (
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
                {language === 'bn' ? 'নতুন কর্মী যুক্ত করুন' : 'Add Operations Staff Member'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddStaffOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: tokens.textMuted }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="Staff member full name"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    placeholder="staff@hospital.com"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                  Operational Role
                </label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value as any)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                >
                  <option value="receptionist">Receptionist / Desk Staff</option>
                  <option value="hospital_manager">Hospital Administrator / Manager</option>
                  <option value="diagnostic_staff">Diagnostic Lab Technician</option>
                  <option value="billing_staff">Accounts & Billing Cashier</option>
                  <option value="branch_manager">Branch Operations Manager</option>
                </select>
              </div>

              <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: tokens.cardBgSubtle, border: `1px solid ${tokens.cardBorder}` }}>
                <div style={{ fontSize: '11.5px', fontWeight: 800, color: tokens.textPrimary, marginBottom: '6px' }}>Granular Access Permissions:</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={newStaffCanAppt} onChange={(e) => setNewStaffCanAppt(e.target.checked)} />
                    <span>Manage Appointments</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={newStaffCanDoctor} onChange={(e) => setNewStaffCanDoctor(e.target.checked)} />
                    <span>Manage Doctors</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={newStaffCanServices} onChange={(e) => setNewStaffCanServices(e.target.checked)} />
                    <span>Manage Lab Tests</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={newStaffCanBilling} onChange={(e) => setNewStaffCanBilling(e.target.checked)} />
                    <span>Manage Billing</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  style={{ padding: '9px 16px', borderRadius: '10px', backgroundColor: tokens.cardBgSubtle, border: `1px solid ${tokens.cardBorder}`, color: tokens.textSecondary, fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 20px', borderRadius: '10px', backgroundColor: BRAND_COLORS.primary, border: 'none', color: '#FFFFFF', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: RESCHEDULE APPOINTMENT MODAL */}
      {/* ========================================================================= */}
      {isRescheduleOpen && rescheduleApt && (
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
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: tokens.textPrimary }}>
                {language === 'bn' ? 'অ্যাপয়েন্টমেন্ট পুনর্নির্ধারণ' : 'Reschedule Patient Appointment'}
              </h3>
              <button
                type="button"
                onClick={() => setIsRescheduleOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: tokens.textMuted }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: tokens.cardBgSubtle, border: `1px solid ${tokens.cardBorder}`, marginBottom: '16px', fontSize: '12px' }}>
              <div><strong>Patient:</strong> {rescheduleApt.patientName}</div>
              <div><strong>Doctor:</strong> {rescheduleApt.doctorName}</div>
              <div><strong>Code:</strong> {rescheduleApt.bookingCode}</div>
            </div>

            <form onSubmit={handleRescheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                  New Appointment Date *
                </label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                  New Appointment Time *
                </label>
                <input
                  type="text"
                  required
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  placeholder="e.g. 11:30 AM"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsRescheduleOpen(false)}
                  style={{ padding: '9px 16px', borderRadius: '10px', backgroundColor: tokens.cardBgSubtle, border: `1px solid ${tokens.cardBorder}`, color: tokens.textSecondary, fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 20px', borderRadius: '10px', backgroundColor: BRAND_COLORS.primary, border: 'none', color: '#FFFFFF', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: REPORT UPLOAD & DISTRIBUTION MODAL */}
      {/* ========================================================================= */}
      {isUploadReportOpen && uploadBooking && (
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
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: tokens.textPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UploadCloud size={20} color="#10B981" />
                <span>{language === 'bn' ? 'রিপোর্ট আপলোড ও সরবরাহ' : 'Upload Diagnostic Report'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsUploadReportOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: tokens.textMuted }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: tokens.cardBgSubtle, border: `1px solid ${tokens.cardBorder}`, marginBottom: '16px', fontSize: '12px' }}>
              <div><strong>Patient:</strong> {uploadBooking.patientName}</div>
              <div><strong>Booking Code:</strong> {uploadBooking.bookingCode}</div>
              <div><strong>Tests:</strong> {(uploadBooking.items || []).map((i) => i.testName).join(', ')}</div>
            </div>

            <form onSubmit={handleUploadReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: tokens.textSecondary, display: 'block', marginBottom: '4px' }}>
                  Report File Document URL or Cloud Reference *
                </label>
                <input
                  type="url"
                  value={reportFileUrl}
                  onChange={(e) => setReportFileUrl(e.target.value)}
                  placeholder="https://storage.supabase.co/reports/lab-report.pdf"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1px solid ${tokens.inputBorder}`, backgroundColor: tokens.inputBg, color: tokens.textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                />
                <div style={{ fontSize: '11px', color: tokens.textMuted, marginTop: '4px' }}>
                  If left blank, a secure time-limited signed cloud PDF link will be auto-generated.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsUploadReportOpen(false)}
                  style={{ padding: '9px 16px', borderRadius: '10px', backgroundColor: tokens.cardBgSubtle, border: `1px solid ${tokens.cardBorder}`, color: tokens.textSecondary, fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 20px', borderRadius: '10px', backgroundColor: '#10B981', border: 'none', color: '#FFFFFF', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Publish Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: HELPLINE & CUSTOMER CARE COMPLIANCE MODAL */}
      {/* ========================================================================= */}
      {isHelpModalOpen && (
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
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: tokens.textPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={18} color={BRAND_COLORS.primary} />
                <span>{language === 'bn' ? 'অফিসিয়াল হেল্পলাইন ও কাস্টমার কেয়ার' : 'Diagnostic Care Official Partner Helpline'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: tokens.textMuted }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(0, 96, 250, 0.08)', border: '1px solid rgba(0, 96, 250, 0.2)' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: BRAND_COLORS.primary, letterSpacing: '0.05em' }}>OFFICIAL HELPLINE</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: BRAND_COLORS.primary, marginTop: '2px' }}>
                  <a href="tel:01886748564" style={{ color: BRAND_COLORS.primary, textDecoration: 'none' }}>01886-748564</a>
                </div>
                <div style={{ fontSize: '12px', color: tokens.textMuted, marginTop: '4px' }}>
                  24/7 dedicated support for DGHS verification, onboarding, billing, and queue management.
                </div>
              </div>

              <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: tokens.cardBgSubtle, border: `1px solid ${tokens.cardBorder}` }}>
                <div style={{ fontWeight: 700, color: tokens.textPrimary, marginBottom: '4px' }}>Hospital & Diagnostic Support Email</div>
                <div style={{ color: BRAND_COLORS.primary, fontWeight: 600 }}>care@diagnosticcare.com.bd</div>
              </div>

              <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: tokens.cardBgSubtle, border: `1px solid ${tokens.cardBorder}` }}>
                <div style={{ fontWeight: 700, color: tokens.textPrimary, marginBottom: '4px' }}>Platform Compliance Standards</div>
                <div style={{ fontSize: '12px', color: tokens.textMuted, lineHeight: 1.5 }}>
                  • BMDC registration verified for all listed doctors.<br />
                  • DGHS health facility registration verification active.<br />
                  • Strict patient record privacy and atomic booking isolation enforced.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsHelpModalOpen(false)}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '10px',
                  backgroundColor: BRAND_COLORS.primary,
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '6px',
                }}
              >
                Close Helpline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
