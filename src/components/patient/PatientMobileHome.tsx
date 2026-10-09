'use client';

import React, { useState, useEffect } from 'react';
import { SupportedLanguage, BRAND_CONSTANTS } from '@/config/brand';
import { Appointment, QueueState, DoctorAssociation, DiagnosticTest, ScheduleSlot, User } from '@/types';
import { HealthcareCategoryKey } from '@/components/marketplace/CategoryNavigator';
import {
  MapPin,
  Bell,
  Search,
  Stethoscope,
  TestTube2,
  Building2,
  Pill,
  Truck,
  HeartHandshake,
  Upload,
  Lock,
  Phone,
  Clock,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Star,
  Activity,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  User as LucideUser,
} from 'lucide-react';

interface PatientMobileHomeProps {
  language: SupportedLanguage;
  selectedLocation: string;
  onOpenLocationModal: () => void;
  onOpenNotificationsModal: () => void;
  onNavigateTab: (tab: any) => void;
  onSelectCategory: (cat: HealthcareCategoryKey) => void;
  onOpenAmbulance: () => void;
  onOpenHomeCare: () => void;
  onOpenHelpline: () => void;
  upcomingAppointment?: Appointment | null;
  activeQueue?: QueueState | null;
  doctorAssociations: DoctorAssociation[];
  diagnosticTests: DiagnosticTest[];
  onSelectSlot: (slot: ScheduleSlot, assoc: DoctorAssociation) => void;
  onSelectTest: (test: DiagnosticTest) => void;
  currentUser?: { fullName?: string; phone?: string; [key: string]: any } | null;
}

