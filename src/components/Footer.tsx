import React from 'react';
import Image from 'next/image';
import { BRAND_CONSTANTS, SupportedLanguage } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import { Phone, MapPin, Mail, ShieldAlert, Heart, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC<{ language: SupportedLanguage }> = ({ language }) => {
  const t = TRANSLATIONS[language];

  return (
    <footer style={{ backgroundColor: 'var(--brand-navy-900)', color: '#FFFFFF', marginTop: '64px', borderTop: '1px solid var(--slate-800)' }}>
      {/* Upper Helpline Highlight Section */}
      <div style={{ backgroundColor: 'var(--brand-navy-800)', padding: '24px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={20} color="#38BDF8" />
              <span>Need help booking a doctor or diagnostic test?</span>
            </div>
            <div style={{ color: 'var(--slate-300)', fontSize: '14px', marginTop: '4px' }}>
              Our dedicated Bangladesh healthcare operations team in Moulvibazar is here to assist you 24/7.
            </div>
          </div>

          <a
            href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
            id="footer-call-helpline-cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#0284C7',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '16px',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
            }}
          >
            <Phone size={18} />
            <span>Call Customer Care: {BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}</span>
          </a>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '48px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
        {/* Brand Information */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', position: 'relative', borderRadius: '6px', overflow: 'hidden' }}>
              <Image src="/logo.png" alt="Diagnostic Care" fill style={{ objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800 }}>{BRAND_CONSTANTS.BRAND_NAME}</div>
              <div style={{ fontSize: '11px', color: 'var(--brand-teal-500)', fontWeight: 500, letterSpacing: '0.04em' }}>
                {BRAND_CONSTANTS.TAGLINE}
              </div>
            </div>
          </div>
          <p style={{ color: 'var(--slate-300)', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>
            A unified digital healthcare marketplace and provider infrastructure. Connecting patients with verified diagnostic centers, specialist consultants, and pathology services across Bangladesh.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--slate-400)', fontSize: '13px' }}>
            <MapPin size={14} color="#38BDF8" />
            <span>Launch Operations: {BRAND_CONSTANTS.HQ_ADDRESS}</span>
          </div>
        </div>

        {/* Marketplace Categories */}
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Healthcare Services
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--slate-300)' }}>
            <li>Specialist Doctor Chambers (Moulvibazar)</li>
            <li>Hematology & Blood Testing (CBC, ESR)</li>
            <li>Cardiology Consultations & ECG/Echo</li>
            <li>Radiology & 4D Ultrasonography (USG)</li>
            <li>Diabetes Glycemic Monitoring (HbA1c)</li>
            <li>Home Sample Collection Services</li>
          </ul>
        </div>

        {/* Verified Hubs */}
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Operational Coverage
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--slate-300)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color="#10B981" />
              <strong>Moulvibazar Sadar (Initial Hub)</strong>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color="#10B981" />
              <span>Sreemangal & Kamalganj</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color="#10B981" />
              <span>Kulaura, Barlekha & Juri</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--slate-400)' }}>
              <span>Sylhet, Habiganj & Sunamganj (Phase 9)</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--slate-400)' }}>
              <span>Nationwide Bangladesh (Phase 10)</span>
            </li>
          </ul>
        </div>

        {/* Medical Notice & Helpline */}
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Emergency & Contact
          </h4>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '14px' }}>
            <div style={{ fontSize: '13px', color: 'var(--slate-300)', lineHeight: 1.5 }}>
              <strong style={{ color: '#FCD34D', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <ShieldAlert size={14} /> Medical Notice:
              </strong>
              Diagnostic Care facilitates appointment scheduling and digital test delivery. In case of acute medical emergencies, please visit the nearest hospital emergency room.
            </div>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--slate-300)' }}>
            Customer Support: <strong>{BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}</strong>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', padding: '20px 0', fontSize: '12px', color: 'var(--slate-400)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            © {BRAND_CONSTANTS.COPYRIGHT_YEAR} {BRAND_CONSTANTS.BRAND_NAME} ({BRAND_CONSTANTS.TAGLINE}). All rights reserved.
          </div>
          <div>
            Engineered for Bangladesh Healthcare Infrastructure • ISO & Data Privacy Standards Compliant
          </div>
        </div>
      </div>
    </footer>
  );
};
