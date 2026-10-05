'use client';

import React, { useState } from 'react';
import { BRAND } from '@/config/brand';

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

const INITIAL_FAMILY: FamilyMember[] = [
  { id: 'fm-1', name: 'রহিমা বেগম', relation: 'মা (Mother)', age: 58, gender: 'FEMALE', bloodGroup: 'B+' },
  { id: 'fm-2', name: 'আয়েশা সিদ্দিকা', relation: 'স্ত্রী (Spouse)', age: 31, gender: 'FEMALE', bloodGroup: 'O+' },
  { id: 'fm-3', name: 'আরিয়ান আহমেদ', relation: 'ছেলে (Child)', age: 6, gender: 'MALE', bloodGroup: 'B+' },
];

const INITIAL_APPOINTMENTS: PatientAppointment[] = [
  {
    id: 'apt-1',
    bookingCode: 'DC-2026-9021',
    doctorName: 'ডাঃ রফিকুল ইসলাম',
    specialization: 'কার্ডিওলজিস্ট ও মেডিসিন বিশেষজ্ঞ',
    chamberName: 'মৌলভীবাজার ডিজিটাল ডায়াগনস্টিক কমপ্লেক্স',
    date: 'আজ (Today)',
    time: '০৪:১৫ অপরাহ্ন',
    tokenNumber: 2,
    status: 'CONFIRMED',
    forWhom: 'নিজের জন্য (Self)',
    fee: 800,
    hasPrescription: true,
    hasReport: false,
  },
  {
    id: 'apt-2',
    bookingCode: 'DC-2026-8714',
    doctorName: 'ডাঃ ফারহানা চৌধুরী',
    specialization: 'গাইনী ও প্রসূতি বিশেষজ্ঞ',
    chamberName: 'পপুলার ডায়াগনস্টিক সেন্টার - সিলেট ব্রাঞ্চ',
    date: '১২ অক্টোবর, ২০২৬',
    time: '০৫:৩০ অপরাহ্ন',
    tokenNumber: 7,
    status: 'CONFIRMED',
    forWhom: 'আয়েশা সিদ্দিকা (স্ত্রী)',
    fee: 1000,
    hasPrescription: false,
    hasReport: false,
  },
  {
    id: 'apt-3',
    bookingCode: 'DC-2026-7811',
    doctorName: 'ডাঃ তৌহিদ হাসান',
    specialization: 'অর্থোপেডিক সার্জন',
    chamberName: 'মৌলভীবাজার সেন্ট্রাল ক্লিনিক',
    date: '২৫ সেপ্টেম্বর, ২০২৬',
    time: '০৬:০০ অপরাহ্ন',
    tokenNumber: 12,
    status: 'COMPLETED',
    forWhom: 'রহিমা বেগম (মা)',
    fee: 800,
    hasPrescription: true,
    hasReport: true,
  },
];