export default function PatientMobileHome({
  language,
  selectedLocation,
  onOpenLocationModal,
  onOpenNotificationsModal,
  onNavigateTab,
  onSelectCategory,
  onOpenAmbulance,
  onOpenHomeCare,
  onOpenHelpline,
  upcomingAppointment,
  activeQueue,
  doctorAssociations,
  diagnosticTests,
  onSelectSlot,
  onSelectTest,
  currentUser,
}: PatientMobileHomeProps) {
  const [greeting, setGreeting] = useState('Hello');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (language === 'en') {
      if (hour < 12) setGreeting('Good Morning');
      else if (hour < 17) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    } else {
      if (hour < 12) setGreeting('শুভ সকাল');
      else if (hour < 17) setGreeting('শুভ দুপুর');
      else setGreeting('শুভ সন্ধ্যা');
    }
  }, [language]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigateTab('search');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '36px' }}>
      {/* 1. TOP MOBILE HEADER BAR: Greeting, Location, Notification Icon, Profile */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '4px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>{greeting}, {currentUser?.fullName?.split(' ')[0] || (language === 'en' ? 'Patient' : 'সম্মানিত রোগী')}</span>
            <span style={{ fontSize: '13px' }}>👋</span>
          </div>

          {/* Location Trigger Pill */}
          <button
            onClick={onOpenLocationModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--slate-200)',
              padding: '4px 10px',
              borderRadius: '20px',
              marginTop: '4px',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              textAlign: 'left',
            }}
          >
            <MapPin size={12} color="var(--cyan-600)" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy-900)' }}>
              {selectedLocation}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--slate-400)' }}>▼</span>
          </button>
        </div>

        {/* Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Notification Bell */}
          <button
            onClick={onOpenNotificationsModal}
            aria-label="Notifications"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--slate-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--slate-700)',
              position: 'relative',
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '8px',
                height: '8px',
                backgroundColor: '#EF4444',
                borderRadius: '50%',
                border: '1.5px solid #FFFFFF',
              }}
            />
          </button>

          {/* Profile Avatar */}
          <button
            onClick={() => onNavigateTab('profile')}
            aria-label="Profile"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: currentUser
                ? 'linear-gradient(135deg, var(--navy-900) 0%, var(--cyan-600) 100%)'
                : '#F1F5F9',
              color: currentUser ? '#FFFFFF' : '#475569',
              border: currentUser ? 'none' : '1px solid #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: currentUser ? '0 2px 8px rgba(10, 22, 40, 0.2)' : 'none',
            }}
          >
            {currentUser?.fullName ? currentUser.fullName.charAt(0).toUpperCase() : <LucideUser size={18} />}
          </button>
        </div>
      </div>

      {/* 2. UNIVERSAL HEALTHCARE SEARCH BAR */}
      <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
        <Search
          size={18}
          color="var(--slate-400)"
          style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          placeholder={
            language === 'en'
              ? 'Search doctor, test, hospital or pharmacy...'
              : 'ডাক্তার, ল্যাব টেস্ট, হাসপাতাল বা ফার্মেসি খুঁজুন...'
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            // Optional: navigate directly to search
          }}
          style={{
            width: '100%',
            padding: '14px 16px 14px 44px',
            borderRadius: '16px',
            border: '1.5px solid var(--slate-300)',
            fontSize: '13.5px',
            backgroundColor: '#FFFFFF',
            outline: 'none',
            boxShadow: '0 2px 8px rgba(10, 22, 40, 0.04)',
          }}
        />
      </form>

      {/* 3. QUICK ACTIONS GRID (8 KEY ACTIONS) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--navy-900)' }}>
            {language === 'en' ? 'Quick Healthcare Services' : 'দ্রুত স্বাস্থ্যসেবাসমূহ'}
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--cyan-600)', fontWeight: 700 }}>
            {language === 'en' ? 'Verified Hub' : 'ভেরিফাইড হাব'}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
          }}
        >
          {/* Action 1: Find Doctor */}
          <button
            onClick={() => {
              onSelectCategory('DOCTORS');
              onNavigateTab('search');
            }}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--slate-200)',
              borderRadius: '14px',
              padding: '12px 6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              minHeight: '74px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--cyan-50)', color: 'var(--cyan-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Stethoscope size={20} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--navy-900)', textAlign: 'center', lineHeight: 1.2 }}>
              {language === 'en' ? 'Find Doctor' : 'ডাক্তার'}
            </span>
          </button>

          {/* Action 2: Book Test */}
          <button
            onClick={() => {
              onSelectCategory('TESTS');
              onNavigateTab('search');
            }}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--slate-200)',
              borderRadius: '14px',
              padding: '12px 6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              minHeight: '74px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--emerald-50)', color: 'var(--emerald-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TestTube2 size={20} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--navy-900)', textAlign: 'center', lineHeight: 1.2 }}>
              {language === 'en' ? 'Book Test' : 'ল্যাব টেস্ট'}
            </span>
          </button>

          {/* Action 3: Hospitals */}
          <button
            onClick={() => {
              onSelectCategory('HOSPITALS');
              onNavigateTab('search');
            }}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--slate-200)',
              borderRadius: '14px',
              padding: '12px 6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              minHeight: '74px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--blue-50)', color: 'var(--blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--navy-900)', textAlign: 'center', lineHeight: 1.2 }}>
              {language === 'en' ? 'Hospitals' : 'হাসপাতাল'}
            </span>
          </button>

          {/* Action 4: Pharmacies */}
          <button
            onClick={() => {
              onSelectCategory('PHARMACIES');
              onNavigateTab('search');
            }}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--slate-200)',
              borderRadius: '14px',
              padding: '12px 6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              minHeight: '74px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pill size={20} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--navy-900)', textAlign: 'center', lineHeight: 1.2 }}>
              {language === 'en' ? 'Pharmacy' : 'ফার্মেসি'}
            </span>
          </button>

          {/* Action 5: 24/7 Ambulance */}
          <button
            onClick={onOpenAmbulance}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--slate-200)',
              borderRadius: '14px',
              padding: '12px 6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              minHeight: '74px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--rose-50)', color: 'var(--rose-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={20} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--navy-900)', textAlign: 'center', lineHeight: 1.2 }}>
              {language === 'en' ? 'Ambulance' : 'অ্যাম্বুলেন্স'}
            </span>
          </button>

          {/* Action 6: Home Healthcare */}
          <button
            onClick={onOpenHomeCare}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--slate-200)',
              borderRadius: '14px',
              padding: '12px 6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              minHeight: '74px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HeartHandshake size={20} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--navy-900)', textAlign: 'center', lineHeight: 1.2 }}>
              {language === 'en' ? 'Home Care' : 'হোম কেয়ার'}
            </span>
          </button>

          {/* Action 7: Upload Report */}
          <button
            onClick={() => onNavigateTab('reports')}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--slate-200)',
              borderRadius: '14px',
              padding: '12px 6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              minHeight: '74px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--cyan-50)', color: 'var(--cyan-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload size={20} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--navy-900)', textAlign: 'center', lineHeight: 1.2 }}>
              {language === 'en' ? 'Upload Slip' : 'রিপোর্ট আপলোড'}
            </span>
          </button>

          {/* Action 8: Health Vault */}
          <button
            onClick={() => onNavigateTab('reports')}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--slate-200)',
              borderRadius: '14px',
              padding: '12px 6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              minHeight: '74px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#F8FAFC', color: 'var(--navy-900)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={20} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--navy-900)', textAlign: 'center', lineHeight: 1.2 }}>
              {language === 'en' ? 'Health Vault' : 'হেলথ ভল্ট'}
            </span>
          </button>
        </div>
      </div>

      {/* 4. EMERGENCY SERVICES BANNER (Responsible Healthcare Disclaimer) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #BE123C 0%, #9F1239 100%)',
          color: '#FFFFFF',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 6px 20px rgba(190, 18, 60, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🚨</span>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 800 }}>
                {language === 'en' ? 'Emergency Medical Dispatch' : 'জরুরি মেডিকেল ও অ্যাম্বুলেন্স সেবা'}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.9 }}>
                {language === 'en' ? '24/7 Helpline: 01886-748564' : 'সার্বক্ষণিক হেল্পলাইন: ০১৮৮৬-৭৪৮৫৬৪'}
              </div>
            </div>
          </div>

          <a
            href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#BE123C',
              padding: '7px 12px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '12px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Phone size={13} />
            <span>Call 24/7</span>
          </a>
        </div>

        <div style={{ fontSize: '10.5px', opacity: 0.85, lineHeight: 1.4, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '8px' }}>
          {language === 'en'
            ? 'Disclaimer: For critical life-threatening conditions, please dial 999 or proceed immediately to the nearest hospital trauma center.'
            : 'সতর্কতা: প্রাণঘাতী জরুরি পরিস্থিতিতে সরাসরি ৯৯৯ নম্বরে অথবা নিকটস্থ হাসপাতালের জরুরি বিভাগে যোগাযোগ করুন।'}
        </div>
      </div>

      {/* 5. UPCOMING APPOINTMENT & LIVE QUEUE TICKER */}
      {upcomingAppointment ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid var(--cyan-500)',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 4px 16px rgba(6, 182, 212, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="beacon-dot green" />
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#065F46', textTransform: 'uppercase' }}>
                {language === 'en' ? 'Next Upcoming Consultation' : 'পরবর্তী আসন্ন অ্যাপয়েন্টমেন্ট'}
              </span>
            </div>

            <div
              style={{
                backgroundColor: 'var(--navy-900)',
                color: '#FFFFFF',
                padding: '3px 8px',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '12px',
              }}
            >
              Token #{upcomingAppointment.tokenNumber.toString().padStart(2, '0')}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy-900)' }}>
              {upcomingAppointment.doctorName}
            </h3>
            <div style={{ fontSize: '12.5px', color: 'var(--cyan-600)', fontWeight: 600 }}>
              {upcomingAppointment.specialization}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--slate-500)', marginTop: '4px' }}>
              📍 {upcomingAppointment.organizationName}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#F8FAFC',
              padding: '10px 12px',
              borderRadius: '10px',
              fontSize: '12px',
            }}
          >
            <div>
              <span style={{ color: 'var(--slate-500)' }}>Date: </span>
              <strong>{upcomingAppointment.appointmentDate}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--slate-500)' }}>Time: </span>
              <strong>{upcomingAppointment.startTime}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onNavigateTab('queue')}
              style={{
                flex: 1,
                backgroundColor: 'var(--cyan-600)',
                color: '#FFFFFF',
                padding: '9px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '12px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {language === 'en' ? 'Track Live Queue' : 'লাইভ সিরিয়াল দেখুন'}
            </button>

            <a
              href="tel:01886748564"
              style={{
                flex: 1,
                backgroundColor: '#F1F5F9',
                color: 'var(--slate-700)',
                padding: '9px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '12px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
              }}
            >
              <Phone size={13} color="var(--cyan-600)" />
              <span>{language === 'en' ? 'Call Chamber' : 'চেম্বারে কল'}</span>
            </a>
          </div>
        </div>
      ) : activeQueue ? (
        /* Chamber Live Queue Status Bar */
        <div
          onClick={() => onNavigateTab('queue')}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--slate-200)',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'var(--emerald-50)',
                color: 'var(--emerald-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Activity size={22} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy-900)' }}>
                {language === 'en' ? 'Chamber Live Queue Monitor' : 'চেম্বার লাইভ সিরিয়াল মনিটর'}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--slate-500)', marginTop: '2px' }}>
                {language === 'en'
                  ? `Now Serving Token #${activeQueue.currentTokenServing} • Popular Diagnostic`
                  : `বর্তমানে সেবা নিচ্ছেন টোকেন #${activeQueue.currentTokenServing} • পপুলার ডায়াগনস্টিক`}
              </div>
            </div>
          </div>
          <ChevronRight size={18} color="var(--slate-400)" />
        </div>
      ) : null}

      {/* 6. POPULAR SPECIALISTS IN MOULVIBAZAR / SYLHET */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--navy-900)' }}>
              {language === 'en' ? 'Featured Specialist Doctors' : 'বিশেষজ্ঞ ডাক্তারদের চেম্বার'}
            </h2>
            <p style={{ fontSize: '11.5px', color: 'var(--slate-500)' }}>
              {selectedLocation} • BMDC Verified
            </p>
          </div>
          <button
            onClick={() => {
              onSelectCategory('DOCTORS');
              onNavigateTab('search');
            }}
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--cyan-600)',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            <span>{language === 'en' ? 'View All' : 'সব দেখুন'}</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Doctor Cards Horizontal or Vertical List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {doctorAssociations.slice(0, 3).map((assoc) => (
            <div
              key={assoc.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid var(--slate-200)',
                boxShadow: '0 2px 8px rgba(10, 22, 40, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--cyan-50)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', color: 'var(--cyan-600)', fontWeight: 700, marginBottom: '4px' }}>
                    <ShieldCheck size={11} />
                    <span>BMDC Verified</span>
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--navy-900)' }}>
                    {assoc.doctor?.fullName}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--cyan-600)', fontWeight: 600 }}>
                    {assoc.doctor?.specialization}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--slate-500)', marginTop: '2px' }}>
                    {assoc.organizationName}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--navy-900)' }}>
                    ৳{assoc.consultationFee}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--slate-400)' }}>
                    {language === 'en' ? 'Per consultation' : 'পরামর্শ ফি'}
                  </div>
                </div>
              </div>

              {/* Real-time Chamber Slots Selector */}
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
                    {language === 'en' ? '✓ Evening Chamber (4:00 PM - 8:00 PM)' : '✓ সান্ধ্যকালীন চেম্বার (৪:০০ - ৮:০০)'}
                  </span>
                  <span style={{ fontSize: '10.5px', color: '#64748B' }}>
                    {language === 'en' ? 'Available Slots:' : 'সরাসরি স্লট:'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { time: '16:00', token: 1, end: '16:15' },
                    { time: '16:15', token: 2, end: '16:30' },
                    { time: '16:30', token: 3, end: '16:45' },
                    { time: '16:45', token: 4, end: '17:00' },
                    { time: '17:00', token: 5, end: '17:15' },
                    { time: '17:15', token: 6, end: '17:30' },
                  ].map((slotItem) => {
                    const todayStr = new Date().toISOString().split('T')[0];
                    const realSlot: ScheduleSlot = {
                      id: `slot-${assoc.id}-${slotItem.time.replace(':', '')}`,
                      doctorScheduleId: `sched-${assoc.id}`,
                      doctorAssociationId: assoc.id,
                      branchId: assoc.branchId,
                      slotDate: todayStr,
                      startTime: slotItem.time,
                      endTime: slotItem.end,
                      tokenNumber: slotItem.token,
                      status: 'AVAILABLE',
                    };

                    return (
                      <button
                        key={slotItem.time}
                        onClick={() => onSelectSlot(realSlot, assoc)}
                        style={{
                          backgroundColor: '#EFF6FF',
                          color: '#0057FF',
                          border: '1px solid #0057FF',
                          padding: '6px 9px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {slotItem.time} (T#{slotItem.token})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. POPULAR DIAGNOSTIC TESTS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--navy-900)' }}>
              {language === 'en' ? 'Popular Pathology & Lab Tests' : 'জনপ্রিয় ডায়াগনস্টিক ল্যাব টেস্ট'}
            </h2>
            <p style={{ fontSize: '11.5px', color: 'var(--slate-500)' }}>
              {language === 'en' ? 'Same-day turnaround & home sample collection' : 'একই দিনে রিপোর্ট ও হোম কালেকশন সুবিধা'}
            </p>
          </div>
          <button
            onClick={() => {
              onSelectCategory('TESTS');
              onNavigateTab('search');
            }}
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--cyan-600)',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            {language === 'en' ? 'View All' : 'সব দেখুন'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {diagnosticTests.slice(0, 4).map((test) => (
            <div
              key={test.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                padding: '14px',
                border: '1px solid var(--slate-200)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <div>
                <span style={{ fontSize: '10px', color: 'var(--cyan-600)', background: 'var(--cyan-50)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  {test.category}
                </span>
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy-900)', marginTop: '4px' }}>
                  {test.name}
                </h4>
                <div style={{ fontSize: '11px', color: 'var(--slate-500)', marginTop: '2px' }}>
                  {test.organizationName}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', borderTop: '1px solid #F1F5F9', paddingTop: '6px' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--navy-900)' }}>
                  ৳{test.price}
                </div>
                <button
                  onClick={() => onSelectTest(test)}
                  style={{
                    backgroundColor: 'var(--cyan-600)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    minHeight: '36px',
                  }}
                >
                  {language === 'en' ? 'Book' : 'বুক'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
