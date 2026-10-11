'use client';

import React, { useState, useEffect } from 'react';
import { SupportTicket } from '@/types';
import { AdminService } from '@/services/admin.service';
import HelplineBookingConsole from '@/components/support/HelplineBookingConsole';
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Phone,
  User,
} from 'lucide-react';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';

interface SupportTabProps {
  language: 'en' | 'bn';
  adminEmail: string;
}

export default function SupportTab({ language, adminEmail }: SupportTabProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'INVESTIGATING' | 'RESOLVED'>('ALL');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'tickets' | 'helpline'>('tickets');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/support/tickets');
      const data = await res.json();
      if (data.success && data.tickets) {
        setTickets(data.tickets);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdateStatus = async (ticketId: string, status: 'open' | 'investigating' | 'resolved' | 'closed') => {
    await AdminService.updateSupportTicket(ticketId, status, resolutionNote, adminEmail);
    fetchTickets();
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: status.toUpperCase() as any } : null));
    }
  };

  const filtered = filter === 'ALL' ? tickets : tickets.filter((t) => t.status === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Sub Tabs: Tickets vs Helpline Booking */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1.5px solid #E2E8F0', paddingBottom: '12px' }}>
        <button
          type="button"
          onClick={() => setActiveSubTab('tickets')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeSubTab === 'tickets' ? BRAND_COLORS.primary : '#F1F5F9',
            color: activeSubTab === 'tickets' ? '#FFFFFF' : '#475569',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {language === 'bn' ? 'সাপোর্ট টিকিট কিউ' : 'Support Tickets Queue'} ({tickets.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('helpline')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeSubTab === 'helpline' ? BRAND_COLORS.primary : '#F1F5F9',
            color: activeSubTab === 'helpline' ? '#FFFFFF' : '#475569',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {language === 'bn' ? '২৪/৭ হেল্পলাইন বুকিং কনসোল' : '24/7 Helpline Booking Console'}
        </button>
      </div>

      {activeSubTab === 'helpline' ? (
        <HelplineBookingConsole />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedTicket ? '1.2fr 1fr' : '1fr', gap: '20px' }}>
          {/* Tickets List */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '15px' }}>
                {language === 'bn' ? 'সাপোর্ট টিকিট ডেস্ক' : 'Support Ticket Desk'}
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['ALL', 'OPEN', 'INVESTIGATING', 'RESOLVED'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFilter(s)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: filter === s ? '#0F172A' : '#F1F5F9',
                      color: filter === s ? '#FFFFFF' : '#64748B',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>Ticket</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>Subject</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>Requester</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>Priority</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                        No support tickets found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((t) => (
                      <tr
                        key={t.id}
                        onClick={() => setSelectedTicket(t)}
                        style={{
                          borderBottom: '1px solid #F1F5F9',
                          cursor: 'pointer',
                          backgroundColor: selectedTicket?.id === t.id ? '#F8FAFC' : 'transparent',
                        }}
                      >
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#2563EB' }}>
                          {t.ticketNumber}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0F172A' }}>
                          {t.subject}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#475569' }}>
                          <div>{t.requesterName}</div>
                          <div style={{ fontSize: '11px', color: '#94A3B8' }}>{t.requesterPhone}</div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              fontSize: '10.5px',
                              fontWeight: 800,
                              padding: '2px 7px',
                              borderRadius: '4px',
                              backgroundColor:
                                t.priority === 'CRITICAL' || t.priority === 'HIGH'
                                  ? '#FEE2E2'
                                  : t.priority === 'MEDIUM'
                                  ? '#FEF3C7'
                                  : '#EFF6FF',
                              color:
                                t.priority === 'CRITICAL' || t.priority === 'HIGH'
                                  ? '#991B1B'
                                  : t.priority === 'MEDIUM'
                                  ? '#92400E'
                                  : '#1E40AF',
                            }}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              backgroundColor:
                                t.status === 'RESOLVED'
                                  ? '#DCFCE7'
                                  : t.status === 'INVESTIGATING'
                                  ? '#FEF3C7'
                                  : '#EFF6FF',
                              color:
                                t.status === 'RESOLVED'
                                  ? '#166534'
                                  : t.status === 'INVESTIGATING'
                                  ? '#92400E'
                                  : '#1E40AF',
                            }}
                          >
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ticket Detail & Thread Drawer */}
          {selectedTicket && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '22px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#2563EB', fontWeight: 700 }}>
                      {selectedTicket.ticketNumber}
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '4px 0 0 0' }}>
                      {selectedTicket.subject}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(null)}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '16px' }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px', marginBottom: '16px', fontSize: '12.5px' }}>
                  <div style={{ color: '#64748B' }}>Requester:</div>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>
                    {selectedTicket.requesterName} • {selectedTicket.requesterPhone}
                  </div>
                </div>

                {/* Message Thread */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                    Messages Thread:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                    {selectedTicket.messages?.map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '10px',
                          backgroundColor: msg.senderRole === 'SUPER_ADMIN' ? '#EFF6FF' : '#F1F5F9',
                          fontSize: '12.5px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 800, color: '#0F172A' }}>{msg.senderName}</span>
                          <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>{msg.timestamp}</span>
                        </div>
                        <div style={{ color: '#334155' }}>{msg.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Update Actions */}
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                  Update Resolution Status:
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'investigating')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: '#FEF3C7',
                      color: '#92400E',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Investigate
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'resolved')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: '#DCFCE7',
                      color: '#166534',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Resolve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'closed')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: '#F1F5F9',
                      color: '#475569',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
