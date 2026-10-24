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
  TestTube2,
  MapPin,
  Phone,
  ShieldCheck,
  Clock,
  Stethoscope,
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  Home,
  Info,
  RefreshCw,
  QrCode,
  X,
} from 'lucide-react';
import QRCodeStudio from '@/components/qr/QRCodeStudio';
import { QRService } from '@/services/qr.service';
import { AuthService, AuthUserProfile } from '@/services/auth.service';

interface DiagnosticCenter {
  id: string;
  name: string;
  name_bn?: string;
  slug: string;
  phone: string;
  email?: string;
  has_home_sample_collection: boolean;
  dghs_registration_number?: string;
  trade_license_number?: string;
  description?: string;
  description_bn?: string;
}

interface LabTestItem {
  id: string;
  name: string;
  name_bn?: string;
  category: string;
  sample_type?: string;
  turnaround_hours: number;
  price: number;
  discount_price?: number;
  preparation_instructions?: string;
  preparation_instructions_bn?: string;
  is_home_sample_supported: boolean;
}

interface AffiliatedDoctor {
  id: string;
  fullName: string;
  specialization: string;
  qualifications: string;
  consultationFee: number;
}

export default function DiagnosticCenterDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || '';
  const { language, setLanguage } = useLanguage();

  const cachedCenters = typeof window !== 'undefined' ? getCachedData<any[]>('diagnostic_centers_directory_active_all', true) : null;
  const initialCenter = cachedCenters ? (cachedCenters.find(c => c.id === id || c.slug === id) || null) : null;

  const [center, setCenter] = useState<DiagnosticCenter | null>(initialCenter);
  const [tests, setTests] = useState<LabTestItem[]>([]);
  const [affiliatedDoctors, setAffiliatedDoctors] = useState<AffiliatedDoctor[]>([]);
  const [isLoading, setIsLoading] = useState(!initialCenter);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(null);

  // Strict role-based permission check: verify if the authenticated user is authorized to manage this center's QR code
  const canManageCenterQr = React.useMemo(() => {
    if (!currentUser || !center) return false;
    return QRService.canUserManageQR(currentUser, 'diagnostic_center', center.id, {
      hospitalOwnerId: (center as any).owner_profile_id,
    });
  }, [currentUser, center]);

  useEffect(() => {
    AuthService.getCurrentUser().then((u) => {
      if (u) setCurrentUser(u);
    });

    async function loadCenterData() {
      try {
        const cleanId = (id || '').trim();
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);
        let query = supabase.from('diagnostic_centers').select('*');
        if (isUuid) {
          query = query.eq('id', cleanId);
        } else {
          query = query.eq('slug', cleanId);
        }
        let { data: centerData, error: centerErr } = await query.maybeSingle();

        // Fallback: check qr_code_records if not found by direct slug
        if (!centerData && !isUuid) {
          const { data: qrMatch } = await supabase
            .from('qr_code_records')
            .select('owner_id')
            .eq('owner_type', 'diagnostic_center')
            .eq('public_slug', cleanId)
            .maybeSingle();
          if (qrMatch?.owner_id) {
            const { data: resolvedCenter } = await supabase
              .from('diagnostic_centers')
              .select('*')
              .eq('id', qrMatch.owner_id)
              .maybeSingle();
            if (resolvedCenter) centerData = resolvedCenter;
          }
        }

        if (centerData) {
          setCenter(centerData);

          // Track QR scan telemetry if source=qr
          if (typeof window !== 'undefined' && window.location.search.includes('source=qr')) {
            QRService.recordScanEvent({
              ownerType: 'diagnostic_center',
              ownerId: centerData.id,
              channel: 'camera_scan',
            });
          }

          // Fetch lab tests offered by this diagnostic center
          const { data: testData } = await supabase
            .from('lab_tests')
            .select('*')
            .eq('diagnostic_center_id', centerData.id)
            .eq('status', 'active');

          if (testData) {
            setTests(
              testData.map((t: any) => ({
                id: t.id,
                name: t.name,
                name_bn: t.name_bn,
                category: t.category || 'General Pathology',
                sample_type: t.sample_type,
                turnaround_hours: t.turnaround_hours || 24,
                price: Number(t.price) || 0,
                discount_price: t.discount_price ? Number(t.discount_price) : undefined,
                preparation_instructions: t.preparation_instructions,
                preparation_instructions_bn: t.preparation_instructions_bn,
                is_home_sample_supported: Boolean(t.is_home_sample_supported),
              }))
            );
          }

          // Fetch doctors scheduled at this center
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
            .eq('provider_id', centerData.id)
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
        console.warn('Diagnostic center fetch notice:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadCenterData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
        <Header language={language} setLanguage={setLanguage} activeTab="marketplace" setActiveTab={() => {}} />
        <main style={{ flex: 1, maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '32px 16px 80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#0060FA', fontSize: '13px', fontWeight: 600 }}>
            <RefreshCw size={16} className="animate-spin" />
            <span>{language === 'bn' ? 'ডায়াগনস্টিক সেন্টারের তথ্য ও টেস্ট ক্যাটালগ প্রস্তুত হচ্ছে...' : 'Loading diagnostic center and test catalog...'}</span>
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

  if (!center) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
        <Header language={language} setLanguage={setLanguage} activeTab="marketplace" setActiveTab={() => {}} />
        <main style={{ flex: 1, maxWidth: '600px', margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '48px 24px' }}>
            <TestTube2 size={36} color="#94A3B8" style={{ margin: '0 auto 16px auto' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              {language === 'bn' ? 'ডায়াগনস্টিক সেন্টারটি পাওয়া যায়নি' : 'Diagnostic Center Not Found'}
            </h2>
            <p style={{ color: '#64748B', fontSize: '13.5px', marginBottom: '24px' }}>
              {language === 'bn'
                ? 'অনুরোধকৃত ডায়াগনস্টিক সেন্টারটি মুছে ফেলা হয়েছে অথবা আইডি ভুল রয়েছে।'
                : 'The requested diagnostic center profile does not exist or may have been updated.'}
            </p>
            <Link href="/diagnostic-centers" className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
              {language === 'bn' ? 'সকল ডায়াগনস্টিক সেন্টার দেখুন' : 'Browse Diagnostic Centers'}
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
          href="/diagnostic-centers"
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
          <span>{language === 'bn' ? 'সকল ডায়াগনস্টিক সেন্টারে ফিরে যান' : 'Back to Diagnostic Centers'}</span>
        </Link>

        {/* Hero Card */}
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
                <TestTube2 size={30} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {language === 'bn' && center.name_bn ? center.name_bn : center.name}
                  </h1>
                  {center.dghs_registration_number && (
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
                      <ShieldCheck size={12} />
                      <span>DGHS Reg: {center.dghs_registration_number}</span>
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '13px', marginTop: '6px' }}>
                  <MapPin size={14} color="#0060FA" />
                  <span>
                    {center.name.includes('Moulvibazar')
                      ? 'Moulvibazar, Sylhet Division'
                      : center.name.includes('Sylhet')
                      ? 'Sylhet'
                      : 'Bangladesh'}
                  </span>
                </div>

                {center.has_home_sample_collection && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '8px', color: '#059669', fontSize: '12px', fontWeight: 600 }}>
                    <Home size={14} />
                    <span>{language === 'bn' ? 'হোম স্যাম্পল কালেকশন সুবিধা রয়েছে' : 'Home Sample Collection Available'}</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* QR Management Button: Strictly rendered ONLY for verified center owner/staff or platform admin */}
              {canManageCenterQr && (
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
                  <span>{language === 'bn' ? 'সেন্টার কিউআর কোড' : 'Center QR Code'}</span>
                </button>
              )}

              {center.phone && (
                <a
                  href={`tel:${center.phone}`}
                  className="btn-primary"
                  style={{ padding: '9px 18px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Phone size={14} />
                  <span>Call Diagnostic Desk: {center.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tests & Investigation Catalog */}
        <div style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TestTube2 size={20} color="#0060FA" />
            <span>{language === 'bn' ? 'উপলব্ধ ডায়াগনস্টিক টেস্ট ও মূল্য তালিকা' : 'Available Diagnostic Tests & Official Pricing'}</span>
          </h2>

          {tests.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {tests.map((t) => (
                <div
                  key={t.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '18px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#0060FA', backgroundColor: '#EFF6FF', padding: '2px 8px', borderRadius: '6px' }}>
                        {t.category}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>
                        <Clock size={11} style={{ display: 'inline', marginRight: '3px' }} />
                        {t.turnaround_hours} hrs
                      </span>
                    </div>

                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>
                      {language === 'bn' && t.name_bn ? t.name_bn : t.name}
                    </h3>

                    {t.sample_type && (
                      <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>
                        Sample: {t.sample_type}
                      </div>
                    )}

                    {(t.preparation_instructions || t.preparation_instructions_bn) && (
                      <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 12px', lineHeight: 1.4 }}>
                        {language === 'bn' && t.preparation_instructions_bn
                          ? t.preparation_instructions_bn
                          : t.preparation_instructions}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                      ৳ {t.discount_price || t.price}
                      {t.discount_price && (
                        <span style={{ fontSize: '12px', color: '#94A3B8', textDecoration: 'line-through', marginLeft: '6px' }}>
                          ৳ {t.price}
                        </span>
                      )}
                    </div>
                    {center.phone && (
                      <a
                        href={`tel:${center.phone}`}
                        className="btn-primary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Book Test
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '32px 20px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', color: '#64748B' }}>
              <Info size={24} color="#94A3B8" style={{ margin: '0 auto 8px auto' }} />
              <p style={{ margin: 0, fontSize: '13.5px' }}>
                {language === 'bn'
                  ? 'এই ডায়াগনস্টিক সেন্টারের কোনো পৃথক টেস্ট ক্যাটালগ এখনো অনলাইনে যুক্ত করা হয়নি। সরাসরি সেন্টারে যোগাযোগ করুন।'
                  : 'No specific tests are currently cataloged online for this center. Please call the diagnostic desk directly.'}
              </p>
            </div>
          )}
        </div>

        {/* Specialist Chambers at this center */}
        {affiliatedDoctors.length > 0 && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Stethoscope size={20} color="#0060FA" />
              <span>{language === 'bn' ? 'চেম্বার চিকিৎসকবৃন্দ' : 'Specialist Doctor Chambers at this Center'}</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {affiliatedDoctors.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
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
          </div>
        )}
      {/* Center QR Code Studio Modal - Strictly rendered ONLY when verified authorized */}
      {isQrModalOpen && center && canManageCenterQr && (
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
                ownerType: 'diagnostic_center',
                ownerId: center.id,
                name: language === 'bn' && center.name_bn ? center.name_bn : center.name,
                designation: center.dghs_registration_number ? `DGHS Reg: ${center.dghs_registration_number}` : 'Accredited Diagnostic Facility',
                specialty: `Tests: ${tests.length} Available • Pathology & Imaging`,
                organizationName: 'Diagnostic Care Verified Network',
                publicUrl: QRService.getPublicProfileUrl('diagnostic_center', center.id),
                isVerified: Boolean(center.dghs_registration_number),
              }}
              canManage={canManageCenterQr}
              showAnalyticsSummary={true}
              onClose={() => setIsQrModalOpen(false)}
            />
          </div>
        </div>
      )}
      </main>

      <Footer language={language} />
    </div>
  );
}

