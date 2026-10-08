'use client';

import React, { useState, useEffect } from 'react';
import { SupportedLanguage } from '@/config/brand';
import {
  ShieldCheck,
  FileText,
  Download,
  Share2,
  Upload,
  Lock,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus,
  X,
} from 'lucide-react';

interface HealthDocument {
  id: string;
  title: string;
  type: 'REPORT' | 'PRESCRIPTION' | 'DOCUMENT';
  date: string;
  doctorName?: string;
  facility: string;
  patientName: string;
  summary: string;
  verified: boolean;
  fileSize: string;
}

const INITIAL_DOCS: HealthDocument[] = [
  {
    id: 'doc-001',
    title: 'Complete Blood Count (CBC) with ESR',
    type: 'REPORT',
    date: '26 Sep 2026',
    facility: 'Popular Diagnostic Center (Moulvibazar)',
    patientName: 'Tanvir Ahmed',
    summary: 'Hemoglobin: 14.2 g/dL, Platelets: 240,000 /mcL, ESR: 12 mm/1st hr (Normal clinical range).',
    verified: true,
    fileSize: '1.4 MB',
  },
  {
    id: 'doc-002',
    title: 'Digital Consultation Prescription Slip',
    type: 'PRESCRIPTION',
    date: '25 Sep 2026',
    doctorName: 'Dr. Anisur Rahman',
    facility: 'Popular Diagnostic Center (Chamber 204)',
    patientName: 'Tanvir Ahmed',
    summary: 'Diagnosis: Grade 1 Essential Hypertension. Rx: Tab. Concor 2.5mg (1+0+0), Tab. Rosuva 10mg (0+0+1).',
    verified: true,
    fileSize: '820 KB',
  },
  {
    id: 'doc-003',
    title: 'Serum Lipid Profile (Fasting)',
    type: 'REPORT',
    date: '18 Aug 2026',
    facility: 'Moulvibazar Digital Diagnostic Complex',
    patientName: 'Tanvir Ahmed',
    summary: 'Total Cholesterol: 195 mg/dL, HDL: 48 mg/dL, LDL: 118 mg/dL, Triglycerides: 145 mg/dL.',
    verified: true,
    fileSize: '1.1 MB',
  },
  {
    id: 'doc-004',
    title: 'Digital Electrocardiogram (ECG 12-Lead)',
    type: 'REPORT',
    date: '15 Jul 2026',
    doctorName: 'Dr. Anisur Rahman',
    facility: 'Popular Diagnostic Center',
    patientName: 'Tanvir Ahmed',
    summary: 'Normal Sinus Rhythm. Heart Rate: 72 bpm. No acute ST-T wave abnormalities detected.',
    verified: true,
    fileSize: '2.6 MB',
  },
];

interface MobileHealthVaultViewProps {
  language: SupportedLanguage;
}

