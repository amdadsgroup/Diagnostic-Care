'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';
import {
  Stethoscope,
  Building2,
  Lock,
  Phone,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Award,
  FileText,
  MapPin,
  TestTube2,
  ChevronRight,
  PhoneCall,
} from 'lucide-react';
import LoadingButton from './LoadingButton';

interface ProviderAuthCardProps {
  initialRole?: 'DOCTOR' | 'HOSPITAL';
  initialMode?: 'login' | 'register';
  redirectTo?: string;
  onSuccess?: (user: AuthUserProfile) => void;
}

const MEDICAL_SPECIALTIES = [
  'General Medicine',
  'Cardiology & Heart Diseases',
  'Gynecology & Obstetrics',
  'Pediatrics & Child Health',
  'General & Laparoscopic Surgery',
  'Orthopedic Surgery & Trauma',
  'Ear, Nose & Throat (ENT)',
  'Eye / Ophthalmology',
  'Dermatology & Venereology (Skin & Sex)',
  'Neurology & Neuromedicine',
  'Nephrology & Kidney Care',
  'Urology',
  'Gastroenterology & Liver',
  'Endocrinology & Diabetes',
  'Pulmonology & Chest Diseases',
  'Psychiatry & Mental Health',
  'Dental & Maxillofacial Surgery',
  'Physical Medicine & Rehabilitation',
  'Oncology & Cancer Care',
  'Other Specialized Discipline',
];

const BANGLADESH_DISTRICTS = [
  'Moulvibazar',
  'Sylhet',
  'Habiganj',
  'Sunamganj',
  'Dhaka',
  'Chittagong',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Rangpur',
  'Mymensingh',
  'Comilla',
  'Brahmanbaria',
  'Narayanganj',
  'Gazipur',
  'Bogura',
];

