'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import AuthModal from '@/components/auth/AuthModal';
import LoginForm from '@/components/auth/LoginForm';
import ProviderAuthCard from '@/components/auth/ProviderAuthCard';
import LocationModal from '@/components/location/LocationModal';
import { useLanguage } from '@/context/LanguageContext';
import { DoctorService } from '@/services/doctor.service';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';
import {
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Stethoscope,
  FileText,
  Plus,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Building2,
  CalendarDays,
  Settings,
  Lock,
  Phone,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  KeyRound,
  LogOut,
  Mail,
  Award,
  MapPin,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
  Eye,
  EyeOff,
  Bell,
  Menu,
  Printer,
  TrendingUp,
  CreditCard,
  User,
  Activity,
  Briefcase,
  GraduationCap,
  MessageSquare,
  HelpCircle,
  QrCode,
} from 'lucide-react';
import QRCodeStudio from '@/components/qr/QRCodeStudio';
import { QRService } from '@/services/qr.service';

interface QueuePatient {
  id: string;
  token: number;
  name: string;
  phone: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  status: 'WAITING' | 'IN_ROOM' | 'COMPLETED' | 'NO_SHOW';
  time: string;
  fee: number;
  bookingSource?: string;
  bookingCode?: string;
}

function DoctorDashboardContent() {
  const { language, setLanguage, formatCurrency } = useLanguage();
  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Moulvibazar');

  // Sidebar navigation & Layout state
  const [activeTab, setActiveTab] = useState<
    'overview' | 'queue' | 'appointments' | 'prescriptions' | 'affiliations' | 'schedule' | 'leaves' | 'profile' | 'marketplace' | 'security' | 'qr_code'
  >('overview');
  const [qrAnalytics, setQrAnalytics] = useState<any>(null);
  const [isQrLoading, setIsQrLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Common UI State
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  // Multi-institution & Affiliations State
  const [affiliations, setAffiliations] = useState<any[]>([]);
  const [activeAffiliation, setActiveAffiliation] = useState<any | null>(null);
  const [isAffiliationDropdownOpen, setIsAffiliationDropdownOpen] = useState(false);
  const [pendingInvitations, setPendingInvitations] = useState<any[]>([]);
  const [isReviewInvitationsOpen, setIsReviewInvitationsOpen] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Doctor Profile State
  const [doctorProfile, setDoctorProfile] = useState<any | null>(null);
  const [profFullName, setProfFullName] = useState('');
  const [profPhone, setProfPhone] = useState('');
  const [profBmdcNumber, setProfBmdcNumber] = useState('');
  const [profSpecialization, setProfSpecialization] = useState('Cardiology & Medicine');
  const [profQualifications, setProfQualifications] = useState('MBBS, FCPS, MD (Cardiology)');
  const [profExperience, setProfExperience] = useState(12);
  const [profBiography, setProfBiography] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Appointments & Serials Desk State
  const [appointments, setAppointments] = useState<any[]>([]);
  const [aptSubFilter, setAptSubFilter] = useState<'ALL' | 'TODAY' | 'UPCOMING' | 'PENDING' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED'>('TODAY');
  const [aptSearchQuery, setAptSearchQuery] = useState('');
  const [aptDateFilter, setAptDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [aptSourceFilter, setAptSourceFilter] = useState<'ALL' | 'online' | 'manual'>('ALL');
  const [isAptLoading, setIsAptLoading] = useState(false);

  // Cancel / Rejection Modal
  const [cancelModalApt, setCancelModalApt] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancellingApt, setIsCancellingApt] = useState(false);

  // Live Queue & Caller State
  const [queue, setQueue] = useState<QueuePatient[]>([]);
  const [activePatient, setActivePatient] = useState<QueuePatient | null>(null);
  const [isCallingRingerActive, setIsCallingRingerActive] = useState(false);

  // Digital Prescription Form
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [recommendedTests, setRecommendedTests] = useState('CBC, ECG 12-Lead, Serum Creatinine, Fasting Blood Sugar');
  const [medicines, setMedicines] = useState<Array<{ name: string; dose: string; instruction: string; days: number }>>([
    { name: 'Tab. Concor 2.5mg', dose: '1+0+0', instruction: 'সকালে খাবারের পর', days: 30 },
    { name: 'Tab. Rosuva 10mg', dose: '0+0+1', instruction: 'রাতে খাবারের পর', days: 30 },
    { name: 'Tab. Monas 10mg', dose: '0+0+1', instruction: 'রাতে খাবারের পর', days: 14 },
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('1+0+1');
  const [newMedInstruction, setNewMedInstruction] = useState('খাবারের পর');
  const [newMedDays, setNewMedDays] = useState(7);
  const [rxFollowupDate, setRxFollowupDate] = useState('');
  const [isSavingRx, setIsSavingRx] = useState(false);

  // Schedule Management State
  const [schedDaysOfWeek, setSchedDaysOfWeek] = useState<string[]>(['Sat', 'Sun', 'Mon', 'Tue', 'Wed']);
  const [schedStartTime, setSchedStartTime] = useState('05:00 PM');
  const [schedEndTime, setSchedEndTime] = useState('09:00 PM');
  const [schedChamberRoom, setSchedChamberRoom] = useState('Room 302, 3rd Floor');
  const [schedFee, setSchedFee] = useState(1000);
  const [schedDailyLimit, setSchedDailyLimit] = useState(30);
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);

  // Leave Management State
  const [leaves, setLeaves] = useState([
    { id: 'l-1', startDate: '2026-10-24', endDate: '2026-10-26', reason: 'Bangladesh Cardiac Society Annual Scientific Conference, Dhaka', status: 'ACTIVE' },
  ]);
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);

  // Security & Password State
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Doctor Login Gate State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSubmitted, setForgotPasswordSubmitted] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // 1. Initial Load of Doctor Data
  const loadAffiliationsAndInvitations = async (userId?: string, email?: string) => {
    try {
      const affils = await DoctorService.getDoctorAffiliations(userId, email);
      setAffiliations(affils);
      const savedAffilId = typeof window !== 'undefined' ? localStorage.getItem('dc_active_affiliation_id') : null;
      const found = affils.find((a: any) => a.id === savedAffilId || a.hospitalId === savedAffilId);
      const active = found || (affils.length > 0 ? affils[0] : null);
      setActiveAffiliation(active);

      if (active) {
        setSchedChamberRoom(active.chamberRoom || 'Room 302');
        setSchedFee(active.consultationFee || 1000);
        setSchedDailyLimit(active.dailySerialLimit || 30);
      }

      const invs = await DoctorService.getDoctorInvitations(email);
      setPendingInvitations(invs);

      // Load notifications
      const notifs = await DoctorService.getDoctorNotifications(userId, email);
      setNotifications(notifs);
    } catch (err) {
      console.warn('Failed to load affiliations/invitations:', err);
    }
  };

  const loadDoctorProfile = async (userId?: string, email?: string) => {
    try {
      const prof = await DoctorService.getDoctorProfile(userId, email);
      if (prof) {
        setDoctorProfile(prof);
        setProfFullName(prof.fullName || '');
        setProfPhone(prof.phone || '');
        setProfBmdcNumber(prof.bmdcNumber || '');
        setProfSpecialization(prof.specialization || 'Cardiology & Medicine');
        setProfQualifications(prof.qualifications || 'MBBS, FCPS');
        setProfExperience(prof.experienceYears || 10);
        setProfBiography(prof.biography || '');
      }
    } catch (e) {
      console.warn('Error loading doctor profile:', e);
    }
  };

  const loadDoctorAppointments = async (docId?: string, hospId?: string) => {
    if (!docId) return;
    setIsAptLoading(true);
    try {
      const data = await DoctorService.getDoctorAppointments({
        doctorId: docId,
        hospitalId: hospId || 'ALL',
      });
      setAppointments(data);

      // Build live queue from today's appointments
      const todayStr = new Date().toISOString().split('T')[0];
      const todayApts = data.filter((a: any) => {
        const aptDate = a.appointment_date || a.appointmentDate;
        return aptDate === todayStr && a.status !== 'cancelled' && a.status !== 'rejected';
      });

      if (todayApts.length > 0) {
        const queueList: QueuePatient[] = todayApts.map((a: any, idx: number) => {
          const serialNum = Number(a.serial_number || a.serialNumber || a.token_number || idx + 1);
          let queueStatus: QueuePatient['status'] = 'WAITING';
          if (a.status === 'in_progress' || a.status === 'in_room') queueStatus = 'IN_ROOM';
          else if (a.status === 'completed') queueStatus = 'COMPLETED';
          else if (a.status === 'no_show') queueStatus = 'NO_SHOW';

          return {
            id: a.id,
            token: serialNum,
            name: a.patient_name || a.patientName || 'Patient',
            phone: a.patient_phone || a.patientPhone || '01XXXXXXXXX',
            age: a.patient_age || a.patientAge || 35,
            gender: a.patient_gender || a.patientGender || 'MALE',
            status: queueStatus,
            time: a.start_time || a.startTime || '05:00 PM',
            fee: Number(a.consultation_fee || a.consultationFee || 1000),
            bookingSource: a.booking_source || a.bookingSource || 'online',
            bookingCode: a.booking_code || a.bookingCode || `#${a.id.slice(0, 6)}`,
          };
        });

        setQueue(queueList);
        const currentInRoom = queueList.find((p) => p.status === 'IN_ROOM');
        if (currentInRoom) setActivePatient(currentInRoom);
      } else {
        // Fallback default sample queue for preview
        setQueue([]);
        setActivePatient(null);
      }
    } catch (err) {
      console.warn('Error fetching appointments:', err);
    } finally {
      setIsAptLoading(false);
    }
  };

  useEffect(() => {
    AuthService.getCurrentUser().then((u) => {
      if (u) {
        if (['HOSPITAL_ADMIN', 'DIAGNOSTIC_ADMIN', 'CLINIC_ADMIN', 'HOSPITAL_STAFF', 'DIAGNOSTIC_STAFF'].includes(u.primaryRole)) {
          if (typeof window !== 'undefined') {
            window.location.href = '/hospital/portal';
            return;
          }
        }
        setCurrentUser(u);
        const mustChange = typeof window !== 'undefined' && localStorage.getItem(`dc_must_change_password_${u.id}`) === 'true';
        if (mustChange) {
          setMustChangePassword(true);
        }
        loadAffiliationsAndInvitations(u.id, u.email);
        loadDoctorProfile(u.id, u.email);
        loadDoctorAppointments(u.id);
      }
      setIsLoading(false);
    });

    const savedLoc = typeof window !== 'undefined' ? localStorage.getItem('dc_user_location') : null;
    if (savedLoc) setSelectedLocation(savedLoc);
  }, []);

  // Fetch QR analytics when My QR Code tab is opened
  useEffect(() => {
    if (activeTab === 'qr_code' && currentUser?.id) {
      setIsQrLoading(true);
      QRService.getAnalytics('doctor', currentUser.id).then((analytics) => {
        setQrAnalytics(analytics);
        setIsQrLoading(false);
      });
    }
  }, [activeTab, currentUser?.id]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt: any) => {
      const aptDate = apt.appointment_date || apt.appointmentDate || '';
      const aptStatus = (apt.status || 'confirmed').toLowerCase();
      const patientName = (apt.patient_name || apt.patientName || '').toLowerCase();
      const patientPhone = apt.patient_phone || apt.patientPhone || '';
      const bookingCode = (apt.booking_code || apt.bookingCode || '').toLowerCase();
      const serialNum = String(apt.serial_number || apt.serialNumber || apt.token_number || '');
      const source = (apt.booking_source || apt.bookingSource || 'online').toLowerCase();
      const isManual = source === 'manual' || source === 'phone_call' || source === 'walk_in';

      // Source Filter
      if (aptSourceFilter === 'online' && isManual) return false;
      if (aptSourceFilter === 'manual' && !isManual) return false;

      // Sub Filter
      const todayStr = new Date().toISOString().split('T')[0];
      if (aptSubFilter === 'TODAY' && aptDate !== todayStr) return false;
      if (aptSubFilter === 'UPCOMING' && aptDate <= todayStr) return false;
      if (aptSubFilter === 'PENDING' && aptStatus !== 'pending') return false;
      if (aptSubFilter === 'CHECKED_IN' && aptStatus !== 'checked_in') return false;
      if (aptSubFilter === 'COMPLETED' && aptStatus !== 'completed') return false;
      if (aptSubFilter === 'CANCELLED' && aptStatus !== 'cancelled' && aptStatus !== 'rejected') return false;

      // Search Filter
      if (aptSearchQuery.trim()) {
        const q = aptSearchQuery.trim().toLowerCase();
        const matches =
          patientName.includes(q) ||
          patientPhone.includes(q) ||
          bookingCode.includes(q) ||
          serialNum.includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [appointments, aptSubFilter, aptSearchQuery, aptSourceFilter]);

  // Auth Operations
  const handleDoctorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError(language === 'en' ? 'Please enter your email and password.' : 'ইমেইল এবং পাসওয়ার্ড প্রদান করুন।');
      return;
    }
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const res = await AuthService.signIn(loginEmail.trim(), loginPassword);
      if (res.error) {
        setLoginError(res.error);
        setIsLoggingIn(false);
        return;
      }
      if (res.profile) {
        if (['HOSPITAL_ADMIN', 'DIAGNOSTIC_ADMIN', 'CLINIC_ADMIN', 'HOSPITAL_STAFF', 'DIAGNOSTIC_STAFF'].includes(res.profile.primaryRole)) {
          showToast(language === 'en' ? 'Hospital account detected! Redirecting to Hospital Portal...' : 'হাসপাতাল একাউন্ট শনাক্ত হয়েছে! পোর্টালে রিডাইরেক্ট করা হচ্ছে...');
          setTimeout(() => {
            window.location.href = '/hospital/portal';
          }, 400);
          return;
        }
        setCurrentUser(res.profile);
        const mustChange = typeof window !== 'undefined' && localStorage.getItem(`dc_must_change_password_${res.profile.id}`) === 'true';
        if (mustChange) {
          setMustChangePassword(true);
        }
        await loadAffiliationsAndInvitations(res.profile.id, res.profile.email);
        await loadDoctorProfile(res.profile.id, res.profile.email);
        await loadDoctorAppointments(res.profile.id);
        showToast(language === 'en' ? 'Welcome to Central Doctor Portal!' : 'সেন্ট্রাল ডাক্তার পোর্টালে স্বাগতম!');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail.trim()) return;
    setIsSendingReset(true);
    try {
      await AuthService.resetPassword(forgotPasswordEmail.trim());
      setForgotPasswordSubmitted(true);
    } catch {
      setForgotPasswordSubmitted(true);
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast(language === 'en' ? 'Password must be at least 8 characters long.' : 'পাসওয়ার্ড ন্যূনতম ৮ অক্ষরের হতে হবে।', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast(language === 'en' ? 'Passwords do not match. Please verify.' : 'পাসওয়ার্ড মেলেনি। অনুগ্রহ করে যাচাই করুন।', 'error');
      return;
    }
    setIsChangingPassword(true);
    try {
      const res = await AuthService.updatePassword(newPassword);
      if (!res.success) {
        showToast(res.error || 'Failed to update password', 'error');
        setIsChangingPassword(false);
        return;
      }
      setMustChangePassword(false);
      setNewPassword('');
      setConfirmPassword('');
      showToast(language === 'en' ? 'Password updated successfully! Your account is secure.' : 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!');
    } catch (err: any) {
      showToast(err.message || 'Password update failed', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Affiliation Switching & Invitations
  const handleSwitchAffiliation = (affil: any) => {
    setActiveAffiliation(affil);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dc_active_affiliation_id', affil.id);
    }
    setIsAffiliationDropdownOpen(false);
    setSchedChamberRoom(affil.chamberRoom || 'Room 302');
    setSchedFee(affil.consultationFee || 1000);
    setSchedDailyLimit(affil.dailySerialLimit || 30);

    // Refresh appointments for new active hospital
    if (currentUser?.id) {
      loadDoctorAppointments(currentUser.id, affil.hospitalId);
    }

    showToast(
      language === 'en'
        ? `Switched active chamber to ${affil.hospitalName} (${affil.branchName})`
        : `সক্রিয় চেম্বার পরিবর্তিত হয়েছে: ${affil.hospitalName}`
    );
  };

  const handleRespondInvitation = async (invitationId: string, action: 'accept' | 'decline') => {
    try {
      const res = await DoctorService.respondToInvitation({
        invitationId,
        action,
        doctorId: currentUser?.id,
        doctorName: currentUser?.fullName,
        doctorEmail: currentUser?.email,
      });
      showToast(res.message);
      await loadAffiliationsAndInvitations(currentUser?.id, currentUser?.email);
      if (action === 'accept') {
        setIsReviewInvitationsOpen(false);
      }
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  // Queue advancement & Caller Ringer
  const handleCallNext = () => {
    setQueue((prev) => {
      const copy = [...prev];
      const inRoomIdx = copy.findIndex((p) => p.status === 'IN_ROOM');
      if (inRoomIdx !== -1) {
        copy[inRoomIdx].status = 'COMPLETED';
        // Sync server status
        DoctorService.updateDoctorAppointmentStatus({
          appointmentId: copy[inRoomIdx].id,
          status: 'completed',
          actorId: currentUser?.id,
        });
      }

      const nextWaitingIdx = copy.findIndex((p) => p.status === 'WAITING');
      if (nextWaitingIdx !== -1) {
        copy[nextWaitingIdx].status = 'IN_ROOM';
        setActivePatient(copy[nextWaitingIdx]);

        // Trigger visual audio bell ringer
        setIsCallingRingerActive(true);
        setTimeout(() => setIsCallingRingerActive(false), 3000);

        // Sync server status
        DoctorService.updateDoctorAppointmentStatus({
          appointmentId: copy[nextWaitingIdx].id,
          status: 'in_progress',
          actorId: currentUser?.id,
        });

        showToast(
          language === 'en'
            ? `Calling Token #${copy[nextWaitingIdx].token}: ${copy[nextWaitingIdx].name}`
            : `টোকেন #${copy[nextWaitingIdx].token} ডাকা হচ্ছে: ${copy[nextWaitingIdx].name}`
        );
      } else {
        setActivePatient(null);
        showToast(language === 'en' ? 'All scheduled patients completed.' : 'আজকের সকল রোগীর সিরিয়াল সম্পন্ন হয়েছে।');
      }
      return copy;
    });
  };

  // Appointment Status Transitions
  const handleUpdateAptStatus = async (appointmentId: string, status: string, notes?: string) => {
    try {
      const res = await DoctorService.updateDoctorAppointmentStatus({
        appointmentId,
        status,
        notes,
        actorId: currentUser?.id,
      });
      showToast(res.message);

      // Refresh list
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, status } : a))
      );
      setQueue((prev) =>
        prev.map((p) => (p.id === appointmentId ? { ...p, status: status === 'completed' ? 'COMPLETED' : status === 'in_progress' ? 'IN_ROOM' : 'WAITING' } : p))
      );
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleConfirmCancelApt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalApt) return;
    setIsCancellingApt(true);
    try {
      await DoctorService.updateDoctorAppointmentStatus({
        appointmentId: cancelModalApt.id,
        status: 'cancelled',
        cancellationReason: cancelReason || 'Cancelled by practitioner',
        actorId: currentUser?.id,
      });
      showToast(language === 'en' ? 'Appointment cancelled.' : 'অ্যাপয়েন্টমেন্ট বাতিল করা হয়েছে।');
      setCancelModalApt(null);
      setCancelReason('');
      if (currentUser?.id) loadDoctorAppointments(currentUser.id, activeAffiliation?.hospitalId);
    } catch {
      showToast('Cancellation failed', 'error');
    } finally {
      setIsCancellingApt(false);
    }
  };

  // Prescription Management
  const handleAddMedicine = () => {
    if (!newMedName.trim()) return;
    setMedicines([...medicines, { name: newMedName, dose: newMedDose, instruction: newMedInstruction, days: newMedDays }]);
    setNewMedName('');
  };

  const handleRemoveMedicine = (idx: number) => {
    setMedicines(medicines.filter((_, i) => i !== idx));
  };

  const handleSavePrescription = async () => {
    if (!activePatient) {
      showToast(language === 'en' ? 'Please call a patient into the chamber first.' : 'অনুগ্রহ করে প্রথমে একজন রোগী চেম্বারে ডাকুন।', 'error');
      return;
    }
    setIsSavingRx(true);
    try {
      const res = await DoctorService.savePrescription({
        appointmentId: activePatient.id,
        patientId: activePatient.id,
        doctorId: currentUser?.id || 'doc-1',
        clinicalNotes,
        diagnosis,
        medicines,
        recommendedTests,
        followupDate: rxFollowupDate,
      });

      if (res.success) {
        showToast(
          language === 'en'
            ? `Prescription saved for ${activePatient.name} (Token #${activePatient.token}).`
            : `টোকেন #${activePatient.token} (${activePatient.name})-এর প্রেসক্রিপশন সংরক্ষিত হয়েছে।`
        );
        // Mark appointment completed
        handleUpdateAptStatus(activePatient.id, 'completed');
      } else {
        showToast(res.error || 'Failed to save prescription', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Prescription save failed', 'error');
    } finally {
      setIsSavingRx(false);
    }
  };

  // Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.id) return;
    setIsSavingProfile(true);
    try {
      const res = await DoctorService.updateDoctorProfile({
        doctorId: currentUser.id,
        fullName: profFullName,
        phone: profPhone,
        bmdcNumber: profBmdcNumber,
        specialization: profSpecialization,
        qualifications: profQualifications,
        experienceYears: profExperience,
        biography: profBiography,
      });
      showToast(res.message);
      // Sync local user profile
      if (typeof window !== 'undefined') {
        const u = JSON.parse(localStorage.getItem('dc_user_profile') || '{}');
        u.fullName = profFullName;
        u.phone = profPhone;
        localStorage.setItem('dc_user_profile', JSON.stringify(u));
        setCurrentUser({ ...currentUser, fullName: profFullName, phone: profPhone });
      }
    } catch {
      showToast('Profile save failed', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Schedule Save
  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSchedule(true);
    setTimeout(() => {
      setIsSavingSchedule(false);
      showToast(
        language === 'en'
          ? 'Chamber schedule and fee settings updated successfully!'
          : 'চেম্বারের সময়সূচি ও ফি সেটিংস সফলভাবে সংরক্ষিত হয়েছে!'
      );
    }, 600);
  };

  // Leave Management
  const handleAddLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveStartDate || !leaveEndDate) return;
    setLeaves([
      ...leaves,
      {
        id: `l-${Date.now()}`,
        startDate: leaveStartDate,
        endDate: leaveEndDate,
        reason: leaveReason || 'Personal Leave / Medical Vacation',
        status: 'ACTIVE',
      },
    ]);
    setIsAddLeaveOpen(false);
    setLeaveStartDate('');
    setLeaveEndDate('');
    setLeaveReason('');
    showToast(
      language === 'en'
        ? 'Leave schedule recorded. Chamber slots blocked automatically.'
        : 'ছুটি সংরক্ষিত হয়েছে। সংশ্লিষ্ট তারিখের স্লট স্বয়ংক্রিয়ভাবে বন্ধ থাকবে।'
    );
  };

  // Overview Statistics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAptsList = appointments.filter((a: any) => (a.appointment_date || a.appointmentDate) === todayStr);
  const totalTodayPatients = todayAptsList.length;
  const completedTodayCount = todayAptsList.filter((a: any) => (a.status || '').toLowerCase() === 'completed').length;
  const checkedInTodayCount = todayAptsList.filter((a: any) => (a.status || '').toLowerCase() === 'checked_in').length;
  const currentFee = activeAffiliation?.consultationFee || 1000;
  const remainingCapacity = Math.max(0, (activeAffiliation?.dailySerialLimit || 30) - totalTodayPatients);
  const revenueTotal = todayAptsList
    .filter((a: any) => (a.status || '').toLowerCase() === 'completed')
    .reduce((sum, a) => sum + (Number(a.consultation_fee || a.consultationFee) || currentFee), 0);

  const isDoctorRole = Boolean(
    currentUser &&
      (currentUser.primaryRole === 'DOCTOR' ||
        (currentUser.roles || []).includes('DOCTOR') ||
        currentUser.primaryRole === 'SUPER_ADMIN' ||
        (currentUser.roles || []).includes('SUPER_ADMIN'))
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Header
        language={language}
        setLanguage={setLanguage}
        activeTab="doctor-portal"
        setActiveTab={() => {}}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenLocation={() => setIsLocationModalOpen(true)}
        selectedLocation={selectedLocation}
        currentUser={currentUser}
        onLogout={async () => {
          await AuthService.signOut();
          setCurrentUser(null);
          setAffiliations([]);
          setActiveAffiliation(null);
        }}
      />

      {/* Toast Notice */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '84px',
            right: '24px',
            zIndex: 1500,
            backgroundColor: toastType === 'error' ? '#FEF2F2' : toastType === 'info' ? '#EFF6FF' : '#ECFDF5',
            border: `1.5px solid ${toastType === 'error' ? '#EF4444' : toastType === 'info' ? '#3B82F6' : '#10B981'}`,
            color: toastType === 'error' ? '#991B1B' : toastType === 'info' ? '#1E40AF' : '#065F46',
            borderRadius: '14px',
            padding: '14px 22px',
            fontSize: '14px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
          }}
          className="animate-slide-down"
        >
          {toastType === 'error' ? (
            <XCircle size={20} color="#EF4444" />
          ) : (
            <CheckCircle2 size={20} color={toastType === 'info' ? '#3B82F6' : '#059669'} />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Calling Ringer Overlay Animation */}
      {isCallingRingerActive && activePatient && (
        <div
          style={{
            position: 'fixed',
            top: '120px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
            color: '#FFFFFF',
            padding: '18px 36px',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(21, 128, 61, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
          }}
          className="animate-slide-down"
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              color: '#15803D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 900,
              boxShadow: '0 0 0 8px rgba(255, 255, 255, 0.25)',
            }}
          >
            {activePatient.token}
          </div>
          <div>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>
              {language === 'en' ? 'Calling Patient into Chamber' : 'চেম্বারে ডাকা হচ্ছে'}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900 }}>{activePatient.name}</div>
          </div>
        </div>
      )}

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* VIEW A: DOCTOR NOT LOGGED IN -> SECURE CENTRAL DOCTOR LOGIN GATE */}
        {!currentUser ? (
          <div style={{ maxWidth: '480px', margin: '48px auto', padding: '0 20px', width: '100%' }}>
            <div
              className="glass-card"
              style={{
                padding: '36px',
                borderRadius: '24px',
                boxShadow: '0 20px 40px -15px rgba(0, 96, 250, 0.15)',
                border: '1px solid rgba(0, 96, 250, 0.15)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '22px',
                    background: 'linear-gradient(135deg, #0060FA 0%, #004ED1 100%)',
                    color: '#FFFFFF',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    boxShadow: '0 8px 20px rgba(0, 96, 250, 0.3)',
                  }}
                >
                  <Stethoscope size={34} />
                </div>
                <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '100px', backgroundColor: 'rgba(0, 96, 250, 0.1)', color: '#0060FA', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                  {language === 'bn' ? 'ডাক্তার ও সেবাদানকারী প্রতিষ্ঠান পোর্টাল' : 'Doctor & Service Provider Portal'}
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#090D14', margin: '0 0 6px 0' }}>
                  {language === 'en' ? 'Clinical Console Access' : 'ক্লিনিক্যাল কনসোল প্রবেশ'}
                </h2>
                <p style={{ fontSize: '13px', color: '#627680', margin: 0, lineHeight: 1.5 }}>
                  {language === 'en'
                    ? 'Official portal for BMDC registered doctors and partner institutions.'
                    : 'বিএমডিসি নিবন্ধিত চিকিৎসক এবং সেবাদানকারী প্রতিষ্ঠানের জন্য সমন্বিত পোর্টাল।'}
                </p>
              </div>

              <ProviderAuthCard
                initialRole="DOCTOR"
                redirectTo="/doctor/portal"
              />
            </div>
          </div>
        ) : !isDoctorRole ? (
          /* VIEW B: USER LOGGED IN BUT NOT DOCTOR ROLE */
          <div style={{ maxWidth: '580px', margin: '48px auto', padding: '0 20px', width: '100%' }}>
            <div
              className="glass-card"
              style={{
                padding: '36px',
                borderRadius: '24px',
                textAlign: 'center',
                border: '1px solid #FCD34D',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  color: '#D97706',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                }}
              >
                <AlertTriangle size={32} />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#090D14', margin: '0 0 8px 0' }}>
                {language === 'en' ? 'Practitioner Account Required' : 'ডাক্তার একাউন্ট প্রয়োজন'}
              </h2>
              <p style={{ fontSize: '13.5px', color: '#627680', margin: '0 0 24px 0', lineHeight: 1.6 }}>
                {language === 'en'
                  ? `You are currently signed in as ${currentUser.fullName} (${currentUser.primaryRole}). Access to the Clinical Doctor Console is strictly restricted to BMDC verified practitioners.`
                  : `আপনি বর্তমানে ${currentUser.fullName} (${currentUser.primaryRole}) হিসেবে লগইন আছেন। এই কনসোলটি কেবল অনুমোদিত ডাক্তারদের জন্য সংরক্ষিত।`}
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {['HOSPITAL_ADMIN', 'DIAGNOSTIC_ADMIN', 'CLINIC_ADMIN', 'HOSPITAL_STAFF', 'DIAGNOSTIC_STAFF'].includes(currentUser.primaryRole) && (
                  <Link
                    href="/hospital/portal"
                    className="btn-primary"
                    style={{ padding: '12px 24px', borderRadius: '12px', fontSize: '13.5px', fontWeight: 700, textDecoration: 'none' }}
                  >
                    {language === 'en' ? 'Go to Hospital Portal' : 'হাসপাতাল পোর্টালে যান'}
                  </Link>
                )}
                <button
                  onClick={async () => {
                    await AuthService.signOut();
                    setCurrentUser(null);
                  }}
                  className="btn-outline"
                  style={{ padding: '12px 24px', borderRadius: '12px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {language === 'en' ? 'Sign In as Doctor' : 'ডাক্তার হিসেবে লগইন করুন'}
                </button>
                <Link
                  href="/"
                  className="btn-outline"
                  style={{ padding: '12px 24px', borderRadius: '12px', fontSize: '13.5px', fontWeight: 700, textDecoration: 'none' }}
                >
                  {language === 'en' ? 'Return Home' : 'হোমে ফিরে যান'}
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* VIEW C: FULL PRODUCTION DOCTOR PORTAL LAYOUT */
          <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 72px)' }}>
            {/* 1. COLLAPSIBLE MODERN SIDEBAR */}
            <aside
              style={{
                width: isSidebarCollapsed ? '78px' : '280px',
                backgroundColor: '#FFFFFF',
                borderRight: '1px solid rgba(226, 232, 240, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'sticky',
                top: 0,
                height: '100vh',
                zIndex: 90,
              }}
              className="hidden lg:flex"
            >
              {/* Sidebar Header */}
              <div
                style={{
                  padding: isSidebarCollapsed ? '20px 12px' : '22px 20px',
                  borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                }}
              >
                {!isSidebarCollapsed ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #0060FA 0%, #004ED1 100%)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                      }}
                    >
                      <Stethoscope size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: '15px', color: '#090D14', letterSpacing: '-0.01em' }}>
                        Diagnostic Care
                      </div>
                      <div style={{ fontSize: '11px', color: '#0060FA', fontWeight: 700 }}>
                        Doctor Clinical Portal
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #0060FA 0%, #004ED1 100%)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Stethoscope size={20} />
                  </div>
                )}

                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: '4px',
                    display: isSidebarCollapsed ? 'none' : 'block',
                  }}
                  title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                >
                  <ChevronRight size={18} style={{ transform: isSidebarCollapsed ? 'none' : 'rotate(180deg)' }} />
                </button>
              </div>

              {/* Sidebar Navigation Items */}
              <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {!isSidebarCollapsed && (
                  <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', padding: '6px 12px', letterSpacing: '0.05em' }}>
                    Clinical Operations
                  </div>
                )}
                {[
                  { id: 'overview', labelEn: 'Overview', labelBn: 'ড্যাশবোর্ড সারসংক্ষেপ', icon: Activity },
                  { id: 'queue', labelEn: "Today's Live Queue", labelBn: 'লাইভ সিরিয়াল ও রিংগার', icon: Users, badge: queue.length > 0 ? String(queue.length) : undefined },
                  { id: 'appointments', labelEn: 'Appointments & Serials', labelBn: 'সিরিয়াল ও অ্যাপয়েন্টমেন্ট', icon: CalendarDays },
                  { id: 'prescriptions', labelEn: 'Digital Rx Prescriptions', labelBn: 'ডিজিটাল প্রেসক্রিপশন', icon: FileText },
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                        padding: '11px 14px',
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: isActive ? 'rgba(0, 96, 250, 0.08)' : 'transparent',
                        color: isActive ? '#0060FA' : '#627680',
                        fontWeight: isActive ? 800 : 600,
                        fontSize: '13.5px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        width: '100%',
                        textAlign: 'left',
                      }}
                      title={item.labelEn}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Icon size={19} color={isActive ? '#0060FA' : '#64748B'} />
                        {!isSidebarCollapsed && <span>{language === 'en' ? item.labelEn : item.labelBn}</span>}
                      </div>
                      {!isSidebarCollapsed && item.badge && (
                        <span style={{ backgroundColor: '#0060FA', color: '#FFFFFF', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 800 }}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                {!isSidebarCollapsed && (
                  <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', padding: '16px 12px 6px', letterSpacing: '0.05em' }}>
                    Institutional Management
                  </div>
                )}
                {[
                  { id: 'affiliations', labelEn: 'Hospital Affiliations', labelBn: 'হাসপাতাল এফিলিয়েশন', icon: Building2, badge: pendingInvitations.length > 0 ? `${pendingInvitations.length} New` : undefined },
                  { id: 'schedule', labelEn: 'Schedule & Visiting Hours', labelBn: 'চেম্বারের সময়সূচি', icon: Clock },
                  { id: 'leaves', labelEn: 'Leaves & Holidays', labelBn: 'ছুটি ও বন্ধ ব্যবস্থাপনা', icon: Calendar },
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                        padding: '11px 14px',
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: isActive ? 'rgba(0, 96, 250, 0.08)' : 'transparent',
                        color: isActive ? '#0060FA' : '#627680',
                        fontWeight: isActive ? 800 : 600,
                        fontSize: '13.5px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        width: '100%',
                        textAlign: 'left',
                      }}
                      title={item.labelEn}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Icon size={19} color={isActive ? '#0060FA' : '#64748B'} />
                        {!isSidebarCollapsed && <span>{language === 'en' ? item.labelEn : item.labelBn}</span>}
                      </div>
                      {!isSidebarCollapsed && item.badge && (
                        <span style={{ backgroundColor: '#D97706', color: '#FFFFFF', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 800 }}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                {!isSidebarCollapsed && (
                  <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', padding: '16px 12px 6px', letterSpacing: '0.05em' }}>
                    Doctor Identity & Security
                  </div>
                )}
                {[
                  { id: 'profile', labelEn: 'Professional Profile', labelBn: 'প্রফেশনাল প্রোফাইল', icon: UserCheck },
                  { id: 'qr_code', labelEn: 'My QR Code & Prints', labelBn: 'আমার কিউআর কোড ও প্রিন্ট', icon: QrCode },
                  { id: 'marketplace', labelEn: 'Marketplace Public Card', labelBn: 'পাবলিক প্রোফাইল প্রিভিউ', icon: ExternalLink },
                  { id: 'security', labelEn: 'Account & Password', labelBn: 'নিরাপত্তা ও পাসওয়ার্ড', icon: Lock },
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                        padding: '11px 14px',
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: isActive ? 'rgba(0, 96, 250, 0.08)' : 'transparent',
                        color: isActive ? '#0060FA' : '#627680',
                        fontWeight: isActive ? 800 : 600,
                        fontSize: '13.5px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        width: '100%',
                        textAlign: 'left',
                      }}
                      title={item.labelEn}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Icon size={19} color={isActive ? '#0060FA' : '#64748B'} />
                        {!isSidebarCollapsed && <span>{language === 'en' ? item.labelEn : item.labelBn}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Sidebar Footer */}
              {!isSidebarCollapsed && (
                <div style={{ padding: '16px', borderTop: '1px solid rgba(226, 232, 240, 0.8)', fontSize: '12px', color: '#627680' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#090D14', marginBottom: '2px' }}>
                    <Phone size={14} color="#0060FA" />
                    <span>Support: 01886748564</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>Your Healthcare Marketplace</div>
                </div>
              )}
            </aside>

            {/* 2. MAIN CONTENT AREA */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              {/* TOP NAVIGATION BAR */}
              <div
                style={{
                  height: '70px',
                  backgroundColor: '#FFFFFF',
                  borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 24px',
                  position: 'sticky',
                  top: 0,
                  zIndex: 80,
                }}
              >
                {/* Left: Mobile Toggle & Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <button
                    onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                    className="lg:hidden"
                    style={{ background: 'none', border: 'none', color: '#090D14', cursor: 'pointer', padding: '6px' }}
                  >
                    <Menu size={22} />
                  </button>

                  <div>
                    <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                      {activeTab === 'overview' && (language === 'en' ? 'Clinical Overview' : 'ক্লিনিক্যাল সারসংক্ষেপ')}
                      {activeTab === 'queue' && (language === 'en' ? "Today's Patient Queue & Caller" : 'আজকের লাইভ সিরিয়াল ও রিংগার')}
                      {activeTab === 'appointments' && (language === 'en' ? 'Appointment & Serial Records' : 'অ্যাপয়েন্টমেন্ট ও সিরিয়াল তালিকা')}
                      {activeTab === 'prescriptions' && (language === 'en' ? 'Digital Rx Prescription Writer' : 'ডিজিটাল প্রেসক্রিপশন তৈরি')}
                      {activeTab === 'affiliations' && (language === 'en' ? 'Hospital Affiliations & Invitations' : 'হাসপাতাল এফিলিয়েশন ও আমন্ত্রণ')}
                      {activeTab === 'schedule' && (language === 'en' ? 'Visiting Hours & Schedules' : 'চেম্বারের সময়সূচি')}
                      {activeTab === 'leaves' && (language === 'en' ? 'Leave & Vacation Schedule' : 'ছুটি ও বন্ধ ব্যবস্থাপনা')}
                      {activeTab === 'profile' && (language === 'en' ? 'Central Doctor Profile' : 'সেন্ট্রাল ডাক্তার প্রোফাইল')}
                      {activeTab === 'qr_code' && (language === 'en' ? 'Doctor QR Code & Print Studio' : 'ডাক্তার কিউআর কোড ও প্রিন্ট স্টুডিও')}
                      {activeTab === 'marketplace' && (language === 'en' ? 'Public Marketplace Preview' : 'মার্কেটপ্লেস পাবলিক প্রিভিউ')}
                      {activeTab === 'security' && (language === 'en' ? 'Account Security & Password' : 'নিরাপত্তা ও পাসওয়ার্ড')}
                    </h2>
                  </div>
                </div>

                {/* Right: Hospital Selector, Notifications, Profile */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {/* Multi-Institution Selector Dropdown */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setIsAffiliationDropdownOpen(!isAffiliationDropdownOpen)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: '#F1F5F9',
                        border: '1px solid #CBD5E1',
                        color: '#090D14',
                        padding: '8px 14px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 700,
                      }}
                    >
                      <Building2 size={16} color="#0060FA" />
                      <div style={{ textAlign: 'left', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {activeAffiliation ? activeAffiliation.hospitalName : (language === 'en' ? 'Select Hospital' : 'প্রতিষ্ঠান নির্বাচন')}
                      </div>
                      <ChevronDown size={14} color="#64748B" />
                    </button>

                    {isAffiliationDropdownOpen && (
                      <div
                        className="glass-card animate-slide-down"
                        style={{
                          position: 'absolute',
                          top: '110%',
                          right: 0,
                          zIndex: 110,
                          minWidth: '320px',
                          padding: '10px',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                          background: '#FFFFFF',
                          color: '#090D14',
                          borderRadius: '16px',
                          border: '1px solid #CBD5E1',
                        }}
                      >
                        <div style={{ padding: '8px 10px', fontSize: '11px', fontWeight: 800, color: '#627680', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
                          <span>{language === 'en' ? 'Approved Affiliations' : 'অনুমোদিত প্রতিষ্ঠানসমূহ'}</span>
                          <span>{affiliations.length}</span>
                        </div>
                        {affiliations.length === 0 ? (
                          <div style={{ padding: '16px', fontSize: '12.5px', color: '#627680', textAlign: 'center' }}>
                            {language === 'en' ? 'No hospital affiliations linked yet.' : 'কোনো হাসপাতাল সংযুক্ত নেই।'}
                          </div>
                        ) : (
                          affiliations.map((a: any) => {
                            const isSelected = activeAffiliation?.id === a.id;
                            return (
                              <div
                                key={a.id}
                                onClick={() => handleSwitchAffiliation(a)}
                                style={{
                                  padding: '10px 12px',
                                  borderRadius: '10px',
                                  cursor: 'pointer',
                                  backgroundColor: isSelected ? 'rgba(0, 96, 250, 0.08)' : 'transparent',
                                  border: isSelected ? '1px solid rgba(0, 96, 250, 0.2)' : '1px solid transparent',
                                  marginTop: '6px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <div>
                                  <div style={{ fontWeight: 800, fontSize: '13px', color: '#090D14' }}>{a.hospitalName}</div>
                                  <div style={{ fontSize: '11.5px', color: '#627680' }}>
                                    {a.branchName} • {a.chamberRoom}
                                  </div>
                                  <div style={{ fontSize: '11px', color: '#0060FA', fontWeight: 700, marginTop: '2px' }}>
                                    Fee: ৳{a.consultationFee}
                                  </div>
                                </div>
                                {isSelected && <Check size={16} color="#0060FA" />}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>

                  {/* Notifications Center Bell */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                      style={{
                        background: '#F1F5F9',
                        border: '1px solid #CBD5E1',
                        borderRadius: '12px',
                        padding: '9px',
                        cursor: 'pointer',
                        color: '#090D14',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Bell size={18} />
                      {pendingInvitations.length > 0 && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            backgroundColor: '#EF4444',
                            color: '#FFFFFF',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            fontSize: '10px',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {pendingInvitations.length}
                        </span>
                      )}
                    </button>

                    {isNotificationsOpen && (
                      <div
                        className="glass-card animate-slide-down"
                        style={{
                          position: 'absolute',
                          top: '110%',
                          right: 0,
                          zIndex: 110,
                          width: '340px',
                          padding: '14px',
                          background: '#FFFFFF',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                          borderRadius: '16px',
                          border: '1px solid #CBD5E1',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #E2E8F0' }}>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: '#090D14' }}>
                            {language === 'en' ? 'Notifications' : 'বিজ্ঞপ্তি'}
                          </span>
                          <span style={{ fontSize: '11px', color: '#0060FA', fontWeight: 700 }}>
                            {pendingInvitations.length} {language === 'en' ? 'Pending' : 'অপেক্ষমান'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                          {pendingInvitations.length === 0 && notifications.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', fontSize: '12.5px', color: '#94A3B8' }}>
                              {language === 'en' ? 'No new notifications.' : 'কোনো নতুন বিজ্ঞপ্তি নেই।'}
                            </div>
                          ) : (
                            <>
                              {pendingInvitations.map((inv) => (
                                <div
                                  key={inv.id}
                                  onClick={() => {
                                    setIsNotificationsOpen(false);
                                    setActiveTab('affiliations');
                                  }}
                                  style={{
                                    padding: '10px',
                                    borderRadius: '10px',
                                    backgroundColor: '#FFFBEB',
                                    border: '1px solid #FCD34D',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#92400E' }}>
                                    {language === 'en' ? 'Hospital Invitation' : 'হাসপাতাল আমন্ত্রণ'}
                                  </div>
                                  <div style={{ fontSize: '12.5px', color: '#090D14', marginTop: '2px', fontWeight: 600 }}>
                                    {inv.hospitalName}
                                  </div>
                                  <div style={{ fontSize: '11px', color: '#B45309', marginTop: '2px' }}>
                                    Fee: ৳{inv.consultationFee || 1000} • Click to review
                                  </div>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Doctor Profile Tag */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 96, 250, 0.12)',
                        color: '#0060FA',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '14px',
                      }}
                    >
                      {currentUser?.fullName?.charAt(0) || 'D'}
                    </div>
                    <div className="hidden md:block" style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 800, fontSize: '13px', color: '#090D14' }}>
                        {currentUser?.fullName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
                        BMDC VERIFIED
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BODY CONTAINER */}
              <div style={{ padding: '24px 28px', flex: 1 }}>
                {/* Pending Invitations Alert Banner */}
                {pendingInvitations.length > 0 && activeTab !== 'affiliations' && (
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                      border: '1.5px solid #F59E0B',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      marginBottom: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '14px',
                      boxShadow: '0 4px 16px rgba(245, 158, 11, 0.15)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Building2 size={24} color="#D97706" />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '15px', color: '#92400E' }}>
                          {language === 'en'
                            ? `You have ${pendingInvitations.length} pending hospital affiliation invitation(s)`
                            : `আপনার ${pendingInvitations.length}টি অপেক্ষমান হাসপাতাল এফিলিয়েশন আমন্ত্রণ রয়েছে`}
                        </div>
                        <div style={{ fontSize: '12.5px', color: '#78350F' }}>
                          {language === 'en'
                            ? 'Review and accept invitations to activate your clinical chambers across institutions.'
                            : 'আমন্ত্রণগুলো গ্রহণ করে বিভিন্ন হাসপাতালে আপনার চেম্বার সক্রিয় করুন।'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('affiliations')}
                      className="btn-primary"
                      style={{ padding: '8px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      {language === 'en' ? 'Review Invitations' : 'আমন্ত্রণ দেখুন'}
                    </button>
                  </div>
                )}

                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                  <div>
                    {/* 4 Stat Metric Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                      <div className="glass-card" style={{ padding: '22px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#627680', textTransform: 'uppercase' }}>
                            {language === 'en' ? "Today's Appointments" : 'আজকের মোট সিরিয়াল'}
                          </span>
                          <CalendarDays size={20} color="#0060FA" />
                        </div>
                        <div style={{ fontSize: '28px', fontWeight: 900, color: '#090D14', marginTop: '6px' }}>
                          {totalTodayPatients}
                        </div>
                        <div style={{ fontSize: '12px', color: '#059669', fontWeight: 700, marginTop: '4px' }}>
                          {remainingCapacity} {language === 'en' ? 'slots remaining today' : 'স্লট অবশিষ্ট আছে'}
                        </div>
                      </div>

                      <div className="glass-card" style={{ padding: '22px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#627680', textTransform: 'uppercase' }}>
                            {language === 'en' ? 'Checked In / Waiting' : 'অপেক্ষমান রোগী'}
                          </span>
                          <Users size={20} color="#D97706" />
                        </div>
                        <div style={{ fontSize: '28px', fontWeight: 900, color: '#D97706', marginTop: '6px' }}>
                          {checkedInTodayCount}
                        </div>
                        <div style={{ fontSize: '12px', color: '#627680', marginTop: '4px' }}>
                          {queue.length} {language === 'en' ? 'in current queue' : 'বর্তমান সিরিয়ালে'}
                        </div>
                      </div>

                      <div className="glass-card" style={{ padding: '22px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#627680', textTransform: 'uppercase' }}>
                            {language === 'en' ? 'Completed Consultations' : 'সম্পন্ন কনসালটেশন'}
                          </span>
                          <CheckCircle2 size={20} color="#15803D" />
                        </div>
                        <div style={{ fontSize: '28px', fontWeight: 900, color: '#15803D', marginTop: '6px' }}>
                          {completedTodayCount}
                        </div>
                        <div style={{ fontSize: '12px', color: '#15803D', fontWeight: 700, marginTop: '4px' }}>
                          ✓ {language === 'en' ? 'Prescriptions issued' : 'প্রেসক্রিপশন সংরক্ষিত'}
                        </div>
                      </div>

                      <div className="glass-card" style={{ padding: '22px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#627680', textTransform: 'uppercase' }}>
                            {language === 'en' ? "Today's Consultation Fee" : 'আজকের ফি আয়'}
                          </span>
                          <CreditCard size={20} color="#0060FA" />
                        </div>
                        <div style={{ fontSize: '28px', fontWeight: 900, color: '#090D14', marginTop: '6px' }}>
                          {formatCurrency(revenueTotal)}
                        </div>
                        <div style={{ fontSize: '12px', color: '#627680', marginTop: '4px' }}>
                          Fee per patient: ৳{currentFee}
                        </div>
                      </div>
                    </div>

                    {/* Next Scheduled Consultation Spotlight */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
                      <div className="glass-card" style={{ padding: '26px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                            {language === 'en' ? 'Active Chamber Consultation' : 'বর্তমান চেম্বার কনসালটেশন'}
                          </h3>
                          <span style={{ backgroundColor: 'rgba(0, 96, 250, 0.1)', color: '#0060FA', padding: '3px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 800 }}>
                            {activeAffiliation?.hospitalName || 'Popular Diagnostic'}
                          </span>
                        </div>

                        {activePatient ? (
                          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '18px', border: '1px solid #E2E8F0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <span style={{ backgroundColor: '#0060FA', color: '#FFFFFF', padding: '4px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 900 }}>
                                Token #{activePatient.token}
                              </span>
                              <span style={{ fontSize: '12px', color: '#15803D', fontWeight: 700 }}>
                                IN ROOM
                              </span>
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: 900, color: '#090D14' }}>
                              {activePatient.name}
                            </div>
                            <div style={{ fontSize: '13px', color: '#627680', marginTop: '4px' }}>
                              {activePatient.phone} • Age: {activePatient.age} • Gender: {activePatient.gender}
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                              <button
                                onClick={() => setActiveTab('prescriptions')}
                                className="btn-primary"
                                style={{ flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                              >
                                {language === 'en' ? 'Write Prescription' : 'প্রেসক্রিপশন লিখুন'}
                              </button>
                              <button
                                onClick={() => handleUpdateAptStatus(activePatient.id, 'completed')}
                                className="btn-outline"
                                style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                              >
                                {language === 'en' ? 'Mark Done' : 'সম্পন্ন'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '32px 16px', color: '#94A3B8' }}>
                            <Users size={36} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                            <p style={{ fontWeight: 600, fontSize: '13.5px', margin: '0 0 16px 0' }}>
                              {language === 'en' ? 'No patient currently inside the consultation chamber.' : 'বর্তমানে কোনো রোগী চেম্বারে নেই।'}
                            </p>
                            <button
                              onClick={handleCallNext}
                              className="btn-primary"
                              style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                            >
                              {language === 'en' ? 'Call Next Patient' : 'পরবর্তী রোগী ডাকুন'}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Quick Actions & Today's Schedule */}
                      <div className="glass-card" style={{ padding: '26px' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#090D14', margin: '0 0 16px 0' }}>
                          {language === 'en' ? 'Chamber Operational Info' : 'চেম্বার তথ্য ও সেটিংস'}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                          <div className="glass-inset" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#627680' }}>Active Facility:</span>
                            <strong style={{ color: '#090D14' }}>{activeAffiliation?.hospitalName || 'Central Care'}</strong>
                          </div>
                          <div className="glass-inset" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#627680' }}>Branch & Chamber:</span>
                            <strong style={{ color: '#090D14' }}>{activeAffiliation?.branchName} • {activeAffiliation?.chamberRoom}</strong>
                          </div>
                          <div className="glass-inset" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#627680' }}>Visiting Hours:</span>
                            <strong style={{ color: '#0060FA' }}>{activeAffiliation?.visitingHours}</strong>
                          </div>
                          <div className="glass-inset" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#627680' }}>Consultation Fee:</span>
                            <strong style={{ color: '#15803D' }}>{formatCurrency(currentFee)}</strong>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
                          <button
                            onClick={() => setActiveTab('queue')}
                            className="btn-outline"
                            style={{ flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            {language === 'en' ? 'View Live Queue' : 'সিরিয়াল দেখুন'}
                          </button>
                          <button
                            onClick={() => setActiveTab('appointments')}
                            className="btn-primary"
                            style={{ flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            {language === 'en' ? 'All Serials' : 'সকল সিরিয়াল'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: LIVE QUEUE & CALLER */}
                {activeTab === 'queue' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
                    {/* Queue List Table */}
                    <div className="glass-card" style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                        <div>
                          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                            {language === 'en' ? "Today's Patient Queue" : 'আজকের সিরিয়াল তালিকা'}
                          </h3>
                          <span style={{ fontSize: '12px', color: '#627680' }}>
                            {activeAffiliation?.hospitalName || 'Central Chamber Desk'}
                          </span>
                        </div>

                        <button
                          onClick={handleCallNext}
                          style={{
                            background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
                            color: '#FFFFFF',
                            padding: '10px 18px',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: 800,
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)',
                          }}
                        >
                          <span>{language === 'en' ? 'Call Next' : 'পরবর্তী রোগী'}</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {queue.length === 0 ? (
                          <div style={{ padding: '36px 16px', textAlign: 'center', color: '#627680', fontSize: '13.5px' }}>
                            {language === 'en' ? 'No patients in queue for today yet.' : 'আজকের সিরিয়ালে কোনো রোগী অপেক্ষমান নেই।'}
                          </div>
                        ) : (
                          queue.map((p) => {
                            const isCurrent = activePatient?.id === p.id;
                            const isManual = p.bookingSource === 'manual' || p.bookingSource === 'phone_call' || p.bookingSource === 'walk_in';
                            return (
                              <div
                                key={p.id}
                                style={{
                                  padding: '14px 16px',
                                  borderRadius: '14px',
                                  border: isCurrent ? '2px solid #0060FA' : '1px solid rgba(226, 232, 240, 0.8)',
                                  background: isCurrent ? 'linear-gradient(135deg, rgba(235, 243, 255, 0.5) 0%, rgba(255, 255, 255, 0.9) 100%)' : '#FFFFFF',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  boxShadow: isCurrent ? '0 6px 16px rgba(0, 96, 250, 0.12)' : 'none',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                  <span
                                    style={{
                                      width: '38px',
                                      height: '38px',
                                      borderRadius: '10px',
                                      backgroundColor: isCurrent ? '#0060FA' : 'rgba(235, 243, 255, 0.6)',
                                      color: isCurrent ? '#FFFFFF' : '#0060FA',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: 800,
                                      fontSize: '15px',
                                    }}
                                  >
                                    {p.token}
                                  </span>
                                  <div>
                                    <div style={{ fontWeight: 800, fontSize: '14px', color: '#090D14', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span>{p.name}</span>
                                      {isManual && (
                                        <span style={{ fontSize: '10px', backgroundColor: '#F1F5F9', color: '#475569', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                          Reception
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#627680', marginTop: '2px' }}>
                                      {p.phone} • Age: {p.age} • {p.gender}
                                    </div>
                                  </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span
                                    style={{
                                      padding: '4px 10px',
                                      borderRadius: '8px',
                                      fontSize: '11px',
                                      fontWeight: 800,
                                      backgroundColor:
                                        p.status === 'IN_ROOM' ? 'rgba(0, 96, 250, 0.1)' :
                                        p.status === 'COMPLETED' ? 'rgba(21, 128, 61, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                      color:
                                        p.status === 'IN_ROOM' ? '#0060FA' :
                                        p.status === 'COMPLETED' ? '#15803D' : '#B45309',
                                    }}
                                  >
                                    {p.status}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* In-Room Patient Consultation Box */}
                    <div className="glass-card" style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                          {language === 'en' ? 'Active In-Chamber Consultation' : 'বর্তমান রোগী কনসালটেশন'}
                        </h3>
                        {activePatient && (
                          <span style={{ backgroundColor: '#0060FA', color: '#FFFFFF', padding: '3px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 800 }}>
                            Token #{activePatient.token}
                          </span>
                        )}
                      </div>

                      {activePatient ? (
                        <div>
                          <div className="glass-inset" style={{ padding: '16px', marginBottom: '18px' }}>
                            <div style={{ fontSize: '16px', fontWeight: 800, color: '#090D14' }}>
                              {activePatient.name}
                            </div>
                            <div style={{ fontSize: '13px', color: '#627680', marginTop: '2px' }}>
                              Age: {activePatient.age} • Gender: {activePatient.gender} • Phone: {activePatient.phone}
                            </div>
                          </div>

                          <div style={{ marginBottom: '14px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                              {language === 'en' ? 'Clinical Diagnosis' : 'রোগের প্রাথমিক নির্ণয়'}
                            </label>
                            <input
                              type="text"
                              value={diagnosis}
                              onChange={(e) => setDiagnosis(e.target.value)}
                              placeholder="e.g. Essential Hypertension Grade II, Type 2 Diabetes"
                              className="glass-input"
                              style={{ width: '100%', fontSize: '13.5px' }}
                            />
                          </div>

                          <div style={{ marginBottom: '18px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                              {language === 'en' ? 'Clinical Notes & Advice' : 'ডাক্তারের পরামর্শ ও পর্যবেক্ষণ'}
                            </label>
                            <textarea
                              rows={3}
                              value={clinicalNotes}
                              onChange={(e) => setClinicalNotes(e.target.value)}
                              placeholder="e.g. Low sodium diet, 30 min daily brisk walking"
                              className="glass-input"
                              style={{ width: '100%', fontSize: '13.5px' }}
                            />
                          </div>

                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              onClick={() => setActiveTab('prescriptions')}
                              className="btn-primary"
                              style={{ flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                            >
                              {language === 'en' ? 'Open Rx Writer' : 'প্রেসক্রিপশন লিখুন'}
                            </button>
                            <button
                              onClick={() => handleUpdateAptStatus(activePatient.id, 'completed')}
                              className="btn-outline"
                              style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                            >
                              {language === 'en' ? 'Mark Completed' : 'সম্পন্ন করুন'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94A3B8' }}>
                          <Users size={34} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                          <p style={{ fontWeight: 600, fontSize: '14px', margin: '0 0 16px 0' }}>
                            {language === 'en' ? 'No patient currently inside the chamber. Click "Call Next" to start.' : 'বর্তমানে কোনো রোগী চেম্বারে নেই। "পরবর্তী রোগী" চাপুন।'}
                          </p>
                          <button
                            onClick={handleCallNext}
                            className="btn-primary"
                            style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            {language === 'en' ? 'Call Next Patient' : 'পরবর্তী রোগী ডাকুন'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: APPOINTMENTS & SERIALS DESK */}
                {activeTab === 'appointments' && (
                  <div className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                          {language === 'en' ? 'Appointment & Serial Records' : 'অ্যাপয়েন্টমেন্ট ও সিরিয়াল তালিকা'}
                        </h3>
                        <p style={{ fontSize: '12.5px', color: '#627680', margin: '2px 0 0 0' }}>
                          {language === 'en'
                            ? 'All online patient bookings and manual hospital receptionist serials in one unified place.'
                            : 'অনলাইন রোগী বুকিং এবং হাসপাতাল রিসেপশনের সকল সিরিয়াল এক প্ল্যাটফর্মে।'}
                        </p>
                      </div>

                      {/* Search & Source Filter */}
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            value={aptSearchQuery}
                            onChange={(e) => setAptSearchQuery(e.target.value)}
                            placeholder={language === 'en' ? 'Search patient, phone, serial...' : 'রোগী, ফোন বা সিরিয়াল খুঁজুন...'}
                            className="glass-input"
                            style={{ fontSize: '13px', paddingLeft: '34px', width: '220px' }}
                          />
                          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                        </div>

                        <select
                          value={aptSourceFilter}
                          onChange={(e: any) => setAptSourceFilter(e.target.value)}
                          className="glass-input"
                          style={{ fontSize: '13px', padding: '8px 12px' }}
                        >
                          <option value="ALL">All Sources (সকল বুকিং)</option>
                          <option value="online">Online Marketplace (অনলাইন)</option>
                          <option value="manual">Hospital Reception Desk (রিসেপশন)</option>
                        </select>
                      </div>
                    </div>

                    {/* 7 Sub-Filter Tabs */}
                    <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '18px', overflowX: 'auto' }}>
                      {[
                        { id: 'TODAY', labelEn: "Today's Serials", labelBn: 'আজকের সিরিয়াল' },
                        { id: 'UPCOMING', labelEn: 'Upcoming Days', labelBn: 'আসন্ন দিনসমূহ' },
                        { id: 'CHECKED_IN', labelEn: 'Checked In', labelBn: 'উপস্থিত রোগী' },
                        { id: 'PENDING', labelEn: 'Pending Requests', labelBn: 'অপেক্ষমান অনুরোধ' },
                        { id: 'COMPLETED', labelEn: 'Completed', labelBn: 'সম্পন্ন কনসালটেশন' },
                        { id: 'CANCELLED', labelEn: 'Cancelled / Rejected', labelBn: 'বাতিলকৃত' },
                        { id: 'ALL', labelEn: 'Full History', labelBn: 'সকল রেকর্ড' },
                      ].map((sub) => {
                        const isSubActive = aptSubFilter === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => setAptSubFilter(sub.id as any)}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '8px',
                              border: isSubActive ? '1px solid #0060FA' : '1px solid #E2E8F0',
                              backgroundColor: isSubActive ? 'rgba(0, 96, 250, 0.08)' : '#FFFFFF',
                              color: isSubActive ? '#0060FA' : '#627680',
                              fontWeight: 700,
                              fontSize: '12.5px',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {language === 'en' ? sub.labelEn : sub.labelBn}
                          </button>
                        );
                      })}
                    </div>

                    {/* Appointments Table */}
                    <div style={{ border: '1px solid #E2E8F0', borderRadius: '14px', overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                          <tr>
                            <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: '#090D14' }}>Token / Code</th>
                            <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: '#090D14' }}>Patient Details</th>
                            <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: '#090D14' }}>Date & Time</th>
                            <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: '#090D14' }}>Source</th>
                            <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: '#090D14' }}>Status</th>
                            <th style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#090D14' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAppointments.length === 0 ? (
                            <tr>
                              <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#94A3B8' }}>
                                {language === 'en' ? 'No appointments match the selected criteria.' : 'নির্বাচিত ফিল্টারে কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি।'}
                              </td>
                            </tr>
                          ) : (
                            filteredAppointments.map((apt: any) => {
                              const serialNum = apt.serial_number || apt.serialNumber || apt.token_number || '-';
                              const code = apt.booking_code || apt.bookingCode || `#${apt.id?.slice(0, 6)}`;
                              const pName = apt.patient_name || apt.patientName || 'Patient';
                              const pPhone = apt.patient_phone || apt.patientPhone || '';
                              const date = apt.appointment_date || apt.appointmentDate;
                              const time = apt.start_time || apt.startTime || '05:00 PM';
                              const status = (apt.status || 'confirmed').toLowerCase();
                              const source = (apt.booking_source || apt.bookingSource || 'online').toLowerCase();
                              const isManual = source === 'manual' || source === 'phone_call' || source === 'walk_in';

                              return (
                                <tr key={apt.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                  <td style={{ padding: '12px 14px' }}>
                                    <div style={{ fontWeight: 800, color: '#0060FA', fontSize: '13.5px' }}>
                                      Token #{serialNum}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>{code}</div>
                                  </td>
                                  <td style={{ padding: '12px 14px' }}>
                                    <div style={{ fontWeight: 700, color: '#090D14' }}>{pName}</div>
                                    <div style={{ fontSize: '11.5px', color: '#627680' }}>{pPhone}</div>
                                  </td>
                                  <td style={{ padding: '12px 14px' }}>
                                    <div style={{ fontWeight: 600, color: '#090D14' }}>{date}</div>
                                    <div style={{ fontSize: '11.5px', color: '#627680' }}>{time}</div>
                                  </td>
                                  <td style={{ padding: '12px 14px' }}>
                                    <span
                                      style={{
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        padding: '3px 8px',
                                        borderRadius: '6px',
                                        backgroundColor: isManual ? '#EFF6FF' : '#F0FDF4',
                                        color: isManual ? '#1D4ED8' : '#15803D',
                                      }}
                                    >
                                      {isManual ? 'Reception Desk' : 'Online Booking'}
                                    </span>
                                  </td>
                                  <td style={{ padding: '12px 14px' }}>
                                    <span
                                      style={{
                                        fontSize: '11px',
                                        fontWeight: 800,
                                        padding: '3px 8px',
                                        borderRadius: '6px',
                                        backgroundColor:
                                          status === 'completed' ? '#DCFCE7' :
                                          status === 'checked_in' ? '#DBEAFE' :
                                          status === 'cancelled' || status === 'rejected' ? '#FEE2E2' : '#FEF3C7',
                                        color:
                                          status === 'completed' ? '#15803D' :
                                          status === 'checked_in' ? '#1D4ED8' :
                                          status === 'cancelled' || status === 'rejected' ? '#B91C1C' : '#B45309',
                                      }}
                                    >
                                      {status.toUpperCase()}
                                    </span>
                                  </td>
                                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                      {status === 'confirmed' && (
                                        <button
                                          onClick={() => handleUpdateAptStatus(apt.id, 'checked_in')}
                                          style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700, background: '#DBEAFE', color: '#1D4ED8', border: 'none', cursor: 'pointer' }}
                                        >
                                          Check In
                                        </button>
                                      )}
                                      {status === 'checked_in' && (
                                        <button
                                          onClick={() => handleUpdateAptStatus(apt.id, 'in_progress')}
                                          style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700, background: '#DCFCE7', color: '#15803D', border: 'none', cursor: 'pointer' }}
                                        >
                                          Call In
                                        </button>
                                      )}
                                      {status !== 'completed' && status !== 'cancelled' && (
                                        <button
                                          onClick={() => {
                                            setCancelModalApt(apt);
                                            setCancelReason('');
                                          }}
                                          style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700, background: '#FEE2E2', color: '#B91C1C', border: 'none', cursor: 'pointer' }}
                                        >
                                          Cancel
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 4: DIGITAL PRESCRIPTIONS */}
                {activeTab === 'prescriptions' && (
                  <div className="glass-card" style={{ padding: '28px', maxWidth: '820px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                        {language === 'en' ? 'Digital Rx Prescription Writer' : 'ডিজিটাল প্রেসক্রিপশন তৈরি'}
                      </h3>
                      {activePatient && (
                        <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '3px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 800 }}>
                          For: {activePatient.name} (Token #{activePatient.token})
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                            {language === 'en' ? 'Clinical Diagnosis' : 'রোগের নির্ণয়'} *
                          </label>
                          <input
                            type="text"
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            placeholder="e.g. Essential Hypertension Grade II"
                            className="glass-input"
                            style={{ width: '100%', fontSize: '13px' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                            {language === 'en' ? 'Follow-Up Date' : 'পরবর্তী সাক্ষাতের তারিখ'}
                          </label>
                          <input
                            type="date"
                            value={rxFollowupDate}
                            onChange={(e) => setRxFollowupDate(e.target.value)}
                            className="glass-input"
                            style={{ width: '100%', fontSize: '13px' }}
                          />
                        </div>
                      </div>

                      {/* Medicine List Builder */}
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '8px' }}>
                          {language === 'en' ? 'Prescribed Medicines' : 'ঔষধের তালিকা'}
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '10px' }}>
                          <input
                            type="text"
                            value={newMedName}
                            onChange={(e) => setNewMedName(e.target.value)}
                            placeholder="Medicine Name (Tab. Napa 500mg)"
                            className="glass-input"
                            style={{ fontSize: '13px' }}
                          />
                          <input
                            type="text"
                            value={newMedDose}
                            onChange={(e) => setNewMedDose(e.target.value)}
                            placeholder="Dose (1+0+1)"
                            className="glass-input"
                            style={{ fontSize: '13px' }}
                          />
                          <input
                            type="text"
                            value={newMedInstruction}
                            onChange={(e) => setNewMedInstruction(e.target.value)}
                            placeholder="Instructions (খাবারের পর)"
                            className="glass-input"
                            style={{ fontSize: '13px' }}
                          />
                          <button
                            type="button"
                            onClick={handleAddMedicine}
                            className="btn-primary"
                            style={{ padding: '8px 16px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                          >
                            + Add Drug
                          </button>
                        </div>

                        <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                              <tr>
                                <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700 }}>Medicine</th>
                                <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700 }}>Dosage</th>
                                <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700 }}>Instruction</th>
                                <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700 }}>Days</th>
                                <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {medicines.map((m, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                  <td style={{ padding: '8px 12px', fontWeight: 700 }}>{m.name}</td>
                                  <td style={{ padding: '8px 12px', color: '#0060FA', fontWeight: 700 }}>{m.dose}</td>
                                  <td style={{ padding: '8px 12px', color: '#627680' }}>{m.instruction}</td>
                                  <td style={{ padding: '8px 12px', color: '#627680' }}>{m.days} days</td>
                                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveMedicine(idx)}
                                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}
                                    >
                                      ✕
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                          {language === 'en' ? 'Recommended Diagnostic Lab Tests' : 'প্রস্তাবিত ল্যাব টেস্ট'}
                        </label>
                        <input
                          type="text"
                          value={recommendedTests}
                          onChange={(e) => setRecommendedTests(e.target.value)}
                          className="glass-input"
                          style={{ width: '100%', fontSize: '13px' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                          {language === 'en' ? 'Dietary & Lifestyle Advice' : 'ডায়েট ও জীবনযাপন পরামর্শ'}
                        </label>
                        <textarea
                          rows={2}
                          value={clinicalNotes}
                          onChange={(e) => setClinicalNotes(e.target.value)}
                          placeholder="e.g. Low sodium diet, 30 min daily walking"
                          className="glass-input"
                          style={{ width: '100%', fontSize: '13px' }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="btn-outline"
                          style={{ padding: '12px 20px', borderRadius: '12px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          <Printer size={16} />
                          <span>{language === 'en' ? 'Print Rx' : 'প্রিন্ট প্রেসক্রিপশন'}</span>
                        </button>

                        <button
                          type="button"
                          disabled={isSavingRx}
                          onClick={handleSavePrescription}
                          className="btn-primary"
                          style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: 800, cursor: isSavingRx ? 'not-allowed' : 'pointer' }}
                        >
                          {isSavingRx ? 'Saving Rx...' : (language === 'en' ? 'Save Prescription & Complete' : 'প্রেসক্রিপশন সংরক্ষণ ও সম্পন্ন')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: HOSPITAL AFFILIATIONS */}
                {activeTab === 'affiliations' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                          {language === 'en' ? 'Institutional Doctor Affiliations' : 'অনুমোদিত হাসপাতাল ও ডায়াগনস্টিক চেম্বার'}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#627680', margin: '2px 0 0 0' }}>
                          {language === 'en'
                            ? 'Switch active chambers, review incoming invitations, and manage institution-specific consulting terms.'
                            : 'সকল অনুমোদিত হাসপাতাল চেম্বার পর্যবেক্ষণ করুন এবং নতুন আমন্ত্রণ গ্রহণ করুন।'}
                        </p>
                      </div>
                    </div>

                    {/* Pending Invitations Section */}
                    {pendingInvitations.length > 0 && (
                      <div style={{ marginBottom: '28px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#92400E', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Building2 size={16} />
                          <span>{language === 'en' ? 'Pending Affiliation Invitations' : 'অপেক্ষমান এফিলিয়েশন আমন্ত্রণ'} ({pendingInvitations.length})</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {pendingInvitations.map((inv) => (
                            <div
                              key={inv.id}
                              className="glass-card"
                              style={{
                                padding: '20px',
                                border: '1.5px solid #F59E0B',
                                background: '#FFFBEB',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '16px',
                              }}
                            >
                              <div>
                                <div style={{ fontSize: '16px', fontWeight: 800, color: '#090D14' }}>
                                  {inv.hospitalName}
                                </div>
                                <div style={{ fontSize: '13px', color: '#627680', marginTop: '2px' }}>
                                  Branch: <strong style={{ color: '#090D14' }}>{inv.branchName || 'Main Campus'}</strong> • Chamber: {inv.chamberRoom || 'To Be Assigned'}
                                </div>
                                <div style={{ fontSize: '12.5px', color: '#0060FA', fontWeight: 600, marginTop: '4px' }}>
                                  Proposed Fee: ৳{inv.consultationFee || 800} • Hours: {inv.visitingHours || '05:00 PM - 09:00 PM'}
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                  onClick={() => handleRespondInvitation(inv.id, 'decline')}
                                  className="btn-outline"
                                  style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, color: '#DC2626', borderColor: '#FCA5A5', cursor: 'pointer' }}
                                >
                                  {language === 'en' ? 'Decline' : 'প্রত্যাখ্যান'}
                                </button>
                                <button
                                  onClick={() => handleRespondInvitation(inv.id, 'accept')}
                                  className="btn-primary"
                                  style={{ padding: '8px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)' }}
                                >
                                  {language === 'en' ? 'Accept Affiliation' : 'আমন্ত্রণ গ্রহণ করুন'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Active Affiliations Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                      {affiliations.map((affil) => {
                        const isActiveChamber = activeAffiliation?.id === affil.id;
                        return (
                          <div
                            key={affil.id}
                            className="glass-card"
                            style={{
                              padding: '24px',
                              borderRadius: '18px',
                              border: isActiveChamber ? '2px solid #0060FA' : '1px solid #E2E8F0',
                              position: 'relative',
                              boxShadow: isActiveChamber ? '0 8px 24px rgba(0, 96, 250, 0.15)' : 'none',
                            }}
                          >
                            {isActiveChamber && (
                              <span
                                style={{
                                  position: 'absolute',
                                  top: '16px',
                                  right: '16px',
                                  backgroundColor: '#0060FA',
                                  color: '#FFFFFF',
                                  padding: '3px 10px',
                                  borderRadius: '8px',
                                  fontSize: '11px',
                                  fontWeight: 800,
                                }}
                              >
                                CURRENT ACTIVE
                              </span>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                              <div
                                style={{
                                  width: '44px',
                                  height: '44px',
                                  borderRadius: '12px',
                                  backgroundColor: 'rgba(0, 96, 250, 0.1)',
                                  color: '#0060FA',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Building2 size={22} />
                              </div>
                              <div>
                                <div style={{ fontWeight: 800, fontSize: '16px', color: '#090D14' }}>
                                  {affil.hospitalName}
                                </div>
                                <div style={{ fontSize: '12px', color: '#627680' }}>
                                  {affil.branchName}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#627680', marginBottom: '20px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{language === 'en' ? 'Chamber Room:' : 'চেম্বার রুম:'}</span>
                                <strong style={{ color: '#090D14' }}>{affil.chamberRoom}</strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{language === 'en' ? 'Visiting Hours:' : 'রোগী দেখার সময়:'}</span>
                                <strong style={{ color: '#090D14' }}>{affil.visitingHours}</strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{language === 'en' ? 'Consultation Fee:' : 'ফি:'}</span>
                                <strong style={{ color: '#15803D' }}>{formatCurrency(affil.consultationFee)}</strong>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                              {!isActiveChamber ? (
                                <button
                                  onClick={() => handleSwitchAffiliation(affil)}
                                  className="btn-primary"
                                  style={{ flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  {language === 'en' ? 'Switch to this Chamber' : 'এই চেম্বার সক্রিয় করুন'}
                                </button>
                              ) : (
                                <div
                                  style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    padding: '10px',
                                    borderRadius: '10px',
                                    backgroundColor: 'rgba(0, 96, 250, 0.08)',
                                    color: '#0060FA',
                                    fontWeight: 700,
                                    fontSize: '13px',
                                  }}
                                >
                                  ✓ Active Clinical Context
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 6: SCHEDULE MANAGEMENT */}
                {activeTab === 'schedule' && (
                  <div className="glass-card" style={{ padding: '28px', maxWidth: '720px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                          {language === 'en' ? 'Chamber Working Schedule & Visiting Hours' : 'চেম্বারের সাপ্তাহিক সময়সূচি ও ফি'}
                        </h3>
                        <span style={{ fontSize: '12px', color: '#627680' }}>
                          Facility: {activeAffiliation?.hospitalName || 'Popular Diagnostic Center'}
                        </span>
                      </div>
                    </div>

                    <form onSubmit={handleSaveSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '8px' }}>
                          {language === 'en' ? 'Visiting Days' : 'রোগী দেখার দিনসমূহ'}
                        </label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => {
                            const isSelected = schedDaysOfWeek.includes(day);
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => {
                                  if (isSelected) setSchedDaysOfWeek(schedDaysOfWeek.filter((d) => d !== day));
                                  else setSchedDaysOfWeek([...schedDaysOfWeek, day]);
                                }}
                                style={{
                                  padding: '8px 14px',
                                  borderRadius: '8px',
                                  fontSize: '12.5px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  border: isSelected ? '1px solid #0060FA' : '1px solid #CBD5E1',
                                  backgroundColor: isSelected ? '#0060FA' : '#FFFFFF',
                                  color: isSelected ? '#FFFFFF' : '#64748B',
                                }}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                        <div>
                          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                            {language === 'en' ? 'Visiting Start Time' : 'শুরুর সময়'}
                          </label>
                          <input
                            type="text"
                            value={schedStartTime}
                            onChange={(e) => setSchedStartTime(e.target.value)}
                            className="glass-input"
                            style={{ width: '100%', fontSize: '13px' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                            {language === 'en' ? 'Visiting End Time' : 'শেষের সময়'}
                          </label>
                          <input
                            type="text"
                            value={schedEndTime}
                            onChange={(e) => setSchedEndTime(e.target.value)}
                            className="glass-input"
                            style={{ width: '100%', fontSize: '13px' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                        <div>
                          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                            {language === 'en' ? 'Chamber / Room Number' : 'চেম্বার রুম নম্বর'}
                          </label>
                          <input
                            type="text"
                            value={schedChamberRoom}
                            onChange={(e) => setSchedChamberRoom(e.target.value)}
                            className="glass-input"
                            style={{ width: '100%', fontSize: '13px' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                            {language === 'en' ? 'Consultation Fee (BDT)' : 'কনসালটেশন ফি (টাকা)'}
                          </label>
                          <input
                            type="number"
                            value={schedFee}
                            onChange={(e) => setSchedFee(Number(e.target.value))}
                            className="glass-input"
                            style={{ width: '100%', fontSize: '13px' }}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSavingSchedule}
                        className="btn-primary"
                        style={{ padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: 800, marginTop: '8px', cursor: isSavingSchedule ? 'not-allowed' : 'pointer' }}
                      >
                        {isSavingSchedule ? 'Saving Schedule...' : (language === 'en' ? 'Save Chamber Schedule' : 'সময়সূচি সংরক্ষণ করুন')}
                      </button>
                    </form>
                  </div>
                )}

                {/* TAB 7: LEAVE & VACATION MANAGER */}
                {activeTab === 'leaves' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                          {language === 'en' ? 'Leave & Holiday Management' : 'ছুটি ও বন্ধ ব্যবস্থাপনা'}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#627680', margin: '2px 0 0 0' }}>
                          {language === 'en'
                            ? 'Recorded leaves automatically block serial booking slots and notify patient desks.'
                            : 'ছুটি নির্ধারণ করলে সংশ্লিষ্ট দিনগুলোর চেম্বার স্লট স্বয়ংক্রিয়ভাবে বন্ধ থাকবে।'}
                        </p>
                      </div>

                      <button
                        onClick={() => setIsAddLeaveOpen(true)}
                        className="btn-primary"
                        style={{ padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                      >
                        <Plus size={16} />
                        <span>{language === 'en' ? 'Add Leave' : 'ছুটি যোগ করুন'}</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {leaves.map((l) => (
                        <div
                          key={l.id}
                          className="glass-card"
                          style={{
                            padding: '18px 22px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '15px', color: '#090D14' }}>
                              {l.reason}
                            </div>
                            <div style={{ fontSize: '13px', color: '#627680', marginTop: '2px' }}>
                              Dates: <strong style={{ color: '#090D14' }}>{l.startDate}</strong> to <strong style={{ color: '#090D14' }}>{l.endDate}</strong>
                            </div>
                          </div>

                          <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#B45309', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '3px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>
                            SLOTS BLOCKED
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 8: PROFESSIONAL PROFILE */}
                {activeTab === 'profile' && (
                  <div className="glass-card" style={{ padding: '28px', maxWidth: '720px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '16px',
                          backgroundColor: 'rgba(0, 96, 250, 0.1)',
                          color: '#0060FA',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '22px',
                          fontWeight: 800,
                        }}
                      >
                        <User size={30} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                          {language === 'en' ? 'Central Doctor Profile' : 'সেন্ট্রাল ডাক্তার প্রোফাইল'}
                        </h3>
                        <div style={{ fontSize: '12px', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <ShieldCheck size={14} />
                          <span>BMDC Verified Practitioner</span>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                        <div>
                          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                            {language === 'en' ? 'Doctor Full Name' : 'ডাক্তারের পুরো নাম'} *
                          </label>
                          <input
                            type="text"
                            required
                            value={profFullName}
                            onChange={(e) => setProfFullName(e.target.value)}
                            className="glass-input"
                            style={{ width: '100%', fontSize: '13.5px' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                            {language === 'en' ? 'BMDC Registration Number' : 'বিএমডিসি নম্বর'} *
                          </label>
                          <input
                            type="text"
                            required
                            value={profBmdcNumber}
                            onChange={(e) => setProfBmdcNumber(e.target.value)}
                            className="glass-input"
                            style={{ width: '100%', fontSize: '13.5px' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                        <div>
                          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                            {language === 'en' ? 'Medical Specialty' : 'মেডিকেল স্পেশালিটি'} *
                          </label>
                          <input
                            type="text"
                            required
                            value={profSpecialization}
                            onChange={(e) => setProfSpecialization(e.target.value)}
                            className="glass-input"
                            style={{ width: '100%', fontSize: '13.5px' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                            {language === 'en' ? 'Years of Experience' : 'অভিজ্ঞতা (বছর)'}
                          </label>
                          <input
                            type="number"
                            value={profExperience}
                            onChange={(e) => setProfExperience(Number(e.target.value))}
                            className="glass-input"
                            style={{ width: '100%', fontSize: '13.5px' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                          {language === 'en' ? 'Qualifications & Degrees' : 'ডিগ্রী ও শিক্ষাগত যোগ্যতা'}
                        </label>
                        <input
                          type="text"
                          value={profQualifications}
                          onChange={(e) => setProfQualifications(e.target.value)}
                          placeholder="e.g. MBBS, FCPS, MD (Cardiology)"
                          className="glass-input"
                          style={{ width: '100%', fontSize: '13.5px' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                          {language === 'en' ? 'Professional Biography' : 'বায়োগ্রাফি ও পরিচিতি'}
                        </label>
                        <textarea
                          rows={3}
                          value={profBiography}
                          onChange={(e) => setProfBiography(e.target.value)}
                          placeholder="Brief description of clinical expertise, specialized treatments, and background."
                          className="glass-input"
                          style={{ width: '100%', fontSize: '13.5px' }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="btn-primary"
                        style={{ padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: 800, marginTop: '8px', cursor: isSavingProfile ? 'not-allowed' : 'pointer' }}
                      >
                        {isSavingProfile ? 'Saving Changes...' : (language === 'en' ? 'Save Profile Details' : 'প্রোফাইল সংরক্ষণ করুন')}
                      </button>
                    </form>
                  </div>
                )}

                {/* TAB 9: MARKETPLACE PUBLIC CARD PREVIEW */}
                {activeTab === 'marketplace' && (
                  <div style={{ maxWidth: '640px' }}>
                    <div style={{ marginBottom: '18px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                        {language === 'en' ? 'Marketplace Public Profile Preview' : 'মার্কেটপ্লেস পাবলিক প্রোফাইল প্রিভিউ'}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#627680', margin: '2px 0 0 0' }}>
                        {language === 'en'
                          ? 'This is how your verified profile appears to patients searching on Diagnostic Care.'
                          : 'ডায়াগনস্টিক কেয়ারে রোগীরা আপনার প্রোফাইল যেভাবে দেখতে পাবে।'}
                      </p>
                    </div>

                    <div
                      className="glass-card"
                      style={{
                        padding: '28px',
                        borderRadius: '24px',
                        border: '1.5px solid rgba(0, 96, 250, 0.25)',
                        boxShadow: '0 20px 40px -15px rgba(0, 96, 250, 0.15)',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '18px' }}>
                        <div
                          style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '20px',
                            backgroundColor: 'rgba(0, 96, 250, 0.1)',
                            color: '#0060FA',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '32px',
                            fontWeight: 900,
                          }}
                        >
                          <Stethoscope size={38} />
                        </div>
                        <div>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(21, 128, 61, 0.1)', color: '#15803D', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, marginBottom: '4px' }}>
                            <ShieldCheck size={12} />
                            BMDC VERIFIED SPECIALIST
                          </div>
                          <h4 style={{ fontSize: '20px', fontWeight: 900, color: '#090D14', margin: '0 0 4px 0' }}>
                            {currentUser?.fullName}
                          </h4>
                          <div style={{ fontSize: '13px', color: '#627680' }}>
                            {profQualifications} • {profSpecialization}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#627680', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>BMDC Registration:</span>
                          <strong style={{ color: '#090D14' }}>{profBmdcNumber}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Experience:</span>
                          <strong style={{ color: '#090D14' }}>{profExperience} Years</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Active Chamber:</span>
                          <strong style={{ color: '#0060FA' }}>{activeAffiliation?.hospitalName}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Consultation Fee:</span>
                          <strong style={{ color: '#15803D' }}>{formatCurrency(currentFee)}</strong>
                        </div>
                      </div>

                      <Link
                        href={`/doctors/${currentUser?.id || 'doc-1'}`}
                        className="btn-primary"
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '12px',
                          fontSize: '13.5px',
                          fontWeight: 800,
                          textAlign: 'center',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        <span>{language === 'en' ? 'Open Live Patient Booking Page' : 'লাইভ বুকিং পেজ খুলুন'}</span>
                        <ExternalLink size={16} />
                      </Link>
                    </div>
                  </div>
                )}

                {/* TAB 10: SECURITY & PASSWORD */}
                {activeTab === 'security' && (
                  <div style={{ maxWidth: '640px' }}>
                    <div className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', margin: '0 0 16px 0' }}>
                        {language === 'en' ? 'Central Doctor Account Profile' : 'সেন্ট্রাল ডাক্তার একাউন্ট প্রোফাইল'}
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
                        <div className="glass-inset" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#627680' }}>Doctor Full Name:</span>
                          <strong style={{ color: '#090D14' }}>{currentUser?.fullName}</strong>
                        </div>
                        <div className="glass-inset" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#627680' }}>Registered Email:</span>
                          <strong style={{ color: '#090D14' }}>{currentUser?.email}</strong>
                        </div>
                        <div className="glass-inset" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#627680' }}>Registered Phone:</span>
                          <strong style={{ color: '#090D14' }}>{currentUser?.phone || '01886748564'}</strong>
                        </div>
                        <div className="glass-inset" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#627680' }}>Primary Role:</span>
                          <strong style={{ color: '#0060FA' }}>VERIFIED DOCTOR</strong>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card" style={{ padding: '28px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', margin: '0 0 6px 0' }}>
                        {language === 'en' ? 'Change Central Account Password' : 'সেন্ট্রাল পাসওয়ার্ড পরিবর্তন'}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#627680', margin: '0 0 20px 0' }}>
                        {language === 'en'
                          ? 'Updating your password here secures your single central doctor identity across all affiliated institutions.'
                          : 'এখানে পাসওয়ার্ড পরিবর্তন করলে আপনার সেন্ট্রাল একাউন্টের আওতাধীন সকল হাসপাতালের একাউন্ট সুরক্ষিত থাকবে।'}
                      </p>

                      <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                            {language === 'en' ? 'New Password' : 'নতুন পাসওয়ার্ড'} (min 8 characters) *
                          </label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              required
                              minLength={8}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="••••••••"
                              className="glass-input"
                              style={{ width: '100%', fontSize: '14px', paddingRight: '40px' }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}
                            >
                              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                            {language === 'en' ? 'Confirm New Password' : 'নতুন পাসওয়ার্ড নিশ্চিত করুন'} *
                          </label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              required
                              minLength={8}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="••••••••"
                              className="glass-input"
                              style={{ width: '100%', fontSize: '14px', paddingRight: '40px' }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}
                            >
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isChangingPassword}
                          className="btn-primary"
                          style={{ padding: '12px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 800, cursor: isChangingPassword ? 'not-allowed' : 'pointer', marginTop: '6px' }}
                        >
                          {isChangingPassword ? (language === 'en' ? 'Updating Password...' : 'আপডেট করা হচ্ছে...') : (language === 'en' ? 'Save New Password' : 'নতুন পাসওয়ার্ড সংরক্ষণ করুন')}
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* TAB 11: DOCTOR QR CODE & PRINT STUDIO */}
                {activeTab === 'qr_code' && (
                  <div>
                    {/* Analytics Header Strip */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '16px',
                        marginBottom: '24px',
                      }}
                    >
                      <div className="glass-card" style={{ padding: '20px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                          {language === 'en' ? 'Lifetime QR Scans' : 'মোট কিউআর স্ক্যান'}
                        </div>
                        <div style={{ fontSize: '28px', fontWeight: 900, color: '#0060FA', marginTop: '6px' }}>
                          {qrAnalytics?.totalScans || 0}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                          {language === 'en' ? 'Prescriptions, posters & cards' : 'প্রেসক্রিপশন, পোস্টার ও কার্ড স্ক্যান'}
                        </div>
                      </div>

                      <div className="glass-card" style={{ padding: '20px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                          {language === 'en' ? 'Active Linked Chamber' : 'সংযুক্ত সক্রিয় চেম্বার'}
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {activeAffiliation?.hospitalName || 'Central Profile'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#15803D', fontWeight: 600, marginTop: '2px' }}>
                          ● {language === 'en' ? 'Live & Scan Ready' : 'সক্রিয় ও স্ক্যান উপযোগী'}
                        </div>
                      </div>

                      <div className="glass-card" style={{ padding: '20px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                          {language === 'en' ? 'BMDC Verification' : 'বিএমডিসি ভেরিফিকেশন'}
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#15803D', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ShieldCheck size={18} />
                          <span>BMDC #{profBmdcNumber || 'A-89412'}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                          {language === 'en' ? 'Govt. Verified Physician' : 'সরকারি নিবন্ধিত চিকিৎসক'}
                        </div>
                      </div>
                    </div>

                    {/* QR Code Studio Component */}
                    <div className="glass-card" style={{ padding: '28px' }}>
                      <QRCodeStudio
                        details={{
                          ownerType: 'doctor',
                          ownerId: currentUser?.id || '20000001-0000-0000-0000-000000000001',
                          name: currentUser?.fullName || profFullName || 'Specialist Doctor',
                          designation: profQualifications || 'MBBS, FCPS',
                          specialty: profSpecialization || 'Cardiology & Internal Medicine',
                          organizationName: activeAffiliation?.hospitalName || 'Diagnostic Care Network',
                          publicUrl: QRService.getPublicProfileUrl('doctor', currentUser?.id || '20000001-0000-0000-0000-000000000001'),
                          isVerified: true,
                        }}
                        canManage={isDoctorRole}
                        showAnalyticsSummary={true}
                        totalScans={qrAnalytics?.totalScans || 0}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Cancellation / Rejection Reason Modal */}
      {cancelModalApt && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: '16px',
            backgroundColor: 'rgba(9, 13, 20, 0.75)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            className="modal-container animate-slide-down"
            style={{
              maxWidth: '460px',
              width: '100%',
              padding: '28px',
              background: '#FFFFFF',
              borderRadius: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#991B1B', margin: 0 }}>
                {language === 'en' ? 'Cancel Appointment / Serial' : 'সিরিয়াল বাতিল করুন'}
              </h3>
              <button
                onClick={() => setCancelModalApt(null)}
                style={{ background: 'none', border: 'none', color: '#627680', cursor: 'pointer', fontSize: '18px', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmCancelApt} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '13px', color: '#627680' }}>
                Patient: <strong style={{ color: '#090D14' }}>{cancelModalApt.patient_name || cancelModalApt.patientName}</strong> (Token #{cancelModalApt.serial_number || cancelModalApt.token_number || '-'})
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                  {language === 'en' ? 'Reason for Cancellation' : 'বাতিলের কারণ'} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Emergency surgery, unavoidable leave, patient requested"
                  className="glass-input"
                  style={{ width: '100%', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setCancelModalApt(null)}
                  className="btn-outline"
                  style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {language === 'en' ? 'Keep Appointment' : 'বাতিল করবেন না'}
                </button>
                <button
                  type="submit"
                  disabled={isCancellingApt}
                  style={{
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: isCancellingApt ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isCancellingApt ? 'Cancelling...' : (language === 'en' ? 'Confirm Cancellation' : 'বাতিল নিশ্চিত করুন')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enforced First Login Password Change Modal */}
      {mustChangePassword && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            padding: '16px',
            backgroundColor: 'rgba(9, 13, 20, 0.85)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            className="modal-container animate-slide-down"
            style={{
              maxWidth: '460px',
              width: '100%',
              padding: '32px',
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '2px solid #0060FA',
              boxShadow: '0 25px 50px -12px rgba(0, 96, 250, 0.25)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(0, 96, 250, 0.1)',
                  color: '#0060FA',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                <KeyRound size={28} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 900, color: '#090D14', margin: '0 0 6px 0' }}>
                {language === 'en' ? 'Set Your Permanent Password' : 'আপনার স্থায়ী পাসওয়ার্ড নির্ধারণ করুন'}
              </h3>
              <p style={{ fontSize: '13px', color: '#627680', margin: 0, lineHeight: 1.5 }}>
                {language === 'en'
                  ? 'Your account was initialized with a temporary hospital password. For healthcare privacy and security, please set a new personal password before proceeding.'
                  : 'নিরাপত্তার স্বার্থে হাসপাতালের দেওয়া প্রাথমিক পাসওয়ার্ড পরিবর্তন করে আপনার ব্যক্তিগত পাসওয়ার্ড সেট করুন।'}
              </p>
            </div>

            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                  {language === 'en' ? 'New Password (min 8 characters)' : 'নতুন পাসওয়ার্ড (ন্যূনতম ৮ অক্ষর)'} *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="glass-input"
                    style={{ width: '100%', fontSize: '13.5px', paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                  {language === 'en' ? 'Confirm New Password' : 'নতুন পাসওয়ার্ড পুনরায় লিখুন'} *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="glass-input"
                    style={{ width: '100%', fontSize: '13.5px', paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="btn-primary"
                style={{ padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: 800, marginTop: '6px', cursor: isChangingPassword ? 'not-allowed' : 'pointer' }}
              >
                {isChangingPassword ? (language === 'en' ? 'Updating Password...' : 'আপডেট করা হচ্ছে...') : (language === 'en' ? 'Secure Account & Continue' : 'পাসওয়ার্ড সংরক্ষণ করে প্রবেশ করুন')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
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
            backgroundColor: 'rgba(9, 13, 20, 0.65)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            className="modal-container animate-slide-down"
            style={{
              maxWidth: '440px',
              width: '100%',
              padding: '28px',
              background: '#FFFFFF',
              borderRadius: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                {language === 'en' ? 'Reset Central Password' : 'পাসওয়ার্ড রিসেট'}
              </h3>
              <button
                onClick={() => setIsForgotPasswordOpen(false)}
                style={{ background: 'none', border: 'none', color: '#627680', cursor: 'pointer', fontSize: '18px', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            {forgotPasswordSubmitted ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <CheckCircle2 size={44} color="#15803D" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#090D14', margin: '0 0 6px 0' }}>
                  {language === 'en' ? 'Recovery Request Sent' : 'অনুরোধ গৃহীত হয়েছে'}
                </h4>
                <p style={{ fontSize: '13px', color: '#627680', lineHeight: 1.5, margin: '0 0 20px 0' }}>
                  {language === 'en'
                    ? 'If the email matches an authorized doctor account, a secure password reset link has been dispatched to your inbox.'
                    : 'প্রদত্ত ইমেইলটি নিবন্ধিত থাকলে পাসওয়ার্ড রিসেট লিংক আপনার ইনবক্সে পাঠিয়ে দেওয়া হয়েছে।'}
                </p>
                <button
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="btn-primary"
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {language === 'en' ? 'Close' : 'বন্ধ করুন'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ fontSize: '13px', color: '#627680', margin: 0 }}>
                  {language === 'en'
                    ? 'Enter your registered doctor email address. We will send you a recovery link.'
                    : 'আপনার নিবন্ধিত ডাক্তারের ইমেইল প্রদান করুন। আমরা পাসওয়ার্ড রিসেট লিংক পাঠাবো।'}
                </p>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                    {language === 'en' ? 'Registered Email' : 'নিবন্ধিত ইমেইল'} *
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="doctor@hospital.com"
                    className="glass-input"
                    style={{ width: '100%', fontSize: '13.5px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="btn-outline"
                    style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {language === 'en' ? 'Cancel' : 'বাতিল'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingReset}
                    className="btn-primary"
                    style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: isSendingReset ? 'not-allowed' : 'pointer' }}
                  >
                    {isSendingReset ? (language === 'en' ? 'Sending...' : 'পাঠানো হচ্ছে...') : (language === 'en' ? 'Send Recovery Link' : 'লিংক পাঠান')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Add Leave Modal */}
      {isAddLeaveOpen && (
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
              maxWidth: '440px',
              width: '100%',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                {language === 'en' ? 'Schedule Doctor Leave' : 'ডাক্তারের ছুটি নির্ধারণ'}
              </h3>
              <button
                onClick={() => setIsAddLeaveOpen(false)}
                style={{ background: 'none', border: 'none', color: '#627680', cursor: 'pointer', fontSize: '18px', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLeave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                  {language === 'en' ? 'Start Date' : 'শুরুর তারিখ'} *
                </label>
                <input
                  type="date"
                  required
                  value={leaveStartDate}
                  onChange={(e) => setLeaveStartDate(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                  {language === 'en' ? 'End Date' : 'শেষের তারিখ'} *
                </label>
                <input
                  type="date"
                  required
                  value={leaveEndDate}
                  onChange={(e) => setLeaveEndDate(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                  {language === 'en' ? 'Reason / Details' : 'ছুটির কারণ'}
                </label>
                <input
                  type="text"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="e.g. Medical Conference, Personal Vacation"
                  className="glass-input"
                  style={{ width: '100%', fontSize: '13.5px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddLeaveOpen(false)}
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
                  {language === 'en' ? 'Confirm Leave' : 'ছুটি নিশ্চিত করুন'}
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
            if (typeof window !== 'undefined') localStorage.setItem('dc_user_location', loc);
            setIsLocationModalOpen(false);
          }}
        />
      )}

      <Footer language={language} />
    </div>
  );
}

export default function DoctorDashboardPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium">Loading Doctor Console...</div>}>
      <DoctorDashboardContent />
    </React.Suspense>
  );
}

