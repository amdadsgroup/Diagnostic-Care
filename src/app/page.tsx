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
          <div className="container" style={{ padding: '32px 20px' }}>
            <DiagnosticAdminView
              organization={appState.organizations[0]}
              tests={appState.diagnosticTests}
              associations={appState.doctorAssociations}
              subscriptionPlans={appState.subscriptionPlans}
              language={language}
            />
          </div>
        )}

        {activeTab === 'portal' && currentRole === 'SUPER_ADMIN' && (
          <div className="container" style={{ padding: '32px 20px' }}>
            <SuperAdminView
              organizations={appState.organizations}
              doctors={appState.doctors}
              language={language}
            />
          </div>
        )}

        {/* LIVE QUEUE TAB */}
        {activeTab === 'queue' && (
          <div className="container" style={{ padding: '32px 20px', maxWidth: '900px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                {t.queueTitle}
              </h2>
              <p style={{ color: 'var(--slate-600)', fontSize: '14px', marginTop: '4px' }}>
                Real-time waiting room token status for evening specialist chambers in Moulvibazar.
              </p>
            </div>

            <LiveQueueCard
              queue={activeQueue}
              doctorName={appState.doctors[0].fullName}
              specialization={appState.doctors[0].specialization}
              chamberName={`${appState.organizations[0].name} (${appState.organizations[0].branches[0].name})`}
              appointments={appState.appointments}
              language={language}
              currentRole={currentRole}
              onCallNext={handleCallNext}
              onUpdateStatus={handleUpdateAppointmentStatus}
            />
          </div>
        )}

        {/* SECURE HEALTH VAULT: REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="container" style={{ padding: '32px 20px' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={24} color="#10B981" />
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                  My Diagnostic Reports & Pathology Vault
                </h2>
              </div>
              <p style={{ color: 'var(--slate-600)', fontSize: '14px', marginTop: '4px' }}>
                Protected by Diagnostic Care Zero-Leakage Policy. Download certified pathology reports via secure 15-minute signed links.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid var(--slate-200)',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span style={{ backgroundColor: 'var(--brand-emerald-50)', color: '#065F46', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                      VERIFIED & READY
                    </span>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-navy-900)', marginTop: '8px' }}>
                      CBC (Complete Blood Count with ESR)
                    </h4>
                    <div style={{ fontSize: '12px', color: 'var(--slate-500)' }}>
                      Popular Diagnostic Center (Moulvibazar Main Branch)
                    </div>
                  </div>
                  <FileText size={28} color="var(--brand-teal-600)" />
                </div>

                <div style={{ fontSize: '12px', color: 'var(--slate-600)', lineHeight: 1.6, marginBottom: '16px', backgroundColor: 'var(--slate-50)', padding: '10px', borderRadius: '6px' }}>
                  <div>Patient: <strong>Kamrul Hassan (34 yrs)</strong></div>
                  <div>Verified By: <strong>Dr. S. M. Faruq (Consultant Pathologist)</strong></div>
                  <div>Released: <strong>Today, 14:30 PM</strong></div>
                </div>

                <button
                  onClick={() => alert('Diagnostic Care Security Invariant: Generating cryptographically signed 15-minute token. Downloading verified PDF report... [Audit logged]')}
                  style={{
                    backgroundColor: 'var(--brand-navy-700)',
                    color: '#FFFFFF',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                  }}
                >
                  <Download size={15} />
                  Download Secure Report PDF
                </button>
              </div>

              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid var(--slate-200)',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                      SAMPLE IN LABORATORY
                    </span>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-navy-900)', marginTop: '8px' }}>
                      Lipid Profile Panel (Fasting)
                    </h4>
                    <div style={{ fontSize: '12px', color: 'var(--slate-500)' }}>
                      Ibn Sina Diagnostic & Consultation Centre, Moulvibazar
                    </div>
                  </div>
                  <TestTube2 size={28} color="#D97706" />
                </div>

                <div style={{ fontSize: '12px', color: 'var(--slate-600)', lineHeight: 1.6, marginBottom: '16px', backgroundColor: 'var(--slate-50)', padding: '10px', borderRadius: '6px' }}>
                  <div>Sample: Fasting Serum Blood</div>
                  <div>Status: Centrifuged & Analyzing</div>
                  <div>Estimated Availability: <strong>Today by 06:00 PM</strong></div>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--slate-500)', textAlign: 'center', padding: '8px' }}>
                  You will receive an automated SMS alert upon release.
                </div>
              </div>
            </div>
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
                  onClick={() => alert('Prescription sent to local printer or saved as PDF.')}
                  style={{
                    backgroundColor: 'var(--brand-navy-700)',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  Print / Save PDF
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
                  <div style={{ marginTop: '20px', fontSize: '13px', color: 'var(--slate-300)' }}>
                    Need immediate booking assistance? Call Customer Care Helpline: <a href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`} style={{ color: '#38BDF8', fontWeight: 700, textDecoration: 'none' }}>{BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}</a>
                  </div>
                </div>
              </div>
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
                          onClick={() => alert(`Test booking confirmed for ${test.name} at ${test.organizationName}. A phlebotomist or center receptionist will contact you via 01886748564.`)}
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

      <Footer language={language} />
    </div>
  );
}
