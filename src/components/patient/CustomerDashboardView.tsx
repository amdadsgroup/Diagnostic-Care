'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import AuthModal from '@/components/auth/AuthModal';
import { useLanguage } from '@/context/LanguageContext';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import { AppointmentService } from '@/services/appointment.service';
import {
  PatientService,
  CustomerFullProfile,
  FamilyMemberRecord,
  MedicalProfileData,
  MedicalRecordItem,
  SavedProviderItem,
  CustomerPreferences,
  CustomerPrivacySettings,
} from '@/services/patient.service';
import { NotificationService, AppNotification } from '@/services/notification.service';
import { Appointment, Doctor, Organization } from '@/types';
import { BRAND_COLORS, BRAND_CONSTANTS, SupportedLanguage } from '@/config/brand';
import {
  User,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Heart,
  Bell,
  Lock,
  Settings,
  Phone,
  Mail,
  Camera,
  Upload,
  Trash2,
  Plus,
  Eye,
  Download,
  FileText,
  Star,
  ChevronRight,
  Stethoscope,
  Building2,
  Sparkles,
  ArrowRight,
  LogOut,
  RefreshCw,
  ExternalLink,
  Search,
} from 'lucide-react';

type DashboardTab =
  | 'overview'
  | 'profile'
  | 'appointments'
  | 'health'
  | 'family'
  | 'saved'
  | 'notifications'
  | 'security'
  | 'preferences';

