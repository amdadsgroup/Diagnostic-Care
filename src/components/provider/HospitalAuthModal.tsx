'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Stethoscope, 
  Lock, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Eye, 
  EyeOff, 
  UserPlus, 
  LogIn, 
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import { BRAND_CONSTANTS, BRAND_COLORS } from '@/config/brand';

interface HospitalAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  onSuccess?: (user: AuthUserProfile) => void;
}

export default function HospitalAuthModal({
  isOpen,
  onClose,
  defaultMode = 'login',
  onSuccess,
}: HospitalAuthModalProps) {
  const { language } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  React.useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [defaultMode, isOpen]);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [hospitalName, setHospitalName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [district, setDistrict] = useState('Moulvibazar');
  const [address, setAddress] = useState('');

  // Status state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const isBn = language === 'bn';

  const resetState = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMessage(isBn ? 'মোবাইল নম্বর/ইমেইল এবং পাসওয়ার্ড প্রদান করুন।' : 'Please enter mobile/email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.signIn(loginIdentifier, loginPassword);
      if (result.error) {
        setErrorMessage(result.error);
        setLoading(false);
        return;
      }

      setSuccessMessage(isBn ? 'লগইন সফল হয়েছে! ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...' : 'Login successful! Redirecting...');
      setTimeout(() => {
        if (result.profile && onSuccess) {
          onSuccess(result.profile);
        }
        window.location.href = result.redirectPath || '/?tab=portal';
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check credentials.');
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();

    if (!hospitalName.trim() || !contactPerson.trim() || !phone.trim() || !regPassword) {
      setErrorMessage(isBn ? 'দয়া করে সকল প্রয়োজনীয় তথ্য পূরণ করুন।' : 'Please fill all required fields.');
      return;
    }

    if (regPassword.length < 8) {
      setErrorMessage(isBn ? 'পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।' : 'Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.registerHospital({
        hospitalName: hospitalName.trim(),
        contactPerson: contactPerson.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        password: regPassword,
        licenseNumber: licenseNumber.trim() || undefined,
        district,
        address: address.trim() || undefined,
        language: isBn ? 'bn' : 'en',
      });

      if (result.error) {
        setErrorMessage(result.error);
        setLoading(false);
        return;
      }

      setSuccessMessage(
        isBn
          ? 'হাসপাতাল অ্যাকাউন্ট তৈরি সফল হয়েছে! আপনার ড্যাশবোর্ডে লগইন করা হচ্ছে...'
          : 'Hospital account created successfully! Redirecting to portal...'
      );

      setTimeout(() => {
        if (result.profile && onSuccess) {
          onSuccess(result.profile);
        }
        window.location.href = '/?tab=portal&role=DIAGNOSTIC_ADMIN';
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div
        className="modal-container"
        style={{ maxWidth: mode === 'register' ? '600px' : '460px', width: '95%', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--brand-navy-900) 0%, #004ed1 100%)',
          color: '#FFFFFF',
          padding: '22px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 800 }}>
              <Building2 size={24} color="#60A5FA" />
              <span>{isBn ? 'হাসপাতাল ও প্রোভাইডার এক্সেস হাব' : 'Hospital & Provider Access Hub'}</span>
            </div>
            <div style={{ fontSize: '0.82rem', opacity: 0.9, marginTop: '4px' }}>
              {mode === 'login'
                ? (isBn ? 'হাসপাতাল, ডায়াগনস্টিক সেন্টার ও ডাক্তার লগইন' : 'Hospital, Diagnostic Center & Doctor Portal Login')
                : (isBn ? 'নতুন হাসপাতাল অ্যাকাউন্ট তৈরি করুন' : 'Create Hospital & Healthcare Provider Account')}
            </div>
          </div>
          <button className="modal-close" onClick={onClose} style={{ color: '#FFFFFF', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher: Login vs Account Creation */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--slate-200)', backgroundColor: 'var(--slate-50)' }}>
          <button
            type="button"
            onClick={() => { setMode('login'); resetState(); }}
            style={{
              flex: 1,
              padding: '14px',
              border: 'none',
              background: 'none',
              borderBottom: mode === 'login' ? '3px solid var(--brand-primary)' : '3px solid transparent',
              color: mode === 'login' ? 'var(--brand-primary)' : 'var(--slate-600)',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <LogIn size={16} />
            <span>{isBn ? 'প্রোভাইডার ও ডাক্তার লগইন' : 'Provider & Doctor Login'}</span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('register'); resetState(); }}
            style={{
              flex: 1,
              padding: '14px',
              border: 'none',
              background: 'none',
              borderBottom: mode === 'register' ? '3px solid var(--brand-primary)' : '3px solid transparent',
              color: mode === 'register' ? 'var(--brand-primary)' : 'var(--slate-600)',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <UserPlus size={16} />
            <span>{isBn ? 'হাসপাতাল অ্যাকাউন্ট তৈরি' : 'Create Hospital Account'}</span>
          </button>
        </div>

        {/* Alerts */}
        <div style={{ padding: '0 24px', paddingTop: '16px' }}>
          {errorMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '12px',
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#059669',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '12px',
            }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* MODE 1: LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ padding: '24px', paddingTop: '8px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                {isBn ? 'মোবাইল নম্বর অথবা ইমেইল' : 'Mobile Phone or Email'} *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="01XXXXXXXXX / admin@hospital.com"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  style={{
                    width: '100%',
                    height: '44px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>
                  {isBn ? 'পাসওয়ার্ড' : 'Password'} *
                </label>
                <a href="/forgot-password" style={{ fontSize: '0.78rem', color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 600 }}>
                  {isBn ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{
                    width: '100%',
                    height: '44px',
                    padding: '10px 40px 10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--slate-400)',
                    cursor: 'pointer',
                  }}
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: 'var(--brand-primary)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.95rem',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <LogIn size={18} />
              <span>{loading ? (isBn ? 'লগইন হচ্ছে...' : 'Signing in...') : (isBn ? 'প্রোভাইডার পোর্টালে প্রবেশ করুন' : 'Sign in to Provider Portal')}</span>
            </button>

            <div style={{
              marginTop: '20px',
              padding: '14px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '10px',
              fontSize: '0.8rem',
              color: '#1E3A8A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <strong>{isBn ? 'নতুন হাসপাতাল?' : 'New Hospital?'}</strong> {isBn ? 'আজই প্ল্যাটফর্মে যুক্ত হোন।' : 'Create provider account now.'}
              </div>
              <button
                type="button"
                onClick={() => { setMode('register'); resetState(); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--brand-primary)',
                  fontWeight: 800,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                {isBn ? 'অ্যাকাউন্ট তৈরি →' : 'Register Now →'}
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: HOSPITAL ACCOUNT CREATION FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} style={{ padding: '24px', paddingTop: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                  {isBn ? 'হাসপাতাল / ক্লিনিকের নাম' : 'Hospital / Clinic Name'} *
                </label>
                <input
                  type="text"
                  placeholder="যেমন: মৌলভীবাজার সেন্ট্রাল হাসপাতাল"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  style={{ width: '100%', height: '42px', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                  {isBn ? 'দায়িত্বপ্রাপ্ত ব্যক্তির নাম' : 'Authorized Contact Person'} *
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ডাঃ রফিকুল ইসলাম (পরিচালক)"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  style={{ width: '100%', height: '42px', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                  {isBn ? 'মোবাইল নম্বর (লগইন আইডি)' : 'Mobile Phone (Login ID)'} *
                </label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', height: '42px', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                  {isBn ? 'অফিসিয়াল ইমেইল (ঐচ্ছিক)' : 'Official Email (Optional)'}
                </label>
                <input
                  type="email"
                  placeholder="info@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', height: '42px', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                {isBn ? 'পাসওয়ার্ড সেট করুন (কমপক্ষে ৮ অক্ষর)' : 'Create Account Password (Min 8 characters)'} *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  style={{ width: '100%', height: '42px', padding: '10px 40px 10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer' }}
                >
                  {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                  {isBn ? 'ডিজিএইচএস লাইসেন্স বা ট্রেড লাইসেন্স নং' : 'DGHS License / Registration No'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. DGHS-2026-XXXX"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  style={{ width: '100%', height: '42px', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                  {isBn ? 'জেলা' : 'District'}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  style={{ width: '100%', height: '42px', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', boxSizing: 'border-box' }}
                >
                  <option value="Moulvibazar">Moulvibazar (মৌলভীবাজার)</option>
                  <option value="Sylhet">Sylhet (সিলেট)</option>
                  <option value="Dhaka">Dhaka (ঢাকা)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                {isBn ? 'হাসপাতালের পূর্ণ ঠিকানা' : 'Hospital Location / Street Address'}
              </label>
              <input
                type="text"
                placeholder="রোড, এলাকা ও হোল্ডিং নং"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ width: '100%', height: '42px', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: 'var(--brand-primary)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.95rem',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <UserPlus size={18} />
              <span>{loading ? (isBn ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'Creating Account...') : (isBn ? 'হাসপাতাল অ্যাকাউন্ট সম্পন্ন করুন' : 'Complete Hospital Registration')}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
