'use client';

import React, { useState, useEffect } from 'react';
import { BRAND, BRAND_COLORS } from '@/config/brand';
import { BrandSymbol } from '@/components/brand/BrandSymbol';
import { CalendarCheck, Lock, Users, Phone, CheckCircle2 } from 'lucide-react';
import { AppointmentService } from '@/services/appointment.service';
import { useLanguage } from '@/context/LanguageContext';

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  bloodGroup: string;
}

interface PatientAppointment {
  id: string;
  bookingCode: string;
  doctorName: string;
  specialization: string;
  chamberName: string;
  date: string;
  time: string;
  tokenNumber: number;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  forWhom: string;
  fee: number;
  hasPrescription: boolean;
  hasReport: boolean;
}

export default function PatientDashboard({
  patientName,
  phone = '',
  patientId,
}: {
  patientName?: string;
  phone?: string;
  patientId?: string;
}) {
  const { language, formatCurrency, formatNumber } = useLanguage();
  const isBn = language === 'bn';

  const defaultDisplayName = patientName || (isBn ? 'সম্মানিত রোগী' : 'Respected Patient');

  const [activeTab, setActiveTab] = useState<'appointments' | 'vault' | 'family'>('appointments');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (patientId) {
      AppointmentService.getPatientAppointments(patientId).then((apts) => {
        if (apts && apts.length > 0) {
          const mapped: PatientAppointment[] = apts.map((a) => ({
            id: a.id,
            bookingCode: a.bookingCode,
            doctorName: a.doctorName,
            specialization: a.specialization,
            chamberName: a.organizationName,
            date: a.appointmentDate,
            time: a.startTime,
            tokenNumber: a.tokenNumber,
            status: a.status === 'COMPLETED' ? 'COMPLETED' : 'CONFIRMED',
            forWhom: a.patientName,
            fee: a.consultationFee,
            hasPrescription: false,
            hasReport: false,
          }));
          setAppointments(mapped);
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [patientId]);

  // Add Family Member state
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState(isBn ? 'পিতা' : 'Father');
  const [newMemberAge, setNewMemberAge] = useState('');
  const [newMemberGender, setNewMemberGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [newMemberBlood, setNewMemberBlood] = useState('B+');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const member: FamilyMember = {
      id: `fm-${Date.now()}`,
      name: newMemberName,
      relation: newMemberRelation,
      age: Number(newMemberAge) || 30,
      gender: newMemberGender,
      bloodGroup: newMemberBlood,
    };
    setFamilyMembers([...familyMembers, member]);
    setShowAddMember(false);
    setNewMemberName('');
    setNewMemberAge('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Patient Profile Card */}
      <div className="portal-card" style={{ background: 'linear-gradient(135deg, #10294F 0%, #1769F5 100%)', color: 'white', border: '1px solid rgba(23, 105, 245, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', flexShrink: 0 }}>
              <BrandSymbol size={42} altText="Diagnostic Care" />
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 87, 255, 0.35)', padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', marginBottom: '4px', color: '#BFDBFE', fontWeight: 600 }}>
                <CheckCircle2 size={12} color="#60A5FA" /> {isBn ? 'ভেরিফাইড পেশেন্ট প্রোফাইল' : 'Verified Patient Profile'}
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{defaultDisplayName}</h1>
              <p style={{ opacity: 0.85, fontSize: '0.85rem' }}>
                {phone ? (isBn ? `মোবাইল: ${formatNumber(phone)}` : `Mobile: ${phone}`) : (isBn ? 'মোবাইল নম্বর যুক্ত করুন' : 'Add mobile number')} • {isBn ? 'সুরক্ষিত স্বাস্থ্য প্রোফাইল' : 'Secure Health Profile'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <a
              href={`tel:${BRAND.helpline}`}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '8px 14px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
              }}
            >
              <Phone size={14} color="#60A5FA" /> {isBn ? `হেল্পলাইন: ${formatNumber(BRAND.displayPhone)}` : `Helpline: ${BRAND.displayPhone}`}
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--slate-200)', paddingBottom: '2px', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('appointments')}
          style={{
            padding: '10px 18px',
            fontWeight: 700,
            fontSize: '0.95rem',
            borderBottom: activeTab === 'appointments' ? `3px solid ${BRAND_COLORS.primary}` : '3px solid transparent',
            color: activeTab === 'appointments' ? BRAND_COLORS.primary : 'var(--slate-600)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
          }}
        >
          <CalendarCheck size={18} color={activeTab === 'appointments' ? BRAND_COLORS.primary : 'var(--slate-500)'} />
          <span>{isBn ? `আমার অ্যাপয়েন্টমেন্টস (${formatNumber(appointments.length)})` : `My Appointments (${appointments.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          style={{
            padding: '10px 18px',
            fontWeight: 700,
            fontSize: '0.95rem',
            borderBottom: activeTab === 'vault' ? `3px solid ${BRAND_COLORS.primary}` : '3px solid transparent',
            color: activeTab === 'vault' ? BRAND_COLORS.primary : 'var(--slate-600)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
          }}
        >
          <Lock size={18} color={activeTab === 'vault' ? BRAND_COLORS.primary : 'var(--slate-500)'} />
          <span>{isBn ? 'ডিজিটাল হেলথ ভল্ট (প্রেসক্রিপশন ও রিপোর্ট)' : 'Digital Health Vault (Prescriptions & Reports)'}</span>
        </button>

        <button
          onClick={() => setActiveTab('family')}
          style={{
            padding: '10px 18px',
            fontWeight: 700,
            fontSize: '0.95rem',
            borderBottom: activeTab === 'family' ? `3px solid ${BRAND_COLORS.primary}` : '3px solid transparent',
            color: activeTab === 'family' ? BRAND_COLORS.primary : 'var(--slate-600)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
          }}
        >
          <Users size={18} color={activeTab === 'family' ? BRAND_COLORS.primary : 'var(--slate-500)'} />
          <span>{isBn ? `পরিবার সদস্য প্রোফাইল (${formatNumber(familyMembers.length)})` : `Family Member Profiles (${familyMembers.length})`}</span>
        </button>
      </div>

      {/* TAB 1: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {appointments.map((apt) => (
            <div key={apt.id} className="portal-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ background: 'var(--brand-navy-900)', color: 'white', padding: '4px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '0.85rem' }}>
                    {isBn ? `টোকেন #${formatNumber(apt.tokenNumber)}` : `Token #${apt.tokenNumber}`}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>
                    {isBn ? `কোড: ${apt.bookingCode}` : `Code: ${apt.bookingCode}`}
                  </span>
                  <span style={{ background: apt.status === 'CONFIRMED' ? 'var(--brand-emerald-50)' : 'var(--slate-100)', color: apt.status === 'CONFIRMED' ? 'var(--brand-emerald-500)' : 'var(--slate-600)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                    {apt.status === 'CONFIRMED' ? (isBn ? '✓ নিশ্চিত' : '✓ Confirmed') : (isBn ? 'সম্পন্ন' : 'Completed')}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                  {apt.doctorName}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--brand-teal-600)', fontWeight: 600 }}>
                  {apt.specialization}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginTop: '4px' }}>
                  📍 {apt.chamberName}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                  {isBn ? 'রোগী:' : 'Patient:'} <strong>{apt.forWhom}</strong> • {isBn ? 'সময়:' : 'Time:'} {apt.date}, {apt.time}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--brand-navy-900)' }}>
                  {formatCurrency(apt.fee)}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {apt.hasPrescription && (
                    <button style={{ padding: '6px 12px', background: 'var(--brand-teal-50)', color: 'var(--brand-teal-600)', border: '1px solid var(--brand-teal-500)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                      {isBn ? '📄 প্রেসক্রিপশন দেখুন' : '📄 View Prescription'}
                    </button>
                  )}
                  {apt.hasReport && (
                    <button style={{ padding: '6px 12px', background: 'var(--brand-emerald-50)', color: '#065f46', border: '1px solid var(--brand-emerald-500)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                      {isBn ? '🧪 রিপোর্ট ডাউনলোড' : '🧪 Download Report'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {appointments.length === 0 && (
            <div
              className="portal-card"
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarCheck size={28} color="var(--slate-500)" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-navy-900)', margin: 0 }}>
                {isBn ? 'এখনও কোনো অ্যাপয়েন্টমেন্ট বুক করা নেই' : 'No Appointments Booked Yet'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', maxWidth: '400px', margin: 0 }}>
                {isBn
                  ? 'মৌলভীবাজার ও সিলেটে অভিজ্ঞ বিশেষজ্ঞ ডাক্তার অথবা বিশ্বস্ত ডায়াগনস্টিক সেন্টারের ল্যাব টেস্ট খুব সহজেই বুক করুন।'
                  : 'Easily book verified specialist doctors or trusted diagnostic test laboratories across Moulvibazar & Sylhet.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HEALTH VAULT */}
      {activeTab === 'vault' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--brand-teal-50)', padding: '16px', borderRadius: '10px', border: '1px solid var(--brand-teal-500)', fontSize: '0.9rem', color: 'var(--brand-navy-900)' }}>
            🔒 <strong>{isBn ? 'ডিজিটাল হেলথ ভল্ট:' : 'Digital Health Vault:'}</strong>{' '}
            {isBn
              ? 'আপনার ও পরিবারের সকল ডাক্তারের প্রেসক্রিপশন ও ল্যাব টেস্ট রিপোর্ট আজীবন এনক্রিপ্টেড ও সুরক্ষিত থাকে। যেকোনো সময় ডাক্তারকে দেখাতে পারবেন।'
              : 'Prescriptions and lab test reports for you and your family are permanently encrypted and preserved. Share securely with any doctor anytime.'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div className="portal-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.8rem' }}>📝</span>
                <div>
                  <h4 style={{ fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                    {isBn ? 'ডিজিটাল প্রেসক্রিপশন' : 'Digital Prescription'}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                    {isBn ? 'ডাঃ রফিকুল ইসলাম • ২৫ সেপ্টে, ২০২৬' : 'Dr. Rafiqul Islam • Sep 25, 2026'}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-700)', marginBottom: '12px' }}>
                {isBn
                  ? 'রোগ নির্ণয়: Essential Hypertension (Concor 2.5mg, Rosuva 10mg)'
                  : 'Diagnosis: Essential Hypertension (Concor 2.5mg, Rosuva 10mg)'}
              </p>
              <button style={{ width: '100%', padding: '8px', background: 'var(--brand-navy-900)', color: 'white', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                {isBn ? 'প্রেসক্রিপশন ওপেন করুন (PDF) 📄' : 'Open Prescription (PDF) 📄'}
              </button>
            </div>

            <div className="portal-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.8rem' }}>🧪</span>
                <div>
                  <h4 style={{ fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                    {isBn ? 'কমপ্লিট ব্লাড কাউন্ট (CBC)' : 'Complete Blood Count (CBC)'}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                    {isBn ? 'মৌলভীবাজার ডায়াগনস্টিক • ২৬ সেপ্টে, ২০২৬' : 'Moulvibazar Diagnostic • Sep 26, 2026'}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-700)', marginBottom: '12px' }}>
                {isBn ? 'ভেরিফাইড রিপোর্ট • হিমোগ্লোবিন: 14.2 g/dL (স্বাভাবিক)' : 'Verified Report • Hemoglobin: 14.2 g/dL (Normal)'}
              </p>
              <button style={{ width: '100%', padding: '8px', background: 'var(--brand-teal-600)', color: 'white', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                {isBn ? 'অফিসিয়াল রিপোর্ট ডাউনলোড করুন ⬇' : 'Download Official Report ⬇'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FAMILY MEMBERS */}
      {activeTab === 'family' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', margin: 0 }}>
              {isBn
                ? 'একটি অ্যাকাউন্ট থেকেই পরিবারের সকল সদস্যের ডাক্তার ও ল্যাব টেস্ট বুকিং করতে পারবেন।'
                : 'Book doctors and lab tests for all your family members from a single unified account.'}
            </p>
            <button
              onClick={() => setShowAddMember(true)}
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '8px 16px', cursor: 'pointer' }}
            >
              {isBn ? '+ নতুন সদস্য যোগ করুন' : '+ Add Family Member'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {familyMembers.map((member) => (
              <div key={member.id} className="portal-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--brand-navy-900)' }}>
                    {member.name}
                  </h4>
                  <span style={{ background: 'var(--slate-100)', color: 'var(--slate-700)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {member.relation}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                  {isBn
                    ? `বয়স: ${formatNumber(member.age)} বছর • ${member.gender === 'MALE' ? 'পুরুষ' : 'মহিলা'}`
                    : `Age: ${member.age} years • ${member.gender === 'MALE' ? 'Male' : 'Female'}`}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--brand-rose-600)', fontWeight: 700, marginTop: '4px' }}>
                  {isBn ? `রক্তের গ্রুপ: ${member.bloodGroup}` : `Blood Group: ${member.bloodGroup}`}
                </p>
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--slate-200)', display: 'flex', gap: '8px' }}>
                  <button style={{ flex: 1, padding: '6px', background: 'var(--brand-teal-50)', color: 'var(--brand-teal-600)', border: '1px solid var(--brand-teal-500)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                    {isBn ? 'ডাক্তার বুক করুন' : 'Book Doctor'}
                  </button>
                </div>
              </div>
            ))}
            {familyMembers.length === 0 && (
              <div
                className="portal-card"
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '36px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Users size={28} color="var(--slate-400)" />
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', margin: 0 }}>
                  {isBn ? 'এখনও কোনো পারিবারিক সদস্য যুক্ত করা হয়নি।' : 'No family members added yet.'}
                </p>
                <button
                  onClick={() => setShowAddMember(true)}
                  style={{
                    backgroundColor: 'var(--brand-teal-600)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    marginTop: '4px',
                  }}
                >
                  {isBn ? '+ প্রথম সদস্য যোগ করুন' : '+ Add First Member'}
                </button>
              </div>
            )}
          </div>

          {/* Add Member Modal */}
          {showAddMember && (
            <div className="modal-overlay" onClick={() => setShowAddMember(false)}>
              <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                    {isBn ? 'পরিবারের সদস্য যোগ করুন' : 'Add Family Member'}
                  </div>
                  <button className="modal-close" onClick={() => setShowAddMember(false)}>✕</button>
                </div>

                <form onSubmit={handleAddMember} className="modal-body auth-form">
                  <div className="auth-field">
                    <label>{isBn ? 'সদস্যের পূর্ণ নাম *' : "Member's Full Name *"}</label>
                    <input
                      type="text"
                      placeholder={isBn ? 'যেমন: মোঃ আব্দুল করিম' : 'e.g. Md. Abdul Karim'}
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="auth-row">
                    <div className="auth-field">
                      <label>{isBn ? 'সম্পর্ক *' : 'Relation *'}</label>
                      <select value={newMemberRelation} onChange={(e) => setNewMemberRelation(e.target.value)}>
                        <option value={isBn ? 'পিতা (Father)' : 'Father'}>{isBn ? 'পিতা (Father)' : 'Father'}</option>
                        <option value={isBn ? 'মাতা (Mother)' : 'Mother'}>{isBn ? 'মাতা (Mother)' : 'Mother'}</option>
                        <option value={isBn ? 'স্ত্রী / স্বামী (Spouse)' : 'Spouse'}>{isBn ? 'স্ত্রী / স্বামী (Spouse)' : 'Spouse'}</option>
                        <option value={isBn ? 'সন্তান (Child)' : 'Child'}>{isBn ? 'সন্তান (Child)' : 'Child'}</option>
                        <option value={isBn ? 'ভাই/বোন (Sibling)' : 'Sibling'}>{isBn ? 'ভাই/বোন (Sibling)' : 'Sibling'}</option>
                        <option value={isBn ? 'দাদা/দাদী (Grandparent)' : 'Grandparent'}>{isBn ? 'দাদা/দাদী (Grandparent)' : 'Grandparent'}</option>
                      </select>
                    </div>

                    <div className="auth-field">
                      <label>{isBn ? 'বয়স *' : 'Age *'}</label>
                      <input
                        type="number"
                        placeholder={isBn ? 'বয়স' : 'Age'}
                        value={newMemberAge}
                        onChange={(e) => setNewMemberAge(e.target.value)}
                        min={1}
                        max={120}
                        required
                      />
                    </div>
                  </div>

                  <div className="auth-row">
                    <div className="auth-field">
                      <label>{isBn ? 'লিঙ্গ' : 'Gender'}</label>
                      <select value={newMemberGender} onChange={(e) => setNewMemberGender(e.target.value as 'MALE' | 'FEMALE')}>
                        <option value="MALE">{isBn ? 'পুরুষ' : 'Male'}</option>
                        <option value="FEMALE">{isBn ? 'মহিলা' : 'Female'}</option>
                      </select>
                    </div>

                    <div className="auth-field">
                      <label>{isBn ? 'রক্তের গ্রুপ' : 'Blood Group'}</label>
                      <select value={newMemberBlood} onChange={(e) => setNewMemberBlood(e.target.value)}>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                    <button
                      type="button"
                      onClick={() => setShowAddMember(false)}
                      style={{ padding: '8px 16px', border: '1px solid var(--slate-300)', borderRadius: '6px', background: 'transparent', cursor: 'pointer' }}
                    >
                      {isBn ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button type="submit" className="btn-primary" style={{ cursor: 'pointer' }}>
                      {isBn ? 'সদস্য সংরক্ষণ করুন ✓' : 'Save Member ✓'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
