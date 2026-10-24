'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase/client';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';
import { getCachedData } from '@/lib/cache';
import {
  Building2,
  MapPin,
  Phone,
  ShieldCheck,
  Bed,
  Stethoscope,
  ChevronLeft,
  Mail,
  CheckCircle2,
  RefreshCw,
  QrCode,
  X,
} from 'lucide-react';
import QRCodeStudio from '@/components/qr/QRCodeStudio';
import { QRService } from '@/services/qr.service';

export default function HospitalDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || '';
  const { language, setLanguage } = useLanguage();

  const cachedHospitals = typeof window !== 'undefined' ? getCachedData<any[]>('hospitals_directory_active_all', true) : null;
  const initialHosp = cachedHospitals ? (cachedHospitals.find(h => h.id === id || h.slug === id) || null) : null;

  const [hospital, setHospital] = useState<any | null>(initialHosp);
  const [affiliatedDoctors, setAffiliatedDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(!initialHosp);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  useEffect(() => {
    async function loadHospital() {
      try {
        const { data, error } = await supabase
          .from('hospitals')
          .select('*')
          .or(`id.eq.${id},slug.eq.${id}`)
          .maybeSingle();

        if (!error && data) {
          setHospital(data);

          // Track QR scan telemetry if source=qr
          if (typeof window !== 'undefined' && window.location.search.includes('source=qr')) {
            QRService.recordScanEvent({
              ownerType: 'hospital',
              ownerId: data.id,
              channel: 'camera_scan',
            });
          }

          // Fetch doctors scheduled or associated with this hospital
          const { data: schedData } = await supabase
            .from('doctor_schedules')
            .select(`
              id,
              consultation_fee,
              doctors (
                id,
                specialization,
                qualifications,
                profiles (
                  full_name
                )
              )
            `)
            .eq('provider_id', data.id)
            .eq('is_active', true);

          if (schedData) {
            setAffiliatedDoctors(
              schedData.map((s: any) => ({
                id: s.doctors?.id || s.id,
                fullName: s.doctors?.profiles?.full_name || 'Specialist Doctor',
                specialization: s.doctors?.specialization || 'Consultant',
                qualifications: s.doctors?.qualifications || '',
                consultationFee: s.consultation_fee || 800,
              }))
            );
          }
        }
      } catch (err) {
        console.warn('Hospital detail fetch notice:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadHospital();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
        <Header language={language} setLanguage={setLanguage} activeTab="marketplace" setActiveTab={() => {}} />
        <main style={{ flex: 1, maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '32px 16px 80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#0060FA', fontSize: '13px', fontWeight: 600 }}>
            <RefreshCw size={16} className="animate-spin" />
            <span>{language === 'bn' ? 'হাসপাতালের তথ্য প্রস্তুত করা হচ্ছে...' : 'Loading hospital facilities and departments...'}</span>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '32px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '16px' }}>
              <div className="skeleton-box" style={{ width: '64px', height: '64px', borderRadius: '12px', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton-box" style={{ width: '280px', height: '24px', marginBottom: '10px' }} />
                <div className="skeleton-box" style={{ width: '180px', height: '16px' }} />
              </div>
            </div>
            <div className="skeleton-box" style={{ width: '100%', height: '40px', borderRadius: '8px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[1, 2, 3].map(n => (
              <div key={n} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
                <div className="skeleton-box" style={{ width: '140px', height: '20px', marginBottom: '12px' }} />
                <div className="skeleton-box" style={{ width: '100%', height: '50px', borderRadius: '8px' }} />
              </div>
            ))}
          </div>
        </main>
        <Footer language={language} />
      </div>
    );
  }

  if (!hospital) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
        <Header language={language} setLanguage={setLanguage} activeTab="marketplace" setActiveTab={() => {}} />
        <main style={{ flex: 1, maxWidth: '600px', margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '48px 24px' }}>
            <Building2 size={36} color="#94A3B8" style={{ margin: '0 auto 16px auto' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              {language === 'bn' ? 'হাসপাতালটি পাওয়া যায়নি' : 'Hospital Not Found'}
            </h2>
            <p style={{ color: '#64748B', fontSize: '13.5px', marginBottom: '24px' }}>
              {language === 'bn'
                ? 'অনুরোধকৃত হাসপাতালটি মুছে ফেলা হয়েছে অথবা আইডি ভুল রয়েছে।'
                : 'The requested hospital profile does not exist or may have been updated.'}
            </p>
            <Link href="/hospitals" className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
              {language === 'bn' ? 'সকল হাসপাতাল দেখুন' : 'Browse All Hospitals'}
            </Link>
          </div>
        </main>
        <Footer language={language} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      <Header
        language={language}
        setLanguage={setLanguage}
        activeTab="marketplace"
        setActiveTab={() => {}}
      />

      <main style={{ flex: 1, maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '32px 16px 80px' }}>
        {/* Back Link */}
        <Link
          href="/hospitals"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#64748B',
            fontSize: '13px',
            fontWeight: 600,
            textDecoration: 'none',
            marginBottom: '20px',
          }}
        >
          <ChevronLeft size={16} />
          <span>{language === 'bn' ? 'সকল হাসপাতালে ফিরে যান' : 'Back to Hospitals Directory'}</span>
        </Link>

        {/* Header Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '28px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '10px',
                  backgroundColor: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0060FA',
                  flexShrink: 0,
                }}
              >
                <Building2 size={30} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {language === 'bn' && hospital.name_bn ? hospital.name_bn : hospital.name}
                  </h1>
                  {hospital.dghs_registration_number && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: '#ECFDF5',
                        color: '#047857',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        border: '1px solid #A7F3D0',
                      }}
                    >
                      <ShieldCheck size={13} />
                      <span>DGHS Reg: {hospital.dghs_registration_number}</span>
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '13px', marginTop: '6px' }}>
                  <MapPin size={14} color="#0060FA" />
                  <span>{hospital.name.includes('Moulvibazar') ? 'Moulvibazar, Sylhet Division' : 'Bangladesh'}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className="btn-secondary"
                style={{
                  padding: '9px 14px',
                  fontSize: '13px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                <QrCode size={15} />
                <span>{language === 'bn' ? 'হাসপাতাল কিউআর কোড' : 'Hospital QR Code'}</span>
              </button>

              {hospital.phone && (
                <a
                  href={`tel:${hospital.phone}`}
                  className="btn-primary"
                  style={{ padding: '9px 18px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Phone size={14} />
                  <span>Call Hospital: {hospital.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Hospital Facilities Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
            marginBottom: '32px',
          }}
        >
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', padding: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{ color: '#64748B', fontSize: '12px' }}>Total Beds</div>
            <strong style={{ fontSize: '18px', color: '#0F172A' }}>{hospital.total_beds || 'N/A'}</strong>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', padding: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{ color: '#64748B', fontSize: '12px' }}>ICU Beds</div>
            <strong style={{ fontSize: '18px', color: '#0060FA' }}>{hospital.icu_beds || 'N/A'}</strong>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', padding: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{ color: '#64748B', fontSize: '12px' }}>Emergency Care</div>
            <strong style={{ fontSize: '18px', color: hospital.has_emergency_24_7 ? '#10B981' : '#64748B' }}>
              {hospital.has_emergency_24_7 ? '24/7 Available' : 'Standard Hours'}
            </strong>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', padding: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{ color: '#64748B', fontSize: '12px' }}>NICU Unit</div>
            <strong style={{ fontSize: '18px', color: hospital.has_nicu ? '#10B981' : '#64748B' }}>
              {hospital.has_nicu ? 'Equipped' : 'Not Available'}
            </strong>
          </div>
        </div>

        {/* Affiliated Doctors Section */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
            {language === 'bn' ? 'চেম্বার চিকিৎসকবৃন্দ' : 'Consulting Physicians'}
          </h2>

          {affiliatedDoctors.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {affiliatedDoctors.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '18px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                      {doc.fullName}
                    </h3>
                    <CheckCircle2 size={14} color="#10B981" />
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0060FA', marginTop: '2px' }}>
                    {doc.specialization}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                    {doc.qualifications}
                  </div>
                  <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>Fee: ৳{doc.consultationFee}</span>
                    <Link href={`/doctors/${doc.id}`} className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                      Book Serial
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', color: '#64748B', fontSize: '13.5px', textAlign: 'center' }}>
              {language === 'bn'
                ? 'এই হাসপাতালে কোনো ডাক্তার চেম্বার শিডিউল এখনো অনলাইন করা হয়নি।'
                : 'No doctor chamber schedules currently registered online for this hospital.'}
            </div>
          )}
        </div>

        {/* Hospital QR Code Studio Modal */}
        {isQrModalOpen && hospital && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '16px',
            }}
            onClick={() => setIsQrModalOpen(false)}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                maxWidth: '840px',
                width: '100%',
                maxHeight: '92vh',
                overflowY: 'auto',
                padding: '24px',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsQrModalOpen(false)}
                aria-label="Close QR Studio"
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748B',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>

              <QRCodeStudio
                details={{
                  ownerType: 'hospital',
                  ownerId: hospital.id,
                  name: hospital.name,
                  designation: hospital.dghs_registration_number ? `DGHS Reg: ${hospital.dghs_registration_number}` : 'Accredited Healthcare Hospital',
                  specialty: `Doctors: ${affiliatedDoctors.length} On Duty • 24/7 Emergency`,
                  organizationName: 'Diagnostic Care Verified Network',
                  publicUrl: QRService.getPublicProfileUrl('hospital', hospital.id),
                  isVerified: Boolean(hospital.dghs_registration_number),
                }}
                showAnalyticsSummary={true}
              />
            </div>
          </div>
        )}
      </main>

      <Footer language={language} />
    </div>
  );
}
