'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import PasswordInput from './PasswordInput';
import FormField from './FormField';
import { AuthError, AuthSuccess } from './AuthAlerts';
import { BRAND_COLORS } from '@/config/brand';
import LoadingButton from './LoadingButton';
import { Building2, PhoneCall, Stethoscope, User, ShieldCheck, CheckCircle2, ArrowRight, Award, MapPin, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: (user: AuthUserProfile) => void;
  onNavigateToRegister?: () => void;
  onNavigateToForgot?: () => void;
  redirectTo?: string;
  isModal?: boolean;
  onClose?: () => void;
  initialRole?: 'ALL' | 'DOCTOR' | 'HOSPITAL' | 'PATIENT';
  targetAudience?: 'patient' | 'provider' | 'all';
  initialMode?: 'login' | 'register';
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onNavigateToRegister,
  onNavigateToForgot,
  redirectTo,
  isModal = false,
  onClose,
  initialRole = 'ALL',
  targetAudience = 'all',
  initialMode = 'login',
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();

  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);
  const [activePersona, setActivePersona] = useState<'ALL' | 'DOCTOR' | 'HOSPITAL' | 'PATIENT'>(() => {
    if (targetAudience === 'patient') return 'PATIENT';
    if (targetAudience === 'provider') return initialRole === 'HOSPITAL' ? 'HOSPITAL' : 'DOCTOR';
    return initialRole;
  });
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Doctor Registration State
  const [docFullName, setDocFullName] = useState('');
  const [docBmdc, setDocBmdc] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docEmail, setDocEmail] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('General Medicine');
  const [docQualifications, setDocQualifications] = useState('MBBS');
  const [docFee, setDocFee] = useState('800');
  const [docPassword, setDocPassword] = useState('');
  const [docConfirmPassword, setDocConfirmPassword] = useState('');
  const [docAgreeTerms, setDocAgreeTerms] = useState(false);

  // Hospital Registration State
  const [hospType, setHospType] = useState<'HOSPITAL' | 'DIAGNOSTIC_CENTER' | 'CLINIC'>('HOSPITAL');
  const [hospName, setHospName] = useState('');
  const [hospLicense, setHospLicense] = useState('');
  const [hospDistrict, setHospDistrict] = useState('Dhaka');
  const [hospContactPerson, setHospContactPerson] = useState('');
  const [hospPhone, setHospPhone] = useState('');
  const [hospEmail, setHospEmail] = useState('');
  const [hospPassword, setHospPassword] = useState('');
  const [hospConfirmPassword, setHospConfirmPassword] = useState('');
  const [hospAgreeTerms, setHospAgreeTerms] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const portalParam = searchParams?.get('portal') || searchParams?.get('role');
    const modeParam = searchParams?.get('mode');
    if (modeParam === 'register') setAuthMode('register');
    else if (modeParam === 'login') setAuthMode('login');

    if (portalParam) {
      const lower = portalParam.toLowerCase();
      if (lower.includes('doctor')) setActivePersona('DOCTOR');
      else if (lower.includes('hospital') || lower.includes('provider') || lower.includes('diagnostic')) setActivePersona('HOSPITAL');
      else if (lower.includes('patient')) setActivePersona('PATIENT');
    }
  }, [searchParams]);

  const validate = (): boolean => {
    const errors: { identifier?: string; password?: string } = {};

    const cleanId = identifier.trim();
    if (!cleanId) {
      errors.identifier =
        language === 'bn'
          ? 'মোবাইল নম্বর অথবা ইমেইল ঠিকানা প্রদান করুন।'
          : 'Please enter your mobile number or email.';
    } else if (!cleanId.includes('@')) {
      const normalizedPhone = AuthService.normalizePhoneNumber(cleanId);
      if (!AuthService.isValidBangladeshPhone(normalizedPhone)) {
        errors.identifier =
          language === 'bn'
            ? 'সঠিক ১১-সংখ্যার বাংলাদেশী মোবাইল নম্বর লিখুন (০১XXXXXXXXX)।'
            : 'Enter a valid 11-digit Bangladesh phone number (01XXXXXXXXX).';
      }
    }

    if (!password) {
      errors.password =
        language === 'bn' ? 'পাসওয়ার্ড প্রদান করুন।' : 'Please enter your password.';
    } else if (password.length < 6) {
      errors.password =
        language === 'bn'
          ? 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।'
          : 'Password must be at least 6 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validate()) return;

    setLoading(true);

    try {
      const result = await AuthService.signIn(identifier, password);

      if (result.error) {
        if (result.isSuspended) {
          setErrorMessage(t.authLoginAccountSuspended || 'This account has been suspended. Please contact customer care.');
        } else if (
          result.error.toLowerCase().includes('invalid') ||
          result.error.toLowerCase().includes('credentials')
        ) {
          setErrorMessage(
            language === 'bn'
              ? 'মোবাইল নম্বর/ইমেইল অথবা পাসওয়ার্ড সঠিক নয়। পুনরায় চেষ্টা করুন।'
              : 'The mobile number/email or password you entered is incorrect. Please try again.'
          );
        } else {
          setErrorMessage(result.error);
        }
        setLoading(false);
        return;
      }

      const role = result.profile?.primaryRole || 'PATIENT';
      let destinationTitle = language === 'bn' ? 'লগইন সফল হয়েছে!' : 'Login Successful!';
      if (role === 'DOCTOR' || role === 'DOCTOR_ASSISTANT') {
        destinationTitle = language === 'bn' ? 'ডাক্তার পোর্টালে স্বাগতম...' : 'Welcome to Doctor Clinical Portal...';
      } else if (['HOSPITAL_ADMIN', 'DIAGNOSTIC_ADMIN', 'CLINIC_ADMIN', 'DIAGNOSTIC_STAFF', 'HOSPITAL_STAFF'].includes(role)) {
        destinationTitle = language === 'bn' ? 'হাসপাতাল ও ডায়াগনস্টিক পোর্টালে স্বাগতম...' : 'Welcome to Hospital & Diagnostic Center Portal...';
      } else if (role === 'SUPER_ADMIN') {
        destinationTitle = language === 'bn' ? 'এডমিন কনসোলে স্বাগতম...' : 'Welcome to Admin Console...';
      }

      setSuccessMessage(destinationTitle);

      if (typeof window !== 'undefined' && rememberMe) {
        localStorage.setItem('dc_remember_me', 'true');
      }

      if (result.profile && onSuccess) {
        setTimeout(() => {
          onSuccess(result.profile!);
          // If Doctor or Hospital Admin logged in via modal on public pages, guide them to their workspace
          if (['DOCTOR', 'DOCTOR_ASSISTANT'].includes(role)) {
            window.location.href = '/doctor/portal';
          } else if (['HOSPITAL_ADMIN', 'DIAGNOSTIC_ADMIN', 'CLINIC_ADMIN'].includes(role)) {
            window.location.href = '/hospital/portal';
          }
        }, 300);
      } else {
        const target = redirectTo || result.redirectPath || '/';
        setTimeout(() => {
          if (isModal) {
            window.location.href = target;
          } else {
            router.push(target);
          }
        }, 400);
      }
    } catch (err: any) {
      const msg = err.message || '';
      setErrorMessage(
        msg.toLowerCase().includes('fetch')
          ? (t.authLoginNetworkError || 'Network connection issue. Please check your internet connection.')
          : (msg || 'An unexpected error occurred during login.')
      );
      setLoading(false);
    }
  };

  // DOCTOR REGISTRATION SUBMIT
  const handleDoctorRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!docFullName.trim() || docFullName.trim().length < 3) {
      errors.docFullName = language === 'bn' ? 'ডাক্তারের পূর্ণ নাম লিখুন (কমপক্ষে ৩ অক্ষর)।' : "Doctor's full name is required (min 3 chars).";
    }
    if (!docBmdc.trim() || docBmdc.trim().length < 3) {
      errors.docBmdc = language === 'bn' ? 'সঠিক বিএমডিসি রেজিস্ট্রেশন নম্বর লিখুন (যেমন A-12345)।' : 'Valid BMDC Registration Number required (e.g. A-12345).';
    }
    const cleanPhone = AuthService.normalizePhoneNumber(docPhone);
    if (!AuthService.isValidBangladeshPhone(cleanPhone)) {
      errors.docPhone = language === 'bn' ? 'সঠিক ১১-সংখ্যার বাংলাদেশী মোবাইল নম্বর লিখুন (০১XXXXXXXXX)।' : 'Valid 11-digit Bangladesh phone required (01XXXXXXXXX).';
    }
    if (docEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(docEmail.trim())) {
      errors.docEmail = language === 'bn' ? 'সঠিক ইমেইল ঠিকানা লিখুন।' : 'Please enter a valid email address.';
    }
    if (!docPassword || docPassword.length < 8) {
      errors.docPassword = language === 'bn' ? 'পাসওয়ার্ড ন্যূনতম ৮ অক্ষরের হতে হবে।' : 'Password must be at least 8 characters.';
    }
    if (docPassword !== docConfirmPassword) {
      errors.docConfirmPassword = language === 'bn' ? 'পাসওয়ার্ড মিলছে না।' : 'Passwords do not match.';
    }
    if (!docAgreeTerms) {
      errors.docAgreeTerms = language === 'bn' ? 'শর্তাবলী ও বিএমডিসি আচরণবিধি সম্মতি আবশ্যক।' : 'You must confirm terms and BMDC code of conduct.';
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.registerDoctor({
        fullName: docFullName.trim().startsWith('Dr.') ? docFullName.trim() : `Dr. ${docFullName.trim()}`,
        bmdcNumber: docBmdc.trim(),
        phone: docPhone.trim(),
        email: docEmail.trim() || undefined,
        password: docPassword,
        specialty: docSpecialty,
        qualifications: docQualifications.trim(),
        consultationFee: Number(docFee) || 800,
        language,
      });

      if (result.error) {
        setErrorMessage(result.error);
        setLoading(false);
        return;
      }

      setSuccessMessage(
        language === 'bn'
          ? 'ডাক্তার একাউন্ট সফলভাবে তৈরি হয়েছে! ড্যাশবোর্ডে প্রবেশ করানো হচ্ছে...'
          : 'Doctor account created successfully! Redirecting to Doctor Portal...'
      );

      setTimeout(() => {
        if (onSuccess && result.profile) onSuccess(result.profile);
        window.location.href = '/doctor/portal';
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Doctor account creation failed.');
      setLoading(false);
    }
  };

  // HOSPITAL REGISTRATION SUBMIT
  const handleHospitalRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!hospName.trim() || hospName.trim().length < 3) {
      errors.hospName = language === 'bn' ? 'প্রতিষ্ঠানের নাম লিখুন (কমপক্ষে ৩ অক্ষর)।' : 'Institution / Facility name is required (min 3 chars).';
    }
    if (!hospContactPerson.trim() || hospContactPerson.trim().length < 3) {
      errors.hospContactPerson = language === 'bn' ? 'দায়িত্বপ্রাপ্ত ব্যক্তির নাম লিখুন।' : 'Authorized contact person name is required.';
    }
    const cleanPhone = AuthService.normalizePhoneNumber(hospPhone);
    if (!AuthService.isValidBangladeshPhone(cleanPhone)) {
      errors.hospPhone = language === 'bn' ? 'সঠিক ১১-সংখ্যার প্রাতিষ্ঠানিক মোবাইল নম্বর দিন (০১XXXXXXXXX)।' : 'Valid 11-digit mobile number required (01XXXXXXXXX).';
    }
    if (hospEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(hospEmail.trim())) {
      errors.hospEmail = language === 'bn' ? 'সঠিক ইমেইল ঠিকানা দিন।' : 'Please enter a valid email address.';
    }
    if (!hospPassword || hospPassword.length < 8) {
      errors.hospPassword = language === 'bn' ? 'পাসওয়ার্ড ন্যূনতম ৮ অক্ষরের হতে হবে।' : 'Password must be at least 8 characters.';
    }
    if (hospPassword !== hospConfirmPassword) {
      errors.hospConfirmPassword = language === 'bn' ? 'পাসওয়ার্ড মিলছে না।' : 'Passwords do not match.';
    }
    if (!hospAgreeTerms) {
      errors.hospAgreeTerms = language === 'bn' ? 'শর্তাবলী ও স্বাস্থ্য অধিদপ্তর নির্দেশিকা সম্মতি আবশ্যক।' : 'You must agree to terms and DGHS regulations.';
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.registerHospital({
        hospitalName: hospName.trim(),
        contactPerson: hospContactPerson.trim(),
        phone: hospPhone.trim(),
        email: hospEmail.trim() || undefined,
        password: hospPassword,
        licenseNumber: hospLicense.trim() || undefined,
        district: hospDistrict,
        language,
      });

      if (result.error) {
        setErrorMessage(result.error);
        setLoading(false);
        return;
      }

      setSuccessMessage(
        language === 'bn'
          ? 'প্রতিষ্ঠান সফলভাবে নিবন্ধিত হয়েছে! পোর্টালে প্রবেশ করানো হচ্ছে...'
          : 'Provider registered successfully! Redirecting to Hospital Portal...'
      );

      setTimeout(() => {
        if (onSuccess && result.profile) onSuccess(result.profile);
        window.location.href = '/hospital/portal';
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Hospital registration failed.');
      setLoading(false);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register') {
      if (activePersona === 'DOCTOR') {
        handleDoctorRegisterSubmit(e);
      } else {
        handleHospitalRegisterSubmit(e);
      }
    } else {
      handleSubmit(e);
    }
  };

  const getIdentifierPlaceholder = () => {
    if (activePersona === 'DOCTOR') {
      return language === 'bn' ? 'ডাক্তারের ইমেইল বা ফোন (e.g. doctor@hospital.com)' : 'Doctor Email or Mobile (doctor@hospital.com)';
    }
    if (activePersona === 'HOSPITAL') {
      return language === 'bn' ? 'হাসপাতাল অ্যাডমিন ইমেইল বা ফোন' : 'Hospital / Diagnostic Email or Mobile';
    }
    if (activePersona === 'PATIENT') {
      return language === 'bn' ? 'রোগীর মোবাইল নম্বর (০১XXXXXXXXX)' : 'Patient Mobile Number (01XXXXXXXXX)';
    }
    return t.authLoginIdentifierPlaceholder || 'Mobile number or Email address';
  };

  return (
    <form onSubmit={onFormSubmit} noValidate style={{ width: '100%' }}>
      {/* 1. SEPARATE PATIENT VS PROVIDER HEADERS */}
      {targetAudience === 'patient' ? (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 14px',
            borderRadius: '12px',
            backgroundColor: 'rgba(5, 150, 105, 0.06)',
            border: '1px solid rgba(5, 150, 105, 0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              backgroundColor: 'rgba(5, 150, 105, 0.14)',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <User size={18} />
          </div>
          <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.45 }}>
            <strong style={{ color: '#059669', display: 'block', fontSize: '12.5px' }}>
              {language === 'bn' ? 'রোগী সেবা পোর্টাল' : 'Patient Care Portal'}
            </strong>
            {language === 'bn'
              ? 'ডাক্তার অ্যাপয়েন্টমেন্ট, চেম্বার সিরিয়াল ও টেস্ট রিপোর্ট দেখতে লগইন করুন।'
              : 'Sign in to manage appointments, serials, prescriptions, and lab test reports.'}
          </div>
        </div>
      ) : targetAudience === 'provider' ? (
        <>
          {/* Doctor & Hospital Unified Provider Pathway Tabs */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', gap: '6px', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '12px' }}>
              {[
                { id: 'DOCTOR', labelEn: 'Doctor (BMDC Specialist)', labelBn: 'ডাক্তার (স্পেশালিস্ট)', icon: Stethoscope },
                { id: 'HOSPITAL', labelEn: 'Hospital / Diagnostic', labelBn: 'হাসপাতাল / ডায়াগনস্টিক', icon: Building2 },
              ].map((persona) => {
                const isSelected = activePersona === persona.id;
                const Icon = persona.icon;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => setActivePersona(persona.id as any)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                      color: isSelected ? BRAND_COLORS.primary : '#64748B',
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Icon size={15} color={isSelected ? BRAND_COLORS.primary : '#94A3B8'} />
                    <span>{language === 'bn' ? persona.labelBn : persona.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              marginBottom: '16px',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: 'rgba(0, 96, 250, 0.05)',
              border: '1px solid rgba(0, 96, 250, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 96, 250, 0.12)',
                color: BRAND_COLORS.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {activePersona === 'DOCTOR' ? <Stethoscope size={16} /> : <Building2 size={16} />}
            </div>
            <div style={{ fontSize: '11.5px', color: '#334155', lineHeight: 1.45 }}>
              <strong style={{ color: BRAND_COLORS.primary, display: 'block', fontSize: '12px' }}>
                {authMode === 'register'
                  ? (activePersona === 'DOCTOR'
                      ? (language === 'bn' ? 'ডাক্তার একাউন্ট তৈরি (BMDC ভেরিফাইড)' : 'Doctor Account Creation (BMDC Verified)')
                      : (language === 'bn' ? 'হাসপাতাল ও সেবাদানকারী প্রতিষ্ঠান নিবন্ধন' : 'Hospital & Healthcare Provider Registration'))
                  : (activePersona === 'DOCTOR'
                      ? (language === 'bn' ? 'সেন্ট্রাল ডাক্তার পোর্টাল (Central Doctor Portal)' : 'Central Doctor Portal')
                      : (language === 'bn' ? 'হাসপাতাল ও ডায়াগনস্টিক পোর্টাল' : 'Hospital & Diagnostic Center Portal'))}
              </strong>
              {authMode === 'register'
                ? (activePersona === 'DOCTOR'
                    ? (language === 'bn'
                        ? 'সেন্ট্রাল ডাক্তার একাউন্ট তৈরি করে চেম্বার শিডিউল, লাইভ সিরিয়াল ও ই-প্রেসক্রিপশন পরিচালনা করুন।'
                        : 'Create your official practitioner profile to manage multi-hospital chambers, live serials, and prescriptions.')
                    : (language === 'bn'
                        ? 'আপনার হাসপাতাল, ক্লিনিক বা ল্যাব নিবন্ধন করে বিশেষজ্ঞ ডাক্তার রোস্টার ও টেস্ট বুকিং পরিচালনা করুন।'
                        : 'Register your healthcare institution to manage doctor rosters, diagnostic tests, and booking desks.'))
                : (activePersona === 'DOCTOR'
                    ? (language === 'bn'
                        ? 'আপনার নিবন্ধিত ইমেইল ও পাসওয়ার্ড দিয়ে সকল হাসপাতালের চেম্বার পরিচালনা করুন।'
                        : 'Sign in to access your multi-hospital chamber schedules, live serials, and digital prescriptions.')
                    : (language === 'bn'
                        ? 'হাসপাতাল প্রোফাইল, ডাক্তার রোস্টার, টেস্ট ক্যাটালগ ও রোগী বুকিং পরিচালনা করুন।'
                        : 'Sign in to manage facility occupancy, specialist rosters, diagnostic tests, and booking desks.'))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Fallback All-in-One Persona Tabs */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', gap: '6px', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '12px', overflowX: 'auto' }}>
              {[
                { id: 'ALL', labelEn: 'Auto-Detect', labelBn: 'একক পোর্টাল', icon: ShieldCheck },
                { id: 'DOCTOR', labelEn: 'Doctor', labelBn: 'ডাক্তার', icon: Stethoscope },
                { id: 'HOSPITAL', labelEn: 'Hospital / Diagnostic', labelBn: 'হাসপাতাল / ল্যাব', icon: Building2 },
                { id: 'PATIENT', labelEn: 'Patient', labelBn: 'রোগী', icon: User },
              ].map((persona) => {
                const isSelected = activePersona === persona.id;
                const Icon = persona.icon;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => setActivePersona(persona.id as any)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                      color: isSelected ? BRAND_COLORS.primary : '#64748B',
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: '12px',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Icon size={14} color={isSelected ? BRAND_COLORS.primary : '#94A3B8'} />
                    <span>{language === 'bn' ? persona.labelBn : persona.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              marginBottom: '16px',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: 'rgba(0, 96, 250, 0.05)',
              border: '1px solid rgba(0, 96, 250, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 96, 250, 0.12)',
                color: BRAND_COLORS.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {activePersona === 'DOCTOR' ? (
                <Stethoscope size={16} />
              ) : activePersona === 'HOSPITAL' ? (
                <Building2 size={16} />
              ) : (
                <ShieldCheck size={16} />
              )}
            </div>
            <div style={{ fontSize: '11.5px', color: '#334155', lineHeight: 1.45 }}>
              <strong style={{ color: BRAND_COLORS.primary, display: 'block', fontSize: '12px' }}>
                {language === 'bn' ? 'একক লগইন পথ (Unified Pathway)' : 'Unified Healthcare Login Pathway'}
              </strong>
              {language === 'bn'
                ? 'ডাক্তার, হাসপাতাল ও রোগী একই পথ দিয়ে লগইন করুন।'
                : 'Doctors, Hospitals, and Patients sign in right here.'}
            </div>
          </div>
        </>
      )}

      {errorMessage && <AuthError message={errorMessage} onDismiss={() => setErrorMessage('')} />}
      {successMessage && <AuthSuccess message={successMessage} />}

      {authMode === 'register' ? (
        /* PROVIDER REGISTRATION SYSTEM */
        activePersona === 'DOCTOR' ? (
          /* DOCTOR REGISTRATION FORM */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                {language === 'bn' ? 'ডাক্তারের পূর্ণ নাম' : "Doctor's Full Name"} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                value={docFullName}
                onChange={(e) => {
                  setDocFullName(e.target.value);
                  if (fieldErrors.docFullName) setFieldErrors((p) => ({ ...p, docFullName: undefined }));
                }}
                placeholder={language === 'bn' ? 'ডা. মো: রফিকুল ইসলাম' : 'Dr. Md. Rafiqul Islam'}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: fieldErrors.docFullName ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                  fontSize: '13.5px',
                  outline: 'none',
                }}
              />
              {fieldErrors.docFullName && (
                <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{fieldErrors.docFullName}</span>
              )}
            </div>

            {/* BMDC & Specialty */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  {language === 'bn' ? 'বিএমডিসি নম্বর' : 'BMDC Reg. No.'} <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={docBmdc}
                  onChange={(e) => {
                    setDocBmdc(e.target.value);
                    if (fieldErrors.docBmdc) setFieldErrors((p) => ({ ...p, docBmdc: undefined }));
                  }}
                  placeholder="A-45210"
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '12px',
                    border: fieldErrors.docBmdc ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
                {fieldErrors.docBmdc && (
                  <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{fieldErrors.docBmdc}</span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  {language === 'bn' ? 'বিশেষজ্ঞ বিভাগ' : 'Specialty'} <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  value={docSpecialty}
                  onChange={(e) => setDocSpecialty(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 10px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  {[
                    'General Medicine',
                    'Cardiology & Heart Diseases',
                    'Gynecology & Obstetrics',
                    'Pediatrics & Child Health',
                    'General & Laparoscopic Surgery',
                    'Orthopedic Surgery & Trauma',
                    'Ear, Nose & Throat (ENT)',
                    'Eye / Ophthalmology',
                    'Dermatology & Venereology',
                    'Neurology & Neuromedicine',
                    'Nephrology & Kidney Care',
                    'Urology',
                    'Gastroenterology & Liver',
                    'Endocrinology & Diabetes',
                    'Pulmonology & Chest Diseases',
                    'Psychiatry & Mental Health',
                    'Dental & Maxillofacial Surgery',
                    'Other Specialized Discipline',
                  ].map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Qualifications & Fee */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  {language === 'bn' ? 'ডিগ্রী / শিক্ষাগত যোগ্যতা' : 'Qualifications'}
                </label>
                <input
                  type="text"
                  value={docQualifications}
                  onChange={(e) => setDocQualifications(e.target.value)}
                  placeholder="MBBS, FCPS, MD"
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  {language === 'bn' ? 'পরামর্শ ফি (টাকা)' : 'Fee (BDT)'}
                </label>
                <input
                  type="number"
                  value={docFee}
                  onChange={(e) => setDocFee(e.target.value)}
                  placeholder="800"
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Phone & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Phone'} <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="tel"
                  value={docPhone}
                  onChange={(e) => {
                    setDocPhone(e.target.value);
                    if (fieldErrors.docPhone) setFieldErrors((p) => ({ ...p, docPhone: undefined }));
                  }}
                  placeholder="01XXXXXXXXX"
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '12px',
                    border: fieldErrors.docPhone ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
                {fieldErrors.docPhone && (
                  <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{fieldErrors.docPhone}</span>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  {language === 'bn' ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                </label>
                <input
                  type="email"
                  value={docEmail}
                  onChange={(e) => {
                    setDocEmail(e.target.value);
                    if (fieldErrors.docEmail) setFieldErrors((p) => ({ ...p, docEmail: undefined }));
                  }}
                  placeholder="dr@hospital.com"
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '12px',
                    border: fieldErrors.docEmail ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
                {fieldErrors.docEmail && (
                  <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{fieldErrors.docEmail}</span>
                )}
              </div>
            </div>

            {/* Password & Confirm */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  {language === 'bn' ? 'পাসওয়ার্ড (৮+ অক্ষর)' : 'Password (8+ chars)'} <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="password"
                  value={docPassword}
                  onChange={(e) => {
                    setDocPassword(e.target.value);
                    if (fieldErrors.docPassword) setFieldErrors((p) => ({ ...p, docPassword: undefined }));
                  }}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '12px',
                    border: fieldErrors.docPassword ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
                {fieldErrors.docPassword && (
                  <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{fieldErrors.docPassword}</span>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  {language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'} <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="password"
                  value={docConfirmPassword}
                  onChange={(e) => {
                    setDocConfirmPassword(e.target.value);
                    if (fieldErrors.docConfirmPassword) setFieldErrors((p) => ({ ...p, docConfirmPassword: undefined }));
                  }}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '12px',
                    border: fieldErrors.docConfirmPassword ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
                {fieldErrors.docConfirmPassword && (
                  <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{fieldErrors.docConfirmPassword}</span>
                )}
              </div>
            </div>

            {/* Checkbox */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <input
                type="checkbox"
                id="doc-agree-cb"
                checked={docAgreeTerms}
                onChange={(e) => {
                  setDocAgreeTerms(e.target.checked);
                  if (fieldErrors.docAgreeTerms) setFieldErrors((p) => ({ ...p, docAgreeTerms: undefined }));
                }}
                style={{ width: '16px', height: '16px', accentColor: BRAND_COLORS.primary, marginTop: '2px', cursor: 'pointer' }}
              />
              <label htmlFor="doc-agree-cb" style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.4', cursor: 'pointer' }}>
                {language === 'bn'
                  ? 'আমি নিশ্চিত করছি যে আমি একজন বিএমডিসি নিবন্ধিত চিকিৎসক এবং ডায়াগনস্টিক কেয়ারের শর্তাবলী মেনে চলব।'
                  : 'I confirm that I am a BMDC registered medical practitioner and agree to terms & ethical guidelines.'}
              </label>
            </div>
            {fieldErrors.docAgreeTerms && (
              <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '-4px', display: 'block' }}>{fieldErrors.docAgreeTerms}</span>
            )}

            {/* Submit Doctor Account */}
            <LoadingButton
              type="submit"
              loading={loading}
              loadingText={language === 'bn' ? 'তৈরি করা হচ্ছে...' : 'Creating Doctor Account...'}
            >
              {language === 'bn' ? 'ডাক্তার একাউন্ট তৈরি করুন ও পোর্টালে যান →' : 'Create Doctor Account & Enter Portal →'}
            </LoadingButton>
          </div>
        ) : (
          /* HOSPITAL REGISTRATION FORM */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
            {/* Provider Type Selection */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { type: 'HOSPITAL', label: language === 'bn' ? 'হাসপাতাল' : 'Hospital' },
                { type: 'DIAGNOSTIC_CENTER', label: language === 'bn' ? 'ডায়াগনস্টিক' : 'Diagnostic' },
                { type: 'CLINIC', label: language === 'bn' ? 'ক্লিনিক' : 'Clinic' },
              ].map((p) => (
                <button
                  key={p.type}
                  type="button"
                  onClick={() => setHospType(p.type as any)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '10px',
                    border: hospType === p.type ? '2px solid #059669' : '1px solid #CBD5E1',
                    backgroundColor: hospType === p.type ? 'rgba(5, 150, 105, 0.08)' : '#FFFFFF',
                    color: hospType === p.type ? '#059669' : '#475569',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Institution Name */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                {language === 'bn' ? 'প্রতিষ্ঠানের নাম' : 'Institution / Facility Name'} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                value={hospName}
                onChange={(e) => {
                  setHospName(e.target.value);
                  if (fieldErrors.hospName) setFieldErrors((p) => ({ ...p, hospName: undefined }));
                }}
                placeholder={language === 'bn' ? 'গ্রীন লাইফ হাসপাতাল ও ল্যাব' : 'Green Life Hospital & Lab'}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: fieldErrors.hospName ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                  fontSize: '13.5px',
                  outline: 'none',
                }}
              />
              {fieldErrors.hospName && (
                <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{fieldErrors.hospName}</span>
              )}
            </div>

            {/* License & District */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  {language === 'bn' ? 'ট্রেড / ডিজিএইচএস লাইসেন্স' : 'License / DGHS Reg.'}
                </label>
                <input
                  type="text"
                  value={hospLicense}
                  onChange={(e) => setHospLicense(e.target.value)}
                  placeholder="DGHS-94812"
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  {language === 'bn' ? 'জেলা / হাব' : 'District Hub'} <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  value={hospDistrict}
                  onChange={(e) => setHospDistrict(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 10px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  {[
                    'Dhaka',
                    'Chattogram',
                    'Rajshahi',
                    'Khulna',
                    'Barishal',
                    'Sylhet',
                    'Rangpur',
                    'Mymensingh',
                    'Moulvibazar',
                    'Habiganj',
                    'Sunamganj',
                    'Comilla',
                    'Brahmanbaria',
                    'Narayanganj',
                    'Gazipur',
                    'Bogura',
                  ].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Person Name */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                {language === 'bn' ? 'দায়িত্বপ্রাপ্ত ব্যক্তির নাম ও পদবী' : 'Authorized Person & Designation'} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                value={hospContactPerson}
                onChange={(e) => {
                  setHospContactPerson(e.target.value);
                  if (fieldErrors.hospContactPerson) setFieldErrors((p) => ({ ...p, hospContactPerson: undefined }));
                }}
                placeholder={language === 'bn' ? 'ডা. মো: শফিকুল ইসলাম (এমডি)' : 'Dr. Md. Shafiqul Islam (MD)'}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: fieldErrors.hospContactPerson ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                  fontSize: '13.5px',
                  outline: 'none',
                }}
              />
              {fieldErrors.hospContactPerson && (
                <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{fieldErrors.hospContactPerson}</span>
              )}
            </div>

            {/* Official Phone & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  {language === 'bn' ? 'অফিসিয়াল ফোন' : 'Official Phone'} <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="tel"
                  value={hospPhone}
                  onChange={(e) => {
                    setHospPhone(e.target.value);
                    if (fieldErrors.hospPhone) setFieldErrors((p) => ({ ...p, hospPhone: undefined }));
                  }}
                  placeholder="01XXXXXXXXX"
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '12px',
                    border: fieldErrors.hospPhone ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
                {fieldErrors.hospPhone && (
                  <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{fieldErrors.hospPhone}</span>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  {language === 'bn' ? 'অফিসিয়াল ইমেইল' : 'Email (Optional)'}
                </label>
                <input
                  type="email"
                  value={hospEmail}
                  onChange={(e) => {
                    setHospEmail(e.target.value);
                    if (fieldErrors.hospEmail) setFieldErrors((p) => ({ ...p, hospEmail: undefined }));
                  }}
                  placeholder="admin@hospital.com"
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '12px',
                    border: fieldErrors.hospEmail ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
                {fieldErrors.hospEmail && (
                  <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{fieldErrors.hospEmail}</span>
                )}
              </div>
            </div>

            {/* Password & Confirm */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  {language === 'bn' ? 'পাসওয়ার্ড (৮+ অক্ষর)' : 'Password (8+ chars)'} <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="password"
                  value={hospPassword}
                  onChange={(e) => {
                    setHospPassword(e.target.value);
                    if (fieldErrors.hospPassword) setFieldErrors((p) => ({ ...p, hospPassword: undefined }));
                  }}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '12px',
                    border: fieldErrors.hospPassword ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
                {fieldErrors.hospPassword && (
                  <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{fieldErrors.hospPassword}</span>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  {language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'} <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="password"
                  value={hospConfirmPassword}
                  onChange={(e) => {
                    setHospConfirmPassword(e.target.value);
                    if (fieldErrors.hospConfirmPassword) setFieldErrors((p) => ({ ...p, hospConfirmPassword: undefined }));
                  }}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '12px',
                    border: fieldErrors.hospConfirmPassword ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
                {fieldErrors.hospConfirmPassword && (
                  <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{fieldErrors.hospConfirmPassword}</span>
                )}
              </div>
            </div>

            {/* Checkbox */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <input
                type="checkbox"
                id="hosp-agree-cb"
                checked={hospAgreeTerms}
                onChange={(e) => {
                  setHospAgreeTerms(e.target.checked);
                  if (fieldErrors.hospAgreeTerms) setFieldErrors((p) => ({ ...p, hospAgreeTerms: undefined }));
                }}
                style={{ width: '16px', height: '16px', accentColor: '#059669', marginTop: '2px', cursor: 'pointer' }}
              />
              <label htmlFor="hosp-agree-cb" style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.4', cursor: 'pointer' }}>
                {language === 'bn'
                  ? 'আমি নিশ্চিত করছি যে আমাদের প্রতিষ্ঠান সরকারের যথাযথ কর্তৃপক্ষ কর্তৃক অনুমোদিত এবং ডায়াগনস্টিক কেয়ারের শর্তাবলীতে সম্মত।'
                  : 'I confirm that this facility is legally registered and agree to Diagnostic Care terms & standards.'}
              </label>
            </div>
            {fieldErrors.hospAgreeTerms && (
              <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '-4px', display: 'block' }}>{fieldErrors.hospAgreeTerms}</span>
            )}

            {/* Submit Hospital Account */}
            <LoadingButton
              type="submit"
              loading={loading}
              loadingText={language === 'bn' ? 'নিবন্ধন করা হচ্ছে...' : 'Registering Facility...'}
              style={{ backgroundColor: '#059669' }}
            >
              {language === 'bn' ? 'প্রতিষ্ঠান নিবন্ধন সম্পন্ন করুন ও পোর্টালে যান →' : 'Register Institution & Enter Portal →'}
            </LoadingButton>
          </div>
        )
      ) : (
        /* LOGIN FORM */
        <>
          {/* Identifier Input */}
          <FormField
            label={t.authLoginIdentifier || 'Registered Mobile or Email Address'}
            required
            error={fieldErrors.identifier}
            id="login-identifier"
          >
            <div style={{ position: 'relative' }}>
              <input
                id="login-identifier"
                type="text"
                autoComplete="username"
                placeholder={getIdentifierPlaceholder()}
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (fieldErrors.identifier) setFieldErrors((prev) => ({ ...prev, identifier: undefined }));
                }}
                disabled={loading}
                className="glass-input"
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: 'var(--color-text-primary)',
                  border: fieldErrors.identifier ? '1.5px solid #EF4444' : '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = BRAND_COLORS.primary;
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 96, 250, 0.15)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = fieldErrors.identifier ? '#EF4444' : 'var(--glass-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </FormField>

          {/* Password Input */}
          <div style={{ marginBottom: '14px' }}>
            <PasswordInput
              id="login-password"
              label={t.authLoginPassword || 'Password'}
              placeholder={t.authLoginPasswordPlaceholder || '••••••••'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={fieldErrors.password}
              autoComplete="current-password"
              disabled={loading}
              required
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              fontSize: '13px',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: BRAND_COLORS.primary,
                  cursor: 'pointer',
                }}
              />
              <span>{t.authLoginRememberMe || 'Remember this session'}</span>
            </label>

            {onNavigateToForgot ? (
              <button
                type="button"
                onClick={onNavigateToForgot}
                style={{
                  background: 'none',
                  border: 'none',
                  color: BRAND_COLORS.primary,
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '13px',
                }}
              >
                {t.authLoginForgotPassword || 'Forgot Password?'}
              </button>
            ) : (
              <a
                href="/forgot-password"
                style={{
                  color: BRAND_COLORS.primary,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                {t.authLoginForgotPassword || 'Forgot Password?'}
              </a>
            )}
          </div>

          {/* Submit Button */}
          <LoadingButton
            type="submit"
            loading={loading}
            loadingText={language === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Verifying & Routing...'}
          >
            {activePersona === 'DOCTOR' ? (
              language === 'bn' ? 'ডাক্তার পোর্টালে প্রবেশ করুন →' : 'Sign In to Doctor Console →'
            ) : activePersona === 'HOSPITAL' ? (
              language === 'bn' ? 'হাসপাতাল পোর্টালে প্রবেশ করুন →' : 'Sign In to Hospital Portal →'
            ) : activePersona === 'PATIENT' ? (
              language === 'bn' ? 'রোগী অ্যাকাউন্টে প্রবেশ করুন →' : 'Sign In as Patient →'
            ) : (
              language === 'bn' ? 'একক পোর্টালে প্রবেশ করুন →' : 'Sign In to Portal →'
            )}
          </LoadingButton>
        </>
      )}

      {/* Explicit Cancel / Close Action */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          id="login-cancel-btn"
          style={{
            width: '100%',
            marginTop: '10px',
            padding: '11px',
            borderRadius: '12px',
            border: '1.5px solid #CBD5E1',
            backgroundColor: '#F8FAFC',
            color: '#475569',
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <span>✕ {language === 'bn' ? 'বাতিল করুন (Cancel)' : 'Cancel & Close'}</span>
        </button>
      )}

      {/* Mode Switch: Register vs Login */}
      {authMode === 'register' ? (
        <div
          style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
          }}
        >
          <span>{language === 'bn' ? 'ইতিমধ্যে একাউন্ট আছে? ' : 'Already have an account? '}</span>
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMessage('');
              setSuccessMessage('');
              setFieldErrors({});
            }}
            style={{
              background: 'none',
              border: 'none',
              color: activePersona === 'DOCTOR' ? BRAND_COLORS.primary : '#059669',
              fontWeight: 800,
              cursor: 'pointer',
              padding: '0 4px',
              textDecoration: 'underline',
            }}
          >
            {activePersona === 'DOCTOR'
              ? (language === 'bn' ? 'ডাক্তার কনসোলে সাইন ইন করুন' : 'Sign In to Doctor Console')
              : (language === 'bn' ? 'হাসপাতাল পোর্টালে সাইন ইন করুন' : 'Sign In to Hospital Portal')}
          </button>
        </div>
      ) : (
        <div
          style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
          }}
        >
          <span>{t.authLoginNoAccount || "Don't have an account?"} </span>
          {targetAudience === 'provider' ? (
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMessage('');
                setSuccessMessage('');
                setFieldErrors({});
              }}
              style={{
                background: 'none',
                border: 'none',
                color: BRAND_COLORS.primary,
                fontWeight: 800,
                cursor: 'pointer',
                padding: '0 4px',
                textDecoration: 'underline',
              }}
            >
              {language === 'bn' ? 'নতুন একাউন্ট তৈরি করুন' : 'Create an account'}
            </button>
          ) : onNavigateToRegister ? (
            <button
              type="button"
              onClick={onNavigateToRegister}
              style={{
                background: 'none',
                border: 'none',
                color: BRAND_COLORS.primary,
                fontWeight: 800,
                cursor: 'pointer',
                padding: '0 4px',
              }}
            >
              {t.authLoginCreateAccount || 'Register New Account'}
            </button>
          ) : (
            <a
              href="/register"
              style={{
                color: BRAND_COLORS.primary,
                fontWeight: 800,
                textDecoration: 'none',
              }}
            >
              {t.authLoginCreateAccount || 'Register New Account'}
            </a>
          )}
        </div>
      )}

      {/* Reciprocal Portal Pathway Switcher */}
      {targetAudience === 'patient' ? (
        <div
          style={{
            marginTop: '16px',
            padding: '12px 14px',
            borderRadius: '12px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={16} color={BRAND_COLORS.primary} />
            <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>
              {language === 'bn' ? 'ডাক্তার বা সেবাদানকারী প্রতিষ্ঠান?' : 'Doctor or Service Provider Portal?'}
            </span>
          </div>
          <Link
            href="/provider/login"
            style={{
              fontSize: '12px',
              fontWeight: 800,
              color: BRAND_COLORS.primary,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>{language === 'bn' ? 'ডাক্তার ও প্রোভাইডার লগইন' : 'Doctor & Provider Sign In'}</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      ) : targetAudience === 'provider' ? (
        <div
          style={{
            marginTop: '16px',
            padding: '12px 14px',
            borderRadius: '12px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={16} color="#059669" />
            <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>
              {language === 'bn' ? 'রোগী হিসেবে সেবা নিতে চান?' : 'Looking to book as a Patient?'}
            </span>
          </div>
          <Link
            href="/login"
            style={{
              fontSize: '12px',
              fontWeight: 800,
              color: '#059669',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>{language === 'bn' ? 'রোগী লগইন' : 'Patient Sign In'}</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      ) : null}

      {/* Customer Care Helpline */}
      <div
        style={{
          marginTop: '18px',
          paddingTop: '12px',
          borderTop: '1px solid #E2E8F0',
          textAlign: 'center',
          fontSize: '12px',
          color: '#64748B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
      >
        <PhoneCall size={13} color={BRAND_COLORS.primary} />
        <span>Diagnostic Care Helpline: <strong>01886748564</strong></span>
      </div>
    </form>
  );
};

export default LoginForm;
