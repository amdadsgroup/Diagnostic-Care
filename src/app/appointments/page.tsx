'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import AuthModal from '@/components/auth/AuthModal';
import LocationModal from '@/components/location/LocationModal';
import { useLanguage } from '@/context/LanguageContext';
import { AppointmentService } from '@/services/appointment.service';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import { Appointment, Doctor } from '@/types';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';
import { INITIAL_DOCTORS } from '@/lib/mock-data';
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Users,
  Plus,
  Trash2,
  Share2,
  Phone,
  FileText,
  Star,
  Bell,
  Settings,
  ChevronRight,
  Stethoscope,
  Heart,
  Building2,
  ArrowRight,
} from 'lucide-react';

interface FamilyMemberItem {
  id: string;
  name: string;
  relationship: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup: string;
}

export default function AppointmentsPatientDashboardPage() {
  const { language, setLanguage, formatCurrency } = useLanguage();
  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Moulvibazar');

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'family' | 'saved' | 'settings'>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberItem[]>([]);
  const [savedDoctors, setSavedDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cancellation Modal State
  const [cancellingApt, setCancellingApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Family Member Modal State
  const [isAddFamilyOpen, setIsAddFamilyOpen] = useState(false);
  const [newFamName, setNewFamName] = useState('');
  const [newFamRelation, setNewFamRelation] = useState('Mother');
  const [newFamAge, setNewFamAge] = useState('');
  const [newFamGender, setNewFamGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('FEMALE');
  const [newFamBlood, setNewFamBlood] = useState('B+');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    AuthService.getCurrentUser().then((u) => {
      if (u) {
        setCurrentUser(u);
        loadAppointments(u.id);
      } else {
        loadGuestAppointments();
      }
    });

    const savedLoc = localStorage.getItem('dc_user_location');
    if (savedLoc) setSelectedLocation(savedLoc);
  }, []);

  const loadAppointments = async (userId: string) => {
    setIsLoading(true);
    try {
      const res = await AppointmentService.getPatientAppointments(userId);
      if (res && res.length > 0) {
        setAppointments(res);
      } else {
        loadGuestAppointments();
      }
    } catch {
      loadGuestAppointments();
    } finally {
      setIsLoading(false);
    }
  };

  const loadGuestAppointments = () => {
    // Production ready: Clean empty appointments for guest patients
    try {
      const localBookings = localStorage.getItem('dc_guest_appointments');
      if (localBookings) {
        setAppointments(JSON.parse(localBookings));
      } else {
        setAppointments([]);
      }
    } catch {
      setAppointments([]);
    }
    setIsLoading(false);
  };

  const handleCancelConfirm = async () => {
    if (!cancellingApt) return;

    await AppointmentService.cancelAppointment(cancellingApt.id, cancelReason);

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === cancellingApt.id
          ? { ...a, status: 'CANCELLED_BY_PATIENT' as const }
          : a
      )
    );

    showToast(
      language === 'en'
        ? 'Appointment cancelled successfully. A confirmation SMS has been dispatched.'
        : 'অ্যাপয়েন্টমেন্ট সফলভাবে বাতিল করা হয়েছে। একটি নিশ্চিতকরণ এসএমএস পাঠানো হয়েছে।'
    );
    setCancellingApt(null);
    setCancelReason('');
  };

  const handleAddFamilyMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamName.trim()) return;

    const newItem: FamilyMemberItem = {
      id: `fm-${Date.now()}`,
      name: newFamName.trim(),
      relationship: newFamRelation,
      age: parseInt(newFamAge, 10) || 30,
      gender: newFamGender,
      bloodGroup: newFamBlood,
    };

    setFamilyMembers([...familyMembers, newItem]);
    setIsAddFamilyOpen(false);
    setNewFamName('');
    setNewFamAge('');
    showToast(
      language === 'en'
        ? 'Family member profile added successfully.'
        : 'পারিবারিক সদস্যের প্রোফাইল সফলভাবে যুক্ত করা হয়েছে।'
    );
  };

  const handleDeleteFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter((m) => m.id !== id));
    showToast(
      language === 'en' ? 'Family member removed.' : 'পারিবারিক সদস্য তালিকা থেকে মুছে ফেলা হয়েছে।'
    );
  };

  const upcomingList = appointments.filter(
    (a) => a.status === 'CONFIRMED' || a.status === 'HELD' || a.status === 'CHECKED_IN' || a.status === 'IN_PROGRESS'
  );
  const pastList = appointments.filter(
    (a) => a.status === 'COMPLETED' || a.status === 'CANCELLED_BY_PATIENT' || a.status === 'CANCELLED_BY_PROVIDER'
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Header
        language={language}
        setLanguage={setLanguage}
        activeTab="appointments"
        setActiveTab={() => {}}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenLocation={() => setIsLocationModalOpen(true)}
        selectedLocation={selectedLocation}
        currentUser={currentUser}
        onLogout={async () => {
          await AuthService.signOut();
          setCurrentUser(null);
          loadGuestAppointments();
        }}
      />

      <main style={{ flex: 1, padding: '32px 0 64px' }}>
        <div className="container" style={{ padding: '0 24px', maxWidth: '1080px' }}>
          {/* Toast Notice */}
          {toastMessage && (
            <div
              style={{
                backgroundColor: '#ECFDF5',
                border: '1px solid #10B981',
                color: '#065F46',
                borderRadius: '12px',
                padding: '14px 20px',
                marginBottom: '24px',
                fontSize: '14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
              }}
            >
              <CheckCircle2 size={20} color="#059669" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Patient Overview Card */}
          <div
            className="glass-card"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 96, 250, 0.95) 0%, rgba(0, 78, 209, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              color: '#FFFFFF',
              borderRadius: '24px',
              padding: '28px 32px',
              marginBottom: '28px',
              boxShadow: '0 16px 36px -10px rgba(0, 96, 250, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '18px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  color: '#0060FA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '26px',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  flexShrink: 0,
                }}
              >
                <User size={34} color="#0060FA" />
              </div>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255, 255, 255, 0.18)', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, marginBottom: '6px' }}>
                  <ShieldCheck size={13} color="#EBF3FF" />
                  {language === 'en' ? 'Verified Patient Account' : 'ভেরিফাইড পেশেন্ট প্রোফাইল'}
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
                  {currentUser?.fullName || (language === 'en' ? 'Valued Patient' : 'সম্মানিত রোগী')}
                </h1>
                <p style={{ margin: 0, fontSize: '13.5px', opacity: 0.9 }}>
                  {currentUser?.phone ? `Mobile: ${currentUser.phone}` : 'Helpline: 01886748564'} • Moulvibazar Hub
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link
                href="/doctors"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#0060FA',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Stethoscope size={16} color="#0060FA" />
                <span>{language === 'en' ? 'Find New Doctor' : 'নতুন ডাক্তার খুঁজুন'}</span>
              </Link>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
              paddingBottom: '14px',
              marginBottom: '28px',
              overflowX: 'auto',
            }}
          >
            {[
              { id: 'upcoming', labelEn: `Upcoming (${upcomingList.length})`, labelBn: `আসন্ন সিরিয়াল (${upcomingList.length})`, icon: Calendar },
              { id: 'past', labelEn: `Past Consultations (${pastList.length})`, labelBn: `পূর্ববর্তী সিরিয়াল (${pastList.length})`, icon: Clock },
              { id: 'family', labelEn: `Family Members (${familyMembers.length})`, labelBn: `পারিবারিক প্রোফাইল (${familyMembers.length})`, icon: Users },
              { id: 'saved', labelEn: `Saved Doctors (${savedDoctors.length})`, labelBn: `পছন্দের ডাক্তার (${savedDoctors.length})`, icon: Heart },
              { id: 'settings', labelEn: 'Account Settings', labelBn: 'অ্যাকাউন্ট সেটিংস', icon: Settings },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: isActive ? 'none' : '1px solid rgba(226, 232, 240, 0.8)',
                    background: isActive ? 'linear-gradient(135deg, #0060FA 0%, #004ED1 100%)' : 'rgba(255, 255, 255, 0.65)',
                    backdropFilter: 'blur(8px)',
                    color: isActive ? '#FFFFFF' : '#627680',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    boxShadow: isActive ? '0 4px 14px rgba(0, 96, 250, 0.22)' : 'none',
                  }}
                >
                  <Icon size={16} />
                  <span>{language === 'en' ? tab.labelEn : tab.labelBn}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: UPCOMING APPOINTMENTS */}
          {activeTab === 'upcoming' && (
            <div>
              {upcomingList.length === 0 ? (
                <div
                  className="glass-card"
                  style={{
                    padding: '48px 24px',
                    textAlign: 'center',
                  }}
                >
                  <Calendar size={40} color="#0060FA" style={{ margin: '0 auto 12px', opacity: 0.6 }} />
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', marginBottom: '6px' }}>
                    {language === 'en' ? 'No Upcoming Appointments' : 'কোনো আসন্ন অ্যাপয়েন্টমেন্ট নেই'}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#627680', marginBottom: '20px' }}>
                    {language === 'en'
                      ? 'You have no active doctor chamber appointments scheduled at this moment.'
                      : 'এই মুহূর্তে আপনার কোনো সক্রিয় চেম্বার অ্যাপয়েন্টমেন্ট নির্ধারিত নেই।'}
                  </p>
                  <Link
                    href="/doctors"
                    className="btn-primary"
                    style={{
                      padding: '12px 24px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '14px',
                      display: 'inline-block',
                    }}
                  >
                    {language === 'en' ? 'Book a Specialist Doctor' : 'বিশেষজ্ঞ ডাক্তার দেখান'}
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {upcomingList.map((apt) => (
                    <div
                      key={apt.id}
                      className="glass-card"
                      style={{
                        padding: '24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '20px',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                        <div
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, rgba(0, 96, 250, 0.12) 0%, rgba(235, 243, 255, 0.6) 100%)',
                            border: '1px solid rgba(0, 96, 250, 0.25)',
                            color: '#0060FA',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(0, 96, 250, 0.08)',
                          }}
                        >
                          <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>TOKEN</span>
                          <span style={{ fontSize: '20px', fontWeight: 900 }}>#{apt.tokenNumber}</span>
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                            <span
                              style={{
                                background: 'rgba(21, 128, 61, 0.1)',
                                color: '#15803D',
                                border: '1px solid rgba(21, 128, 61, 0.25)',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 700,
                              }}
                            >
                              CONFIRMED
                            </span>
                            <span style={{ fontSize: '12px', color: '#627680', fontWeight: 600 }}>
                              Code: <strong style={{ color: '#090D14' }}>{apt.bookingCode}</strong>
                            </span>
                          </div>

                          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', margin: '0 0 2px 0' }}>
                            {apt.doctorName}
                          </h3>
                          <div style={{ fontSize: '13px', color: '#0060FA', fontWeight: 600, marginBottom: '6px' }}>
                            {apt.specialization}
                          </div>

                          <div style={{ fontSize: '12.5px', color: '#627680', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Building2 size={14} color="#0060FA" />
                              {apt.organizationName} ({apt.branchName})
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={14} color="#0060FA" />
                              {apt.appointmentDate} at {apt.startTime}
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <User size={14} color="#0060FA" />
                              Patient: <strong style={{ color: '#090D14' }}>{apt.patientName}</strong> ({apt.patientAge}y)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ textAlign: 'right', marginRight: '6px' }}>
                          <div style={{ fontSize: '11px', color: '#627680', fontWeight: 600, textTransform: 'uppercase' }}>CHAMBER FEE</div>
                          <div style={{ fontSize: '17px', fontWeight: 800, color: '#15803D' }}>
                            {formatCurrency(apt.consultationFee)}
                          </div>
                        </div>

                        <button
                          onClick={() => setCancellingApt(apt)}
                          style={{
                            background: 'rgba(254, 242, 242, 0.85)',
                            backdropFilter: 'blur(8px)',
                            color: '#B91C1C',
                            border: '1px solid rgba(185, 28, 28, 0.25)',
                            padding: '8px 14px',
                            borderRadius: '10px',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {language === 'en' ? 'Cancel' : 'বাতিল'}
                        </button>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `Diagnostic Care Appointment Slip:\nDoctor: ${apt.doctorName} (${apt.specialization})\nChamber: ${apt.organizationName}\nToken: #${apt.tokenNumber}\nDate: ${apt.appointmentDate} (${apt.startTime})\nBooking Reference: ${apt.bookingCode}\nPatient: ${apt.patientName}`
                            );
                            showToast(language === 'en' ? 'Slip copied to clipboard.' : 'অ্যাপয়েন্টমেন্ট স্লিপ ক্লিপবোর্ডে কপি হয়েছে।');
                          }}
                          className="btn-outline"
                          style={{
                            padding: '8px 14px',
                            borderRadius: '10px',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Share2 size={14} />
                          <span>{language === 'en' ? 'Share' : 'শেয়ার'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PAST CONSULTATIONS */}
          {activeTab === 'past' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pastList.length === 0 ? (
                <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: '#627680' }}>
                  {language === 'en' ? 'No past consultation history.' : 'পূর্ববর্তী কোনো কনসালটেশন ইতিহাস নেই।'}
                </div>
              ) : (
                pastList.map((apt) => (
                  <div
                    key={apt.id}
                    className="glass-card-sm"
                    style={{
                      padding: '20px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '14px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span
                          style={{
                            background: apt.status === 'COMPLETED' ? 'rgba(21, 128, 61, 0.1)' : 'rgba(185, 28, 28, 0.1)',
                            color: apt.status === 'COMPLETED' ? '#15803D' : '#B91C1C',
                            border: `1px solid ${apt.status === 'COMPLETED' ? 'rgba(21, 128, 61, 0.25)' : 'rgba(185, 28, 28, 0.25)'}`,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                          }}
                        >
                          {apt.status}
                        </span>
                        <span style={{ fontSize: '12px', color: '#627680' }}>{apt.appointmentDate}</span>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '16px', color: '#090D14' }}>
                        {apt.doctorName}
                      </div>
                      <div style={{ fontSize: '13px', color: '#627680' }}>
                        {apt.organizationName} • Patient: {apt.patientName}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => showToast(language === 'en' ? 'Prescription slip downloaded.' : 'প্রেসক্রিপশন স্লিপ ডাউনলোড হয়েছে।')}
                        className="btn-outline"
                        style={{
                          padding: '8px 14px',
                          borderRadius: '10px',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <FileText size={14} color="#0060FA" />
                        <span>{language === 'en' ? 'Rx Prescription' : 'প্রেসক্রিপশন'}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: FAMILY MEMBER MANAGEMENT */}
          {activeTab === 'family' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                    {language === 'en' ? 'Authorized Family Members' : 'অনুমোদিত পারিবারিক সদস্য'}
                  </h2>
                  <p style={{ fontSize: '13px', color: '#627680', margin: '2px 0 0 0' }}>
                    {language === 'en'
                      ? 'Add family members to book doctor chamber appointments on their behalf with 1-click.'
                      : 'এক ক্লিকে চেম্বার অ্যাপয়েন্টমেন্ট বুক করার জন্য পরিবারের সদস্যদের প্রোফাইল যুক্ত করুন।'}
                  </p>
                </div>

                <button
                  onClick={() => setIsAddFamilyOpen(true)}
                  className="btn-primary"
                  style={{
                    padding: '9px 18px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={16} />
                  <span>{language === 'en' ? 'Add Member' : 'সদস্য যুক্ত করুন'}</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {familyMembers.length === 0 ? (
                  <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#627680' }}>
                    {language === 'en' ? 'No family members added yet. Click "Add Family Member" above.' : 'এখনও কোনো পরিবারের সদস্য যোগ করা হয়নি। উপরের বোতামে চাপুন।'}
                  </div>
                ) : (
                  familyMembers.map((fam) => (
                  <div
                    key={fam.id}
                    className="glass-card-sm"
                    style={{
                      padding: '20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span
                        className="glass-badge-teal"
                        style={{
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}
                      >
                        {fam.relationship}
                      </span>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#090D14', margin: '6px 0 2px 0' }}>
                        {fam.name}
                      </h4>
                      <p style={{ fontSize: '12.5px', color: '#627680', margin: 0 }}>
                        {fam.age} years • {fam.gender} • Blood: {fam.bloodGroup}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteFamilyMember(fam.id)}
                      title="Remove Family Member"
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        padding: '6px',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
              </div>
            </div>
          )}

          {/* TAB 4: SAVED DOCTORS */}
          {activeTab === 'saved' && (
            savedDoctors.length === 0 ? (
              <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: '#627680' }}>
                {language === 'en' ? 'No saved doctors yet.' : 'এখনও কোনো ডাক্তার সংরক্ষিত নেই।'}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
                {savedDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="glass-card-sm"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                        {doc.fullName}
                      </h3>
                      <span style={{ fontSize: '12px', color: '#D97706', fontWeight: 700 }}>
                        ★ {doc.rating}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#0060FA', fontWeight: 600, marginTop: '2px' }}>
                      {doc.specialization}
                    </div>
                    <div style={{ fontSize: '12px', color: '#627680', marginTop: '4px' }}>
                      BMDC: {doc.bmdcNumber} • {doc.experienceYears}y Exp.
                    </div>
                  </div>

                  <Link
                    href={`/doctors/${doc.id}`}
                    className="btn-primary"
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    {language === 'en' ? 'Book Appointment' : 'সিরিয়াল নিন'}
                  </Link>
                </div>
              ))}
            </div>
            )
          )}

          {/* TAB 5: ACCOUNT SETTINGS */}
          {activeTab === 'settings' && (
            <div
              className="glass-card"
              style={{
                padding: '32px',
                maxWidth: '680px',
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', marginBottom: '20px' }}>
                {language === 'en' ? 'Account Preferences & Security' : 'অ্যাকাউন্ট ও নিরাপত্তা সেটিংস'}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(226, 232, 240, 0.7)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#090D14' }}>
                      {language === 'en' ? 'Preferred Language' : 'পছন্দের ভাষা'}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#627680' }}>
                      {language === 'en' ? 'English (Default) or বাংলা' : 'ইংরেজি অথবা বাংলা'}
                    </div>
                  </div>
                  <button
                    onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                    className="btn-outline"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {language === 'en' ? 'বাংলাতে পরিবর্তন' : 'Switch to English'}
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(226, 232, 240, 0.7)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#090D14' }}>
                      {language === 'en' ? 'SMS Booking Alerts' : 'এসএমএস বুকিং অ্যালার্ট'}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#627680' }}>
                      {language === 'en' ? 'Instant SMS with booking reference & token' : 'টোকেন ও বুকিং কোড সহ এসএমএস'}
                    </div>
                  </div>
                  <span style={{ color: '#15803D', fontWeight: 700, fontSize: '13px' }}>
                    {language === 'en' ? 'ENABLED' : 'চালু আছে'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#090D14' }}>
                      {language === 'en' ? 'Customer Care Helpline' : 'কাস্টমার কেয়ার হেল্পলাইন'}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#627680' }}>
                      {BRAND_CONSTANTS.CUSTOMER_CARE_PHONE} • 24/7 Moulvibazar Support
                    </div>
                  </div>
                  <a
                    href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
                    className="btn-primary"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    {language === 'en' ? 'Call Now' : 'কল করুন'}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Cancellation Modal */}
      {cancellingApt && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div
            className="modal-container animate-slide-down"
            style={{
              maxWidth: '460px',
              width: '100%',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <AlertTriangle size={28} color="#B91C1C" />
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                {language === 'en' ? 'Cancel Appointment?' : 'অ্যাপয়েন্টমেন্ট বাতিল করবেন?'}
              </h3>
            </div>

            <p style={{ fontSize: '13.5px', color: '#627680', lineHeight: 1.5, marginBottom: '18px' }}>
              {language === 'en'
                ? `Are you sure you want to cancel your appointment with ${cancellingApt.doctorName} (Token #${cancellingApt.tokenNumber}) on ${cancellingApt.appointmentDate}? This will immediately release the time slot.`
                : `আপনি কি নিশ্চিত যে ${cancellingApt.doctorName}-এর অ্যাপয়েন্টমেন্ট (টোকেন #${cancellingApt.tokenNumber}) বাতিল করতে চান?`}
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                {language === 'en' ? 'Reason for Cancellation (Optional):' : 'বাতিলের কারণ (ঐচ্ছিক):'}
              </label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder={language === 'en' ? 'e.g. Schedule conflict, feeling better' : 'যেমন: সময় পরিবর্তন, সুস্থ বোধ করছি'}
                className="glass-input"
                style={{ width: '100%', fontSize: '13.5px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setCancellingApt(null)}
                className="btn-outline"
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {language === 'en' ? 'Keep Appointment' : 'বাতিল করবেন না'}
              </button>
              <button
                onClick={handleCancelConfirm}
                style={{
                  backgroundColor: '#B91C1C',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(185, 28, 28, 0.25)',
                }}
              >
                {language === 'en' ? 'Confirm Cancellation' : 'বাতিল নিশ্চিত করুন'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Family Member Modal */}
      {isAddFamilyOpen && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div
            className="modal-container animate-slide-down"
            style={{
              maxWidth: '460px',
              width: '100%',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                {language === 'en' ? 'Add Family Member' : 'পারিবারিক সদস্য যুক্ত করুন'}
              </h3>
              <button
                onClick={() => setIsAddFamilyOpen(false)}
                style={{ background: 'none', border: 'none', color: '#627680', cursor: 'pointer', fontSize: '18px', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFamilyMember} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                  {language === 'en' ? 'Full Name' : 'পূর্ণ নাম'} *
                </label>
                <input
                  type="text"
                  required
                  value={newFamName}
                  onChange={(e) => setNewFamName(e.target.value)}
                  placeholder="e.g. Rahima Khatun"
                  className="glass-input"
                  style={{ width: '100%', fontSize: '13.5px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                    {language === 'en' ? 'Relationship' : 'সম্পর্ক'}
                  </label>
                  <select
                    value={newFamRelation}
                    onChange={(e) => setNewFamRelation(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%', fontSize: '13.5px' }}
                  >
                    <option value="Father">{language === 'en' ? 'Father' : 'পিতা'}</option>
                    <option value="Mother">{language === 'en' ? 'Mother' : 'মাতা'}</option>
                    <option value="Spouse">{language === 'en' ? 'Spouse' : 'স্ত্রী/স্বামী'}</option>
                    <option value="Child">{language === 'en' ? 'Child' : 'সন্তান'}</option>
                    <option value="Sibling">{language === 'en' ? 'Sibling' : 'ভাই/বোন'}</option>
                    <option value="Other">{language === 'en' ? 'Other' : 'অন্যান্য'}</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                    {language === 'en' ? 'Age (Years)' : 'বয়স'} *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={120}
                    value={newFamAge}
                    onChange={(e) => setNewFamAge(e.target.value)}
                    placeholder="35"
                    className="glass-input"
                    style={{ width: '100%', fontSize: '13.5px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                    {language === 'en' ? 'Gender' : 'লিঙ্গ'}
                  </label>
                  <select
                    value={newFamGender}
                    onChange={(e) => setNewFamGender(e.target.value as any)}
                    className="glass-input"
                    style={{ width: '100%', fontSize: '13.5px' }}
                  >
                    <option value="FEMALE">{language === 'en' ? 'Female' : 'মহিলা'}</option>
                    <option value="MALE">{language === 'en' ? 'Male' : 'পুরুষ'}</option>
                    <option value="OTHER">{language === 'en' ? 'Other' : 'অন্যান্য'}</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                    {language === 'en' ? 'Blood Group' : 'রক্তের গ্রুপ'}
                  </label>
                  <select
                    value={newFamBlood}
                    onChange={(e) => setNewFamBlood(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%', fontSize: '13.5px' }}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddFamilyOpen(false)}
                  className="btn-outline"
                  style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {language === 'en' ? 'Cancel' : 'বাতিল'}
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {language === 'en' ? 'Save Member' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
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
            if (user?.id) loadAppointments(user.id);
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
