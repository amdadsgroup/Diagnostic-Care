'use client';

import React, { useState, useEffect } from 'react';
import { BRAND_CONSTANTS } from '@/config/brand';
import { SupportTicket } from '@/types';
import { HelpCircle, Send, CheckCircle2, MessageSquare, PhoneCall, AlertCircle } from 'lucide-react';

export default function SupportTicketModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');

  // Form State
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('BOOKING');
  const [priority, setPriority] = useState<SupportTicket['priority']>('MEDIUM');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

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
    if (isOpen) fetchTickets();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      alert('বিষয় এবং বার্তা আবশ্যক।');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterUserId: 'user-patient-current',
          requesterName: 'তানভীর আহমেদ',
          requesterPhone: '01712000001',
          subject,
          category,
          priority,
          message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessNotice(`টিকিট নং ${data.ticket.ticketNumber} সফলভাবে চালু হয়েছে। কাস্টমার সাপোর্ট টিম দ্রুত আপনার সাথে যোগাযোগ করবে।`);
        fetchTickets();
        setSubject('');
        setMessage('');
      }
    } catch (err: any) {
      alert('টিকিট তৈরি ব্যর্থ হয়েছে। অনুগ্রহ করে হেল্পলাইনে সরাসরি কল করুন: 01886748564');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(11, 37, 69, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          maxWidth: '750px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: 'var(--brand-navy-900, #0B2545)',
            color: '#FFFFFF',
            padding: '20px 24px',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HelpCircle size={24} color="#38BDF8" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>কাস্টমার সাপোর্ট ও অভিযোগ সেল</h2>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                সার্বক্ষণিক সহায়তা হেল্পলাইন: {BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
              style={{
                backgroundColor: '#38BDF8',
                color: '#0B2545',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <PhoneCall size={12} />
              {BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}
            </a>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '20px',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setActiveTab('create')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              backgroundColor: activeTab === 'create' ? 'var(--brand-navy-900, #0B2545)' : '#F1F5F9',
              color: activeTab === 'create' ? '#FFFFFF' : '#475569',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            নতুন অভিযোগ / সহায়তা টিকিট
          </button>
          <button
            onClick={() => setActiveTab('list')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              backgroundColor: activeTab === 'list' ? 'var(--brand-navy-900, #0B2545)' : '#F1F5F9',
              color: activeTab === 'list' ? '#FFFFFF' : '#475569',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            আমার পূর্ববর্তী টিকিটসমূহ ({tickets.length})
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {successNotice && (
            <div
              style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #86EFAC',
                color: '#166534',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle2 size={18} />
              {successNotice}
            </div>
          )}

          {activeTab === 'create' ? (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2545', marginBottom: '6px' }}>
                  সমস্যা বা বিষয়ের সারসংক্ষেপ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: টেস্ট রিপোর্টের লিঙ্ক কাজ করছে না অথবা সিরিয়াল বুকিং সমস্যা"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2545', marginBottom: '6px' }}>
                    অভিযোগের বিভাগ
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="BOOKING">ডাক্তার / টেস্ট বুকিং সংক্রান্ত</option>
                    <option value="PAYMENT">বিকাশ / নগদ পেমেন্ট সংক্রান্ত</option>
                    <option value="MEDICAL_REPORT">ডিজিটাল রিপোর্ট ডাউনলোড</option>
                    <option value="PROVIDER_QUALITY">ডাক্তার / ক্লিনিকের সেবা মান</option>
                    <option value="TECHNICAL">অ্যাপ বা প্রযুক্তিগত ত্রুটি</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2545', marginBottom: '6px' }}>
                    জরুরিতা
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="LOW">সাধারণ (Low)</option>
                    <option value="MEDIUM">মাঝারি (Medium)</option>
                    <option value="HIGH">জরুরি (High)</option>
                    <option value="CRITICAL">অত্যন্ত সংকটজনক (Critical)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2545', marginBottom: '6px' }}>
                  বিস্তারিত বর্ণনা *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="আপনার সমস্যার বিস্তারিত বিবরণ লিখুন..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: 'var(--brand-navy-900, #0B2545)',
                    color: '#FFFFFF',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Send size={16} />
                  {isSubmitting ? 'জমা হচ্ছে...' : 'টিকিট জমা দিন'}
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {tickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#64748B' }}>
                  কোনো সহায়তা টিকিট পাওয়া যায়নি।
                </div>
              ) : (
                tickets.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#F8FAFC',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0284C7' }}>
                        {t.ticketNumber} • {t.category}
                      </div>
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

                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#0B2545', marginBottom: '8px' }}>
                      {t.subject}
                    </div>

                    <div style={{ fontSize: '13px', color: '#475569', marginBottom: '10px' }}>
                      {t.messages[0]?.message}
                    </div>

                    {t.messages.length > 1 && (
                      <div style={{ backgroundColor: '#FFFFFF', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid #0284C7', fontSize: '12px', color: '#1E293B' }}>
                        <strong>সাপোর্ট উত্তর:</strong> {t.messages[t.messages.length - 1].message}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
