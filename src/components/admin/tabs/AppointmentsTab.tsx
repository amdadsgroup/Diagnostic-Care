'use client';

import React, { useState, useEffect } from 'react';
import { AdminService } from '@/services/admin.service';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Phone,
  User,
  Stethoscope,
  DollarSign,
  Layers,
} from 'lucide-react';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';

interface AppointmentsTabProps {
  language: 'en' | 'bn';
  adminEmail: string;
}

export default function AppointmentsTab({ language, adminEmail }: AppointmentsTabProps) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  // Cancellation Modal State
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    const data = await AdminService.getAppointmentsAdmin({
      query: search,
      status: statusFilter,
      date: dateFilter || undefined,
    });
    setAppointments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, dateFilter]);

  const handleStatusChange = async (appointmentId: string, newStatus: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW', notes: string = '') => {
    setIsUpdating(true);
    const res = await AdminService.updateAppointmentStatus(appointmentId, newStatus, notes, adminEmail);
    if (res.success) {
      fetchAppointments();
      setSelectedAppointment(null);
      setCancellationReason('');
    } else {
      alert(res.error || 'Failed to update appointment status');
    }
    setIsUpdating(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search and Filters */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '18px 20px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '280px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '8px 12px',
              width: '100%',
            }}
          >
            <Search size={16} color="#94A3B8" style={{ marginRight: '8px' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === 'bn' ? 'বুকিং কোড, রোগীর নাম বা ফোন...' : 'Search booking code, patient, phone...'}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '13px',
              }}
            />
          </div>
          <button
            type="button"
            onClick={fetchAppointments}
            style={{
              backgroundColor: BRAND_COLORS.primary,
              color: '#FFFFFF',
              border: 'none',
              padding: '0 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {language === 'bn' ? 'খুঁজুন' : 'Search'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '8px 12px',
              fontSize: '13px',
              color: '#0F172A',
              fontWeight: 600,
            }}
          >
            <option value="ALL">{language === 'bn' ? 'সকল স্ট্যাটাস' : 'All Statuses'}</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          {/* Date Picker */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '7px 12px',
              fontSize: '13px',
              color: '#0F172A',
            }}
          />
        </div>
      </div>

      {/* Appointments Data Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569' }}>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>{language === 'bn' ? 'বুকিং কোড ও টোকেন' : 'Booking Code & Token'}</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>{language === 'bn' ? 'রোগীর বিবরণ' : 'Patient Info'}</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>{language === 'bn' ? 'চিকিৎসক' : 'Doctor & Specialty'}</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>{language === 'bn' ? 'তারিখ ও সময়' : 'Schedule'}</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>{language === 'bn' ? 'ফি' : 'Fee'}</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'right' }}>{language === 'bn' ? 'অপারেশনাল অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                    {language === 'bn' ? 'অ্যাপয়েন্টমেন্টস লোড হচ্ছে...' : 'Loading appointments...'}
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                    {language === 'bn' ? 'কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি।' : 'No appointments found.'}
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>
                        {apt.bookingCode}
                      </div>
                      <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: 700, marginTop: '2px' }}>
                        Token #{apt.tokenNumber || '1'}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: '#0F172A' }}>{apt.patientName}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Phone size={12} />
                        <span>{apt.patientPhone}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: '#334155' }}>{apt.doctorName}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{apt.specialization}</div>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#334155' }}>
                      <div style={{ fontWeight: 600 }}>{apt.appointmentDate}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{apt.startTime || 'Chamber Hours'}</div>
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 800, color: '#0F172A' }}>
                      ৳{apt.consultationFee}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          backgroundColor:
                            apt.status === 'COMPLETED'
                              ? '#DCFCE7'
                              : apt.status === 'CANCELLED'
                              ? '#FEE2E2'
                              : '#EFF6FF',
                          color:
                            apt.status === 'COMPLETED'
                              ? '#166534'
                              : apt.status === 'CANCELLED'
                              ? '#991B1B'
                              : '#1E40AF',
                        }}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        {apt.status === 'CONFIRMED' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(apt.id, 'COMPLETED')}
                              style={{
                                padding: '5px 9px',
                                borderRadius: '6px',
                                backgroundColor: '#F0FDF4',
                                border: '1px solid #BBF7D0',
                                color: '#16A34A',
                                fontSize: '11.5px',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Complete
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedAppointment(apt)}
                              style={{
                                padding: '5px 9px',
                                borderRadius: '6px',
                                backgroundColor: '#FEF2F2',
                                border: '1px solid #FECACA',
                                color: '#DC2626',
                                fontSize: '11.5px',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {apt.status === 'CANCELLED' && apt.cancellationReason && (
                          <span style={{ fontSize: '11px', color: '#64748B', fontStyle: 'italic' }}>
                            {apt.cancellationReason}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancellation Modal */}
      {selectedAppointment && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '26px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
            }}
          >
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#DC2626', margin: '0 0 10px 0' }}>
              {language === 'bn' ? 'অ্যাপয়েন্টমেন্ট বাতিলকরণ' : 'Cancel Appointment'}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '14px' }}>
              Booking Code: <strong>{selectedAppointment.bookingCode}</strong> ({selectedAppointment.patientName})
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                {language === 'bn' ? 'বাতিলের কারণ:' : 'Official Cancellation Reason:'}
              </label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={3}
                placeholder={language === 'bn' ? 'রোগী অনুপস্থিত / ডাক্তারের জরুরি অস্ত্রোপচার...' : 'Patient requested / Doctor unavailable...'}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                disabled={isUpdating}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#F1F5F9',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {language === 'bn' ? 'পিছনে যান' : 'Back'}
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange(selectedAppointment.id, 'CANCELLED', cancellationReason)}
                disabled={isUpdating}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                }}
              >
                {isUpdating ? 'Processing...' : language === 'bn' ? 'বাতিল নিশ্চিত করুন' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
