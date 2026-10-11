'use client';

import React, { useState, useEffect } from 'react';
import { ScheduleSlot, DoctorAssociation, Appointment } from '@/types';
import { BRAND_CONSTANTS, SupportedLanguage } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import { Clock, Shield, AlertTriangle, CheckCircle, X, Phone, User, Calendar, CreditCard } from 'lucide-react';

interface SlotBookingModalProps {
  slot: ScheduleSlot;
  association: DoctorAssociation;
  language: SupportedLanguage;
  onClose: () => void;
  currentUser?: any;
  onConfirmBooking: (appointmentData: {
    patientName: string;
    patientPhone: string;
    patientAge: number;
    patientGender: 'MALE' | 'FEMALE' | 'OTHER';
    paymentMethod: 'CASH_AT_DESK' | 'PAID';
  }) => void;
}

export const SlotBookingModal: React.FC<SlotBookingModalProps> = ({
  slot,
  association,
  language,
  onClose,
  currentUser,
  onConfirmBooking,
}) => {
  const t = TRANSLATIONS[language];
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300); // 5 minutes = 300s
  const [patientName, setPatientName] = useState(currentUser?.fullName || '');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '');
  const [patientAge, setPatientAge] = useState<string>('');
  const [patientGender, setPatientGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [patientProblem, setPatientProblem] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH_AT_DESK' | 'BKASH' | 'NAGAD'>('CASH_AT_DESK');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick fill relationship helper (no fake names)
  const handleQuickFill = (relation: 'SELF' | 'MOTHER' | 'FATHER' | 'CHILD') => {
    if (relation === 'SELF') {
      if (currentUser?.fullName) setPatientName(currentUser.fullName);
      if (currentUser?.phone) setPatientPhone(currentUser.phone);
      setPatientGender('MALE');
    } else if (relation === 'MOTHER') {
      setPatientGender('FEMALE');
      if (currentUser?.phone && !patientPhone) setPatientPhone(currentUser.phone);
    } else if (relation === 'FATHER') {
      setPatientGender('MALE');
      if (currentUser?.phone && !patientPhone) setPatientPhone(currentUser.phone);
    } else if (relation === 'CHILD') {
      if (currentUser?.phone && !patientPhone) setPatientPhone(currentUser.phone);
    }
    setErrorMessage(null);
  };

  // 5-minute countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const secs = (totalSec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (secondsRemaining === 0) {
      setErrorMessage(language === 'en' ? 'Slot hold time expired. Please select the chamber slot again.' : 'স্লট হোল্ড করার সময় শেষ হয়েছে। পুনরায় স্লট নির্বাচন করুন।');
      return;
    }

    if (
      currentUser &&
      (currentUser.primaryRole === 'SUPER_ADMIN' ||
        currentUser.roles?.includes('SUPER_ADMIN') ||
        currentUser.email?.toLowerCase() === 'contact.amdadur@gmail.com')
    ) {
      setErrorMessage(
        language === 'en'
          ? 'Administrators cannot book appointments as customers. Please sign out and use a patient account.'
          : 'অ্যাডমিন অ্যাকাউন্ট দ্বারা কাস্টমার সিরিয়াল বুকিং নিষিদ্ধ। সাধারণ রোগী অ্যাকাউন্ট ব্যবহার করুন।'
      );
      return;
    }

    if (!patientName.trim()) {
      setErrorMessage(language === 'en' ? 'Please enter patient full name.' : 'রোগীর নাম প্রদান করুন।');
      return;
    }

    const cleanPhone = patientPhone.replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 11) {
      setErrorMessage(language === 'en' ? 'Please provide a valid 11-digit mobile number.' : 'একটি সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।');
      return;
    }

    const ageNum = parseInt(patientAge, 10);
    if (!ageNum || ageNum < 1 || ageNum > 120) {
      setErrorMessage(language === 'en' ? 'Please provide a valid age.' : 'রোগীর সঠিক বয়স লিখুন।');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmBooking({
        patientName: patientName.trim(),
        patientPhone: cleanPhone,
        patientAge: ageNum,
        patientGender,
        paymentMethod: paymentMethod === 'CASH_AT_DESK' ? 'CASH_AT_DESK' : 'PAID',
      });
      setIsSubmitting(false);
    }, 350);
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-container animate-slide-down"
        style={{
          maxWidth: '560px',
          width: '100%',
          maxHeight: 'min(92dvh, 780px)',
          overflowY: 'auto',
          margin: '0 auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0060FA 0%, #004ED1 100%)',
            color: '#FFFFFF',
            padding: '18px 22px',
            borderTopLeftRadius: '22px',
            borderTopRightRadius: '22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 20,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          }}
        >
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.01em' }}>
              {t.slotHoldBanner.split('!')[0]}!
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.85)', marginTop: '2px' }}>
              Chamber Slot: {slot.startTime} • {association.doctor?.fullName}
            </div>
          </div>
          <button
            onClick={onClose}
            id="modal-close-btn"
            aria-label={t.commonClose || 'Close'}
            title={t.commonClose || 'Close'}
            style={{
              color: '#FFFFFF',
              cursor: 'pointer',
              width: '36px',
              height: '36px',
              background: 'rgba(255, 255, 255, 0.22)',
              border: '1.5px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* 5-Minute Temporary Hold Countdown Banner */}
        <div
          style={{
            backgroundColor: secondsRemaining > 60 ? 'rgba(254, 243, 199, 0.85)' : 'rgba(254, 226, 226, 0.85)',
            backdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${secondsRemaining > 60 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            padding: '12px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color={secondsRemaining > 60 ? '#B45309' : '#B91C1C'} className="animate-pulse-hold" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: secondsRemaining > 60 ? '#B45309' : '#B91C1C' }}>
              {t.slotCountdown}:
            </span>
          </div>
          <div
            style={{
              fontSize: '18px',
              fontFamily: 'monospace',
              fontWeight: 800,
              color: secondsRemaining > 60 ? '#B45309' : '#B91C1C',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '2px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            }}
          >
            {formatCountdown(secondsRemaining)}
          </div>
        </div>

        {/* Active Hold Protection Banner */}
        <div style={{ padding: '16px 24px 0 24px' }}>
          <div
            style={{
              padding: '10px 14px',
              background: 'rgba(235, 243, 255, 0.55)',
              border: '1px solid rgba(0, 96, 250, 0.25)',
              borderRadius: '12px',
              color: '#004ED1',
              fontSize: '12.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Shield size={16} color="#0060FA" style={{ flexShrink: 0 }} />
            <div>
              <strong>{language === 'en' ? 'Exclusive Slot Hold Active' : 'এক্সক্লুসিভ চেম্বার স্লট হোল্ড সক্রিয়'}</strong>: {language === 'en' ? 'This slot is reserved for you for 5 minutes. No other patient can book it during this countdown.' : 'পরবর্তী ৫ মিনিটের জন্য এই স্লটটি আপনার জন্য সংরক্ষিত।'}
            </div>
          </div>
        </div>

        {/* Error Notice */}
        {errorMessage && (
          <div
            style={{
              margin: '12px 24px 0 24px',
              padding: '10px 14px',
              background: 'rgba(254, 242, 242, 0.85)',
              border: '1px solid rgba(185, 28, 28, 0.3)',
              borderRadius: '12px',
              color: '#B91C1C',
              fontSize: '12.5px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <AlertTriangle size={16} color="#B91C1C" style={{ flexShrink: 0 }} />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Chamber Details Summary Card */}
        <div style={{ padding: '16px 24px 0 24px' }}>
          <div
            className="glass-inset"
            style={{
              padding: '14px 18px',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              fontSize: '13px',
            }}
          >
            <div>
              <div style={{ color: '#627680', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Doctor & Chamber</div>
              <div style={{ fontWeight: 800, color: '#090D14' }}>{association.doctor?.fullName}</div>
              <div style={{ color: '#0060FA', fontSize: '12px', fontWeight: 600 }}>{association.doctor?.specialization}</div>
            </div>
            <div>
              <div style={{ color: '#627680', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Facility & Branch</div>
              <div style={{ fontWeight: 700, color: '#090D14' }}>{association.organizationName}</div>
              <div style={{ color: '#627680', fontSize: '12px' }}>{association.branchName}, {association.chamberRoomNumber}</div>
            </div>
            <div>
              <div style={{ color: '#627680', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Consultation Date & Slot</div>
              <div style={{ fontWeight: 700, color: '#090D14' }}>{slot.slotDate} at {slot.startTime}</div>
            </div>
            <div>
              <div style={{ color: '#627680', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Consultation Fee</div>
              <div style={{ fontWeight: 800, color: '#15803D', fontSize: '16px' }}>
                {BRAND_CONSTANTS.CURRENCY_SYMBOL}{association.consultationFee}
              </div>
            </div>
          </div>
        </div>

        {/* Patient Registration Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#090D14', margin: 0 }}>
              {t.patientDetailsTitle}
            </h4>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleQuickFill('SELF')}
                style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(0, 96, 250, 0.25)', background: 'rgba(235, 243, 255, 0.4)', color: '#0060FA', cursor: 'pointer', fontWeight: 600 }}
              >
                + Self
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('MOTHER')}
                style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(0, 96, 250, 0.25)', background: 'rgba(235, 243, 255, 0.4)', color: '#0060FA', cursor: 'pointer', fontWeight: 600 }}
              >
                + Mother
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('CHILD')}
                style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(0, 96, 250, 0.25)', background: 'rgba(235, 243, 255, 0.4)', color: '#0060FA', cursor: 'pointer', fontWeight: 600 }}
              >
                + Child
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '14px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#090D14' }}>
                {t.patientNameLabel} *
              </label>
              <input
                type="text"
                id="patient-name-input"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder={language === 'en' ? 'Full Name of the Patient' : 'রোগীর পুরো নাম'}
                className="glass-input"
                style={{ width: '100%', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#090D14' }}>
                {t.patientPhoneLabel} *
              </label>
              <input
                type="tel"
                id="patient-phone-input"
                required
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="018XXXXXXXX"
                className="glass-input"
                style={{ width: '100%', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#090D14' }}>
                {t.patientAgeLabel} *
              </label>
              <input
                type="number"
                id="patient-age-input"
                required
                min={1}
                max={120}
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                placeholder="e.g. 34"
                className="glass-input"
                style={{ width: '100%', fontSize: '14px' }}
              />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#090D14' }}>
                {t.patientGenderLabel}
              </label>
              <div style={{ display: 'flex', gap: '20px', fontSize: '13px' }}>
                {(['MALE', 'FEMALE', 'OTHER'] as const).map((gender) => (
                  <label key={gender} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 500, color: '#090D14' }}>
                    <input
                      type="radio"
                      name="gender"
                      checked={patientGender === gender}
                      onChange={() => setPatientGender(gender)}
                      style={{ accentColor: '#0060FA' }}
                    />
                    {gender === 'MALE' ? 'Male (পুরুষ)' : gender === 'FEMALE' ? 'Female (মহিলা)' : 'Other'}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#090D14' }}>
                {language === 'en' ? 'Health Symptoms / Chief Complaint (Optional)' : 'রোগের লক্ষণ / সমস্যা (ঐচ্ছিক)'}
              </label>
              <input
                type="text"
                value={patientProblem}
                onChange={(e) => setPatientProblem(e.target.value)}
                placeholder={language === 'en' ? 'e.g. Chest discomfort, severe headache, routine follow-up' : 'যেমনঃ বুকে অস্বস্তি, তীব্র মাথাব্যথা, ফলো-আপ'}
                className="glass-input"
                style={{ width: '100%', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#090D14' }}>
              {t.paymentMethodLabel}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <button
                type="button"
                id="pay-cash-btn"
                onClick={() => setPaymentMethod('CASH_AT_DESK')}
                style={{
                  padding: '10px 8px',
                  borderRadius: '10px',
                  border: `2px solid ${paymentMethod === 'CASH_AT_DESK' ? '#0060FA' : 'rgba(226, 232, 240, 0.8)'}`,
                  backgroundColor: paymentMethod === 'CASH_AT_DESK' ? 'rgba(235, 243, 255, 0.5)' : 'rgba(255, 255, 255, 0.65)',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: paymentMethod === 'CASH_AT_DESK' ? '#0060FA' : '#090D14',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                💵 Cash at Chamber
              </button>
              <button
                type="button"
                id="pay-bkash-btn"
                onClick={() => setPaymentMethod('BKASH')}
                style={{
                  padding: '10px 8px',
                  borderRadius: '10px',
                  border: `2px solid ${paymentMethod === 'BKASH' ? '#E2136E' : 'rgba(226, 232, 240, 0.8)'}`,
                  backgroundColor: paymentMethod === 'BKASH' ? '#FDF2F8' : 'rgba(255, 255, 255, 0.65)',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: paymentMethod === 'BKASH' ? '#BE185D' : '#090D14',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                📱 bKash Online
              </button>
              <button
                type="button"
                id="pay-nagad-btn"
                onClick={() => setPaymentMethod('NAGAD')}
                style={{
                  padding: '10px 8px',
                  borderRadius: '10px',
                  border: `2px solid ${paymentMethod === 'NAGAD' ? '#F97316' : 'rgba(226, 232, 240, 0.8)'}`,
                  backgroundColor: paymentMethod === 'NAGAD' ? '#FFF7ED' : 'rgba(255, 255, 255, 0.65)',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: paymentMethod === 'NAGAD' ? '#C2410C' : '#090D14',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                ⚡ Nagad Online
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="submit"
              id="confirm-booking-btn"
              disabled={isSubmitting || secondsRemaining === 0}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px 22px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: secondsRemaining === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <CheckCircle size={18} />
              {isSubmitting ? 'Confirming with Database...' : t.bookNowButton}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: '#627680' }}>
            Need booking assistance? Call Helpline: <strong style={{ color: '#0060FA' }}>{BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}</strong>
          </div>
        </form>
      </div>
    </div>
  );
};