export default function ProviderAuthCard({
  initialRole = 'DOCTOR',
  initialMode = 'login',
  redirectTo,
  onSuccess,
}: ProviderAuthCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();

  const urlMode = searchParams?.get('mode');
  const urlRole = searchParams?.get('role') || searchParams?.get('portal');

  const [mode, setMode] = useState<'login' | 'register'>(
    urlMode === 'register' ? 'register' : initialMode
  );

  const [selectedRole, setSelectedRole] = useState<'DOCTOR' | 'HOSPITAL'>(() => {
    if (urlRole?.toLowerCase().includes('hospital') || urlRole?.toLowerCase().includes('lab')) {
      return 'HOSPITAL';
    }
    if (urlRole?.toLowerCase().includes('doctor')) {
      return 'DOCTOR';
    }
    return initialRole;
  });

  // Common Login State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Doctor Registration State
  const [docFullName, setDocFullName] = useState('');
  const [docBmdc, setDocBmdc] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docEmail, setDocEmail] = useState('');
  const [docSpecialty, setDocSpecialty] = useState(MEDICAL_SPECIALTIES[0]);
  const [docQualifications, setDocQualifications] = useState('MBBS');
  const [docFee, setDocFee] = useState('800');
  const [docPassword, setDocPassword] = useState('');
  const [docConfirmPassword, setDocConfirmPassword] = useState('');
  const [docAgreeTerms, setDocAgreeTerms] = useState(false);

  // Hospital Registration State
  const [hospType, setHospType] = useState<'HOSPITAL' | 'DIAGNOSTIC_CENTER' | 'CLINIC'>('HOSPITAL');
  const [hospName, setHospName] = useState('');
  const [hospLicense, setHospLicense] = useState('');
  const [hospDistrict, setHospDistrict] = useState('Moulvibazar');
  const [hospAddress, setHospAddress] = useState('');
  const [hospContactPerson, setHospContactPerson] = useState('');
  const [hospPhone, setHospPhone] = useState('');
  const [hospEmail, setHospEmail] = useState('');
  const [hospPassword, setHospPassword] = useState('');
  const [hospConfirmPassword, setHospConfirmPassword] = useState('');
  const [hospAgreeTerms, setHospAgreeTerms] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Reset errors when switching tab or role
  useEffect(() => {
    setErrorMessage('');
    setSuccessMessage('');
    setFieldErrors({});
  }, [mode, selectedRole]);

  // LOGIN SUBMIT
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!identifier.trim()) {
      errors.identifier =
        language === 'bn' ? 'মোবাইল নম্বর অথবা ইমেইল লিখুন।' : 'Mobile number or email is required.';
    }
    if (!password) {
      errors.password =
        language === 'bn' ? 'পাসওয়ার্ড প্রদান করুন।' : 'Password is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const result = await AuthService.signIn(identifier, password);

      if (result.error) {
        if (result.isSuspended) {
          setErrorMessage(
            language === 'bn'
              ? 'এই একাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। কাস্টমার কেয়ারে যোগাযোগ করুন।'
              : 'This account has been suspended. Please contact customer care.'
          );
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
      let destinationTitle =
        language === 'bn' ? 'লগইন সফল হয়েছে!' : 'Login Successful!';

      if (role === 'DOCTOR' || role === 'DOCTOR_ASSISTANT') {
        destinationTitle =
          language === 'bn'
            ? 'ডাক্তার পোর্টালে স্বাগতম...'
            : 'Welcome to Doctor Clinical Portal...';
      } else if (
        ['HOSPITAL_ADMIN', 'DIAGNOSTIC_ADMIN', 'CLINIC_ADMIN', 'DIAGNOSTIC_STAFF', 'HOSPITAL_STAFF'].includes(role)
      ) {
        destinationTitle =
          language === 'bn'
            ? 'হাসপাতাল ও ডায়াগনস্টিক পোর্টালে স্বাগতম...'
            : 'Welcome to Hospital & Diagnostic Center Portal...';
      }

      setSuccessMessage(destinationTitle);

      if (typeof window !== 'undefined' && rememberMe) {
        localStorage.setItem('dc_remember_identifier', identifier.trim());
      }

      setTimeout(() => {
        if (onSuccess && result.profile) {
          onSuccess(result.profile);
        }
        if (redirectTo) {
          router.push(redirectTo);
        } else if (role === 'DOCTOR' || role === 'DOCTOR_ASSISTANT' || selectedRole === 'DOCTOR') {
          router.push('/doctor/portal');
        } else if (['HOSPITAL_ADMIN', 'DIAGNOSTIC_ADMIN', 'CLINIC_ADMIN'].includes(role) || selectedRole === 'HOSPITAL') {
          router.push('/hospital/portal');
        } else {
          router.push(result.redirectPath || '/');
        }
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please try again.');
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
      errors.docFullName =
        language === 'bn' ? 'ডাক্তারের পূর্ণ নাম লিখুন (কমপক্ষে ৩ অক্ষর)।' : "Doctor's full name is required (min 3 chars).";
    }

    if (!docBmdc.trim() || docBmdc.trim().length < 3) {
      errors.docBmdc =
        language === 'bn' ? 'সঠিক বিএমডিসি রেজিস্ট্রেশন নম্বর লিখুন (যেমন A-12345)।' : 'Valid BMDC Registration Number required (e.g. A-12345).';
    }

    const cleanPhone = AuthService.normalizePhoneNumber(docPhone);
    if (!AuthService.isValidBangladeshPhone(cleanPhone)) {
      errors.docPhone =
        language === 'bn' ? 'সঠিক ১১-সংখ্যার বাংলাদেশী মোবাইল নম্বর লিখুন (০১XXXXXXXXX)।' : 'Valid 11-digit Bangladesh phone required (01XXXXXXXXX).';
    }

    if (docEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(docEmail.trim())) {
      errors.docEmail =
        language === 'bn' ? 'সঠিক ইমেইল ঠিকানা লিখুন।' : 'Please enter a valid email address.';
    }

    if (!docPassword || docPassword.length < 8) {
      errors.docPassword =
        language === 'bn' ? 'পাসওয়ার্ড ন্যূনতম ৮ অক্ষরের হতে হবে।' : 'Password must be at least 8 characters.';
    }

    if (docPassword !== docConfirmPassword) {
      errors.docConfirmPassword =
        language === 'bn' ? 'পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না।' : 'Passwords do not match.';
    }

    if (!docAgreeTerms) {
      errors.docAgreeTerms =
        language === 'bn' ? 'শর্তাবলী ও বিএমডিসি আচরণবিধি সম্মতি আবশ্যক।' : 'You must confirm terms and BMDC code of conduct.';
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
        if (onSuccess && result.profile) {
          onSuccess(result.profile);
        }
        router.push('/doctor/portal');
      }, 900);
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
      errors.hospName =
        language === 'bn' ? 'প্রতিষ্ঠানের নাম লিখুন (কমপক্ষে ৩ অক্ষর)।' : 'Institution / Facility name is required (min 3 chars).';
    }

    if (!hospContactPerson.trim() || hospContactPerson.trim().length < 3) {
      errors.hospContactPerson =
        language === 'bn' ? 'দায়িত্বপ্রাপ্ত ব্যক্তির নাম লিখুন।' : 'Authorized contact person name is required.';
    }

    const cleanPhone = AuthService.normalizePhoneNumber(hospPhone);
    if (!AuthService.isValidBangladeshPhone(cleanPhone)) {
      errors.hospPhone =
        language === 'bn' ? 'সঠিক ১১-সংখ্যার প্রাতিষ্ঠানিক মোবাইল নম্বর দিন (০১XXXXXXXXX)।' : 'Valid 11-digit mobile number required (01XXXXXXXXX).';
    }

    if (hospEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(hospEmail.trim())) {
      errors.hospEmail =
        language === 'bn' ? 'সঠিক ইমেইল ঠিকানা দিন।' : 'Please enter a valid email address.';
    }

    if (!hospPassword || hospPassword.length < 8) {
      errors.hospPassword =
        language === 'bn' ? 'পাসওয়ার্ড ন্যূনতম ৮ অক্ষরের হতে হবে।' : 'Password must be at least 8 characters.';
    }

    if (hospPassword !== hospConfirmPassword) {
      errors.hospConfirmPassword =
        language === 'bn' ? 'পাসওয়ার্ড মিলছে না।' : 'Passwords do not match.';
    }

    if (!hospAgreeTerms) {
      errors.hospAgreeTerms =
        language === 'bn' ? 'শর্তাবলী ও স্বাস্থ্য অধিদপ্তর নির্দেশিকা সম্মতি আবশ্যক।' : 'You must agree to terms and DGHS regulations.';
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
        address: hospAddress.trim() || undefined,
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
        if (onSuccess && result.profile) {
          onSuccess(result.profile);
        }
        router.push('/hospital/portal');
      }, 900);
    } catch (err: any) {
      setErrorMessage(err.message || 'Hospital registration failed.');
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* 1. Main Mode Switcher: Sign In vs Create Account */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
          padding: '4px',
          backgroundColor: '#F1F5F9',
          borderRadius: '14px',
          marginBottom: '16px',
        }}
      >
        <button
          type="button"
          onClick={() => setMode('login')}
          style={{
            padding: '10px 12px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            backgroundColor: mode === 'login' ? '#FFFFFF' : 'transparent',
            color: mode === 'login' ? BRAND_COLORS.primary : '#64748B',
            boxShadow: mode === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          {language === 'bn' ? 'লগইন করুন (Sign In)' : 'Sign In'}
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          style={{
            padding: '10px 12px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            backgroundColor: mode === 'register' ? '#FFFFFF' : 'transparent',
            color: mode === 'register' ? BRAND_COLORS.primary : '#64748B',
            boxShadow: mode === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          {language === 'bn' ? 'নতুন একাউন্ট (Create Account)' : 'Create Account'}
        </button>
      </div>

      {/* 2. Provider Role Toggle: Doctor vs Hospital / Diagnostic */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '18px',
        }}
      >
        {/* Doctor Persona Tab */}
        <button
          type="button"
          onClick={() => setSelectedRole('DOCTOR')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '12px 10px',
            borderRadius: '14px',
            cursor: 'pointer',
            border: selectedRole === 'DOCTOR' ? `2px solid ${BRAND_COLORS.primary}` : '1.5px solid #E2E8F0',
            backgroundColor: selectedRole === 'DOCTOR' ? 'rgba(0, 96, 250, 0.05)' : '#FFFFFF',
            color: selectedRole === 'DOCTOR' ? BRAND_COLORS.primary : '#475569',
            boxShadow: selectedRole === 'DOCTOR' ? '0 4px 12px rgba(0, 96, 250, 0.12)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: selectedRole === 'DOCTOR' ? BRAND_COLORS.primary : '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: selectedRole === 'DOCTOR' ? '#FFFFFF' : '#64748B',
            }}
          >
            <Stethoscope size={18} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: 800 }}>
              {language === 'bn' ? 'ডাক্তার (স্পেশালিস্ট)' : 'Doctor (Specialist)'}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
              {language === 'bn' ? 'BMDC রেজিস্টার্ড' : 'BMDC Registered'}
            </div>
          </div>
        </button>

        {/* Hospital Persona Tab */}
        <button
          type="button"
          onClick={() => setSelectedRole('HOSPITAL')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '12px 10px',
            borderRadius: '14px',
            cursor: 'pointer',
            border: selectedRole === 'HOSPITAL' ? '2px solid #059669' : '1.5px solid #E2E8F0',
            backgroundColor: selectedRole === 'HOSPITAL' ? 'rgba(5, 150, 105, 0.05)' : '#FFFFFF',
            color: selectedRole === 'HOSPITAL' ? '#059669' : '#475569',
            boxShadow: selectedRole === 'HOSPITAL' ? '0 4px 12px rgba(5, 150, 105, 0.12)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: selectedRole === 'HOSPITAL' ? '#059669' : '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: selectedRole === 'HOSPITAL' ? '#FFFFFF' : '#64748B',
            }}
          >
            <Building2 size={18} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: 800 }}>
              {language === 'bn' ? 'হাসপাতাল ও ল্যাব' : 'Hospital & Lab'}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
              {language === 'bn' ? 'সেবাদানকারী প্রতিষ্ঠান' : 'Healthcare Facility'}
            </div>
          </div>
        </button>
      </div>

      {/* Global Alerts */}
      {errorMessage && (
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: '#FEF2F2',
            border: '1.5px solid #FCA5A5',
            borderRadius: '12px',
            color: '#DC2626',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            marginBottom: '16px',
          }}
        >
          <AlertCircle size={17} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: '#F0FDF4',
            border: '1.5px solid #86EFAC',
            borderRadius: '12px',
            color: '#16A34A',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
          }}
        >
          <CheckCircle2 size={17} style={{ flexShrink: 0 }} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 3. MODE: LOGIN FORM */}
      {mode === 'login' && (
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Target destination banner */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: selectedRole === 'DOCTOR' ? '#EFF6FF' : '#F0FDF4',
              border: `1px solid ${selectedRole === 'DOCTOR' ? '#BFDBFE' : '#BBF7D0'}`,
              fontSize: '12.5px',
              color: selectedRole === 'DOCTOR' ? '#1E40AF' : '#166534',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
            }}
          >
            {selectedRole === 'DOCTOR' ? <Stethoscope size={15} /> : <Building2 size={15} />}
            <span>
              {selectedRole === 'DOCTOR'
                ? language === 'bn'
                  ? 'ডাক্তার ক্লিনিক্যাল পোর্টাল: চেম্বার সিরিয়াল, প্রেসক্রিপশন ও অ্যাপয়েন্টমেন্ট কনসোল।'
                  : 'Doctor Clinical Portal: Chamber serial queue, e-prescription & appointment desk.'
                : language === 'bn'
                  ? 'হাসপাতাল কনসোল: বেড ও আইসিইউ বুকিং, টেস্ট ক্যাটালগ ও স্পেশালিস্ট রোস্টার।'
                  : 'Hospital Console: Bed/ICU occupancy, diagnostic catalog & doctor rosters.'}
            </span>
          </div>

          {/* Identifier Input */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '6px',
              }}
            >
              {language === 'bn' ? 'মোবাইল নম্বর অথবা ইমেইল' : 'Mobile Number or Email'} <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (fieldErrors.identifier) setFieldErrors((prev) => ({ ...prev, identifier: '' }));
                }}
                placeholder={
                  selectedRole === 'DOCTOR'
                    ? language === 'bn'
                      ? '০১XXXXXXXXX অথবা doctor@example.com'
                      : '01XXXXXXXXX or doctor@example.com'
                    : language === 'bn'
                      ? '০১XXXXXXXXX অথবা hospital@example.com'
                      : '01XXXXXXXXX or hospital@example.com'
                }
                autoComplete="username"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '12px',
                  border: fieldErrors.identifier ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                }}
              />
              <Phone
                size={16}
                color="#94A3B8"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
            {fieldErrors.identifier && (
              <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                {fieldErrors.identifier}
              </span>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <Link
                href="/forgot-password"
                style={{ fontSize: '12px', color: BRAND_COLORS.primary, fontWeight: 700, textDecoration: 'none' }}
              >
                {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot password?'}
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                }}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 42px',
                  borderRadius: '12px',
                  border: fieldErrors.password ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                }}
              />
              <Lock
                size={16}
                color="#94A3B8"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.password && (
              <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                {fieldErrors.password}
              </span>
            )}
          </div>

          {/* Remember Me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="prov-remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: BRAND_COLORS.primary, cursor: 'pointer' }}
            />
            <label htmlFor="prov-remember-me" style={{ fontSize: '12.5px', color: '#64748B', cursor: 'pointer' }}>
              {language === 'bn' ? 'আমাকে মনে রাখুন' : 'Remember me on this browser'}
            </label>
          </div>

          {/* Submit Button */}
          <LoadingButton
            type="submit"
            loading={loading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '12px',
              backgroundColor: selectedRole === 'DOCTOR' ? BRAND_COLORS.primary : '#059669',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              border: 'none',
              boxShadow: selectedRole === 'DOCTOR' ? '0 4px 14px rgba(0, 96, 250, 0.3)' : '0 4px 14px rgba(5, 150, 105, 0.3)',
            }}
          >
            <span>
              {selectedRole === 'DOCTOR'
                ? language === 'bn'
                  ? 'ডাক্তার পোর্টালে সাইন ইন করুন'
                  : 'Sign In to Doctor Portal'
                : language === 'bn'
                  ? 'হাসপাতাল পোর্টালে সাইন ইন করুন'
                  : 'Sign In to Hospital Portal'}
            </span>
          </LoadingButton>

          {/* Switch to Create Account link */}
          <div
            style={{
              textAlign: 'center',
              fontSize: '13px',
              color: '#64748B',
              marginTop: '4px',
            }}
          >
            <span>
              {selectedRole === 'DOCTOR'
                ? language === 'bn'
                  ? 'ডাক্তার একাউন্ট নেই? '
                  : "Don't have a doctor account? "
                : language === 'bn'
                  ? 'প্রতিষ্ঠান নিবন্ধিত নেই? '
                  : "Don't have a provider account? "}
            </span>
            <button
              type="button"
              onClick={() => setMode('register')}
              style={{
                background: 'none',
                border: 'none',
                color: selectedRole === 'DOCTOR' ? BRAND_COLORS.primary : '#059669',
                fontWeight: 800,
                cursor: 'pointer',
                padding: '0 4px',
                textDecoration: 'underline',
              }}
            >
              {selectedRole === 'DOCTOR'
                ? language === 'bn'
                  ? 'নতুন ডাক্তার একাউন্ট তৈরি করুন'
                  : 'Create Doctor Account'
                : language === 'bn'
                  ? 'নতুন প্রতিষ্ঠান রেজিস্ট্রেশন করুন'
                  : 'Register Provider / Hospital'}
            </button>
          </div>
        </form>
      )}

      {/* 4. MODE: DOCTOR ACCOUNT CREATION */}
      {mode === 'register' && selectedRole === 'DOCTOR' && (
        <form onSubmit={handleDoctorRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              fontSize: '12.5px',
              color: '#1E40AF',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
            }}
          >
            <ShieldCheck size={16} color="#2563EB" />
            <span>
              {language === 'bn'
                ? 'BMDC নিবন্ধিত বিশেষজ্ঞ ডাক্তার একাউন্ট রেজিস্ট্রেশন ফরম।'
                : 'BMDC Registered Specialist Doctor Account Creation.'}
            </span>
          </div>

          {/* Full Name */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              {language === 'bn' ? 'ডাক্তারের পূর্ণ নাম' : "Doctor's Full Name"} <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={docFullName}
                onChange={(e) => {
                  setDocFullName(e.target.value);
                  if (fieldErrors.docFullName) setFieldErrors((prev) => ({ ...prev, docFullName: '' }));
                }}
                placeholder={language === 'bn' ? 'যেমন: ডা. রফিকুল ইসলাম' : 'e.g. Dr. Md. Rafiqul Islam'}
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 40px',
                  borderRadius: '12px',
                  border: fieldErrors.docFullName ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                  fontSize: '13.5px',
                  outline: 'none',
                }}
              />
              <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            {fieldErrors.docFullName && (
              <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '4px', display: 'block' }}>{fieldErrors.docFullName}</span>
            )}
          </div>

          {/* BMDC Registration Number & Specialty */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {language === 'bn' ? 'বিএমডিসি নম্বর' : 'BMDC Reg. No.'} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={docBmdc}
                  onChange={(e) => {
                    setDocBmdc(e.target.value);
                    if (fieldErrors.docBmdc) setFieldErrors((prev) => ({ ...prev, docBmdc: '' }));
                  }}
                  placeholder="e.g. A-45210"
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 36px',
                    borderRadius: '12px',
                    border: fieldErrors.docBmdc ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
                <Award size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              {fieldErrors.docBmdc && (
                <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '4px', display: 'block' }}>{fieldErrors.docBmdc}</span>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {language === 'bn' ? 'বিশেষজ্ঞ বিভাগ' : 'Specialty'} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <select
                value={docSpecialty}
                onChange={(e) => setDocSpecialty(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                }}
              >
                {MEDICAL_SPECIALTIES.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Qualifications & Fee */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
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
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
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

          {/* Mobile & Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Phone'} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  value={docPhone}
                  onChange={(e) => {
                    setDocPhone(e.target.value);
                    if (fieldErrors.docPhone) setFieldErrors((prev) => ({ ...prev, docPhone: '' }));
                  }}
                  placeholder="01XXXXXXXXX"
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 36px',
                    borderRadius: '12px',
                    border: fieldErrors.docPhone ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
                <Phone size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              {fieldErrors.docPhone && (
                <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '4px', display: 'block' }}>{fieldErrors.docPhone}</span>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {language === 'bn' ? 'অফিসিয়াল ইমেইল' : 'Email (Optional)'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={docEmail}
                  onChange={(e) => {
                    setDocEmail(e.target.value);
                    if (fieldErrors.docEmail) setFieldErrors((prev) => ({ ...prev, docEmail: '' }));
                  }}
                  placeholder="dr@hospital.com"
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 36px',
                    borderRadius: '12px',
                    border: fieldErrors.docEmail ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
                <Mail size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              {fieldErrors.docEmail && (
                <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '4px', display: 'block' }}>{fieldErrors.docEmail}</span>
              )}
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {language === 'bn' ? 'পাসওয়ার্ড (৮+ অক্ষর)' : 'Password (8+ chars)'} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="password"
                value={docPassword}
                onChange={(e) => {
                  setDocPassword(e.target.value);
                  if (fieldErrors.docPassword) setFieldErrors((prev) => ({ ...prev, docPassword: '' }));
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
                <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '4px', display: 'block' }}>{fieldErrors.docPassword}</span>
              )}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="password"
                value={docConfirmPassword}
                onChange={(e) => {
                  setDocConfirmPassword(e.target.value);
                  if (fieldErrors.docConfirmPassword) setFieldErrors((prev) => ({ ...prev, docConfirmPassword: '' }));
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
                <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '4px', display: 'block' }}>{fieldErrors.docConfirmPassword}</span>
              )}
            </div>
          </div>

          {/* Terms checkbox */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <input
              type="checkbox"
              id="doc-agree"
              checked={docAgreeTerms}
              onChange={(e) => {
                setDocAgreeTerms(e.target.checked);
                if (fieldErrors.docAgreeTerms) setFieldErrors((prev) => ({ ...prev, docAgreeTerms: '' }));
              }}
              style={{ width: '16px', height: '16px', accentColor: BRAND_COLORS.primary, marginTop: '3px', cursor: 'pointer' }}
            />
            <label htmlFor="doc-agree" style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.4', cursor: 'pointer' }}>
              {language === 'bn'
                ? 'আমি নিশ্চিত করছি যে আমি একজন বিএমডিসি নিবন্ধিত চিকিৎসক এবং ডায়াগনস্টিক কেয়ারের শর্তাবলী মেনে চলব।'
                : 'I confirm that I am a verified BMDC registered medical practitioner and agree to terms & ethical guidelines.'}
            </label>
          </div>
          {fieldErrors.docAgreeTerms && (
            <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '-6px', display: 'block' }}>{fieldErrors.docAgreeTerms}</span>
          )}

          {/* Submit Doctor Account Button */}
          <LoadingButton
            type="submit"
            loading={loading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '12px',
              backgroundColor: BRAND_COLORS.primary,
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 4px 14px rgba(0, 96, 250, 0.3)',
            }}
          >
            <span>{language === 'bn' ? 'ডাক্তার একাউন্ট তৈরি করুন ও পোর্টালে যান' : 'Create Doctor Account & Enter Portal'}</span>
          </LoadingButton>

          {/* Switch to Login */}
          <div style={{ textAlign: 'center', fontSize: '13px', color: '#64748B' }}>
            <span>{language === 'bn' ? 'ইতিমধ্যে ডাক্তার একাউন্ট আছে? ' : 'Already have a doctor account? '}</span>
            <button
              type="button"
              onClick={() => setMode('login')}
              style={{
                background: 'none',
                border: 'none',
                color: BRAND_COLORS.primary,
                fontWeight: 800,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              {language === 'bn' ? 'সাইন ইন করুন' : 'Sign In here'}
            </button>
          </div>
        </form>
      )}

      {/* 5. MODE: HOSPITAL & DIAGNOSTIC ACCOUNT CREATION */}
      {mode === 'register' && selectedRole === 'HOSPITAL' && (
        <form onSubmit={handleHospitalRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              fontSize: '12.5px',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
            }}
          >
            <Building2 size={16} color="#059669" />
            <span>
              {language === 'bn'
                ? 'হাসপাতাল, ডায়াগনস্টিক সেন্টার ও ক্লিনিক একাউন্ট রেজিস্ট্রেশন ফরম।'
                : 'Hospital, Diagnostic Center & Clinic Provider Registration.'}
            </span>
          </div>

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
                  padding: '9px 6px',
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
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              {language === 'bn' ? 'প্রতিষ্ঠানের নাম' : 'Institution / Facility Name'} <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={hospName}
                onChange={(e) => {
                  setHospName(e.target.value);
                  if (fieldErrors.hospName) setFieldErrors((prev) => ({ ...prev, hospName: '' }));
                }}
                placeholder={language === 'bn' ? 'যেমন: গ্রীন লাইফ হাসপাতাল ও ডায়াগনস্টিক' : 'e.g. Green Life Hospital & Diagnostic'}
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 40px',
                  borderRadius: '12px',
                  border: fieldErrors.hospName ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                  fontSize: '13.5px',
                  outline: 'none',
                }}
              />
              <Building2 size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            {fieldErrors.hospName && (
              <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '4px', display: 'block' }}>{fieldErrors.hospName}</span>
            )}
          </div>

          {/* License & District */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {language === 'bn' ? 'ডিজিএইচএস / ট্রেড লাইসেন্স' : 'DGHS / Trade License'}
              </label>
              <input
                type="text"
                value={hospLicense}
                onChange={(e) => setHospLicense(e.target.value)}
                placeholder="e.g. DGHS-94812"
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
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {language === 'bn' ? 'জেলা / অবস্থান' : 'District Hub'} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <select
                value={hospDistrict}
                onChange={(e) => setHospDistrict(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                }}
              >
                {BANGLADESH_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Person Name */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              {language === 'bn' ? 'দায়িত্বপ্রাপ্ত ব্যক্তির নাম ও পদবী' : 'Authorized Person Name & Title'} <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={hospContactPerson}
                onChange={(e) => {
                  setHospContactPerson(e.target.value);
                  if (fieldErrors.hospContactPerson) setFieldErrors((prev) => ({ ...prev, hospContactPerson: '' }));
                }}
                placeholder={language === 'bn' ? 'যেমন: ডা. মো: শফিকুল ইসলাম (ম্যানেজিং ডিরেক্টর)' : 'e.g. Dr. Md. Shafiqul Islam (MD)'}
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 40px',
                  borderRadius: '12px',
                  border: fieldErrors.hospContactPerson ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                  fontSize: '13.5px',
                  outline: 'none',
                }}
              />
              <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            {fieldErrors.hospContactPerson && (
              <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '4px', display: 'block' }}>{fieldErrors.hospContactPerson}</span>
            )}
          </div>

          {/* Phone & Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {language === 'bn' ? 'অফিসিয়াল ফোন' : 'Official Phone'} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  value={hospPhone}
                  onChange={(e) => {
                    setHospPhone(e.target.value);
                    if (fieldErrors.hospPhone) setFieldErrors((prev) => ({ ...prev, hospPhone: '' }));
                  }}
                  placeholder="01XXXXXXXXX"
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 36px',
                    borderRadius: '12px',
                    border: fieldErrors.hospPhone ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
                <Phone size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              {fieldErrors.hospPhone && (
                <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '4px', display: 'block' }}>{fieldErrors.hospPhone}</span>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {language === 'bn' ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={hospEmail}
                  onChange={(e) => {
                    setHospEmail(e.target.value);
                    if (fieldErrors.hospEmail) setFieldErrors((prev) => ({ ...prev, hospEmail: '' }));
                  }}
                  placeholder="admin@hospital.com"
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 36px',
                    borderRadius: '12px',
                    border: fieldErrors.hospEmail ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
                <Mail size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              {fieldErrors.hospEmail && (
                <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '4px', display: 'block' }}>{fieldErrors.hospEmail}</span>
              )}
            </div>
          </div>

          {/* Password & Confirm */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {language === 'bn' ? 'পাসওয়ার্ড (৮+ অক্ষর)' : 'Password (8+ chars)'} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="password"
                value={hospPassword}
                onChange={(e) => {
                  setHospPassword(e.target.value);
                  if (fieldErrors.hospPassword) setFieldErrors((prev) => ({ ...prev, hospPassword: '' }));
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
                <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '4px', display: 'block' }}>{fieldErrors.hospPassword}</span>
              )}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="password"
                value={hospConfirmPassword}
                onChange={(e) => {
                  setHospConfirmPassword(e.target.value);
                  if (fieldErrors.hospConfirmPassword) setFieldErrors((prev) => ({ ...prev, hospConfirmPassword: '' }));
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
                <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '4px', display: 'block' }}>{fieldErrors.hospConfirmPassword}</span>
              )}
            </div>
          </div>

          {/* Terms checkbox */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <input
              type="checkbox"
              id="hosp-agree"
              checked={hospAgreeTerms}
              onChange={(e) => {
                setHospAgreeTerms(e.target.checked);
                if (fieldErrors.hospAgreeTerms) setFieldErrors((prev) => ({ ...prev, hospAgreeTerms: '' }));
              }}
              style={{ width: '16px', height: '16px', accentColor: '#059669', marginTop: '3px', cursor: 'pointer' }}
            />
            <label htmlFor="hosp-agree" style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.4', cursor: 'pointer' }}>
              {language === 'bn'
                ? 'আমি নিশ্চিত করছি যে আমাদের প্রতিষ্ঠান সরকারের স্বাস্থ্য অধিদপ্তর বা যথাযথ কর্তৃপক্ষ কর্তৃক অনুমোদিত এবং ডায়াগনস্টিক কেয়ারের শর্তাবলীতে সম্মত।'
                : 'I confirm that this facility is legally registered and agree to Diagnostic Care terms & standards.'}
            </label>
          </div>
          {fieldErrors.hospAgreeTerms && (
            <span style={{ fontSize: '11.5px', color: '#EF4444', marginTop: '-6px', display: 'block' }}>{fieldErrors.hospAgreeTerms}</span>
          )}

          {/* Submit Hospital Account Button */}
          <LoadingButton
            type="submit"
            loading={loading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '12px',
              backgroundColor: '#059669',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
            }}
          >
            <span>{language === 'bn' ? 'প্রতিষ্ঠান নিবন্ধন সম্পন্ন করুন ও পোর্টালে যান' : 'Register Institution & Enter Portal'}</span>
          </LoadingButton>

          {/* Switch to Login */}
          <div style={{ textAlign: 'center', fontSize: '13px', color: '#64748B' }}>
            <span>{language === 'bn' ? 'ইতিমধ্যে প্রতিষ্ঠান নিবন্ধিত আছে? ' : 'Already registered? '}</span>
            <button
              type="button"
              onClick={() => setMode('login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#059669',
                fontWeight: 800,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              {language === 'bn' ? 'সাইন ইন করুন' : 'Sign In here'}
            </button>
          </div>
        </form>
      )}

      {/* 6. Reciprocal Pathway: Patient Sign In */}
      <div
        style={{
          marginTop: '18px',
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
          <span>{language === 'bn' ? 'রোগী লগইন / সাইন আপ' : 'Patient Sign In / Sign Up'}</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Customer Care Helpline */}
      <div
        style={{
          marginTop: '16px',
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
        <span>Diagnostic Care Helpline: <strong>{BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}</strong></span>
      </div>
    </div>
  );
}
