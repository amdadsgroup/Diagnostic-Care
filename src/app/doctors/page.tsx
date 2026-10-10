'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SlotBookingModal } from '@/components/SlotBookingModal';
import AuthModal from '@/components/auth/AuthModal';
import LocationModal from '@/components/location/LocationModal';
import MobileNavigation from '@/components/navigation/MobileNavigation';
import { useLanguage } from '@/context/LanguageContext';
import { DoctorService } from '@/services/doctor.service';
import { AppointmentService } from '@/services/appointment.service';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import { INITIAL_APP_STATE } from '@/lib/store';
import { Doctor, ScheduleSlot, DoctorAssociation, Appointment } from '@/types';
import { BRAND_CONSTANTS, BRAND_COLORS } from '@/config/brand';
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Award,
  Filter,
  CheckCircle2,
  Stethoscope,
  Building2,
  ArrowRight,
  Phone,
  Sparkles,
  ChevronRight,
  User,
  Star,
  X,
} from 'lucide-react';

export default function DoctorsPage() {
  const router = useRouter();
  const { language, setLanguage, t, formatCurrency } = useLanguage();
  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Moulvibazar');

  // Doctors & Schedule State
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_APP_STATE.doctors);
  const [doctorAssociations, setDoctorAssociations] = useState<DoctorAssociation[]>(INITIAL_APP_STATE.doctorAssociations);
  const [slotsState, setSlotsState] = useState<Record<string, ScheduleSlot[]>>(INITIAL_APP_STATE.slots);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedFeeRange, setSelectedFeeRange] = useState<'ALL' | 'UNDER_600' | '600_1000' | 'ABOVE_1000'>('ALL');
  const [sortBy, setSortBy] = useState<'RATING' | 'FEE_LOW' | 'FEE_HIGH' | 'EXPERIENCE'>('RATING');

  // Booking Modal State
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);
  const [selectedAssociation, setSelectedAssociation] = useState<DoctorAssociation | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  useEffect(() => {
    // Check current user
    AuthService.getCurrentUser().then((u) => {
      if (u) setCurrentUser(u);
    });

    const savedLoc = localStorage.getItem('dc_user_location');
    if (savedLoc) setSelectedLocation(savedLoc);

    // Fetch doctors and associations from Supabase with graceful fallback
    Promise.all([
      DoctorService.getDoctors(),
      DoctorService.getDoctorAssociations(),
    ])
      .then(([dbDocs, dbAssocs]) => {
        if (dbDocs && dbDocs.length > 0) {
          setDoctors(dbDocs);
        }
        if (dbAssocs && dbAssocs.length > 0) {
          setDoctorAssociations(dbAssocs);
        }
      })
      .catch((err) => {
        console.warn('Doctors load notice:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const specialties = [
    { id: 'ALL', labelEn: 'All Specialties', labelBn: 'সকল বিশেষজ্ঞ' },
    { id: 'Cardiology', labelEn: 'Cardiology (Heart)', labelBn: 'কার্ডিওলজি (হৃদরোগ)' },
    { id: 'Medicine', labelEn: 'Internal Medicine', labelBn: 'মেডিসিন বিশেষজ্ঞ' },
    { id: 'Gynecology', labelEn: 'Gynecology & Obs', labelBn: 'স্ত্রী ও প্রসূতিরোগ' },
    { id: 'Pediatrics', labelEn: 'Pediatrics (Child)', labelBn: 'শিশু বিশেষজ্ঞ' },
    { id: 'Orthopedics', labelEn: 'Orthopedics', labelBn: 'অর্থোপেডিকস (হাড় ও জোড়া)' },
    { id: 'ENT', labelEn: 'ENT (Ear, Nose, Throat)', labelBn: 'নাক, কান ও গলা' },
    { id: 'Neurology', labelEn: 'Neurology (Brain/Nerve)', labelBn: 'নিউরোলজি (মস্তিষ্ক ও স্নায়ু)' },
    { id: 'Dermatology', labelEn: 'Dermatology (Skin/Sex)', labelBn: 'চর্ম ও যৌনরোগ' },
    { id: 'Ophthalmology', labelEn: 'Ophthalmology (Eye)', labelBn: 'চক্ষুরোগ বিশেষজ্ঞ' },
  ];

  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((doc) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = doc.fullName.toLowerCase().includes(q);
          const matchSpec = doc.specialization.toLowerCase().includes(q);
          const matchQual = doc.qualifications?.toLowerCase().includes(q) || false;
          if (!matchName && !matchSpec && !matchQual) return false;
        }

        // Specialty filter
        if (selectedSpecialty !== 'ALL') {
          if (!doc.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase())) {
            return false;
          }
        }

        // District filter via associations
        if (selectedDistrict !== 'ALL') {
          const docAssocs = doctorAssociations.filter((a) => a.doctorId === doc.id);
          const matchDist = docAssocs.some((a) => a.districtName?.toLowerCase() === selectedDistrict.toLowerCase());
          if (!matchDist && docAssocs.length > 0) return false;
        }

        // Fee filter
        const docAssoc = doctorAssociations.find((a) => a.doctorId === doc.id);
        const fee = docAssoc?.consultationFee || 700;
        if (selectedFeeRange === 'UNDER_600' && fee >= 600) return false;
        if (selectedFeeRange === '600_1000' && (fee < 600 || fee > 1000)) return false;
        if (selectedFeeRange === 'ABOVE_1000' && fee <= 1000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'RATING') {
          return (b.rating || 5) - (a.rating || 5);
        }
        if (sortBy === 'EXPERIENCE') {
          return (b.experienceYears || 0) - (a.experienceYears || 0);
        }
        const assocA = doctorAssociations.find((assoc) => assoc.doctorId === a.id);
        const assocB = doctorAssociations.find((assoc) => assoc.doctorId === b.id);
        const feeA = assocA?.consultationFee || 700;
        const feeB = assocB?.consultationFee || 700;
        if (sortBy === 'FEE_LOW') return feeA - feeB;
        if (sortBy === 'FEE_HIGH') return feeB - feeA;
        return 0;
      });
  }, [doctors, doctorAssociations, searchQuery, selectedSpecialty, selectedDistrict, selectedFeeRange, sortBy]);

  // Handle slot selection & temporary 5-min atomic hold
  const handleSlotSelect = (slot: ScheduleSlot, assoc: DoctorAssociation) => {
    if (slot.status === 'CONFIRMED' || slot.status === 'BLOCKED') return;

    const dateKey = `${assoc.id}_${slot.slotDate}`;
    const currentSlots = slotsState[dateKey] || [];
    const updated = currentSlots.map((s) =>
      s.id === slot.id
        ? { ...s, status: 'HELD' as const, holdExpiresAt: new Date(Date.now() + 300000).toISOString() }
        : s
    );

    setSlotsState((prev) => ({ ...prev, [dateKey]: updated }));
    setSelectedSlot(slot);
    setSelectedAssociation(assoc);
  };

  const handleConfirmBooking = async (data: {
    patientName: string;
    patientPhone: string;
    patientAge: number;
    patientGender: 'MALE' | 'FEMALE' | 'OTHER';
    paymentMethod: 'CASH_AT_DESK' | 'PAID';
  }) => {
    if (!selectedSlot || !selectedAssociation) return;

    const bookingCode = `DC-DOC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppointment: Appointment = {
      id: `app-${Date.now()}`,
      bookingCode,
      scheduleSlotId: selectedSlot.id,
      patientUserId: currentUser?.id || 'guest-patient',
      doctorAssociationId: selectedAssociation.id,
      branchId: selectedAssociation.branchId,
      doctorName: selectedAssociation.doctor?.fullName || 'Specialist Doctor',
      specialization: selectedAssociation.doctor?.specialization || 'Consultant',
      organizationName: selectedAssociation.organizationName,
      branchName: selectedAssociation.branchName,
      patientName: data.patientName,
      patientPhone: data.patientPhone,
      patientAge: data.patientAge,
      patientGender: data.patientGender,
      tokenNumber: Math.floor(1 + Math.random() * 15),
      appointmentDate: selectedSlot.slotDate,
      startTime: selectedSlot.startTime,
      consultationFee: selectedAssociation.consultationFee,
      status: 'CONFIRMED',
      paymentStatus: data.paymentMethod === 'PAID' ? 'PAID' : 'CASH_AT_DESK',
      createdAt: new Date().toISOString(),
    };

    try {
      if (currentUser) {
        await AppointmentService.bookAppointment({
          patientId: currentUser.id,
          doctorId: selectedAssociation.doctorId,
          providerId: selectedAssociation.organizationId,
          branchId: selectedAssociation.branchId,
          scheduleId: selectedAssociation.id,
          availabilityId: selectedSlot.id,
          appointmentDate: selectedSlot.slotDate,
          startTime: selectedSlot.startTime,
          consultationFee: selectedAssociation.consultationFee,
          doctorName: selectedAssociation.doctor?.fullName,
          specialization: selectedAssociation.doctor?.specialization,
          organizationName: selectedAssociation.organizationName,
          branchName: selectedAssociation.branchName,
          patientName: data.patientName,
          patientPhone: data.patientPhone,
          patientAge: data.patientAge,
          patientGender: data.patientGender,
        });
      }
    } catch (err) {
      console.warn('Booking persistence sync:', err);
    }

    // Update slot to confirmed
    const dateKey = `${selectedAssociation.id}_${selectedSlot.slotDate}`;
    const currentSlots = slotsState[dateKey] || [];
    const updated = currentSlots.map((s) =>
      s.id === selectedSlot.id ? { ...s, status: 'CONFIRMED' as const } : s
    );
    setSlotsState((prev) => ({ ...prev, [dateKey]: updated }));

    setConfirmedBooking(newAppointment);
    setSelectedSlot(null);
    setSelectedAssociation(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--brand-bg)' }}>
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

      <main style={{ flex: 1, paddingBottom: '60px' }}>
        {/* Breadcrumb & Header Hero Banner */}
        <section
          style={{
            backgroundColor: 'var(--glass-surface-card)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--glass-border)',
            padding: '36px 0 32px 0',
          }}
        >
          <div className="container">
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#627680', marginBottom: '12px' }}>
              <Link href="/" style={{ color: '#0060FA', fontWeight: 600 }}>
                {language === 'en' ? 'Home' : 'হোম'}
              </Link>
              <ChevronRight size={14} color="#8FA0AA" />
              <span style={{ color: '#090D14', fontWeight: 700 }}>
                {language === 'en' ? 'Specialist Doctors' : 'বিশেষজ্ঞ ডাক্তার'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'var(--brand-fresh-mint)',
                    color: '#0060FA',
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '4px 14px',
                    borderRadius: '20px',
                    border: '1px solid rgba(0, 96, 250, 0.25)',
                    marginBottom: '10px',
                  }}
                >
                  <Sparkles size={13} />
                  <span>{language === 'en' ? 'BMDC Verified Specialists' : 'বিএমডিসি রেজিস্টার্ড বিশেষজ্ঞ ডাক্তার'}</span>
                </div>
                <h1
                  style={{
                    fontSize: 'clamp(26px, 3.2vw, 36px)',
                    fontWeight: 800,
                    color: '#090D14',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    marginBottom: '8px',
                  }}
                >
                  {language === 'en' ? 'Find & Book Specialist Doctors' : 'বিশেষজ্ঞ ডাক্তার খুঁজুন ও অ্যাপয়েন্টমেন্ট নিন'}
                </h1>
                <p style={{ fontSize: '15px', color: '#627680', maxWidth: '640px' }}>
                  {language === 'en'
                    ? 'Connect with certified consultants across Bangladesh. Book evening chamber slots with 5-minute atomic reservation and real-time live queue tracking.'
                    : 'বাংলাদেশ জুড়ে অভিজ্ঞ ও বিএমডিসি নিবন্ধিত বিশেষজ্ঞ ডাক্তারদের চেম্বার অ্যাপয়েন্টমেন্ট নিশ্চিত করুন রিয়েল-টাইম লাইভ কিউ ট্র্যাকিং সহ।'}
                </p>
              </div>

              {/* Verified Count Banner */}
              <div
                className="glass-card-sm"
                style={{
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: '#0060FA',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Stethoscope size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#090D14' }}>
                    {filteredDoctors.length} {language === 'en' ? 'Doctors' : 'জন ডাক্তার'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#627680' }}>
                    {language === 'en' ? 'Available for Consultation' : 'সিরিয়ালের জন্য প্রস্তুত'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter Toolbar */}
        <section style={{ backgroundColor: 'var(--glass-surface-subtle)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--glass-border)', padding: '16px 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', alignItems: 'center' }}>
              {/* Search input */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2EAF4',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  gridColumn: 'span 2',
                }}
              >
                <Search size={16} color="#1769F5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'en'
                      ? 'Search doctor by name, qualification, or institute...'
                      : 'ডাক্তারের নাম, ডিগ্রি বা মেডিকেল কলেজ দিয়ে খুঁজুন...'
                  }
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '13.5px',
                    color: '#14243D',
                    width: '100%',
                  }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ color: '#94A3B8', cursor: 'pointer' }}>
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Specialty Select */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2EAF4',
                  borderRadius: '10px',
                  padding: '9px 12px',
                }}
              >
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '13px',
                    color: '#10294F',
                    fontWeight: 600,
                    width: '100%',
                    cursor: 'pointer',
                  }}
                >
                  {specialties.map((s) => (
                    <option key={s.id} value={s.id}>
                      {language === 'en' ? s.labelEn : s.labelBn}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Select */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2EAF4',
                  borderRadius: '10px',
                  padding: '9px 12px',
                }}
              >
                <MapPin size={15} color="#1769F5" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '13px',
                    color: '#10294F',
                    fontWeight: 600,
                    width: '100%',
                    cursor: 'pointer',
                  }}
                >
                  <option value="ALL">{language === 'en' ? 'All Locations' : 'সকল স্থান'}</option>
                  <option value="Moulvibazar">Moulvibazar (মৌলভীবাজার)</option>
                  <option value="Sylhet">Sylhet (সিলেট)</option>
                  <option value="Dhaka">Dhaka (ঢাকা)</option>
                </select>
              </div>

              {/* Fee Range Select */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2EAF4',
                  borderRadius: '10px',
                  padding: '9px 12px',
                }}
              >
                <select
                  value={selectedFeeRange}
                  onChange={(e) => setSelectedFeeRange(e.target.value as any)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '13px',
                    color: '#10294F',
                    fontWeight: 600,
                    width: '100%',
                    cursor: 'pointer',
                  }}
                >
                  <option value="ALL">{language === 'en' ? 'Any Consultation Fee' : 'সকল ফি'}</option>
                  <option value="UNDER_600">{language === 'en' ? 'Under ৳600' : '৳৬০০ এর নিচে'}</option>
                  <option value="600_1000">{language === 'en' ? '৳600 - ৳1,000' : '৳৬০০ - ৳১,০০০'}</option>
                  <option value="ABOVE_1000">{language === 'en' ? 'Above ৳1,000' : '৳১,০০০ এর বেশি'}</option>
                </select>
              </div>

              {/* Sort By Select */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2EAF4',
                  borderRadius: '10px',
                  padding: '9px 12px',
                }}
              >
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '13px',
                    color: '#10294F',
                    fontWeight: 600,
                    width: '100%',
                    cursor: 'pointer',
                  }}
                >
                  <option value="RATING">{language === 'en' ? 'Top Rated' : 'সর্বোচ্চ রেটিং'}</option>
                  <option value="EXPERIENCE">{language === 'en' ? 'Most Experienced' : 'সর্বাধিক অভিজ্ঞ'}</option>
                  <option value="FEE_LOW">{language === 'en' ? 'Fee: Low to High' : 'ফি: কম থেকে বেশি'}</option>
                  <option value="FEE_HIGH">{language === 'en' ? 'Fee: High to Low' : 'ফি: বেশি থেকে কম'}</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Confirmed Booking Notice */}
        {confirmedBooking && (
          <div className="container" style={{ marginTop: '24px' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #C4EED9',
                padding: '24px',
                boxShadow: '0 8px 24px rgba(21, 151, 106, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#E8F8F1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#15976A',
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#10294F' }}>
                    {language === 'en' ? 'Appointment Confirmed!' : 'অ্যাপয়েন্টমেন্ট সফলভাবে বুক হয়েছে!'}
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#64748B', marginTop: '3px' }}>
                    Booking Code: <strong>{confirmedBooking.bookingCode}</strong> • Token #{confirmedBooking.tokenNumber} • Patient: {confirmedBooking.patientName}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setConfirmedBooking(null)}
                style={{
                  backgroundColor: '#F0F5FD',
                  border: '1px solid #E2EAF4',
                  color: '#10294F',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {language === 'en' ? 'Dismiss' : 'ঠিক আছে'}
              </button>
            </div>
          </div>
        )}

        {/* Doctor Cards Listing Grid */}
        <section className="container" style={{ marginTop: '32px' }}>
          {isLoading ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748B' }}>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>
                {language === 'en' ? 'Loading verified doctors...' : 'ডাক্তারদের তথ্য লোড হচ্ছে...'}
              </div>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2EAF4',
                padding: '60px 24px',
                textAlign: 'center',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#EAF2FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  color: '#1769F5',
                }}
              >
                <Stethoscope size={28} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#10294F', marginBottom: '8px' }}>
                {language === 'en' ? 'No doctors match your criteria' : 'আপনার ফিল্টারে কোনো ডাক্তার পাওয়া যায়নি'}
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '20px' }}>
                {language === 'en'
                  ? 'Try selecting "All Specialties" or removing the location and price filters.'
                  : 'অনুগ্রহ করে "সকল বিশেষজ্ঞ" নির্বাচন করুন অথবা ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSpecialty('ALL');
                  setSelectedDistrict('ALL');
                  setSelectedFeeRange('ALL');
                }}
                style={{
                  backgroundColor: '#1769F5',
                  color: '#FFFFFF',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {language === 'en' ? 'Reset All Filters' : 'সকল ফিল্টার মুছুন'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '22px' }}>
              {filteredDoctors.map((doc) => {
                const assoc = doctorAssociations.find((a) => a.doctorId === doc.id) || doctorAssociations[0];
                const dateKey = assoc ? `${assoc.id}_${new Date().toISOString().split('T')[0]}` : '';
                const slots = dateKey && slotsState[dateKey] ? slotsState[dateKey].slice(0, 4) : [];

                return (
                  <div
                    key={doc.id}
                    className="glass-card"
                    style={{
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <div>
                      {/* Top Row: Doctor Info & Verified Badge */}
                      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                        <div
                          style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            backgroundColor: 'var(--brand-fresh-mint)',
                            border: '1px solid rgba(0, 96, 250, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0060FA',
                            flexShrink: 0,
                            overflow: 'hidden',
                          }}
                        >
                          <User size={34} />
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                            <Link
                              href={`/doctors/${doc.id}`}
                              style={{ textDecoration: 'none', color: '#090D14' }}
                            >
                              <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0 }}>
                                {doc.fullName}
                              </h2>
                            </Link>
                            <ShieldCheck size={16} color="#15803D" />
                          </div>

                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0060FA', marginBottom: '3px' }}>
                            {doc.specialization}
                          </div>

                          <div style={{ fontSize: '12px', color: '#627680', lineHeight: 1.4 }}>
                            {doc.qualifications}
                          </div>
                        </div>
                      </div>

                      {/* Credentials & Chamber Info */}
                      <div
                        className="glass-inset"
                        style={{
                          padding: '12px 14px',
                          marginBottom: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span style={{ color: '#627680' }}>BMDC Reg:</span>
                          <span style={{ fontWeight: 700, color: '#090D14' }}>
                            {doc.bmdcNumber || 'A-12345'}
                          </span>
                        </div>

                        {assoc && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                            <span style={{ color: '#627680' }}>Chamber:</span>
                            <span style={{ fontWeight: 600, color: '#090D14' }}>
                              {assoc.branchName || 'Popular Diagnostic Center'}
                            </span>
                          </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span style={{ color: '#627680' }}>Consultation Fee:</span>
                          <span style={{ fontWeight: 800, color: '#0060FA', fontSize: '13.5px' }}>
                            ৳ {assoc?.consultationFee || 700}
                          </span>
                        </div>
                      </div>

                      {/* Available Slots Preview */}
                      <div style={{ marginBottom: '18px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock size={13} color="#0060FA" />
                          <span>{language === 'en' ? 'Available Today (5-Min Hold):' : 'আজকের সময়সূচী:'}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {slots.length > 0 ? (
                            slots.map((slot) => {
                              const isHeld = slot.status === 'HELD';
                              const isBooked = slot.status === 'CONFIRMED';
                              return (
                                <button
                                  key={slot.id}
                                  disabled={isBooked}
                                  onClick={() => assoc && handleSlotSelect(slot, assoc)}
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: '9999px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    border: isBooked
                                      ? '1px solid rgba(143, 160, 170, 0.3)'
                                      : isHeld
                                      ? '1px solid #B45309'
                                      : '1px solid rgba(0, 96, 250, 0.3)',
                                    backgroundColor: isBooked
                                      ? 'rgba(244, 248, 250, 0.7)'
                                      : isHeld
                                      ? 'rgba(180, 83, 9, 0.12)'
                                      : 'rgba(255, 255, 255, 0.9)',
                                    color: isBooked
                                      ? '#8FA0AA'
                                      : isHeld
                                      ? '#B45309'
                                      : '#0060FA',
                                    cursor: isBooked ? 'not-allowed' : 'pointer',
                                    boxShadow: isBooked ? 'none' : '0 2px 6px rgba(0, 96, 250, 0.08)',
                                    transition: 'all 0.15s ease',
                                  }}
                                >
                                  {slot.startTime} {isBooked ? '(Booked)' : isHeld ? '(Held)' : ''}
                                </button>
                              );
                            })
                          ) : (
                            <span style={{ fontSize: '12px', color: '#8FA0AA' }}>
                              {language === 'en' ? 'Schedule updated daily at 4 PM' : 'প্রতিদিন বিকাল ৪টায় চেম্বার শুরু'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: View Profile + Book */}
                    <div style={{ display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
                      <Link
                        href={`/doctors/${doc.id}`}
                        className="btn-outline"
                        style={{
                          flex: 1,
                          padding: '10px',
                          fontSize: '13px',
                          textDecoration: 'none',
                        }}
                      >
                        <User size={14} color="#0060FA" />
                        <span>{language === 'en' ? 'View Profile' : 'প্রোফাইল ও স্লট'}</span>
                      </Link>

                      <button
                        onClick={() => {
                          if (assoc && slots.length > 0) {
                            handleSlotSelect(slots[0], assoc);
                          } else {
                            router.push(`/doctors/${doc.id}`);
                          }
                        }}
                        className="btn-primary"
                        style={{
                          flex: 1,
                          padding: '10px',
                          fontSize: '13px',
                        }}
                      >
                        <span>{language === 'en' ? 'Book Slot' : 'বুক করুন'}</span>
                        <ArrowRight size={14} />
                      </button>

                      <a
                        href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
                        title="Helpline Booking"
                        className="btn-outline"
                        style={{
                          width: '42px',
                          height: '42px',
                          padding: 0,
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#0060FA',
                          textDecoration: 'none',
                          flexShrink: 0,
                        }}
                      >
                        <Phone size={15} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* 5-Minute Slot Hold Booking Modal */}
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

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          language={language}
          onLoginSuccess={(u) => {
            setCurrentUser(u);
            setIsAuthModalOpen(false);
          }}
        />
      )}

      {/* Location Modal */}
      {isLocationModalOpen && (
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          currentLocation={selectedLocation}
          onSelectLocation={(loc) => {
            setSelectedLocation(loc);
            localStorage.setItem('dc_user_location', loc);
            setIsLocationModalOpen(false);
          }}
          language={language}
        />
      )}

      <Footer language={language} setLanguage={setLanguage} />
    </div>
  );
}
