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
import { getCachedData } from '@/lib/cache';
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
  RefreshCw,
  Heart,
  QrCode,
  Share2,
} from 'lucide-react';
import QRCodeStudio from '@/components/qr/QRCodeStudio';
import { QRService } from '@/services/qr.service';
import { WishlistService } from '@/services/wishlist.service';

export default function DoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = (params?.id as string) || '';
  const { language, setLanguage, formatCurrency } = useLanguage();

  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(null);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [isQrStudioOpen, setIsQrStudioOpen] = useState<boolean>(false);
  const [wishlistToast, setWishlistToast] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Moulvibazar');

  // Fast cache hydration from doctor directory
  const cachedDoctors = typeof window !== 'undefined' ? getCachedData<Doctor[]>('doctors_list_active_all', true) : null;
  const initialDoctor = cachedDoctors ? (cachedDoctors.find(d => d.id === doctorId || d.bmdcNumber === doctorId) || null) : null;

  const [doctor, setDoctor] = useState<Doctor | null>(initialDoctor);
  const [associations, setAssociations] = useState<DoctorAssociation[]>([]);
  const [selectedAssoc, setSelectedAssoc] = useState<DoctorAssociation | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [isLoading, setIsLoading] = useState(!initialDoctor);

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

  // Check wishlist status & scan attribution
  useEffect(() => {
    if (!doctorId) return;

    // Check wishlist state
    WishlistService.isDoctorWishlisted(currentUser?.id, doctorId).then((status) => {
      setIsWishlisted(status);
    });

    const handleWishlistChange = () => {
      WishlistService.isDoctorWishlisted(currentUser?.id, doctorId).then(setIsWishlisted);
    };
    window.addEventListener('dc_wishlist_updated', handleWishlistChange);

    // Track QR scan event if referred via QR code
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      if (search.includes('ref=qr') || search.includes('src=qr')) {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        QRService.recordScanEvent({
          ownerType: 'DOCTOR',
          ownerId: doctorId,
          channel: 'qr_redirect',
        }).catch(() => {});
      }
    }

    return () => {
      window.removeEventListener('dc_wishlist_updated', handleWishlistChange);
    };
  }, [doctorId, currentUser]);

  // Wishlist toggle handler
  const handleToggleWishlist = async () => {
    if (!doctor) return;
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const added = await WishlistService.toggleWishlist(currentUser.id, doctor);
      setIsWishlisted(added);
      setWishlistToast(
        added
          ? (language === 'en' ? 'Saved to your Wishlist!' : 'আপনার পছন্দের তালিকায় যুক্ত হয়েছে!')
          : (language === 'en' ? 'Removed from Wishlist' : 'পছন্দের তালিকা থেকে সরানো হয়েছে')
      );
      setTimeout(() => setWishlistToast(null), 3000);
    } catch {
      setWishlistToast(language === 'en' ? 'Could not update wishlist' : 'তালিকা আপডেট করা যায়নি');
      setTimeout(() => setWishlistToast(null), 3000);
    }
  };

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
        <main style={{ flex: 1, maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '32px 16px 64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#0060FA', fontSize: '13px', fontWeight: 600 }}>
            <RefreshCw size={16} className="animate-spin" />
            <span>{language === 'en' ? 'Retrieving specialist credentials and chambers...' : 'বিশেষজ্ঞ চিকিৎসকের তথ্য প্রস্তুত করা হচ্ছে...'}</span>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '32px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div className="skeleton-box" style={{ width: '80px', height: '80px', borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton-box" style={{ width: '220px', height: '24px', marginBottom: '10px' }} />
                <div className="skeleton-box" style={{ width: '160px', height: '16px', marginBottom: '8px' }} />
                <div className="skeleton-box" style={{ width: '280px', height: '14px' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
              <div className="skeleton-box" style={{ width: '140px', height: '20px', marginBottom: '16px' }} />
              <div className="skeleton-box" style={{ width: '100%', height: '70px', borderRadius: '8px', marginBottom: '12px' }} />
              <div className="skeleton-box" style={{ width: '100%', height: '70px', borderRadius: '8px' }} />
            </div>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
              <div className="skeleton-box" style={{ width: '160px', height: '20px', marginBottom: '16px' }} />
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="skeleton-box" style={{ width: '60px', height: '60px', borderRadius: '8px' }} />
                ))}
              </div>
              <div className="skeleton-box" style={{ width: '100%', height: '44px', borderRadius: '8px' }} />
            </div>
          </div>
        </main>
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
          <div className="glass-card" style={{ maxWidth: '480px', textAlign: 'center', padding: '40px' }}>
            <AlertTriangle size={48} color="#B91C1C" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#090D14', marginBottom: '8px' }}>
              {language === 'en' ? 'Doctor Profile Not Found' : 'ডাক্তার প্রোফাইল পাওয়া যায়নি'}
            </h2>
            <p style={{ color: '#627680', fontSize: '14px', marginBottom: '24px' }}>
              {language === 'en'
                ? 'The requested doctor profile is not available or has been updated.'
                : 'অনুরোধকৃত ডাক্তার প্রোফাইলটি সক্রিয় নেই অথবা হালনাগাদ করা হয়েছে।'}
            </p>
            <Link
              href="/doctors"
              className="btn-primary"
              style={{
                padding: '12px 28px',
                borderRadius: '12px',
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
                background: 'linear-gradient(135deg, rgba(235, 243, 255, 0.8) 0%, rgba(255, 255, 255, 0.92) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(21, 128, 61, 0.3)',
                borderRadius: '20px',
                padding: '24px',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px',
                boxShadow: '0 12px 32px rgba(21, 128, 61, 0.12)',
                animation: 'slideDown 0.3s ease-out',
              }}
            >
              <div style={{ display: 'flex', gap: '16px' }}>
                <CheckCircle2 size={32} color="#15803D" style={{ flexShrink: 0, marginTop: '4px' }} />
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#15803D', marginBottom: '6px' }}>
                    {language === 'en' ? 'Appointment Confirmed Successfully!' : 'অ্যাপয়েন্টমেন্ট সফলভাবে নিশ্চিত হয়েছে!'}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#004ED1', marginBottom: '8px' }}>
                    {language === 'en' ? 'Booking Reference:' : 'বুকিং রেফারেন্স:'}{' '}
                    <strong>{confirmedBooking.bookingCode}</strong> • Token #{confirmedBooking.tokenNumber}
                  </p>
                  <p style={{ fontSize: '13px', color: '#090D14' }}>
                    {confirmedBooking.doctorName} • {confirmedBooking.organizationName} • {confirmedBooking.appointmentDate} ({confirmedBooking.startTime})
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  href="/appointments"
                  className="btn-primary"
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
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
                    color: '#15803D',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '4px',
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
                background: 'rgba(254, 242, 242, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(185, 28, 28, 0.3)',
                color: '#B91C1C',
                borderRadius: '14px',
                padding: '14px 20px',
                marginBottom: '24px',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 8px 24px rgba(185, 28, 28, 0.08)',
              }}
            >
              <AlertTriangle size={20} color="#B91C1C" />
              <span>{holdError}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {/* Left Column: Doctor Profile & Verification */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Main Profile Card */}
              <div
                className="glass-card"
                style={{
                  padding: '28px',
                }}
              >
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, rgba(0, 96, 250, 0.12) 0%, rgba(235, 243, 255, 0.6) 100%)',
                      border: '1px solid rgba(0, 96, 250, 0.25)',
                      color: '#0060FA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      fontWeight: 800,
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(0, 96, 250, 0.08)',
                    }}
                  >
                    <Stethoscope size={44} color="#0060FA" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      <span
                        className="glass-badge-teal"
                        style={{
                          padding: '3px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {doctor.specialization}
                      </span>
                      {doctor.verificationStatus === 'VERIFIED' && (
                        <span
                          style={{
                            background: 'rgba(21, 128, 61, 0.1)',
                            color: '#15803D',
                            border: '1px solid rgba(21, 128, 61, 0.25)',
                            padding: '3px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <ShieldCheck size={13} color="#15803D" />
                          {language === 'en' ? 'BMDC Verified' : 'বিএমডিসি ভেরিফাইড'}
                        </span>
                      )}
                    </div>

                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#090D14', marginBottom: '6px', letterSpacing: '-0.02em' }}>
                      {doctor.fullName}
                    </h1>

                    <p style={{ fontSize: '13.5px', color: '#627680', fontWeight: 500, lineHeight: 1.5 }}>
                      {doctor.qualifications}
                    </p>
                  </div>
                </div>

                {/* Badges and Official BMDC Registration */}
                <div
                  className="glass-inset"
                  style={{
                    padding: '16px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '14px',
                    marginBottom: '24px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', color: '#627680', fontWeight: 600, textTransform: 'uppercase' }}>
                      {language === 'en' ? 'BMDC Reg. No.' : 'বিএমডিসি নম্বর'}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#090D14', marginTop: '2px' }}>
                      {doctor.bmdcNumber}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', color: '#627680', fontWeight: 600, textTransform: 'uppercase' }}>
                      {language === 'en' ? 'Clinical Experience' : 'অভিজ্ঞতা'}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#090D14', marginTop: '2px' }}>
                      {doctor.experienceYears} {language === 'en' ? 'Years' : 'বছর'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', color: '#627680', fontWeight: 600, textTransform: 'uppercase' }}>
                      {language === 'en' ? 'Rating' : 'রেটিং'}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#D97706', marginTop: '2px' }}>
                      ★ {doctor.rating} ({doctor.reviewCount} {language === 'en' ? 'reviews' : 'রিভিউ'})
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', color: '#627680', fontWeight: 600, textTransform: 'uppercase' }}>
                      {language === 'en' ? 'Languages' : 'ভাষা'}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#090D14', marginTop: '2px' }}>
                      {doctor.languages.join(', ')}
                    </div>
                  </div>
                </div>

                {/* Clinical Bio */}
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#090D14', marginBottom: '8px' }}>
                    {language === 'en' ? 'Professional Biography & Expertise' : 'পেশাগত পরিচিতি ও দক্ষতা'}
                  </h4>
                  <p style={{ fontSize: '13.5px', color: '#627680', lineHeight: 1.6 }}>
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
                    background: 'rgba(235, 243, 255, 0.4)',
                    border: '1px solid rgba(0, 96, 250, 0.2)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#004ED1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <Info size={16} color="#0060FA" style={{ flexShrink: 0 }} />
                  <span>
                    {language === 'en'
                      ? 'BMDC credentials verified via Directorate General of Health Services (DGHS) database.'
                      : 'বিএমডিসি তথ্য ও সনদ স্বাস্থ্য অধিদপ্তরের ডাটাবেজের সাথে ভেরিফাইড।'}
                  </span>
                </div>

                {/* Quick Actions: Wishlist & QR Studio */}
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleToggleWishlist}
                    id="btn-toggle-doctor-wishlist"
                    style={{
                      flex: 1,
                      minWidth: '150px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: isWishlisted ? '1px solid rgba(225, 29, 72, 0.4)' : '1px solid rgba(203, 213, 225, 0.8)',
                      background: isWishlisted ? 'rgba(255, 228, 230, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                      color: isWishlisted ? '#E11D48' : '#334155',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Heart size={16} fill={isWishlisted ? '#E11D48' : 'none'} color={isWishlisted ? '#E11D48' : '#64748B'} />
                    {isWishlisted
                      ? (language === 'en' ? 'Saved to Wishlist' : 'পছন্দে সংরক্ষিত')
                      : (language === 'en' ? 'Save to Wishlist' : 'পছন্দ তালিকায় রাখুন')}
                  </button>

                  <button
                    onClick={() => setIsQrStudioOpen(true)}
                    id="btn-open-doctor-qr-studio"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: '1px solid rgba(0, 96, 250, 0.3)',
                      background: 'rgba(235, 243, 255, 0.8)',
                      color: '#0060FA',
                      boxShadow: '0 2px 8px rgba(0, 96, 250, 0.08)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <QrCode size={16} color="#0060FA" />
                    {language === 'en' ? 'Doctor QR & Print' : 'ডাক্তার কিউআর ও প্রিন্ট'}
                  </button>

                  <button
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.share) {
                        navigator.share({
                          title: doctor.fullName,
                          text: `Consult with ${doctor.fullName} (${doctor.specialization}) on Diagnostic Care`,
                          url: window.location.href,
                        }).catch(() => {});
                      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                        setWishlistToast(language === 'en' ? 'Profile link copied to clipboard!' : 'প্রোফাইল লিংক কপি করা হয়েছে!');
                        setTimeout(() => setWishlistToast(null), 3000);
                      }
                    }}
                    id="btn-share-doctor-profile"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid rgba(203, 213, 225, 0.8)',
                      background: 'rgba(255, 255, 255, 0.8)',
                      color: '#475569',
                      transition: 'all 0.2s ease',
                    }}
                    title={language === 'en' ? 'Share profile' : 'প্রোফাইল শেয়ার করুন'}
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>

              {/* Chambers & Branch Associations */}
              <div
                className="glass-card"
                style={{
                  padding: '24px',
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#090D14', marginBottom: '16px' }}>
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
                          border: isSelected ? '2px solid #0060FA' : '1px solid rgba(226, 232, 240, 0.8)',
                          background: isSelected
                            ? 'linear-gradient(135deg, rgba(235, 243, 255, 0.45) 0%, rgba(255, 255, 255, 0.85) 100%)'
                            : 'rgba(255, 255, 255, 0.6)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: '16px',
                          padding: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isSelected ? '0 6px 18px rgba(0, 96, 250, 0.12)' : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '15px', color: '#090D14' }}>
                              {assoc.organizationName}
                            </div>
                            <div style={{ fontSize: '13px', color: '#627680', marginTop: '2px' }}>
                              {assoc.branchName} • {assoc.chamberRoomNumber}
                            </div>
                          </div>
                          <span
                            style={{
                              backgroundColor: isSelected ? '#0060FA' : 'rgba(235, 243, 255, 0.5)',
                              color: isSelected ? '#FFFFFF' : '#0060FA',
                              border: isSelected ? 'none' : '1px solid rgba(0, 96, 250, 0.2)',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 700,
                            }}
                          >
                            {formatCurrency(assoc.consultationFee)}
                          </span>
                        </div>

                        <div style={{ fontSize: '12.5px', color: '#627680', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={14} color="#0060FA" />
                          <span>{assoc.upazilaName}, {assoc.districtName}</span>
                        </div>

                        <div style={{ fontSize: '12px', color: '#15803D', marginTop: '8px', fontWeight: 600 }}>
                          {language === 'en' ? 'Follow-up Fee:' : 'ফলো-আপ ফি:'} {formatCurrency(assoc.followupFee)} ({language === 'en' ? 'within 14 days' : '১৪ দিনের মধ্যে'})
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Booking & Cancellation Policy Card */}
              <div
                className="glass-card-sm"
                style={{
                  padding: '20px',
                  fontSize: '13px',
                  color: '#627680',
                }}
              >
                <h4 style={{ fontWeight: 700, color: '#090D14', marginBottom: '10px' }}>
                  {language === 'en' ? 'Chamber Policies & Guidelines' : 'চেম্বার নীতিমালা ও নির্দেশনা'}
                </h4>
                <ul style={{ paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', lineHeight: 1.5 }}>
                  <li>{language === 'en' ? 'Payment is collected at the chamber reception desk upon check-in.' : 'চেম্বারে উপস্থিত হয়ে রেজিস্ট্রেশন ডেস্কে ফি প্রদান করা যাবে।'}</li>
                  <li>{language === 'en' ? 'Free appointment cancellation up to 2 hours prior to scheduled slot.' : 'স্লটের ২ ঘণ্টা পূর্বে সম্পূর্ণ বিনামূল্যে অ্যাপয়েন্টমেন্ট বাতিল করা যাবে।'}</li>
                  <li>
                    {language === 'en' ? 'Emergency Helpline:' : 'জরুরি হেল্পলাইন:'}{' '}
                    <strong style={{ color: '#0060FA' }}>01886748564</strong>{' '}
                    ({language === 'en' ? 'Diagnostic Care 24/7 Support' : 'ডায়াগনস্টিক কেয়ার সার্বক্ষণিক সহায়তা'})
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Interactive Schedule & Slot Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div
                className="glass-card"
                style={{
                  padding: '28px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14' }}>
                      {language === 'en' ? 'Select Appointment Date' : 'অ্যাপয়েন্টমেন্টের তারিখ নির্বাচন করুন'}
                    </h2>
                    <p style={{ fontSize: '13px', color: '#627680', marginTop: '2px' }}>
                      {selectedAssoc?.branchName || 'Main Branch'} • Asia/Dhaka Timezone
                    </p>
                  </div>
                  <Calendar size={22} color="#0060FA" />
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
                          borderRadius: '14px',
                          border: isSelected ? '2px solid #0060FA' : '1px solid rgba(226, 232, 240, 0.8)',
                          background: isSelected
                            ? 'linear-gradient(135deg, #0060FA 0%, #004ED1 100%)'
                            : 'rgba(255, 255, 255, 0.65)',
                          backdropFilter: 'blur(8px)',
                          color: isSelected ? '#FFFFFF' : '#090D14',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          flexShrink: 0,
                          boxShadow: isSelected ? '0 6px 18px rgba(0, 96, 250, 0.25)' : 'none',
                        }}
                      >
                        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', opacity: isSelected ? 0.95 : 0.6 }}>
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
                              backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 96, 250, 0.12)',
                              color: isSelected ? '#FFFFFF' : '#0060FA',
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
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#090D14' }}>
                      {language === 'en' ? 'Available Chamber Time Slots' : 'উপলব্ধ সময়সূচি (স্লট)'}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#15803D', fontWeight: 600 }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#15803D' }} />
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
                      className="glass-inset"
                      style={{
                        padding: '32px',
                        textAlign: 'center',
                        color: '#627680',
                      }}
                    >
                      <Clock size={32} color="#0060FA" style={{ margin: '0 auto 8px', opacity: 0.6 }} />
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
                              borderRadius: '14px',
                              border: isBooked ? '1px solid rgba(226, 232, 240, 0.6)' : '1px solid rgba(0, 96, 250, 0.35)',
                              background: isBooked ? 'rgba(241, 245, 249, 0.6)' : 'linear-gradient(135deg, rgba(235, 243, 255, 0.45) 0%, rgba(255, 255, 255, 0.8) 100%)',
                              backdropFilter: 'blur(8px)',
                              color: isBooked ? '#94A3B8' : '#0060FA',
                              cursor: isBooked ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'all 0.15s ease',
                              boxShadow: isBooked ? 'none' : '0 2px 8px rgba(0, 96, 250, 0.08)',
                            }}
                          >
                            <span style={{ fontSize: '14px', fontWeight: 800 }}>
                              {slot.startTime}
                            </span>
                            <span style={{ fontSize: '11px', fontWeight: 600, opacity: isBooked ? 0.6 : 0.85 }}>
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
                    background: 'rgba(235, 243, 255, 0.55)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    border: '1px solid rgba(0, 96, 250, 0.25)',
                    fontSize: '12.5px',
                    color: '#004ED1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <Clock size={18} color="#0060FA" style={{ flexShrink: 0 }} />
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

      {/* Wishlist Toast Notification */}
      {wishlistToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.92)',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '12px',
            fontSize: '13.5px',
            fontWeight: 600,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Sparkles size={16} color="#38BDF8" />
          <span>{wishlistToast}</span>
        </div>
      )}

      {/* QR Code Studio Modal */}
      {isQrStudioOpen && doctor && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            overflowY: 'auto',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsQrStudioOpen(false);
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '920px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                  {language === 'en' ? 'Doctor Official QR Card & Print Studio' : 'ডাক্তারের অফিসিয়াল কিউআর কোড ও প্রিন্ট স্টুডিও'}
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px' }}>
                  {language === 'en' ? 'Generate prescriptions, chamber signs, or digital sharing cards' : 'প্রেসক্রিপশন, চেম্বারের নেমপ্লেট বা ডিজিটাল শেয়ারিং কার্ড তৈরি করুন'}
                </p>
              </div>
              <button
                onClick={() => setIsQrStudioOpen(false)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontWeight: 700,
                  color: '#64748B',
                }}
              >
                ✕
              </button>
            </div>

            <QRCodeStudio
              details={{
                ownerType: 'doctor',
                ownerId: doctor.id,
                name: doctor.fullName,
                specialty: doctor.specialization,
                designation: doctor.qualifications,
                publicUrl: typeof window !== 'undefined' ? `${window.location.origin}/doctors/${doctor.id}?ref=qr` : `https://diagnosticcare.vercel.app/doctors/${doctor.id}?ref=qr`,
                isVerified: doctor.verificationStatus === 'VERIFIED',
              }}
              onClose={() => setIsQrStudioOpen(false)}
            />
          </div>
        </div>
      )}

      <Footer language={language} />
    </div>
  );
}
