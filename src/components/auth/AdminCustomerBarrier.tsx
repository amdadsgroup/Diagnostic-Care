'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import { ShieldAlert, ArrowRight, LogOut, ShieldCheck } from 'lucide-react';
import { BRAND_COLORS } from '@/config/brand';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminCustomerBarrier({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguage();

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<AuthUserProfile | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // If we are already on an admin route (/admin or /admin/login), allow without barrier
    if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/api'))) {
      setChecking(false);
      setIsAdmin(false);
      return;
    }

    let isMounted = true;
    AuthService.getCurrentUser().then((user) => {
      if (isMounted) {
        if (
          user &&
          (user.primaryRole === 'SUPER_ADMIN' ||
            user.roles?.includes('SUPER_ADMIN') ||
            user.email?.toLowerCase() === 'contact.amdadur@gmail.com')
        ) {
          setIsAdmin(true);
          setAdminUser(user);
        } else {
          setIsAdmin(false);
        }
        setChecking(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const handleGoToAdmin = () => {
    router.push('/admin');
  };

  const handleLogoutAdmin = async () => {
    await AuthService.signOut();
    setIsAdmin(false);
    setAdminUser(null);
    window.location.reload();
  };

  // If on admin routes, render normally
  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/api'))) {
    return <>{children}</>;
  }

  // If admin is logged in on a customer side route, block customer usage
  if (isAdmin && adminUser) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#090D14',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'inherit',
        }}
      >
        {/* Futuristic Glassmorphism Card */}
        <div
          style={{
            maxWidth: '560px',
            width: '100%',
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            padding: '36px 32px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          {/* Security Shield Icon */}
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '20px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '2px solid rgba(248, 113, 113, 0.4)',
              color: '#F87171',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.25)',
            }}
          >
            <ShieldAlert size={36} />
          </div>

          {/* Badge */}
          <div style={{ marginBottom: '12px' }}>
            <span
              style={{
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.06em',
                padding: '3px 12px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
              }}
            >
              {language === 'bn' ? 'অ্যাডমিন সিকিউরিটি ব্যারিয়ার' : 'ADMIN RESTRICTION ACTIVE'}
            </span>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 10px 0', color: '#FFFFFF' }}>
            {language === 'bn'
              ? 'অ্যাডমিন অ্যাকাউন্টে কাস্টমার সাইট ব্যবহারের অনুমতি নেই'
              : 'Customer Portal Restricted for Administrators'}
          </h2>

          <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, margin: '0 0 20px 0' }}>
            {language === 'bn' ? (
              <>
                আপনি <strong style={{ color: '#38BDF8' }}>{adminUser.email}</strong> হিসেবে সুপার অ্যাডমিন সেশনে লগইন আছেন। ডেটা ইন্টিগ্রিটি ও হেলথকেয়ার কমপ্লায়েন্স রক্ষার্থে অ্যাডমিন অ্যাকাউন্টে রোগী হিসেবে সিরিয়াল বুকিং বা কাস্টমার সাইট ব্যবহার নিষিদ্ধ।
              </>
            ) : (
              <>
                You are currently logged in as an Administrator (<strong style={{ color: '#38BDF8' }}>{adminUser.email}</strong>). To preserve regulatory healthcare separation of duties and booking integrity, administrators cannot use patient/customer side workflows while authenticated in an administrative session.
              </>
            )}
          </p>

          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              borderRadius: '14px',
              padding: '14px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '12.5px',
              color: '#CBD5E1',
              marginBottom: '26px',
              textAlign: 'left',
            }}
          >
            <div style={{ fontWeight: 700, color: '#F1F5F9', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#38BDF8" />
              <span>{language === 'bn' ? 'অনুমোদিত নির্দেশনা:' : 'Mandatory Governance Directives:'}</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>
                {language === 'bn'
                  ? 'প্ল্যাটফর্ম ব্যবস্থাপনা ও নিয়ন্ত্রণের জন্য অ্যাডমিন প্যানেল ব্যবহার করুন।'
                  : 'Use the Central Admin Console to manage doctors, institutions, and appointments.'}
              </li>
              <li>
                {language === 'bn'
                  ? 'রোগী হিসেবে সিরিয়াল দিতে চাইলে বর্তমান অ্যাডমিন সেশন সাইন আউট করুন।'
                  : 'To browse or book as a patient, sign out of your administrative account.'}
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              onClick={handleGoToAdmin}
              style={{
                width: '100%',
                backgroundColor: BRAND_COLORS.primary,
                color: '#FFFFFF',
                border: 'none',
                padding: '13px',
                borderRadius: '12px',
                fontSize: '14.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 20px rgba(0, 96, 250, 0.35)',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{language === 'bn' ? 'সেন্ট্রাল অ্যাডমিন প্যানেলে যান' : 'Go to Admin Console (/admin)'}</span>
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              onClick={handleLogoutAdmin}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#CBD5E1',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
              }}
            >
              <LogOut size={16} />
              <span>{language === 'bn' ? 'অ্যাডমিন অ্যাকাউন্ট থেকে সাইন আউট করুন' : 'Sign Out Administrator Account'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not admin or not logged in: render customer side normally
  return <>{children}</>;
}
