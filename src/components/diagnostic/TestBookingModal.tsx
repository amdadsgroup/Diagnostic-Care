'use client';

import React, { useState } from 'react';
import { BRAND } from '@/config/brand';
import { DiagnosticTest } from '@/types';

interface TestBookingModalProps {
  test: DiagnosticTest | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess?: (booking: any) => void;
}

export default function TestBookingModal({
  test,
  isOpen,
  onClose,
  onBookingSuccess,
}: TestBookingModalProps) {
  const [patientName, setPatientName] = useState('তানভীর আহমেদ');
  const [patientPhone, setPatientPhone] = useState('01712-345678');
  const [collectionType, setCollectionType] = useState<'CENTER_VISIT' | 'HOME_COLLECTION'>('CENTER_VISIT');
  const [homeAddress, setHomeAddress] = useState('রোড ৩, বাড়ি ১২, বেরিরপাড়, মৌলভীবাজার সদর');
  const [preferredDate, setPreferredDate] = useState(new Date().toISOString().split('T')[0]);
  const [preferredTime, setPreferredTime] = useState('09:00');
  const [paymentMethod, setPaymentMethod] = useState<'CASH_AT_DESK' | 'BKASH' | 'NAGAD'>('CASH_AT_DESK');
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<any>(null);

  if (!isOpen || !test) return null;

  const testPrice = test.discountPrice || test.price;
  const homeCollectionFee = collectionType === 'HOME_COLLECTION' ? 150 : 0;
  const totalAmount = testPrice + homeCollectionFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/tests/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testName: test.name,
          organizationName: test.organizationName,
          patientName,
          patientPhone,
          collectionType,
          preferredDate,
          fee: totalAmount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConfirmation(data);
        onBookingSuccess?.(data);
      }
    } catch {
      alert('বুকিং সম্পন্ন করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>ডায়াগনস্টিক টেস্ট বুকিং</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>{test.organizationName}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {confirmation ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: '3rem', color: 'var(--brand-emerald-500)', marginBottom: '8px' }}>✓</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                টেস্ট বুকিং নিশ্চিত হয়েছে!
              </h3>
              <p style={{ color: 'var(--brand-teal-600)', fontWeight: 700, fontSize: '1rem', marginTop: '6px' }}>
                বুকিং কোড: {confirmation.bookingCode}
              </p>
              <div style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: '8px', margin: '20px 0', textAlign: 'left', fontSize: '0.88rem', border: '1px solid var(--slate-200)' }}>
                <div>টেস্ট: <strong>{test.name}</strong></div>
                <div>রোগী: <strong>{patientName}</strong> ({patientPhone})</div>
                <div>পদ্ধতি: <strong>{collectionType === 'HOME_COLLECTION' ? 'হোম স্যাম্পল কালেকশন (বাসায় গিয়ে স্যাম্পল সংগ্রহ)' : 'সেন্টারে গিয়ে পরীক্ষা'}</strong></div>
                <div>তারিখ: <strong>{preferredDate} ({preferredTime})</strong></div>
                <div>মোট ফি: <strong>৳{totalAmount}</strong></div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '20px' }}>
                ল্যাব টেকনিশিয়ান বা সেন্টার থেকে কনফার্মেশনের জন্য কল দেওয়া হবে। জরুরি প্রয়োজনে কল করুন {BRAND.helpline}।
              </p>
              <button className="btn-primary" onClick={onClose} style={{ width: '100%' }}>
                ঠিক আছে ✓
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              {/* Selected Test Info Banner */}
              <div style={{ background: 'var(--brand-teal-50)', padding: '14px', borderRadius: '10px', border: '1px solid var(--brand-teal-500)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontWeight: 800, color: 'var(--brand-navy-900)', fontSize: '1.05rem' }}>
                    {test.name}
                  </h4>
                  <span style={{ fontWeight: 800, color: 'var(--brand-teal-600)', fontSize: '1.15rem' }}>
                    ৳{testPrice}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginTop: '4px' }}>
                  ক্যাটাগরি: {test.category} • স্যাম্পল: {test.sampleType} • রিপোর্ট ডেলিভারি: {test.expectedDeliveryHours} ঘণ্টা
                </div>
                {test.preparationInstructions && (
                  <div style={{ marginTop: '8px', padding: '6px 10px', background: 'white', borderRadius: '6px', fontSize: '0.78rem', color: '#92400e', border: '1px solid #fde68a' }}>
                    ⚠️ <strong>প্রস্তুতি নির্দেশনা:</strong> {test.preparationInstructions}
                  </div>
                )}
              </div>

              {/* Patient Details */}
              <div className="auth-row">
                <div className="auth-field">
                  <label>রোগীর নাম *</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                  />
                </div>
                <div className="auth-field">
                  <label>মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Sample Collection Mode */}
              <div className="auth-field">
                <label>স্যাম্পল সংগ্রহের স্থান (Collection Mode)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setCollectionType('CENTER_VISIT')}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: `2px solid ${collectionType === 'CENTER_VISIT' ? 'var(--brand-teal-600)' : 'var(--slate-200)'}`,
                      background: collectionType === 'CENTER_VISIT' ? 'var(--brand-teal-50)' : 'white',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: collectionType === 'CENTER_VISIT' ? 'var(--brand-teal-600)' : 'var(--slate-700)',
                      cursor: 'pointer',
                    }}
                  >
                    🏥 সেন্টারে গিয়ে পরীক্ষা
                  </button>
                  <button
                    type="button"
                    onClick={() => setCollectionType('HOME_COLLECTION')}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: `2px solid ${collectionType === 'HOME_COLLECTION' ? 'var(--brand-teal-600)' : 'var(--slate-200)'}`,
                      background: collectionType === 'HOME_COLLECTION' ? 'var(--brand-teal-50)' : 'white',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: collectionType === 'HOME_COLLECTION' ? 'var(--brand-teal-600)' : 'var(--slate-700)',
                      cursor: 'pointer',
                    }}
                  >
                    🏠 হোম স্যাম্পল কালেকশন (+৳১৫০)
                  </button>
                </div>
              </div>

              {collectionType === 'HOME_COLLECTION' && (
                <div className="auth-field">
                  <label>আপনার বাসার সম্পূর্ণ ঠিকানা (মৌলভীবাজার সদর এলাকা) *</label>
                  <textarea
                    rows={2}
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Date & Time */}
              <div className="auth-row">
                <div className="auth-field">
                  <label>পছন্দের তারিখ</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                  />
                </div>
                <div className="auth-field">
                  <label>পছন্দের সময়</label>
                  <input
                    type="time"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="auth-field">
                <label>পেমেন্ট পদ্ধতি</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)}>
                  <option value="CASH_AT_DESK">ক্যাশ অন কালেকশন / সেন্টারে পরিশোধ (Cash)</option>
                  <option value="BKASH">বিকাশ (bKash Instant)</option>
                  <option value="NAGAD">নগদ (Nagad Instant)</option>
                </select>
              </div>

              {/* Total Summary */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--slate-200)' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>সর্বমোট প্রদেয় ফি:</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                    ৳{totalAmount}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'প্রসেসিং হচ্ছে...' : 'টেস্ট বুকিং নিশ্চিত করুন ✓'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
