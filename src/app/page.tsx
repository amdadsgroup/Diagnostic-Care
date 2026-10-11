'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BRAND_CONSTANTS, SupportedLanguage } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import { UserRole, ScheduleSlot, DoctorAssociation, Appointment } from '@/types';
import { INITIAL_APP_STATE } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SlotBookingModal } from '@/components/SlotBookingModal';
import { LiveQueueCard } from '@/components/LiveQueueCard';
import { DoctorAssistantView } from '@/components/DoctorAssistantView';
import { SuperAdminView } from '@/components/SuperAdminView';
import AuthModal from '@/components/auth/AuthModal';
import ProviderOnboardingModal from '@/components/provider/ProviderOnboardingModal';
import DoctorPortal from '@/components/doctor/DoctorPortal';
import PatientDashboard from '@/components/patient/PatientDashboard';
import LiveQueueTracker from '@/components/queue/LiveQueueTracker';
import PrescriptionSlipModal from '@/components/prescription/PrescriptionSlipModal';
import PaymentModal from '@/components/payment/PaymentModal';
import LedgerViewer from '@/components/finance/LedgerViewer';
import AdvancedSearchFilter from '@/components/search/AdvancedSearchFilter';
import VerifiedReviewsModal from '@/components/reviews/VerifiedReviewsModal';
import ProviderAnalyticsDashboard from '@/components/analytics/ProviderAnalyticsDashboard';
import HelplineBookingConsole from '@/components/support/HelplineBookingConsole';
import CategoryNavigator, { HealthcareCategoryKey } from '@/components/marketplace/CategoryNavigator';
import SupportTicketModal from '@/components/support/SupportTicketModal';
import ComprehensiveAdminConsole from '@/components/admin/ComprehensiveAdminConsole';
import HeroSection from '@/components/marketplace/HeroSection';
import TrustSection from '@/components/marketplace/TrustSection';
import MapDiscovery from '@/components/marketplace/MapDiscovery';
import MobileNavigation, { ActiveNavTab } from '@/components/navigation/MobileNavigation';
import MobileAppointmentsView from '@/components/patient/MobileAppointmentsView';
import MobileHealthVaultView from '@/components/patient/MobileHealthVaultView';
import MobileProfileView from '@/components/patient/MobileProfileView';
import MobileMessagesView from '@/components/patient/MobileMessagesView';
import MobileSearchView from '@/components/search/MobileSearchView';
import LocationModal from '@/components/location/LocationModal';
import NotificationSettingsModal from '@/components/notifications/NotificationSettingsModal';
import DiagnosticCartModal from '@/components/marketplace/DiagnosticCartModal';
import PilotFeedbackModal from '@/components/common/PilotFeedbackModal';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import { DoctorService } from '@/services/doctor.service';
import { AppointmentService } from '@/services/appointment.service';

import {
  Search,
  MapPin,
  CheckCircle2,
  Calendar,
  Clock,
  Award,
  Stethoscope,
  Building2,
  ShieldCheck,
  FileText,
  Download,
  Phone,
  Sparkles,
  HeartPulse,
  User,
  UserCheck,
  AlertCircle,
  Lock,
  ArrowRight,
  Printer,
  ChevronRight,
  Activity,
  Layers,
} from 'lucide-react';

