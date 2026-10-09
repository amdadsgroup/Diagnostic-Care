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
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
    >
      <div
        className="animate-slide-down"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--slate-200)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            backgroundColor: 'var(--brand-navy-900)',
            color: '#FFFFFF',
            padding: '18px 24px',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>
              {t.slotHoldBanner.split('!')[0]}!
            </div>
            <div style={{ fontSize: '12px', color: 'var(--slate-300)' }}>
              Chamber Slot: {slot.startTime} • {association.doctor?.fullName}
            </div>
          </div>
          <button
            onClick={onClose}
            id="modal-close-btn"
            style={{ color: '#FFFFFF', opacity: 0.8, cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 5-Minute Temporary Hold Countdown Banner */}
        <div
          style={{
            backgroundColor: secondsRemaining > 60 ? 'var(--brand-amber-50)' : 'var(--brand-rose-50)',
            borderBottom: `1px solid ${secondsRemaining > 60 ? '#FDE68A' : '#FECDD3'}`,
            padding: '12px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color={secondsRemaining > 60 ? '#D97706' : '#E11D48'} className="animate-pulse-hold" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: secondsRemaining > 60 ? '#92400E' : '#9F1239' }}>
              {t.slotCountdown}:
            </span>
          </div>
          <div
            style={{
              fontSize: '18px',
              fontFamily: 'monospace',
              fontWeight: 800,
              color: secondsRemaining > 60 ? '#B45309' : '#BE123C',
              backgroundColor: '#FFFFFF',
              padding: '2px 10px',
              borderRadius: '6px',
              border: '1px solid var(--slate-300)',
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
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '8px',
              color: '#1E40AF',
              fontSize: '12.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Shield size={16} color="#0057FF" style={{ flexShrink: 0 }} />
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
              backgroundColor: '#FEF2F2',
              border: '1px solid #F87171',
              borderRadius: '8px',
              color: '#991B1B',
              fontSize: '12.5px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Chamber Details Summary Card */}
        <div style={{ padding: '16px 24px 0 24px' }}>
          <div
            style={{
              backgroundColor: '#F8F7F4',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '14px 18px',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              fontSize: '13px',
            }}
          >
            <div>
              <div style={{ color: '#6B7280', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Doctor & Chamber</div>
              <div style={{ fontWeight: 800, color: '#0F172A' }}>{association.doctor?.fullName}</div>
              <div style={{ color: '#0057FF', fontSize: '12px', fontWeight: 600 }}>{association.doctor?.specialization}</div>
            </div>
            <div>
              <div style={{ color: '#6B7280', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Facility & Branch</div>
              <div style={{ fontWeight: 700, color: '#0F172A' }}>{association.organizationName}</div>
              <div style={{ color: '#4B5563', fontSize: '12px' }}>{association.branchName}, {association.chamberRoomNumber}</div>
            </div>
            <div>
              <div style={{ color: '#6B7280', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Consultation Date & Slot</div>
              <div style={{ fontWeight: 700, color: '#0F172A' }}>{slot.slotDate} at {slot.startTime}</div>
            </div>
            <div>
              <div style={{ color: '#6B7280', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Consultation Fee</div>
              <div style={{ fontWeight: 800, color: '#059669', fontSize: '16px' }}>
                {BRAND_CONSTANTS.CURRENCY_SYMBOL}{association.consultationFee}
              </div>
            </div>
          </div>
        </div>

        {/* Patient Registration Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {t.patientDetailsTitle}
            </h4>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleQuickFill('SELF')}
                style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', border: '1px solid #CBD5E1', background: '#F1F5F9', cursor: 'pointer' }}
              >
                + Self
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('MOTHER')}
                style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', border: '1px solid #CBD5E1', background: '#F1F5F9', cursor: 'pointer' }}
              >
                + Mother
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('CHILD')}
                style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', border: '1px solid #CBD5E1', background: '#F1F5F9', cursor: 'pointer' }}
              >
                + Child
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '14px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                {t.patientNameLabel} *
              </label>
              <input
                type="text"
                id="patient-name-input"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder={language === 'en' ? 'Full Name of the Patient' : 'রোগীর পুরো নাম'}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                {t.patientPhoneLabel} *
              </label>
              <input
                type="tel"
                id="patient-phone-input"
                required
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="018XXXXXXXX"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
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
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                {t.patientGenderLabel}
              </label>
              <div style={{ display: 'flex', gap: '20px', fontSize: '13px' }}>
                {(['MALE', 'FEMALE', 'OTHER'] as const).map((gender) => (
                  <label key={gender} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="gender"
                      checked={patientGender === gender}
                      onChange={() => setPatientGender(gender)}
                    />
                    {gender === 'MALE' ? 'Male (পুরুষ)' : gender === 'FEMALE' ? 'Female (মহিলা)' : 'Other'}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                {language === 'en' ? 'Health Symptoms / Chief Complaint (Optional)' : 'রোগের লক্ষণ / সমস্যা (ঐচ্ছিক)'}
              </label>
              <input
                type="text"
                value={patientProblem}
                onChange={(e) => setPatientProblem(e.target.value)}
                placeholder={language === 'en' ? 'e.g. Chest discomfort, severe headache, routine follow-up' : 'যেমনঃ বুকে অস্বস্তি, তীব্র মাথাব্যথা, ফলো-আপ'}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
              {t.paymentMethodLabel}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <button
                type="button"
                id="pay-cash-btn"
                onClick={() => setPaymentMethod('CASH_AT_DESK')}
                style={{
                  padding: '10px 8px',
                  borderRadius: '8px',
                  border: `2px solid ${paymentMethod === 'CASH_AT_DESK' ? '#0057FF' : '#E2E8F0'}`,
                  backgroundColor: paymentMethod === 'CASH_AT_DESK' ? '#EFF6FF' : '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: paymentMethod === 'CASH_AT_DESK' ? '#0057FF' : '#334155',
                  textAlign: 'center',
                  cursor: 'pointer',
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
                  borderRadius: '8px',
                  border: `2px solid ${paymentMethod === 'BKASH' ? '#E2136E' : '#E2E8F0'}`,
                  backgroundColor: paymentMethod === 'BKASH' ? '#FDF2F8' : '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: paymentMethod === 'BKASH' ? '#BE185D' : '#334155',
                  textAlign: 'center',
                  cursor: 'pointer',
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
                  borderRadius: '8px',
                  border: `2px solid ${paymentMethod === 'NAGAD' ? '#F97316' : '#E2E8F0'}`,
                  backgroundColor: paymentMethod === 'NAGAD' ? '#FFF7ED' : '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: paymentMethod === 'NAGAD' ? '#C2410C' : '#334155',
                  textAlign: 'center',
                  cursor: 'pointer',
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
              style={{
                backgroundColor: '#0057FF',
                color: '#FFFFFF',
                padding: '13px 20px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                border: 'none',
                cursor: secondsRemaining === 0 ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(0, 87, 255, 0.28)',
              }}
            >
              <CheckCircle size={18} />
              {isSubmitting ? 'Confirming with Database...' : t.bookNowButton}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: '#64748B' }}>
            Need booking assistance? Call Helpline: <strong>{BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}</strong>
          </div>
        </form>
      </div>
    </div>
  );
};
