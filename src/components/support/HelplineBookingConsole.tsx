'use client';

import React, { useState } from 'react';
import { BRAND_CONSTANTS } from '@/config/brand';
import { Phone, User, Calendar, Stethoscope, CheckCircle2, AlertCircle, Send, Clock, ShieldCheck } from 'lucide-react';

export default function HelplineBookingConsole() {
  const [callerPhone, setCallerPhone] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [patientUpazila, setPatientUpazila] = useState('Sadar');
  const [selectedDoctor, setSelectedDoctor] = useState('assoc-anisur-popular');
  const [consultationDate, setConsultationDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentChoice, setPaymentChoice] = useState<'CASH_AT_DESK' | 'BKASH_PAYMENT'>('CASH_AT_DESK');
  const [agentNotes, setAgentNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    bookingCode: string;
    tokenNumber: number;
    doctorName: string;
    chamberLocation: string;
    slotTime: string;
    smsSent: boolean;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callerPhone || !patientName || !patientAge) {
      alert('রোগীর নাম, মোবাইল নম্বর এবং বয়স আবশ্যক।');
      return;
    }

    setIsSubmitting(true);
    // Simulate instantaneous call-center booking execution
    setTimeout(() => {
      const token = Math.floor(12 + Math.random() * 8);
      const code = `DC-TEL-${Math.floor(1000 + Math.random() * 9000)}`;
      setBookingResult({
        bookingCode: code,
        tokenNumber: token,
        doctorName: selectedDoctor === 'assoc-anisur-popular' ? 'ডাঃ আনিসুর রহমান (কার্ডিওলজিস্ট)' : 'ডাঃ ফারহানা চৌধুরী (গাইনী বিশেষজ্ঞ)',
        chamberLocation: 'পপুলার ডায়াগনস্টিক সেন্টার, মৌলভীবাজার মেইন ব্রাঞ্চ (রুম ২০৪)',
        slotTime: 'আজ ৫:১৫ PM',
        smsSent: true,
      });
      setIsSubmitting(false);
    }, 600);
  };

  const handleReset = () => {
    setCallerPhone('');
    setPatientName('');
    setPatientAge('');
    setAgentNotes('');
    setBookingResult(null);
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid var(--slate-300, #CBD5E1)',
        boxShadow: 'var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.1))',
        padding: '24px',
      }}
    >
      {/* Console Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--slate-200, #E2E8F0)',
          paddingBottom: '16px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#EFF6FF',
              color: '#1D4ED8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Phone size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-navy-900, #0B2545)' }}>
                কাস্টমার কেয়ার হেল্পলাইন ডেসপ্যাচার ({BRAND_CONSTANTS.CUSTOMER_CARE_PHONE})
              </h2>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                LIVE DESK • MOULVIBAZAR
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--slate-600, #475569)', marginTop: '2px' }}>
              মৌলভীবাজার ও সিলেট অঞ্চলের যেসব রোগী সরাসরি ফোনে কল করে সিরিয়াল বুকিং নিতে চান তাদের তাৎক্ষণিক বুকিং কনসোল।
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: 'var(--slate-500, #64748B)' }}>অপারেটর মোড</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-teal-700, #134074)' }}>
            Moulvibazar Central Dispatch #01
          </div>
        </div>
      </div>

      {bookingResult ? (
        <div
          style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #86EFAC',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#22C55E',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}
          >
            <CheckCircle2 size={32} />
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#14532D', marginBottom: '8px' }}>
            টেলিফোন বুকিং সফলভাবে সম্পন্ন হয়েছে!
          </h3>
          <p style={{ fontSize: '14px', color: '#166534', marginBottom: '20px' }}>
            রোগীর মোবাইলে ({callerPhone}) এসএমএস কনফার্মেশন ও টোকেন নম্বর পাঠানো হয়েছে।
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              maxWidth: '650px',
              margin: '0 auto 24px auto',
              textAlign: 'left',
            }}
          >
            <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
              <div style={{ fontSize: '11px', color: '#64748B' }}>বুকিং ট্র্যাকিং কোড</div>
              <strong style={{ fontSize: '16px', color: '#0B2545' }}>{bookingResult.bookingCode}</strong>
            </div>

            <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
              <div style={{ fontSize: '11px', color: '#64748B' }}>সিরিয়াল টোকেন নং</div>
              <strong style={{ fontSize: '20px', color: '#15803D' }}>#{bookingResult.tokenNumber}</strong>
            </div>

            <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
              <div style={{ fontSize: '11px', color: '#64748B' }}>কনসালট্যান্ট ডক্টর</div>
              <strong style={{ fontSize: '13px', color: '#0B2545' }}>{bookingResult.doctorName}</strong>
            </div>

            <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
              <div style={{ fontSize: '11px', color: '#64748B' }}>সময় ও চেম্বার</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0B2545' }}>
                {bookingResult.slotTime} • {bookingResult.chamberLocation}
              </div>
            </div>
          </div>

          <button
            onClick={handleReset}
            style={{
              backgroundColor: 'var(--brand-navy-900, #0B2545)',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            নতুন কল গ্রহণ করুন (Next Caller)
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            {/* Caller Mobile */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy-900, #0B2545)', marginBottom: '6px' }}>
                কলারের মোবাইল নম্বর *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={callerPhone}
                  onChange={(e) => setCallerPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                />
                <Phone size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            {/* Patient Name */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy-900, #0B2545)', marginBottom: '6px' }}>
                রোগীর পুরো নাম *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="যেমন: কামরুল হাসান"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                  }}
                />
                <User size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            {/* Age & Gender */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy-900, #0B2545)', marginBottom: '6px' }}>
                  বয়স *
                </label>
                <input
                  type="number"
                  required
                  placeholder="যেমন: 35"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy-900, #0B2545)', marginBottom: '6px' }}>
                  লিঙ্গ
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="MALE">পুরুষ (Male)</option>
                  <option value="FEMALE">মহিলা (Female)</option>
                  <option value="OTHER">অন্যান্য</option>
                </select>
              </div>
            </div>

            {/* Upazila Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy-900, #0B2545)', marginBottom: '6px' }}>
                উপজেলা (মৌলভীবাজার)
              </label>
              <select
                value={patientUpazila}
                onChange={(e) => setPatientUpazila(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option value="Sadar">মৌলভীবাজার সদর</option>
                <option value="Sreemangal">শ্রীমঙ্গল</option>
                <option value="Kamalganj">কমলগঞ্জ</option>
                <option value="Kulaura">কুলাউড়া</option>
                <option value="Rajnagar">রাজনগর</option>
              </select>
            </div>
          </div>

          {/* Doctor & Date Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy-900, #0B2545)', marginBottom: '6px' }}>
                কাঙ্ক্ষিত ডাক্তার ও চেম্বার *
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option value="assoc-anisur-popular">
                  ডাঃ আনিসুর রহমান (কার্ডিওলজিস্ট) — পপুলার ডায়াগনস্টিক, মৌলভীবাজার (৳৮০০)
                </option>
                <option value="assoc-farhana-popular">
                  ডাঃ ফারহানা চৌধুরী (গাইনী বিশেষজ্ঞ) — পপুলার ডায়াগনস্টিক, সিলেট (৳১০০০)
                </option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy-900, #0B2545)', marginBottom: '6px' }}>
                পেমেন্ট পদ্ধতি
              </label>
              <select
                value={paymentChoice}
                onChange={(e) => setPaymentChoice(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option value="CASH_AT_DESK">ক্যাশ অন চেম্বার ডেস্ক (Cash at Desk - Recommended)</option>
                <option value="BKASH_PAYMENT">বিকাশ / নগদ পেমেন্ট লিঙ্ক এসএমএস</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy-900, #0B2545)', marginBottom: '6px' }}>
                হেল্পলাইন নোট / লক্ষণ
              </label>
              <input
                type="text"
                placeholder="যেমন: ৩ দিন ধরে বুকে চিনচিনে ব্যথা"
                value={agentNotes}
                onChange={(e) => setAgentNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: 'var(--brand-navy-900, #0B2545)',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Send size={16} />
              {isSubmitting ? 'বুকিং প্রক্রিয়াধীন...' : 'তাৎক্ষণিক টেলিফোন বুকিং সম্পন্ন করুন'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
