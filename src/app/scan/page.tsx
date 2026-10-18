'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { QRScannerModal } from '@/components/qr/QRScannerModal';
import { useLanguage } from '@/context/LanguageContext';
import { BRAND_COLORS } from '@/config/brand';
import { QrCode, Camera, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ScanPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [isScannerOpen, setIsScannerOpen] = useState(true);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Header activeTab="discover" setActiveTab={() => {}} />

      <main style={{ flex: 1, padding: '40px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            maxWidth: '520px',
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
            padding: '32px 24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#EFF6FF',
              color: BRAND_COLORS.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}
          >
            <QrCode size={28} />
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            {language === 'en' ? 'Healthcare QR Scanner' : 'স্বাস্থ্যসেবা কিউআর স্ক্যানার'}
          </h1>

          <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
            {language === 'en'
              ? 'Scan any Diagnostic Care doctor, hospital, or diagnostic center QR code from a prescription, visiting card, or poster to view instant verified chamber details and book appointments.'
              : 'প্রেসক্রিপশন, ভিজিটিং কার্ড বা চেম্বার পোস্টারের কিউআর কোড স্ক্যান করে সরাসরি অভিজ্ঞ ডাক্তারের সিরিয়াল নিন এবং টেস্ট বুক করুন।'}
          </p>

          <button
            onClick={() => setIsScannerOpen(true)}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '12px 20px',
              fontSize: '15px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '12px',
              cursor: 'pointer',
            }}
          >
            <Camera size={18} />
            <span>{language === 'en' ? 'Open Camera Scanner' : 'ক্যামেরা স্ক্যানার খুলুন'}</span>
            <ArrowRight size={16} />
          </button>

          <div
            style={{
              marginTop: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '11.5px',
              color: '#64748B',
            }}
          >
            <ShieldCheck size={14} color="#15803D" />
            <span>{language === 'en' ? 'BMDC verified profiles & secure booking' : 'বিএমডিসি ভেরিফাইড প্রোফাইল ও নিরাপদ বুকিং'}</span>
          </div>
        </div>
      </main>

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={(destination) => {
          setIsScannerOpen(false);
          router.push(destination);
        }}
      />

      <Footer />
    </div>
  );
}