export default function PatientDashboard({
  patientName = 'তানভীর আহমেদ',
  phone = '01712-345678',
}: {
  patientName?: string;
  phone?: string;
}) {
  const [activeTab, setActiveTab] = useState<'appointments' | 'vault' | 'family'>('appointments');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(INITIAL_FAMILY);
  const [appointments] = useState<PatientAppointment[]>(INITIAL_APPOINTMENTS);

  // Add Family Member state
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('পিতা (Father)');
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
      <div className="portal-card" style={{ background: 'linear-gradient(135deg, var(--brand-navy-900) 0%, #173863 100%)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--brand-teal-500)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 800 }}>
              {patientName.slice(0, 1)}
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', marginBottom: '4px' }}>
                ✓ ভেরিফাইড পেশেন্ট প্রোফাইল
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{patientName}</h1>
              <p style={{ opacity: 0.85, fontSize: '0.85rem' }}>
                ফোন: {phone} • জেলা: মৌলভীবাজার • রক্তের গ্রুপ: A+
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
              }}
            >
              📞 হেল্পলাইন: {BRAND.helpline}
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--slate-200)', paddingBottom: '2px' }}>
        <button
          onClick={() => setActiveTab('appointments')}
          style={{
            padding: '10px 18px',
            fontWeight: 700,
            fontSize: '0.95rem',
            borderBottom: activeTab === 'appointments' ? '3px solid var(--brand-teal-600)' : '3px solid transparent',
            color: activeTab === 'appointments' ? 'var(--brand-teal-600)' : 'var(--slate-600)',
          }}
        >
          📅 আমার অ্যাপয়েন্টমেন্টস ({appointments.length})
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          style={{
            padding: '10px 18px',
            fontWeight: 700,
            fontSize: '0.95rem',
            borderBottom: activeTab === 'vault' ? '3px solid var(--brand-teal-600)' : '3px solid transparent',
            color: activeTab === 'vault' ? 'var(--brand-teal-600)' : 'var(--slate-600)',
          }}
        >
          🔒 ডিজিটাল হেলথ ভল্ট (প্রেসক্রিপশন ও রিপোর্ট)
        </button>

        <button
          onClick={() => setActiveTab('family')}
          style={{
            padding: '10px 18px',
            fontWeight: 700,
            fontSize: '0.95rem',
            borderBottom: activeTab === 'family' ? '3px solid var(--brand-teal-600)' : '3px solid transparent',
            color: activeTab === 'family' ? 'var(--brand-teal-600)' : 'var(--slate-600)',
          }}
        >
          👨‍👩‍👦 পরিবার সদস্য প্রোফাইল ({familyMembers.length})
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
                    টোকেন #{apt.tokenNumber}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>
                    কোড: {apt.bookingCode}
                  </span>
                  <span style={{ background: apt.status === 'CONFIRMED' ? 'var(--brand-emerald-50)' : 'var(--slate-100)', color: apt.status === 'CONFIRMED' ? 'var(--brand-emerald-500)' : 'var(--slate-600)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                    {apt.status === 'CONFIRMED' ? '✓ নিশ্চিত' : 'সম্পন্ন'}
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
                  রোগী: <strong>{apt.forWhom}</strong> • সময়: {apt.date}, {apt.time}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--brand-navy-900)' }}>
                  ৳{apt.fee}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {apt.hasPrescription && (
                    <button style={{ padding: '6px 12px', background: 'var(--brand-teal-50)', color: 'var(--brand-teal-600)', border: '1px solid var(--brand-teal-500)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                      📄 প্রেসক্রিপশন দেখুন
                    </button>
                  )}
                  {apt.hasReport && (
                    <button style={{ padding: '6px 12px', background: 'var(--brand-emerald-50)', color: '#065f46', border: '1px solid var(--brand-emerald-500)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                      🧪 রিপোর্ট ডাউনলোড
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: HEALTH VAULT */}
      {activeTab === 'vault' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--brand-teal-50)', padding: '16px', borderRadius: '10px', border: '1px solid var(--brand-teal-500)', fontSize: '0.9rem', color: 'var(--brand-navy-900)' }}>
            🔒 <strong>ডিজিটাল হেলথ ভল্ট:</strong> আপনার ও পরিবারের সকল ডাক্তারের প্রেসক্রিপশন ও ল্যাব টেস্ট রিপোর্ট আজীবন এনক্রিপ্টেড ও সুরক্ষিত থাকে। যেকোনো সময় ডাক্তারকে দেখাতে পারবেন।
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div className="portal-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.8rem' }}>📝</span>
                <div>
                  <h4 style={{ fontWeight: 800, color: 'var(--brand-navy-900)' }}>ডিজিটাল প্রেসক্রিপশন</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>ডাঃ রফিকুল ইসলাম • ২৫ সেপ্টে, ২০২৬</p>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-700)', marginBottom: '12px' }}>
                রোগ নির্ণয়: Essential Hypertension (Concor 2.5mg, Rosuva 10mg)
              </p>
              <button style={{ width: '100%', padding: '8px', background: 'var(--brand-navy-900)', color: 'white', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                প্রেসক্রিপশন ওপেন করুন (PDF) 📄
              </button>
            </div>

            <div className="portal-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.8rem' }}>🧪</span>
                <div>
                  <h4 style={{ fontWeight: 800, color: 'var(--brand-navy-900)' }}>কমপ্লিট ব্লাড কাউন্ট (CBC)</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>মৌলভীবাজার ডায়াগনস্টিক • ২৬ সেপ্টে, ২০২৬</p>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-700)', marginBottom: '12px' }}>
                ভেরিফাইড রিপোর্ট • হিমোগ্লোবিন: 14.2 g/dL (স্বাভাবিক)
              </p>
              <button style={{ width: '100%', padding: '8px', background: 'var(--brand-teal-600)', color: 'white', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                অফিসিয়াল রিপোর্ট ডাউনলোড করুন ⬇
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FAMILY MEMBERS */}
      {activeTab === 'family' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)' }}>
              একটি অ্যাকাউন্ট থেকেই পরিবারের সকল সদস্যের ডাক্তার ও ল্যাব টেস্ট বুকিং করতে পারবেন।
            </p>
            <button
              onClick={() => setShowAddMember(true)}
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            >
              + নতুন সদস্য যোগ করুন
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
                  বয়স: {member.age} বছর • {member.gender === 'MALE' ? 'পুরুষ' : 'মহিলা'}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--brand-rose-600)', fontWeight: 700, marginTop: '4px' }}>
                  রক্তের গ্রুপ: {member.bloodGroup}
                </p>
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--slate-200)', display: 'flex', gap: '8px' }}>
                  <button style={{ flex: 1, padding: '6px', background: 'var(--brand-teal-50)', color: 'var(--brand-teal-600)', border: '1px solid var(--brand-teal-500)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                    ডাক্তার বুক করুন
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Member Modal */}
          {showAddMember && (
            <div className="modal-overlay" onClick={() => setShowAddMember(false)}>
              <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>পরিবারের সদস্য যোগ করুন</div>
                  <button className="modal-close" onClick={() => setShowAddMember(false)}>✕</button>
                </div>

                <form onSubmit={handleAddMember} className="modal-body auth-form">
                  <div className="auth-field">
                    <label>সদস্যের পূর্ণ নাম *</label>
                    <input
                      type="text"
                      placeholder="যেমন: মোঃ আব্দুল করিম"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="auth-row">
                    <div className="auth-field">
                      <label>সম্পর্ক *</label>
                      <select value={newMemberRelation} onChange={(e) => setNewMemberRelation(e.target.value)}>
                        <option value="পিতা (Father)">পিতা (Father)</option>
                        <option value="মাতা (Mother)">মাতা (Mother)</option>
                        <option value="স্ত্রী (Spouse)">স্ত্রী (Spouse)</option>
                        <option value="সন্তান (Child)">সন্তান (Child)</option>
                        <option value="ভাই/বোন (Sibling)">ভাই/বোন (Sibling)</option>
                        <option value="দাদা/দাদী (Grandparent)">দাদা/দাদী (Grandparent)</option>
                      </select>
                    </div>

                    <div className="auth-field">
                      <label>বয়স *</label>
                      <input
                        type="number"
                        placeholder="বয়স"
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
                      <label>লিঙ্গ</label>
                      <select value={newMemberGender} onChange={(e) => setNewMemberGender(e.target.value as 'MALE' | 'FEMALE')}>
                        <option value="MALE">পুরুষ</option>
                        <option value="FEMALE">মহিলা</option>
                      </select>
                    </div>

                    <div className="auth-field">
                      <label>রক্তের গ্রুপ</label>
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
                      style={{ padding: '8px 16px', border: '1px solid var(--slate-300)', borderRadius: '6px' }}
                    >
                      বাতিল
                    </button>
                    <button type="submit" className="btn-primary">
                      সদস্য সংরক্ষণ করুন ✓
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
