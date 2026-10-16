'use client';

import React from 'react';
import { QueueState, Appointment, UserRole } from '@/types';
import { SupportedLanguage, BRAND_CONSTANTS } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import { useLanguage } from '@/context/LanguageContext';
import { Users, Clock, ArrowRight, CheckCircle2, Phone, AlertCircle } from 'lucide-react';

interface LiveQueueCardProps {
  queue: QueueState;
  doctorName: string;
  specialization: string;
  chamberName: string;
  appointments: Appointment[];
  language?: SupportedLanguage;
  currentRole: UserRole;
  onCallNext: () => void;
  onUpdateStatus: (appointmentId: string, status: Appointment['status']) => void;
}

export const LiveQueueCard: React.FC<LiveQueueCardProps> = ({
  queue,
  doctorName,
  specialization,
  chamberName,
  appointments,
  language: propLanguage,
  currentRole,
  onCallNext,
  onUpdateStatus,
}) => {
  const langContext = useLanguage();
  const language = propLanguage || langContext.language || 'en';
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const canManage = currentRole === 'DOCTOR' || currentRole === 'DOCTOR_ASSISTANT' || currentRole === 'SUPER_ADMIN';

  // Find currently serving appointment
  const currentApp = appointments.find((a) => a.tokenNumber === queue.currentTokenServing);

  return (
    <div
      className="clay-card"
      style={{
        borderRadius: '24px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #10294F 0%, #1A3258 100%)',
          color: '#FFFFFF',
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          boxShadow: 'inset 0 -2px 6px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div>
          <div style={{ fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block', boxShadow: '0 0 8px #10B981' }} />
            {t.queueTitle}
          </div>
          <div style={{ fontSize: '12.5px', color: '#93C5FD', marginTop: '2px', fontWeight: 500 }}>
            {doctorName} ({specialization}) • {chamberName}
          </div>
        </div>

        {canManage && (
          <button
            onClick={onCallNext}
            id="call-next-patient-btn"
            className="btn-emerald"
            style={{
              padding: '9px 20px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{t.actionCallNext}</span>
            <ArrowRight size={15} />
          </button>
        )}
      </div>

      {/* Main Queue Stats Display */}
      <div
        style={{
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '18px',
          borderBottom: '1.5px solid rgba(226, 234, 244, 0.8)',
          backgroundColor: 'var(--clay-surface-subtle)',
        }}
      >
        {/* Now Serving Card */}
        <div
          className="clay-card-sm"
          style={{
            backgroundColor: '#FFFFFF',
            padding: '18px',
            borderRadius: '20px',
            border: '2px solid rgba(17, 184, 165, 0.35)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-teal-600)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t.nowServing}
          </div>
          <div style={{ fontSize: '38px', fontWeight: 900, color: 'var(--brand-navy-900)', margin: '4px 0', textShadow: '0 2px 4px rgba(17, 184, 165, 0.12)' }}>
            Token {queue.currentTokenServing.toString().padStart(2, '0')}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--slate-700)' }}>
            {currentApp ? currentApp.patientName : 'Chamber in Session'}
          </div>
        </div>

        {/* Total Tokens Issued */}
        <div
          className="clay-card-sm"
          style={{
            backgroundColor: '#FFFFFF',
            padding: '18px',
            borderRadius: '20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Total Booked Tokens
          </div>
          <div style={{ fontSize: '38px', fontWeight: 900, color: 'var(--slate-800)', margin: '4px 0' }}>
            {queue.totalTokensIssued}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--slate-500)', fontWeight: 600 }}>
            Max Daily Capacity: 16 Patients
          </div>
        </div>

        {/* Average Consultation / Wait Time */}
        <div
          className="clay-card-sm"
          style={{
            backgroundColor: '#FFFFFF',
            padding: '18px',
            borderRadius: '20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t.estimatedWaitLabel}
          </div>
          <div style={{ fontSize: '38px', fontWeight: 900, color: 'var(--brand-navy-700)', margin: '4px 0' }}>
            ~15 min
          </div>
          <div style={{ fontSize: '12px', color: 'var(--slate-500)', fontWeight: 600 }}>
            Per Patient Consultation
          </div>
        </div>
      </div>

      {/* Waiting Queue List */}
      <div style={{ padding: '24px' }}>
        <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--brand-text-dark)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={17} color="#1769F5" />
          {t.upcomingTokens}
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {appointments.map((app) => {
            const isServing = app.tokenNumber === queue.currentTokenServing;
            return (
              <div
                key={app.id}
                className={isServing ? 'clay-card-sm' : 'clay-pill'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  borderRadius: '18px',
                  backgroundColor: isServing ? '#E6FBF8' : '#FFFFFF',
                  border: `1.5px solid ${isServing ? 'rgba(17, 184, 165, 0.4)' : 'rgba(255, 255, 255, 0.95)'}`,
                  fontSize: '13px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span
                    className="clay-sphere"
                    style={{
                      width: '42px',
                      height: '42px',
                      backgroundColor: isServing ? 'var(--brand-teal-600)' : '#EAF2FF',
                      color: isServing ? '#FFFFFF' : 'var(--brand-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '14px',
                      flexShrink: 0,
                    }}
                  >
                    #{app.tokenNumber.toString().padStart(2, '0')}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--brand-navy-900)' }}>
                      {app.patientName} ({app.patientAge} yrs, {app.patientGender})
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--slate-500)' }}>
                      Slot: {app.startTime} • Code: {app.bookingCode} • Phone: {app.patientPhone}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor:
                        app.status === 'COMPLETED'
                          ? 'var(--brand-emerald-50)'
                          : app.status === 'IN_PROGRESS'
                          ? 'var(--brand-teal-50)'
                          : 'var(--slate-100)',
                      color:
                        app.status === 'COMPLETED'
                          ? '#065F46'
                          : app.status === 'IN_PROGRESS'
                          ? '#0E7490'
                          : '#475569',
                    }}
                  >
                    {app.status}
                  </span>

                  {canManage && app.status !== 'COMPLETED' && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => onUpdateStatus(app.id, 'CHECKED_IN')}
                        title="Mark Arrived / Checked-in"
                        style={{
                          fontSize: '11px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: 'var(--slate-100)',
                          border: '1px solid var(--slate-300)',
                          fontWeight: 600,
                        }}
                      >
                        Check-in
                      </button>
                      <button
                        onClick={() => onUpdateStatus(app.id, 'COMPLETED')}
                        title="Mark Consultation Completed"
                        style={{
                          fontSize: '11px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: 'var(--brand-emerald-500)',
                          color: '#FFFFFF',
                          fontWeight: 600,
                        }}
                      >
                        Complete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
