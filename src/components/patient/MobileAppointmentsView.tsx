'use client';

import React, { useState } from 'react';
import { SupportedLanguage } from '@/config/brand';
import { Appointment } from '@/types';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  ChevronRight,
  ShieldCheck,
  Download,
  Share2,
} from 'lucide-react';

interface MobileAppointmentsViewProps {
  appointments: Appointment[];
  language: SupportedLanguage;
  onCancelAppointment?: (id: string) => void;
  onViewDetails?: (apt: Appointment) => void;
  onNavigateTab?: (tab: any) => void;
}

export default function MobileAppointmentsView({
  appointments,
  language,
  onCancelAppointment,
  onViewDetails,
  onNavigateTab,
}: MobileAppointmentsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [selectedAptDetails, setSelectedAptDetails] = useState<Appointment | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const upcomingList = appointments.filter(
    (a) => a.status === 'CONFIRMED' || a.status === 'HELD' || a.status === 'CHECKED_IN' || a.status === 'IN_PROGRESS'
  );
  const completedList = appointments.filter((a) => a.status === 'COMPLETED');
  const cancelledList = appointments.filter(
    (a) => a.status === 'CANCELLED_BY_PATIENT' || a.status === 'CANCELLED_BY_PROVIDER' || a.status === 'EXPIRED'
  );

  const displayedList =
    activeSubTab === 'upcoming'
      ? upcomingList
      : activeSubTab === 'completed'
      ? completedList
      : cancelledList;

  const handleShare = async (apt: Appointment) => {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: `Appointment with ${apt.doctorName}`,
          text: `Diagnostic Care Appointment: ${apt.doctorName} (${apt.specialization}) at ${apt.organizationName}. Token #${apt.tokenNumber}. Date: ${apt.appointmentDate} at ${apt.startTime}. Code: ${apt.bookingCode}`,
          url: window.location.href,
        });
        return;
      } catch (err) {}
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(
        `Diagnostic Care Appointment:\nDoctor: ${apt.doctorName} (${apt.specialization})\nChamber: ${apt.organizationName}\nToken: #${apt.tokenNumber}\nDate: ${apt.appointmentDate} at ${apt.startTime}\nCode: ${apt.bookingCode}`
      );
      showToast(language === 'en' ? 'Appointment details copied to clipboard!' : 'অ্যাপয়েন্টমেন্টের বিবরণ ক্লিপবোর্ডে কপি করা হয়েছে!');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '30px' }}>
      {toastMessage && (
        <div
          style={{
            backgroundColor: '#ECFDF5',
            color: '#065F46',
            border: '1px solid #10B981',
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: 700,
          }}
        >
          {toastMessage}
        </div>
      )}
      {/* Top Header Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--navy-900) 0%, #142B4E 100%)',
          color: '#FFFFFF',
          borderRadius: '18px',
          padding: '20px',
          boxShadow: '0 8px 24px rgba(10, 22, 40, 0.12)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#67E8F9',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {language === 'en' ? 'Mobile Healthcare Desk' : 'মোবাইল স্বাস্থ্যসেবা ডেস্ক'}
            </span>
            <h1 style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px' }}>
              {language === 'en' ? 'My Appointments & Serials' : 'আমার অ্যাপয়েন্টমেন্ট ও সিরিয়াল'}
            </h1>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}
          >
            📅
          </div>
        </div>
      </div>

      {/* Pill Filter Tabs: Upcoming, Completed, Cancelled */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#E2E8F0',
          padding: '4px',
          borderRadius: '12px',
          gap: '4px',
        }}
      >
        <button
          onClick={() => setActiveSubTab('upcoming')}
          style={{
            flex: 1,
            padding: '10px 8px',
            borderRadius: '10px',
            fontSize: '12.5px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeSubTab === 'upcoming' ? '#FFFFFF' : 'transparent',
            color: activeSubTab === 'upcoming' ? 'var(--navy-900)' : 'var(--slate-600)',
            boxShadow: activeSubTab === 'upcoming' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          {language === 'en' ? `Upcoming (${upcomingList.length})` : `আসন্ন (${upcomingList.length})`}
        </button>

        <button
          onClick={() => setActiveSubTab('completed')}
          style={{
            flex: 1,
            padding: '10px 8px',
            borderRadius: '10px',
            fontSize: '12.5px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeSubTab === 'completed' ? '#FFFFFF' : 'transparent',
            color: activeSubTab === 'completed' ? 'var(--navy-900)' : 'var(--slate-600)',
            boxShadow: activeSubTab === 'completed' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          {language === 'en' ? `Completed (${completedList.length})` : `সম্পন্ন (${completedList.length})`}
        </button>

        <button
          onClick={() => setActiveSubTab('cancelled')}
          style={{
            flex: 1,
            padding: '10px 8px',
            borderRadius: '10px',
            fontSize: '12.5px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeSubTab === 'cancelled' ? '#FFFFFF' : 'transparent',
            color: activeSubTab === 'cancelled' ? 'var(--navy-900)' : 'var(--slate-600)',
            boxShadow: activeSubTab === 'cancelled' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          {language === 'en' ? `Cancelled (${cancelledList.length})` : `বাতিল (${cancelledList.length})`}
        </button>
      </div>

      {/* Appointment Cards List */}
      {displayedList.length === 0 ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '40px 20px',
            textAlign: 'center',
            border: '1px solid #E2E8F0',
          }}
        >
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🩺</div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--navy-900)' }}>
            {activeSubTab === 'upcoming'
              ? language === 'en' ? 'No Upcoming Appointments' : 'কোনো আসন্ন অ্যাপয়েন্টমেন্ট নেই'
              : activeSubTab === 'completed'
              ? language === 'en' ? 'No Completed Consultations' : 'কোনো সম্পন্ন পরামর্শ নেই'
              : language === 'en' ? 'No Cancelled Bookings' : 'কোনো বাতিল বুকিং নেই'}
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--slate-500)', marginTop: '4px', maxWidth: '320px', margin: '4px auto 16px auto' }}>
            {language === 'en'
              ? 'Find verified specialist doctors and book chamber serial slots in seconds.'
              : 'বিশেষজ্ঞ ডাক্তার খুঁজুন এবং কয়েক সেকেন্ডেই সিরিয়াল টোকেন বুক করুন।'}
          </p>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                if (onNavigateTab) {
                  onNavigateTab('search');
                } else if (typeof window !== 'undefined') {
                  window.location.href = '/doctors';
                }
              }}
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(0, 96, 250, 0.25)',
              }}
            >
              <span>{language === 'en' ? 'Find Doctors & Book' : 'ডাক্তার খুঁজুন ও বুক করুন'}</span>
            </button>
            <a
              href="tel:01886748564"
              style={{
                backgroundColor: '#F1F5F9',
                color: 'var(--navy-900)',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Phone size={14} color="var(--brand-primary)" />
              <span>01886748564</span>
            </a>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {displayedList.map((apt) => (
            <div
              key={apt.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '18px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 14px rgba(10, 22, 40, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {/* Card Header: Token & Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      background: 'linear-gradient(135deg, var(--navy-900) 0%, var(--cyan-600) 100%)',
                      color: '#FFFFFF',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontWeight: 800,
                      fontSize: '13px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>{language === 'en' ? 'TOKEN #' : 'টোকেন #'}</span>
                    <span>{apt.tokenNumber.toString().padStart(2, '0')}</span>
                  </div>

                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--slate-500)',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                    }}
                  >
                    {apt.bookingCode}
                  </span>
                </div>

                <span
                  style={{
                    backgroundColor:
                      apt.status === 'CONFIRMED'
                        ? 'var(--emerald-50)'
                        : apt.status === 'COMPLETED'
                        ? 'var(--blue-50)'
                        : '#FFF1F2',
                    color:
                      apt.status === 'CONFIRMED'
                        ? '#065F46'
                        : apt.status === 'COMPLETED'
                        ? '#1D4ED8'
                        : '#BE123C',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {apt.status === 'CONFIRMED'
                    ? language === 'en' ? '✓ Confirmed' : '✓ নিশ্চিত'
                    : apt.status === 'COMPLETED'
                    ? language === 'en' ? 'Completed' : 'সম্পন্ন'
                    : language === 'en' ? 'Cancelled' : 'বাতিল'}
                </span>
              </div>

              {/* Provider Info */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy-900)' }}>
                  {apt.doctorName}
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--cyan-600)', fontWeight: 600, marginTop: '1px' }}>
                  {apt.specialization}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12.5px',
                    color: 'var(--slate-600)',
                    marginTop: '6px',
                  }}
                >
                  <MapPin size={13} color="var(--slate-400)" />
                  <span>{apt.organizationName} — {apt.branchName}</span>
                </div>
              </div>

              {/* Meta Grid: Date, Time, Patient, Fee */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                  backgroundColor: '#F8FAFC',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--slate-700)' }}>
                  <Calendar size={14} color="var(--cyan-600)" />
                  <span>{apt.appointmentDate}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--slate-700)' }}>
                  <Clock size={14} color="var(--cyan-600)" />
                  <span>{apt.startTime} (Evening)</span>
                </div>

                <div style={{ color: 'var(--slate-600)' }}>
                  {language === 'en' ? 'Patient:' : 'রোগী:'} <strong>{apt.patientName}</strong>
                </div>

                <div style={{ color: 'var(--slate-600)', textAlign: 'right' }}>
                  {language === 'en' ? 'Fee:' : 'ফি:'} <strong style={{ color: 'var(--navy-900)' }}>৳{apt.consultationFee}</strong> ({apt.paymentStatus})
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                  borderTop: '1px solid #F1F5F9',
                  paddingTop: '12px',
                }}
              >
                {/* Call Chamber */}
                <a
                  href="tel:01886748564"
                  style={{
                    flex: 1,
                    minWidth: '100px',
                    backgroundColor: '#F1F5F9',
                    color: 'var(--slate-700)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    minHeight: '44px',
                  }}
                >
                  <Phone size={13} color="var(--cyan-600)" />
                  <span>{language === 'en' ? 'Call Chamber' : 'চেম্বারে কল'}</span>
                </a>

                {/* Directions */}
                <a
                  href="https://maps.google.com/?q=Popular+Diagnostic+Center+Moulvibazar"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    minWidth: '100px',
                    backgroundColor: '#F1F5F9',
                    color: 'var(--slate-700)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    minHeight: '44px',
                  }}
                >
                  <Navigation size={13} color="var(--cyan-600)" />
                  <span>{language === 'en' ? 'Directions' : 'ম্যাপে দেখুন'}</span>
                </a>

                {/* Share Slip */}
                <button
                  onClick={() => handleShare(apt)}
                  style={{
                    backgroundColor: '#F1F5F9',
                    color: 'var(--slate-700)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    minHeight: '44px',
                  }}
                  title="Share Token Slip"
                >
                  <Share2 size={14} />
                </button>

                {/* Cancel Booking if Upcoming */}
                {activeSubTab === 'upcoming' && onCancelAppointment && (
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          language === 'en'
                            ? `Are you sure you want to cancel booking ${apt.bookingCode}?`
                            : `আপনি কি বুকিং ${apt.bookingCode} বাতিল করতে চান?`
                        )
                      ) {
                        onCancelAppointment(apt.id);
                      }
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--rose-600)',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      border: '1px solid #FECDD3',
                      cursor: 'pointer',
                      minHeight: '44px',
                    }}
                  >
                    {language === 'en' ? 'Cancel' : 'বাতিল'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
