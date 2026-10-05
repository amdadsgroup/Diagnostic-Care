'use client';

import React from 'react';
import { QueueState, Appointment, UserRole } from '@/types';
import { SupportedLanguage, BRAND_CONSTANTS } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import { Users, Clock, ArrowRight, CheckCircle2, Phone, AlertCircle } from 'lucide-react';

interface LiveQueueCardProps {
  queue: QueueState;
  doctorName: string;
  specialization: string;
  chamberName: string;
  appointments: Appointment[];
  language: SupportedLanguage;
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
  language,
  currentRole,
  onCallNext,
  onUpdateStatus,
}) => {
  const t = TRANSLATIONS[language];
  const canManage = currentRole === 'DOCTOR' || currentRole === 'DOCTOR_ASSISTANT' || currentRole === 'SUPER_ADMIN';

  // Find currently serving appointment
  const currentApp = appointments.find((a) => a.tokenNumber === queue.currentTokenServing);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid var(--slate-200)',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: 'var(--brand-navy-900)',
          color: '#FFFFFF',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
            {t.queueTitle}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--slate-300)', marginTop: '2px' }}>
            {doctorName} ({specialization}) • {chamberName}
          </div>
        </div>

        {canManage && (
          <button
            onClick={onCallNext}
            id="call-next-patient-btn"
            style={{
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.4)',
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
          borderBottom: '1px solid var(--slate-200)',
          backgroundColor: 'var(--slate-50)',
        }}
      >
        {/* Now Serving Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '16px',
            borderRadius: '12px',
            border: '2px solid var(--brand-teal-600)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand-teal-600)', textTransform: 'uppercase' }}>
            {t.nowServing}
          </div>
          <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--brand-navy-900)', margin: '4px 0' }}>
            Token {queue.currentTokenServing.toString().padStart(2, '0')}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--slate-700)' }}>
            {currentApp ? currentApp.patientName : 'Chamber in Session'}
          </div>
        </div>

        {/* Total Tokens Issued */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--slate-200)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            Total Booked Tokens
          </div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--slate-800)', margin: '4px 0' }}>
            {queue.totalTokensIssued}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--slate-500)' }}>
            Max Daily Capacity: 16 Patients
          </div>
        </div>

        {/* Average Consultation / Wait Time */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--slate-200)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            {t.estimatedWaitLabel}
          </div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--brand-navy-700)', margin: '4px 0' }}>
            ~15 min
          </div>
          <div style={{ fontSize: '12px', color: 'var(--slate-500)' }}>
            Per Patient Consultation
          </div>
        </div>
      </div>

      {/* Waiting Queue List */}
      <div style={{ padding: '20px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-navy-900)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={16} />
          {t.upcomingTokens}
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {appointments.map((app) => {
            const isServing = app.tokenNumber === queue.currentTokenServing;
            return (
              <div
                key={app.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: isServing ? 'var(--brand-teal-50)' : '#FFFFFF',
                  border: `1px solid ${isServing ? 'var(--brand-teal-600)' : 'var(--slate-200)'}`,
                  fontSize: '13px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: isServing ? 'var(--brand-teal-600)' : 'var(--slate-100)',
                      color: isServing ? '#FFFFFF' : 'var(--slate-800)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '14px',
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
