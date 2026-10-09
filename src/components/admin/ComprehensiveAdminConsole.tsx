'use client';

import React, { useState, useEffect } from 'react';
import {
  Organization,
  LeadItem,
  SupportTicket,
  VerificationStatus,
} from '@/types';
import {
  ShieldCheck,
  Users,
  Building2,
  PhoneCall,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Filter,
  Plus,
  RefreshCw,
  TrendingUp,
  MapPin,
  Clock,
} from 'lucide-react';
import { BANGLADESH_DIVISIONS, BANGLADESH_DISTRICTS } from '@/lib/geo-bangladesh';

export default function ComprehensiveAdminConsole() {
  const [activeTab, setActiveTab] = useState<'verification' | 'leads' | 'tickets' | 'geo'>('verification');

  // Verification state
  const [providers, setProviders] = useState<Organization[]>([]);
  const [verifyingOrgId, setVerifyingOrgId] = useState<string | null>(null);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);

  // Leads state
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [selectedLeadStage, setSelectedLeadStage] = useState<string>('ALL');
  const [newLeadNote, setNewLeadNote] = useState<{ [leadId: string]: string }>({});

  // Tickets state
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [ticketReply, setTicketReply] = useState<{ [ticketId: string]: string }>({});

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/admin/verify-provider');
      const data = await res.json();
      if (data.success && data.providers) {
        setProviders(data.providers);
      }
    } catch {
      // Fallback
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch {
      // Fallback
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/support/tickets');
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchProviders();
    fetchLeads();
    fetchTickets();
  }, []);

  const handleVerifyProvider = async (orgId: string, status: VerificationStatus) => {
    setVerifyingOrgId(orgId);
    try {
      const res = await fetch('/api/admin/verify-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: orgId,
          status,
          reviewerName: 'Platform Super Admin',
          remarks: `Audited and changed status to ${status}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAuditMessage(`প্রতিষ্ঠানের স্ট্যাটাস সফলভাবে পরিবর্তিত হয়েছে: ${status}`);
        fetchProviders();
      }
    } catch {
      alert('ভেরিফিকেশন ব্যর্থ হয়েছে।');
    } finally {
      setVerifyingOrgId(null);
    }
  };

  const handleUpdateLeadStage = async (leadId: string, stage: LeadItem['stage']) => {
    const note = newLeadNote[leadId] || '';
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, stage, note }),
      });
      const data = await res.json();
      if (data.success) {
        fetchLeads();
        setNewLeadNote((prev) => ({ ...prev, [leadId]: '' }));
      }
    } catch {
      alert('লিড আপডেট ব্যর্থ হয়েছে।');
    }
  };

  const handleSendTicketReply = async (ticketId: string) => {
    const msg = ticketReply[ticketId];
    if (!msg) return;

    try {
      const res = await fetch('/api/support/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          senderUserId: 'super-admin-01',
          senderName: 'Diagnostic Care Admin Desk',
          senderRole: 'SUPER_ADMIN',
          message: msg,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchTickets();
        setTicketReply((prev) => ({ ...prev, [ticketId]: '' }));
      }
    } catch {
      alert('উত্তর প্রেরণ ব্যর্থ হয়েছে।');
    }
  };

  const filteredLeads = selectedLeadStage === 'ALL' ? leads : leads.filter((l) => l.stage === selectedLeadStage);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #CBD5E1',
        boxShadow: 'var(--shadow-lg)',
        padding: '24px',
        marginBottom: '32px',
      }}
    >
      {/* Console Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '16px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#0B2545',
              color: '#38BDF8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0B2545' }}>
                সেন্ট্রাল অ্যাডমিন ও অপারেশনস ম্যানেজমেন্ট কনসোল
              </h2>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                RBAC LIVE • SUPER ADMIN
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
              সারাদেশের হেলথকেয়ার প্রোভাইডার ভেরিফিকেশন, বি২বি লিড ম্যানেজমেন্ট, টিকিট রেজোলিউশন ও রিজিওনাল ডেপ্লয়মেন্ট
            </p>
          </div>
        </div>

        {/* Console Nav Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'verification', label: 'প্রোভাইডার ভেরিফিকেশন', count: providers.length },
            { id: 'leads', label: 'বি২বি লিড পাইপলাইন (CRM)', count: leads.length },
            { id: 'tickets', label: 'সাপোর্ট টিকিট ও কমপ্লেন', count: tickets.length },
            { id: 'geo', label: 'সারাদেশের জেলা ও কভারেজ (৬৪ জেলা)', count: 64 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                backgroundColor: activeTab === tab.id ? '#0B2545' : '#F1F5F9',
                color: activeTab === tab.id ? '#FFFFFF' : '#475569',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {tab.label}
              <span
                style={{
                  fontSize: '11px',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  backgroundColor: activeTab === tab.id ? '#38BDF8' : '#CBD5E1',
                  color: activeTab === tab.id ? '#0B2545' : '#1E293B',
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {auditMessage && (
        <div
          style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #86EFAC',
            color: '#166534',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} />
          {auditMessage}
        </div>
      )}

      {/* TAB 1: PROVIDER VERIFICATION WORKFLOW */}
      {activeTab === 'verification' && (
        <div>
          <div style={{ marginBottom: '14px', fontSize: '13px', color: '#64748B' }}>
            নিবন্ধনকৃত হাসপাতাল ও ডায়াগনস্টিক সেন্টারের ট্রেড লাইসেন্স ও সিভিল সার্জন এনওসি নিরীক্ষণ করে অনুমোদন দিন:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {providers.map((p) => (
              <div
                key={p.id}
                style={{
                  padding: '18px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#F8FAFC',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0B2545' }}>{p.name}</h4>
                    <div style={{ fontSize: '12px', color: '#0284C7', fontWeight: 600 }}>{p.orgType}</div>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      backgroundColor: p.verificationStatus === 'VERIFIED' ? '#DCFCE7' : '#FEF3C7',
                      color: p.verificationStatus === 'VERIFIED' ? '#166534' : '#B45309',
                    }}
                  >
                    {p.verificationStatus}
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '6px' }}>
                  লাইসেন্স নম্বর: <strong>{p.tradeLicenseNumber || 'TRAD/2024/PENDING'}</strong>
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '14px' }}>
                  ব্রাঞ্চ: <strong>{p.branches?.map((b) => b.name).join(', ') || 'Main'}</strong> • হেল্পলাইন: {p.contactPhone}
                </div>

                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
                  <button
                    disabled={verifyingOrgId === p.id}
                    onClick={() => handleVerifyProvider(p.id, 'VERIFIED')}
                    style={{
                      flex: 1,
                      backgroundColor: '#16A34A',
                      color: '#FFFFFF',
                      padding: '8px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    অনুমোদন দিন (Verify)
                  </button>
                  <button
                    disabled={verifyingOrgId === p.id}
                    onClick={() => handleVerifyProvider(p.id, 'SUSPENDED')}
                    style={{
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    স্থগিত (Suspend)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: B2B LEAD MANAGEMENT PIPELINE (CRM) */}
      {activeTab === 'leads' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['ALL', 'NEW', 'CONTACTED', 'INTERESTED', 'ONBOARDING', 'ACTIVE'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedLeadStage(st)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    backgroundColor: selectedLeadStage === st ? '#0B2545' : '#F1F5F9',
                    color: selectedLeadStage === st ? '#FFFFFF' : '#475569',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {st}
                </button>
              ))}
            </div>

            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
              মোট অ্যাক্টিভ লিড: <strong>{filteredLeads.length} টি</strong>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0B2545' }}>{lead.businessName}</h4>
                    <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>
                      যোগাযোগ: <strong>{lead.contactPerson}</strong> • ফোন: <a href={`tel:${lead.phone}`} style={{ color: '#0284C7', fontWeight: 700 }}>{lead.phone}</a>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 900,
                        padding: '3px 10px',
                        borderRadius: '12px',
                        backgroundColor: '#EFF6FF',
                        color: '#1D4ED8',
                      }}
                    >
                      STAGE: {lead.stage}
                    </span>
                    <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: 700, marginTop: '4px' }}>
                      সম্ভাব্য আয়: ৳{lead.potentialMonthlyRevenueBDT}/মাস
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '13px', color: '#64748B', backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '6px', marginBottom: '12px' }}>
                  {lead.notes}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0B2545' }}>স্টেজ পরিবর্তন:</span>
                  {(['CONTACTED', 'INTERESTED', 'ONBOARDING', 'ACTIVE'] as LeadItem['stage'][]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateLeadStage(lead.id, st)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: '#F1F5F9',
                        color: '#334155',
                        border: '1px solid #CBD5E1',
                        cursor: 'pointer',
                      }}
                    >
                      ➔ {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SUPPORT TICKETS & COMPLAINTS */}
      {activeTab === 'tickets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {tickets.map((t) => (
            <div
              key={t.id}
              style={{
                padding: '18px',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#0284C7' }}>
                  {t.ticketNumber} • {t.category} • প্রায়োরিটি: {t.priority}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: t.status === 'RESOLVED' ? '#DCFCE7' : '#FEF3C7',
                    color: t.status === 'RESOLVED' ? '#166534' : '#B45309',
                  }}
                >
                  {t.status}
                </span>
              </div>

              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0B2545', marginBottom: '6px' }}>{t.subject}</h4>
              <div style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
                প্রেরক: <strong>{t.requesterName}</strong> ({t.requesterPhone})
              </div>

              {/* Message History */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                {t.messages.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      backgroundColor: m.senderRole === 'SUPER_ADMIN' ? '#EFF6FF' : '#F1F5F9',
                      borderLeft: m.senderRole === 'SUPER_ADMIN' ? '3px solid #1D4ED8' : '3px solid #64748B',
                    }}
                  >
                    <strong>{m.senderName}:</strong> {m.message}
                  </div>
                ))}
              </div>

              {/* Reply Input */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="রোগী বা প্রোভাইডারকে উত্তর প্রদান করুন..."
                  value={ticketReply[t.id] || ''}
                  onChange={(e) => setTicketReply((prev) => ({ ...prev, [t.id]: e.target.value }))}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
                <button
                  onClick={() => handleSendTicketReply(t.id)}
                  style={{
                    backgroundColor: '#0B2545',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  উত্তর পাঠান
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: NATIONWIDE GEO COVERAGE (64 DISTRICTS) */}
      {activeTab === 'geo' && (
        <div>
          <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
            বাংলাদেশের ৮টি প্রশাসনিক বিভাগ ও ৬৪টি জেলায় ডায়াগনস্টিক কেয়ারের ডেপ্লয়মেন্ট ম্যাপিং:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {BANGLADESH_DIVISIONS.map((div) => {
              const districtsInDiv = BANGLADESH_DISTRICTS.filter((d) => d.divisionId === div.id);
              return (
                <div
                  key={div.id}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                  }}
                >
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0B2545', marginBottom: '4px' }}>
                    {div.nameBn} ({div.nameEn})
                  </div>
                  <div style={{ fontSize: '12px', color: '#0284C7', fontWeight: 600, marginBottom: '10px' }}>
                    {districtsInDiv.length} টি জেলা অন্তর্ভুক্ত
                  </div>

                  <div style={{ fontSize: '11px', color: '#475569', lineHeight: 1.6 }}>
                    {districtsInDiv.map((d) => d.nameBn).join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
