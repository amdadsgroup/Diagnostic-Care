'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BRAND_CONSTANTS, SupportedLanguage } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import { UserRole, ScheduleSlot, DoctorAssociation, Appointment, DiagnosticTest } from '@/types';
import { INITIAL_APP_STATE } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SlotBookingModal } from '@/components/SlotBookingModal';
import { LiveQueueCard } from '@/components/LiveQueueCard';
import { DoctorAssistantView } from '@/components/DoctorAssistantView';
import { DiagnosticAdminView } from '@/components/DiagnosticAdminView';
import { SuperAdminView } from '@/components/SuperAdminView';
import AuthModal from '@/components/auth/AuthModal';
import ProviderOnboardingModal from '@/components/provider/ProviderOnboardingModal';
import DoctorPortal from '@/components/doctor/DoctorPortal';
import PatientDashboard from '@/components/patient/PatientDashboard';
import LiveQueueTracker from '@/components/queue/LiveQueueTracker';
import TestBookingModal from '@/components/diagnostic/TestBookingModal';
import SecureReportViewer from '@/components/diagnostic/SecureReportViewer';
import PrescriptionSlipModal from '@/components/prescription/PrescriptionSlipModal';
import PaymentModal from '@/components/payment/PaymentModal';
import LedgerViewer from '@/components/finance/LedgerViewer';
import AdvancedSearchFilter from '@/components/search/AdvancedSearchFilter';
import VerifiedReviewsModal from '@/components/reviews/VerifiedReviewsModal';
import ProviderAnalyticsDashboard from '@/components/analytics/ProviderAnalyticsDashboard';
import HelplineBookingConsole from '@/components/support/HelplineBookingConsole';
import CategoryNavigator, { HealthcareCategoryKey } from '@/components/marketplace/CategoryNavigator';
import AmbulanceDispatcher from '@/components/ambulance/AmbulanceDispatcher';
import HomeCareBookingModal from '@/components/homecare/HomeCareBookingModal';
import SupportTicketModal from '@/components/support/SupportTicketModal';
import ComprehensiveAdminConsole from '@/components/admin/ComprehensiveAdminConsole';
import HeroSection from '@/components/marketplace/HeroSection';
import TrustSection from '@/components/marketplace/TrustSection';
import HomeSampleCollectionSection from '@/components/marketplace/HomeSampleCollectionSection';
import MapDiscovery from '@/components/marketplace/MapDiscovery';
import MobileNavigation, { ActiveNavTab } from '@/components/navigation/MobileNavigation';
import PatientMobileHome from '@/components/patient/PatientMobileHome';
import MobileAppointmentsView from '@/components/patient/MobileAppointmentsView';
import MobileHealthVaultView from '@/components/patient/MobileHealthVaultView';
import MobileProfileView from '@/components/patient/MobileProfileView';
import MobileSearchView from '@/components/search/MobileSearchView';
import LocationModal from '@/components/location/LocationModal';
import NotificationSettingsModal from '@/components/notifications/NotificationSettingsModal';
import { servicesEngine } from '@/lib/services-engine';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import { DoctorService } from '@/services/doctor.service';
import { DiagnosticService } from '@/services/diagnostic.service';
import { AppointmentService } from '@/services/appointment.service';

import {
  Search,
  MapPin,
  CheckCircle2,
  Calendar,
  Clock,
  Award,
  TestTube2,
  Stethoscope,
  Building2,
  ShieldCheck,
  FileText,
  Download,
  Phone,
  Sparkles,
  HeartPulse,
  UserCheck,
  AlertCircle,
  Lock,
  ArrowRight,
  Printer,
  ChevronRight,
  Activity,
  Layers,
  Pill,
} from 'lucide-react';

