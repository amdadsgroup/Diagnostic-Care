'use client';

import React from 'react';
import { Appointment, QueueState, DoctorAssistant } from '@/types';
import { BRAND_CONSTANTS, SupportedLanguage } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import { ShieldCheck, ShieldAlert, Users, Phone, Clock, ArrowRight, CheckCircle2, UserCheck, Lock } from 'lucide-react';

interface DoctorAssistantViewProps {
  assistant: DoctorAssistant;
  doctorName: string;
  specialization: string;
  organizationName: string;
  branchName: string;
  appointments: Appointment[];
  queue: QueueState;
  language: SupportedLanguage;
  onCallNext: () => void;
  onUpdateStatus: (appointmentId: string, status: Appointment['status']) => void;
}

export const DoctorAssistantView: React.FC<DoctorAssistantViewProps> = ({
  assistant,
  doctorName,
  specialization,
  organizationName,
  branchName,
  appointments,
  queue,
  language,
  onCallNext,
  onUpdateStatus,
}) => {
  const t = TRANSLATIONS[language];

  // Filter appointments specifically for this assistant's assigned doctor association
  const doctorAppointments = appointments.filter(
    (a) => a.doctorAssociationId === assistant.doctorAssociationId
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Assistant Profile & Security Isolation Banner */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid var(--slate-200)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--brand-teal-50)',
                color: 'var(--brand-teal-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserCheck size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                  {assistant.fullName} (Doctor Assistant)
                </h3>
                <span style={{ backgroundColor: 'var(--brand-emerald-50)', color: '#065F46', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                  ACTIVE SESSION
                </span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--slate-600)', marginTop: '2px' }}>
                Assigned to: <strong>{doctorName}</strong> ({specialization}) • {organizationName}, {branchName}
              </div>
            </div>
          </div>

          <button
            onClick={onCallNext}
            id="assistant-call-next-btn"
            style={{
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
            }}
          >
            <span>{t.actionCallNext}</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Server-Side RBAC Isolation Notice */}
        <div
          style={{
            marginTop: '20px',
            backgroundColor: 'var(--brand-teal-50)',
            border: '1px solid #A5F3FC',
            borderRadius: '10px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            fontSize: '13px',
            color: '#0E7490',
          }}
        >
          <Lock size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>RBAC Tenant Isolation Barrier Active:</strong>
            <div style={{ marginTop: '2px', color: '#155E75', lineHeight: 1.5 }}>
              You are logged in to the sandboxed Doctor Assistant portal. Under Diagnostic Care privacy rules, you have authorized access <strong>only</strong> to today's patient queue, contact numbers, and token calls for {doctorName}. Access to other physicians' chambers, center financial turnover, and administrative settings is strictly restricted.
            </div>
          </div>
        </div>
      </div>

      {/* Queue Progress & Patient Queue Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid var(--slate-200)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
              Today's Chamber Patients ({doctorAppointments.length} Bookings)
            </h4>
            <div style={{ fontSize: '12px', color: 'var(--slate-500)' }}>
              Currently Serving: <strong>Token {queue.currentTokenServing.toString().padStart(2, '0')}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--slate-600)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              Arrived: {doctorAppointments.filter((a) => a.status === 'CHECKED_IN').length}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--slate-600)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284C7' }} />
              Completed: {doctorAppointments.filter((a) => a.status === 'COMPLETED').length}
            </span>
          </div>
        </div>

        {/* Patient Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--slate-100)', borderBottom: '1px solid var(--slate-200)', color: 'var(--slate-700)' }}>
                <th style={{ padding: '12px 14px', borderRadius: '6px 0 0 6px' }}>Token</th>
                <th style={{ padding: '12px 14px' }}>Patient Name</th>
                <th style={{ padding: '12px 14px' }}>Phone Number</th>
                <th style={{ padding: '12px 14px' }}>Age & Gender</th>
                <th style={{ padding: '12px 14px' }}>Slot Time</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px', borderRadius: '0 6px 6px 0', textAlign: 'right' }}>Chamber Action</th>
              </tr>
            </thead>
            <tbody>
              {doctorAppointments.map((app) => {
                const isServing = app.tokenNumber === queue.currentTokenServing;
                return (
                  <tr
                    key={app.id}
                    style={{
                      borderBottom: '1px solid var(--slate-100)',
                      backgroundColor: isServing ? 'var(--brand-teal-50)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '12px 14px', fontWeight: 800 }}>
                      <span
                        style={{
                          backgroundColor: isServing ? 'var(--brand-teal-600)' : 'var(--slate-200)',
                          color: isServing ? '#FFFFFF' : 'var(--slate-800)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        #{app.tokenNumber.toString().padStart(2, '0')}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--brand-navy-900)' }}>
                      {app.patientName}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <a href={`tel:${app.patientPhone}`} style={{ color: 'var(--brand-navy-700)', textDecoration: 'none', fontWeight: 500 }}>
                        {app.patientPhone}
                      </a>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--slate-600)' }}>
                      {app.patientAge} yrs • {app.patientGender}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--slate-700)', fontWeight: 600 }}>
                      {app.startTime}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor:
                            app.status === 'COMPLETED'
                              ? 'var(--brand-emerald-50)'
                              : app.status === 'IN_PROGRESS'
                              ? '#E0F2FE'
                              : app.status === 'CHECKED_IN'
                              ? '#FEF3C7'
                              : 'var(--slate-100)',
                          color:
                            app.status === 'COMPLETED'
                              ? '#065F46'
                              : app.status === 'IN_PROGRESS'
                              ? '#0369A1'
                              : app.status === 'CHECKED_IN'
                              ? '#92400E'
                              : '#475569',
                        }}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {app.status !== 'CHECKED_IN' && app.status !== 'COMPLETED' && (
                          <button
                            onClick={() => onUpdateStatus(app.id, 'CHECKED_IN')}
                            style={{
                              backgroundColor: 'var(--slate-100)',
                              border: '1px solid var(--slate-300)',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Mark Arrived
                          </button>
                        )}
                        {app.status !== 'COMPLETED' && (
                          <button
                            onClick={() => onUpdateStatus(app.id, 'COMPLETED')}
                            style={{
                              backgroundColor: 'var(--brand-emerald-500)',
                              color: '#FFFFFF',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Done
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
