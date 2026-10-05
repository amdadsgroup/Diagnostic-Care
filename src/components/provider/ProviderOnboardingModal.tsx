'use client';

import React, { useState } from 'react';
import { BRAND } from '@/config/brand';

interface ProviderOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (orgData: { name: string; orgType: string; phone: string }) => void;
}

const DIVISIONS = [
  { id: 'div-1', nameEn: 'Sylhet', nameBn: 'সিলেট' },
  { id: 'div-2', nameEn: 'Dhaka', nameBn: 'ঢাকা' },
  { id: 'div-3', nameEn: 'Chittagong', nameBn: 'চট্টগ্রাম' },
];

const DISTRICTS_BY_DIV: Record<string, { id: string; nameEn: string; nameBn: string }[]> = {
  'div-1': [
    { id: 'dist-1', nameEn: 'Moulvibazar', nameBn: 'মৌলভীবাজার' },
    { id: 'dist-2', nameEn: 'Sylhet', nameBn: 'সিলেট' },
    { id: 'dist-3', nameEn: 'Habiganj', nameBn: 'হবিগঞ্জ' },
    { id: 'dist-4', nameEn: 'Sunamganj', nameBn: 'সুনামগঞ্জ' },
  ],
  'div-2': [
    { id: 'dist-5', nameEn: 'Dhaka', nameBn: 'ঢাকা' },
    { id: 'dist-6', nameEn: 'Gazipur', nameBn: 'গাজীপুর' },
  ],
  'div-3': [
    { id: 'dist-7', nameEn: 'Chittagong', nameBn: 'চট্টগ্রাম' },
    { id: 'dist-8', nameEn: "Cox's Bazar", nameBn: 'কক্সবাজার' },
  ],
};

const UPAZILAS_BY_DIST: Record<string, { id: string; nameEn: string; nameBn: string }[]> = {
  'dist-1': [
    { id: 'upz-1', nameEn: 'Moulvibazar Sadar', nameBn: 'মৌলভীবাজার সদর' },
    { id: 'upz-2', nameEn: 'Sreemangal', nameBn: 'শ্রীমঙ্গল' },
    { id: 'upz-3', nameEn: 'Kamalganj', nameBn: 'কমলগঞ্জ' },
    { id: 'upz-4', nameEn: 'Kulaura', nameBn: 'কুলাউড়া' },
    { id: 'upz-5', nameEn: 'Rajnagar', nameBn: 'রাজনগর' },
    { id: 'upz-6', nameEn: 'Barlekha', nameBn: 'বড়লেখা' },
    { id: 'upz-7', nameEn: 'Juri', nameBn: 'জুড়ী' },
  ],
  'dist-2': [
    { id: 'upz-8', nameEn: 'Sylhet Sadar', nameBn: 'সিলেট সদর' },
    { id: 'upz-9', nameEn: 'Beanibazar', nameBn: 'বিয়ানীবাজার' },
    { id: 'upz-10', nameEn: 'Golapganj', nameBn: 'গোলাপগঞ্জ' },
  ],
};

