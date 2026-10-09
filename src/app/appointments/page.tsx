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
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberItem[]>([
    { id: 'fm-1', name: 'সুলতানা বেগম (Sultana Begum)', relationship: 'Mother', age: 58, gender: 'FEMALE', bloodGroup: 'B+' },
    { id: 'fm-2', name: 'তাহমিদ আহমেদ (Tahmid Ahmed)', relationship: 'Child', age: 7, gender: 'MALE', bloodGroup: 'O+' },
  ]);
  const [savedDoctors, setSavedDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
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
    const today = new Date().toISOString().split('T')[0];
    const demoApts: Appointment[] = [
      {
        id: 'apt-demo-1',
        bookingCode: 'DC-2026-8941',
        scheduleSlotId: 'slot-1',
        doctorAssociationId: 'assoc-1',
        branchId: 'branch-1',
        doctorName: 'Dr. Anisur Rahman',
        specialization: 'Cardiologist (হৃদরোগ বিশেষজ্ঞ)',
        organizationName: 'Popular Diagnostic Center (Moulvibazar)',
        branchName: 'Main Branch (Chowmohana)',
        patientUserId: 'user-demo',
        patientName: 'আনিসুল হক (Anisul Hoque)',
        patientPhone: '01886748564',
        patientAge: 48,
        patientGender: 'MALE',
        appointmentDate: today,
        startTime: '16:30',
        consultationFee: 800,
        tokenNumber: 3,
        status: 'CONFIRMED',
        paymentStatus: 'CASH_AT_DESK',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'apt-demo-2',
        bookingCode: 'DC-2026-4412',
        scheduleSlotId: 'slot-2',
        doctorAssociationId: 'assoc-2',
        branchId: 'branch-2',
        doctorName: 'Dr. Fatema Khatun',
        specialization: 'Gynecologist & Obstetrician',
        organizationName: 'Ibn Sina Diagnostic Centre',
        branchName: 'Court Road Branch',
        patientUserId: 'user-demo',
        patientName: 'সুলতানা বেগম (Sultana Begum)',
        patientPhone: '01886748564',
        patientAge: 58,
        patientGender: 'FEMALE',
        appointmentDate: '2026-09-28',
        startTime: '17:15',
        consultationFee: 700,
        tokenNumber: 5,
        status: 'COMPLETED',
        paymentStatus: 'PAID',
        createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
      },
    ];
    setAppointments(demoApts);
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
            className="portal-card"
            style={{
              background: 'linear-gradient(135deg, #10294F 0%, #1A365D 100%)',
              color: '#FFFFFF',
              borderRadius: '24px',
              padding: '28px 32px',
              marginBottom: '28px',
              boxShadow: '0 10px 25px rgba(16, 41, 79, 0.12)',
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
                  backgroundColor: '#FFFFFF',
                  color: '#10294F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '26px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  flexShrink: 0,
                }}
              >
                <User size={36} color="#10294F" />
              </div>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255, 255, 255, 0.15)', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, marginBottom: '6px' }}>
                  <ShieldCheck size={13} color="#6EE7B7" />
                  {language === 'en' ? 'Verified Patient Account' : 'ভেরিফাইড পেশেন্ট প্রোফাইল'}
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px 0' }}>
                  {currentUser?.fullName || (language === 'en' ? 'Valued Patient' : 'সম্মানিত রোগী')}
                </h1>
                <p style={{ margin: 0, fontSize: '13.5px', opacity: 0.85 }}>
                  {currentUser?.phone ? `Mobile: ${currentUser.phone}` : 'Helpline: 01886748564'} • Moulvibazar Hub
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link
                href="/doctors"
                className="clay-button"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#10294F',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <Stethoscope size={16} />
                <span>{language === 'en' ? 'Find New Doctor' : 'নতুন ডাক্তার খুঁজুন'}</span>
              </Link>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              borderBottom: '1px solid #E2E8F0',
              paddingBottom: '12px',
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
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: isActive ? '#10294F' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#64748B',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
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
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '48px 24px',
                    textAlign: 'center',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Calendar size={40} color="#94A3B8" style={{ margin: '0 auto 12px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                    {language === 'en' ? 'No Upcoming Appointments' : 'কোনো আসন্ন অ্যাপয়েন্টমেন্ট নেই'}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '20px' }}>
                    {language === 'en'
                      ? 'You have no active doctor chamber appointments scheduled at this moment.'
                      : 'এই মুহূর্তে আপনার কোনো সক্রিয় চেম্বার অ্যাপয়েন্টমেন্ট নির্ধারিত নেই।'}
                  </p>
                  <Link
                    href="/doctors"
                    style={{
                      backgroundColor: BRAND_COLORS.primary,
                      color: '#FFFFFF',
                      padding: '10px 22px',
                      borderRadius: '8px',
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
                      className="portal-card"
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '18px',
                        padding: '24px',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
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
                            borderRadius: '14px',
                            backgroundColor: '#E0F2FE',
                            color: '#0284C7',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>TOKEN</span>
                          <span style={{ fontSize: '20px', fontWeight: 900 }}>#{apt.tokenNumber}</span>
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                            <span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                              CONFIRMED
                            </span>
                            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
                              Code: <strong>{apt.bookingCode}</strong>
                            </span>
                          </div>

                          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: '0 0 2px 0' }}>
                            {apt.doctorName}
                          </h3>
                          <div style={{ fontSize: '13px', color: '#2563EB', fontWeight: 600, marginBottom: '6px' }}>
                            {apt.specialization}
                          </div>

                          <div style={{ fontSize: '12.5px', color: '#475569', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Building2 size={14} color="#64748B" />
                              {apt.organizationName} ({apt.branchName})
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={14} color="#64748B" />
                              {apt.appointmentDate} at {apt.startTime}
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <User size={14} color="#64748B" />
                              Patient: <strong>{apt.patientName}</strong> ({apt.patientAge}y)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ textAlign: 'right', marginRight: '6px' }}>
                          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>CHAMBER FEE</div>
                          <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                            {formatCurrency(apt.consultationFee)}
                          </div>
                        </div>

                        <button
                          onClick={() => setCancellingApt(apt)}
                          style={{
                            backgroundColor: '#FEF2F2',
                            color: '#DC2626',
                            border: '1px solid #FCA5A5',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
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
                          style={{
                            backgroundColor: '#F1F5F9',
                            color: '#0F172A',
                            border: '1px solid #CBD5E1',
                            padding: '8px 12px',
                            borderRadius: '8px',
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
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '40px', textAlign: 'center', border: '1px solid #E2E8F0', color: '#64748B' }}>
                  {language === 'en' ? 'No past consultation history.' : 'পূর্ববর্তী কোনো কনসালটেশন ইতিহাস নেই।'}
                </div>
              ) : (
                pastList.map((apt) => (
                  <div
                    key={apt.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '20px 24px',
                      border: '1px solid #E2E8F0',
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
                            backgroundColor: apt.status === 'COMPLETED' ? '#ECFDF5' : '#FEF2F2',
                            color: apt.status === 'COMPLETED' ? '#059669' : '#DC2626',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                          }}
                        >
                          {apt.status}
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748B' }}>{apt.appointmentDate}</span>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '16px', color: '#0F172A' }}>
                        {apt.doctorName}
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748B' }}>
                        {apt.organizationName} • Patient: {apt.patientName}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => showToast(language === 'en' ? 'Prescription slip downloaded.' : 'প্রেসক্রিপশন স্লিপ ডাউনলোড হয়েছে।')}
                        style={{
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #CBD5E1',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <FileText size={14} color="#0284C7" />
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
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {language === 'en' ? 'Authorized Family Members' : 'অনুমোদিত পারিবারিক সদস্য'}
                  </h2>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0 0' }}>
                    {language === 'en'
                      ? 'Add family members to book doctor chamber appointments on their behalf with 1-click.'
                      : 'এক ক্লিকে চেম্বার অ্যাপয়েন্টমেন্ট বুক করার জন্য পরিবারের সদস্যদের প্রোফাইল যুক্ত করুন।'}
                  </p>
                </div>

                <button
                  onClick={() => setIsAddFamilyOpen(true)}
                  style={{
                    backgroundColor: '#10294F',
                    color: '#FFFFFF',
                    padding: '9px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: 'none',
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
                {familyMembers.map((fam) => (
                  <div
                    key={fam.id}
                    className="portal-card"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          backgroundColor: '#EFF6FF',
                          color: '#1D4ED8',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}
                      >
                        {fam.relationship}
                      </span>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '6px 0 2px 0' }}>
                        {fam.name}
                      </h4>
                      <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0 }}>
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
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SAVED DOCTORS */}
          {activeTab === 'saved' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
              {savedDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="portal-card"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        {doc.fullName}
                      </h3>
                      <span style={{ fontSize: '12px', color: '#D97706', fontWeight: 700 }}>
                        ★ {doc.rating}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#2563EB', fontWeight: 600, marginTop: '2px' }}>
                      {doc.specialization}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                      BMDC: {doc.bmdcNumber} • {doc.experienceYears}y Exp.
                    </div>
                  </div>

                  <Link
                    href={`/doctors/${doc.id}`}
                    style={{
                      backgroundColor: '#10294F',
                      color: '#FFFFFF',
                      padding: '9px',
                      borderRadius: '8px',
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
          )}

          {/* TAB 5: ACCOUNT SETTINGS */}
          {activeTab === 'settings' && (
            <div
              className="portal-card"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid #E2E8F0',
                maxWidth: '680px',
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '20px' }}>
                {language === 'en' ? 'Account Preferences & Security' : 'অ্যাকাউন্ট ও নিরাপত্তা সেটিংস'}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>
                      {language === 'en' ? 'Preferred Language' : 'পছন্দের ভাষা'}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                      {language === 'en' ? 'English (Default) or বাংলা' : 'ইংরেজি অথবা বাংলা'}
                    </div>
                  </div>
                  <button
                    onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                    style={{
                      backgroundColor: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {language === 'en' ? 'বাংলাতে পরিবর্তন' : 'Switch to English'}
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>
                      {language === 'en' ? 'SMS Booking Alerts' : 'এসএমএস বুকিং অ্যালার্ট'}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                      {language === 'en' ? 'Instant SMS with booking reference & token' : 'টোকেন ও বুকিং কোড সহ এসএমএস'}
                    </div>
                  </div>
                  <span style={{ color: '#059669', fontWeight: 700, fontSize: '13px' }}>
                    {language === 'en' ? 'ENABLED' : 'চালু আছে'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>
                      {language === 'en' ? 'Customer Care Helpline' : 'কাস্টমার কেয়ার হেল্পলাইন'}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                      {BRAND_CONSTANTS.CUSTOMER_CARE_PHONE} • 24/7 Moulvibazar Support
                    </div>
                  </div>
                  <a
                    href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
                    style={{
                      backgroundColor: '#EFF6FF',
                      color: '#1D4ED8',
                      padding: '6px 14px',
                      borderRadius: '8px',
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
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div
            className="portal-card"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '460px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <AlertTriangle size={28} color="#DC2626" />
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {language === 'en' ? 'Cancel Appointment?' : 'অ্যাপয়েন্টমেন্ট বাতিল করবেন?'}
              </h3>
            </div>

            <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5, marginBottom: '18px' }}>
              {language === 'en'
                ? `Are you sure you want to cancel your appointment with ${cancellingApt.doctorName} (Token #${cancellingApt.tokenNumber}) on ${cancellingApt.appointmentDate}? This will immediately release the time slot.`
                : `আপনি কি নিশ্চিত যে ${cancellingApt.doctorName}-এর অ্যাপয়েন্টমেন্ট (টোকেন #${cancellingApt.tokenNumber}) বাতিল করতে চান?`}
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                {language === 'en' ? 'Reason for Cancellation (Optional):' : 'বাতিলের কারণ (ঐচ্ছিক):'}
              </label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder={language === 'en' ? 'e.g. Schedule conflict, feeling better' : 'যেমন: সময় পরিবর্তন, সুস্থ বোধ করছি'}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13.5px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setCancellingApt(null)}
                style={{
                  backgroundColor: '#F1F5F9',
                  border: 'none',
                  color: '#475569',
                  padding: '10px 18px',
                  borderRadius: '8px',
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
                  backgroundColor: '#DC2626',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
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
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div
            className="portal-card"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '460px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {language === 'en' ? 'Add Family Member' : 'পারিবারিক সদস্য যুক্ত করুন'}
              </h3>
              <button
                onClick={() => setIsAddFamilyOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '18px', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFamilyMember} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                  {language === 'en' ? 'Full Name' : 'পূর্ণ নাম'} *
                </label>
                <input
                  type="text"
                  required
                  value={newFamName}
                  onChange={(e) => setNewFamName(e.target.value)}
                  placeholder="e.g. Rahima Khatun"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                    {language === 'en' ? 'Relationship' : 'সম্পর্ক'}
                  </label>
                  <select
                    value={newFamRelation}
                    onChange={(e) => setNewFamRelation(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
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
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
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
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                    {language === 'en' ? 'Gender' : 'লিঙ্গ'}
                  </label>
                  <select
                    value={newFamGender}
                    onChange={(e) => setNewFamGender(e.target.value as any)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                  >
                    <option value="FEMALE">{language === 'en' ? 'Female' : 'মহিলা'}</option>
                    <option value="MALE">{language === 'en' ? 'Male' : 'পুরুষ'}</option>
                    <option value="OTHER">{language === 'en' ? 'Other' : 'অন্যান্য'}</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                    {language === 'en' ? 'Blood Group' : 'রক্তের গ্রুপ'}
                  </label>
                  <select
                    value={newFamBlood}
                    onChange={(e) => setNewFamBlood(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
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
                  style={{ backgroundColor: '#F1F5F9', border: 'none', color: '#475569', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {language === 'en' ? 'Cancel' : 'বাতিল'}
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#10294F', border: 'none', color: '#FFFFFF', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
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
