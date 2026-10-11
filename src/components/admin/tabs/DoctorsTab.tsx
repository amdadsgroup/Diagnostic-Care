'use client';

import React, { useState, useEffect } from 'react';
import { Doctor } from '@/types';
import { DoctorService } from '@/services/doctor.service';
import { AdminService } from '@/services/admin.service';
import {
  Stethoscope,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Calendar,
  DollarSign,
  FileText,
  Shield,
  Eye,
} from 'lucide-react';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';

interface DoctorsTabProps {
  language: 'en' | 'bn';
  adminEmail: string;
}

export default function DoctorsTab({ language, adminEmail }: DoctorsTabProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Verification Modal State
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [verificationAction, setVerificationAction] = useState<'VERIFIED' | 'REJECTED' | 'SUSPENDED' | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    const docs = await DoctorService.getDoctors();
    setDoctors(docs);
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleVerificationSubmit = async () => {
    if (!selectedDoctor || !verificationAction) return;
    setSubmitting(true);
    setActionMessage(null);

    const res = await AdminService.updateDoctorVerification(
      selectedDoctor.id,
      verificationAction,
      reviewerNotes || 'Reviewed by Medical Verification Board',
      adminEmail
    );

    if (res.success) {
      setActionMessage(
        language === 'bn'
          ? `চিকিৎসকের স্ট্যাটাস সফলভাবে ${verificationAction} করা হয়েছে।`
          : `Doctor verification status updated to ${verificationAction}.`
      );
      fetchDoctors();
      setTimeout(() => {
        setVerificationAction(null);
        setSelectedDoctor(null);
        setReviewerNotes('');
      }, 1500);
    } else {
      setActionMessage(res.error || 'Failed to update verification');
    }
    setSubmitting(false);
  };

  const filteredDoctors = doctors.filter((doc) => {
    const q = search.toLowerCase();
    const matchesSearch =
      doc.fullName.toLowerCase().includes(q) ||
      doc.bmdcNumber.toLowerCase().includes(q) ||
      doc.specialization.toLowerCase().includes(q);
    const matchesSpec = specialtyFilter === 'ALL' || doc.specialization.toLowerCase().includes(specialtyFilter.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || (doc.verificationStatus || 'VERIFIED') === statusFilter;
    return matchesSearch && matchesSpec && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search & Filter Header */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '18px 20px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '8px 12px',
            flex: 1,
            minWidth: '280px',
          }}
        >
          <Search size={16} color="#94A3B8" style={{ marginRight: '8px' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'bn' ? 'ডাক্তারের নাম, বিএমডিসি নং বা স্পেশালিটি...' : 'Search by doctor name, BMDC no, specialty...'}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              outline: 'none',
              width: '100%',
              fontSize: '13px',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '8px 12px',
              fontSize: '13px',
              color: '#0F172A',
              fontWeight: 600,
            }}
          >
            <option value="ALL">{language === 'bn' ? 'সকল স্পেশালিটি' : 'All Specialties'}</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Gynecology">Gynecology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Medicine">Internal Medicine</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '8px 12px',
              fontSize: '13px',
              color: '#0F172A',
              fontWeight: 600,
            }}
          >
            <option value="ALL">{language === 'bn' ? 'সকল ভেরিফিকেশন' : 'All Statuses'}</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING">Pending Review</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Doctors Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569' }}>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>{language === 'bn' ? 'চিকিৎসক' : 'Doctor'}</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>{language === 'bn' ? 'বিএমডিসি নম্বর' : 'BMDC Reg.'}</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>{language === 'bn' ? 'স্পেশালিটি ও ডিগ্রি' : 'Specialty & Degrees'}</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>{language === 'bn' ? 'অভিজ্ঞতা' : 'Experience'}</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>{language === 'bn' ? 'ভেরিফিকেশন' : 'Verification'}</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'right' }}>{language === 'bn' ? 'অ্যাকশন' : 'Review & Action'}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                    Loading doctors...
                  </td>
                </tr>
              ) : filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                    No doctors found.
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doc) => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Stethoscope size={16} color={BRAND_COLORS.primary} />
                        <span>{doc.fullName}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                        Rating: ⭐ {doc.rating || '5.0'} ({doc.reviewCount || 0} reviews)
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          backgroundColor: '#EFF6FF',
                          color: '#2563EB',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                        }}
                      >
                        {doc.bmdcNumber}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: '#334155' }}>{doc.specialization}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{doc.qualifications}</div>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#334155', fontWeight: 600 }}>
                      {doc.experienceYears} {language === 'bn' ? 'বছর' : 'years'}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 800,
                          padding: '3px 9px',
                          borderRadius: '9999px',
                          backgroundColor:
                            doc.verificationStatus === 'VERIFIED'
                              ? '#DCFCE7'
                              : doc.verificationStatus === 'REJECTED'
                              ? '#FEE2E2'
                              : '#FEF3C7',
                          color:
                            doc.verificationStatus === 'VERIFIED'
                              ? '#166534'
                              : doc.verificationStatus === 'REJECTED'
                              ? '#991B1B'
                              : '#92400E',
                        }}
                      >
                        {doc.verificationStatus || 'VERIFIED'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDoctor(doc);
                            setVerificationAction('VERIFIED');
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            backgroundColor: '#F0FDF4',
                            border: '1px solid #BBF7D0',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#16A34A',
                            cursor: 'pointer',
                          }}
                        >
                          {language === 'bn' ? 'অনুমোদন' : 'Verify'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDoctor(doc);
                            setVerificationAction('REJECTED');
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            backgroundColor: '#FEF2F2',
                            border: '1px solid #FECACA',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#DC2626',
                            cursor: 'pointer',
                          }}
                        >
                          {language === 'bn' ? 'বাতিল' : 'Reject'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Review Modal */}
      {verificationAction && selectedDoctor && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '26px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
            }}
          >
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0' }}>
              {verificationAction === 'VERIFIED'
                ? language === 'bn' ? 'চিকিৎসক বিএমডিসি সনদ অনুমোদন' : 'Approve Doctor BMDC Verification'
                : language === 'bn' ? 'চিকিৎসক আবেদন প্রত্যাখ্যান' : 'Reject Doctor Application'}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '14px' }}>
              <strong>{selectedDoctor.fullName}</strong> (BMDC: {selectedDoctor.bmdcNumber})
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                {language === 'bn' ? 'রিভিউয়ার মন্তব্য / অফিশিয়াল কারণ:' : 'Reviewer Notes / Justification:'}
              </label>
              <textarea
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                rows={3}
                placeholder={language === 'bn' ? 'যাচাইয়ের মন্তব্য লিখুন...' : 'Enter review remarks...'}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {actionMessage && (
              <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#F0FDF4', color: '#16A34A', fontSize: '12.5px', marginBottom: '12px' }}>
                {actionMessage}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setVerificationAction(null);
                  setSelectedDoctor(null);
                }}
                disabled={submitting}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#F1F5F9',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleVerificationSubmit}
                disabled={submitting}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  backgroundColor: verificationAction === 'VERIFIED' ? '#16A34A' : '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting ? 'Updating...' : language === 'bn' ? 'নিশ্চিত করুন' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
