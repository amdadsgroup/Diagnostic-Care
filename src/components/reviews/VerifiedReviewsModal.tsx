'use client';

import React, { useState, useEffect } from 'react';
import { BRAND } from '@/config/brand';
import { ReviewItem } from '@/types/extended';

interface VerifiedReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorOrCenterName?: string;
}

export default function VerifiedReviewsModal({
  isOpen,
  onClose,
  doctorOrCenterName = 'ডাঃ আনিসুর রহমান',
}: VerifiedReviewsModalProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [appointmentId, setAppointmentId] = useState('apt-completed-1');
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    if (isOpen) fetchReviews();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId,
          patientName: 'তানভীর আহমেদ',
          isAnonymous,
          doctorName: doctorOrCenterName,
          organizationName: 'পপুলার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার)',
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess('✓ আপনার ভেরিফাইড রিভিউ সফলভাবে প্রকাশিত হয়েছে!');
        setComment('');
        fetchReviews();
      } else {
        setSubmitError(data.error || 'রিভিউ জমাদানে সমস্যা হয়েছে।');
      }
    } catch {
      setSubmitError('সার্ভারে যোগাযোগ ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-container-wide" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>ভেরিফাইড পেশেন্ট রিভিউ (Verified Patient Reviews)</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>{doctorOrCenterName}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Policy Banner */}
          <div style={{ background: 'var(--brand-teal-50)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--brand-teal-500)', fontSize: '0.82rem', color: 'var(--brand-navy-900)', marginBottom: '16px' }}>
            🛡️ <strong>Zero Fake Reviews Invariant:</strong> Diagnostic Care প্ল্যাটফর্মে শুধুমাত্র কনসালটেশন বা টেস্ট সম্পন্নকারী ভেরিফাইড রোগীরাই তাদের রসিদ/অ্যাপয়েন্টমেন্টের বিপরীতে মতামত প্রকাশ করতে পারেন।
          </div>

          {/* New Review Form */}
          <form onSubmit={handleSubmit} style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: '10px', border: '1px solid var(--slate-200)', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--brand-navy-900)', marginBottom: '10px' }}>
              আপনার চিকিৎসা অভিজ্ঞতার মূল্যায়ন লিখুন
            </h4>

            {submitError && <div className="auth-error" style={{ marginBottom: '10px' }}>{submitError}</div>}
            {submitSuccess && <div className="auth-success" style={{ marginBottom: '10px' }}>{submitSuccess}</div>}

            {/* Rating Stars */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '4px' }}>
                রেটিং (১ থেকে ৫ স্টার):
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    style={{
                      fontSize: '1.4rem',
                      color: s <= rating ? 'var(--brand-amber-500)' : 'var(--slate-300)',
                      cursor: 'pointer',
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="auth-field" style={{ marginBottom: '10px' }}>
              <label>আপনার মতামত / পরামর্শ *</label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="ডাক্তারের ব্যবহার, পরামর্শের মান ও চেম্বারের পরিবেশ সম্পর্কে লিখুন..."
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--slate-700)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                নাম গোপন রাখুন (Anonymous Review)
              </label>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ fontSize: '0.82rem', padding: '8px 16px' }}
              >
                {loading ? 'জমা হচ্ছে...' : 'রিভিউ সাবমিট করুন ✓'}
              </button>
            </div>
          </form>

          {/* List of Reviews */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--brand-navy-900)', marginBottom: '12px' }}>
              সকল প্রকাশিত রিভিউ ({reviews.length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reviews.map((rev) => (
                <div key={rev.id} style={{ background: 'white', padding: '14px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--brand-navy-900)' }}>
                        {rev.isAnonymous ? 'গোপন রোগী (Anonymous Patient)' : rev.patientName}
                      </span>
                      {rev.isVerified && (
                        <span style={{ background: 'var(--brand-emerald-50)', color: '#065f46', fontSize: '0.7rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--brand-emerald-500)' }}>
                          ✓ ভেরিফাইড অ্যাপয়েন্টমেন্ট
                        </span>
                      )}
                    </div>
                    <span style={{ color: 'var(--brand-amber-500)', fontWeight: 800, fontSize: '0.9rem' }}>
                      {'★'.repeat(rev.rating)}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-700)', lineHeight: 1.5 }}>
                    {rev.comment}
                  </p>

                  <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)', marginTop: '6px' }}>
                    ইস্যু: {new Date(rev.createdAt).toLocaleDateString('bn-BD')} • প্রতিষ্ঠান: {rev.organizationName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
