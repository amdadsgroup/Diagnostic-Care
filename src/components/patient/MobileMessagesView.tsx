'use client';

import React, { useState } from 'react';
import { SupportedLanguage, BRAND_CONSTANTS, BRAND_COLORS } from '@/config/brand';
import {
  MessageSquare,
  Phone,
  Send,
  HelpCircle,
  Bell,
  ShieldCheck,
  Clock,
  ArrowRight,
  Ambulance,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface MobileMessagesViewProps {
  language: SupportedLanguage;
  currentUser?: any;
  onNavigateTab: (tab: any) => void;
  onOpenSupportTicket?: () => void;
  onOpenNotifications?: () => void;
}

export default function MobileMessagesView({
  language,
  currentUser,
  onNavigateTab,
  onOpenSupportTicket,
  onOpenNotifications,
}: MobileMessagesViewProps) {
  const [quickQuerySent, setQuickQuerySent] = useState(false);
  const [quickMessage, setQuickMessage] = useState('');

  const handleQuickSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMessage.trim()) return;
    setQuickQuerySent(true);
    setQuickMessage('');
    setTimeout(() => setQuickQuerySent(false), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '36px' }}>
      {/* Top Header Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--navy-900) 0%, #142B4E 100%)',
          color: '#FFFFFF',
          borderRadius: '20px',
          padding: '24px 20px',
          boxShadow: '0 8px 24px rgba(10, 22, 40, 0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#67E8F9',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span className="beacon-dot green" />
              {language === 'en' ? '24/7 Care & Support Center' : '২৪/৭ সাপোর্ট ও সহায়তা কেন্দ্র'}
            </span>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38BDF8',
              }}
            >
              <MessageSquare size={20} />
            </div>
          </div>

          <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
            {language === 'en' ? 'Messages & Support' : 'মেসেজ ও কাস্টমার কেয়ার'}
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px', margin: '4px 0 0 0', lineHeight: 1.45 }}>
            {language === 'en'
              ? 'Connect directly with our care coordinators for chamber serial assistance, report queries, or urgent medical navigation.'
              : 'চেম্বার সিরিয়াল, ডাক্তারের সময়সূচী এবং যে কোনো প্রয়োজনে আমাদের সাপোর্ট টিমের সাথে সরাসরি যোগাযোগ করুন।'}
          </p>
        </div>
      </div>

      {/* Primary Channel 1: 24/7 Clinical Helpline Call */}
      <div
        className="glass-card"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '20px',
          border: '1.5px solid rgba(0, 96, 250, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 96, 250, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0060FA 0%, #0046B8 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0, 96, 250, 0.3)',
            }}
          >
            <Phone size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#0060FA', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {language === 'en' ? 'Toll-Free Patient Care' : 'সার্বক্ষণিক রোগী সেবা'}
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy-900)', margin: '2px 0 0 0' }}>
              {language === 'en' ? '24/7 Clinical Helpline' : '২৪/৭ ডায়াগনস্টিক হেল্পলাইন'}
            </h3>
            <div style={{ fontSize: '13px', color: 'var(--slate-600)', marginTop: '2px', fontWeight: 600 }}>
              {BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}
            </div>
          </div>
        </div>

        <p style={{ fontSize: '12.5px', color: 'var(--slate-600)', margin: 0, lineHeight: 1.45 }}>
          {language === 'en'
            ? 'Free instant assistance for booking specialist doctors, chamber address verification, and emergency consultations.'
            : 'বিশেষজ্ঞ ডাক্তারের চেম্বার সিরিয়াল কনফার্মেশন ও জরুরি হাসপাতালে ভর্তির তথ্যের জন্য সরাসরি কল করুন।'}
        </p>

        <a
          href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
          style={{
            backgroundColor: BRAND_COLORS.primary,
            color: '#FFFFFF',
            textDecoration: 'none',
            padding: '13px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(0, 96, 250, 0.28)',
            transition: 'all 0.15s ease',
          }}
        >
          <Phone size={17} />
          <span>{language === 'en' ? `Call Now: ${BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}` : `এখনই কল করুন: ${BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}`}</span>
        </a>
      </div>

      {/* Primary Channel 2: WhatsApp Support */}
      <div
        className="glass-card"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '20px',
          border: '1px solid #DCFCE7',
          boxShadow: '0 2px 10px rgba(16, 185, 129, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '22px',
            }}
          >
            💬
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--navy-900)', margin: 0 }}>
              {language === 'en' ? 'Direct WhatsApp Help Desk' : 'সরাসরি হোয়াটসঅ্যাপ সহায়তা'}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--slate-500)', margin: '2px 0 0 0' }}>
              {language === 'en' ? 'Quick response within 5 minutes' : '৫ মিনিটের মধ্যে দ্রুত ফিরতি উত্তর'}
            </p>
          </div>
        </div>

        <a
          href={`https://wa.me/8801886748564?text=${encodeURIComponent(
            language === 'en'
              ? 'Hello Diagnostic Care, I need assistance with doctor chamber booking.'
              : 'হ্যালো ডায়াগনস্টিক কেয়ার, ডাক্তার অ্যাপয়েন্টমেন্ট ও চেম্বার সেবায় আমার সহায়তা প্রয়োজন।'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: '#25D366',
            color: '#FFFFFF',
            textDecoration: 'none',
            padding: '12px 18px',
            borderRadius: '12px',
            fontSize: '13.5px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)',
          }}
        >
          <span>{language === 'en' ? 'Chat on WhatsApp' : 'হোয়াটসঅ্যাপে চ্যাট করুন'}</span>
          <ArrowRight size={15} />
        </a>
      </div>

      {/* Channel 3: Online Support Ticket & Grievances */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '20px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HelpCircle size={20} color="#0060FA" />
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--navy-900)', margin: 0 }}>
              {language === 'en' ? 'Support Ticket & Grievances' : 'সাপোর্ট টিকিট ও অভিযোগ'}
            </h3>
          </div>
          {onOpenSupportTicket && (
            <button
              onClick={onOpenSupportTicket}
              style={{
                backgroundColor: 'rgba(0, 96, 250, 0.08)',
                color: '#0060FA',
                border: '1px solid rgba(0, 96, 250, 0.25)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {language === 'en' ? '+ Open Ticket' : '+ নতুন টিকিট'}
            </button>
          )}
        </div>

        <p style={{ fontSize: '12.5px', color: 'var(--slate-600)', margin: 0, lineHeight: 1.45 }}>
          {language === 'en'
            ? 'Have an issue with a chamber serial delay, fee refund, or report delivery? Open a ticket to receive tracked resolution from our support team.'
            : 'সিরিয়াল বিলম্ব, ফি ফেরত বা রিপোর্ট সংক্রান্ত সমস্যা সমাধান করতে একটি সাপোর্ট টিকিট ওপেন করুন।'}
        </p>

        {/* Quick Message Form */}
        <form onSubmit={handleQuickSend} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={quickMessage}
            onChange={(e) => setQuickMessage(e.target.value)}
            placeholder={
              language === 'en'
                ? 'Type your inquiry or message...'
                : 'আপনার প্রশ্ন বা বার্তা লিখুন...'
            }
            style={{
              flex: 1,
              padding: '11px 14px',
              borderRadius: '10px',
              border: '1px solid var(--slate-300)',
              fontSize: '13px',
              outline: 'none',
              backgroundColor: '#F8FAFC',
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: 'var(--navy-900)',
              color: '#FFFFFF',
              border: 'none',
              padding: '0 16px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Send size={16} />
          </button>
        </form>

        {quickQuerySent && (
          <div
            style={{
              backgroundColor: '#ECFDF5',
              color: '#065F46',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '12.5px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={16} color="#10B981" />
            <span>
              {language === 'en'
                ? 'Your inquiry has been submitted! Support team will reach you shortly.'
                : 'আপনার বার্তাটি জমা হয়েছে! কাস্টমার কেয়ার টিম দ্রুত যোগাযোগ করবে।'}
            </span>
          </div>
        )}
      </div>

      {/* System Notifications & Announcements */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '4px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {language === 'en' ? 'Healthcare Messages' : 'স্বাস্থ্যসেবা নোটিফিকেশন'}
          </span>
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              style={{
                background: 'none',
                border: 'none',
                color: '#0060FA',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Bell size={13} />
              <span>{language === 'en' ? 'Settings' : 'সেটিংস'}</span>
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              padding: '14px 16px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(0, 96, 250, 0.1)',
                color: '#0060FA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sparkles size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy-900)' }}>
                  {language === 'en' ? 'Welcome to Diagnostic Care' : 'ডায়াগনস্টিক কেয়ারে স্বাগতম'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--slate-400)' }}>Today</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--slate-600)', margin: '3px 0 0 0', lineHeight: 1.4 }}>
                {language === 'en'
                  ? 'Your digital health companion in Moulvibazar and Bangladesh. Discover specialist doctors, check chamber hours, and reserve serial tokens.'
                  : 'মৌলভীবাজার সহ দেশজুড়ে বিশেষজ্ঞ ডাক্তারের চেম্বার সিরিয়াল ও ডিজিটাল স্বাস্থ্যসেবায় আমরা সর্বদা আপনার পাশে।'}
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              padding: '14px 16px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Calendar size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy-900)' }}>
                  {language === 'en' ? 'Chamber Serial Engine Ready' : 'চেম্বার সিরিয়াল ইঞ্জিন সক্রিয়'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--slate-400)' }}>Active</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--slate-600)', margin: '3px 0 0 0', lineHeight: 1.4 }}>
                {language === 'en'
                  ? 'Book chamber appointments with 100% verified serial guarantee. Track real-time live queue progression directly on your mobile device.'
                  : 'সিরিয়াল নিশ্চিত করে সরাসরি চেম্বারে যাওয়ার সুবিধা পেতে বুকিংস ট্যাব থেকে আপনার সিরিয়াল ট্র্যাক করুন।'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Hotlines Strip */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: '4px' }}>
          {language === 'en' ? 'Emergency Dispatch Numbers' : 'জরুরি জরুরি হেল্পলাইন নম্বর'}
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <a
            href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
            style={{
              backgroundColor: '#FEF2F2',
              border: '1.5px solid #FCA5A5',
              borderRadius: '14px',
              padding: '12px 14px',
              textDecoration: 'none',
              color: '#DC2626',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Ambulance size={16} />
              <span style={{ fontSize: '12px', fontWeight: 800 }}>{language === 'en' ? 'Ambulance' : 'অ্যাম্বুলেন্স'}</span>
            </div>
            <span style={{ fontSize: '12.5px', fontWeight: 700 }}>{BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}</span>
          </a>

          <a
            href="tel:999"
            style={{
              backgroundColor: '#FEF2F2',
              border: '1.5px solid #FCA5A5',
              borderRadius: '14px',
              padding: '12px 14px',
              textDecoration: 'none',
              color: '#DC2626',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={16} />
              <span style={{ fontSize: '12px', fontWeight: 800 }}>{language === 'en' ? 'National 999' : 'জাতীয় ৯৯৯'}</span>
            </div>
            <span style={{ fontSize: '12.5px', fontWeight: 700 }}>999 (Toll Free)</span>
          </a>
        </div>
      </div>

      {/* Navigation Shortcuts */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
        <button
          onClick={() => onNavigateTab('search')}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: '#F1F5F9',
            border: '1px solid #E2E8F0',
            color: 'var(--navy-900)',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {language === 'en' ? 'Browse Doctors' : 'ডাক্তার খুঁজুন'}
        </button>

        <button
          onClick={() => onNavigateTab('marketplace')}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: BRAND_COLORS.primary,
            border: 'none',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {language === 'en' ? 'Back to Home' : 'হোম পেজে যান'}
        </button>
      </div>
    </div>
  );
}
