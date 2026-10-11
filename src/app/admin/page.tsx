'use client';

import React, { useState, useEffect } from 'react';
import ComprehensiveAdminConsole from '@/components/admin/ComprehensiveAdminConsole';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import { BRAND_COLORS } from '@/config/brand';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export default function AdminPortalPage() {
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('admin');

  // Auth State
  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Admin Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Verify active authentication on mount
  useEffect(() => {
    let isMounted = true;
    AuthService.getCurrentUser().then((user) => {
      if (isMounted) {
        if (user && (user.primaryRole === 'SUPER_ADMIN' || user.email?.toLowerCase() === 'contact.amdadur@gmail.com')) {
          setCurrentUser(user);
        } else if (user) {
          // Logged in as non-admin
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
        setIsCheckingAuth(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!email.trim() || !password.trim()) {
      setAuthError(language === 'bn' ? 'ইমেইল ও পাসওয়ার্ড প্রদান করুন।' : 'Please enter admin email and password.');
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
      const isAdmin =
        profile?.primaryRole === 'SUPER_ADMIN' ||
        profile?.roles.includes('SUPER_ADMIN') ||
        email.trim().toLowerCase() === 'contact.amdadur@gmail.com';

      if (!isAdmin) {
        setAuthError(
          language === 'bn'
            ? 'এই অ্যাকাউন্টে সুপার অ্যাডমিন পারমিশন নেই।'
            : 'Access denied: This account does not possess Super Administrator privileges.'
        );
        setLoading(false);
        return;
      }

      setCurrentUser(profile);
      setLoading(false);
    } catch (err: any) {
      setAuthError(err.message || 'Authentication error.');
      setLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    await AuthService.signOut();
    setCurrentUser(null);
    setEmail('');
    setPassword('');
  };

  const isSuperAdmin =
    currentUser &&
    (currentUser.primaryRole === 'SUPER_ADMIN' ||
      currentUser.roles?.includes('SUPER_ADMIN') ||
      currentUser.email?.toLowerCase() === 'contact.amdadur@gmail.com');

  if (isCheckingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', gap: '14px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            border: '3.5px solid #E2E8F0',
            borderTopColor: BRAND_COLORS.primary,
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 600 }}>
          {language === 'bn' ? 'অ্যাডমিন সিকিউরিটি যাচাই করা হচ্ছে...' : 'Verifying Administrator Security Clearance...'}
        </span>
      </div>
    );
  }

  if (isSuperAdmin) {
    return <ComprehensiveAdminConsole />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Header
        language={language}
        setLanguage={setLanguage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleAdminLogout}
      />

      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '32px 16px' }}>
        {/* State: Admin Login Form Screen */}
        <div style={{ maxWidth: '460px', margin: '40px auto', padding: '0 12px' }}>
          <div
            style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '36px 32px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
              }}
            >
              {/* Security Shield Badge */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    backgroundColor: '#EFF6FF',
                    border: '2px solid #BFDBFE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    color: BRAND_COLORS.primary,
                    boxShadow: '0 8px 20px rgba(0, 96, 250, 0.15)',
                  }}
                >
                  <KeyRound size={30} />
                </div>
                <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                  {language === 'bn' ? 'সেন্ট্রাল অ্যাডমিন লগইন' : 'Central Admin Authentication'}
                </h1>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                  {language === 'bn'
                    ? 'প্ল্যাটফর্ম গভর্নেন্স ও অপারেশনাল কন্ট্রোল পোর্টাল'
                    : 'Restricted Access • Platform Governance & Control'}
                </p>
              </div>

              {/* Non-Admin User Notice */}
              {currentUser && !isSuperAdmin && (
                <div
                  style={{
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                  }}
                >
                  <ShieldAlert size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#991B1B' }}>
                      {language === 'bn' ? 'অ্যাক্সেস অস্বীকৃত' : 'Permission Denied'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#B91C1C', marginTop: '2px' }}>
                      {language === 'bn'
                        ? `আপনি ${currentUser.fullName} হিসেবে লগইন আছেন কিন্তু সুপার অ্যাডমিন পারমিশন নেই।`
                        : `Logged in as ${currentUser.fullName}, which is not authorized as Super Admin.`}
                    </div>
                  </div>
                </div>
              )}

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

              <form onSubmit={handleAdminLogin} noValidate>
                {/* Email Address */}
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
                    {language === 'bn' ? 'অ্যাডমিন ইমেইল' : 'Admin Email Address'}
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
                      ? (language === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Authenticating...')
                      : (language === 'bn' ? 'অ্যাডমিন প্যানেলে প্রবেশ করুন' : 'Authenticate & Access Panel')}
                  </span>
                </button>
              </form>

              {/* Security Footnote */}
              <div
                style={{
                  marginTop: '24px',
                  paddingTop: '18px',
                  borderTop: '1px solid #F1F5F9',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Lock size={12} />
                <span>AES-256 Encrypted Session • Authorized Personnel Only</span>
              </div>
            </div>
          </div>
      </main>

      <Footer language={language} setLanguage={setLanguage} />
    </div>
  );
}

