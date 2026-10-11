'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { AuthService } from '@/services/auth.service';
import { BRAND_COLORS } from '@/config/brand';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  ArrowRight,
  Shield,
  Building2,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // If already logged in as Super Admin, forward straight to /admin
  useEffect(() => {
    let isMounted = true;
    AuthService.getCurrentUser().then((user) => {
      if (isMounted) {
        if (
          user &&
          (user.primaryRole === 'SUPER_ADMIN' ||
            user.roles.includes('SUPER_ADMIN') ||
            user.email?.toLowerCase() === 'contact.amdadur@gmail.com')
        ) {
          router.replace('/admin');
        } else {
          setIsCheckingSession(false);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!email.trim() || !password.trim()) {
      setAuthError(
        language === 'bn'
          ? 'অনুগ্রহ করে অ্যাডমিন ইমেইল ও পাসওয়ার্ড প্রদান করুন।'
          : 'Please enter your administrator email and password.'
      );
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.signIn(email.trim(), password);

      if (result.error) {
        setAuthError(result.error);
        setLoading(false);
        return;
      }

      const profile = result.profile;
      const isSuperAdmin =
        profile?.primaryRole === 'SUPER_ADMIN' ||
        profile?.roles.includes('SUPER_ADMIN') ||
        email.trim().toLowerCase() === 'contact.amdadur@gmail.com';

      if (!isSuperAdmin) {
        setAuthError(
          language === 'bn'
            ? 'এই অ্যাকাউন্টে সুপার অ্যাডমিনিস্ট্রেটর অ্যাক্সেস পারমিশন নেই।'
            : 'Access denied: This account is not authorized as a Super Administrator.'
        );
        setLoading(false);
        return;
      }

      router.push('/admin');
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Header language={language} setLanguage={setLanguage} activeTab="admin" setActiveTab={() => {}} />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        {isCheckingSession ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '3.5px solid #E2E8F0',
                borderTopColor: BRAND_COLORS.primary,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <span style={{ fontSize: '13.5px', color: '#64748B', fontWeight: 600 }}>
              {language === 'bn' ? 'অ্যাডমিন সেশন চেক করা হচ্ছে...' : 'Verifying Admin Session Clearance...'}
            </span>
          </div>
        ) : (
          <div style={{ maxWidth: '460px', width: '100%' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '38px 32px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 20px 45px -15px rgba(15, 23, 42, 0.1)',
              }}
            >
              {/* Security Shield Header */}
              <div style={{ textAlign: 'center', marginBottom: '26px' }}>
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '20px',
                    backgroundColor: '#0F172A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 18px',
                    color: '#60A5FA',
                    boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)',
                    border: '1.5px solid #1E293B',
                  }}
                >
                  <KeyRound size={32} />
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    color: '#2563EB',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}
                >
                  <Shield size={12} />
                  <span>Authorized Personnel Only</span>
                </div>
                <h1 style={{ fontSize: '23px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                  {language === 'bn' ? 'সেন্ট্রাল অ্যাডমিন লগইন' : 'Central Admin Login'}
                </h1>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                  {language === 'bn'
                    ? 'ডায়াগনস্টিক কেয়ার সেন্ট্রাল গভর্নেন্স ও অপারেশনাল কন্ট্রোল পোর্টাল'
                    : 'Diagnostic Care Master Governance & Operational Control Console'}
                </p>
              </div>

              {/* Error Notice */}
              {authError && (
                <div
                  style={{
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    color: '#DC2626',
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Admin Email */}
                <div style={{ marginBottom: '18px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#1E293B',
                      marginBottom: '8px',
                    }}
                  >
                    {language === 'bn' ? 'অ্যাডমিন ইমেইল ঠিকানা' : 'Admin Email Address'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={18}
                      color="#94A3B8"
                      style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contact.amdadur@gmail.com"
                      required
                      autoComplete="username"
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 42px',
                        borderRadius: '12px',
                        border: '1.5px solid #E2E8F0',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.15s ease',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = BRAND_COLORS.primary)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#1E293B',
                      marginBottom: '8px',
                    }}
                  >
                    {language === 'bn' ? 'অ্যাডমিন পাসওয়ার্ড' : 'Admin Password'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={18}
                      color="#94A3B8"
                      style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      autoComplete="current-password"
                      style={{
                        width: '100%',
                        padding: '12px 42px 12px 42px',
                        borderRadius: '12px',
                        border: '1.5px solid #E2E8F0',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.15s ease',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = BRAND_COLORS.primary)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '13px',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14.5px',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
                    opacity: loading ? 0.75 : 1,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <ShieldCheck size={18} />
                  <span>
                    {loading
                      ? (language === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Authenticating Clearance...')
                      : (language === 'bn' ? 'লগইন করে অ্যাডমিন প্যানেলে যান' : 'Authenticate & Open Panel')}
                  </span>
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>

              {/* Return to Public Portal */}
              <div style={{ textAlign: 'center', marginTop: '18px' }}>
                <Link
                  href="/"
                  style={{
                    color: '#64748B',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  {language === 'bn' ? '← মূল হোমপেইজে ফিরুন' : '← Return to Public Marketplace'}
                </Link>
              </div>

              {/* Security Footnote */}
              <div
                style={{
                  marginTop: '22px',
                  paddingTop: '16px',
                  borderTop: '1px solid #F1F5F9',
                  textAlign: 'center',
                  fontSize: '11.5px',
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Lock size={12} />
                <span>AES-256 Encrypted Session • Governance Audit Logged</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer language={language} setLanguage={setLanguage} />
    </div>
  );
}
