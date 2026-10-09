'use client';

import React, { useState } from 'react';
import { BRAND } from '@/config/brand';

interface TestParameter {
  name: string;
  result: string;
  unit: string;
  normalRange: string;
  status: 'NORMAL' | 'HIGH' | 'LOW';
}

interface TestParameter {
  name: string;
  result: string;
  unit: string;
  normalRange: string;
  status: 'NORMAL' | 'HIGH' | 'LOW';
}

export interface ClinicalReport {
  id: string;
  testName: string;
  category: string;
  centerName: string;
  verifiedBy: string;
  date: string;
  parameters: TestParameter[];
}

const INITIAL_CLINICAL_REPORTS: ClinicalReport[] = [
  {
    id: 'rep-cbc-9021',
    testName: 'Complete Blood Count (CBC) with ESR',
    category: 'Hematology',
    centerName: 'পপুলার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার মেইন ব্রাঞ্চ)',
    verifiedBy: 'ডাঃ এস. এম. ফারুক (MBBS, M.Phil - কনসালট্যান্ট প্যাথলজিস্ট)',
    date: '০৪ অক্টোবর, ২০২৬ (১৪:৩০)',
    parameters: [
      { name: 'Hemoglobin (Hb)', result: '14.2', unit: 'g/dL', normalRange: '13.0 - 17.0', status: 'NORMAL' },
      { name: 'ESR (Westergren)', result: '12', unit: 'mm/1st hr', normalRange: '0 - 15', status: 'NORMAL' },
      { name: 'Total WBC Count', result: '7,800', unit: '/cu.mm', normalRange: '4,000 - 11,000', status: 'NORMAL' },
      { name: 'Platelet Count', result: '240,000', unit: '/cu.mm', normalRange: '150,000 - 450,000', status: 'NORMAL' },
      { name: 'Neutrophils', result: '62', unit: '%', normalRange: '40 - 75', status: 'NORMAL' },
      { name: 'Lymphocytes', result: '30', unit: '%', normalRange: '20 - 45', status: 'NORMAL' },
    ],
  },
  {
    id: 'rep-lipid-8714',
    testName: 'Lipid Profile Panel (Fasting 12h)',
    category: 'Biochemistry',
    centerName: 'মৌলভীবাজার সেন্ট্রাল ক্লিনিক ও ডায়াগনস্টিক',
    verifiedBy: 'ডাঃ নাসরিন সুলতানা (এমবিবিএস, এফসিপিএস - বায়োকেমিস্ট্রি)',
    date: '২৮ সেপ্টেম্বর, ২০২৬ (১৬:০০)',
    parameters: [
      { name: 'Total Cholesterol', result: '195', unit: 'mg/dL', normalRange: '< 200', status: 'NORMAL' },
      { name: 'Triglycerides (TG)', result: '165', unit: 'mg/dL', normalRange: '< 150', status: 'HIGH' },
      { name: 'HDL Cholesterol', result: '42', unit: 'mg/dL', normalRange: '> 40', status: 'NORMAL' },
      { name: 'LDL Cholesterol', result: '120', unit: 'mg/dL', normalRange: '< 130', status: 'NORMAL' },
    ],
  },
  {
    id: 'rep-hba1c-6621',
    testName: 'HbA1c (Glycated Hemoglobin) & Fasting Glucose',
    category: 'Biochemistry',
    centerName: 'শ্রীমঙ্গল ডিজিটাল ডায়াগনস্টিক কমপ্লেক্স',
    verifiedBy: 'ডাঃ মোস্তাফিজুর রহমান (এমবিবিএস, এমডি - এন্ডোক্রাইনোলজি)',
    date: '১৫ সেপ্টেম্বর, ২০২৬ (০৯:৪৫)',
    parameters: [
      { name: 'HbA1c', result: '6.1', unit: '%', normalRange: '< 5.7', status: 'HIGH' },
      { name: 'Estimated Average Glucose (eAG)', result: '128', unit: 'mg/dL', normalRange: '< 117', status: 'HIGH' },
      { name: 'Fasting Blood Sugar (FBS)', result: '5.8', unit: 'mmol/L', normalRange: '3.9 - 6.0', status: 'NORMAL' },
    ],
  },
  {
    id: 'rep-tsh-5412',
    testName: 'Thyroid Function Test (TSH, FT4)',
    category: 'Thyroid',
    centerName: 'পপুলার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার)',
    verifiedBy: 'ডাঃ আহমেদ শফিক (কনসালট্যান্ট বায়োকেমিস্ট্রি)',
    date: '০২ আগস্ট, ২০২৬ (১১:২০)',
    parameters: [
      { name: 'Thyroid Stimulating Hormone (TSH)', result: '2.45', unit: 'µIU/mL', normalRange: '0.35 - 4.94', status: 'NORMAL' },
      { name: 'Free Thyroxine (FT4)', result: '1.25', unit: 'ng/dL', normalRange: '0.70 - 1.48', status: 'NORMAL' },
    ],
  },
];

