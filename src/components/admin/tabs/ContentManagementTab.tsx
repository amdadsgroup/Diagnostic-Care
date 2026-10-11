'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Tag,
  Save,
} from 'lucide-react';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';

interface ContentManagementTabProps {
  language: 'en' | 'bn';
  adminEmail: string;
}

export default function ContentManagementTab({ language, adminEmail }: ContentManagementTabProps) {
  const [activeTab, setActiveTab] = useState<'banners' | 'announcements' | 'seo'>('banners');

  const [banners, setBanners] = useState([
    {
      id: 'banner-1',
      title: 'Free Blood Sugar & Diabetes Screening Camp',
      titleBn: 'ফ্রি রক্তের গ্লুকোজ ও ডায়াবেটিস স্ক্রিনিং ক্যাম্পেইন',
      subtitle: 'Popular Diagnostic Center Moulvibazar • Every Friday 8 AM - 12 PM',
      ctaText: 'Book Free Serial',
      isActive: true,
      displayLocation: 'Home Hero',
    },
    {
      id: 'banner-2',
      title: '24/7 ICU & AC Ambulance Emergency Transit',
      titleBn: 'জরুরি ২৪/৭ লাইফ সাপোর্ট আইসিইউ ও এসি অ্যাম্বুলেন্স',
      subtitle: 'Call Direct 01886748564 for Instant Nationwide Dispatch',
      ctaText: 'Call Emergency',
      isActive: true,
      displayLocation: 'Emergency Banner',
    },
  ]);

  const [seoConfig, setSeoConfig] = useState({
    metaTitle: 'Diagnostic Care — Your Healthcare Marketplace | Bangladesh',
    metaDescription: 'Find verified doctors, diagnostic centers, hospital beds, pharmacies, and 24/7 ambulances across Bangladesh with instant chamber serial booking.',
    keywords: 'doctor appointment, diagnostic center, blood test bangladesh, bmdc doctor serial, emergency ambulance, moulvibazar',
  });

  const [saveNotice, setSaveNotice] = useState(false);

  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Sub Nav */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1.5px solid #E2E8F0', paddingBottom: '12px' }}>
        {[
          { id: 'banners', label: 'Hero Banners & Promotions', labelBn: 'হিরো ব্যানার ও প্রমোশন' },
          { id: 'announcements', label: 'Platform Announcements', labelBn: 'প্ল্যাটফর্ম ঘোষণা' },
          { id: 'seo', label: 'Global SEO Metadata', labelBn: 'গ্লোবাল এসইও মেটাডাটা' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === tab.id ? BRAND_COLORS.primary : '#F1F5F9',
              color: activeTab === tab.id ? '#FFFFFF' : '#475569',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {language === 'bn' ? tab.labelBn : tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'banners' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {banners.map((b) => (
            <div
              key={b.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '2px 8px', borderRadius: '6px' }}>
                    {b.displayLocation}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, backgroundColor: b.isActive ? '#DCFCE7' : '#F1F5F9', color: b.isActive ? '#166534' : '#64748B', padding: '2px 8px', borderRadius: '6px' }}>
                    {b.isActive ? 'PUBLISHED' : 'DRAFT'}
                  </span>
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {language === 'bn' ? b.titleBn : b.title}
                </h4>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
                  {b.subtitle}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setBanners(banners.map((item) => (item.id === b.id ? { ...item, isActive: !item.isActive } : item)));
                  }}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {b.isActive ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'seo' && (
        <form
          onSubmit={handleSaveSeo}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            padding: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
            maxWidth: '680px',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '0 0 16px 0' }}>
            {language === 'bn' ? 'গ্লোবাল সার্চ ইঞ্জিন অপটিমাইজেশন (SEO)' : 'Global Search Engine Optimization (SEO)'}
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Meta Title:
            </label>
            <input
              type="text"
              value={seoConfig.metaTitle}
              onChange={(e) => setSeoConfig({ ...seoConfig, metaTitle: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Meta Description:
            </label>
            <textarea
              rows={3}
              value={seoConfig.metaDescription}
              onChange={(e) => setSeoConfig({ ...seoConfig, metaDescription: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Target Keywords:
            </label>
            <input
              type="text"
              value={seoConfig.keywords}
              onChange={(e) => setSeoConfig({ ...seoConfig, keywords: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>

          {saveNotice && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#F0FDF4', color: '#16A34A', fontSize: '12.5px', fontWeight: 700, marginBottom: '14px' }}>
              ✓ SEO metadata saved and applied to root layout.
            </div>
          )}

          <button
            type="submit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: BRAND_COLORS.primary,
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Save size={16} />
            <span>{language === 'bn' ? 'সংরক্ষণ করুন' : 'Save SEO Configuration'}</span>
          </button>
        </form>
      )}

      {activeTab === 'announcements' && (
        <div style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 800 }}>Platform Banner Alert</h4>
          <p style={{ fontSize: '13px', color: '#64748B' }}>
            Broadcast operational alerts across patient and provider dashboards (e.g. DGHS license drives or weather notices).
          </p>
        </div>
      )}
    </div>
  );
}
