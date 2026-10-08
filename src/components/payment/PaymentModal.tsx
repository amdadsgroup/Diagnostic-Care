'use client';

import React, { useState } from 'react';
import { BRAND } from '@/config/brand';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingCode: string;
  amount: number;
  doctorOrTestName: string;
  organizationName: string;
  patientPhone?: string;
  onPaymentSuccess?: (payment: any) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  bookingCode,
  amount,
  doctorOrTestName,
  organizationName,
  patientPhone = '',
  onPaymentSuccess,
}: PaymentModalProps) {
  const [gateway, setGateway] = useState<'BKASH' | 'NAGAD' | 'CASH_AT_DESK'>('BKASH');
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Number, 2: OTP, 3: PIN
  const [phone, setPhone] = useState(patientPhone);
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [completedTx, setCompletedTx] = useState<any>(null);

  if (!isOpen) return null;

  const handleNextToOtp = () => {
    if (!phone) return;
    setStep(2);
  };

  const handleNextToPin = () => {
    if (!otp) return;
    setStep(3);
  };

  const handleExecutePayment = async () => {
    setLoading(true);
    try {
      const endpoint = gateway === 'BKASH' ? '/api/payments/bkash/execute' : '/api/payments/nagad/execute';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingCode,
          amount,
          patientPhone: phone,
          organizationName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCompletedTx(data);
        onPaymentSuccess?.(data);
      }
    } catch {
      alert('পেমেন্ট প্রসেসিংয়ে ত্রুটি হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const isBkash = gateway === 'BKASH';
  const isNagad = gateway === 'NAGAD';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '520px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        {/* Header with Gateway Branding */}
        <div style={{
          background: isBkash ? '#D12053' : isNagad ? '#F7941D' : 'var(--brand-navy-900)',
          color: 'white',
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'background 0.2s',
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>
              {isBkash ? 'bKash Payment' : isNagad ? 'Nagad Payment' : 'ক্যাশ পেমেন্ট (Cash at Desk)'}
            </div>
            <div style={{ fontSize: '0.78rem', opacity: 0.9 }}>
              বুকিং কোড: {bookingCode} • ৳{amount}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Gateway Switcher Tabs */}
        {!completedTx && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'var(--slate-100)', borderBottom: '1px solid var(--slate-200)' }}>
            <button
              onClick={() => { setGateway('BKASH'); setStep(1); }}
              style={{
                padding: '12px',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: isBkash ? '#D12053' : 'var(--slate-600)',
                background: isBkash ? 'white' : 'transparent',
                borderBottom: isBkash ? '3px solid #D12053' : 'none',
              }}
            >
              বিকাশ (bKash)
            </button>
            <button
              onClick={() => { setGateway('NAGAD'); setStep(1); }}
              style={{
                padding: '12px',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: isNagad ? '#F7941D' : 'var(--slate-600)',
                background: isNagad ? 'white' : 'transparent',
                borderBottom: isNagad ? '3px solid #F7941D' : 'none',
              }}
            >
              নগদ (Nagad)
            </button>
            <button
              onClick={() => { setGateway('CASH_AT_DESK'); }}
              style={{
                padding: '12px',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: gateway === 'CASH_AT_DESK' ? 'var(--brand-navy-900)' : 'var(--slate-600)',
                background: gateway === 'CASH_AT_DESK' ? 'white' : 'transparent',
                borderBottom: gateway === 'CASH_AT_DESK' ? '3px solid var(--brand-navy-900)' : 'none',
              }}
            >
              ক্যাশ (Cash)
            </button>
          </div>
        )}

        <div className="modal-body">
          {completedTx ? (
            /* Payment Receipt */
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '3rem', color: 'var(--brand-emerald-500)', marginBottom: '8px' }}>✓</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.85rem', marginTop: '4px' }}>
                ট্রানজেকশন আইডি: <strong>{completedTx.transaction?.gatewayTransactionId}</strong>
              </p>

              <div style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: '10px', margin: '20px 0', textAlign: 'left', fontSize: '0.85rem', border: '1px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>পরিশোধিত মোট অর্থ:</span>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--brand-navy-900)' }}>৳{amount}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>স্বাস্থ্যসেবা প্রদানকারী পাবে (৯০%):</span>
                  <strong>৳{completedTx.transaction?.providerEarnings}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>প্ল্যাটফর্ম ফি (১০%):</span>
                  <strong>৳{completedTx.transaction?.commissionAmount}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--slate-200)', paddingTop: '8px' }}>
                  <span>লেজার এন্ট্রি:</span>
                  <span style={{ color: 'var(--brand-emerald-500)', fontWeight: 700 }}>✓ ডেবিট/ক্রেডিট ব্যালেন্সড</span>
                </div>
              </div>

              <button className="btn-primary" onClick={onClose} style={{ width: '100%' }}>
                রসিদ বন্ধ করুন ✓
              </button>
            </div>
          ) : gateway === 'CASH_AT_DESK' ? (
            /* Cash At Desk Selection */
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>💵</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--brand-navy-900)' }}>
                সেন্টারে নগদ পরিশোধ (Cash at Desk)
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.85rem', margin: '10px 0 20px 0', lineHeight: 1.5 }}>
                আপনি চেম্বারে বা ডায়াগনস্টিক সেন্টারের রিসিপশনে সরাসরি <strong>৳{amount}</strong> ক্যাশ প্রদান করতে পারবেন। আপনার সিরিয়াল স্লট নিশ্চিত রাখা হলো।
              </p>
              <button
                className="btn-primary"
                style={{ width: '100%' }}
                onClick={onClose}
              >
                ক্যাশ পেমেন্ট কনফার্ম করুন ✓
              </button>
            </div>
          ) : (
            /* bKash / Nagad Interactive Steps */
            <div className="auth-form">
              {/* Order Info */}
              <div style={{ background: 'var(--slate-50)', padding: '12px', borderRadius: '8px', border: '1px solid var(--slate-200)', fontSize: '0.85rem' }}>
                <div>সেবা: <strong>{doctorOrTestName}</strong></div>
                <div>প্রতিষ্ঠান: <strong>{organizationName}</strong></div>
                <div style={{ marginTop: '4px', fontSize: '1rem', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                  প্রদেয় মোট ফি: ৳{amount}
                </div>
              </div>

              {step === 1 && (
                <>
                  <div className="auth-field">
                    <label>{isBkash ? 'বিকাশ' : 'নগদ'} অ্যাকাউন্ট নম্বর দিন *</label>
                    <div className="auth-input-group">
                      <span className="auth-input-prefix">🇧🇩 +880</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="auth-submit-btn"
                    style={{ background: isBkash ? '#D12053' : '#F7941D' }}
                    onClick={handleNextToOtp}
                  >
                    OTP কোড পাঠান →
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="auth-field">
                    <label>আপনার মোবাইলে পাঠানো ৬-ডিজিটের OTP দিন *</label>
                    <input
                      type="text"
                      placeholder="1 2 3 4 5 6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      autoFocus
                    />
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                    ডেমো OTP: <strong>123456</strong> (যেকোনো ৬ ডিজিট লিখে এগিয়ে যান)
                  </p>
                  <button
                    type="button"
                    className="auth-submit-btn"
                    style={{ background: isBkash ? '#D12053' : '#F7941D' }}
                    onClick={handleNextToPin}
                  >
                    যাচাই করুন ও PIN দিন →
                  </button>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="auth-field">
                    <label>{isBkash ? 'বিকাশ' : 'নগদ'} গোপন PIN কোড দিন *</label>
                    <input
                      type="password"
                      placeholder="••••"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      maxLength={5}
                      autoFocus
                    />
                  </div>
                  <button
                    type="button"
                    className="auth-submit-btn"
                    style={{ background: isBkash ? '#D12053' : '#F7941D' }}
                    onClick={handleExecutePayment}
                    disabled={loading}
                  >
                    {loading ? 'প্রসেসিং হচ্ছে...' : `৳${amount} পেমেন্ট নিশ্চিত করুন ✓`}
                  </button>
                </>
              )}

              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '8px' }}>
                🔒 256-bit SSL এনক্রিপশনে নিরাপদ লেনদেন • কোনো লুকানো চার্জ নেই
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