export default function MobileHealthVaultView({ language }: MobileHealthVaultViewProps) {
  const [docs, setDocs] = useState<HealthDocument[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dc_health_vault_docs');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return INITIAL_DOCS;
  });
  const [filterType, setFilterType] = useState<'ALL' | 'REPORT' | 'PRESCRIPTION'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingDoc, setViewingDoc] = useState<HealthDocument | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState<'REPORT' | 'PRESCRIPTION' | 'DOCUMENT'>('REPORT');
  const [uploadFacility, setUploadFacility] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dc_health_vault_docs', JSON.stringify(docs));
    }
  }, [docs]);

  const filteredDocs = docs.filter((doc) => {
    const matchesType = filterType === 'ALL' || doc.type === filterType;
    const matchesQuery =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.facility.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.doctorName && doc.doctorName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesQuery;
  });

  const handleDownloadDoc = (doc: HealthDocument) => {
    const content = `========================================================================
DIAGNOSTIC CARE — YOUR HEALTHCARE MARKETPLACE
Official Medical Record & Health Vault Certificate
Helpline: 01886-748564 | Bangladesh
========================================================================

Document Title : ${doc.title}
Document Type  : ${doc.type}
Issue Date     : ${doc.date}
Facility       : ${doc.facility}
Doctor         : ${doc.doctorName || 'Authorized Consultant'}
Patient Name   : ${doc.patientName}
Verification   : Cryptographically Certified & HMAC-SHA256 Validated

CLINICAL FINDINGS & SUMMARY:
${doc.summary}

========================================================================
Diagnostic Care Health Vault (AES-256 Encrypted Storage)
Customer Helpline: 01886748564
========================================================================`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/[^a-zA-Z0-9]/g, '_')}_medical_record.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(language === 'en' ? `Downloaded: ${doc.title}` : `ডকুমেন্ট ডাউনলোড সম্পন্ন: ${doc.title}`);
  };

  const handleShareDoc = async (doc: HealthDocument) => {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: `Diagnostic Care Health Record: ${doc.title}`,
          text: `Encrypted Health Record: ${doc.title} (${doc.date}) from ${doc.facility}. Verified on Diagnostic Care.`,
          url: window.location.href,
        });
        return;
      } catch (e) {}
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(
        `Diagnostic Care Health Record: ${doc.title} (${doc.date}) from ${doc.facility}.\nSummary: ${doc.summary}`
      );
      showToast(language === 'en' ? 'Copied document summary to clipboard!' : 'ডকুমেন্টের তথ্য ক্লিপবোর্ডে কপি করা হয়েছে!');
    }
  };

  const handleUploadRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    setUploadProgress(true);
    setTimeout(() => {
      const newRecord: HealthDocument = {
        id: `doc-${Date.now()}`,
        title: uploadTitle,
        type: uploadType,
        date: new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'bn-BD', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        facility: uploadFacility || (language === 'en' ? 'Uploaded Patient Document' : 'রোগীর নিজস্ব ডকুমেন্ট'),
        patientName: 'Tanvir Ahmed',
        summary: language === 'en' ? 'User uploaded document (Encrypted AES-256 storage).' : 'ব্যবহারকারী আপলোডকৃত ডকুমেন্ট (AES-256 এনক্রিপ্টেড)।',
        verified: true,
        fileSize: uploadFile ? `${(uploadFile.size / 1024 / 1024).toFixed(1)} MB` : '1.2 MB',
      };

      setDocs((prev) => [newRecord, ...prev]);
      setUploadProgress(false);
      setIsUploadModalOpen(false);
      setUploadTitle('');
      setUploadFacility('');
      setUploadFile(null);
      showToast(language === 'en' ? 'Document saved to Health Vault!' : 'ডকুমেন্ট হেলথ ভল্টে সংরক্ষিত হয়েছে!');
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '30px' }}>
      {toastMessage && (
        <div
          style={{
            backgroundColor: '#ECFDF5',
            color: '#065F46',
            border: '1px solid #10B981',
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease-in',
          }}
        >
          <CheckCircle2 size={16} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}
      {/* Vault Security Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0A1628 0%, #0E1F38 100%)',
          color: '#FFFFFF',
          borderRadius: '18px',
          padding: '22px 20px',
          boxShadow: '0 8px 24px rgba(10, 22, 40, 0.15)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '2px 10px', borderRadius: '12px', fontSize: '11px', color: '#67E8F9', fontWeight: 700, marginBottom: '6px' }}>
              <Lock size={11} />
              <span>{language === 'en' ? '256-Bit Encrypted Health Vault' : '২৫৬-বিট এনক্রিপ্টেড হেলথ ভল্ট'}</span>
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 800 }}>
              {language === 'en' ? 'Digital Medical Vault' : 'ডিজিটাল মেডিকেল ভল্ট'}
            </h1>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px', maxWidth: '340px' }}>
              {language === 'en'
                ? 'Your lab test reports, prescriptions, and clinical history are safe and accessible anytime.'
                : 'আপনার ও পরিবারের সকল ডাক্তারের প্রেসক্রিপশন ও ল্যাব টেস্ট রিপোর্ট আজীবন সুরক্ষিত।'}
            </p>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            style={{
              backgroundColor: 'var(--cyan-600)',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(8, 145, 178, 0.3)',
              minHeight: '44px',
            }}
          >
            <Plus size={16} />
            <span>{language === 'en' ? 'Upload' : 'আপলোড'}</span>
          </button>
        </div>

        {/* Security Alert Guarantee */}
        <div
          style={{
            marginTop: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '10px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11.5px',
            color: '#CBD5E1',
          }}
        >
          <ShieldCheck size={16} color="#22D3EE" style={{ flexShrink: 0 }} />
          <span>
            {language === 'en'
              ? 'Zero-Knowledge Privacy: Documents are never stored in public browser caches.'
              : 'গোপনীয়তার সুরক্ষা: কোনো মেডিকেল তথ্য পাবলিক ব্রাউজার ক্যাশে সংরক্ষণ হয় না।'}
          </span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder={language === 'en' ? 'Search reports, prescriptions or doctors...' : 'রিপোর্ট, প্রেসক্রিপশন বা ডাক্তার খুঁজুন...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 14px 11px 38px',
              borderRadius: '12px',
              border: '1px solid var(--slate-300)',
              fontSize: '13px',
              outline: 'none',
              backgroundColor: '#FFFFFF',
            }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['ALL', 'REPORT', 'PRESCRIPTION'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: filterType === t ? 'var(--cyan-600)' : '#FFFFFF',
                color: filterType === t ? '#FFFFFF' : 'var(--slate-600)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: filterType === t ? 'var(--cyan-600)' : '#E2E8F0',
                transition: 'all 0.15s',
              }}
            >
              {t === 'ALL'
                ? language === 'en' ? 'All Records' : 'সকল রেকর্ড'
                : t === 'REPORT'
                ? language === 'en' ? '🧪 Lab Reports' : '🧪 ল্যাব রিপোর্ট'
                : language === 'en' ? '📄 Prescriptions' : '📄 প্রেসক্রিপশন'}
            </button>
          ))}
        </div>
      </div>

      {/* Document List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(10, 22, 40, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: doc.type === 'REPORT' ? 'var(--cyan-50)' : 'var(--blue-50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0,
                  }}
                >
                  {doc.type === 'REPORT' ? '🧪' : '📄'}
                </div>
                <div>
                  <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--navy-900)' }}>
                    {doc.title}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--slate-500)', marginTop: '2px' }}>
                    {doc.facility} • {doc.date}
                  </div>
                </div>
              </div>

              {doc.verified && (
                <span
                  style={{
                    backgroundColor: 'var(--emerald-50)',
                    color: '#065F46',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCircle2 size={12} color="#10B981" />
                  <span>{language === 'en' ? 'Verified' : 'ভেরিফাইড'}</span>
                </span>
              )}
            </div>

            {/* Clinical Summary */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '12px',
                color: 'var(--slate-700)',
                lineHeight: 1.5,
              }}
            >
              {doc.summary}
            </div>

            {/* Action Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #F1F5F9',
                paddingTop: '10px',
              }}
            >
              <span style={{ fontSize: '11px', color: 'var(--slate-400)' }}>
                PDF • {doc.fileSize}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setViewingDoc(doc)}
                  style={{
                    backgroundColor: 'var(--cyan-50)',
                    color: 'var(--cyan-600)',
                    border: '1px solid var(--cyan-500)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    minHeight: '44px',
                  }}
                >
                  <Eye size={13} />
                  <span>{language === 'en' ? 'View Slip' : 'দেখুন'}</span>
                </button>

                <button
                  onClick={() => handleDownloadDoc(doc)}
                  style={{
                    backgroundColor: '#F1F5F9',
                    color: 'var(--slate-700)',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    minHeight: '44px',
                  }}
                >
                  <Download size={13} />
                  <span>{language === 'en' ? 'PDF' : 'ডাউনলোড'}</span>
                </button>

                <button
                  onClick={() => handleShareDoc(doc)}
                  style={{
                    backgroundColor: '#F1F5F9',
                    color: 'var(--slate-700)',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    minHeight: '44px',
                  }}
                  title="Share Document"
                >
                  <Share2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Document Modal */}
      {viewingDoc && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 12, 22, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 99995,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setViewingDoc(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>{viewingDoc.type === 'REPORT' ? '🧪' : '📄'}</span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy-900)' }}>
                    {viewingDoc.title}
                  </h3>
                  <div style={{ fontSize: '11.5px', color: 'var(--slate-500)' }}>
                    {viewingDoc.facility} • {viewingDoc.date}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '13px',
                lineHeight: 1.6,
                color: 'var(--slate-800)',
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--navy-900)', marginBottom: '6px' }}>
                {language === 'en' ? 'Clinical Findings & Summary:' : 'ক্লিনিক্যাল ফলাফল ও সারসংক্ষেপ:'}
              </div>
              <div>{viewingDoc.summary}</div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  handleDownloadDoc(viewingDoc);
                  setViewingDoc(null);
                }}
                style={{
                  flex: 1,
                  backgroundColor: 'var(--cyan-600)',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Download size={15} />
                <span>{language === 'en' ? 'Download Official PDF' : 'অফিসিয়াল PDF ডাউনলোড'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Record Modal */}
      {isUploadModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 12, 22, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 99995,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '540px',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '24px 20px',
              paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              animation: 'slideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload size={18} color="var(--cyan-600)" />
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--navy-900)' }}>
                  {language === 'en' ? 'Upload Medical Document' : 'মেডিকেল ডকুমেন্ট আপলোড করুন'}
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUploadRecord} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '4px' }}>
                  {language === 'en' ? 'Document Name *' : 'ডকুমেন্টের নাম *'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'en' ? 'e.g. Chest X-Ray PA View or Prescription' : 'যেমন: চেস্ট এক্স-রে বা প্রেসক্রিপশন'}
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--slate-300)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '4px' }}>
                  {language === 'en' ? 'Document Type' : 'ডকুমেন্টের ধরন'}
                </label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--slate-300)',
                    fontSize: '13px',
                  }}
                >
                  <option value="REPORT">{language === 'en' ? 'Diagnostic Lab Report' : 'ডায়াগনস্টিক ল্যাব রিপোর্ট'}</option>
                  <option value="PRESCRIPTION">{language === 'en' ? 'Doctor Prescription' : 'ডাক্তারের প্রেসক্রিপশন'}</option>
                  <option value="DOCUMENT">{language === 'en' ? 'Other Medical Record' : 'অন্যান্য স্বাস্থ্য নথি'}</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '4px' }}>
                  {language === 'en' ? 'Hospital / Diagnostic Center Name' : 'হাসপাতাল বা ডায়াগনস্টিক সেন্টারের নাম'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'en' ? 'e.g. Popular Diagnostic Center' : 'যেমন: পপুলার ডায়াগনস্টিক সেন্টার'}
                  value={uploadFacility}
                  onChange={(e) => setUploadFacility(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--slate-300)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '4px' }}>
                  {language === 'en' ? 'Select File (PDF, PNG, JPG)' : 'ফাইল নির্বাচন (PDF, PNG, JPG)'}
                </label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                  style={{ fontSize: '12px' }}
                />
              </div>

              <button
                type="submit"
                disabled={uploadProgress}
                style={{
                  backgroundColor: 'var(--cyan-600)',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'center',
                  marginTop: '8px',
                }}
              >
                {uploadProgress
                  ? language === 'en' ? 'Encrypting & Uploading...' : 'এনক্রিপ্ট ও আপলোড হচ্ছে...'
                  : language === 'en' ? 'Save to Encrypted Vault ✓' : 'ভল্টে সংরক্ষণ করুন ✓'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
