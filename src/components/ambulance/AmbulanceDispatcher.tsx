'use client';

import React, { useState, useEffect } from 'react';
import { BRAND_CONSTANTS } from '@/config/brand';
import { AmbulanceFleetItem } from '@/types';
import { Ambulance, PhoneCall, MapPin, CheckCircle2, ShieldAlert, Clock, AlertTriangle, Send } from 'lucide-react';

export default function AmbulanceDispatcher({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [ambulances, setAmbulances] = useState<AmbulanceFleetItem[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedAmbulance, setSelectedAmbulance] = useState<AmbulanceFleetItem | null>(null);

  // Form State
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [emergencyDetails, setEmergencyDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState<{
    requestNumber: string;
    driverName: string;
    driverPhone: string;
    vehiclePlate: string;
  } | null>(null);

  const fetchAmbulances = async () => {
    try {
      const url = selectedDistrict === 'ALL' ? '/api/services/ambulances' : `/api/services/ambulances?district=${selectedDistrict}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setAmbulances(data.ambulances);
        if (data.ambulances.length > 0 && !selectedAmbulance) {
          setSelectedAmbulance(data.ambulances[0]);
        }
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAmbulances();
    }
  }, [isOpen, selectedDistrict]);

  if (!isOpen) return null;

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone || !pickupAddress) {
      alert('রোগীর নাম, ফোন নম্বর এবং পিকআপ ঠিকানা আবশ্যক।');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/services/ambulances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          patientPhone,
          providerId: selectedAmbulance?.id,
          providerName: selectedAmbulance?.providerName,
          districtName: selectedAmbulance?.districtName,
          upazilaName: selectedAmbulance?.upazilaName,
          deliveryAddress: pickupAddress,
          details: emergencyDetails,
          estimatedAmountBDT: selectedAmbulance?.baseFareBDT,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDispatchSuccess({
          requestNumber: data.request.requestNumber,
          driverName: selectedAmbulance?.driverName || 'মো. রফিক উদ্দিন',
          driverPhone: selectedAmbulance?.driverPhone || BRAND_CONSTANTS.CUSTOMER_CARE_PHONE,
          vehiclePlate: selectedAmbulance?.vehiclePlateNumber || 'সিলেট-ছ-১১-৪৫০২',
        });
      }
    } catch (err: any) {
      alert('অ্যাম্বুলেন্স ডেসপ্যাচ ব্যর্থ হয়েছে। সরাসরি হেল্পলাইনে কল করুন: 01886748564');
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
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: '#DC2626',
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
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ambulance size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '19px', fontWeight: 900 }}>
                  ২৪/৭ জরুরি অ্যাম্বুলেন্স ডেসপ্যাচ হাব
                </h2>
                <span
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#DC2626',
                    fontSize: '10px',
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: '12px',
                  }}
                >
                  LIVE DISPATCH
                </span>
              </div>
              <p style={{ fontSize: '13px', opacity: 0.9, marginTop: '2px' }}>
                মৌলভীবাজার, সিলেট ও সারাদেশে আইসিইউ ও এসি অ্যাম্বুলেন্স তাৎক্ষণিক বুকিং
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#DC2626',
                padding: '8px 14px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '13px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <PhoneCall size={14} />
              {BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}
            </a>

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '22px',
                cursor: 'pointer',
                fontWeight: 700,
                padding: '4px',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px' }}>
          {dispatchSuccess ? (
            <div
              style={{
                textAlign: 'center',
                padding: '24px',
                backgroundColor: '#F0FDF4',
                border: '1px solid #86EFAC',
                borderRadius: '12px',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#22C55E',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#14532D', marginBottom: '8px' }}>
                অ্যাম্বুলেন্স সফলভাবে রওয়ানা হয়েছে!
              </h3>
              <p style={{ color: '#166534', fontSize: '14px', marginBottom: '24px' }}>
                ড্রাইভারকে আপনার মোবাইল নম্বর প্রদান করা হয়েছে। রোগী প্রস্তুত রাখুন।
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  maxWidth: '600px',
                  margin: '0 auto 24px auto',
                  textAlign: 'left',
                }}
              >
                <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>ট্র্যাকিং নম্বর</div>
                  <strong style={{ fontSize: '16px', color: '#0B2545' }}>{dispatchSuccess.requestNumber}</strong>
                </div>

                <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>ড্রাইভারের নাম ও ফোন</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0B2545' }}>
                    {dispatchSuccess.driverName}
                  </div>
                  <a href={`tel:${dispatchSuccess.driverPhone}`} style={{ color: '#DC2626', fontWeight: 700, fontSize: '13px' }}>
                    📞 {dispatchSuccess.driverPhone}
                  </a>
                </div>

                <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>গাড়ির নাম্বার প্লেট</div>
                  <strong style={{ fontSize: '15px', color: '#15803D' }}>{dispatchSuccess.vehiclePlate}</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  setDispatchSuccess(null);
                  onClose();
                }}
                style={{
                  backgroundColor: '#0B2545',
                  color: '#FFFFFF',
                  padding: '12px 28px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                সম্পন্ন করুন (Close)
              </button>
            </div>
          ) : (
            <div>
              {/* Region Selector */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0B2545' }}>
                  অঞ্চল অনুযায়ী প্রস্তুত অ্যাম্বুলেন্স নির্বাচন করুন:
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['ALL', 'Moulvibazar', 'Sylhet', 'Dhaka'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDistrict(d)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 700,
                        backgroundColor: selectedDistrict === d ? '#DC2626' : '#F1F5F9',
                        color: selectedDistrict === d ? '#FFFFFF' : '#475569',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {d === 'ALL' ? 'সারাদেশ' : d === 'Moulvibazar' ? 'মৌলভীবাজার' : d === 'Sylhet' ? 'সিলেট' : 'ঢাকা'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fleet Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                {ambulances.map((amb) => {
                  const isSelected = selectedAmbulance?.id === amb.id;
                  return (
                    <div
                      key={amb.id}
                      onClick={() => setSelectedAmbulance(amb)}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #DC2626' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? '#FEF2F2' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: amb.vehicleType === 'ICU' ? '#FEE2E2' : '#E0F2FE',
                            color: amb.vehicleType === 'ICU' ? '#B91C1C' : '#0369A1',
                          }}
                        >
                          {amb.vehicleType} AMBULANCE
                        </span>
                        <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700 }}>● প্রস্তুত (Ready)</span>
                      </div>

                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0B2545', marginBottom: '4px' }}>
                        {amb.providerName}
                      </div>

                      <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                        <MapPin size={12} color="#DC2626" />
                        {amb.districtName} ({amb.upazilaName})
                      </div>

                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#B91C1C', borderTop: '1px solid #E2E8F0', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>বেস ভাড়া: ৳{amb.baseFareBDT}</span>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>৳{amb.perKmFareBDT}/কিমি</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Fast Dispatch Form */}
              <form onSubmit={handleDispatch} style={{ backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0B2545', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Send size={16} color="#DC2626" />
                  রোগীর তথ্য ও পিকআপ ঠিকানা প্রদান করুন
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' }}>
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
                      যোগাযোগের মোবাইল নম্বর *
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

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0B2545', marginBottom: '4px' }}>
                    পিকআপ লোকেশন / পূর্ণ ঠিকানা *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="বাড়ি নং, রোড নং, এলাকা/উপজেলা, জেলা"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '14px',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                    }}
                  >
                    <Ambulance size={18} />
                    {isSubmitting ? 'ডেসপ্যাচ হচ্ছে...' : 'জরুরি অ্যাম্বুলেন্স কল ডেসপ্যাচ করুন'}
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
