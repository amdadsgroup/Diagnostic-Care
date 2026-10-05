'use client';

import React, { useState } from 'react';
import { BRAND } from '@/config/brand';

type AuthMode = 'login' | 'register' | 'forgot-password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  onAuthSuccess?: (user: { name: string; phone: string; role: string }) => void;
}

const EyeIcon = ({ visible }: { visible: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {visible ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login form
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regGender, setRegGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [regBlood, setRegBlood] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regLang, setRegLang] = useState<'bn' | 'en'>('bn');

  // Forgot password
  const [forgotPhone, setForgotPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!/^01[3-9]\d{8}$/.test(loginPhone)) throw new Error('Invalid phone number format');
      if (loginPassword.length < 8) throw new Error('Password must be at least 8 characters');
      // Simulate API call
      await new Promise(r => setTimeout(r, 800));
      onAuthSuccess?.({ name: 'Test Patient', phone: loginPhone, role: 'PATIENT' });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (regName.trim().length < 3) throw new Error('Full name must be at least 3 characters');
      if (!/^01[3-9]\d{8}$/.test(regPhone)) throw new Error('Invalid Bangladesh phone number');
      if (regPassword.length < 8) throw new Error('Password must be at least 8 characters');
      await new Promise(r => setTimeout(r, 1000));
      setSuccess('Account created! Please log in.');
      setTimeout(() => { setMode('login'); setSuccess(''); }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotOtp = async () => {
    if (!/^01[3-9]\d{8}$/.test(forgotPhone)) { setError('Invalid phone number'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setOtpSent(true);
    setLoading(false);
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="auth-header">
          <div className="auth-brand">
            <span className="auth-brand-icon">⚕</span>
            <div>
              <div className="auth-brand-name">{BRAND.name}</div>
              <div className="auth-brand-tagline">{BRAND.tagline}</div>
            </div>
          </div>
          <button className="auth-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >লগইন করুন</button>
          <button
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
          >নতুন অ্যাকাউন্ট</button>
        </div>

        <div className="auth-body">
          {error && <div className="auth-error"><span>⚠</span> {error}</div>}
          {success && <div className="auth-success"><span>✓</span> {success}</div>}

          {/* ── LOGIN ── */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="auth-field">
                <label>মোবাইল নম্বর</label>
                <div className="auth-input-group">
                  <span className="auth-input-prefix">🇧🇩 +880</span>
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={loginPhone}
                    onChange={e => setLoginPhone(e.target.value)}
                    maxLength={11}
                    required
                  />
                </div>
              </div>
              <div className="auth-field">
                <label>পাসওয়ার্ড</label>
                <div className="auth-input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye"
                    onClick={() => setShowPassword(!showPassword)}
                  ><EyeIcon visible={showPassword} /></button>
                </div>
              </div>
              <button
                type="button"
                className="auth-forgot-link"
                onClick={() => setMode('forgot-password')}
              >পাসওয়ার্ড ভুলে গেছেন?</button>
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >{loading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}</button>

              <div className="auth-divider"><span>অথবা</span></div>
              <div className="auth-info-box">
                <p>🏥 <strong>স্বাস্থ্যসেবা প্রদানকারী?</strong></p>
                <p style={{ fontSize: '0.8rem', marginTop: '4px', color: 'var(--color-text-muted)' }}>
                  ডায়াগনস্টিক সেন্টার, ক্লিনিক বা হাসপাতাল হিসেবে যোগ দিতে{' '}
                  <a href="/provider/onboard" style={{ color: 'var(--color-primary)' }}>এখানে ক্লিক করুন</a>
                </p>
              </div>
            </form>
          )}

          {/* ── REGISTER ── */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="auth-field">
                <label>পূর্ণ নাম *</label>
                <input
                  type="text"
                  placeholder="আপনার পুরো নাম লিখুন"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  required
                />
              </div>
              <div className="auth-field">
                <label>মোবাইল নম্বর *</label>
                <div className="auth-input-group">
                  <span className="auth-input-prefix">🇧🇩 +880</span>
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    maxLength={11}
                    required
                  />
                </div>
              </div>
              <div className="auth-row">
                <div className="auth-field">
                  <label>বয়স</label>
                  <input
                    type="number"
                    placeholder="বয়স"
                    value={regAge}
                    onChange={e => setRegAge(e.target.value)}
                    min={1}
                    max={120}
                  />
                </div>
                <div className="auth-field">
                  <label>লিঙ্গ</label>
                  <select value={regGender} onChange={e => setRegGender(e.target.value as 'MALE' | 'FEMALE' | 'OTHER')}>
                    <option value="MALE">পুরুষ</option>
                    <option value="FEMALE">মহিলা</option>
                    <option value="OTHER">অন্যান্য</option>
                  </select>
                </div>
              </div>
              <div className="auth-row">
                <div className="auth-field">
                  <label>রক্তের গ্রুপ</label>
                  <select value={regBlood} onChange={e => setRegBlood(e.target.value)}>
                    <option value="">অজানা</option>
                    {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="auth-field">
                  <label>ভাষা</label>
                  <select value={regLang} onChange={e => setRegLang(e.target.value as 'bn' | 'en')}>
                    <option value="bn">বাংলা</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
              <div className="auth-field">
                <label>পাসওয়ার্ড *</label>
                <div className="auth-input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="ন্যূনতম ৮ অক্ষর"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye"
                    onClick={() => setShowPassword(!showPassword)}
                  ><EyeIcon visible={showPassword} /></button>
                </div>
              </div>
              <div className="auth-terms">
                <label>
                  <input type="checkbox" required />
                  {' '}আমি <a href="/terms">শর্তাবলী</a> এবং <a href="/privacy">গোপনীয়তা নীতি</a> মেনে নিচ্ছি
                </label>
              </div>
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >{loading ? 'তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}</button>
            </form>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {mode === 'forgot-password' && (
            <div className="auth-form">
              <div className="auth-back-btn" onClick={() => setMode('login')}>
                ← লগইনে ফিরুন
              </div>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>
                আপনার নিবন্ধিত মোবাইল নম্বরে OTP পাঠানো হবে।
              </p>
              {!otpSent ? (
                <>
                  <div className="auth-field">
                    <label>মোবাইল নম্বর</label>
                    <div className="auth-input-group">
                      <span className="auth-input-prefix">🇧🇩 +880</span>
                      <input
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={forgotPhone}
                        onChange={e => setForgotPhone(e.target.value)}
                        maxLength={11}
                      />
                    </div>
                  </div>
                  <button
                    className="auth-submit-btn"
                    onClick={handleForgotOtp}
                    disabled={loading}
                  >{loading ? 'পাঠানো হচ্ছে...' : 'OTP পাঠান'}</button>
                </>
              ) : (
                <>
                  <div className="auth-field">
                    <label>OTP কোড</label>
                    <input
                      type="text"
                      placeholder="6-digit OTP"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                  <div className="auth-field">
                    <label>নতুন পাসওয়ার্ড</label>
                    <input type="password" placeholder="ন্যূনতম ৮ অক্ষর" />
                  </div>
                  <button className="auth-submit-btn">পাসওয়ার্ড পরিবর্তন করুন</button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>সহায়তার জন্য কল করুন: <a href={`tel:${BRAND.helpline}`}>{BRAND.helpline}</a></p>
        </div>
      </div>
    </div>
  );
}
