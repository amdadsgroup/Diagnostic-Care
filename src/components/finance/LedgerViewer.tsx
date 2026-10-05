'use client';

import React, { useState, useEffect } from 'react';
import { BRAND } from '@/config/brand';

interface LedgerEntry {
  id: string;
  transactionId: string;
  account: string;
  direction: 'DEBIT' | 'CREDIT';
  amount: number;
  currency: string;
  description: string;
  createdAt: string;
}

export default function LedgerViewer() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [audit, setAudit] = useState<{ totalDebits: number; totalCredits: number; isBalanced: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subMessage, setSubMessage] = useState('');

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ledger/entries');
      const data = await res.json();
      if (data.success) {
        setEntries(data.entries);
        setAudit(data.audit);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const handleUpgradeSubscription = async (tier: 'BASIC' | 'STANDARD' | 'ENTERPRISE') => {
    setSubscribing(true);
    setSubMessage('');
    try {
      const res = await fetch('/api/subscriptions/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: 'org-pop-mb',
          organizationName: 'পপুলার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার)',
          tier,
          gateway: 'BKASH',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubMessage(`✓ ${data.message} লেজারে নতুন ব্যালেন্সড এন্ট্রি যুক্ত হয়েছে।`);
        fetchLedger();
      }
    } catch {
      alert('সাবস্ক্রিপশন প্রসেসিংয়ে ত্রুটি');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Ledger Header */}
      <div className="portal-card" style={{ background: 'linear-gradient(135deg, var(--brand-navy-900) 0%, #1e3a8a 100%)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, color: '#34d399', marginBottom: '8px' }}>
              ✓ Immutable Double-Entry Ledger (ডাবল-এন্ট্রি আর্থিক লেজার)
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>প্ল্যাটফর্ম ফাইন্যান্সিয়াল অডিট হাব</h2>
            <p style={{ opacity: 0.85, fontSize: '0.85rem' }}>
              প্রতিটি লেনদেনের জন্য সুনির্দিষ্ট ডেবিট ও ক্রেডিট রেকর্ড প্রস্তুত হয়। কোনো অর্থ লুকানো থাকে না।
            </p>
          </div>

          <button
            onClick={fetchLedger}
            disabled={loading}
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)' }}
          >
            {loading ? 'রিফ্রেশ হচ্ছে...' : '🔄 লেজার রিফ্রেশ'}
          </button>
        </div>
      </div>

      {/* Audit Ribbon: Debits vs Credits */}
      {audit && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="portal-stat-card" style={{ borderLeft: '4px solid var(--brand-teal-500)' }}>
            <div className="portal-stat-lbl">মোট ডেবিট (Total Debits)</div>
            <div className="portal-stat-val" style={{ color: 'var(--brand-teal-600)' }}>
              ৳{audit.totalDebits.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>মোট অর্থ গ্রহণ (Inflow)</div>
          </div>

          <div className="portal-stat-card" style={{ borderLeft: '4px solid var(--brand-navy-900)' }}>
            <div className="portal-stat-lbl">মোট ক্রেডিট (Total Credits)</div>
            <div className="portal-stat-val" style={{ color: 'var(--brand-navy-900)' }}>
              ৳{audit.totalCredits.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>প্রোভাইডার দায় + প্ল্যাটফর্ম ফি</div>
          </div>

          <div className="portal-stat-card" style={{ borderLeft: `4px solid ${audit.isBalanced ? 'var(--brand-emerald-500)' : 'var(--brand-rose-600)'}`, background: audit.isBalanced ? 'var(--brand-emerald-50)' : 'var(--brand-rose-50)' }}>
            <div className="portal-stat-lbl">লেজার ব্যালেন্স স্ট্যাটাস</div>
            <div className="portal-stat-val" style={{ color: audit.isBalanced ? '#065f46' : 'var(--brand-rose-600)', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {audit.isBalanced ? '✓ ১০০% ব্যালেন্সড' : '✗ অমিল রয়েছে'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-600)' }}>
              Sum(Debits) === Sum(Credits)
            </div>
          </div>
        </div>
      )}

      {/* B2B Subscription Tiers Simulator */}
      <div className="portal-card" style={{ border: '2px solid var(--brand-teal-500)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-navy-900)', marginBottom: '6px' }}>
          ডায়াগনস্টিক সেন্টার B2B SaaS সাবস্ক্রিপশন মডেল
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '16px' }}>
          ডায়াগনস্টিক সেন্টার তাদের শাখা ও ডাক্তার ক্যাপাসিটি অনুযায়ী মাসিক প্যাকেজ বেছে নিতে পারে:
        </p>

        {subMessage && (
          <div style={{ background: 'var(--brand-emerald-50)', color: '#065f46', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '14px', border: '1px solid var(--brand-emerald-500)' }}>
            {subMessage}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          {/* Basic */}
          <div style={{ border: '1px solid var(--slate-300)', padding: '16px', borderRadius: '10px', background: 'white' }}>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--brand-navy-900)' }}>বেসিক প্ল্যান (Basic)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--brand-teal-600)', margin: '8px 0' }}>
              ৳২০০ <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>/ মাস</span>
            </div>
            <ul style={{ fontSize: '0.8rem', color: 'var(--slate-600)', lineHeight: 1.6, paddingLeft: '18px', marginBottom: '14px' }}>
              <li>১টি শাখা (Moulvibazar Branch)</li>
              <li>সর্বোচ্চ ৩ জন বিশেষজ্ঞ ডাক্তার</li>
              <li>স্ট্যান্ডার্ড সিরিয়াল কিউ</li>
            </ul>
            <button
              onClick={() => handleUpgradeSubscription('BASIC')}
              disabled={subscribing}
              style={{ width: '100%', padding: '8px', background: 'var(--slate-100)', color: 'var(--brand-navy-900)', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', border: '1px solid var(--slate-300)' }}
            >
              বেসিক প্যাকেজ সক্রিয় করুন
            </button>
          </div>

          {/* Standard */}
          <div style={{ border: '2px solid var(--brand-teal-600)', padding: '16px', borderRadius: '10px', background: 'var(--brand-teal-50)', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '-10px', right: '12px', background: 'var(--brand-teal-600)', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' }}>
              জনপ্রিয়
            </span>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--brand-navy-900)' }}>স্ট্যান্ডার্ড প্ল্যান (Standard)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--brand-teal-600)', margin: '8px 0' }}>
              ৳৫০০ <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>/ মাস</span>
            </div>
            <ul style={{ fontSize: '0.8rem', color: 'var(--slate-700)', lineHeight: 1.6, paddingLeft: '18px', marginBottom: '14px' }}>
              <li>৩টি পর্যন্ত শাখা</li>
              <li>১০ জন ডাক্তার ও অ্যাসিস্ট্যান্ট স্যান্ডবক্স</li>
              <li>লাইভ SMS টোকেন অ্যালার্ট ইঞ্জিন</li>
            </ul>
            <button
              onClick={() => handleUpgradeSubscription('STANDARD')}
              disabled={subscribing}
              className="btn-primary"
              style={{ width: '100%', padding: '8px', fontSize: '0.8rem' }}
            >
              স্ট্যান্ডার্ড প্যাকেজ সক্রিয় করুন
            </button>
          </div>

          {/* Enterprise */}
          <div style={{ border: '1px solid var(--slate-300)', padding: '16px', borderRadius: '10px', background: 'white' }}>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--brand-navy-900)' }}>এন্টারপ্রাইজ (Enterprise)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--brand-navy-900)', margin: '8px 0' }}>
              ৳২,০০০ <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>/ মাস</span>
            </div>
            <ul style={{ fontSize: '0.8rem', color: 'var(--slate-600)', lineHeight: 1.6, paddingLeft: '18px', marginBottom: '14px' }}>
              <li>আনলিমিটেড শাখা ও ডাক্তার</li>
              <li>২৪/৭ ডেডিকেটেড সাপোর্ট প্রতিনিধি</li>
              <li>সম্পূর্ণ ফিন্যান্সিয়াল লেজার এক্সপোর্ট</li>
            </ul>
            <button
              onClick={() => handleUpgradeSubscription('ENTERPRISE')}
              disabled={subscribing}
              style={{ width: '100%', padding: '8px', background: 'var(--brand-navy-900)', color: 'white', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem' }}
            >
              এন্টারপ্রাইজ প্যাকেজ সক্রিয় করুন
            </button>
          </div>
        </div>
      </div>

      {/* Immutable Double-Entry Ledger Table */}
      <div className="portal-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-navy-900)', marginBottom: '14px' }}>
          অডিট ট্রেইল: লাইভ লেজার রেকর্ডসমূহ ({entries.length} টি এন্ট্রি)
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'var(--slate-100)', textAlign: 'left', borderBottom: '1px solid var(--slate-300)' }}>
                <th style={{ padding: '8px 10px' }}>সময় (Timestamp)</th>
                <th style={{ padding: '8px 10px' }}>লেনদেন আইডি</th>
                <th style={{ padding: '8px 10px' }}>অ্যাকাউন্ট টাইপ (Account)</th>
                <th style={{ padding: '8px 10px' }}>বর্ণনা (Description)</th>
                <th style={{ padding: '8px 10px' }}>ডেবিট (Debit)</th>
                <th style={{ padding: '8px 10px' }}>ক্রেডিট (Credit)</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => {
                const isDebit = e.direction === 'DEBIT';
                return (
                  <tr key={e.id} style={{ borderBottom: '1px solid var(--slate-200)' }}>
                    <td style={{ padding: '8px 10px', color: 'var(--slate-500)', whiteSpace: 'nowrap' }}>
                      {new Date(e.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: 600 }}>{e.transactionId.slice(0, 12)}</td>
                    <td style={{ padding: '8px 10px' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: e.account.startsWith('ASSET') ? 'var(--brand-teal-50)' : e.account.startsWith('LIABILITY') ? '#fff7ed' : '#ecfdf5',
                        color: e.account.startsWith('ASSET') ? 'var(--brand-teal-600)' : e.account.startsWith('LIABILITY') ? '#c2410c' : '#047857',
                      }}>
                        {e.account}
                      </span>
                    </td>
                    <td style={{ padding: '8px 10px', color: 'var(--slate-700)' }}>{e.description}</td>
                    <td style={{ padding: '8px 10px', fontWeight: 700, color: isDebit ? 'var(--brand-teal-600)' : 'transparent' }}>
                      {isDebit ? `৳${e.amount}` : '-'}
                    </td>
                    <td style={{ padding: '8px 10px', fontWeight: 700, color: !isDebit ? 'var(--brand-navy-900)' : 'transparent' }}>
                      {!isDebit ? `৳${e.amount}` : '-'}
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
}
