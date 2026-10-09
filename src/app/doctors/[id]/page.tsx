'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SlotBookingModal } from '@/components/SlotBookingModal';
import AuthModal from '@/components/auth/AuthModal';
import LocationModal from '@/components/location/LocationModal';
import { useLanguage } from '@/context/LanguageContext';
import { DoctorService } from '@/services/doctor.service';
import { AppointmentService } from '@/services/appointment.service';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import { Doctor, DoctorAssociation, ScheduleSlot, Appointment } from '@/types';
import { BRAND_COLORS } from '@/config/brand';
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Award,
  ChevronLeft,
  Phone,
  CheckCircle2,
  Info,
  Building2,
  AlertTriangle,
  Stethoscope,
  Globe2,
  CalendarCheck,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function DoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = (params?.id as string) || '';
  const { language, setLanguage, formatCurrency } = useLanguage();

  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Moulvibazar');

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [associations, setAssociations] = useState<DoctorAssociation[]>([]);
  const [selectedAssoc, setSelectedAssoc] = useState<DoctorAssociation | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Booking Modal State
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);
  const [holdError, setHoldError] = useState<string | null>(null);

  // Next 7 available calendar dates
  const availableDates = React.useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric' });
      dates.push({ iso, dayName, monthDay, isToday: i === 0 });
    }
    return dates;
  }, [language]);

  useEffect(() => {
    const todayIso = new Date().toISOString().split('T')[0];
    setSelectedDate(todayIso);

    AuthService.getCurrentUser().then((u) => {
      if (u) setCurrentUser(u);
    });

    const savedLoc = localStorage.getItem('dc_user_location');
    if (savedLoc) setSelectedLocation(savedLoc);

    // Fetch doctor profile and chambers
    Promise.all([
      DoctorService.getDoctorById(doctorId),
      DoctorService.getDoctorSchedulesByDoctorId(doctorId),
    ])
      .then(([doc, assocs]) => {
        setDoctor(doc);
        setAssociations(assocs);
        if (assocs.length > 0) {
          setSelectedAssoc(assocs[0]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [doctorId]);

  // Load slots whenever selected date or branch changes
  useEffect(() => {
    if (!doctorId || !selectedDate) return;

    DoctorService.getDoctorSlots({
      doctorId,
      branchId: selectedAssoc?.branchId,
      date: selectedDate,
    }).then((res) => {
      setSlots(res);
    });
  }, [doctorId, selectedAssoc, selectedDate]);

  // Slot Selection & 5-minute Hold Trigger
  const handleSelectSlot = async (slot: ScheduleSlot) => {
    if (slot.status === 'CONFIRMED' || slot.status === 'BLOCKED') return;
    setHoldError(null);

    // Initiate 5-minute hold via API
    try {
      const holdRes = await fetch('/api/slots/hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: slot.id,
          userId: currentUser?.id || 'guest-patient-hold',
        }),
      });
      const holdData = await holdRes.json();
      if (!holdData.success && holdRes.status === 409) {
        setHoldError(
          language === 'en'
            ? 'This slot was just held by another patient. Please choose another time.'
            : 'এই স্লটটি ইতিমধ্যে অন্য রোগী বেছে নিয়েছেন। অনুগ্রহ করে অন্য সময় বেছে নিন।'
        );
        return;
      }
    } catch {
      // Local fallback
    }

    setSelectedSlot(slot);
  };

  // Confirm booking
  const handleConfirmBooking = async (data: {
    patientName: string;
    patientPhone: string;
    patientAge: number;
    patientGender: 'MALE' | 'FEMALE' | 'OTHER';
    paymentMethod: 'CASH_AT_DESK' | 'PAID';
  }) => {
    if (!selectedSlot || !selectedAssoc) return;

    const res = await AppointmentService.bookAppointment({
      patientId: currentUser?.id || 'guest-patient',
      doctorId: doctor?.id || doctorId,
      providerId: selectedAssoc.organizationId,
      branchId: selectedAssoc.branchId,
      scheduleId: selectedAssoc.id,
      availabilityId: selectedSlot.id,
      appointmentDate: selectedSlot.slotDate,
      startTime: selectedSlot.startTime,
      consultationFee: selectedAssoc.consultationFee,
      doctorName: doctor?.fullName,
      specialization: doctor?.specialization,
      organizationName: selectedAssoc.organizationName,
      branchName: selectedAssoc.branchName,
      patientName: data.patientName,
      patientPhone: data.patientPhone,
      patientAge: data.patientAge,
      patientGender: data.patientGender,
    });

    if (res.appointment) {
      setConfirmedBooking(res.appointment);
      // Update slots local state
      setSlots((prev) =>
        prev.map((s) => (s.id === selectedSlot.id ? { ...s, status: 'CONFIRMED' as const } : s))
      );
    }

    setSelectedSlot(null);
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
        <Header
          language={language}
          setLanguage={setLanguage}
          activeTab="doctors"
          setActiveTab={() => {}}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenLocation={() => setIsLocationModalOpen(true)}
          selectedLocation={selectedLocation}
          currentUser={currentUser}
          onLogout={async () => {
            await AuthService.signOut();
            setCurrentUser(null);
          }}
        />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#64748B', fontWeight: 600 }}>
              {language === 'en' ? 'Loading doctor profile...' : 'ডাক্তারের প্রোফাইল লোড হচ্ছে...'}
            </p>
          </div>
        </div>
        <Footer language={language} />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
        <Header
          language={language}
          setLanguage={setLanguage}
          activeTab="doctors"
          setActiveTab={() => {}}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenLocation={() => setIsLocationModalOpen(true)}
          selectedLocation={selectedLocation}
          currentUser={currentUser}
          onLogout={async () => {
            await AuthService.signOut();
            setCurrentUser(null);
          }}
        />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
          <div className="portal-card" style={{ maxWidth: '480px', textAlign: 'center', padding: '40px' }}>
            <AlertTriangle size={48} color="#EF4444" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              {language === 'en' ? 'Doctor Profile Not Found' : 'ডাক্তার প্রোফাইল পাওয়া যায়নি'}
            </h2>
            <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '24px' }}>
              {language === 'en'
                ? 'The requested doctor profile is not available or has been updated.'
                : 'অনুরোধকৃত ডাক্তার প্রোফাইলটি সক্রিয় নেই অথবা হালনাগাদ করা হয়েছে।'}
            </p>
            <Link
              href="/doctors"
              className="clay-button"
              style={{
                backgroundColor: BRAND_COLORS.primary,
                color: '#FFFFFF',
                padding: '10px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-block',
                fontWeight: 700,
              }}
            >
              {language === 'en' ? 'Back to Doctor Directory' : 'ডাক্তার তালিকায় ফিরে যান'}
            </Link>
          </div>
        </div>
        <Footer language={language} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Header
        language={language}
        setLanguage={setLanguage}
        activeTab="doctors"
        setActiveTab={() => {}}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenLocation={() => setIsLocationModalOpen(true)}
        selectedLocation={selectedLocation}
        currentUser={currentUser}
        onLogout={async () => {
          await AuthService.signOut();
          setCurrentUser(null);
        }}
      />

      <main style={{ flex: 1, padding: '32px 0 64px' }}>
        <div className="container" style={{ padding: '0 24px', maxWidth: '1180px' }}>
          {/* Breadcrumb Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>
            <Link href="/" style={{ color: '#64748B', textDecoration: 'none' }}>
              {language === 'en' ? 'Home' : 'হোম'}
            </Link>
            <span>/</span>
            <Link href="/doctors" style={{ color: '#64748B', textDecoration: 'none' }}>
              {language === 'en' ? 'Doctors' : 'ডাক্তার তালিকা'}
            </Link>
            <span>/</span>
            <span style={{ color: '#0F172A', fontWeight: 600 }}>{doctor.fullName}</span>
          </div>

          {/* Booking Confirmed Flash Notice */}
          {confirmedBooking && (
            <div
              style={{
                backgroundColor: '#ECFDF5',
                border: '2px solid #10B981',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px',
                animation: 'slideDown 0.3s ease-out',
              }}
            >
              <div style={{ display: 'flex', gap: '16px' }}>
                <CheckCircle2 size={32} color="#059669" style={{ flexShrink: 0, marginTop: '4px' }} />
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#065F46', marginBottom: '6px' }}>
                    {language === 'en' ? 'Appointment Confirmed Successfully!' : 'অ্যাপয়েন্টমেন্ট সফলভাবে নিশ্চিত হয়েছে!'}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#047857', marginBottom: '8px' }}>
                    {language === 'en' ? 'Booking Reference:' : 'বুকিং রেফারেন্স:'}{' '}
                    <strong>{confirmedBooking.bookingCode}</strong> • Token #{confirmedBooking.tokenNumber}
                  </p>
                  <p style={{ fontSize: '13px', color: '#065F46' }}>
                    {confirmedBooking.doctorName} • {confirmedBooking.organizationName} • {confirmedBooking.appointmentDate} ({confirmedBooking.startTime})
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  href="/appointments"
                  style={{
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  {language === 'en' ? 'View in Dashboard' : 'ড্যাশবোর্ডে দেখুন'}
                </Link>
                <button
                  onClick={() => setConfirmedBooking(null)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#065F46',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Conflict / Hold Error Toast */}
          {holdError && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #EF4444',
                color: '#991B1B',
                borderRadius: '12px',
                padding: '14px 20px',
                marginBottom: '24px',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <AlertTriangle size={20} color="#DC2626" />
              <span>{holdError}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {/* Left Column: Doctor Profile & Verification */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Main Profile Card */}
              <div
                className="portal-card"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '28px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
                }}
              >
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '18px',
                      backgroundColor: '#E0F2FE',
                      color: '#0284C7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    <Stethoscope size={44} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <span
                        style={{
                          backgroundColor: '#EFF6FF',
                          color: '#1D4ED8',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}
                      >
                        {doctor.specialization}
                      </span>
                      {doctor.verificationStatus === 'VERIFIED' && (
                        <span
                          style={{
                            backgroundColor: '#ECFDF5',
                            color: '#059669',
                            padding: '3px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <ShieldCheck size={13} />
                          {language === 'en' ? 'BMDC Verified' : 'বিএমডিসি ভেরিফাইড'}
                        </span>
                      )}
                    </div>

                    <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                      {doctor.fullName}
                    </h1>

                    <p style={{ fontSize: '13.5px', color: '#475569', fontWeight: 500, lineHeight: 1.5 }}>
                      {doctor.qualifications}
                    </p>
                  </div>
                </div>

                {/* Badges and Official BMDC Registration */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '14px',
                    padding: '16px',
                    border: '1px solid #E2E8F0',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '14px',
                    marginBottom: '24px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                      {language === 'en' ? 'BMDC Reg. No.' : 'বিএমডিসি নম্বর'}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                      {doctor.bmdcNumber}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                      {language === 'en' ? 'Clinical Experience' : 'অভিজ্ঞতা'}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                      {doctor.experienceYears} {language === 'en' ? 'Years' : 'বছর'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                      {language === 'en' ? 'Rating' : 'রেটিং'}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#D97706', marginTop: '2px' }}>
                      ★ {doctor.rating} ({doctor.reviewCount} {language === 'en' ? 'reviews' : 'রিভিউ'})
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                      {language === 'en' ? 'Languages' : 'ভাষা'}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                      {doctor.languages.join(', ')}
                    </div>
                  </div>
                </div>

                {/* Clinical Bio */}
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    {language === 'en' ? 'Professional Biography & Expertise' : 'পেশাগত পরিচিতি ও দক্ষতা'}
                  </h4>
                  <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6 }}>
                    {doctor.biography ||
                      (language === 'en'
                        ? 'Experienced specialist providing consultation, advanced diagnosis, and personalized patient management.'
                        : 'অভিজ্ঞ বিশেষজ্ঞ চিকিৎসক যিনি নিয়মিত রোগী দেখছেন এবং আধুনিক চিকিৎসা সেবা প্রদান করছেন।')}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: '20px',
                    padding: '12px 14px',
                    backgroundColor: '#F1F5F9',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Info size={16} color="#0284C7" style={{ flexShrink: 0 }} />
                  <span>
                    {language === 'en'
                      ? 'BMDC credentials verified via Directorate General of Health Services (DGHS) database.'
                      : 'বিএমডিসি তথ্য ও সনদ স্বাস্থ্য অধিদপ্তরের ডাটাবেজের সাথে ভেরিফাইড।'}
                  </span>
                </div>
              </div>

              {/* Chambers & Branch Associations */}
              <div
                className="portal-card"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
                  {language === 'en' ? 'Practicing Chambers & Branches' : 'চেম্বার ও শাখা সমূহ'}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {associations.map((assoc) => {
                    const isSelected = selectedAssoc?.id === assoc.id;
                    return (
                      <div
                        key={assoc.id}
                        onClick={() => setSelectedAssoc(assoc)}
                        style={{
                          border: isSelected ? '2px solid #1D4ED8' : '1px solid #E2E8F0',
                          backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                          borderRadius: '14px',
                          padding: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>
                              {assoc.organizationName}
                            </div>
                            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                              {assoc.branchName} • {assoc.chamberRoomNumber}
                            </div>
                          </div>
                          <span
                            style={{
                              backgroundColor: isSelected ? '#1D4ED8' : '#F1F5F9',
                              color: isSelected ? '#FFFFFF' : '#475569',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 700,
                            }}
                          >
                            {formatCurrency(assoc.consultationFee)}
                          </span>
                        </div>

                        <div style={{ fontSize: '12.5px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={14} color="#64748B" />
                          <span>{assoc.upazilaName}, {assoc.districtName}</span>
                        </div>

                        <div style={{ fontSize: '12px', color: '#059669', marginTop: '8px', fontWeight: 600 }}>
                          {language === 'en' ? 'Follow-up Fee:' : 'ফলো-আপ ফি:'} {formatCurrency(assoc.followupFee)} ({language === 'en' ? 'within 14 days' : '১৪ দিনের মধ্যে'})
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Booking & Cancellation Policy Card */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid #E2E8F0',
                  fontSize: '13px',
                  color: '#475569',
                }}
              >
                <h4 style={{ fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>
                  {language === 'en' ? 'Chamber Policies & Guidelines' : 'চেম্বার নীতিমালা ও নির্দেশনা'}
                </h4>
                <ul style={{ paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', lineHeight: 1.5 }}>
                  <li>{language === 'en' ? 'Payment is collected at the chamber reception desk upon check-in.' : 'চেম্বারে উপস্থিত হয়ে রেজিস্ট্রেশন ডেস্কে ফি প্রদান করা যাবে।'}</li>
                  <li>{language === 'en' ? 'Free appointment cancellation up to 2 hours prior to scheduled slot.' : 'স্লটের ২ ঘণ্টা পূর্বে সম্পূর্ণ বিনামূল্যে অ্যাপয়েন্টমেন্ট বাতিল করা যাবে।'}</li>
                  <li>{language === 'en' ? 'Emergency Helpline: 01886748564 (Diagnostic Care 24/7 Support).' : 'জরুরি হেল্পলাইন: ০১৮৮৬৭৪৮৫৬৪ (ডায়াগনস্টিক কেয়ার সার্বক্ষণিক সহায়তা)।'}</li>
                </ul>
              </div>
            </div>

            {/* Right Column: Interactive Schedule & Slot Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div
                className="portal-card"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '28px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                      {language === 'en' ? 'Select Appointment Date' : 'অ্যাপয়েন্টমেন্টের তারিখ নির্বাচন করুন'}
                    </h2>
                    <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                      {selectedAssoc?.branchName || 'Main Branch'} • Asia/Dhaka Timezone
                    </p>
                  </div>
                  <Calendar size={22} color={BRAND_COLORS.primary} />
                </div>

                {/* 7-Day Date Carousel */}
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    overflowX: 'auto',
                    paddingBottom: '8px',
                    marginBottom: '24px',
                  }}
                >
                  {availableDates.map((item) => {
                    const isSelected = selectedDate === item.iso;
                    return (
                      <button
                        key={item.iso}
                        onClick={() => setSelectedDate(item.iso)}
                        style={{
                          minWidth: '82px',
                          padding: '12px 8px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #1D4ED8' : '1px solid #E2E8F0',
                          backgroundColor: isSelected ? '#1D4ED8' : '#F8FAFC',
                          color: isSelected ? '#FFFFFF' : '#0F172A',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          flexShrink: 0,
                        }}
                      >
                        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', opacity: isSelected ? 0.9 : 0.6 }}>
                          {item.dayName}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 800 }}>
                          {item.monthDay}
                        </span>
                        {item.isToday && (
                          <span
                            style={{
                              fontSize: '9px',
                              fontWeight: 700,
                              backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : '#E2E8F0',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              marginTop: '2px',
                            }}
                          >
                            {language === 'en' ? 'TODAY' : 'আজ'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Discrete Slot Grid */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                      {language === 'en' ? 'Available Chamber Time Slots' : 'উপলব্ধ সময়সূচি (স্লট)'}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 600 }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                        {language === 'en' ? 'Available' : 'উপলব্ধ'}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontWeight: 600 }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#CBD5E1' }} />
                        {language === 'en' ? 'Booked' : 'বুকড'}
                      </span>
                    </div>
                  </div>

                  {slots.length === 0 ? (
                    <div
                      style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: '12px',
                        padding: '32px',
                        textAlign: 'center',
                        color: '#64748B',
                      }}
                    >
                      <Clock size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                      <p style={{ fontWeight: 600, fontSize: '14px' }}>
                        {language === 'en'
                          ? 'No chamber consultation sessions scheduled on this date.'
                          : 'এই তারিখে কোনো চেম্বার সেশন উপলব্ধ নেই। অন্য তারিখ বেছে নিন।'}
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                        gap: '12px',
                      }}
                    >
                      {slots.map((slot) => {
                        const isBooked = slot.status === 'CONFIRMED' || slot.status === 'BLOCKED';
                        return (
                          <button
                            key={slot.id}
                            disabled={isBooked}
                            onClick={() => handleSelectSlot(slot)}
                            style={{
                              padding: '12px 10px',
                              borderRadius: '12px',
                              border: isBooked ? '1px solid #E2E8F0' : '1px solid #93C5FD',
                              backgroundColor: isBooked ? '#F1F5F9' : '#EFF6FF',
                              color: isBooked ? '#94A3B8' : '#1E40AF',
                              cursor: isBooked ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'all 0.15s ease',
                              boxShadow: isBooked ? 'none' : '0 2px 6px rgba(37, 99, 235, 0.08)',
                            }}
                          >
                            <span style={{ fontSize: '14px', fontWeight: 800 }}>
                              {slot.startTime}
                            </span>
                            <span style={{ fontSize: '11px', fontWeight: 600, opacity: isBooked ? 0.6 : 0.8 }}>
                              {isBooked ? (language === 'en' ? 'Booked' : 'বুকড') : `Token #${slot.tokenNumber}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 5-minute atomic hold reminder */}
                <div
                  style={{
                    backgroundColor: '#EFF6FF',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    border: '1px solid #BFDBFE',
                    fontSize: '12.5px',
                    color: '#1E40AF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <Clock size={18} color="#2563EB" style={{ flexShrink: 0 }} />
                  <span>
                    {language === 'en'
                      ? 'Selecting a time slot holds it temporarily for 5 minutes, preventing double bookings.'
                      : 'সময় বেছে নিলে স্লটটি ৫ মিনিটের জন্য সাময়িকভাবে সংরক্ষিত হবে, যাতে অন্য কেউ একই সময় নিতে না পারে।'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Slot Booking Modal */}
      {selectedSlot && selectedAssoc && (
        <SlotBookingModal
          slot={selectedSlot}
          association={selectedAssoc}
          language={language}
          currentUser={currentUser}
          onClose={() => setSelectedSlot(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode="login"
          language={language}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={(user: any) => {
            setCurrentUser(user);
            setIsAuthModalOpen(false);
          }}
        />
      )}

      {/* Location Modal */}
      {isLocationModalOpen && (
        <LocationModal
          isOpen={isLocationModalOpen}
          language={language}
          onClose={() => setIsLocationModalOpen(false)}
          onSelectLocation={(loc: string) => {
            setSelectedLocation(loc);
            localStorage.setItem('dc_user_location', loc);
            setIsLocationModalOpen(false);
          }}
        />
      )}

      <Footer language={language} />
    </div>
  );
}