export default function HomePage() {
  // English is the default language as strictly required
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [currentRole, setCurrentRole] = useState<UserRole>('PATIENT');
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('marketplace');

  // App State
  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(null);
  const [appState, setAppState] = useState(INITIAL_APP_STATE);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Moulvibazar');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('Moulvibazar Sadar');

  // Modal State
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);
  const [selectedAssociation, setSelectedAssociation] = useState<DoctorAssociation | null>(null);
  const [confirmedBookingNotice, setConfirmedBookingNotice] = useState<Appointment | null>(null);
  const [onboardingNotice, setOnboardingNotice] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProviderOnboardOpen, setIsProviderOnboardOpen] = useState(false);
  const [selectedBookingTest, setSelectedBookingTest] = useState<DiagnosticTest | null>(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activePaymentPayload, setActivePaymentPayload] = useState<{ bookingCode: string; amount: number; name: string; org: string } | null>(null);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isHelplineOpen, setIsHelplineOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<HealthcareCategoryKey>('ALL');
  const [isAmbulanceModalOpen, setIsAmbulanceModalOpen] = useState(false);
  const [isHomeCareModalOpen, setIsHomeCareModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  // Restore language & location and detect PWA shortcut action from URL + Load Supabase data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dc_lang') as SupportedLanguage | null;
      if (saved === 'en' || saved === 'bn') {
        setLanguage(saved);
      }

      const savedLoc = localStorage.getItem('dc_user_location');
      if (savedLoc) {
        setSelectedLocation(savedLoc);
      }

      // Check active Supabase Auth user
      AuthService.getCurrentUser().then((user) => {
        if (user) {
          setCurrentUser(user);
          setCurrentRole(user.primaryRole);
          // Load patient's real appointments from Supabase
          AppointmentService.getPatientAppointments(user.id).then((apts) => {
            if (apts.length > 0) {
              setAppState((prev) => ({ ...prev, appointments: apts }));
            }
          });
        }
      });

      // Load doctors and diagnostic tests from Supabase
      Promise.all([
        DoctorService.getDoctors(),
        DiagnosticService.getLabTests(),
        DiagnosticService.getDiagnosticCenters(),
      ]).then(([docs, tests, orgs]) => {
        setAppState((prev) => ({
          ...prev,
          doctors: docs.length > 0 ? docs : prev.doctors,
          diagnosticTests: tests.length > 0 ? tests : prev.diagnosticTests,
          organizations: orgs.length > 0 ? orgs : prev.organizations,
        }));
      }).catch((err) => {
        console.warn('Initial data load notice:', err);
      });

      // Detect PWA App Shortcuts in URL
      const params = new URLSearchParams(window.location.search);
      const action = params.get('action');
      const tab = params.get('tab');

      if (action === 'find-doctor' || action === 'book-test') {
        setActiveTab('search');
      } else if (action === 'appointments') {
        setActiveTab('appointments');
      } else if (action === 'vault') {
        setActiveTab('reports');
      } else if (action === 'emergency') {
        setIsAmbulanceModalOpen(true);
      } else if (tab && ['marketplace', 'search', 'appointments', 'queue', 'reports', 'prescriptions', 'portal', 'profile'].includes(tab)) {
        setActiveTab(tab as ActiveNavTab);
      }
    }
  }, []);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dc_lang', lang);
    }
  };

  const t = TRANSLATIONS[language];
  const todayKey = 'assoc-anisur-popular_' + new Date().toISOString().split('T')[0];
  const activeQueue = appState.queues[todayKey] || Object.values(appState.queues)[0];

  // Handle slot click -> initiate 5-min temporary hold
  const handleSelectSlot = (slot: ScheduleSlot, assoc: DoctorAssociation) => {
    if (slot.status === 'CONFIRMED' || slot.status === 'BLOCKED') return;

    const dateKey = `${assoc.id}_${slot.slotDate}`;
    const currentSlots = appState.slots[dateKey] || [];
    const updatedSlots = currentSlots.map((s) =>
      s.id === slot.id
        ? { ...s, status: 'HELD' as const, holdExpiresAt: new Date(Date.now() + 300000).toISOString() }
        : s
    );

    setAppState((prev) => ({
      ...prev,
      slots: { ...prev.slots, [dateKey]: updatedSlots },
      activeHoldSlotId: slot.id,
      holdExpiresAt: Date.now() + 300000,
    }));

    setSelectedSlot(slot);
    setSelectedAssociation(assoc);
  };

  // Confirm booking
  const handleConfirmBooking = (data: {
    patientName: string;
    patientPhone: string;
    patientAge: number;
    patientGender: 'MALE' | 'FEMALE' | 'OTHER';
    paymentMethod: 'CASH_AT_DESK' | 'PAID';
  }) => {
    if (!selectedSlot || !selectedAssociation) return;

    const dateKey = `${selectedAssociation.id}_${selectedSlot.slotDate}`;
    const currentQueue = appState.queues[dateKey] || {
      doctorAssociationId: selectedAssociation.id,
      queueDate: selectedSlot.slotDate,
      currentTokenServing: 1,
      totalTokensIssued: 3,
      avgConsultationMinutes: 15,
    };

    const nextToken = currentQueue.totalTokensIssued + 1;
    const newBookingCode = `DC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment: Appointment = {
      id: `app-${Date.now()}`,
      bookingCode: newBookingCode,
      scheduleSlotId: selectedSlot.id,
      doctorAssociationId: selectedAssociation.id,
      branchId: selectedAssociation.branchId,
      doctorName: selectedAssociation.doctor?.fullName || 'Specialist Doctor',
      specialization: selectedAssociation.doctor?.specialization || 'Consultant',
      organizationName: selectedAssociation.organizationName,
      branchName: selectedAssociation.branchName,
      patientUserId: currentUser?.id || 'user-patient-current',
      patientName: data.patientName,
      patientPhone: data.patientPhone,
      patientAge: data.patientAge,
      patientGender: data.patientGender,
      appointmentDate: selectedSlot.slotDate,
      startTime: selectedSlot.startTime,
      consultationFee: selectedAssociation.consultationFee,
      tokenNumber: nextToken,
      status: 'CONFIRMED',
      paymentStatus: data.paymentMethod,
      createdAt: new Date().toISOString(),
    };

    // Asynchronously persist to Supabase
    AppointmentService.bookAppointment({
      patientId: currentUser?.id || 'a0000000-0000-0000-0000-000000000001',
      doctorId: selectedAssociation.doctorId || 'b0000000-0000-0000-0000-000000000001',
      providerId: selectedAssociation.organizationId || 'c0000000-0000-0000-0000-000000000001',
      branchId: selectedAssociation.branchId,
      appointmentDate: selectedSlot.slotDate,
      startTime: selectedSlot.startTime,
      patientName: data.patientName,
      patientPhone: data.patientPhone,
      patientAge: data.patientAge,
      patientGender: data.patientGender,
      consultationFee: selectedAssociation.consultationFee,
      doctorName: selectedAssociation.doctor?.fullName,
      specialization: selectedAssociation.doctor?.specialization,
      organizationName: selectedAssociation.organizationName,
      branchName: selectedAssociation.branchName,
    }).then(({ appointment, error }) => {
      if (appointment) {
        setConfirmedBookingNotice(appointment);
      }
      if (error) {
        console.warn('Supabase booking note:', error);
      }
    });

    const updatedSlots = (appState.slots[dateKey] || []).map((s) =>
      s.id === selectedSlot.id ? { ...s, status: 'CONFIRMED' as const } : s
    );

    setAppState((prev) => ({
      ...prev,
      slots: { ...prev.slots, [dateKey]: updatedSlots },
      appointments: [newAppointment, ...prev.appointments],
      queues: {
        ...prev.queues,
        [dateKey]: {
          ...currentQueue,
          totalTokensIssued: nextToken,
        },
      },
      activeHoldSlotId: null,
      holdExpiresAt: null,
    }));

    setSelectedSlot(null);
    setConfirmedBookingNotice(newAppointment);
  };

  // Call next patient in queue
  const handleCallNext = () => {
    const dateKey = todayKey;
    const queue = appState.queues[dateKey];
    if (!queue) return;

    const nextServing = Math.min(queue.currentTokenServing + 1, queue.totalTokensIssued);
    setAppState((prev) => ({
      ...prev,
      queues: {
        ...prev.queues,
        [dateKey]: {
          ...queue,
          currentTokenServing: nextServing,
        },
      },
    }));
  };

  const handleUpdateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppState((prev) => ({
      ...prev,
      appointments: prev.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
    }));
  };

  // Filter doctors
  const filteredAssociations = appState.doctorAssociations.filter((assoc) => {
    const matchesQuery =
      assoc.doctor?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assoc.doctor?.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assoc.organizationName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = selectedDistrict === 'ALL' || assoc.districtName === selectedDistrict;
    const matchesSpecialty =
      selectedSpecialty === 'ALL' || assoc.doctor?.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase());
    return matchesQuery && matchesDistrict && matchesSpecialty;
  });

  // Filter diagnostic tests
  const filteredTests = appState.diagnosticTests.filter((test) => {
    return (
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.organizationName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Category navigation handler across Header & CategoryNavigator
  const handleCategorySelection = (category: HealthcareCategoryKey) => {
    setActiveCategory(category);
    if (category === 'AMBULANCE') {
      setIsAmbulanceModalOpen(true);
    } else if (category === 'HOME_CARE' || category === 'NURSING') {
      setIsHomeCareModalOpen(true);
    } else if (category === 'EMERGENCY' || category === 'BLOOD_SERVICES') {
      setIsHelplineOpen(true);
    } else if (category === 'DOCTOR' || category === 'DOCTORS') {
      const el = document.getElementById('doctor-discovery-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (category === 'DIAGNOSTIC_CENTER') {
      const el = document.getElementById('diagnostic-centers-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (category === 'DIAGNOSTIC_TESTS' || category === 'TESTS') {
      const el = document.getElementById('diagnostic-tests-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (category === 'HOSPITAL' || category === 'HOSPITALS') {
      const el = document.getElementById('hospitals-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (category === 'PHARMACY' || category === 'PHARMACIES') {
      const el = document.getElementById('pharmacies-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Advanced search result click handler
  const handleSearchSelectResult = (item: any) => {
    if (item.type === 'DOCTOR') {
      const assoc =
        appState.doctorAssociations.find((a) => a.doctorId === item.id || a.doctor?.fullName.includes(item.name)) ||
        appState.doctorAssociations[0];
      const todayStr = new Date().toISOString().split('T')[0];
      const firstSlot = (appState.slots[`${assoc.id}_${todayStr}`] || []).find((s) => s.status === 'AVAILABLE') || {
        id: `slot-${assoc.id}-search-sel`,
        doctorScheduleId: `sched-${assoc.id}`,
        doctorAssociationId: assoc.id,
        branchId: assoc.branchId,
        slotDate: todayStr,
        startTime: '16:30',
        endTime: '16:45',
        tokenNumber: 3,
        status: 'AVAILABLE' as const,
      };
      handleSelectSlot(firstSlot, assoc);
    } else if (item.type === 'TEST') {
      const test =
        appState.diagnosticTests.find((t) => t.id === item.id || t.name.includes(item.name)) ||
        appState.diagnosticTests[0];
      setSelectedBookingTest(test);
    } else {
      const el = document.getElementById('diagnostic-centers-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--canvas-bg)' }}>
      {/* Redesigned Futuristic Two-Tier Header */}
      <Header
        language={language}
        setLanguage={handleLanguageChange}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenOnboard={() => setIsProviderOnboardOpen(true)}
        selectedLocation={selectedLocation}
        onOpenLocation={() => setIsLocationModalOpen(true)}
        onSelectCategory={handleCategorySelection}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {/* Booking Confirmation Flash Alert */}
        {confirmedBookingNotice && (
          <div
            style={{
              backgroundColor: 'var(--emerald-50)',
              borderBottom: '2px solid var(--emerald-500)',
              padding: '16px 0',
              animation: 'slideDown 0.3s ease-out',
            }}
          >
            <div
              className="container"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={24} color="#10B981" />
                <div>
                  <div style={{ fontWeight: 800, color: '#065F46', fontSize: '15px' }}>
                    {t.bookingConfirmedTitle} — Token #{confirmedBookingNotice.tokenNumber.toString().padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '13px', color: '#047857' }}>
                    Booking Code: <strong>{confirmedBookingNotice.bookingCode}</strong> • {confirmedBookingNotice.doctorName} at {confirmedBookingNotice.organizationName} ({confirmedBookingNotice.startTime})
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => {
                    setActivePaymentPayload({
                      bookingCode: confirmedBookingNotice.bookingCode,
                      amount: confirmedBookingNotice.consultationFee,
                      name: confirmedBookingNotice.doctorName,
                      org: confirmedBookingNotice.organizationName,
                    });
                    setIsPaymentModalOpen(true);
                  }}
                  style={{
                    backgroundColor: '#D12053',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(209, 32, 83, 0.3)',
                  }}
                >
                  💳 bKash / Nagad Online Pay
                </button>
                <button
                  onClick={() => setActiveTab('queue')}
                  style={{
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  View in Live Queue
                </button>
                <button
                  onClick={() => setConfirmedBookingNotice(null)}
                  style={{ color: '#065F46', fontSize: '18px', padding: '4px 8px', fontWeight: 700 }}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* B2B Onboarding Success Flash Alert */}
        {onboardingNotice && (
          <div
            style={{
              backgroundColor: 'var(--emerald-50)',
              borderBottom: '2px solid var(--emerald-500)',
              padding: '16px 0',
              animation: 'slideDown 0.3s ease-out',
            }}
          >
            <div
              className="container"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={24} color="#10B981" />
                <div>
                  <div style={{ fontWeight: 800, color: '#065F46', fontSize: '15px' }}>
                    {language === 'en' ? 'Provider Registration Received' : 'স্বাস্থ্যসেবা প্রদানকারী নিবন্ধন গৃহীত হয়েছে'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#047857' }}>
                    {onboardingNotice}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOnboardingNotice(null)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #10B981',
                  color: '#065F46',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {language === 'en' ? 'Dismiss' : 'বন্ধ করুন'}
              </button>
            </div>
          </div>
        )}

        {/* SEARCH VIEW (UNIVERSAL MOBILE HEALTHCARE SEARCH) */}
        {activeTab === 'search' && (
          <div className="container" style={{ padding: '24px 16px', maxWidth: '820px' }}>
            <MobileSearchView
              language={language}
              doctorAssociations={appState.doctorAssociations}
              diagnosticTests={appState.diagnosticTests}
              selectedLocation={selectedLocation}
              onSelectSlot={handleSelectSlot}
              onSelectTest={(test) => setSelectedBookingTest(test)}
              onNavigateHome={() => setActiveTab('marketplace')}
            />
          </div>
        )}

        {/* APPOINTMENTS VIEW (MOBILE APPOINTMENTS CENTER) */}
        {activeTab === 'appointments' && (
          <div className="container" style={{ padding: '24px 16px', maxWidth: '820px' }}>
            <MobileAppointmentsView
              appointments={appState.appointments}
              language={language}
              onCancelAppointment={(id) => {
                AppointmentService.cancelAppointment(id);
                setAppState((prev) => ({
                  ...prev,
                  appointments: prev.appointments.map((a) =>
                    a.id === id ? { ...a, status: 'CANCELLED_BY_PATIENT' } : a
                  ),
                }));
              }}
            />
          </div>
        )}

        {/* PROFILE & PWA SETTINGS VIEW */}
        {activeTab === 'profile' && (
          <div className="container" style={{ padding: '24px 16px', maxWidth: '820px' }}>
            <MobileProfileView
              language={language}
              onLanguageChange={handleLanguageChange}
              selectedLocation={selectedLocation}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
              onOpenNotificationsModal={() => setIsNotificationsModalOpen(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
            />
          </div>
        )}

        {/* ROLE BASED VIEWS (PROVIDER & PATIENT PORTAL) */}
        {activeTab === 'portal' && currentRole === 'DOCTOR' && (
          <div className="container" style={{ padding: '36px 20px' }}>
            <DoctorPortal
              doctorName={appState.doctors[0].fullName}
              specialization={appState.doctors[0].specialization}
              chamberName={`${appState.organizations[0].name} (${appState.organizations[0].branches[0].name})`}
            />
          </div>
        )}

        {activeTab === 'portal' && currentRole === 'PATIENT' && (
          <div className="container" style={{ padding: '36px 20px' }}>
            <PatientDashboard />
          </div>
        )}

        {activeTab === 'portal' && currentRole === 'DOCTOR_ASSISTANT' && (
          <div className="container" style={{ padding: '36px 20px' }}>
            <DoctorAssistantView
              assistant={appState.assistants[0]}
              doctorName={appState.doctors[0].fullName}
              specialization={appState.doctors[0].specialization}
              organizationName={appState.organizations[0].name}
              branchName={appState.organizations[0].branches[0].name}
              appointments={appState.appointments}
              queue={activeQueue}
              language={language}
              onCallNext={handleCallNext}
              onUpdateStatus={handleUpdateAppointmentStatus}
            />
          </div>
        )}

        {activeTab === 'portal' && currentRole === 'DIAGNOSTIC_ADMIN' && (
          <div className="container" style={{ padding: '36px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <DiagnosticAdminView
              organization={appState.organizations[0]}
              tests={appState.diagnosticTests}
              associations={appState.doctorAssociations}
              subscriptionPlans={appState.subscriptionPlans}
              language={language}
            />
            <HelplineBookingConsole />
            <ProviderAnalyticsDashboard />
            <LedgerViewer />
          </div>
        )}

        {activeTab === 'portal' && currentRole === 'SUPER_ADMIN' && (
          <div className="container" style={{ padding: '36px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <SuperAdminView
              organizations={appState.organizations}
              doctors={appState.doctors}
              language={language}
            />
            <ComprehensiveAdminConsole />
            <HelplineBookingConsole />
            <ProviderAnalyticsDashboard />
            <LedgerViewer />
          </div>
        )}

        {/* LIVE QUEUE TAB */}
        {activeTab === 'queue' && (
          <div className="container" style={{ padding: '36px 20px', maxWidth: '1060px' }}>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--navy-900)' }}>
                  {t.queueTitle}
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--slate-500)', marginTop: '2px' }}>
                  Real-time chamber serial tracking for Popular Diagnostic Center (Moulvibazar)
                </p>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--emerald-50)', border: '1px solid var(--emerald-500)', padding: '6px 14px', borderRadius: '20px', color: '#065F46', fontWeight: 700, fontSize: '12px' }}>
                <span className="beacon-dot green" />
                <span>Live Chamber Engine Synced</span>
              </div>
            </div>
            <LiveQueueTracker
              doctorName={appState.doctors[0].fullName}
              specialization={appState.doctors[0].specialization}
              chamberName={`${appState.organizations[0].name} (${appState.organizations[0].branches[0].name})`}
            />
          </div>
        )}

        {/* SECURE HEALTH VAULT: REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="container" style={{ padding: '24px 16px', maxWidth: '1060px' }}>
            <div className="d-mobile-only">
              <MobileHealthVaultView language={language} />
            </div>

            <div className="d-desktop-only">
              <div
                style={{
                  background: 'linear-gradient(135deg, var(--navy-900) 0%, var(--navy-800) 100%)',
                  color: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '24px 28px',
                  marginBottom: '28px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(6, 182, 212, 0.2)', padding: '4px 10px', borderRadius: '12px', color: '#67E8F9', fontSize: '11px', fontWeight: 700, marginBottom: '8px' }}>
                    <Lock size={12} />
                    <span>{t.vaultPrivacyBadge}</span>
                  </div>
                  <h1 style={{ fontSize: '26px', fontWeight: 800 }}>{t.vaultTitle}</h1>
                  <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '4px' }}>
                    {t.vaultSubtitle}
                  </p>
                </div>

                <button
                  onClick={() => setIsSupportModalOpen(true)}
                  className="btn-cyan"
                  style={{ padding: '10px 18px', fontSize: '13px' }}
                >
                  <span>Upload New Health File</span>
                </button>
              </div>
              <SecureReportViewer />
            </div>
          </div>
        )}

        {/* SECURE HEALTH VAULT: PRESCRIPTIONS TAB */}
        {activeTab === 'prescriptions' && (
          <div className="container" style={{ padding: '36px 20px', maxWidth: '900px' }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--navy-900)' }}>
                  {language === 'en' ? 'Digital Prescriptions Vault' : 'ডিজিটাল প্রেসক্রিপশন ভল্ট'}
                </h1>
                <p style={{ color: 'var(--slate-600)', fontSize: '14px', marginTop: '4px' }}>
                  Consultation prescriptions written by registered physicians with BMDC credentials.
                </p>
              </div>

              <button
                onClick={() => setIsPrescriptionModalOpen(true)}
                className="btn-cyan"
                style={{ padding: '10px 18px', fontSize: '13px' }}
              >
                <Printer size={15} />
                <span>{t.printPrescriptionBtn}</span>
              </button>
            </div>

            {/* Structured Printable Prescription Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--slate-300)',
                boxShadow: 'var(--shadow-md)',
                overflow: 'hidden',
              }}
            >
              {/* Doctor Header */}
              <div
                style={{
                  background: 'linear-gradient(135deg, var(--navy-950) 0%, var(--navy-900) 100%)',
                  color: '#FFFFFF',
                  padding: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  borderBottom: '1px solid rgba(6, 182, 212, 0.2)',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Dr. Anisur Rahman</h3>
                  <div style={{ fontSize: '13px', color: '#38BDF8', fontWeight: 600 }}>
                    MBBS, FCPS (Cardiology), MD (Cardiovascular Diseases)
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--slate-300)', marginTop: '2px' }}>
                    BMDC Reg No: <strong>A-45892</strong> • Associate Professor of Cardiology
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--slate-300)' }}>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '14px' }}>
                    Popular Diagnostic Center
                  </div>
                  <div>Moulvibazar Main Branch, Room 204</div>
                  <div>Helpline: {BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}</div>
                </div>
              </div>

              {/* Patient Bar */}
              <div
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'var(--slate-100)',
                  borderBottom: '1px solid var(--slate-200)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                  fontWeight: 600,
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div>Patient: <strong>Kamrul Hassan</strong> (34 yrs, Male)</div>
                <div>Date: <strong>Today</strong></div>
                <div>Rx ID: <strong>RX-MB-2026-891</strong></div>
              </div>

              {/* Clinical Notes & Medications */}
              <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
                <div style={{ borderRight: '1px solid var(--slate-200)', paddingRight: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '8px' }}>
                    Clinical Diagnosis
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--slate-700)', lineHeight: 1.5, marginBottom: '16px' }}>
                    Essential Hypertension (Stage 1), Mild Hypercholesterolemia.
                  </p>

                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '8px' }}>
                    Recommended Lab Tests
                  </div>
                  <ul style={{ fontSize: '12px', color: 'var(--slate-700)', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <li>CBC with ESR</li>
                    <li>Lipid Profile (Fasting)</li>
                    <li>Serum Creatinine</li>
                    <li>ECG (12 Leads)</li>
                  </ul>
                </div>

                <div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#0891B2', marginBottom: '12px' }}>
                    ℞ Medications
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                    <div style={{ borderBottom: '1px solid var(--slate-100)', paddingBottom: '10px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>
                        1. Tab. Bisoprolol Fumarate 2.5mg (Cardibis)
                      </div>
                      <div style={{ color: '#0891B2', fontWeight: 600, marginTop: '2px' }}>
                        1 + 0 + 0 (Morning After Breakfast) • 30 Days
                      </div>
                    </div>

                    <div style={{ borderBottom: '1px solid var(--slate-100)', paddingBottom: '10px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>
                        2. Tab. Rosuvastatin 10mg (Rovista)
                      </div>
                      <div style={{ color: '#0891B2', fontWeight: 600, marginTop: '2px' }}>
                        0 + 0 + 1 (Night at Bedtime) • 30 Days
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', padding: '12px', backgroundColor: 'var(--cyan-50)', borderRadius: '8px', fontSize: '12px', color: '#0E7490' }}>
                    <strong>Special Advice:</strong> Low salt diet, regular 30 mins brisk walking. Follow-up consultation in 14 days with Lipid Profile report.
                  </div>
                </div>
              </div>

              {/* Prescription Footer */}
              <div
                style={{
                  padding: '16px 24px',
                  backgroundColor: 'var(--slate-50)',
                  borderTop: '1px solid var(--slate-200)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '12px', color: 'var(--slate-500)' }}>
                  Certified Digital Prescription generated on <strong>{BRAND_CONSTANTS.BRAND_NAME}</strong> platform.
                </div>
                <button
                  onClick={() => setIsPrescriptionModalOpen(true)}
                  style={{
                    backgroundColor: 'var(--navy-800)',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  Print / Save Official PDF Slip 🖨
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRIMARY MARKETPLACE TAB */}
        {activeTab === 'marketplace' && (
          <div>
            {currentRole === 'PATIENT' && (
              <div className="d-mobile-only container" style={{ padding: '16px 16px 28px 16px' }}>
                <PatientMobileHome
                  language={language}
                  selectedLocation={selectedLocation}
                  onOpenLocationModal={() => setIsLocationModalOpen(true)}
                  onOpenNotificationsModal={() => setIsNotificationsModalOpen(true)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onSelectCategory={(cat) => {
                    setActiveCategory(cat);
                    setActiveTab('search');
                  }}
                  onOpenAmbulance={() => setIsAmbulanceModalOpen(true)}
                  onOpenHomeCare={() => setIsHomeCareModalOpen(true)}
                  onOpenHelpline={() => setIsHelplineOpen(true)}
                  upcomingAppointment={appState.appointments.find((a) => a.status === 'CONFIRMED')}
                  activeQueue={activeQueue}
                  doctorAssociations={appState.doctorAssociations}
                  diagnosticTests={appState.diagnosticTests}
                  onSelectSlot={handleSelectSlot}
                  onSelectTest={(test) => setSelectedBookingTest(test)}
                />
              </div>
            )}

            <div className={currentRole === 'PATIENT' ? 'd-desktop-only' : ''}>
              {/* HERO SECTION WITH AI SEARCH COMMAND & REAL-TIME MEDICAL TELEMETRY */}
              <HeroSection
                language={language}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              onSearchSubmit={() => {
                const resultsSection = document.getElementById('doctor-discovery-section');
                if (resultsSection) {
                  resultsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              onOpenHelpline={() => setIsHelplineOpen(true)}
              onSelectCategory={(cat) => handleCategorySelection(cat)}
            />

            {/* TRUST & VERIFICATION METRICS STRIP */}
            <TrustSection language={language} />

            {/* 10 HEALTHCARE VERTICALS CATEGORY NAVIGATOR */}
            <section className="container" style={{ padding: '36px 24px 0 24px' }}>
              <CategoryNavigator
                language={language}
                activeCategory={activeCategory}
                onSelectCategory={(cat) => handleCategorySelection(cat)}
                onOpenAmbulanceModal={() => setIsAmbulanceModalOpen(true)}
                onOpenHomeCareModal={() => setIsHomeCareModalOpen(true)}
                onOpenSupportModal={() => setIsSupportModalOpen(true)}
              />
            </section>

            {/* ADVANCED MULTI-CRITERIA SEARCH ENGINE */}
            <section className="container" style={{ padding: '16px 24px 0 24px' }}>
              <AdvancedSearchFilter onSelectResult={handleSearchSelectResult} />
            </section>

            {/* SPECIALIST DOCTORS SECTION */}
            <section id="doctor-discovery-section" className="container" style={{ padding: '52px 24px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginBottom: '28px',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#0891B2', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                    VERIFIED MEDICAL CHAMBERS
                  </div>
                  <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--navy-900)', letterSpacing: '-0.02em' }}>
                    {t.sectionDoctorsTitle}
                  </h2>
                  <p style={{ color: 'var(--slate-500)', fontSize: '14px', marginTop: '3px' }}>
                    {t.sectionDoctorsSubtitle}
                  </p>
                </div>

                {/* Filter tags */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['ALL', 'Cardiologist', 'Gynecologist', 'Medicine'].map((spec) => (
                    <button
                      key={spec}
                      onClick={() => setSelectedSpecialty(spec)}
                      style={{
                        padding: '7px 16px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: selectedSpecialty === spec ? 'var(--navy-900)' : 'var(--slate-100)',
                        color: selectedSpecialty === spec ? '#FFFFFF' : 'var(--slate-700)',
                        border: selectedSpecialty === spec ? '1px solid var(--navy-900)' : '1px solid var(--slate-200)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {spec === 'ALL' ? t.filterAllSpecialties : spec}
                    </button>
                  ))}
                </div>
              </div>

              {/* Doctors Grid */}
              <div className="grid-cards">
                {filteredAssociations.map((assoc) => {
                  const doctor = assoc.doctor!;
                  const dateKey = `${assoc.id}_${new Date().toISOString().split('T')[0]}`;
                  const slots = appState.slots[dateKey] || [];

                  return (
                    <div
                      key={assoc.id}
                      className="futuristic-card"
                      style={{
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        {/* Doctor Info */}
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '18px' }}>
                          <div
                            style={{
                              width: '60px',
                              height: '60px',
                              borderRadius: '14px',
                              backgroundColor: 'var(--cyan-50)',
                              color: '#0891B2',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '22px',
                              flexShrink: 0,
                              border: '1px solid rgba(6, 182, 212, 0.3)',
                            }}
                          >
                            <Stethoscope size={30} />
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy-900)' }}>
                                {doctor.fullName}
                              </h3>
                              <CheckCircle2 size={17} color="#10B981" />
                            </div>
                            <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0891B2', marginTop: '2px' }}>
                              {doctor.specialization}
                            </div>
                            <div style={{ fontSize: '11.5px', color: 'var(--slate-500)', marginTop: '2px' }}>
                              {doctor.qualifications} • BMDC: <strong>{doctor.bmdcNumber}</strong>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                              <button
                                onClick={() => setIsReviewsModalOpen(true)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  color: '#B45309',
                                  backgroundColor: '#FEF3C7',
                                  padding: '3px 8px',
                                  borderRadius: '12px',
                                  border: '1px solid #FCD34D',
                                  cursor: 'pointer',
                                }}
                              >
                                ⭐ 4.9 (128 {language === 'en' ? 'Verified Reviews' : 'ভেরিফায়েড রিভিউ'})
                              </button>
                              <span
                                style={{
                                  fontSize: '10.5px',
                                  fontWeight: 700,
                                  color: '#047857',
                                  background: 'var(--emerald-50)',
                                  padding: '2px 7px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(16, 185, 129, 0.3)',
                                }}
                              >
                                {t.availableTodayBadge}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Chamber Location & Fee */}
                        <div
                          style={{
                            backgroundColor: 'var(--slate-50)',
                            borderRadius: '12px',
                            padding: '12px 14px',
                            fontSize: '12.5px',
                            color: 'var(--slate-700)',
                            marginBottom: '18px',
                            border: '1px solid var(--slate-200)',
                          }}
                        >
                          <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>
                            {assoc.organizationName}
                          </div>
                          <div style={{ color: 'var(--slate-500)', marginTop: '2px', fontSize: '12px' }}>
                            {assoc.branchName}, {assoc.chamberRoomNumber}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--slate-200)' }}>
                            <span style={{ fontSize: '12px', color: 'var(--slate-600)' }}>{t.slotConsultationFee}:</span>
                            <strong style={{ color: '#047857', fontSize: '15px' }}>
                              {BRAND_CONSTANTS.CURRENCY_SYMBOL}{assoc.consultationFee}
                            </strong>
                          </div>
                        </div>

                        {/* Real-Time Interactive Slots with 5-Min Hold */}
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={14} color="#0891B2" />
                            <span>{t.slotSelectPrompt}</span>
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {slots.slice(0, 8).map((slot) => {
                              const isBooked = slot.status === 'CONFIRMED';
                              const isHeld = slot.status === 'HELD';
                              return (
                                <button
                                  key={slot.id}
                                  disabled={isBooked}
                                  onClick={() => handleSelectSlot(slot, assoc)}
                                  style={{
                                    padding: '7px 12px',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    border: isHeld
                                      ? '1px solid #F59E0B'
                                      : isBooked
                                      ? '1px solid var(--slate-200)'
                                      : '1px solid #0891B2',
                                    backgroundColor: isHeld
                                      ? 'var(--amber-50)'
                                      : isBooked
                                      ? 'var(--slate-100)'
                                      : '#FFFFFF',
                                    color: isHeld
                                      ? '#B45309'
                                      : isBooked
                                      ? 'var(--slate-400)'
                                      : 'var(--navy-900)',
                                    textDecoration: isBooked ? 'line-through' : 'none',
                                    cursor: isBooked ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.15s ease',
                                  }}
                                >
                                  {slot.startTime} {isHeld ? `(${t.slotHeld})` : ''}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* DIAGNOSTIC TESTS & PATHOLOGY SECTION */}
            <section id="diagnostic-tests-section" style={{ backgroundColor: 'var(--slate-100)', padding: '64px 0', borderTop: '1px solid var(--slate-200)', borderBottom: '1px solid var(--slate-200)' }}>
              <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#0891B2', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                      CLINICAL PATHOLOGY & IMAGING
                    </div>
                    <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--navy-900)' }}>
                      {t.sectionDiagnosticsTitle}
                    </h2>
                    <p style={{ color: 'var(--slate-500)', fontSize: '14px', marginTop: '3px' }}>
                      {t.sectionDiagnosticsSubtitle}
                    </p>
                  </div>
                </div>

                <div className="grid-cards">
                  {filteredTests.map((test) => (
                    <div
                      key={test.id}
                      className="futuristic-card"
                      style={{
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <span style={{ backgroundColor: 'var(--cyan-50)', color: '#0891B2', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                            {test.category}
                          </span>
                          {test.homeCollectionAvailable && (
                            <span style={{ backgroundColor: 'var(--emerald-50)', color: '#065F46', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                              ✓ Home Collection
                            </span>
                          )}
                        </div>

                        <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '4px' }}>
                          {test.name}
                        </h3>
                        <div style={{ fontSize: '12.5px', color: 'var(--slate-500)', marginBottom: '14px' }}>
                          {test.organizationName}
                        </div>

                        {/* Test preparation guidelines */}
                        <div style={{ backgroundColor: 'var(--slate-50)', padding: '12px 14px', borderRadius: '10px', fontSize: '12.5px', color: 'var(--slate-700)', marginBottom: '18px', border: '1px solid var(--slate-200)' }}>
                          <div style={{ fontWeight: 700, color: 'var(--navy-900)', marginBottom: '3px' }}>
                            {t.testPreparation}:
                          </div>
                          <div>{test.preparationInstructions}</div>
                          <div style={{ marginTop: '8px', fontSize: '11.5px', color: 'var(--slate-500)', display: 'flex', gap: '12px' }}>
                            <span>Sample: <strong>{test.sampleType}</strong></span>
                            <span>Turnaround: <strong>{test.expectedDeliveryHours} hrs</strong></span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--slate-100)' }}>
                        <div>
                          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--navy-900)' }}>
                            ৳{test.discountPrice || test.price}
                          </div>
                          {test.discountPrice && (
                            <div style={{ fontSize: '11.5px', color: 'var(--slate-400)', textDecoration: 'line-through' }}>
                              ৳{test.price}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedBookingTest(test)}
                          className="btn-primary"
                          style={{
                            padding: '9px 18px',
                            fontSize: '12.5px',
                            borderRadius: '8px',
                          }}
                        >
                          {t.bookTestButton}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 4-STEP DOORSTEP HOME SAMPLE COLLECTION */}
            <div className="container">
              <HomeSampleCollectionSection
                language={language}
                onRequestHomeCare={() => setIsHomeCareModalOpen(true)}
              />
            </div>

            {/* PARTNER DIAGNOSTIC CENTERS SECTION */}
            <section id="diagnostic-centers-section" className="container" style={{ padding: '56px 24px 20px 24px' }}>
              <div style={{ marginBottom: '28px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#0891B2', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  CERTIFIED INSTITUTIONS
                </div>
                <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--navy-900)' }}>
                  {t.sectionCentersTitle}
                </h2>
                <p style={{ color: 'var(--slate-500)', fontSize: '14px', marginTop: '3px' }}>
                  {t.sectionCentersSubtitle}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px' }}>
                {appState.organizations.map((org) => (
                  <div
                    key={org.id}
                    className="futuristic-card"
                    style={{
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '12px',
                            background: 'var(--cyan-50)',
                            color: '#0891B2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Building2 size={24} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--navy-900)' }}>
                            {org.name}
                          </h3>
                          <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={12} />
                            <span>ACCREDITED DIAGNOSTIC LAB & CLINIC</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: '13px', color: 'var(--slate-600)', marginBottom: '14px', lineHeight: 1.5 }}>
                        Branches: <strong>{org.branches.map((b) => b.name).join(', ')}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--slate-500)', paddingTop: '14px', borderTop: '1px solid var(--slate-100)' }}>
                      <span>Trade Lic: {org.tradeLicenseNumber}</span>
                      <a
                        href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
                        style={{ color: '#0891B2', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Phone size={13} />
                        <span>Helpline: {BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* HOSPITALS & CLINICS SECTION */}
            <section id="hospitals-section" className="container" style={{ padding: '56px 24px 20px 24px' }}>
              <div style={{ marginBottom: '28px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#0057FF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  TERTIARY HOSPITALS & INPATIENT FACILITIES
                </div>
                <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A' }}>
                  {language === 'en' ? 'Hospitals & Specialized Clinics' : 'হাসপাতাল ও বিশেষায়িত ক্লিনিক'}
                </h2>
                <p style={{ color: '#64748B', fontSize: '14px', marginTop: '3px' }}>
                  {language === 'en' ? 'Verified tertiary healthcare facilities with ICU, 24/7 trauma emergency, and specialist admissions.' : 'আইসিইউ, ২৪/৭ জরুরি সেবা এবং বিশেষজ্ঞ ডাক্তার সমন্বিত ভেরিফাইড হাসপাতাল।'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px' }}>
                {servicesEngine.getOrganizations('HOSPITAL').map((hosp) => {
                  const details = servicesEngine.getHospitalDetails(hosp.id);
                  return (
                    <div
                      key={hosp.id}
                      className="futuristic-card"
                      style={{
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                          <div
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: '12px',
                              background: '#EFF6FF',
                              color: '#0057FF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <HeartPulse size={24} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                              {hosp.name}
                            </h3>
                            <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={12} />
                              <span>24/7 EMERGENCY & ADMISSION OPEN</span>
                            </div>
                          </div>
                        </div>

                        {details && (
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                            <span style={{ backgroundColor: '#EFF6FF', color: '#0057FF', padding: '3px 8px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 700 }}>
                              Total Beds: {details.totalBeds}
                            </span>
                            <span style={{ backgroundColor: '#FEF2F2', color: '#B91C1C', padding: '3px 8px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 700 }}>
                              ICU Beds: {details.icuBeds}
                            </span>
                            <span style={{ backgroundColor: '#ECFDF5', color: '#065F46', padding: '3px 8px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 700 }}>
                              Specialists: {details.specialistCount}+
                            </span>
                          </div>
                        )}

                        {details?.featuredDepartments && (
                          <div style={{ fontSize: '12px', color: '#475569', marginBottom: '14px' }}>
                            Departments: <strong>{details.featuredDepartments.join(', ')}</strong>
                          </div>
                        )}

                        <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: '12px' }}>
                          Location: <strong>{hosp.branches[0]?.addressLine}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', paddingTop: '14px', borderTop: '1px solid #F1F5F9' }}>
                        <a
                          href={`tel:${hosp.contactPhone}`}
                          style={{ color: '#0057FF', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Phone size={13} />
                          <span>Admission Hotline: {hosp.contactPhone}</span>
                        </a>

                        <button
                          onClick={() => {
                            const el = document.getElementById('doctor-discovery-section');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          style={{ backgroundColor: '#0057FF', color: '#FFFFFF', padding: '7px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                        >
                          View Doctors
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* PHARMACIES & GENUINE MEDICINE SECTION */}
            <section id="pharmacies-section" className="container" style={{ padding: '56px 24px 20px 24px' }}>
              <div style={{ marginBottom: '28px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  LICENSED RETAIL PHARMACIES
                </div>
                <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A' }}>
                  {language === 'en' ? 'Verified Pharmacies & Genuine Medicines' : 'ভেরিফাইড ফার্মেসি ও জেনুইন ঔষধ'}
                </h2>
                <p style={{ color: '#64748B', fontSize: '14px', marginTop: '3px' }}>
                  {language === 'en' ? 'Order authentic prescription drugs with DGDA verification and fast 2-4 hour doorstep delivery.' : '১০০% জেনুইন ঔষধ প্রেসক্রিপশন আপলোড করে ২-৪ ঘণ্টার মধ্যে ঘরে বসেই সংগ্রহ করুন।'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px' }}>
                {servicesEngine.getOrganizations('PHARMACY').map((pharma) => (
                  <div
                    key={pharma.id}
                    className="futuristic-card"
                    style={{
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '12px',
                            background: '#ECFDF5',
                            color: '#059669',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Pill size={24} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                            {pharma.name}
                          </h3>
                          <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={12} />
                            <span>100% GENUINE • DGDA LICENSED</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: '12.5px', color: '#475569', marginBottom: '10px' }}>
                        Hub Address: <strong>{pharma.branches[0]?.addressLine}</strong>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '14px' }}>
                        Delivery Time: <strong>2 - 4 Hours (Express Delivery)</strong> • Drug Lic: {pharma.tradeLicenseNumber}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #F1F5F9' }}>
                      <a
                        href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
                        style={{ color: '#059669', fontWeight: 700, fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Phone size={13} />
                        <span>Order Hotline: {BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}</span>
                      </a>

                      <button
                        onClick={() => setIsPrescriptionModalOpen(true)}
                        style={{ backgroundColor: '#059669', color: '#FFFFFF', padding: '7px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                      >
                        Upload Prescription
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* INTERACTIVE GEOGRAPHIC COVERAGE & FACILITY MAP */}
            <div className="container">
              <MapDiscovery
                language={language}
                onSelectFacility={() => setIsHelplineOpen(true)}
              />
            </div>
            </div>
          </div>
        )}
      </main>

      {/* 5-MINUTE TEMPORARY HOLD SLOT BOOKING MODAL */}
      {selectedSlot && selectedAssociation && (
        <SlotBookingModal
          slot={selectedSlot}
          association={selectedAssociation}
          language={language}
          onClose={() => {
            setSelectedSlot(null);
            setSelectedAssociation(null);
          }}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* PATIENT AUTH MODAL (LOGIN / REGISTER / FORGOT) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setIsAuthModalOpen(false);
          AuthService.getCurrentUser().then((profile) => {
            if (profile) {
              setCurrentUser(profile);
              setCurrentRole(profile.primaryRole);
              AppointmentService.getPatientAppointments(profile.id).then((apts) => {
                if (apts.length > 0) {
                  setAppState((prev) => ({ ...prev, appointments: apts }));
                }
              });
            }
          });
        }}
      />

      {/* B2B PROVIDER ONBOARDING WIZARD */}
      <ProviderOnboardingModal
        isOpen={isProviderOnboardOpen}
        onClose={() => setIsProviderOnboardOpen(false)}
        onSuccess={(org) => {
          setIsProviderOnboardOpen(false);
          setOnboardingNotice(
            language === 'en'
              ? `Verification initiated for ${org.name}. Our regional operational team will verify the BMDC/DGHS credentials within 24 hours. Support Helpline: 01886-748564.`
              : `${org.name}-এর ভেরিফিকেশন কার্যক্রম শুরু হয়েছে। আমাদের টিম ২৪ ঘণ্টার মধ্যে যোগাযোগ করবে। সার্বক্ষণিক হেল্পলাইন: 01886-748564।`
          );
        }}
      />

      {/* DIAGNOSTIC TEST BOOKING MODAL */}
      <TestBookingModal
        test={selectedBookingTest}
        isOpen={Boolean(selectedBookingTest)}
        onClose={() => setSelectedBookingTest(null)}
        onBookingSuccess={() => {}}
      />

      {/* DIGITAL PRESCRIPTION SLIP MODAL */}
      <PrescriptionSlipModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
      />

      {/* BANGLADESH PAYMENT MODAL (BKASH / NAGAD / CASH) */}
      {activePaymentPayload && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setActivePaymentPayload(null);
          }}
          bookingCode={activePaymentPayload.bookingCode}
          amount={activePaymentPayload.amount}
          doctorOrTestName={activePaymentPayload.name}
          organizationName={activePaymentPayload.org}
          onPaymentSuccess={() => {}}
        />
      )}

      {/* VERIFIED PATIENT REVIEWS MODAL */}
      <VerifiedReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
        doctorOrCenterName={language === 'en' ? 'Dr. Anisur Rahman' : 'ডাঃ আনিসুর রহমান'}
      />

      {/* OPERATIONAL HELPLINE DISPATCHER MODAL */}
      {isHelplineOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(5, 12, 22, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div style={{ maxWidth: '880px', width: '100%', position: 'relative' }}>
            <button
              onClick={() => setIsHelplineOpen(false)}
              style={{
                position: 'absolute',
                top: '-14px',
                right: '-14px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--navy-900)',
                color: '#FFFFFF',
                border: '2px solid #FFFFFF',
                fontSize: '16px',
                fontWeight: 800,
                cursor: 'pointer',
                zIndex: 10,
              }}
            >
              ✕
            </button>
            <HelplineBookingConsole />
          </div>
        </div>
      )}

      {/* EMERGENCY AMBULANCE DISPATCHER MODAL */}
      <AmbulanceDispatcher
        isOpen={isAmbulanceModalOpen}
        onClose={() => setIsAmbulanceModalOpen(false)}
      />

      {/* HOME HEALTHCARE REQUEST MODAL */}
      <HomeCareBookingModal
        isOpen={isHomeCareModalOpen}
        onClose={() => setIsHomeCareModalOpen(false)}
      />

      {/* CUSTOMER SUPPORT & GRIEVANCE MODAL */}
      <SupportTicketModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      {/* LOCATION SELECTION BOTTOM SHEET */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocation={selectedLocation}
        onSelectLocation={(loc) => setSelectedLocation(loc)}
        language={language}
      />

      {/* HEALTHCARE NOTIFICATIONS PREFERENCES MODAL */}
      <NotificationSettingsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        language={language}
      />

      {/* MOBILE BOTTOM NAVIGATION DOCK */}
      <MobileNavigation
        language={language}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* REDESIGNED FOOTER */}
      <Footer language={language} setLanguage={handleLanguageChange} />
    </div>
  );
}
