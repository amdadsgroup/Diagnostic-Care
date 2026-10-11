'use client';

import React, { useState } from 'react';
import { Bug, Send, CheckCircle2, MessageSquare, AlertCircle, X } from 'lucide-react';
import { SupportedLanguage } from '@/config/brand';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: SupportedLanguage;
}

export default function PilotFeedbackModal({
  isOpen,
  onClose,
  language = 'bn',
}: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState<'BUG' | 'FEATURE' | 'GENERAL'>('BUG');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const isBn = language === 'bn';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert(isBn ? 'দয়া করে আপনার মতামত বা সমস্যার বিবরণ লিখুন।' : 'Please enter description.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Dispatches to support tickets API endpoint
      await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketType: feedbackType === 'BUG' ? 'TECHNICAL_ISSUE' : 'FEEDBACK',
          senderName: name || 'Pilot User',
          senderPhone: phone || '01886748564',
          message: `[PILOT FEEDBACK - ${feedbackType}]: ${description}`,
        }),
      });
      setIsSubmitted(true);
    } catch {
      // Fallback
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div
        className="modal-container"
        style={{ maxWidth: '520px', width: '95%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          background: 'linear-gradient(135deg, var(--brand-navy-900) 0%, #1e293b 100%)',
          color: 'white',
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bug size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
              {isBn ? 'মতামত বা ত্রুটি রিপোর্ট (Pilot QA)' : 'Feedback & Bug Report (Pilot QA)'}
            </h3>
          </div>
          <button className="modal-close" onClick={onClose} style={{ color: 'white' }}>
            <X size={18} />
          </button>
        </div>

        {isSubmitted ? (
          <div style={{ padding: '36px 24px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', backgroundColor: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={32} color="#059669" />
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-navy-900)', marginBottom: '8px' }}>
              {isBn ? 'ধন্যবাদ! আপনার রিপোর্ট জমা হয়েছে।' : 'Thank you! Report Received.'}
            </h4>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.88rem', marginBottom: '20px' }}>
              {isBn ? 'আমাদের কারিগরি টিম দ্রুত পর্যালোচনা করে প্রয়োজনীয় ব্যবস্থা গ্রহণ করবে।' : 'Our technical operations team will review and resolve this.'}
            </p>
            <button
              onClick={onClose}
              style={{ backgroundColor: 'var(--brand-navy-900)', color: 'white', padding: '10px 24px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer' }}
            >
              {isBn ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {(['BUG', 'FEATURE', 'GENERAL'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFeedbackType(type)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: feedbackType === type ? '2px solid var(--brand-teal-600)' : '1px solid var(--slate-300)',
                    backgroundColor: feedbackType === type ? 'var(--brand-teal-50)' : '#FFFFFF',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: feedbackType === type ? 'var(--brand-teal-700)' : 'var(--slate-600)',
                  }}
                >
                  {type === 'BUG' ? (isBn ? '🐞 ত্রুটি (Bug)' : 'Bug') : type === 'FEATURE' ? (isBn ? '💡 প্রস্তাবনা' : 'Feature') : (isBn ? '💬 সাধারণ' : 'General')}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                {isBn ? 'আপনার নাম (ঐচ্ছিক)' : 'Your Name (Optional)'}
              </label>
              <input
                type="text"
                placeholder={isBn ? 'নাম লিখুন' : 'Enter name'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.88rem' }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                {isBn ? 'মোবাইল নাম্বার (ঐচ্ছিক)' : 'Mobile Phone (Optional)'}
              </label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.88rem' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                {isBn ? 'বিবরণ *' : 'Description *'}
              </label>
              <textarea
                required
                rows={4}
                placeholder={isBn ? 'সমস্যার বিস্তারিত বিবরণ বা পরামর্শ লিখুন...' : 'Describe the issue or suggestion...'}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.88rem', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                backgroundColor: 'var(--brand-teal-600)',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Send size={16} />
              {isSubmitting ? (isBn ? 'জমা হচ্ছে...' : 'Submitting...') : (isBn ? 'রিপোর্ট পাঠান' : 'Submit Report')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
