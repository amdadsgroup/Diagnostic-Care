'use client';

import React, { useState, useEffect } from 'react';
import { HomeCareServiceItem } from '@/types';
import { Home, PhoneCall, CheckCircle2, User, MapPin, Send, Star, ShieldCheck } from 'lucide-react';
import { BRAND_CONSTANTS } from '@/config/brand';

export default function HomeCareBookingModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [services, setServices] = useState<HomeCareServiceItem[]>([]);
  const [selectedService, setSelectedService] = useState<HomeCareServiceItem | null>(null);

  // Form State
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [address, setAddress] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services/homecare');
      const data = await res.json();
      if (data.success) {
        setServices(data.services);
        if (data.services.length > 0 && !selectedService) {
          setSelectedService(data.services[0]);
        }
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    if (isOpen) fetchServices();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone || !address) {
      alert('রোগীর নাম, ফোন নম্বর এবং বাসার ঠিকানা আবশ্যক।');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/services/homecare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          patientPhone,
          providerId: selectedService?.id,
          providerName: selectedService?.providerName,
          districtName: selectedService?.districtName,
          upazilaName: selectedService?.upazilaName,
          deliveryAddress: address,
          details: `${selectedService?.title} - ${instructions}`,
          estimatedAmountBDT: selectedService?.feePerVisitBDT,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBookingSuccess(`রিকোয়েস্ট সফলভাবে গৃহীত হয়েছে (ট্র্যাকিং: ${data.request.requestNumber})। নার্স / থেরাপিস্ট দ্রুত আপনার সাথে ফোনে যোগাযোগ করবেন।`);
      }
    } catch {
      alert('হোম কেয়ার বুকিং ব্যর্থ হয়েছে। সরাসরি হেল্পলাইনে কল করুন: 01886748564');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(11, 37, 69, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          maxWidth: '850px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: 'var(--brand-navy-900, #0B2545)',
            color: '#FFFFFF',
            padding: '20px 24px',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Home size={24} color="#38BDF8" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>হোম নার্সিং ও স্বাস্থ্যসেবা সার্ভিসেস</h2>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                বাসায় বসে দক্ষ নার্সিং, ফিজিওথেরাপি ও পোস্ট-সার্জারি কেয়ার
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
              style={{
                backgroundColor: '#38BDF8',
                color: '#0B2545',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <PhoneCall size={12} />
              {BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}
            </a>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '20px',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px' }}>
          {bookingSuccess ? (
            <div
              style={{
                textAlign: 'center',
                padding: '32px 20px',
                backgroundColor: '#F0FDF4',
                border: '1px solid #86EFAC',
                borderRadius: '12px',
              }}
            >
              <CheckCircle2 size={48} color="#16A34A" style={{ margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#14532D', marginBottom: '8px' }}>
                বুকিং সম্পন্ন হয়েছে!
              </h3>
              <p style={{ color: '#166534', fontSize: '14px', marginBottom: '20px' }}>
                {bookingSuccess}
              </p>
              <button
                onClick={() => {
                  setBookingSuccess(null);
                  onClose();
                }}
                style={{
                  backgroundColor: 'var(--brand-navy-900, #0B2545)',
                  color: '#FFFFFF',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                ঠিক আছে (Close)
              </button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0B2545', marginBottom: '12px' }}>
                কাঙ্ক্ষিত হোম সার্ভিস নির্বাচন করুন:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {services.map((svc) => {
                  const isSelected = selectedService?.id === svc.id;
                  return (
                    <div
                      key={svc.id}
                      onClick={() => setSelectedService(svc)}
                      style={{
                        padding: '14px',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #0284C7' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? '#F0F9FF' : '#FFFFFF',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#0284C7', marginBottom: '4px' }}>
                        {svc.serviceCategory}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0B2545', marginBottom: '4px' }}>
                        {svc.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px', lineHeight: 1.4 }}>
                        {svc.description}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '8px', fontSize: '13px' }}>
                        <strong style={{ color: '#16A34A' }}>৳{svc.feePerVisitBDT} / ভিজিট</strong>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>⭐ {svc.rating} ({svc.reviewCount})</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Patient Form */}
              <form onSubmit={handleSubmit} style={{ backgroundColor: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0B2545', marginBottom: '4px' }}>
                      রোগীর নাম *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="রোগীর নাম"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0B2545', marginBottom: '4px' }}>
                      মোবাইল নম্বর *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0B2545', marginBottom: '4px' }}>
                    বাসার সম্পূর্ণ ঠিকানা (বাড়ি, রোড, এলাকা) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: বাড়ি নং ১২, রোড নং ২, শান্তিবাগ, মৌলভীবাজার সদর"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0B2545', marginBottom: '4px' }}>
                    রোগীর সমস্যা ও চিকিৎসকের কোনো বিশেষ নির্দেশনা থাকলে লিখুন
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ৩ দিন আগে ওপেন হার্ট সার্জারি হয়েছে, ড্রেসিং প্রয়োজন"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: 'var(--brand-navy-900, #0B2545)',
                      color: '#FFFFFF',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Send size={16} />
                    {isSubmitting ? 'প্রসেসিং হচ্ছে...' : 'হোম ভিজিট নিশ্চিত করুন'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
