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
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-container animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '24px 22px',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Drag handle */}
        <div style={{ width: '40px', height: '4px', background: 'rgba(203, 213, 225, 0.8)', borderRadius: '2px', margin: '0 auto -4px auto' }} />

        {/* Status Message */}
        {statusMessage && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(254, 242, 242, 0.85)',
              color: '#B91C1C',
              border: '1px solid rgba(252, 165, 165, 0.8)',
              borderRadius: '12px',
              fontSize: '12.5px',
              fontWeight: 600,
            }}
          >
            {statusMessage}
          </div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(15, 118, 110, 0.1)',
                border: '1px solid rgba(15, 118, 110, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)',
              }}
            >
              <BellRing size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                {language === 'en' ? 'Healthcare Notifications' : 'স্বাস্থ্যসেবা নোটিফিকেশন সেটিংস'}
              </h2>
              <p style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', margin: 0 }}>
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
              background: 'rgba(241, 245, 249, 0.8)',
              border: '1px solid var(--glass-border)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Permission Banner */}
        {permission !== 'granted' && (
          <div
            className="glass-inset"
            style={{
              borderRadius: '14px',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              backgroundColor: 'rgba(239, 246, 255, 0.7)',
              border: '1px solid rgba(191, 219, 254, 0.8)',
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
              className="btn-primary"
              style={{
                padding: '9px 16px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '12.5px',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '46vh' }}>
          {/* Item 1 */}
          <label className="glass-inset" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {language === 'en' ? 'Appointment Token Reminders' : 'অ্যাপয়েন্টমেন্ট ও সিরিয়াল অ্যালার্ট'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                {language === 'en' ? 'Countdown updates when doctor starts chamber' : 'ডাক্তার চেম্বারে আসলে ও টোকেন এগিয়ে আসলে বার্তা'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={appointmentsAlert}
              onChange={(e) => setAppointmentsAlert(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
            />
          </label>

          {/* Item 2 */}
          <label className="glass-inset" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {language === 'en' ? 'Diagnostic Lab Report Ready' : 'ল্যাব টেস্ট রিপোর্ট তৈরি হলে বার্তা'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                {language === 'en' ? 'Instant alert when pathology test is published' : 'প্যাথলজি রিপোর্ট রেডি হলে তাৎক্ষণিক ভল্ট লিঙ্ক'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={reportsAlert}
              onChange={(e) => setReportsAlert(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
            />
          </label>

          {/* Item 3 */}
          <label className="glass-inset" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {language === 'en' ? 'Chamber Schedule & Delay Updates' : 'চেম্বার শিডিউল ও বিলম্ব সংক্রান্ত বার্তা'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                {language === 'en' ? 'Notified immediately if doctor has emergency delay' : 'ডাক্তারের জরুরি অপারেশন বা বিলম্ব ঘটলে নোটিফিকেশন'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={chamberDelayAlert}
              onChange={(e) => setChamberDelayAlert(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
            />
          </label>

          {/* Item 4 */}
          <label className="glass-inset" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {language === 'en' ? 'Emergency & Ambulance Dispatch Alerts' : 'জরুরি সেবা ও অ্যাম্বুলেন্স ট্র্যাকিং'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                {language === 'en' ? 'Driver arrival time and direct hotline status' : 'ড্রাইভার আগমন ও হেল্পলাইনের সরাসরি যোগাযোগ'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={emergencyAlert}
              onChange={(e) => setEmergencyAlert(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
            />
          </label>

          {/* Item 5 */}
          <label className="glass-inset" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {language === 'en' ? 'Health Packages & Seasonal Offers' : 'স্বাস্থ্য সচেতনতা ও প্যাকেজ অফার'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                {language === 'en' ? 'Non-intrusive discounts on health checkups' : 'ডায়াবেটিস বা কার্ডিয়াক চেকআপ প্যাকেজ'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={promotionsAlert}
              onChange={(e) => setPromotionsAlert(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
            />
          </label>
        </div>

        {/* Save button */}
        <button
          onClick={handleSavePreferences}
          className="btn-primary"
          style={{
            padding: '12px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '13.5px',
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
