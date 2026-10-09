'use client';

import React from 'react';
import Link from 'next/link';
import { BRAND_CONSTANTS, BRAND_COLORS } from '@/config/brand';
import { BrandLogo } from '@/components/brand/BrandLogo';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft, ShieldCheck, FileText, PhoneCall } from 'lucide-react';

export default function TermsPage() {
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0057FF', fontWeight: 700, fontSize: '13px', marginBottom: '12px' }}>
            <FileText size={16} />
            <span>{language === 'bn' ? 'সেবার শর্তাবলী' : 'LEGAL & COMPLIANCE'}</span>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', marginBottom: '8px', lineHeight: 1.25 }}>
            {language === 'bn' ? 'ডায়াগনস্টিক কেয়ার সেবার শর্তাবলী' : 'Diagnostic Care — Terms of Service'}
          </h1>

          <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '32px' }}>
            {language === 'bn' ? 'সর্বশেষ সংস্করণ: অক্টোবর ২০২৬ • সংস্করণ ১.০' : 'Last Updated: October 2026 • Production Version 1.0'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontSize: '14.5px', color: '#334155', lineHeight: 1.7 }}>
            <section>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                {language === 'bn' ? '১. প্ল্যাটফর্মের পরিচিতি' : '1. Overview of the Platform'}
              </h2>
              <p>
                {language === 'bn'
                  ? 'ডায়াগনস্টিক কেয়ার (Diagnostic Care) বাংলাদেশের একটি সমন্বিত ডিজিটাল স্বাস্থ্যসেবা মার্কেটপ্লেস ও ক্লিনিক্যাল প্ল্যাটফর্ম। এই প্ল্যাটফর্মের মাধ্যমে রোগীরা ভেরিফাইড বিএমডিসি ডাক্তার অ্যাপয়েন্টমেন্ট, অনুমোদিত ডায়াগনস্টিক ল্যাব টেস্ট, হাসপাতাল তথ্য ও জরুরি অ্যাম্বুলেন্স সেবা গ্রহণ করতে পারেন।'
                  : 'Diagnostic Care is a national digital healthcare marketplace engineered for Bangladesh. The platform connects patients with verified BMDC-registered specialist doctors, accredited diagnostic laboratories, partner hospitals, and 24/7 emergency dispatch services.'}
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                {language === 'bn' ? '২. রোগীর দায়িত্ব ও নিবন্ধন' : '2. Patient Account & Eligibility'}
              </h2>
              <p>
                {language === 'bn'
                  ? 'রোগী নিবন্ধনের সময় সঠিক নাম, বয়স এবং সক্রিয় বাংলাদেশী মোবাইল নম্বর প্রদান করা আবশ্যক। ভুল বা বিভ্রান্তিকর তথ্য প্রদান করা হলে অ্যাপয়েন্টমেন্ট বাতিল হতে পারে।'
                  : 'Patients must provide accurate identification, age, and an active Bangladesh mobile number (01XXXXXXXXX) during registration. Diagnostic Care does not permit unauthorized role escalation.'}
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                {language === 'bn' ? '৩. ক্লিনিক্যাল দায়িত্ব ও জরুরি নোটিশ' : '3. Clinical Services & Emergency Disclaimer'}
              </h2>
              <p>
                {language === 'bn'
                  ? 'ডায়াগনস্টিক কেয়ার সরাসরি কোনো মেডিকেল পরামর্শ দেয় না। পরামর্শ ও ডায়াগনস্টিক ফলাফল সংশ্লিষ্ট অনুমোদিত ডাক্তার এবং ডায়াগনস্টিক সেন্টারের দায়িত্ব। যেকোনো জীবন-সংশয়ী বা সংকটজনক জরুরি অবস্থায় নিকটস্থ জরুরি বিভাগে যোগাযোগ করুন অথবা আমাদের সার্বক্ষণিক হটলাইন ০১৮৮৬৭৪৮৫৬৪-এ কল করুন।'
                  : 'Diagnostic Care acts as a verified marketplace facilitator. Clinical consultations and pathology analyses are the sole responsibility of licensed medical practitioners and accredited laboratories. In life-threatening emergencies, immediately call our 24/7 hotline 01886748564 or visit an emergency room.'}
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                {language === 'bn' ? '৪. বুকিং, ক্যানসেলেশন ও পেমেন্ট' : '4. Bookings, Slot Reservation & Payments'}
              </h2>
              <p>
                {language === 'bn'
                  ? 'পরামর্শের স্লট ৫ মিনিটের জন্য সংরক্ষিত থাকে। নিশ্চিত বুকিং বাতিল করার জন্য চেম্বার শুরুর কমপক্ষে ২ ঘণ্টা পূর্বে নোটিফিকেশন পাঠাতে হবে। অনলাইন পেমেন্ট (বিকাশ/নগদ) অথবা চেম্বারে নগদ অর্থ প্রদান সম্পূর্ণ সুরক্ষিত।'
                  : 'Selected appointment slots are locked for 5 minutes during the checkout process to prevent double-booking. Cancellations must be submitted at least 2 hours prior to scheduled consultation duty. Both online payments (bKash/Nagad) and cash-at-desk are accepted.'}
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                {language === 'bn' ? '৫. যোগাযোগ ও কাস্টমার কেয়ার' : '5. Customer Support & Legal Inquiries'}
              </h2>
              <p>
                {language === 'bn'
                  ? 'যেকোনো আইনি বা সেবা সংক্রান্ত অনুসন্ধানের জন্য আমাদের হেল্পলাইনে কল করুন: ০১৮৮৬-৭৪৮৫৬৪ অথবা support@diagnosticcare.com.bd ঠিকানায় ইমেইল করুন।'
                  : `For any inquiries regarding these terms, please contact our 24/7 operations center at ${BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY} or email support@diagnosticcare.com.bd.`}
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
