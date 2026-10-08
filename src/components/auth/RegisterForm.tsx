'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import PasswordInput from './PasswordInput';
import FormField from './FormField';
import { AuthError, AuthSuccess } from './AuthAlerts';
import LoadingButton from './LoadingButton';
import { Check, ShieldCheck, PhoneCall } from 'lucide-react';

interface RegisterFormProps {
  onSuccess?: (user: AuthUserProfile) => void;
  onNavigateToLogin?: () => void;
  isModal?: boolean;
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onNavigateToLogin,
  isModal = false,
}) => {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [bloodGroup, setBloodGroup] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password Strength evaluation
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 3) {
      errors.fullName =
        language === 'bn'
          ? 'পূর্ণ নাম অন্তত ৩ অক্ষরের হতে হবে।'
          : 'Full name must be at least 3 characters.';
    }

    const cleanPhone = AuthService.normalizePhoneNumber(phone);
    if (!AuthService.isValidBangladeshPhone(cleanPhone)) {
      errors.phone =
        language === 'bn'
          ? 'সঠিক ১১-সংখ্যার বাংলাদেশী মোবাইল নম্বর লিখুন (০১XXXXXXXXX)।'
          : 'Please enter a valid 11-digit mobile number (01XXXXXXXXX).';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email =
        language === 'bn'
          ? 'সঠিক ইমেইল ঠিকানা প্রদান করুন।'
          : 'Please enter a valid email address.';
    }

    if (age && (parseInt(age) < 1 || parseInt(age) > 120)) {
      errors.age =
        language === 'bn' ? 'সঠিক বয়স দিন (১-১২০)।' : 'Please enter a valid age (1-120).';
    }

    if (password.length < 8) {
      errors.password =
        language === 'bn'
          ? 'পাসওয়ার্ড ন্যূনতম ৮ অক্ষরের হতে হবে।'
          : 'Password must be at least 8 characters long.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = t.authRegisterPasswordMismatch;
    }

    if (!agreeTerms) {
      errors.terms =
        language === 'bn'
          ? 'এগিয়ে যেতে শর্তাবলী ও গোপনীয়তা নীতি মেনে নিন।'
          : 'You must agree to the Terms of Service & Privacy Policy.';
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
      const result = await AuthService.registerPatient({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        age: age ? parseInt(age) : undefined,
        gender,
        bloodGroup: bloodGroup || undefined,
        password,
        language,
      });

      if (result.error) {
        if (result.error.toLowerCase().includes('already registered')) {
          setErrorMessage(t.authRegisterDuplicate);
        } else {
          setErrorMessage(result.error);
        }
        setLoading(false);
        return;
      }

      setSuccessMessage(t.authRegisterSuccess);

      if (result.profile && onSuccess) {
        setTimeout(() => {
          onSuccess(result.profile!);
        }, 800);
      } else {
        setTimeout(() => {
          if (onNavigateToLogin) {
            onNavigateToLogin();
          } else if (isModal) {
            window.location.reload();
          } else {
            router.push('/login?registered=true');
          }
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || 'An error occurred during registration. Please try again.'
      );
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
      {errorMessage && <AuthError message={errorMessage} onDismiss={() => setErrorMessage('')} />}
      {successMessage && <AuthSuccess message={successMessage} />}

      {/* Full Name */}
      <FormField
        label={t.authRegisterFullName}
        required
        error={fieldErrors.fullName}
        id="reg-fullname"
      >
        <input
          id="reg-fullname"
          type="text"
          autoComplete="name"
          placeholder={t.authRegisterFullNamePlaceholder}
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (fieldErrors.fullName) setFieldErrors((p) => ({ ...p, fullName: '' }));
          }}
          disabled={loading}
          style={{
            width: '100%',
            height: '46px',
            padding: '10px 14px',
            fontSize: '14px',
            color: '#0F172A',
            backgroundColor: loading ? '#F1F5F9' : '#FFFFFF',
            border: fieldErrors.fullName ? '1.5px solid #EF4444' : '1.5px solid #E2E8F0',
            borderRadius: '10px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#0057FF')}
          onBlur={(e) => (e.currentTarget.style.borderColor = fieldErrors.fullName ? '#EF4444' : '#E2E8F0')}
        />
      </FormField>

      {/* Mobile Number */}
      <FormField
        label={t.authRegisterMobile}
        required
        error={fieldErrors.phone}
        id="reg-phone"
        hint="BD Mobile (01XXXXXXXXX)"
      >
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <span
            style={{
              height: '46px',
              padding: '0 12px',
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#F8FAFC',
              border: fieldErrors.phone ? '1.5px solid #EF4444' : '1.5px solid #E2E8F0',
              borderRight: 'none',
              borderRadius: '10px 0 0 10px',
              color: '#475569',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            🇧🇩 +880
          </span>
          <input
            id="reg-phone"
            type="tel"
            autoComplete="tel"
            placeholder={t.authRegisterMobilePlaceholder}
            value={phone}
            maxLength={11}
            onChange={(e) => {
              setPhone(e.target.value);
              if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: '' }));
            }}
            disabled={loading}
            style={{
              flex: 1,
              height: '46px',
              padding: '10px 14px',
              fontSize: '14px',
              color: '#0F172A',
              backgroundColor: loading ? '#F1F5F9' : '#FFFFFF',
              border: fieldErrors.phone ? '1.5px solid #EF4444' : '1.5px solid #E2E8F0',
              borderRadius: '0 10px 10px 0',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#0057FF')}
            onBlur={(e) => (e.currentTarget.style.borderColor = fieldErrors.phone ? '#EF4444' : '#E2E8F0')}
          />
        </div>
      </FormField>

      {/* Optional Email */}
      <FormField
        label={t.authRegisterEmail}
        error={fieldErrors.email}
        id="reg-email"
      >
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          placeholder={t.authRegisterEmailPlaceholder}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: '' }));
          }}
          disabled={loading}
          style={{
            width: '100%',
            height: '46px',
            padding: '10px 14px',
            fontSize: '14px',
            color: '#0F172A',
            backgroundColor: loading ? '#F1F5F9' : '#FFFFFF',
            border: fieldErrors.email ? '1.5px solid #EF4444' : '1.5px solid #E2E8F0',
            borderRadius: '10px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#0057FF')}
          onBlur={(e) => (e.currentTarget.style.borderColor = fieldErrors.email ? '#EF4444' : '#E2E8F0')}
        />
      </FormField>

      {/* Row: Age, Gender, Blood Group */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div>
          <label
            htmlFor="reg-age"
            style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}
          >
            {t.authRegisterAge}
          </label>
          <input
            id="reg-age"
            type="number"
            min={1}
            max={120}
            placeholder={t.authRegisterAgePlaceholder}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              height: '44px',
              padding: '8px 10px',
              fontSize: '14px',
              borderRadius: '10px',
              border: '1.5px solid #E2E8F0',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label
            htmlFor="reg-gender"
            style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}
          >
            {t.authRegisterGender}
          </label>
          <select
            id="reg-gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as any)}
            disabled={loading}
            style={{
              width: '100%',
              height: '44px',
              padding: '8px 10px',
              fontSize: '14px',
              borderRadius: '10px',
              border: '1.5px solid #E2E8F0',
              outline: 'none',
              backgroundColor: '#FFFFFF',
              boxSizing: 'border-box',
            }}
          >
            <option value="MALE">{t.authRegisterGenderMale}</option>
            <option value="FEMALE">{t.authRegisterGenderFemale}</option>
            <option value="OTHER">{t.authRegisterGenderOther}</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="reg-blood"
            style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}
          >
            {t.authRegisterBloodGroup}
          </label>
          <select
            id="reg-blood"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              height: '44px',
              padding: '8px 10px',
              fontSize: '14px',
              borderRadius: '10px',
              border: '1.5px solid #E2E8F0',
              outline: 'none',
              backgroundColor: '#FFFFFF',
              boxSizing: 'border-box',
            }}
          >
            <option value="">--</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Password */}
      <div style={{ marginBottom: '14px' }}>
        <PasswordInput
          id="reg-password"
          label={t.authRegisterPassword}
          placeholder={t.authRegisterPasswordPlaceholder}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: '' }));
          }}
          error={fieldErrors.password}
          autoComplete="new-password"
          disabled={loading}
          required
        />

        {/* Live Password Strength Indicators */}
        {password.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '6px',
              fontSize: '11.5px',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                color: hasMinLength ? '#16A34A' : '#94A3B8',
                fontWeight: hasMinLength ? 600 : 400,
              }}
            >
              {hasMinLength ? <Check size={12} /> : '○'} {language === 'bn' ? '৮+ অক্ষর' : '8+ chars'}
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                color: hasLetter ? '#16A34A' : '#94A3B8',
                fontWeight: hasLetter ? 600 : 400,
              }}
            >
              {hasLetter ? <Check size={12} /> : '○'} {language === 'bn' ? 'বর্ণ' : 'Letters'}
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                color: hasNumber ? '#16A34A' : '#94A3B8',
                fontWeight: hasNumber ? 600 : 400,
              }}
            >
              {hasNumber ? <Check size={12} /> : '○'} {language === 'bn' ? 'সংখ্যা' : 'Numbers'}
            </span>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div style={{ marginBottom: '18px' }}>
        <PasswordInput
          id="reg-confirm-password"
          label={t.authRegisterConfirmPassword}
          placeholder={t.authRegisterConfirmPasswordPlaceholder}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (fieldErrors.confirmPassword) setFieldErrors((p) => ({ ...p, confirmPassword: '' }));
          }}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
          disabled={loading}
          required
        />
        {confirmPassword.length > 0 && passwordsMatch && (
          <p style={{ fontSize: '11.5px', color: '#16A34A', marginTop: '4px', fontWeight: 600 }}>
            ✓ {language === 'bn' ? 'পাসওয়ার্ড মিলেছে' : 'Passwords match'}
          </p>
        )}
      </div>

      {/* Terms and Privacy Checkbox */}
      <div style={{ marginBottom: '22px' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            fontSize: '12.5px',
            color: '#475569',
            cursor: 'pointer',
            lineHeight: 1.45,
          }}
        >
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => {
              setAgreeTerms(e.target.checked);
              if (fieldErrors.terms) setFieldErrors((p) => ({ ...p, terms: '' }));
            }}
            disabled={loading}
            style={{
              width: '17px',
              height: '17px',
              marginTop: '2px',
              accentColor: '#0057FF',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          />
          <span>
            {t.authRegisterTermsAgreement}
          </span>
        </label>
        {fieldErrors.terms && (
          <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', fontWeight: 500 }}>
            ⚠ {fieldErrors.terms}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <LoadingButton
        type="submit"
        loading={loading}
        loadingText={t.authRegisterLoading}
      >
        {t.authRegisterSubmit}
      </LoadingButton>

      {/* Switch to Login */}
      <div
        style={{
          marginTop: '20px',
          textAlign: 'center',
          fontSize: '13.5px',
          color: '#64748B',
        }}
      >
        <span>{t.authRegisterAlreadyHaveAccount} </span>
        {onNavigateToLogin ? (
          <button
            type="button"
            onClick={onNavigateToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: '#0057FF',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '0 4px',
            }}
          >
            {t.authRegisterLoginLink}
          </button>
        ) : (
          <a
            href="/login"
            style={{
              color: '#0057FF',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            {t.authRegisterLoginLink}
          </a>
        )}
      </div>

      {/* Security & Customer Care Badges */}
      <div
        style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          fontSize: '11.5px',
          color: '#94A3B8',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={14} color="#10B981" />
          <span>AES-256 Encrypted</span>
        </span>
        <span>•</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <PhoneCall size={12} />
          <span>01886748564</span>
        </span>
      </div>
    </form>
  );
};

export default RegisterForm;