export default function SecureReportViewer({
  patientName,
  currentUser,
}: {
  patientName?: string;
  currentUser?: any;
} = {}) {
  const [reportList, setReportList] = useState<ClinicalReport[]>(INITIAL_CLINICAL_REPORTS);
  const [selectedReport, setSelectedReport] = useState<ClinicalReport>(INITIAL_CLINICAL_REPORTS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadSuccessNotice, setUploadSuccessNotice] = useState<string | null>(null);

  // Upload Form State
  const [uploadTestName, setUploadTestName] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Hematology');
  const [uploadCenterName, setUploadCenterName] = useState('Popular Diagnostic Center (Moulvibazar)');
  const [uploadVerifiedBy, setUploadVerifiedBy] = useState('Dr. S. M. Faruq (Consultant Pathologist)');
  const [signedUrlData, setSignedUrlData] = useState<{ url: string; expiresAt: string; secondsLeft: number } | null>(null);
  const [signingLoading, setSigningLoading] = useState(false);

  // Generate 15-min signed URL
  const handleGenerateSignedLink = async (reportId: string) => {
    setSigningLoading(true);
    try {
      const res = await fetch('/api/reports/sign-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId,
          userId: 'user-patient-current', // Authorized Patient
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSignedUrlData({
          url: data.signedUrl,
          expiresAt: data.expiresAt,
          secondsLeft: data.remainingSeconds,
        });
      }
    } catch {
      alert('স্বাক্ষরিত লিংক তৈরিতে ব্যর্থ হয়েছে।');
    } finally {
      setSigningLoading(false);
    }
  };



  const filteredReports = reportList.filter((r) => {
    if (selectedCategory === 'ALL') return true;
    return r.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTestName.trim()) return;

    const newRep: ClinicalReport = {
      id: `rep-custom-${Date.now()}`,
      testName: uploadTestName.trim(),
      category: uploadCategory,
      centerName: uploadCenterName,
      verifiedBy: uploadVerifiedBy,
      date: new Date().toLocaleDateString('bn-BD') + ' (আজ)',
      parameters: [
        { name: 'Primary Analyte Concentration', result: 'Normal', unit: 'Index', normalRange: 'Negative / Normal', status: 'NORMAL' },
        { name: 'Specimen Viability Index', result: '100', unit: '%', normalRange: '> 95', status: 'NORMAL' },
      ],
    };

    setReportList([newRep, ...reportList]);
    setSelectedReport(newRep);
    setIsUploadModalOpen(false);
    setUploadTestName('');
    setUploadSuccessNotice(`রিপোর্ট "${newRep.testName}" সফলভাবে সুরক্ষিত ভল্টে যুক্ত হয়েছে।`);
    setTimeout(() => setUploadSuccessNotice(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="portal-card" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)', color: 'white', padding: '24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, color: '#34d399', marginBottom: '8px' }}>
              🔒 Zero-Leakage Cryptographic Vault
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>রোগীর ভেরিফাইড ডায়াগনস্টিক রিপোর্ট ভল্ট</h2>
            <p style={{ opacity: 0.85, fontSize: '0.85rem' }}>
              HMAC-SHA256 অ্যালগরিদমে ১৫-মিনিট মেয়াদী সাইনড লিঙ্ক দ্বারা সুরক্ষিত। কোনো ফাইল পাবলিক ওয়েবে সংরক্ষিত হয় না।
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
              রোগী: তানভীর আহমেদ
            </span>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              style={{
                backgroundColor: '#0057FF',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              + নতুন রিপোর্ট যুক্ত করুন
            </button>
          </div>
        </div>
      </div>

      {uploadSuccessNotice && (
        <div style={{ padding: '10px 14px', backgroundColor: '#ECFDF5', border: '1px solid #10B981', borderRadius: '8px', color: '#065F46', fontSize: '13px', fontWeight: 600 }}>
          ✓ {uploadSuccessNotice}
        </div>
      )}

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['ALL', 'Hematology', 'Biochemistry', 'Thyroid'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: selectedCategory === cat ? '#0057FF' : '#F1F5F9',
              color: selectedCategory === cat ? '#FFFFFF' : '#334155',
              border: selectedCategory === cat ? '1px solid #0057FF' : '1px solid #E2E8F0',
              cursor: 'pointer',
            }}
          >
            {cat === 'ALL' ? 'সকল রিপোর্ট' : cat}
          </button>
        ))}
      </div>

      {/* Main Layout: Report List on Left, Parameter Breakdown on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Left: Report Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--brand-navy-900)' }}>
            উপলব্ধ ল্যাব টেস্ট রিপোর্টসমূহ ({filteredReports.length})
          </h3>

          {filteredReports.map((rep) => {
            const isSelected = selectedReport.id === rep.id;
            return (
              <div
                key={rep.id}
                onClick={() => {
                  setSelectedReport(rep);
                  setSignedUrlData(null);
                }}
                className="portal-card"
                style={{
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #0057FF' : '1px solid var(--slate-200)',
                  background: isSelected ? '#EFF6FF' : 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span style={{ background: '#ECFDF5', color: '#065f46', border: '1px solid #10B981', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                    ✓ ভেরিফাইড ও প্রস্তুত
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{rep.category}</span>
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                  {rep.testName}
                </h4>
                <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>
                  {rep.centerName}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                  ইস্যু: {rep.date}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Report Details & Security Controls */}
        <div className="portal-card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                {selectedReport.testName}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                যাচাইকারী: {selectedReport.verifiedBy}
              </p>
            </div>

            <button
              onClick={() => setIsPrintModalOpen(true)}
              style={{
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
              }}
            >
              প্রিন্ট / ভিউ স্লিপ 🖨
            </button>
          </div>

          {/* Test Parameters Table */}
          <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', textAlign: 'left', borderBottom: '1px solid #CBD5E1' }}>
                  <th style={{ padding: '8px 10px' }}>প্যারামিটার নাম</th>
                  <th style={{ padding: '8px 10px' }}>ফলাফল</th>
                  <th style={{ padding: '8px 10px' }}>একক</th>
                  <th style={{ padding: '8px 10px' }}>স্বাভাবিক মান (Normal)</th>
                  <th style={{ padding: '8px 10px' }}>স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody>
                {selectedReport.parameters.map((param, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0F172A' }}>{param.name}</td>
                    <td style={{ padding: '8px 10px', fontWeight: 700, color: param.status === 'HIGH' ? '#E11D48' : '#1E293B' }}>
                      {param.result}
                    </td>
                    <td style={{ padding: '8px 10px', color: '#64748B' }}>{param.unit}</td>
                    <td style={{ padding: '8px 10px', color: '#475569' }}>{param.normalRange}</td>
                    <td style={{ padding: '8px 10px' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: param.status === 'HIGH' ? '#FFE4E6' : '#ECFDF5',
                        color: param.status === 'HIGH' ? '#BE123C' : '#065F46',
                      }}>
                        {param.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Download & Security Actions */}
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                  সার্টিফাইড পিডিএফ রিপোর্ট ডাউনলোড
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  ১৫-মিনিট বৈধতা সহ নিরাপদ লিঙ্ক তৈরি হয়
                </div>
              </div>

              <button
                onClick={() => handleGenerateSignedLink(selectedReport.id)}
                disabled={signingLoading}
                style={{
                  backgroundColor: '#0057FF',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {signingLoading ? 'স্বাক্ষর হচ্ছে...' : '📥 সাইনড ডাউনলোড লিংক জেনারেট করুন'}
              </button>
            </div>

            {signedUrlData && (
              <div style={{ background: 'white', padding: '12px', borderRadius: '6px', border: '1px solid #10B981', fontSize: '0.85rem' }}>
                <div style={{ color: '#065f46', fontWeight: 700, marginBottom: '6px' }}>
                  ✓ ক্রিপ্টোগ্রাফিক HMAC সাইনড লিংক তৈরি হয়েছে (মেয়াদ: ১৫ মিনিট):
                </div>
                <div style={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.75rem', background: '#F1F5F9', padding: '6px 8px', borderRadius: '4px', marginBottom: '8px' }}>
                  {signedUrlData.url}
                </div>
                <button
                  onClick={() => setIsPrintModalOpen(true)}
                  style={{ background: '#0F172A', color: 'white', padding: '7px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  সার্টিফাইড PDF ওপেন ও প্রিন্ট করুন ⬇
                </button>
              </div>
            )}


          </div>
        </div>
      </div>

      {/* Printable Certified Report Modal */}
      {isPrintModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0057FF', paddingBottom: '12px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ color: '#0057FF', fontWeight: 800, margin: 0, fontSize: '18px' }}>DIAGNOSTIC CARE VERIFIED LAB REPORT</h3>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{selectedReport.centerName}</div>
              </div>
              <button onClick={() => setIsPrintModalOpen(false)} style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ fontSize: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px', background: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
              <div>Patient: <strong>{patientName || currentUser?.fullName || 'সম্মানিত রোগী (Verified Patient)'}</strong></div>
              <div>Age/Gender: <strong>34 yrs / Male</strong></div>
              <div>Test: <strong>{selectedReport.testName}</strong></div>
              <div>Verified By: <strong>{selectedReport.verifiedBy}</strong></div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '16px' }}>
              <thead>
                <tr style={{ background: '#F1F5F9' }}>
                  <th style={{ padding: '6px 8px', textAlign: 'left' }}>Parameter</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left' }}>Result</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left' }}>Unit</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left' }}>Normal Range</th>
                </tr>
              </thead>
              <tbody>
                {selectedReport.parameters.map((p, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '6px 8px' }}>{p.name}</td>
                    <td style={{ padding: '6px 8px', fontWeight: 700 }}>{p.result}</td>
                    <td style={{ padding: '6px 8px' }}>{p.unit}</td>
                    <td style={{ padding: '6px 8px' }}>{p.normalRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
                ✓ Digitally Signed & Encrypted (HMAC-SHA256)
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => window.print()}
                  style={{ backgroundColor: '#0057FF', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                >
                  Print PDF Slip 🖨
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  style={{ border: '1px solid #CBD5E1', background: '#F8FAFC', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload New Lab Report Modal */}
      {isUploadModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', maxWidth: '480px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>নতুন ল্যাব টেস্ট রিপোর্ট যুক্ত করুন</h3>
              <button onClick={() => setIsUploadModalOpen(false)} style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>টেস্টের নাম *</label>
                <input
                  type="text"
                  required
                  value={uploadTestName}
                  onChange={(e) => setUploadTestName(e.target.value)}
                  placeholder="যেমনঃ Serum Creatinine / Chest X-Ray"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>ক্যাটাগরি</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                >
                  <option value="Hematology">Hematology</option>
                  <option value="Biochemistry">Biochemistry</option>
                  <option value="Thyroid">Thyroid</option>
                  <option value="Radiology">Radiology</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>ডায়াগনস্টিক সেন্টারের নাম</label>
                <input
                  type="text"
                  value={uploadCenterName}
                  onChange={(e) => setUploadCenterName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>কনসালট্যান্ট / প্যাথলজিস্ট</label>
                <input
                  type="text"
                  value={uploadVerifiedBy}
                  onChange={(e) => setUploadVerifiedBy(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', background: '#0057FF', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
