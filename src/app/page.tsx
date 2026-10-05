'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BRAND_CONSTANTS, SupportedLanguage } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import { UserRole, ScheduleSlot, DoctorAssociation, Appointment } from '@/types';
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
import { DiagnosticTest } from '@/types';
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
} from 'lucide-react';

export default function HomePage() {
  const [language, setLanguage] = useState<SupportedLanguage>('bn');
  const [currentRole, setCurrentRole] = useState<UserRole>('PATIENT');
  const [activeTab, setActiveTab] = useState<'marketplace' | 'queue' | 'reports' | 'prescriptions' | 'portal'>('marketplace');
  
  // App State
  const [appState, setAppState] = useState(INITIAL_APP_STATE);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Moulvibazar');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  
  // Modal State
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);
  const [selectedAssociation, setSelectedAssociation] = useState<DoctorAssociation | null>(null);
  const [confirmedBookingNotice, setConfirmedBookingNotice] = useState<Appointment | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProviderOnboardOpen, setIsProviderOnboardOpen] = useState(false);
  const [selectedBookingTest, setSelectedBookingTest] = useState<DiagnosticTest | null>(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activePaymentPayload, setActivePaymentPayload] = useState<{ bookingCode: string; amount: number; name: string; org: string } | null>(null);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isHelplineOpen, setIsHelplineOpen] = useState(false);

  const t = TRANSLATIONS[language];
  const todayKey = 'assoc-anisur-popular_' + new Date().toISOString().split('T')[0];
  const activeQueue = appState.queues[todayKey] || Object.values(appState.queues)[0];

  // Handle slot click -> initiate 5-min temporary hold
  const handleSelectSlot = (slot: ScheduleSlot, assoc: DoctorAssociation) => {
    if (slot.status === 'CONFIRMED' || slot.status === 'BLOCKED') return;

    // Set slot to HELD
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
      patientUserId: 'user-patient-current',
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

    // Update slots and queue
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
      test.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        language={language}
        setLanguage={setLanguage}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenOnboard={() => setIsProviderOnboardOpen(true)}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {/* Booking Confirmation Flash Alert */}
        {confirmedBookingNotice && (
          <div style={{ backgroundColor: 'var(--brand-emerald-50)', borderBottom: '2px solid #10B981', padding: '16px 0' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
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
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  💳 বিকাশ / নগদ এ পরিশোধ করুন
                </button>
                <button
                  onClick={() => setActiveTab('queue')}
                  style={{
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    borderRadius: '6px',
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

        {/* ROLE BASED VIEWS */}
        {activeTab === 'portal' && currentRole === 'DOCTOR' && (
          <div className="container" style={{ padding: '32px 20px' }}>
            <DoctorPortal
              doctorName={appState.doctors[0].fullName}
              specialization={appState.doctors[0].specialization}
              chamberName={`${appState.organizations[0].name} (${appState.organizations[0].branches[0].name})`}
            />
          </div>
        )}

        {activeTab === 'portal' && currentRole === 'PATIENT' && (
          <div className="container" style={{ padding: '32px 20px' }}>
            <PatientDashboard />
          </div>
        )}

        {activeTab === 'portal' && currentRole === 'DOCTOR_ASSISTANT' && (
          <div className="container" style={{ padding: '32px 20px' }}>
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
          <div className="container" style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
          <div className="container" style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <SuperAdminView
              organizations={appState.organizations}
              doctors={appState.doctors}
              language={language}
            />
            <HelplineBookingConsole />
            <ProviderAnalyticsDashboard />
            <LedgerViewer />
          </div>
        )}

        {/* LIVE QUEUE TAB (PHASE 3 ENHANCED) */}
        {activeTab === 'queue' && (
          <div className="container" style={{ padding: '32px 20px', maxWidth: '1000px' }}>
            <LiveQueueTracker
              doctorName={appState.doctors[0].fullName}
              specialization={appState.doctors[0].specialization}
              chamberName={`${appState.organizations[0].name} (${appState.organizations[0].branches[0].name})`}
            />
          </div>
        )}

        {/* SECURE HEALTH VAULT: REPORTS TAB (PHASE 4 ENHANCED) */}
        {activeTab === 'reports' && (
          <div className="container" style={{ padding: '32px 20px', maxWidth: '1000px' }}>
            <SecureReportViewer />
          </div>
        )}

        {/* SECURE HEALTH VAULT: PRESCRIPTIONS TAB */}
        {activeTab === 'prescriptions' && (
          <div className="container" style={{ padding: '32px 20px', maxWidth: '850px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                Digital Prescriptions
              </h2>
              <p style={{ color: 'var(--slate-600)', fontSize: '14px', marginTop: '4px' }}>
                Consultation prescriptions written by registered physicians with BMDC credentials.
              </p>
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
                  backgroundColor: 'var(--brand-navy-900)',
                  color: '#FFFFFF',
                  padding: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
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
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy-900)', marginBottom: '8px' }}>
                    Clinical Diagnosis
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--slate-700)', lineHeight: 1.5, marginBottom: '16px' }}>
                    Essential Hypertension (Stage 1), Mild Hypercholesterolemia.
                  </p>

                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy-900)', marginBottom: '8px' }}>
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
                  <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--brand-teal-600)', marginBottom: '12px' }}>
                    ℞ Medications
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                    <div style={{ borderBottom: '1px solid var(--slate-100)', paddingBottom: '10px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--brand-navy-900)' }}>
                        1. Tab. Bisoprolol Fumarate 2.5mg (Cardibis)
                      </div>
                      <div style={{ color: 'var(--brand-teal-600)', fontWeight: 600, marginTop: '2px' }}>
                        1 + 0 + 0 (Morning After Breakfast) • 30 Days
                      </div>
                    </div>

                    <div style={{ borderBottom: '1px solid var(--slate-100)', paddingBottom: '10px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--brand-navy-900)' }}>
                        2. Tab. Rosuvastatin 10mg (Rovista)
                      </div>
                      <div style={{ color: 'var(--brand-teal-600)', fontWeight: 600, marginTop: '2px' }}>
                        0 + 0 + 1 (Night at Bedtime) • 30 Days
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', padding: '12px', backgroundColor: 'var(--brand-teal-50)', borderRadius: '8px', fontSize: '12px', color: '#0E7490' }}>
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
                  Certified Digital Prescription generated on <strong>Diagnostic Care</strong> platform.
                </div>
                <button
                  onClick={() => setIsPrescriptionModalOpen(true)}
                  style={{
                    backgroundColor: 'var(--brand-navy-700)',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    borderRadius: '6px',
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
            {/* HERO SECTION */}
            <section
              style={{
                backgroundColor: 'var(--brand-navy-900)',
                color: '#FFFFFF',
                padding: '56px 0 64px 0',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '4px 14px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#38BDF8',
                      marginBottom: '20px',
                    }}
                  >
                    <Sparkles size={14} />
                    {BRAND_CONSTANTS.BRAND_NAME} • {t.tagline}
                  </div>

                  <h1
                    style={{
                      fontSize: '36px',
                      fontWeight: 900,
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                      marginBottom: '16px',
                    }}
                  >
                    {t.heroHeadline}
                  </h1>

                  <p
                    style={{
                      fontSize: '16px',
                      color: 'var(--slate-300)',
                      lineHeight: 1.6,
                      marginBottom: '32px',
                    }}
                  >
                    {t.heroSubheadline}
                  </p>

                  {/* Central Search Bar */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      padding: '8px',
                      boxShadow: 'var(--shadow-xl)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px', padding: '0 12px' }}>
                      <Search size={18} color="var(--slate-400)" />
                      <input
                        type="text"
                        id="marketplace-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t.searchPlaceholder}
                        style={{
                          width: '100%',
                          border: 'none',
                          outline: 'none',
                          fontSize: '14px',
                          color: 'var(--slate-900)',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderLeft: '1px solid var(--slate-200)', padding: '0 12px' }}>
                      <MapPin size={16} color="var(--brand-teal-600)" />
                      <select
                        id="district-filter-select"
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        style={{
                          border: 'none',
                          outline: 'none',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'var(--slate-700)',
                          background: 'transparent',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="Moulvibazar">Moulvibazar (মৌলভীবাজার)</option>
                        <option value="Sylhet">Sylhet (সিলেট)</option>
                        <option value="ALL">{t.filterAllDistricts}</option>
                      </select>
                    </div>

                    <button
                      id="hero-search-btn"
                      style={{
                        backgroundColor: 'var(--brand-navy-700)',
                        color: '#FFFFFF',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '14px',
                        boxShadow: '0 2px 8px rgba(19, 64, 116, 0.3)',
                      }}
                    >
                      {t.searchButton}
                    </button>
                  </div>

                  {/* Customer Care Callout in Hero */}
                  <div style={{ marginTop: '20px', fontSize: '13px', color: 'var(--slate-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span>Need immediate booking assistance? Call Helpline: <a href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`} style={{ color: '#38BDF8', fontWeight: 700, textDecoration: 'none' }}>{BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}</a></span>
                    <button
                      onClick={() => setIsHelplineOpen(true)}
                      style={{
                        backgroundColor: 'rgba(56, 189, 248, 0.15)',
                        color: '#38BDF8',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      📞 অপারেটর টেলি-বুকিং ডেস্ক
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ADVANCED MULTI-CRITERIA SEARCH & FILTER ENGINE (PHASE 6) */}
            <section className="container" style={{ padding: '36px 20px 0 20px' }}>
              <AdvancedSearchFilter />
            </section>

            {/* SPECIALIST DOCTORS SECTION */}
            <section className="container" style={{ padding: '48px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                    {t.sectionDoctorsTitle}
                  </h2>
                  <p style={{ color: 'var(--slate-600)', fontSize: '14px', marginTop: '4px' }}>
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
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: selectedSpecialty === spec ? 'var(--brand-navy-900)' : 'var(--slate-100)',
                        color: selectedSpecialty === spec ? '#FFFFFF' : 'var(--slate-700)',
                      }}
                    >
                      {spec === 'ALL' ? 'All Specialties' : spec}
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
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid var(--slate-200)',
                        padding: '20px',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        {/* Doctor Info */}
                        <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
                          <div
                            style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '12px',
                              backgroundColor: 'var(--brand-teal-50)',
                              color: 'var(--brand-teal-600)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '20px',
                              flexShrink: 0,
                            }}
                          >
                            <Stethoscope size={28} />
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                                {doctor.fullName}
                              </h3>
                              <CheckCircle2 size={16} color="#10B981" />
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--brand-teal-600)' }}>
                              {doctor.specialization}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--slate-500)', marginTop: '2px' }}>
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
                                ⭐ ৪.৯ (১২৮ ভেরিফায়েড রিভিউ)
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Chamber Location & Fee */}
                        <div
                          style={{
                            backgroundColor: 'var(--slate-50)',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            fontSize: '12px',
                            color: 'var(--slate-700)',
                            marginBottom: '16px',
                            border: '1px solid var(--slate-200)',
                          }}
                        >
                          <div style={{ fontWeight: 700, color: 'var(--brand-navy-900)' }}>
                            {assoc.organizationName}
                          </div>
                          <div style={{ color: 'var(--slate-500)', marginTop: '2px' }}>
                            {assoc.branchName}, {assoc.chamberRoomNumber}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid var(--slate-200)' }}>
                            <span>{t.slotConsultationFee}:</span>
                            <strong style={{ color: 'var(--brand-emerald-500)', fontSize: '14px' }}>
                              {BRAND_CONSTANTS.CURRENCY_SYMBOL}{assoc.consultationFee}
                            </strong>
                          </div>
                        </div>

                        {/* Real-Time Interactive Slots */}
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-navy-900)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={13} color="var(--brand-teal-600)" />
                            <span>Today’s Available Slots (Click to Hold for 5 Mins):</span>
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {slots.slice(0, 8).map((slot) => {
                              const isBooked = slot.status === 'CONFIRMED';
                              const isHeld = slot.status === 'HELD';
                              return (
                                <button
                                  key={slot.id}
                                  disabled={isBooked}
                                  onClick={() => handleSelectSlot(slot, assoc)}
                                  style={{
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    border: isHeld
                                      ? '1px solid #F59E0B'
                                      : isBooked
                                      ? '1px solid var(--slate-200)'
                                      : '1px solid var(--brand-teal-600)',
                                    backgroundColor: isHeld
                                      ? 'var(--brand-amber-50)'
                                      : isBooked
                                      ? 'var(--slate-100)'
                                      : '#FFFFFF',
                                    color: isHeld
                                      ? '#B45309'
                                      : isBooked
                                      ? 'var(--slate-400)'
                                      : 'var(--brand-navy-900)',
                                    textDecoration: isBooked ? 'line-through' : 'none',
                                    cursor: isBooked ? 'not-allowed' : 'pointer',
                                  }}
                                >
                                  {slot.startTime} {isHeld ? '(Held)' : ''}
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
            <section style={{ backgroundColor: 'var(--slate-100)', padding: '56px 0' }}>
              <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                      {t.sectionDiagnosticsTitle}
                    </h2>
                    <p style={{ color: 'var(--slate-600)', fontSize: '14px', marginTop: '4px' }}>
                      {t.sectionDiagnosticsSubtitle}
                    </p>
                  </div>
                </div>

                <div className="grid-cards">
                  {filteredTests.map((test) => (
                    <div
                      key={test.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid var(--slate-200)',
                        padding: '20px',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <span style={{ backgroundColor: 'var(--brand-teal-50)', color: 'var(--brand-teal-600)', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                            {test.category}
                          </span>
                          {test.homeCollectionAvailable && (
                            <span style={{ backgroundColor: 'var(--brand-emerald-50)', color: '#065F46', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>
                              Home Collection
                            </span>
                          )}
                        </div>

                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-navy-900)', marginBottom: '4px' }}>
                          {test.name}
                        </h3>
                        <div style={{ fontSize: '12px', color: 'var(--slate-500)', marginBottom: '12px' }}>
                          {test.organizationName}
                        </div>

                        {/* Test preparation guidelines */}
                        <div style={{ backgroundColor: 'var(--slate-50)', padding: '10px', borderRadius: '8px', fontSize: '12px', color: 'var(--slate-700)', marginBottom: '16px', border: '1px solid var(--slate-200)' }}>
                          <div style={{ fontWeight: 600, color: 'var(--brand-navy-900)', marginBottom: '2px' }}>
                            Preparation:
                          </div>
                          <div>{test.preparationInstructions}</div>
                          <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--slate-500)' }}>
                            Sample: <strong>{test.sampleType}</strong> • Turnaround: <strong>{test.expectedDeliveryHours} hrs</strong>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--slate-100)' }}>
                        <div>
                          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                            ৳{test.discountPrice || test.price}
                          </div>
                          {test.discountPrice && (
                            <div style={{ fontSize: '11px', color: 'var(--slate-400)', textDecoration: 'line-through' }}>
                              ৳{test.price}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedBookingTest(test)}
                          style={{
                            backgroundColor: 'var(--brand-navy-700)',
                            color: '#FFFFFF',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
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

            {/* PARTNER DIAGNOSTIC CENTERS SECTION */}
            <section className="container" style={{ padding: '56px 20px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                  {t.sectionCentersTitle}
                </h2>
                <p style={{ color: 'var(--slate-600)', fontSize: '14px', marginTop: '4px' }}>
                  {t.sectionCentersSubtitle}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {appState.organizations.map((org) => (
                  <div
                    key={org.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid var(--slate-200)',
                      padding: '20px',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <Building2 size={24} color="var(--brand-teal-600)" />
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                          {org.name}
                        </h3>
                        <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                          VERIFIED DIAGNOSTIC CENTER
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '13px', color: 'var(--slate-600)', marginBottom: '12px' }}>
                      Branches: <strong>{org.branches.map((b) => b.name).join(', ')}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--slate-500)', paddingTop: '10px', borderTop: '1px solid var(--slate-100)' }}>
                      <span>Trade Lic: {org.tradeLicenseNumber}</span>
                      <a href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`} style={{ color: 'var(--brand-teal-600)', fontWeight: 600 }}>
                        Call: {BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* 5-MINUTE SLOT BOOKING MODAL */}
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
          onSimulateConflict={() => {}}
        />
      )}

      {/* PATIENT AUTH MODAL (LOGIN / REGISTER / FORGOT) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setIsAuthModalOpen(false);
          alert(`স্বাগতম, ${user.name}! আপনার অ্যাকাউন্টে সফলভাবে লগইন হয়েছে।`);
        }}
      />

      {/* B2B PROVIDER ONBOARDING WIZARD */}
      <ProviderOnboardingModal
        isOpen={isProviderOnboardOpen}
        onClose={() => setIsProviderOnboardOpen(false)}
        onSuccess={(org) => {
          alert(`অভিনন্দন! ${org.name} এর অনবোর্ডিং রিকোয়েস্ট গৃহীত হয়েছে। হেল্পলাইন: 01886748564`);
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

      {/* VERIFIED PATIENT REVIEWS MODAL (PHASE 6) */}
      <VerifiedReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
        doctorOrCenterName="ডাঃ আনিসুর রহমান"
      />

      {/* OPERATIONAL HELPLINE DISPATCHER MODAL (PHASE 8) */}
      {isHelplineOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(11, 37, 69, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div style={{ maxWidth: '850px', width: '100%', position: 'relative' }}>
            <button
              onClick={() => setIsHelplineOpen(false)}
              style={{
                position: 'absolute',
                top: '-14px',
                right: '-14px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#0B2545',
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

      <Footer language={language} />
    </div>
  );
}
