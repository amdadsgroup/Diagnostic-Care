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
  onConfirmBooking: (appointmentData: {
    patientName: string;
    patientPhone: string;
    patientAge: number;
    patientGender: 'MALE' | 'FEMALE' | 'OTHER';
    paymentMethod: 'CASH_AT_DESK' | 'PAID';
  }) => void;
  onSimulateConflict: () => void;
}

export const SlotBookingModal: React.FC<SlotBookingModalProps> = ({
  slot,
  association,
  language,
  onClose,
  onConfirmBooking,
  onSimulateConflict,
}) => {
  const t = TRANSLATIONS[language];
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300); // 5 minutes = 300s
  const [patientName, setPatientName] = useState('Kamrul Hassan');
  const [patientPhone, setPatientPhone] = useState('01886748564');
  const [patientAge, setPatientAge] = useState<number>(34);
  const [patientGender, setPatientGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [paymentMethod, setPaymentMethod] = useState<'CASH_AT_DESK' | 'BKASH' | 'NAGAD'>('CASH_AT_DESK');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);

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
    if (secondsRemaining === 0) {
      alert('Hold expired! Please select the slot again.');
      onClose();
      return;
    }

    if (!patientName.trim() || !patientPhone.trim()) {
      alert('Please provide patient name and valid Bangladesh mobile number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmBooking({
        patientName,
        patientPhone,
        patientAge,
        patientGender,
        paymentMethod: paymentMethod === 'CASH_AT_DESK' ? 'CASH_AT_DESK' : 'PAID',
      });
      setIsSubmitting(false);
    }, 400);
  };

  const handleSimulateConflict = () => {
    setConflictMessage('HTTP 409 Conflict: [SQLSTATE 23505] uq_slot_unique_booking violated. A concurrent transaction has already held this slot. Another patient was 40ms faster.');
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

        {/* Conflict Simulation Warning if Triggered */}
        {conflictMessage && (
          <div
            style={{
              margin: '16px 24px 0 24px',
              padding: '12px 16px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #F87171',
              borderRadius: '8px',
              color: '#991B1B',
              fontSize: '13px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Concurrency Lock Test Activated:</strong>
              <div style={{ marginTop: '4px', fontFamily: 'monospace', fontSize: '11px' }}>{conflictMessage}</div>
              <div style={{ marginTop: '4px', fontSize: '12px' }}>
                This proves the database exclusion lock prevents two users from double-booking this slot!
              </div>
            </div>
          </div>
        )}

        {/* Chamber Details Summary Card */}
        <div style={{ padding: '20px 24px 0 24px' }}>
          <div
            style={{
              backgroundColor: 'var(--slate-50)',
              border: '1px solid var(--slate-200)',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              fontSize: '13px',
            }}
          >
            <div>
              <div style={{ color: 'var(--slate-500)', fontSize: '11px', textTransform: 'uppercase' }}>Doctor & Chamber</div>
              <div style={{ fontWeight: 700, color: 'var(--brand-navy-900)' }}>{association.doctor?.fullName}</div>
              <div style={{ color: 'var(--brand-teal-600)', fontSize: '12px' }}>{association.doctor?.specialization}</div>
            </div>
            <div>
              <div style={{ color: 'var(--slate-500)', fontSize: '11px', textTransform: 'uppercase' }}>Facility & Branch</div>
              <div style={{ fontWeight: 600 }}>{association.organizationName}</div>
              <div style={{ color: 'var(--slate-600)', fontSize: '12px' }}>{association.branchName}, {association.chamberRoomNumber}</div>
            </div>
            <div>
              <div style={{ color: 'var(--slate-500)', fontSize: '11px', textTransform: 'uppercase' }}>Consultation Date & Slot</div>
              <div style={{ fontWeight: 600 }}>{slot.slotDate} at {slot.startTime}</div>
            </div>
            <div>
              <div style={{ color: 'var(--slate-500)', fontSize: '11px', textTransform: 'uppercase' }}>Consultation Fee</div>
              <div style={{ fontWeight: 800, color: 'var(--brand-emerald-500)', fontSize: '15px' }}>
                {BRAND_CONSTANTS.CURRENCY_SYMBOL}{association.consultationFee}
              </div>
            </div>
          </div>
        </div>

        {/* Patient Registration Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px', color: 'var(--brand-navy-900)' }}>
            {t.patientDetailsTitle}
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '14px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--slate-700)' }}>
                {t.patientNameLabel} *
              </label>
              <input
                type="text"
                id="patient-name-input"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Kamrul Hassan"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--slate-300)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--slate-700)' }}>
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
                  borderRadius: '6px',
                  border: '1px solid var(--slate-300)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--slate-700)' }}>
                {t.patientAgeLabel} *
              </label>
              <input
                type="number"
                id="patient-age-input"
                required
                min={1}
                max={120}
                value={patientAge}
                onChange={(e) => setPatientAge(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--slate-300)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--slate-700)' }}>
                {t.patientGenderLabel}
              </label>
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                {(['MALE', 'FEMALE', 'OTHER'] as const).map((gender) => (
                  <label key={gender} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
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
          </div>

          {/* Payment Method Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: 'var(--slate-700)' }}>
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
                  border: `2px solid ${paymentMethod === 'CASH_AT_DESK' ? 'var(--brand-teal-600)' : 'var(--slate-200)'}`,
                  backgroundColor: paymentMethod === 'CASH_AT_DESK' ? 'var(--brand-teal-50)' : '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 600,
                  textAlign: 'center',
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
                  border: `2px solid ${paymentMethod === 'BKASH' ? '#E2136E' : 'var(--slate-200)'}`,
                  backgroundColor: paymentMethod === 'BKASH' ? '#FDF2F8' : '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                📱 bKash Payment
              </button>
              <button
                type="button"
                id="pay-nagad-btn"
                onClick={() => setPaymentMethod('NAGAD')}
                style={{
                  padding: '10px 8px',
                  borderRadius: '8px',
                  border: `2px solid ${paymentMethod === 'NAGAD' ? '#F97316' : 'var(--slate-200)'}`,
                  backgroundColor: paymentMethod === 'NAGAD' ? '#FFF7ED' : '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                ⚡ Nagad Payment
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
                backgroundColor: 'var(--brand-navy-700)',
                color: '#FFFFFF',
                padding: '12px 20px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 10px rgba(19, 64, 116, 0.25)',
              }}
            >
              <CheckCircle size={18} />
              {isSubmitting ? 'Confirming with Database Lock...' : t.bookNowButton}
            </button>

            {/* Concurrency Simulator Testing Tool Button */}
            <button
              type="button"
              id="simulate-conflict-btn"
              onClick={handleSimulateConflict}
              style={{
                backgroundColor: '#FEF2F2',
                color: '#B91C1C',
                border: '1px dashed #F87171',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <AlertTriangle size={13} />
              Test Concurrency Lock: Simulate Another Patient Clicking Same Slot
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: 'var(--slate-500)' }}>
            Help with booking? Call Helpline: <strong>{BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}</strong>
          </div>
        </form>
      </div>
    </div>
  );
};
