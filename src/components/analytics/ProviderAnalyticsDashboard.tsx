'use client';

import React, { useState, useEffect } from 'react';
import { BRAND } from '@/config/brand';
import { AnalyticsSummary } from '@/types/extended';

export default function ProviderAnalyticsDashboard({
  organizationName = 'পপুলার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার)',
}: {
  organizationName?: string;
}) {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics/provider');
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (!analytics) {
    return (
      <div className="portal-card" style={{ textAlign: 'center', padding: '30px' }}>
        অ্যানালিটিক্স লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="portal-card" style={{ background: 'linear-gradient(135deg, var(--brand-navy-900) 0%, #1e293b 100%)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '6px' }}>
              📊 ক্লিনিক্যাল ও বিজনেস ইন্টেলিজেন্স (Analytics & Insights)
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{organizationName}</h2>
            <p style={{ opacity: 0.85, fontSize: '0.85rem' }}>
              সময়কাল: <strong>{analytics.periodLabel}</strong> • মৌলভীবাজার প্রধান হাব
            </p>
          </div>

          <button
            onClick={fetchAnalytics}
            disabled={loading}
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)' }}
          >
            {loading ? 'রিফ্রেশ হচ্ছে...' : '🔄 রিফ্রেশ অ্যানালিটিক্স'}
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div className="portal-stat-card">
          <div className="portal-stat-lbl">মোট অ্যাপয়েন্টমেন্ট ও টেস্ট</div>
          <div className="portal-stat-val">{analytics.totalBookings} টি</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--brand-emerald-500)', fontWeight: 600 }}>
            ✓ সম্পন্ন: {analytics.completedBookings} টি ({100 - analytics.cancellationRate}%)
          </div>
        </div>

        <div className="portal-stat-card">
          <div className="portal-stat-lbl">বাতিলের হার (Cancellation)</div>
          <div className="portal-stat-val" style={{ color: analytics.cancellationRate < 5 ? 'var(--brand-emerald-500)' : 'var(--brand-rose-600)' }}>
            {analytics.cancellationRate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            শিল্প গড়ের চেয়ে কম (খুব ভালো)
          </div>
        </div>

        <div className="portal-stat-card">
          <div className="portal-stat-lbl">মোট গ্রস রেভিনিউ (Turnover)</div>
          <div className="portal-stat-val" style={{ color: 'var(--brand-navy-900)' }}>
            ৳{analytics.totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            প্ল্যাটফর্ম কমিশন: ৳{analytics.platformCommission.toLocaleString()}
          </div>
        </div>

        <div className="portal-stat-card" style={{ borderLeft: '4px solid var(--brand-emerald-500)' }}>
          <div className="portal-stat-lbl">প্রতিষ্ঠানের নিট আয় (Net Payout)</div>
          <div className="portal-stat-val" style={{ color: 'var(--brand-emerald-500)' }}>
            ৳{analytics.providerEarnings.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-600)' }}>
            ৯০% সরাসরি ব্যাংক/বিকাশ পেআউট
          </div>
        </div>
      </div>

      {/* Peak Hours & Branch Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Peak Hours Card */}
        <div className="portal-card">
          <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--brand-navy-900)', marginBottom: '8px' }}>
            ⏰ পিক আওয়ার বিশ্লেষণ (Peak Traffic Hours)
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', marginBottom: '14px' }}>
            মৌলভীবাজারের রোগীরা প্রধানত বিকেলে চেম্বার পছন্দ করেন:
          </p>

          <div style={{ background: 'var(--brand-amber-50)', padding: '12px', borderRadius: '8px', border: '1px solid var(--brand-amber-500)', marginBottom: '14px' }}>
            <div style={{ fontWeight: 700, color: '#92400e', fontSize: '0.9rem' }}>
              {analytics.peakHour}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#b45309', marginTop: '2px' }}>
              পিক সময়ে অতিরিক্ত অ্যাসিস্ট্যান্ট নিয়োজিত রাখার পরামর্শ দেওয়া হচ্ছে।
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span>সকাল ৯:০০ - দুপুর ১:০০ (প্যাথলজি স্যাম্পল)</span>
                <strong>২৮%</strong>
              </div>
              <div style={{ height: '8px', background: 'var(--slate-200)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '28%', height: '100%', background: 'var(--brand-teal-500)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span>বিকেল ৪:০০ - রাত ৮:৩০ (ডাক্তার চেম্বার)</span>
                <strong style={{ color: 'var(--brand-teal-600)' }}>৬৪% (শীর্ষ)</strong>
              </div>
              <div style={{ height: '8px', background: 'var(--slate-200)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '64%', height: '100%', background: 'var(--brand-teal-600)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top Doctors & Tests */}
        <div className="portal-card">
          <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--brand-navy-900)', marginBottom: '12px' }}>
            🏆 শীর্ষ পারফর্মার (Top Specialists & Tests)
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: 'var(--slate-50)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase' }}>
                শীর্ষ কনসালট্যান্ট
              </div>
              <div style={{ fontWeight: 800, color: 'var(--brand-navy-900)', fontSize: '0.92rem', marginTop: '2px' }}>
                {analytics.topDoctor}
              </div>
            </div>

            <div style={{ background: 'var(--slate-50)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase' }}>
                সর্বাধিক বুক করা প্যাথলজি পরীক্ষা
              </div>
              <div style={{ fontWeight: 800, color: 'var(--brand-navy-900)', fontSize: '0.92rem', marginTop: '2px' }}>
                {analytics.topTest}
              </div>
            </div>

            <div style={{ background: 'var(--brand-teal-50)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--brand-teal-500)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--brand-teal-600)', fontWeight: 700, textTransform: 'uppercase' }}>
                রোগী পুনরাবৃত্তি হার (Repeat Patients)
              </div>
              <div style={{ fontWeight: 800, color: 'var(--brand-navy-900)', fontSize: '0.92rem', marginTop: '2px' }}>
                {analytics.repeatPatients} জন নিয়মিত রোগী ({Math.round((analytics.repeatPatients / analytics.uniquePatients) * 100)}%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
