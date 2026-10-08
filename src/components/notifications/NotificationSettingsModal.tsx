'use client';

import React, { useState, useEffect } from 'react';
import { SupportedLanguage } from '@/config/brand';
import { Bell, ShieldCheck, Check, X, BellRing, Smartphone, AlertCircle } from 'lucide-react';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

export default function NotificationSettingsModal({
  isOpen,
  onClose,
  language,
}: NotificationSettingsModalProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [appointmentsAlert, setAppointmentsAlert] = useState(true);
  const [reportsAlert, setReportsAlert] = useState(true);
  const [chamberDelayAlert, setChamberDelayAlert] = useState(true);
  const [emergencyAlert, setEmergencyAlert] = useState(true);
  const [promotionsAlert, setPromotionsAlert] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      // Load saved preferences
      const savedPrefs = localStorage.getItem('dc_notif_prefs');
      if (savedPrefs) {
        try {
          const p = JSON.parse(savedPrefs);
          if (p.appointments !== undefined) setAppointmentsAlert(p.appointments);
          if (p.reports !== undefined) setReportsAlert(p.reports);
          if (p.chamber !== undefined) setChamberDelayAlert(p.chamber);
          if (p.emergency !== undefined) setEmergencyAlert(p.emergency);
          if (p.promotions !== undefined) setPromotionsAlert(p.promotions);
        } catch (e) {}
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSavePreferences = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'dc_notif_prefs',
        JSON.stringify({
          appointments: appointmentsAlert,
          reports: reportsAlert,
          chamber: chamberDelayAlert,
          emergency: emergencyAlert,
          promotions: promotionsAlert,
        })
      );
    }
    onClose();
  };

  const handleRequestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setStatusMessage(
        language === 'en'
          ? 'Push notifications are not supported on this browser or platform.'
          : 'এই ব্রাউজারে পুশ নোটিফিকেশন সমর্থিত নয়।'
      );
      return;
    }

    setIsRequesting(true);
    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        // Show test welcome notification
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.ready;
          reg.showNotification(
            language === 'en' ? 'Diagnostic Care Alerts Enabled' : 'ডায়াগনস্টিক কেয়ার নোটিফিকেশন সক্রিয়',
            {
              body:
                language === 'en'
                  ? 'You will now receive real-time chamber token reminders and lab report updates.'
                  : 'আপনি এখন থেকে রিয়েল-টাইম সিরিয়াল ও ল্যাব রিপোর্টের অ্যালার্ট পাবেন।',
              icon: '/icons/icon-192x192.png',
              badge: '/icons/favicon-32x32.png',
            }
          );
        }
      }
    } catch (e) {
      console.warn('Notification permission request error:', e);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 12, 22, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 99990,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 0,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          width: '100%',
          maxWidth: '540px',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '24px 20px',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.25)',
          animation: 'slideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Drag handle */}
        <div style={{ width: '40px', height: '4px', background: '#E2E8F0', borderRadius: '2px', margin: '0 auto -6px auto' }} />

        {/* Status Message */}
        {statusMessage && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#FEF2F2',
              color: '#B91C1C',
              border: '1px solid #FCA5A5',
              borderRadius: '10px',
              fontSize: '12.5px',
              fontWeight: 600,
            }}
          >
            {statusMessage}
          </div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--cyan-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BellRing size={20} color="var(--cyan-600)" />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--navy-900)' }}>
                {language === 'en' ? 'Healthcare Notifications' : 'স্বাস্থ্যসেবা নোটিফিকেশন সেটিংস'}
              </h2>
              <p style={{ fontSize: '11.5px', color: 'var(--slate-500)' }}>
                {language === 'en'
                  ? 'Real-time alerts for appointments, serial tokens & reports'
                  : 'সিরিয়াল টোকেন, ডাক্তারের শিডিউল ও রিপোর্ট আপডেট'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--slate-500)',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Permission Banner */}
        {permission !== 'granted' && (
          <div
            style={{
              backgroundColor: '#EFF6FF',
              border: '1px solid #93C5FD',
              borderRadius: '12px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Bell size={18} color="#2563EB" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '12.5px', color: '#1E3A8A', lineHeight: 1.45 }}>
                {language === 'en'
                  ? 'Enable device notifications to receive real-time warnings when your serial token is 3 patients away.'
                  : 'আপনার সিরিয়াল ৩ জন আগে আসলে ডিভাইস নোটিফিকেশন পেতে অনুমতি দিন।'}
              </div>
            </div>

            <button
              onClick={handleRequestPermission}
              disabled={isRequesting}
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                padding: '9px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '12.5px',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {isRequesting
                ? language === 'en' ? 'Enabling...' : 'অনুমতি নেওয়া হচ্ছে...'
                : language === 'en' ? 'Allow Device Notifications ✓' : 'নোটিফিকেশন সক্রিয় করুন ✓'}
            </button>
          </div>
        )}

        {/* Preferences Toggle List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '46vh' }}>
          {/* Item 1 */}
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#F8FAFC', borderRadius: '10px', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-900)' }}>
                {language === 'en' ? 'Appointment Token Reminders' : 'অ্যাপয়েন্টমেন্ট ও সিরিয়াল অ্যালার্ট'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--slate-500)', marginTop: '2px' }}>
                {language === 'en' ? 'Countdown updates when doctor starts chamber' : 'ডাক্তার চেম্বারে আসলে ও টোকেন এগিয়ে আসলে বার্তা'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={appointmentsAlert}
              onChange={(e) => setAppointmentsAlert(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--cyan-600)' }}
            />
          </label>

          {/* Item 2 */}
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#F8FAFC', borderRadius: '10px', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-900)' }}>
                {language === 'en' ? 'Diagnostic Lab Report Ready' : 'ল্যাব টেস্ট রিপোর্ট তৈরি হলে বার্তা'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--slate-500)', marginTop: '2px' }}>
                {language === 'en' ? 'Instant alert when pathology test is published' : 'প্যাথলজি রিপোর্ট রেডি হলে তাৎক্ষণিক ভল্ট লিঙ্ক'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={reportsAlert}
              onChange={(e) => setReportsAlert(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--cyan-600)' }}
            />
          </label>

          {/* Item 3 */}
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#F8FAFC', borderRadius: '10px', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-900)' }}>
                {language === 'en' ? 'Chamber Schedule & Delay Updates' : 'চেম্বার শিডিউল ও বিলম্ব সংক্রান্ত বার্তা'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--slate-500)', marginTop: '2px' }}>
                {language === 'en' ? 'Notified immediately if doctor has emergency delay' : 'ডাক্তারের জরুরি অপারেশন বা বিলম্ব ঘটলে নোটিফিকেশন'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={chamberDelayAlert}
              onChange={(e) => setChamberDelayAlert(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--cyan-600)' }}
            />
          </label>

          {/* Item 4 */}
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#F8FAFC', borderRadius: '10px', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-900)' }}>
                {language === 'en' ? 'Emergency & Ambulance Dispatch Alerts' : 'জরুরি সেবা ও অ্যাম্বুলেন্স ট্র্যাকিং'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--slate-500)', marginTop: '2px' }}>
                {language === 'en' ? 'Driver arrival time and direct hotline status' : 'ড্রাইভার আগমন ও হেল্পলাইনের সরাসরি যোগাযোগ'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={emergencyAlert}
              onChange={(e) => setEmergencyAlert(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--cyan-600)' }}
            />
          </label>

          {/* Item 5 */}
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#F8FAFC', borderRadius: '10px', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-900)' }}>
                {language === 'en' ? 'Health Packages & Seasonal Offers' : 'স্বাস্থ্য সচেতনতা ও প্যাকেজ অফার'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--slate-500)', marginTop: '2px' }}>
                {language === 'en' ? 'Non-intrusive discounts on health checkups' : 'ডায়াবেটিস বা কার্ডিয়াক চেকআপ প্যাকেজ'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={promotionsAlert}
              onChange={(e) => setPromotionsAlert(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--cyan-600)' }}
            />
          </label>
        </div>

        {/* Save button */}
        <button
          onClick={handleSavePreferences}
          style={{
            backgroundColor: 'var(--cyan-600)',
            color: '#FFFFFF',
            padding: '12px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '13.5px',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          {language === 'en' ? 'Save Preferences' : 'পছন্দ সংরক্ষণ করুন ✓'}
        </button>
      </div>
    </div>
  );
}
