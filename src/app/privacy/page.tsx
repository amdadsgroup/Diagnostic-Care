'use client';

import React from 'react';
import Link from 'next/link';
import { BRAND_CONSTANTS, BRAND_COLORS } from '@/config/brand';
import { BrandLogo } from '@/components/brand/BrandLogo';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft, ShieldCheck, Lock, Eye, Database } from 'lucide-react';

export default function PrivacyPage() {
  const { language } = useLanguage();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F7F4', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Top Header */}
      <header
        style={{
          height: '68px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <BrandLogo variant="horizontal" size={32} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <LanguageSwitcher variant="pills" showIcon />
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#475569',
              textDecoration: 'none',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
            }}
          >
            <ArrowLeft size={14} />
            <span>{language === 'bn' ? 'হোমে ফিরুন' : 'Back to Home'}</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '40px 36px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            border: '1px solid #E2E8F0',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10B981', fontWeight: 700, fontSize: '13px', marginBottom: '12px' }}>
            <Lock size={16} />
            <span>{language === 'bn' ? 'তথ্য সুরক্ষা ও গোপনীয়তা' : 'HEALTH DATA PRIVACY & VAULT'}</span>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', marginBottom: '8px', lineHeight: 1.25 }}>
            {language === 'bn' ? 'ডায়াগনস্টিক কেয়ার গোপনীয়তা নীতি' : 'Diagnostic Care — Privacy Policy'}
          </h1>

          <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '32px' }}>
            {language === 'bn' ? 'সর্বশেষ সংস্করণ: অক্টোবর ২০২৬ • সংস্করণ ১.০' : 'Last Updated: October 2026 • Production Version 1.0'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontSize: '14.5px', color: '#334155', lineHeight: 1.7 }}>
            <section>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                {language === 'bn' ? '১. সংগৃহীত তথ্যের ধরন' : '1. Information We Collect'}
              </h2>
              <p>
                {language === 'bn'
                  ? 'অ্যাপয়েন্টমেন্ট ও টেস্ট বুকিং নিশ্চিত করতে রোগীর নাম, বয়স, লিঙ্গ, যোগাযোগের মোবাইল নম্বর এবং প্রযোজ্য ক্ষেত্রে টেস্টের ধরণ সংরক্ষণ করা হয়। আমরা কখনো কোনো অপ্রয়োজনীয় তথ্য সংগ্রহ করি না।'
                  : 'We collect patient full name, age, gender, active mobile number, and specific test or appointment selections required to deliver clinical and healthcare services in Bangladesh.'}
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                {language === 'bn' ? '২. ২৫৬-বিট এনক্রিপ্টেড ডিজিটাল হেলথ ভল্ট' : '2. 256-Bit Encrypted Health Vault'}
              </h2>
              <p>
                {language === 'bn'
                  ? 'আপনার সকল প্রেসক্রিপশন ও ডায়াগনস্টিক রিপোর্ট সামরিক গ্রেডের AES-256 এনক্রিপশনের মাধ্যমে সংরক্ষিত থাকে। রোগীর স্পষ্ট অনুমতি ব্যতীত কোনো রিপোর্ট বা প্রেসক্রিপশন তৃতীয় পক্ষের সাথে শেয়ার করা হয় না।'
                  : 'Diagnostic laboratory reports and doctor prescriptions uploaded to the Digital Health Vault are protected using industry-standard AES-256 encryption. Patient medical history is never shared without explicit patient consent.'}
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                {language === 'bn' ? '৩. তথ্যের বাণিজ্যিক ব্যবহার নিষেধ' : '3. Zero Commercial Exploitation of Health Records'}
              </h2>
              <p>
                {language === 'bn'
                  ? 'ডায়াগনস্টিক কেয়ার কখনোই কোনো রোগীর ব্যক্তিগত মেডিকেল তথ্য বা হিস্ট্রি বিজ্ঞাপনী সংস্থা বা তৃতীয় কোনো বাণিজ্যিক প্রতিষ্ঠানের কাছে বিক্রি করে না।'
                  : 'Diagnostic Care strictly adheres to a zero-commercial-sale policy regarding patient clinical data. Medical records and contact information are never sold or rented to third-party advertisers.'}
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                {language === 'bn' ? '৪. রোগীর অধিকার ও তথ্য মোছার আবেদন' : '4. Patient Data Rights & Erasure'}
              </h2>
              <p>
                {language === 'bn'
                  ? 'যেকোনো সময় রোগী তার অ্যাকাউন্টে থাকা রিপোর্ট ডাউনলোড করতে পারেন অথবা সম্পূর্ণ অ্যাকাউন্ট এবং তথ্য মুছে ফেলার জন্য অনুরোধ করতে পারেন।'
                  : 'Patients retain complete ownership of their healthcare records and may request certified PDF downloads or complete account erasure at any time by contacting customer care.'}
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