export default function CustomerDashboardView() {
  const router = useRouter();
  const { language, setLanguage, formatCurrency } = useLanguage();
  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Profile State
  const [profile, setProfile] = useState<CustomerFullProfile | null>(null);
  const [editProfileForm, setEditProfileForm] = useState<Partial<CustomerFullProfile>>({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Appointments State
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentFilter, setAppointmentFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancellingAppointment, setCancellingAppointment] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  // Health Information State
  const [medicalProfile, setMedicalProfile] = useState<MedicalProfileData | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecordItem[]>([]);
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [docUploadTitle, setDocUploadTitle] = useState('');
  const [docUploadType, setDocUploadType] = useState<'lab_report' | 'prescription' | 'xray'>('lab_report');
  const docFileInputRef = useRef<HTMLInputElement | null>(null);

  // Family Members State
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberRecord[]>([]);
  const [isAddFamilyOpen, setIsAddFamilyOpen] = useState(false);
  const [famName, setFamName] = useState('');
  const [famRelation, setFamRelation] = useState('Father');
  const [famAge, setFamAge] = useState('');
  const [famGender, setFamGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [famBlood, setFamBlood] = useState('B+');

  // Saved Providers State
  const [savedProviders, setSavedProviders] = useState<SavedProviderItem[]>([]);

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Preferences & Security State
  const [preferences, setPreferences] = useState<CustomerPreferences>({
    theme: 'light',
    smsNotifications: true,
    emailNotifications: true,
    pushNotifications: true,
    soundAlerts: true,
    preferredLanguage: 'en',
  });
  const [privacySettings, setPrivacySettings] = useState<CustomerPrivacySettings>({
    shareMedicalHistoryWithDoctors: true,
    allowEmergencyAccess: true,
    profileDiscoverable: true,
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    loadUserSession();
  }, []);

  const loadUserSession = async () => {
    setIsLoading(true);
    try {
      const user = await AuthService.getCurrentUser();
      if (!user) {
        setIsLoading(false);
        return;
      }
      setCurrentUser(user);
      await loadAllCustomerData(user.id);
    } catch (err) {
      console.error('Session loading failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllCustomerData = async (userId: string) => {
    try {
      // 1. Load Profile
      const prof = await PatientService.getCustomerFullProfile(userId);
      if (prof) {
        setProfile(prof);
        setEditProfileForm(prof);

        // 2. Load Appointments
        const apts = await AppointmentService.getPatientAppointments(prof.patientId || userId);
        setAppointments(apts);

        // 3. Load Family Members
        const fams = await PatientService.getFamilyMembers(prof.patientId || userId);
        setFamilyMembers(fams);

        // 4. Load Medical Profile & Records
        const med = await PatientService.getMedicalProfile(prof.patientId || userId);
        setMedicalProfile(med);

        const recs = await PatientService.getMedicalRecords(prof.patientId || userId);
        setMedicalRecords(recs);

        // 5. Load Saved Providers
        const saved = await PatientService.getSavedProviders(userId);
        setSavedProviders(saved);

        // 6. Load Notifications
        const notifs = await NotificationService.getUserNotifications(userId);
        setNotifications(notifs);

        // 7. Load Preferences & Privacy
        const prefs = await PatientService.getUserPreferences(userId);
        setPreferences(prefs);

        const priv = await PatientService.getPrivacySettings(userId);
        setPrivacySettings(priv);
      }
    } catch (e) {
      console.warn('Error loading patient dataset:', e);
    }
  };

  // Avatar Upload Handler
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setAvatarUploading(true);
    const res = await PatientService.uploadAvatar(currentUser.id, file);
    setAvatarUploading(false);

    if (res.error) {
      showToast(res.error, 'error');
    } else if (res.avatarUrl && profile) {
      setProfile({ ...profile, avatarUrl: res.avatarUrl });
      showToast(
        language === 'bn'
          ? 'প্রোফাইল ছবি সফলভাবে আপডেট করা হয়েছে।'
          : 'Profile photo updated successfully!'
      );
    }
  };

  const handleRemoveAvatar = async () => {
    if (!currentUser || !profile) return;
    const ok = await PatientService.removeAvatar(currentUser.id);
    if (ok) {
      setProfile({ ...profile, avatarUrl: undefined });
      showToast(
        language === 'bn' ? 'প্রোফাইল ছবি মুছে ফেলা হয়েছে।' : 'Profile photo removed.'
      );
    }
  };

  // Save Profile Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !profile) return;

    if (editProfileForm.phone && !AuthService.isValidBangladeshPhone(editProfileForm.phone)) {
      showToast(
        language === 'bn'
          ? 'দয়া করে সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)'
          : 'Please enter a valid 11-digit Bangladeshi phone number (e.g., 017XXXXXXXX)',
        'error'
      );
      return;
    }

    setIsSavingProfile(true);
    const res = await PatientService.updateCustomerProfile(currentUser.id, editProfileForm);
    setIsSavingProfile(false);

    if (res.error) {
      showToast(res.error, 'error');
    } else {
      setProfile({ ...profile, ...editProfileForm } as CustomerFullProfile);
      showToast(
        language === 'bn'
          ? 'ব্যক্তিগত তথ্য সফলভাবে সংরক্ষিত হয়েছে।'
          : 'Personal information updated successfully!'
      );
    }
  };

  // Cancel Appointment Handler
  const handleConfirmCancelAppointment = async () => {
    if (!cancellingAppointment) return;
    setIsCancelling(true);
    const res = await AppointmentService.cancelAppointment(cancellingAppointment.id, cancelReason);
    setIsCancelling(false);

    if (res.error) {
      showToast(res.error, 'error');
    } else {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === cancellingAppointment.id ? { ...a, status: 'CANCELLED_BY_PATIENT' as any } : a
        )
      );
      setCancellingAppointment(null);
      setCancelReason('');
      showToast(
        language === 'bn'
          ? 'অ্যাপয়েন্টমেন্ট সফলভাবে বাতিল করা হয়েছে।'
          : 'Appointment cancelled successfully.'
      );
    }
  };

  // Add Family Member Handler
  const handleAddFamilyMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !famName.trim()) return;

    const res = await PatientService.addFamilyMember(profile.patientId, {
      fullName: famName.trim(),
      relationship: famRelation,
      age: famAge ? Number(famAge) : undefined,
      gender: famGender,
      bloodGroup: famBlood,
    });

    if (res.error || !res.member) {
      showToast(res.error || 'Failed to add family member', 'error');
    } else {
      setFamilyMembers([res.member, ...familyMembers]);
      setIsAddFamilyOpen(false);
      setFamName('');
      setFamAge('');
      showToast(
        language === 'bn'
          ? 'পারিবারিক সদস্য সফলভাবে যুক্ত করা হয়েছে।'
          : 'Family member profile added successfully!'
      );
    }
  };

  const handleDeleteFamilyMember = async (id: string) => {
    const ok = await PatientService.deleteFamilyMember(id);
    if (ok) {
      setFamilyMembers(familyMembers.filter((f) => f.id !== id));
      showToast(
        language === 'bn' ? 'সদস্য মুছে ফেলা হয়েছে।' : 'Family member removed.'
      );
    }
  };

  // Medical Profile Allergies & Medications
  const handleAddAllergy = async () => {
    if (!newAllergy.trim() || !profile) return;
    const updated = [...(medicalProfile?.allergies || []), newAllergy.trim()];
    const res = await PatientService.updateMedicalProfile(profile.patientId, {
      allergies: updated,
    });
    if (res.success) {
      setMedicalProfile((prev) => ({
        patientId: profile.patientId,
        allergies: updated,
        currentMedications: prev?.currentMedications || [],
        chronicConditions: prev?.chronicConditions || [],
        pastSurgeries: prev?.pastSurgeries || [],
      }));
      setNewAllergy('');
      showToast('Allergy added');
    }
  };

  const handleRemoveAllergy = async (item: string) => {
    if (!profile) return;
    const updated = (medicalProfile?.allergies || []).filter((a) => a !== item);
    await PatientService.updateMedicalProfile(profile.patientId, { allergies: updated });
    setMedicalProfile((prev) => (prev ? { ...prev, allergies: updated } : null));
  };

  const handleAddMedication = async () => {
    if (!newMedication.trim() || !profile) return;
    const updated = [...(medicalProfile?.currentMedications || []), newMedication.trim()];
    const res = await PatientService.updateMedicalProfile(profile.patientId, {
      currentMedications: updated,
    });
    if (res.success) {
      setMedicalProfile((prev) => ({
        patientId: profile.patientId,
        allergies: prev?.allergies || [],
        currentMedications: updated,
        chronicConditions: prev?.chronicConditions || [],
        pastSurgeries: prev?.pastSurgeries || [],
      }));
      setNewMedication('');
      showToast('Medication recorded');
    }
  };

  const handleRemoveMedication = async (item: string) => {
    if (!profile) return;
    const updated = (medicalProfile?.currentMedications || []).filter((m) => m !== item);
    await PatientService.updateMedicalProfile(profile.patientId, { currentMedications: updated });
    setMedicalProfile((prev) => (prev ? { ...prev, currentMedications: updated } : null));
  };

  // Upload Medical Record
  const handleUploadMedicalDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile || !currentUser) return;

    setIsUploadingDoc(true);
    const res = await PatientService.uploadMedicalRecord({
      patientId: profile.patientId,
      userId: currentUser.id,
      title: docUploadTitle.trim() || file.name,
      recordType: docUploadType,
      file,
    });
    setIsUploadingDoc(false);

    if (res.error || !res.record) {
      showToast(res.error || 'Failed to upload document', 'error');
    } else {
      setMedicalRecords([res.record, ...medicalRecords]);
      setDocUploadTitle('');
      if (docFileInputRef.current) docFileInputRef.current.value = '';
      showToast(
        language === 'bn'
          ? 'চিকিৎসা নথি নিরাপদে আপলোড করা হয়েছে।'
          : 'Health document securely uploaded!'
      );
    }
  };

  // Toggle Favorite
  const handleRemoveSavedProvider = async (item: SavedProviderItem) => {
    if (!currentUser) return;
    const res = await PatientService.toggleSaveProvider(
      currentUser.id,
      item.entityType,
      item.entityId
    );
    if (!res.isSaved) {
      setSavedProviders(savedProviders.filter((p) => p.id !== item.id));
      showToast(
        language === 'bn' ? 'সংরক্ষিত তালিকা থেকে সরানো হয়েছে।' : 'Removed from saved providers.'
      );
    }
  };

  // Notification Mark Read
  const handleMarkNotificationRead = async (id: string) => {
    await NotificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Update Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordError(
        language === 'bn'
          ? 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।'
          : 'Password must be at least 8 characters.'
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(
        language === 'bn'
          ? 'উভয় পাসওয়ার্ড মেলেনি।'
          : 'Passwords do not match.'
      );
      return;
    }
    setPasswordError('');
    setIsUpdatingPassword(true);
    const res = await AuthService.updatePassword(newPassword);
    setIsUpdatingPassword(false);

    if (res.error) {
      showToast(res.error, 'error');
    } else {
      setNewPassword('');
      setConfirmPassword('');
      showToast(
        language === 'bn'
          ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।'
          : 'Password updated successfully!'
      );
    }
  };

  // Calculate profile completion score
  const completionPercentage = profile ? PatientService.calculateProfileCompletion(profile) : 0;

  // Filter appointments
  const filteredAppointments = appointments.filter((apt) => {
    if (appointmentFilter === 'ALL') return true;
    if (appointmentFilter === 'UPCOMING')
      return apt.status === 'CONFIRMED' || (apt.status as string) === 'PENDING';
    if (appointmentFilter === 'COMPLETED') return apt.status === 'COMPLETED';
    if (appointmentFilter === 'CANCELLED')
      return (apt.status as string).includes('CANCEL');
    return true;
  });

  const upcomingApts = appointments.filter(
    (a) => a.status === 'CONFIRMED' || (a.status as string) === 'PENDING'
  );
  const completedApts = appointments.filter((a) => a.status === 'COMPLETED');

  // Loading State
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
        <Header language={language} setLanguage={setLanguage} activeTab="marketplace" setActiveTab={() => {}} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ width: '44px', height: '44px', border: '3px solid #E2E8F0', borderTopColor: BRAND_COLORS.primary, borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#64748B', fontWeight: 600, fontSize: '15px' }}>
              {language === 'bn' ? 'রোগী প্রোফাইল ও ড্যাশবোর্ড লোড হচ্ছে...' : 'Loading verified patient dashboard...'}
            </p>
          </div>
        </div>
        <Footer language={language} />
      </div>
    );
  }

  // Guest State -> Prompt Authenticated Sign In
  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
        <Header language={language} setLanguage={setLanguage} activeTab="marketplace" setActiveTab={() => {}} />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
          <div
            style={{
              maxWidth: '520px',
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid #E2E8F0',
              borderRadius: '24px',
              padding: '40px 32px',
              textAlign: 'center',
              boxShadow: '0 20px 40px -15px rgba(0, 96, 250, 0.1)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                backgroundColor: BRAND_COLORS.primaryLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <User size={32} color={BRAND_COLORS.primary} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#090D14', margin: '0 0 10px 0' }}>
              {language === 'bn' ? 'রোগী প্রোফাইল ও ড্যাশবোর্ড' : 'Customer Profile & Dashboard'}
            </h1>
            <p style={{ color: '#64748B', fontSize: '15px', lineHeight: 1.6, margin: '0 0 28px 0' }}>
              {language === 'bn'
                ? 'আপনার অ্যাপয়েন্টমেন্ট শিডিউল, প্রেসক্রিপশন ভল্ট এবং পারিবারিক স্বাস্থ্য তথ্য পরিচালনা করতে লগইন করুন।'
                : 'Sign in to access your confirmed appointments, medical vault, family dependents, and verified doctor chambers.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="btn-primary"
                style={{
                  padding: '12px 28px',
                  fontSize: '15px',
                  fontWeight: 800,
                  borderRadius: '14px',
                  backgroundColor: BRAND_COLORS.primary,
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {language === 'bn' ? 'লগইন বা সাইন আপ করুন' : 'Sign In / Register'}
              </button>
              <Link
                href="/"
                style={{
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#475569',
                  backgroundColor: '#F1F5F9',
                  borderRadius: '14px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {language === 'bn' ? 'মার্কেটপ্লেস দেখুন' : 'Explore Marketplace'}
              </Link>
            </div>
          </div>
        </main>
        <Footer language={language} />
        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => {
              setIsAuthModalOpen(false);
              loadUserSession();
            }}
            initialMode="login"
            onAuthSuccess={() => {
              setIsAuthModalOpen(false);
              loadUserSession();
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <Header
        language={language}
        setLanguage={setLanguage}
        activeTab="profile"
        setActiveTab={() => {}}
        currentUser={currentUser}
        onLogout={async () => {
          await AuthService.signOut();
          router.push('/');
        }}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '84px',
            right: '24px',
            zIndex: 1000,
            padding: '12px 20px',
            borderRadius: '14px',
            backgroundColor: toastMessage.type === 'success' ? '#065F46' : '#991B1B',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 700,
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {toastMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {toastMessage.text}
        </div>
      )}

      {/* Main Glassmorphic Layout */}
      <main style={{ flex: 1, maxWidth: '1360px', width: '100%', margin: '0 auto', padding: '24px 16px 80px' }}>
        {/* Top Header Card */}
        <section
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            padding: '24px 28px',
            marginBottom: '24px',
            boxShadow: '0 4px 20px -2px rgba(0, 96, 250, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          {/* Avatar and Welcome Message */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '22px',
                  backgroundColor: BRAND_COLORS.primaryLight,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${BRAND_COLORS.primary}`,
                  boxShadow: '0 8px 16px -4px rgba(0, 96, 250, 0.25)',
                }}
              >
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '28px', fontWeight: 900, color: BRAND_COLORS.primary }}>
                    {profile?.fullName?.charAt(0).toUpperCase() || 'P'}
                  </span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                title={language === 'bn' ? 'ছবি পরিবর্তন করুন' : 'Change avatar'}
                style={{
                  position: 'absolute',
                  bottom: '-6px',
                  right: '-6px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: '2px solid #FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Camera size={13} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#090D14', margin: 0 }}>
                  {language === 'bn' ? `স্বাগতম, ${profile?.fullName}` : `Welcome, ${profile?.fullName}`}
                </h1>
                <span
                  style={{
                    backgroundColor: '#ECFDF5',
                    color: '#059669',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ShieldCheck size={13} /> {language === 'bn' ? 'যাচাইকৃত রোগী' : 'Verified Patient'}
                </span>
              </div>
              <p style={{ color: '#64748B', fontSize: '13.5px', margin: 0 }}>
                {profile?.phone} • {profile?.email || 'No email registered'} • {profile?.district || 'Moulvibazar'}
              </p>
            </div>
          </div>

          {/* Profile Completion Meter */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '12px 20px',
              minWidth: '220px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                {language === 'bn' ? 'প্রোফাইল পূর্ণতা' : 'Profile Completion'}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 900, color: BRAND_COLORS.primary }}>
                {completionPercentage}%
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${completionPercentage}%`,
                  height: '100%',
                  backgroundColor: completionPercentage > 80 ? '#10B981' : BRAND_COLORS.primary,
                  borderRadius: '4px',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
            {completionPercentage < 100 && (
              <span
                onClick={() => setActiveTab('profile')}
                style={{ fontSize: '11px', color: BRAND_COLORS.primary, fontWeight: 700, cursor: 'pointer', display: 'block', marginTop: '6px' }}
              >
                {language === 'bn' ? 'তথ্য সম্পন্ন করুন →' : 'Complete details →'}
              </span>
            )}
          </div>
        </section>

        {/* Dashboard Grid: Sidebar Navigation + Tab Views */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'start' }} className="d-desktop-grid">
          {/* Glassmorphic Sidebar Navigation */}
          <aside
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              borderRadius: '20px',
              padding: '16px 12px',
              boxShadow: '0 4px 16px -2px rgba(0,0,0,0.03)',
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { id: 'overview', labelEn: 'Overview', labelBn: 'একনজরে', icon: Sparkles },
                { id: 'profile', labelEn: 'Personal Info', labelBn: 'ব্যক্তিগত তথ্য', icon: User },
                { id: 'appointments', labelEn: 'My Appointments', labelBn: 'অ্যাপয়েন্টমেন্ট', icon: Calendar, badge: upcomingApts.length },
                { id: 'health', labelEn: 'Health Records', labelBn: 'স্বাস্থ্য ভল্ট', icon: Heart, badge: medicalRecords.length },
                { id: 'family', labelEn: 'Family Members', labelBn: 'পারিবারিক সদস্য', icon: Users, badge: familyMembers.length },
                { id: 'saved', labelEn: 'Saved Providers', labelBn: 'সংরক্ষিত ডাক্তার', icon: Star, badge: savedProviders.length },
                { id: 'notifications', labelEn: 'Notifications', labelBn: 'বিজ্ঞপ্তি', icon: Bell, badge: notifications.filter((n) => !n.isRead).length },
                { id: 'security', labelEn: 'Security & Privacy', labelBn: 'নিরাপত্তা', icon: Lock },
                { id: 'preferences', labelEn: 'Preferences', labelBn: 'পছন্দসমূহ', icon: Settings },
              ].map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as DashboardTab)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: isActive ? BRAND_COLORS.primary : 'transparent',
                      color: isActive ? '#FFFFFF' : '#334155',
                      fontWeight: isActive ? 800 : 600,
                      fontSize: '13.5px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <IconComponent size={16} color={isActive ? '#FFFFFF' : '#64748B'} />
                      <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        style={{
                          backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#EFF6FF',
                          color: isActive ? '#FFFFFF' : BRAND_COLORS.primary,
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '2px 7px',
                          borderRadius: '10px',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '16px', paddingTop: '16px' }}>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#F0FDF4',
                  borderRadius: '12px',
                  border: '1px solid #BBF7D0',
                  marginBottom: '12px',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#166534', marginBottom: '2px' }}>
                  24/7 Patient Helpline
                </div>
                <a
                  href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
                  style={{
                    fontSize: '13px',
                    fontWeight: 900,
                    color: '#15803D',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Phone size={13} /> {BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}
                </a>
              </div>

              <button
                onClick={async () => {
                  await AuthService.signOut();
                  router.push('/');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <LogOut size={15} />
                <span>{language === 'bn' ? 'লগআউট করুন' : 'Sign Out'}</span>
              </button>
            </div>
          </aside>

          {/* Active Tab Panel */}
          <div style={{ minWidth: 0 }}>
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div>
                {/* Metric Cards Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>{language === 'bn' ? 'আসন্ন সিরিয়াল' : 'Upcoming Appointments'}</span>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Calendar size={18} color={BRAND_COLORS.primary} />
                      </div>
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: '#090D14' }}>{upcomingApts.length}</div>
                  </div>

                  <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>{language === 'bn' ? 'সম্পন্ন চিকিৎসা' : 'Completed Visits'}</span>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle2 size={18} color="#10B981" />
                      </div>
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: '#090D14' }}>{completedApts.length}</div>
                  </div>

                  <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>{language === 'bn' ? 'স্বাস্থ্য রিপোর্ট' : 'Health Records'}</span>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={18} color="#9333EA" />
                      </div>
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: '#090D14' }}>{medicalRecords.length}</div>
                  </div>

                  <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>{language === 'bn' ? 'সংরক্ষিত ডাক্তার' : 'Saved Providers'}</span>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star size={18} color="#F59E0B" />
                      </div>
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: '#090D14' }}>{savedProviders.length}</div>
                  </div>
                </div>

                {/* Quick Discovery Action Pills */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0',
                    padding: '20px 24px',
                    marginBottom: '24px',
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#090D14', margin: '0 0 12px 0' }}>
                    {language === 'bn' ? 'দ্রুত সেবা অনুসন্ধান' : 'Find Healthcare Services'}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <Link
                      href="/doctors"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 16px',
                        backgroundColor: '#EFF6FF',
                        color: BRAND_COLORS.primary,
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      <Stethoscope size={16} /> {language === 'bn' ? 'ডাক্তার খুঁজুন' : 'Find Doctors'}
                    </Link>
                    <Link
                      href="/diagnostic-centers"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 16px',
                        backgroundColor: '#ECFDF5',
                        color: '#059669',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      <Building2 size={16} /> {language === 'bn' ? 'ডায়াগনস্টিক সেন্টার' : 'Diagnostic Centers'}
                    </Link>
                    <Link
                      href="/diagnostic-tests"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 16px',
                        backgroundColor: '#F5F3FF',
                        color: '#7C3AED',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      <Sparkles size={16} /> {language === 'bn' ? 'টেস্টের দাম দেখুন' : 'Diagnostic Tests'}
                    </Link>
                    <Link
                      href="/hospitals"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 16px',
                        backgroundColor: '#FFF7ED',
                        color: '#EA580C',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      <Building2 size={16} /> {language === 'bn' ? 'হাসপাতাল খুঁজুন' : 'Hospitals'}
                    </Link>
                  </div>
                </div>

                {/* Upcoming Appointments Quick List */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0',
                    padding: '24px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                      {language === 'bn' ? 'আসন্ন সিরিয়ালের তালিকা' : 'Upcoming Appointments'}
                    </h3>
                    <button
                      onClick={() => setActiveTab('appointments')}
                      style={{
                        color: BRAND_COLORS.primary,
                        fontSize: '13px',
                        fontWeight: 700,
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {language === 'bn' ? 'সকল দেখুন' : 'View all'} <ArrowRight size={14} />
                    </button>
                  </div>

                  {upcomingApts.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {upcomingApts.slice(0, 3).map((apt) => (
                        <div
                          key={apt.id}
                          style={{
                            padding: '16px',
                            backgroundColor: '#F8FAFC',
                            borderRadius: '14px',
                            border: '1px solid #E2E8F0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '12px',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 800, color: BRAND_COLORS.primary, backgroundColor: '#EFF6FF', padding: '2px 8px', borderRadius: '10px' }}>
                                Token #{apt.tokenNumber}
                              </span>
                              <span style={{ fontSize: '12px', color: '#64748B' }}>
                                Code: {apt.bookingCode}
                              </span>
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: 800, color: '#090D14' }}>
                              {apt.doctorName}
                            </div>
                            <div style={{ fontSize: '13px', color: '#64748B' }}>
                              {apt.specialization} • {apt.organizationName}
                            </div>
                            <div style={{ fontSize: '12px', color: '#059669', fontWeight: 700, marginTop: '4px' }}>
                              📅 {apt.appointmentDate} at {apt.startTime}
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedAppointment(apt)}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#0F172A',
                              color: '#FFFFFF',
                              borderRadius: '10px',
                              fontSize: '13px',
                              fontWeight: 700,
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            {language === 'bn' ? 'বিস্তারিত' : 'View Details'}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '36px 16px' }}>
                      <Calendar size={36} color="#CBD5E1" style={{ margin: '0 auto 10px' }} />
                      <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 16px 0' }}>
                        {language === 'bn'
                          ? 'আপনার কোনো আসন্ন অ্যাপয়েন্টমেন্ট নেই।'
                          : 'You have no upcoming appointments scheduled.'}
                      </p>
                      <Link
                        href="/doctors"
                        style={{
                          padding: '10px 20px',
                          backgroundColor: BRAND_COLORS.primary,
                          color: '#FFFFFF',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: 800,
                          textDecoration: 'none',
                          display: 'inline-block',
                        }}
                      >
                        {language === 'bn' ? 'ডাক্তার অ্যাপয়েন্টমেন্ট নিন' : 'Book a Doctor Now'}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: PERSONAL INFORMATION */}
            {activeTab === 'profile' && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  border: '1px solid #E2E8F0',
                  padding: '32px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#090D14', margin: '0 0 4px 0' }}>
                    {language === 'bn' ? 'ব্যক্তিগত তথ্য ও প্রোফাইল' : 'Personal Information'}
                  </h2>
                  <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0 }}>
                    {language === 'bn'
                      ? 'চিকিৎসাসেবা ও সিরিয়াল বুকিংয়ের জন্য আপনার তথ্যাদি সবসময় আপডেট রাখুন।'
                      : 'Keep your healthcare contact details and emergency info up to date.'}
                  </p>
                </div>

                {/* Avatar Management Card */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '28px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '18px',
                        backgroundColor: BRAND_COLORS.primaryLight,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #CBD5E1',
                      }}
                    >
                      {profile?.avatarUrl ? (
                        <img src={profile.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <User size={28} color={BRAND_COLORS.primary} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                        {language === 'bn' ? 'প্রোফাইল ছবি' : 'Profile Avatar'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>
                        PNG, JPG or WebP (Max 5MB)
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={avatarUploading}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: BRAND_COLORS.primary,
                        color: '#FFFFFF',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {avatarUploading ? 'Uploading...' : language === 'bn' ? 'ছবি পরিবর্তন' : 'Upload New'}
                    </button>
                    {profile?.avatarUrl && (
                      <button
                        onClick={handleRemoveAvatar}
                        style={{
                          padding: '8px 14px',
                          backgroundColor: '#FEE2E2',
                          color: '#DC2626',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {language === 'bn' ? 'মুছে ফেলুন' : 'Remove'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Edit Profile Form */}
                <form onSubmit={handleSaveProfile}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        {language === 'bn' ? 'পূর্ণ নাম (Full Name) *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={editProfileForm.fullName || ''}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, fullName: e.target.value })}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        {language === 'bn' ? 'মোবাইল নম্বর (Phone) *' : 'Mobile Phone *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={editProfileForm.phone || ''}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, phone: e.target.value })}
                        placeholder="017XXXXXXXX"
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        {language === 'bn' ? 'ইমেইল এড্রেস (Email)' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        value={editProfileForm.email || ''}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, email: e.target.value })}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        {language === 'bn' ? 'জন্ম তারিখ (Date of Birth)' : 'Date of Birth'}
                      </label>
                      <input
                        type="date"
                        value={editProfileForm.dateOfBirth || ''}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, dateOfBirth: e.target.value })}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        {language === 'bn' ? 'লিঙ্গ (Gender)' : 'Gender'}
                      </label>
                      <select
                        value={editProfileForm.gender || 'PREFER_NOT_TO_SAY'}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, gender: e.target.value as any })}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      >
                        <option value="MALE">Male (পুরুষ)</option>
                        <option value="FEMALE">Female (মহিলা)</option>
                        <option value="OTHER">Other (অন্যান্য)</option>
                        <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        {language === 'bn' ? 'রক্তের গ্রুপ (Blood Group)' : 'Blood Group'}
                      </label>
                      <select
                        value={editProfileForm.bloodGroup || ''}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, bloodGroup: e.target.value })}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        {language === 'bn' ? 'জেলা (District)' : 'District'}
                      </label>
                      <input
                        type="text"
                        value={editProfileForm.district || 'Moulvibazar'}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, district: e.target.value })}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        {language === 'bn' ? 'ঠিকানা (Address)' : 'Detailed Address'}
                      </label>
                      <input
                        type="text"
                        value={editProfileForm.address || ''}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, address: e.target.value })}
                        placeholder="Chowmohana, Moulvibazar Sadar"
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        {language === 'bn' ? 'জরুরি যোগাযোগের ব্যক্তি' : 'Emergency Contact Name'}
                      </label>
                      <input
                        type="text"
                        value={editProfileForm.emergencyContactName || ''}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, emergencyContactName: e.target.value })}
                        placeholder="Family contact name"
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        {language === 'bn' ? 'জরুরি ফোন নম্বর' : 'Emergency Contact Phone'}
                      </label>
                      <input
                        type="text"
                        value={editProfileForm.emergencyContactPhone || ''}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, emergencyContactPhone: e.target.value })}
                        placeholder="018XXXXXXXX"
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      style={{
                        padding: '12px 32px',
                        backgroundColor: BRAND_COLORS.primary,
                        color: '#FFFFFF',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {isSavingProfile ? 'Saving...' : language === 'bn' ? 'তথ্য সংরক্ষণ করুন' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: MY APPOINTMENTS */}
            {activeTab === 'appointments' && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  border: '1px solid #E2E8F0',
                  padding: '28px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#090D14', margin: '0 0 4px 0' }}>
                      {language === 'bn' ? 'আমার অ্যাপয়েন্টমেন্টসমূহ' : 'My Appointments'}
                    </h2>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                      {language === 'bn'
                        ? 'আপনার সকল অনুমোদিত ও পূর্ববর্তী ডাক্তারের সিরিয়াল ট্র্যাক করুন।'
                        : 'Track confirmed tokens, chamber schedules, and serial statuses.'}
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div style={{ display: 'flex', gap: '6px', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '12px' }}>
                    {(['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'] as const).map((flt) => (
                      <button
                        key={flt}
                        onClick={() => setAppointmentFilter(flt)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: appointmentFilter === flt ? 800 : 600,
                          backgroundColor: appointmentFilter === flt ? '#FFFFFF' : 'transparent',
                          color: appointmentFilter === flt ? BRAND_COLORS.primary : '#64748B',
                          cursor: 'pointer',
                          boxShadow: appointmentFilter === flt ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                        }}
                      >
                        {flt}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredAppointments.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                    {filteredAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        style={{
                          backgroundColor: '#F8FAFC',
                          borderRadius: '16px',
                          border: '1px solid #E2E8F0',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 800, color: BRAND_COLORS.primary, backgroundColor: '#EFF6FF', padding: '3px 10px', borderRadius: '12px' }}>
                              Token #{apt.tokenNumber}
                            </span>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 800,
                                padding: '3px 8px',
                                borderRadius: '12px',
                                backgroundColor:
                                  apt.status === 'CONFIRMED'
                                    ? '#ECFDF5'
                                    : (apt.status as string).includes('CANCEL')
                                    ? '#FEF2F2'
                                    : '#F1F5F9',
                                color:
                                  apt.status === 'CONFIRMED'
                                    ? '#059669'
                                    : (apt.status as string).includes('CANCEL')
                                    ? '#DC2626'
                                    : '#475569',
                              }}
                            >
                              {apt.status}
                            </span>
                          </div>

                          <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#090D14', margin: '0 0 4px 0' }}>
                            {apt.doctorName}
                          </h4>
                          <div style={{ fontSize: '13px', color: '#059669', fontWeight: 600, marginBottom: '4px' }}>
                            {apt.specialization}
                          </div>
                          <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: '12px' }}>
                            🏥 {apt.organizationName}
                          </div>

                          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '10px', marginBottom: '14px', fontSize: '12px', color: '#475569' }}>
                            <div>📅 <strong>Date:</strong> {apt.appointmentDate} at {apt.startTime}</div>
                            <div>👤 <strong>Patient:</strong> {apt.patientName} ({apt.patientPhone})</div>
                            <div>💰 <strong>Fee:</strong> ৳{apt.consultationFee} ({apt.paymentStatus})</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
                          <button
                            onClick={() => setSelectedAppointment(apt)}
                            style={{
                              flex: 1,
                              padding: '8px',
                              backgroundColor: '#0F172A',
                              color: '#FFFFFF',
                              borderRadius: '10px',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            {language === 'bn' ? 'বিস্তারিত' : 'Details'}
                          </button>
                          {apt.status === 'CONFIRMED' && (
                            <button
                              onClick={() => setCancellingAppointment(apt)}
                              style={{
                                padding: '8px 12px',
                                backgroundColor: '#FEE2E2',
                                color: '#DC2626',
                                borderRadius: '10px',
                                fontSize: '12px',
                                fontWeight: 700,
                                border: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              {language === 'bn' ? 'বাতিল' : 'Cancel'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px 16px' }}>
                    <Calendar size={44} color="#CBD5E1" style={{ margin: '0 auto 12px' }} />
                    <p style={{ color: '#64748B', fontSize: '15px', margin: '0 0 16px 0' }}>
                      {language === 'bn' ? 'কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি।' : 'No appointments matching this filter.'}
                    </p>
                    <Link
                      href="/doctors"
                      style={{
                        padding: '10px 24px',
                        backgroundColor: BRAND_COLORS.primary,
                        color: '#FFFFFF',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        display: 'inline-block',
                      }}
                    >
                      {language === 'bn' ? 'ডাক্তার খুঁজুন' : 'Find a Doctor'}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: HEALTH INFORMATION & VAULT */}
            {activeTab === 'health' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Health Metrics & Allergies Card */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    border: '1px solid #E2E8F0',
                    padding: '28px',
                  }}
                >
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#090D14', margin: '0 0 6px 0' }}>
                    {language === 'bn' ? 'স্বাস্থ্য প্রোফাইল ও এলার্জি' : 'Health Profile & Allergies'}
                  </h2>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 20px 0' }}>
                    {language === 'bn'
                      ? 'জরুরি চিকিৎসার সময় ডাক্তারকে অবহিত করার জন্য আপনার অ্যালার্জি ও নিয়মিত ওষুধ নথিভুক্ত করুন।'
                      : 'Record your known allergies and current daily medications for safer consultations.'}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {/* Allergies Section */}
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                        {language === 'bn' ? 'জ্ঞাত এলার্জি (Allergies)' : 'Known Allergies'}
                      </label>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <input
                          type="text"
                          value={newAllergy}
                          onChange={(e) => setNewAllergy(e.target.value)}
                          placeholder="e.g., Penicillin, Dust, Seafood"
                          style={{ flex: 1, padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                        />
                        <button
                          onClick={handleAddAllergy}
                          style={{
                            padding: '9px 16px',
                            backgroundColor: BRAND_COLORS.primary,
                            color: '#FFFFFF',
                            borderRadius: '10px',
                            border: 'none',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {language === 'bn' ? 'যোগ' : 'Add'}
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {medicalProfile?.allergies && medicalProfile.allergies.length > 0 ? (
                          medicalProfile.allergies.map((alg) => (
                            <span
                              key={alg}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 10px',
                                backgroundColor: '#FEE2E2',
                                color: '#991B1B',
                                borderRadius: '14px',
                                fontSize: '12px',
                                fontWeight: 700,
                              }}
                            >
                              {alg}
                              <button
                                onClick={() => handleRemoveAllergy(alg)}
                                style={{ background: 'none', border: 'none', color: '#991B1B', cursor: 'pointer', padding: 0 }}
                              >
                                ✕
                              </button>
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '13px', color: '#94A3B8' }}>No allergies recorded yet</span>
                        )}
                      </div>
                    </div>

                    {/* Medications Section */}
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                        {language === 'bn' ? 'নিয়মিত ওষুধ (Current Medications)' : 'Current Medications'}
                      </label>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <input
                          type="text"
                          value={newMedication}
                          onChange={(e) => setNewMedication(e.target.value)}
                          placeholder="e.g., Metformin 500mg, Losartan"
                          style={{ flex: 1, padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                        />
                        <button
                          onClick={handleAddMedication}
                          style={{
                            padding: '9px 16px',
                            backgroundColor: BRAND_COLORS.primary,
                            color: '#FFFFFF',
                            borderRadius: '10px',
                            border: 'none',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {language === 'bn' ? 'যোগ' : 'Add'}
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {medicalProfile?.currentMedications && medicalProfile.currentMedications.length > 0 ? (
                          medicalProfile.currentMedications.map((med) => (
                            <span
                              key={med}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 10px',
                                backgroundColor: '#EFF6FF',
                                color: '#1E40AF',
                                borderRadius: '14px',
                                fontSize: '12px',
                                fontWeight: 700,
                              }}
                            >
                              {med}
                              <button
                                onClick={() => handleRemoveMedication(med)}
                                style={{ background: 'none', border: 'none', color: '#1E40AF', cursor: 'pointer', padding: 0 }}
                              >
                                ✕
                              </button>
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '13px', color: '#94A3B8' }}>No medications recorded</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Encrypted Documents Vault */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    border: '1px solid #E2E8F0',
                    padding: '28px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#090D14', margin: '0 0 4px 0' }}>
                        {language === 'bn' ? 'প্রেসক্রিপশন ও ডায়াগনস্টিক রিপোর্ট ভল্ট' : 'Prescription & Medical Records Vault'}
                      </h2>
                      <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                        {language === 'bn'
                          ? 'আপনার ল্যাব রিপোর্ট ও প্রেসক্রিপশন নিরাপদে ক্লাউডে সংরক্ষণ করুন।'
                          : 'Securely encrypted PDF and image health reports accessible via signed links.'}
                      </p>
                    </div>

                    <button
                      onClick={() => docFileInputRef.current?.click()}
                      disabled={isUploadingDoc}
                      style={{
                        padding: '10px 18px',
                        backgroundColor: '#0F172A',
                        color: '#FFFFFF',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Upload size={15} />
                      {isUploadingDoc ? 'Uploading...' : language === 'bn' ? 'নথি আপলোড করুন' : 'Upload Document'}
                    </button>
                    <input
                      ref={docFileInputRef}
                      type="file"
                      accept="application/pdf,image/png,image/jpeg"
                      style={{ display: 'none' }}
                      onChange={handleUploadMedicalDocument}
                    />
                  </div>

                  {medicalRecords.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                      {medicalRecords.map((doc) => (
                        <div
                          key={doc.id}
                          style={{
                            padding: '16px',
                            backgroundColor: '#F8FAFC',
                            borderRadius: '16px',
                            border: '1px solid #E2E8F0',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: BRAND_COLORS.primary }}>
                                {doc.recordType.toUpperCase()}
                              </span>
                              <span style={{ fontSize: '11px', color: '#64748B' }}>{doc.recordDate}</span>
                            </div>
                            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#090D14', margin: '0 0 4px 0' }}>
                              {doc.title}
                            </h4>
                            <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 12px 0' }}>
                              {doc.fileName}
                            </p>
                          </div>
                          <a
                            href={doc.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '8px 14px',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #CBD5E1',
                              borderRadius: '10px',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              color: BRAND_COLORS.primary,
                              textAlign: 'center',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                            }}
                          >
                            <Download size={14} /> {language === 'bn' ? 'নথি দেখুন' : 'View File'}
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '36px 16px', backgroundColor: '#F8FAFC', borderRadius: '16px' }}>
                      <FileText size={36} color="#CBD5E1" style={{ margin: '0 auto 10px' }} />
                      <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
                        {language === 'bn' ? 'কোনো চিকিৎসা নথি সংরক্ষিত নেই।' : 'No health records uploaded yet.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: FAMILY MEMBERS */}
            {activeTab === 'family' && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  border: '1px solid #E2E8F0',
                  padding: '28px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#090D14', margin: '0 0 4px 0' }}>
                      {language === 'bn' ? 'পারিবারিক সদস্য ও নির্ভরশীল' : 'Family Members & Dependents'}
                    </h2>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                      {language === 'bn'
                        ? 'মা-বাবা বা সন্তানের জন্য সহজে সিরিয়াল বুকিং করতে সদস্য যুক্ত রাখুন।'
                        : 'Manage profiles for children, parents, and spouses for one-click appointment booking.'}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddFamilyOpen(true)}
                    style={{
                      padding: '10px 18px',
                      backgroundColor: BRAND_COLORS.primary,
                      color: '#FFFFFF',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Plus size={16} /> {language === 'bn' ? 'নতুন সদস্য যুক্ত করুন' : 'Add Family Member'}
                  </button>
                </div>

                {familyMembers.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {familyMembers.map((fam) => (
                      <div
                        key={fam.id}
                        style={{
                          backgroundColor: '#F8FAFC',
                          borderRadius: '16px',
                          border: '1px solid #E2E8F0',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '10px' }}>
                              {fam.relationship}
                            </span>
                            {fam.bloodGroup && (
                              <span style={{ fontSize: '12px', fontWeight: 800, color: '#991B1B', backgroundColor: '#FEE2E2', padding: '2px 8px', borderRadius: '10px' }}>
                                {fam.bloodGroup}
                              </span>
                            )}
                          </div>
                          <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#090D14', margin: '0 0 4px 0' }}>
                            {fam.fullName}
                          </h4>
                          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                            {fam.gender} • {fam.age ? `${fam.age} years old` : 'Age not specified'}
                          </p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
                          <Link
                            href="/doctors"
                            style={{
                              fontSize: '12px',
                              fontWeight: 700,
                              color: BRAND_COLORS.primary,
                              textDecoration: 'none',
                            }}
                          >
                            {language === 'bn' ? 'সিরিয়াল নিন →' : 'Book Chamber →'}
                          </Link>
                          <button
                            onClick={() => handleDeleteFamilyMember(fam.id)}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: '#EF4444',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                            title="Remove member"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px 16px' }}>
                    <Users size={44} color="#CBD5E1" style={{ margin: '0 auto 12px' }} />
                    <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 16px 0' }}>
                      {language === 'bn'
                        ? 'কোনো পারিবারিক সদস্য যুক্ত করা নেই।'
                        : 'No family member profiles added yet.'}
                    </p>
                    <button
                      onClick={() => setIsAddFamilyOpen(true)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: BRAND_COLORS.primary,
                        color: '#FFFFFF',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {language === 'bn' ? 'সদস্য যোগ করুন' : 'Add First Member'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: SAVED PROVIDERS */}
            {activeTab === 'saved' && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  border: '1px solid #E2E8F0',
                  padding: '28px',
                }}
              >
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#090D14', margin: '0 0 4px 0' }}>
                    {language === 'bn' ? 'সংরক্ষিত ডাক্তার ও স্বাস্থ্য প্রতিষ্ঠান' : 'Saved Doctors & Healthcare Providers'}
                  </h2>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                    {language === 'bn'
                      ? 'ভবিষ্যতে সহজে খুঁজে পাওয়ার জন্য আপনার পছন্দের ডাক্তার ও হাসপাতালসমূহ।'
                      : 'Bookmarks for preferred specialist doctors, laboratories, and hospitals.'}
                  </p>
                </div>

                {savedProviders.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {savedProviders.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          backgroundColor: '#F8FAFC',
                          borderRadius: '16px',
                          border: '1px solid #E2E8F0',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: BRAND_COLORS.primary, backgroundColor: '#EFF6FF', padding: '2px 8px', borderRadius: '10px' }}>
                              {item.entityType.toUpperCase()}
                            </span>
                            <button
                              onClick={() => handleRemoveSavedProvider(item)}
                              style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 0 }}
                              title="Unsave"
                            >
                              <Star size={18} fill="#EF4444" color="#EF4444" />
                            </button>
                          </div>

                          <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#090D14', margin: '0 0 4px 0' }}>
                            {item.doctor?.fullName || item.organization?.name || 'Healthcare Provider'}
                          </h4>
                          <p style={{ fontSize: '13px', color: '#059669', fontWeight: 600, margin: '0 0 6px 0' }}>
                            {item.doctor?.specialization || item.organization?.orgType || 'Medical Services'}
                          </p>
                          <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                            {item.doctor ? `BMDC: ${item.doctor.bmdcNumber}` : item.organization?.contactPhone}
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
                          <Link
                            href={item.entityType === 'doctor' ? `/doctors/${item.entityId}` : `/hospitals/${item.entityId}`}
                            style={{
                              flex: 1,
                              padding: '8px',
                              backgroundColor: '#0F172A',
                              color: '#FFFFFF',
                              borderRadius: '10px',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              textDecoration: 'none',
                              textAlign: 'center',
                            }}
                          >
                            {language === 'bn' ? 'প্রোফাইল দেখুন' : 'View Profile'}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px 16px' }}>
                    <Star size={44} color="#CBD5E1" style={{ margin: '0 auto 12px' }} />
                    <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 16px 0' }}>
                      {language === 'bn'
                        ? 'আপনার সংরক্ষিত কোনো ডাক্তার নেই।'
                        : 'You haven’t saved any doctors or healthcare facilities yet.'}
                    </p>
                    <Link
                      href="/doctors"
                      style={{
                        padding: '10px 24px',
                        backgroundColor: BRAND_COLORS.primary,
                        color: '#FFFFFF',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        display: 'inline-block',
                      }}
                    >
                      {language === 'bn' ? 'ডাক্তার তালিকায় যান' : 'Browse Doctor Directory'}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB 7: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  border: '1px solid #E2E8F0',
                  padding: '28px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                    {language === 'bn' ? 'বিজ্ঞপ্তি ও অ্যালার্ট' : 'Notifications & Alerts'}
                  </h2>
                  <span style={{ fontSize: '13px', color: '#64748B' }}>
                    {notifications.length} {language === 'bn' ? 'টি বার্তা' : 'total'}
                  </span>
                </div>

                {notifications.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleMarkNotificationRead(notif.id)}
                        style={{
                          padding: '16px',
                          borderRadius: '14px',
                          border: '1px solid #E2E8F0',
                          backgroundColor: notif.isRead ? '#FFFFFF' : '#EFF6FF',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: notif.isRead ? '#CBD5E1' : BRAND_COLORS.primary,
                              marginTop: '6px',
                            }}
                          />
                          <div>
                            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#090D14', margin: '0 0 2px 0' }}>
                              {language === 'bn' && notif.titleBn ? notif.titleBn : notif.title}
                            </h4>
                            <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 4px 0' }}>
                              {language === 'bn' && notif.messageBn ? notif.messageBn : notif.message}
                            </p>
                            <span style={{ fontSize: '11px', color: '#94A3B8' }}>{notif.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px 16px' }}>
                    <Bell size={44} color="#CBD5E1" style={{ margin: '0 auto 12px' }} />
                    <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
                      {language === 'bn' ? 'কোনো নতুন বিজ্ঞপ্তি নেই।' : 'No notifications yet.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 8: SECURITY & PRIVACY */}
            {activeTab === 'security' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Password Change Card */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    border: '1px solid #E2E8F0',
                    padding: '28px',
                  }}
                >
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#090D14', margin: '0 0 6px 0' }}>
                    {language === 'bn' ? 'অ্যাকাউন্ট নিরাপত্তা ও পাসওয়ার্ড' : 'Security & Password'}
                  </h2>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 20px 0' }}>
                    {language === 'bn'
                      ? 'আপনার অ্যাকাউন্টের সুরক্ষার জন্য নিয়মিত শক্তিশালী পাসওয়ার্ড ব্যবহার করুন।'
                      : 'Update your login password securely using Supabase authentication.'}
                  </p>

                  <form onSubmit={handleUpdatePassword} style={{ maxWidth: '440px' }}>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        {language === 'bn' ? 'নতুন পাসওয়ার্ড (New Password)' : 'New Password'}
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        {language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন (Confirm Password)' : 'Confirm New Password'}
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      />
                    </div>

                    {passwordError && (
                      <p style={{ color: '#DC2626', fontSize: '12.5px', fontWeight: 700, marginBottom: '14px' }}>
                        {passwordError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isUpdatingPassword}
                      style={{
                        padding: '11px 24px',
                        backgroundColor: '#0F172A',
                        color: '#FFFFFF',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {isUpdatingPassword ? 'Updating...' : language === 'bn' ? 'পাসওয়ার্ড আপডেট করুন' : 'Update Password'}
                    </button>
                  </form>
                </div>

                {/* Privacy Preferences */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    border: '1px solid #E2E8F0',
                    padding: '28px',
                  }}
                >
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', margin: '0 0 16px 0' }}>
                    {language === 'bn' ? 'গোপনীয়তা ও ডেটা অনুমতি' : 'Data Privacy & Consent Controls'}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#090D14' }}>
                          {language === 'bn' ? 'ডাক্তারের সাথে পূর্বের প্রেসক্রিপশন শেয়ার' : 'Share Medical History with Doctors'}
                        </div>
                        <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                          {language === 'bn' ? 'কনসালটেশনের সময় পূর্বের রিপোর্ট দেখতে অনুমতি দিন' : 'Allow authorized doctors to review past lab records during consultation'}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacySettings.shareMedicalHistoryWithDoctors}
                        onChange={async (e) => {
                          const updated = { ...privacySettings, shareMedicalHistoryWithDoctors: e.target.checked };
                          setPrivacySettings(updated);
                          if (currentUser) await PatientService.updatePrivacySettings(currentUser.id, updated);
                        }}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '14px' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#090D14' }}>
                          {language === 'bn' ? 'জরুরি চিকিৎসা এক্সেস' : 'Emergency Access Permission'}
                        </div>
                        <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                          {language === 'bn' ? 'জরুরি মুহূর্তে হাসপাতাল স্টাফদের রক্তের গ্রুপ দেখার অনুমতি' : 'Allow hospital emergency departments to view verified blood group'}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacySettings.allowEmergencyAccess}
                        onChange={async (e) => {
                          const updated = { ...privacySettings, allowEmergencyAccess: e.target.checked };
                          setPrivacySettings(updated);
                          if (currentUser) await PatientService.updatePrivacySettings(currentUser.id, updated);
                        }}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 9: PREFERENCES */}
            {activeTab === 'preferences' && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  border: '1px solid #E2E8F0',
                  padding: '28px',
                }}
              >
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#090D14', margin: '0 0 16px 0' }}>
                  {language === 'bn' ? 'ভাষা ও নোটিফিকেশন পছন্দসমূহ' : 'Language & Notification Preferences'}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '520px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      {language === 'bn' ? 'ডিফল্ট ভাষা নির্বাচন' : 'Interface Language'}
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={async () => {
                          setLanguage('en');
                          if (currentUser) await AuthService.updateLanguagePreference(currentUser.id, 'en');
                        }}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '12px',
                          border: `2px solid ${language === 'en' ? BRAND_COLORS.primary : '#E2E8F0'}`,
                          backgroundColor: language === 'en' ? '#EFF6FF' : '#FFFFFF',
                          color: language === 'en' ? BRAND_COLORS.primary : '#475569',
                          fontWeight: 800,
                          fontSize: '14px',
                          cursor: 'pointer',
                        }}
                      >
                        English
                      </button>
                      <button
                        onClick={async () => {
                          setLanguage('bn');
                          if (currentUser) await AuthService.updateLanguagePreference(currentUser.id, 'bn');
                        }}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '12px',
                          border: `2px solid ${language === 'bn' ? BRAND_COLORS.primary : '#E2E8F0'}`,
                          backgroundColor: language === 'bn' ? '#EFF6FF' : '#FFFFFF',
                          color: language === 'bn' ? BRAND_COLORS.primary : '#475569',
                          fontWeight: 800,
                          fontSize: '14px',
                          cursor: 'pointer',
                        }}
                      >
                        বাংলা (Bangla)
                      </button>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#090D14', marginBottom: '12px' }}>
                      {language === 'bn' ? 'যোগাযোগের চ্যানেল' : 'Notification Alerts'}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#334155', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={preferences.smsNotifications}
                          onChange={async (e) => {
                            const updated = { ...preferences, smsNotifications: e.target.checked };
                            setPreferences(updated);
                            if (currentUser) await PatientService.updateUserPreferences(currentUser.id, updated);
                          }}
                          style={{ width: '16px', height: '16px' }}
                        />
                        {language === 'bn' ? 'সিরিয়াল কনফার্মেশন SMS বার্তা' : 'SMS Appointment Reminders'}
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#334155', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={preferences.emailNotifications}
                          onChange={async (e) => {
                            const updated = { ...preferences, emailNotifications: e.target.checked };
                            setPreferences(updated);
                            if (currentUser) await PatientService.updateUserPreferences(currentUser.id, updated);
                          }}
                          style={{ width: '16px', height: '16px' }}
                        />
                        {language === 'bn' ? 'ইমেইল রিপোর্ট ডেলিভারি নোটিশ' : 'Email Diagnostic Report Delivery Alerts'}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL 1: Appointment Details Modal */}
      {selectedAppointment && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(9, 13, 20, 0.65)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 900, color: BRAND_COLORS.primary, backgroundColor: '#EFF6FF', padding: '3px 10px', borderRadius: '12px' }}>
                  Token #{selectedAppointment.tokenNumber}
                </span>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Code: {selectedAppointment.bookingCode}</span>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', color: '#94A3B8', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#090D14', margin: '0 0 4px 0' }}>
              {selectedAppointment.doctorName}
            </h3>
            <p style={{ fontSize: '14px', color: '#059669', fontWeight: 700, margin: '0 0 16px 0' }}>
              {selectedAppointment.specialization}
            </p>

            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '16px', border: '1px solid #E2E8F0', marginBottom: '20px', fontSize: '13px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>🏥 <strong>Chamber:</strong> {selectedAppointment.organizationName}</div>
              <div>📅 <strong>Date:</strong> {selectedAppointment.appointmentDate} at {selectedAppointment.startTime}</div>
              <div>👤 <strong>Patient:</strong> {selectedAppointment.patientName}</div>
              <div>📞 <strong>Phone:</strong> {selectedAppointment.patientPhone}</div>
              <div>💰 <strong>Fee:</strong> ৳{selectedAppointment.consultationFee} ({selectedAppointment.paymentStatus})</div>
              <div>ℹ️ <strong>Status:</strong> {selectedAppointment.status}</div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
                style={{
                  flex: 1,
                  padding: '11px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  textAlign: 'center',
                }}
              >
                Call Chamber Support
              </a>
              <button
                onClick={() => setSelectedAppointment(null)}
                style={{
                  padding: '11px 20px',
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Cancel Appointment Confirmation Modal */}
      {cancellingAppointment && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(9, 13, 20, 0.65)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '480px',
              width: '100%',
            }}
          >
            <h3 style={{ fontSize: '19px', fontWeight: 900, color: '#991B1B', margin: '0 0 10px 0' }}>
              {language === 'bn' ? 'অ্যাপয়েন্টমেন্ট বাতিল নিশ্চিতকরণ' : 'Cancel Appointment Confirmation'}
            </h3>
            <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              Are you sure you want to cancel the booking for <strong>{cancellingAppointment.doctorName}</strong> on {cancellingAppointment.appointmentDate}?
            </p>

            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Reason for cancellation (optional):
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Patient feeling better, timing conflict"
              rows={3}
              style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '13px', marginBottom: '20px' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setCancellingAppointment(null)}
                style={{ padding: '10px 18px', backgroundColor: '#F1F5F9', color: '#475569', borderRadius: '12px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancelAppointment}
                disabled={isCancelling}
                style={{ padding: '10px 20px', backgroundColor: '#DC2626', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: 800, border: 'none', cursor: 'pointer' }}
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Family Member Modal */}
      {isAddFamilyOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(9, 13, 20, 0.65)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '460px',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#090D14', margin: 0 }}>
                {language === 'bn' ? 'নতুন পারিবারিক সদস্য যুক্ত করুন' : 'Add Dependent Profile'}
              </h3>
              <button onClick={() => setIsAddFamilyOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', color: '#94A3B8', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFamilyMember}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={famName}
                  onChange={(e) => setFamName(e.target.value)}
                  placeholder="e.g. Mohammad Ali"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Relationship *
                  </label>
                  <select
                    value={famRelation}
                    onChange={(e) => setFamRelation(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  >
                    <option value="Father">Father (পিতা)</option>
                    <option value="Mother">Mother (মাতা)</option>
                    <option value="Spouse">Spouse (স্বামী/স্ত্রী)</option>
                    <option value="Child">Child (সন্তান)</option>
                    <option value="Sibling">Sibling (ভাই/বোন)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Gender *
                  </label>
                  <select
                    value={famGender}
                    onChange={(e) => setFamGender(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    value={famAge}
                    onChange={(e) => setFamAge(e.target.value)}
                    placeholder="e.g. 48"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Blood Group
                  </label>
                  <select
                    value={famBlood}
                    onChange={(e) => setFamBlood(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddFamilyOpen(false)}
                  style={{ padding: '10px 16px', backgroundColor: '#F1F5F9', color: '#475569', borderRadius: '10px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', backgroundColor: BRAND_COLORS.primary, color: '#FFFFFF', borderRadius: '10px', fontSize: '13px', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer language={language} />
    </div>
  );
}