function UrlSyncHandler({
  onTabChange,
  onCategoryChange,
}: {
  onTabChange: (tab: ActiveNavTab) => void;
  onCategoryChange: (cat: HealthcareCategoryKey) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;
    const action = searchParams.get('action');
    const tab = searchParams.get('tab');
    const category = searchParams.get('category');

    if (category) {
      onCategoryChange(category as HealthcareCategoryKey);
    }

    if (action === 'find-doctor') {
      onTabChange('search');
    } else if (action === 'appointments') {
      onTabChange('appointments');
    } else if (action === 'queue') {
      onTabChange('queue');
    } else if (action === 'prescriptions') {
      onTabChange('prescriptions');
    } else if (action === 'messages') {
      onTabChange('messages');
    } else if (
      tab &&
      [
        'marketplace',
        'search',
        'appointments',
        'queue',
        'reports',
        'prescriptions',
        'portal',
        'profile',
        'messages',
      ].includes(tab)
    ) {
      onTabChange(tab as ActiveNavTab);
    }
  }, [searchParams, onTabChange, onCategoryChange]);

  return null;
}

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
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isProviderOnboardOpen, setIsProviderOnboardOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activePaymentPayload, setActivePaymentPayload] = useState<{ bookingCode: string; amount: number; name: string; org: string } | null>(null);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isHelplineOpen, setIsHelplineOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<HealthcareCategoryKey>('ALL');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isDiagnosticCartOpen, setIsDiagnosticCartOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

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

      // Load doctors & chamber associations from Supabase
      DoctorService.getDoctors().then((docs) => {
        if (docs.length > 0) {
          setAppState((prev) => ({
            ...prev,
            doctors: docs,
          }));
        }
      }).catch((err) => {
        console.warn('Initial doctor data load notice:', err);
      });

      DoctorService.getDoctorAssociations().then((assocs) => {
        if (assocs.length > 0) {
          setAppState((prev) => ({
            ...prev,
            doctorAssociations: assocs,
          }));
        }
      }).catch((err) => {
        console.warn('Initial doctor associations load notice:', err);
      });

      // Detect PWA App Shortcuts in URL
      const params = new URLSearchParams(window.location.search);
      const action = params.get('action');
      const tab = params.get('tab');
      const category = params.get('category');

      if (category) {
        setActiveCategory(category as HealthcareCategoryKey);
        setSelectedSpecialty(category);
      }

      if (action === 'find-doctor') {
        setActiveTab('search');
      } else if (action === 'appointments') {
        setActiveTab('appointments');
      } else if (action === 'queue') {
        setActiveTab('queue');
      } else if (action === 'prescriptions') {
        setActiveTab('prescriptions');
      } else if (action === 'messages') {
        setActiveTab('messages');
      } else if (tab && ['marketplace', 'search', 'appointments', 'queue', 'reports', 'prescriptions', 'portal', 'profile', 'messages'].includes(tab)) {
        setActiveTab(tab as ActiveNavTab);
      }
    }
  }, []);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dc_lang', lang);
      document.documentElement.lang = lang;
    }
    if (currentUser) {
      AuthService.updateLanguagePreference(currentUser.id, lang);
    }
  };

  const handleLogout = async () => {
    await AuthService.signOut();
    setCurrentUser(null);
    setCurrentRole('PATIENT');
    setActiveTab('marketplace');
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

  // Category navigation handler across Header & CategoryNavigator
  const handleCategorySelection = (category: string) => {
    setActiveCategory(category as HealthcareCategoryKey);
    setSelectedSpecialty(category);
    const el = document.getElementById('doctor-discovery-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Advanced search result click handler
  const handleSearchSelectResult = (item: any) => {
    const assoc =
      appState.doctorAssociations.find((a) => a.doctorId === item.id || a.doctor?.fullName.includes(item.name)) ||
      appState.doctorAssociations[0];
    if (!assoc) {
      window.location.href = '/doctors';
      return;
    }
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
  };

  const handleTabNavigation = (tab: ActiveNavTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const targetUrl = tab === 'marketplace' ? '/' : `/?tab=${tab}`;
      window.history.pushState(null, '', targetUrl);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--canvas-bg)' }}>
      {/* Reactive URL Sync for direct parameter navigation (?tab=appointments, etc.) */}
      <Suspense fallback={null}>
        <UrlSyncHandler
          onTabChange={(t) => setActiveTab(t)}
          onCategoryChange={(cat) => {
            setActiveCategory(cat);
            setSelectedSpecialty(cat);
          }}
        />
      </Suspense>

      {/* Redesigned Futuristic Two-Tier Header */}
      <Header
        language={language}
        setLanguage={handleLanguageChange}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={handleTabNavigation}
        onOpenAuth={(mode = 'login') => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
        onOpenOnboard={() => setIsProviderOnboardOpen(true)}
        selectedLocation={selectedLocation}
        onOpenLocation={() => setIsLocationModalOpen(true)}
        onSelectCategory={handleCategorySelection}
        currentUser={currentUser}
        onLogout={handleLogout}
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

        {/* SEARCH VIEW (DOCTOR SEARCH) */}
        {activeTab === 'search' && (
          <div className="container" style={{ padding: '24px 16px', maxWidth: '1080px' }}>
            <MobileSearchView
              language={language}
              doctorAssociations={appState.doctorAssociations}
              selectedLocation={selectedLocation}
              onSelectSlot={handleSelectSlot}
              onNavigateHome={() => setActiveTab('marketplace')}
            />
          </div>
        )}

        {/* APPOINTMENTS VIEW (APPOINTMENTS CENTER) */}
        {activeTab === 'appointments' && (
          <div className="container" style={{ padding: '24px 16px', maxWidth: '1080px' }}>
            <MobileAppointmentsView
              appointments={appState.appointments}
              language={language}
              onNavigateTab={(tab) => handleTabNavigation(tab)}
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

        {/* MESSAGES & SUPPORT CENTER TAB */}
        {activeTab === 'messages' && (
          <div className="container" style={{ padding: '24px 16px', maxWidth: '1080px' }}>
            <MobileMessagesView
              language={language}
              currentUser={currentUser}
              onNavigateTab={(tab) => handleTabNavigation(tab)}
              onOpenSupportTicket={() => setIsSupportModalOpen(true)}
              onOpenNotifications={() => setIsNotificationsModalOpen(true)}
            />
          </div>
        )}

        {/* PROFILE & SETTINGS VIEW */}
        {activeTab === 'profile' && (
          <div className="container" style={{ padding: '24px 16px', maxWidth: '1080px' }}>
            <MobileProfileView
              language={language}
              onLanguageChange={handleLanguageChange}
              selectedLocation={selectedLocation}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
              onOpenNotificationsModal={() => setIsNotificationsModalOpen(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenAuthModal={(mode = 'login') => {
                setAuthModalMode(mode);
                setIsAuthModalOpen(true);
              }}
              onLogout={handleLogout}
              currentUser={currentUser}
              appointmentsCount={appState.appointments.length}
            />
          </div>
        )}

        {/* ROLE BASED VIEWS (PROVIDER & PATIENT PORTAL) */}
        {activeTab === 'portal' && currentRole === 'DOCTOR' && (
          <div className="container" style={{ padding: '36px 20px' }}>
            {appState.doctors.length > 0 ? (
              <DoctorPortal
                doctorName={appState.doctors[0]?.fullName || ''}
                specialization={appState.doctors[0]?.specialization || ''}
                chamberName={appState.organizations[0]?.name ? `${appState.organizations[0].name} (${appState.organizations[0].branches[0]?.name || ''})` : ''}
                doctorId={appState.doctors[0]?.id}
              />
            ) : (
              <div className="glass-card" style={{ padding: '40px', textAlign: 'center', maxWidth: '520px', margin: '40px auto' }}>
                <User size={48} color="var(--brand-primary)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#090D14', marginBottom: '8px' }}>
                  {language === 'en' ? 'Doctor Portal Ready' : 'ডাক্তার পোর্টাল প্রস্তুত'}
                </h3>
                <p style={{ color: '#627680', fontSize: '14px', marginBottom: '20px' }}>
                  {language === 'en'
                    ? 'No doctor profile is linked yet. Sign in or register to configure your chambers and consultation slots.'
                    : 'এখনো কোনো ডাক্তার প্রোফাইল যুক্ত করা হয়নি। চেম্বার ও স্লট পরিচালনা করতে লগইন করুন।'}
                </p>
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="btn-primary"
                  style={{ padding: '10px 22px' }}
                >
                  {language === 'en' ? 'Sign In as Doctor' : 'ডাক্তার লগইন'}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'portal' && currentRole === 'PATIENT' && (
          <div className="container" style={{ padding: '36px 20px' }}>
            <PatientDashboard
              patientName={currentUser?.fullName || (language === 'en' ? 'Patient' : 'সম্মানিত রোগী')}
              phone={currentUser?.phone || '01886748564'}
              patientId={currentUser?.id}
            />
          </div>
        )}

        {activeTab === 'portal' && currentRole === 'DOCTOR_ASSISTANT' && (
          <div className="container" style={{ padding: '36px 20px' }}>
            {appState.assistants.length > 0 && appState.doctors.length > 0 ? (
              <DoctorAssistantView
                assistant={appState.assistants[0]}
                doctorName={appState.doctors[0]?.fullName || ''}
                specialization={appState.doctors[0]?.specialization || ''}
                organizationName={appState.organizations[0]?.name || ''}
                branchName={appState.organizations[0]?.branches[0]?.name || ''}
                appointments={appState.appointments}
                queue={activeQueue}
                language={language}
                onCallNext={handleCallNext}
                onUpdateStatus={handleUpdateAppointmentStatus}
              />
            ) : (
              <div className="glass-card" style={{ padding: '40px', textAlign: 'center', maxWidth: '520px', margin: '40px auto' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#090D14', marginBottom: '8px' }}>
                  {language === 'en' ? 'Assistant Console Ready' : 'সহকারী কনসোল প্রস্তুত'}
                </h3>
                <p style={{ color: '#627680', fontSize: '14px' }}>
                  {language === 'en' ? 'No chamber assistant linked yet.' : 'কোনো সহকারী প্রোফাইল এখনো যুক্ত করা হয়নি।'}
                </p>
              </div>
            )}
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
                  {language === 'en'
                    ? 'Real-time doctor chamber serial tracking'
                    : 'রিয়েল-টাইম ডাক্তার চেম্বার সিরিয়াল ট্র্যাকিং'}
                </p>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', padding: '6px 14px', borderRadius: '20px', color: '#065F46', fontWeight: 700, fontSize: '12px' }}>
                <span className="beacon-dot green" />
                <span>Live Chamber Engine Synced</span>
              </div>
            </div>
            {appState.doctors.length > 0 && appState.organizations.length > 0 ? (
              <LiveQueueTracker
                doctorName={appState.doctors[0]?.fullName || ''}
                specialization={appState.doctors[0]?.specialization || ''}
                chamberName={`${appState.organizations[0].name} (${appState.organizations[0].branches[0]?.name || ''})`}
              />
            ) : (
              <div className="glass-card" style={{ padding: '48px', textAlign: 'center', margin: '20px 0' }}>
                <Clock size={44} color="var(--brand-primary)" style={{ margin: '0 auto 16px', opacity: 0.8 }} />
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#090D14', marginBottom: '8px' }}>
                  {language === 'en' ? 'No Active Chamber Queue at this Moment' : 'বর্তমানে কোনো সক্রিয় চেম্বার কিউ নেই'}
                </h3>
                <p style={{ color: '#627680', fontSize: '14px', maxWidth: '500px', margin: '0 auto 24px' }}>
                  {language === 'en'
                    ? 'Chamber serial queues go live when specialist doctors open consultations. Check back during scheduled chamber hours.'
                    : 'ডাক্তার চেম্বারে রোগী দেখা শুরু করলে লাইভ সিরিয়াল কিউ এখানে সরাসরি প্রদর্শিত হবে।'}
                </p>
                <Link href="/doctors" className="btn-primary" style={{ padding: '10px 24px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span>{language === 'en' ? 'Browse Doctor Directory' : 'ডাক্তার তালিকা দেখুন'}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* SECURE HEALTH VAULT: REPORTS & PRESCRIPTIONS TAB */}
        {activeTab === 'reports' && (
          <div className="container" style={{ padding: '24px 16px', maxWidth: '1060px' }}>
            <MobileHealthVaultView language={language} />
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
                  <h3 style={{ fontSize: '20px', fontWeight: 800 }}>{language === 'en' ? 'Verified Specialist Physician' : 'নিবন্ধিত বিশেষজ্ঞ চিকিৎসক'}</h3>
                  <div style={{ fontSize: '13px', color: '#38BDF8', fontWeight: 600 }}>
                    {language === 'en' ? 'MBBS, FCPS / MD Registered Medical Practitioner' : 'এমবিবিএস, এফসিপিএস / এমডি নিবন্ধিত চিকিৎসক'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--slate-300)', marginTop: '2px' }}>
                    BMDC Reg: <strong>Verified</strong> • Clinical Consultation Chamber
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--slate-300)' }}>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '14px' }}>
                    {BRAND_CONSTANTS.BRAND_NAME}
                  </div>
                  <div>{BRAND_CONSTANTS.INITIAL_LAUNCH_LOCATION} Hub • Bangladesh</div>
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
                <div>Patient: <strong>{currentUser?.fullName || (language === 'en' ? 'Verified Patient' : 'সম্মানিত রোগী')}</strong> {currentUser?.phone ? `(${currentUser.phone})` : ''}</div>
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

        {/* PRIMARY MARKETPLACE TAB (Fully Synchronized Across Mobile & Desktop) */}
        {activeTab === 'marketplace' && (
          <div>
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

            {/* DOCTOR SPECIALTIES NAVIGATOR */}
            <section className="container" style={{ padding: '36px 24px 0 24px' }}>
              <CategoryNavigator
                language={language}
                activeCategory={activeCategory}
                onSelectCategory={(cat) => handleCategorySelection(cat)}
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

                {/* Actions & Filter tags */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
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
                  <button
                    onClick={() => setIsDiagnosticCartOpen(true)}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 700,
                      backgroundColor: 'var(--brand-teal-600)',
                      color: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>🧪 {language === 'en' ? 'Book Lab Tests' : 'ল্যাব টেস্ট বুক করুন'}</span>
                  </button>
                  <button
                    onClick={() => setIsFeedbackModalOpen(true)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      backgroundColor: 'var(--slate-100)',
                      color: 'var(--slate-700)',
                      border: '1px solid var(--slate-300)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>🐞 {language === 'en' ? 'Feedback / QA' : 'মতামত / ত্রুটি'}</span>
                  </button>
                  <Link
                    href="/doctors"
                    style={{
                      padding: '7px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 700,
                      backgroundColor: 'var(--brand-primary)',
                      color: '#FFFFFF',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>{language === 'en' ? 'All Doctors' : 'সব ডাক্তার'}</span>
                    <ArrowRight size={13} />
                  </Link>
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

            {/* INTERACTIVE GEOGRAPHIC COVERAGE & FACILITY MAP */}
            <div className="container">
              <MapDiscovery
                language={language}
                onSelectFacility={() => setIsHelplineOpen(true)}
              />
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
          currentUser={currentUser}
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
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(profile) => {
          setIsAuthModalOpen(false);
          setCurrentUser(profile);
          setCurrentRole(profile.primaryRole);
          if (profile.languagePreference) {
            handleLanguageChange(profile.languagePreference);
          }
          AppointmentService.getPatientAppointments(profile.id).then((apts) => {
            if (apts.length > 0) {
              setAppState((prev) => ({ ...prev, appointments: apts }));
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

      {/* VERIFIED DOCTOR REVIEWS MODAL */}
      <VerifiedReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
        doctorOrCenterName={language === 'en' ? 'Diagnostic Care Healthcare Network' : 'ডায়াগনস্টিক কেয়ার নেটওয়ার্ক'}
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

      {/* DIAGNOSTIC TEST CATALOG & HOME COLLECTION CART MODAL */}
      <DiagnosticCartModal
        isOpen={isDiagnosticCartOpen}
        onClose={() => setIsDiagnosticCartOpen(false)}
        language={language}
        onProceedToPayment={(order) => {
          setIsDiagnosticCartOpen(false);
          setActivePaymentPayload({
            bookingCode: `LAB-${Date.now().toString().slice(-6)}`,
            amount: order.totalAmount,
            name: `${order.tests.length} Diagnostic Tests (${order.collectionType === 'HOME_COLLECTION' ? 'Home Collection' : 'Lab Visit'})`,
            org: 'Popular Diagnostic Center (Moulvibazar)',
          });
          setIsPaymentModalOpen(true);
        }}
      />

      {/* OPERATIONAL LAUNCH QA & PILOT FEEDBACK MODAL */}
      <PilotFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        language={language}
      />

      {/* REDESIGNED FOOTER */}
      <Footer language={language} setLanguage={handleLanguageChange} />
    </div>
  );
}
