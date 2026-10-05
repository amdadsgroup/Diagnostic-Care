'use client';

import React from 'react';
import { BRAND } from '@/config/brand';

interface PrescriptionSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription?: any;
}

export default function PrescriptionSlipModal({
  isOpen,
  onClose,
  prescription,
}: PrescriptionSlipModalProps) {
  if (!isOpen) return null;

  const rx = prescription || {
    id: 'rx-2026-001',
    doctorName: 'ডাঃ আনিসুর রহমান (Dr. Anisur Rahman)',
    doctorQualifications: 'এমবিবিএস, বিসিএস (স্বাস্থ্য), এফসিপিএস (কার্ডিওলজি)',
    doctorBmdc: 'BMDC Reg: A-34891',
    doctorTitle: 'হৃদরোগ ও মেডিসিন বিশেষজ্ঞ',
    centerName: 'পপুলার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার মেইন ব্রাঞ্চ)',
    chamberAddress: 'সেন্ট্রাল রোড, চৌমোহনা, মৌলভীবাজার সদর • রুম ২০২',
    patientName: 'তানভীর আহমেদ',
    patientAge: 34,
    patientGender: 'পুরুষ (M)',
    date: '০৫ অক্টোবর, ২০২৬',
    diagnosis: 'Primary Hypertension (Stage 1) with Dyslipidemia',
    vitals: 'BP: 140/90 mmHg • Pulse: 78 bpm • Wt: 72 kg',
    medicines: [
      { name: 'Tab. Concor (Bisoprolol)', strength: '2.5 mg', dose: '1 + 0 + 0', meal: 'সকালে খাবারের পর', days: '৩০ দিন' },
      { name: 'Tab. Rosuva (Rosuvastatin)', strength: '10 mg', dose: '0 + 0 + 1', meal: 'রাতে খাবারের পর', days: '৩০ দিন' },
      { name: 'Tab. Nexum (Esomeprazole)', strength: '20 mg', dose: '1 + 0 + 1', meal: 'খাবারের ২০ মিনিট আগে', days: '১৪ দিন' },
    ],
    tests: ['Lipid Profile (Fasting 12h)', 'Serum Creatinine', 'ECG (12-Lead)'],
    advice: 'প্রতিদিন সকালে ৩০ মিনিট হাঁটবেন। খাবারে কাঁচা লবণ খাবেন না। চর্বিযুক্ত ও অতিরিক্ত তেলযুক্ত খাবার পরিহার করবেন।',
    followup: '১৯ অক্টোবর, ২০২৬ (১৪ দিন পর রক্তচাপ মেপে আসবেন)',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-container-wide" style={{ maxWidth: '780px', background: '#FFFFFF' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: 'var(--brand-navy-900)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700 }}>
            <span>📝</span> ডিজিটাল ই-প্রেসক্রিপশন (e-Prescription Slip)
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => window.print()}
              style={{ background: 'var(--brand-teal-500)', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}
            >
              🖨 প্রিন্ট / PDF সংরক্ষণ
            </button>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Printable Prescription Body */}
        <div style={{ padding: '28px', color: 'var(--slate-900)', fontFamily: 'sans-serif' }}>
          {/* Clinic & Doctor Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--brand-navy-900)', paddingBottom: '16px', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-navy-900)', lineHeight: 1.2 }}>
                {rx.doctorName}
              </h2>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-teal-600)', marginTop: '2px' }}>
                {rx.doctorQualifications}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                {rx.doctorTitle} • <strong style={{ color: 'var(--brand-navy-900)' }}>{rx.doctorBmdc}</strong>
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--brand-navy-900)' }}>
                {rx.centerName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                {rx.chamberAddress}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--brand-teal-600)', fontWeight: 600, marginTop: '2px' }}>
                হেল্পলাইন: {BRAND.helpline}
              </div>
            </div>
          </div>

          {/* Patient Details Ribbon */}
          <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--slate-50)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--slate-200)', fontSize: '0.85rem', marginBottom: '20px' }}>
            <div>রোগীর নাম: <strong>{rx.patientName}</strong></div>
            <div>বয়স: <strong>{rx.patientAge} বছর</strong></div>
            <div>লিঙ্গ: <strong>{rx.patientGender}</strong></div>
            <div>তারিখ: <strong>{rx.date}</strong></div>
          </div>

          {/* Clinical Layout: Left Vitals/Tests, Right Rx Medicines */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '20px', minHeight: '380px' }}>
            {/* Left Column: Vitals, Diagnosis, Tests */}
            <div style={{ borderRight: '1px solid var(--slate-200)', paddingRight: '16px' }}>
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                  শারীরিক লক্ষণ (Vitals)
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--slate-800)', marginTop: '2px' }}>
                  {rx.vitals}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                  রোগ নির্ণয় (Diagnosis)
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-navy-900)', marginTop: '2px' }}>
                  {rx.diagnosis}
                </div>
              </div>

              {rx.tests && rx.tests.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    প্রস্তাবিত পরীক্ষা (Tests)
                  </div>
                  <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', color: 'var(--slate-700)', lineHeight: 1.6 }}>
                    {rx.tests.map((t: string, i: number) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column: Rx Table */}
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'serif', color: 'var(--brand-navy-900)', marginBottom: '8px' }}>
                ℞
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {rx.medicines.map((m: any, i: number) => (
                  <div key={i} style={{ borderBottom: '1px dashed var(--slate-200)', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--brand-navy-900)' }}>
                        {i + 1}. {m.name}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)' }}>
                        {m.days}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--slate-700)', marginTop: '4px' }}>
                      <span style={{ color: 'var(--brand-teal-600)', fontWeight: 700 }}>
                        ডোজ: {m.dose}
                      </span>
                      <span>({m.meal})</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Advice */}
              <div style={{ marginTop: '24px', background: 'var(--slate-50)', padding: '12px', borderRadius: '6px', border: '1px solid var(--slate-200)', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--brand-navy-900)', marginBottom: '4px' }}>
                  পরামর্শ ও নিয়মাবলী (Advice):
                </div>
                <div style={{ color: 'var(--slate-700)', lineHeight: 1.5 }}>
                  {rx.advice}
                </div>
                <div style={{ marginTop: '8px', color: 'var(--brand-teal-600)', fontWeight: 700 }}>
                  পরবর্তী সাক্ষাতের সময়: {rx.followup}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Signature */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '30px', paddingTop: '16px', borderTop: '1px solid var(--slate-200)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
              Diagnostic Care Verified e-Prescription • প্রেসক্রিপশন আইডি: {rx.id}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontStyle: 'italic', fontWeight: 700, color: 'var(--brand-navy-900)', borderBottom: '1px solid var(--slate-400)', paddingBottom: '2px', minWidth: '140px' }}>
                Dr. Anisur Rahman
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                অনুমোদিত চিকিৎসকের ডিজিটাল স্বাক্ষর
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