export default function ProviderOnboardingModal({ isOpen, onClose, onSuccess }: ProviderOnboardingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('DIAGNOSTIC_CENTER');
  const [tradeLicense, setTradeLicense] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  // Location / Branch
  const [division, setDivision] = useState('div-1'); // Default Sylhet
  const [district, setDistrict] = useState('dist-1'); // Default Moulvibazar
  const [upazila, setUpazila] = useState('upz-1'); // Default Moulvibazar Sadar
  const [addressLine, setAddressLine] = useState('');
  const [openingTime, setOpeningTime] = useState('08:00');
  const [closingTime, setClosingTime] = useState('22:00');

  // Admin User
  const [adminName, setAdminName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Document Upload
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 4) setStep((step + 1) as 1 | 2 | 3 | 4);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as 1 | 2 | 3 | 4);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    onSuccess?.({ name: orgName, orgType, phone: contactPhone });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileUploaded(true);
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-container-wide" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="auth-brand">
            <span className="auth-brand-icon">🏥</span>
            <div>
              <div className="auth-brand-name">স্বাস্থ্যসেবা প্রদানকারী নিবন্ধন (Provider Onboarding)</div>
              <div className="auth-brand-tagline">
                {BRAND.name} পার্টনার নেটওয়ার্কে যুক্ত হয়ে ডিজিটাল স্বাস্থ্যসেবা দিন
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Wizard Progress */}
        <div style={{ padding: '20px 24px 0 24px', background: 'var(--slate-50)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="wizard-progress">
            <div className={`wizard-step-node ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="wizard-node-circle">{step > 1 ? '✓' : '1'}</div>
              <span className="wizard-node-label">প্রতিষ্ঠান তথ্য</span>
            </div>
            <div style={{ flex: 1, height: '2px', background: step > 1 ? 'var(--brand-emerald-500)' : 'var(--slate-300)', margin: '0 8px', marginBottom: '20px' }} />
            
            <div className={`wizard-step-node ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="wizard-node-circle">{step > 2 ? '✓' : '2'}</div>
              <span className="wizard-node-label">শাখা ও অবস্থান</span>
            </div>
            <div style={{ flex: 1, height: '2px', background: step > 2 ? 'var(--brand-emerald-500)' : 'var(--slate-300)', margin: '0 8px', marginBottom: '20px' }} />

            <div className={`wizard-step-node ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
              <div className="wizard-node-circle">{step > 3 ? '✓' : '3'}</div>
              <span className="wizard-node-label">প্রশাসক তথ্য</span>
            </div>
            <div style={{ flex: 1, height: '2px', background: step > 3 ? 'var(--brand-emerald-500)' : 'var(--slate-300)', margin: '0 8px', marginBottom: '20px' }} />

            <div className={`wizard-step-node ${step >= 4 ? 'active' : ''}`}>
              <div className="wizard-node-circle">4</div>
              <span className="wizard-node-label">যাচাইকরণ নথি</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <div style={{ fontSize: '3rem', color: 'var(--brand-emerald-500)', marginBottom: '12px' }}>✓</div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                আবেদন সফলভাবে গৃহীত হয়েছে!
              </h2>
              <p style={{ color: 'var(--slate-600)', margin: '12px 0 24px 0', lineHeight: 1.6, maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                ধন্যবাদ <strong>{orgName || 'আপনার প্রতিষ্ঠান'}</strong>। আমাদের টিম ট্রেড লাইসেন্স ও DGHS তথ্য যাচাই করে আগামী ১২-২৪ ঘণ্টার মধ্যে অ্যাকাউন্ট সক্রিয় করবে। জরুরি প্রয়োজনে যোগাযোগ করুন <strong>{BRAND.helpline}</strong> নম্বরে।
              </p>
              <div style={{ display: 'inline-flex', gap: '12px' }}>
                <button className="btn-primary" onClick={onClose}>
                  ড্যাশবোর্ডে ফিরুন
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: ORGANIZATION DETAILS */}
              {step === 1 && (
                <div className="auth-form">
                  <div className="auth-field">
                    <label>প্রতিষ্ঠানের ধরণ *</label>
                    <select value={orgType} onChange={(e) => setOrgType(e.target.value)}>
                      <option value="DIAGNOSTIC_CENTER">ডায়াগনস্টিক সেন্টার (Diagnostic Center)</option>
                      <option value="CLINIC">ক্লিনিক ও কনসালটেশন সেন্টার (Clinic)</option>
                      <option value="HOSPITAL">হাসপাতাল (Hospital)</option>
                      <option value="PHARMACY">ফার্মেসি (Pharmacy)</option>
                      <option value="AMBULANCE_AGENCY">অ্যাম্বুলেন্স সার্ভিস (Ambulance Service)</option>
                    </select>
                  </div>

                  <div className="auth-field">
                    <label>প্রতিষ্ঠানের নাম *</label>
                    <input
                      type="text"
                      placeholder="যেমন: মৌলভীবাজার ডিজিটাল ডায়াগনস্টিক কমপ্লেক্স"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <label>ট্রেড লাইসেন্স / DGHS রেজিস্ট্রেশন নম্বর *</label>
                    <input
                      type="text"
                      placeholder="TRAD/MB/2026/0984"
                      value={tradeLicense}
                      onChange={(e) => setTradeLicense(e.target.value)}
                      required
                    />
                  </div>

                  <div className="auth-row">
                    <div className="auth-field">
                      <label>অফিসিয়াল হটলাইন ফোন *</label>
                      <div className="auth-input-group">
                        <span className="auth-input-prefix">🇧🇩 +880</span>
                        <input
                          type="tel"
                          placeholder="01XXXXXXXXX"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          maxLength={11}
                          required
                        />
                      </div>
                    </div>
                    <div className="auth-field">
                      <label>অফিসিয়াল ইমেইল (ঐচ্ছিক)</label>
                      <input
                        type="email"
                        placeholder="info@diagnostic.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: BRANCH & GEOGRAPHY */}
              {step === 2 && (
                <div className="auth-form">
                  <div style={{ background: 'var(--brand-teal-50)', padding: '12px', borderRadius: '8px', border: '1px solid var(--brand-teal-500)', fontSize: '0.85rem', color: 'var(--brand-navy-900)' }}>
                    📍 প্রাথমিক লঞ্চিং অঞ্চল: <strong>মৌলভীবাজার ও সিলেট বিভাগ</strong>। দেশব্যাপী অন্যান্য বিভাগেও নিবন্ধন চালু রয়েছে।
                  </div>

                  <div className="auth-row">
                    <div className="auth-field">
                      <label>বিভাগ *</label>
                      <select value={division} onChange={(e) => {
                        setDivision(e.target.value);
                        const dists = DISTRICTS_BY_DIV[e.target.value] || [];
                        if (dists.length > 0) setDistrict(dists[0].id);
                      }}>
                        {DIVISIONS.map((d) => (
                          <option key={d.id} value={d.id}>{d.nameBn} ({d.nameEn})</option>
                        ))}
                      </select>
                    </div>

                    <div className="auth-field">
                      <label>জেলা *</label>
                      <select value={district} onChange={(e) => {
                        setDistrict(e.target.value);
                        const upzs = UPAZILAS_BY_DIST[e.target.value] || [];
                        if (upzs.length > 0) setUpazila(upzs[0].id);
                      }}>
                        {(DISTRICTS_BY_DIV[division] || []).map((dt) => (
                          <option key={dt.id} value={dt.id}>{dt.nameBn} ({dt.nameEn})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="auth-field">
                    <label>উপজেলা / থানা *</label>
                    <select value={upazila} onChange={(e) => setUpazila(e.target.value)}>
                      {(UPAZILAS_BY_DIST[district] || [
                        { id: 'upz-gen', nameEn: 'Sadar', nameBn: 'সদর' }
                      ]).map((u) => (
                        <option key={u.id} value={u.id}>{u.nameBn} ({u.nameEn})</option>
                      ))}
                    </select>
                  </div>

                  <div className="auth-field">
                    <label>প্রধান শাখার সম্পূর্ণ ঠিকানা *</label>
                    <textarea
                      rows={2}
                      placeholder="রোড নং, এলাকা, ল্যান্ডমার্ক (যেমন: সেন্ট্রাল রোড, চৌমোহনা, মৌলভীবাজার)"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      required
                    />
                  </div>

                  <div className="auth-row">
                    <div className="auth-field">
                      <label>কার্যক্রম শুরু (Opening Time)</label>
                      <input
                        type="time"
                        value={openingTime}
                        onChange={(e) => setOpeningTime(e.target.value)}
                      />
                    </div>
                    <div className="auth-field">
                      <label>কার্যক্রম সমাপ্তি (Closing Time)</label>
                      <input
                        type="time"
                        value={closingTime}
                        onChange={(e) => setClosingTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: ADMIN ACCOUNT */}
              {step === 3 && (
                <div className="auth-form">
                  <div style={{ background: 'var(--slate-50)', padding: '12px', borderRadius: '8px', border: '1px solid var(--slate-200)', fontSize: '0.85rem' }}>
                    🔐 এই অ্যাকাউন্টটি প্রধান প্রশাসক (Organization Admin) হিসেবে কাজ করবে। এর মাধ্যমে আপনি ডাক্তার অ্যাসাইন, টেস্ট প্রাইসিং ও রিপোর্ট ম্যানেজ করবেন।
                  </div>

                  <div className="auth-field">
                    <label>প্রশাসকের পূর্ণ নাম *</label>
                    <input
                      type="text"
                      placeholder="যেমন: এম. এ. রহমান"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <label>প্রশাসকের লগইন মোবাইল নম্বর *</label>
                    <div className="auth-input-group">
                      <span className="auth-input-prefix">🇧🇩 +880</span>
                      <input
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        maxLength={11}
                        required
                      />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label>গোপন পাসওয়ার্ড তৈরি করুন *</label>
                    <input
                      type="password"
                      placeholder="ন্যূনতম ৮ অক্ষর"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: VERIFICATION DOCUMENTS */}
              {step === 4 && (
                <div className="auth-form">
                  <div style={{ background: 'var(--brand-amber-50)', padding: '12px', borderRadius: '8px', border: '1px solid var(--brand-amber-500)', fontSize: '0.85rem', color: '#92400e' }}>
                    📋 যাচাইকরণের জন্য আপনার প্রতিষ্ঠানের ট্রেড লাইসেন্স অথবা স্বাস্থ্য অধিদপ্তরের (DGHS) অনুমোদনপত্রের স্পষ্ট স্ক্যান বা ছবি আপলোড করুন।
                  </div>

                  <div style={{
                    border: '2px dashed var(--slate-300)',
                    padding: '28px 16px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    background: fileUploaded ? 'var(--brand-emerald-50)' : 'var(--slate-50)',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="file"
                      id="doc-upload"
                      style={{ display: 'none' }}
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="doc-upload" style={{ cursor: 'pointer' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                        {fileUploaded ? '📄' : '📁'}
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--brand-navy-900)' }}>
                        {fileUploaded ? fileName : 'ট্রেড লাইসেন্স বা DGHS নথি আপলোড করুন'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '4px' }}>
                        {fileUploaded ? '✓ নথি সংযুক্ত হয়েছে (পরিবর্তন করতে পুনরায় ক্লিক করুন)' : 'PDF, JPG বা PNG ফরম্যাটে সর্বোচ্চ ১০ এমবি'}
                      </div>
                    </label>
                  </div>

                  <div className="auth-terms" style={{ marginTop: '8px' }}>
                    <label>
                      <input type="checkbox" required defaultChecked />
                      {' '}আমি অঙ্গীকার করছি যে প্রদত্ত সমস্ত তথ্য সত্য এবং {BRAND.name}-এর বি২বি সার্ভিস টার্মস মেনে চলব।
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--slate-200)' }}>
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    style={{ padding: '10px 18px', border: '1px solid var(--slate-300)', borderRadius: '8px', fontWeight: 600, color: 'var(--slate-700)' }}
                  >
                    ← পূর্ববর্তী ধাপ
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleNext}
                  >
                    পরবর্তী ধাপ →
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ background: 'var(--brand-emerald-500)' }}
                  >
                    {loading ? 'প্রসেসিং হচ্ছে...' : 'অনবোর্ডিং আবেদন জমা দিন ✓'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
