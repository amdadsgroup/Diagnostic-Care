'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import AuthModal from '@/components/auth/AuthModal';
import LocationModal from '@/components/location/LocationModal';
import { useLanguage } from '@/context/LanguageContext';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import { BRAND_CONSTANTS, BRAND_COLORS } from '@/config/brand';
import { HomeCareServiceItem } from '@/types';
import {
  Home,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Star,
  Search,
  ChevronRight,
  Sparkles,
  Calendar,
  Send,
  CheckCircle2,
  PhoneCall,
  UserCheck,
  Activity,
  HeartHandshake,
} from 'lucide-react';

export default function HomeCarePage() {
  const { language, setLanguage, t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Moulvibazar');

  // Home Care Services State
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

  useEffect(() => {
    AuthService.getCurrentUser().then((u) => {
      if (u) {
        setCurrentUser(u);
        setPatientName(u.fullName || '');
        setPatientPhone(u.phone || '');
      }
    });

    const savedLoc = localStorage.getItem('dc_user_location');
    if (savedLoc) setSelectedLocation(savedLoc);

    fetch('/api/services/homecare')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.services) {
          setServices(data.services);
          if (data.services.length > 0) {
            setSelectedService(data.services[0]);
          }
        }
      })
      .catch((err) => {
        console.warn('Home care services fetch notice:', err);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim() || !address.trim()) {
      alert(language === 'en' ? 'Please fill in patient name, phone number, and address.' : 'রোগীর নাম, ফোন নম্বর এবং বাসার ঠিকানা আবশ্যক।');
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
          providerName: selectedService?.providerName || 'Home Care Specialist',
          districtName: selectedService?.districtName || 'Moulvibazar',
          upazilaName: selectedService?.upazilaName || 'Moulvibazar Sadar',
          deliveryAddress: address,
          details: `${selectedService?.title || 'Home Healthcare'} - Date: ${visitDate} - Notes: ${instructions}`,
          estimatedAmountBDT: selectedService?.feePerVisitBDT || 400,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBookingSuccess(
          language === 'en'
            ? `Request submitted successfully! Tracking Ref: ${data.request?.requestNumber || 'HC-2026'}. A medical coordinator will call to confirm.`
            : `রিকোয়েস্ট সফলভাবে গৃহীত হয়েছে! ট্র্যাকিং রেফারেন্স: ${data.request?.requestNumber || 'HC-2026'}। দ্রুত কনফার্মেশনের জন্য কল দেওয়া হবে।`
        );
      }
    } catch {
      alert(language === 'en' ? 'Submission error. Please call helpline directly: 01886748564' : 'সরাসরি হেল্পলাইনে কল করুন: 01886748564');
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultServices = [
    {
      id: 'hc-sample-01',
      titleEn: 'Home Sample Collection (Phlebotomy)',
      titleBn: 'বাসায় ল্যাব স্যাম্পল সংগ্রহ (Phlebotomy)',
      descEn: 'Accredited medical technologist collects blood and urine samples at home using sterile equipment.',
      descBn: 'প্রশিক্ষিত টেকনোলজিস্ট জীবাণুমুক্ত উপায়ে বাসায় এসে রক্তের ও প্রস্রাবের স্যাম্পল সংগ্রহ করবেন।',
      feeBDT: 250,
      badge: 'Popular',
    },
    {
      id: 'hc-nurse-02',
      titleEn: 'Professional Home Nursing & Dressing',
      titleBn: 'হোম নার্সিং ও সার্জিক্যাল ড্রেসিং',
      descEn: 'Registered nurse provides surgical wound dressing, catheter change, IV cannula, and injections.',
      descBn: 'অভিজ্ঞ নার্স দ্বারা ক্ষত ড্রেসিং, স্যালাইন পুশ, ইনজেকশন ও ক্যাথেটার সেবা।',
      feeBDT: 500,
      badge: 'Certified Nurse',
    },
    {
      id: 'hc-physio-03',
      titleEn: 'Home Physiotherapy & Rehabilitation',
      titleBn: 'হোম ফিজিওথেরাপি ও রিহ্যাবিলিটেশন',
      descEn: 'Graduate physiotherapist delivers pain relief therapy, stroke recovery, and paralysis mobility exercises.',
      descBn: 'গ্র্যাজুয়েট ফিজিওথেরাপিস্ট দ্বারা প্যারালাইসিস ও ব্যথানাশক ব্যায়াম সেবা।',
      feeBDT: 700,
      badge: 'Therapist',
    },
    {
      id: 'hc-elderly-04',
      titleEn: 'Elderly & Patient Caregiver Support',
      titleBn: 'বয়োবৃদ্ধ ও শয্যাশায়ী রোগীর কেয়ারগিভার',
      descEn: 'Dedicated bedside healthcare attendant for post-surgery and elderly patients.',
      descBn: 'অপারেশন পরবর্তী বা বয়োজ্যেষ্ঠ রোগীর জন্য সার্বক্ষণিক বেডসাইড কেয়ারগিভার।',
      feeBDT: 800,
      badge: 'Daily Care',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F7FAFE' }}>
      <Header
        language={language}
        setLanguage={setLanguage}
        activeTab="homecare"
        setActiveTab={() => {}}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenLocation={() => setIsLocationModalOpen(true)}
        selectedLocation={selectedLocation}
        currentUser={currentUser}
        onLogout={async () => {
          await AuthService.signOut();
          setCurrentUser(null);
        }}
      />

      <main style={{ flex: 1, paddingBottom: '60px' }}>
        {/* Hero Section */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2EAF4',
            padding: '36px 0 32px 0',
          }}
        >
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748B', marginBottom: '12px' }}>
              <Link href="/" style={{ color: '#1769F5', fontWeight: 600 }}>
                {language === 'en' ? 'Home' : 'হোম'}
              </Link>
              <ChevronRight size={14} color="#94A3B8" />
              <span style={{ color: '#10294F', fontWeight: 700 }}>
                {language === 'en' ? 'Home Healthcare' : 'হোম হেলথকেয়ার'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#EAF2FF',
                    color: '#1769F5',
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    marginBottom: '10px',
                  }}
                >
                  <Sparkles size={13} />
                  <span>{language === 'en' ? 'Verified Doorstep Medical Care' : 'দোরগোড়ায় নির্ভরযোগ্য স্বাস্থ্যসেবা'}</span>
                </div>
                <h1
                  style={{
                    fontSize: 'clamp(26px, 3.2vw, 36px)',
                    fontWeight: 800,
                    color: '#10294F',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    marginBottom: '8px',
                  }}
                >
                  {language === 'en' ? 'Home Healthcare & Phlebotomy' : 'বাসায় বসে স্বাস্থ্যসেবা ও ল্যাব স্যাম্পল'}
                </h1>
                <p style={{ fontSize: '15px', color: '#64748B', maxWidth: '640px' }}>
                  {language === 'en'
                    ? 'Receive professional medical care in the comfort of your home. Book certified phlebotomists for blood sample collection, nursing, and physiotherapy in Moulvibazar.'
                    : 'মৌলভীবাজার সদর ও সংলগ্ন এলাকায় অভিজ্ঞ নার্স, ফিজিওথেরাপিস্ট ও ল্যাব টেকনিশিয়ান বাসায় পৌঁছে নির্ভরযোগ্য চিকিৎসাসেবা প্রদান করেন।'}
                </p>
              </div>

              <div
                style={{
                  backgroundColor: '#F0F5FD',
                  border: '1px solid #E2EAF4',
                  borderRadius: '12px',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: '#1769F5',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Home size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#10294F' }}>
                    {language === 'en' ? 'Doorstep Care' : 'বাসায় সেবা'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                    {language === 'en' ? 'Moulvibazar Hub' : 'মৌলভীবাজার সদর ও সিলেট'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content: Services List + Booking Request Form */}
        <section className="container" style={{ marginTop: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)', gap: '32px' }}>
            {/* Left: Available Services Cards */}
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#10294F', marginBottom: '16px' }}>
                {language === 'en' ? 'Select a Home Healthcare Service' : 'হোম হেলথকেয়ার সেবা নির্বাচন করুন'}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {defaultServices.map((srv) => (
                  <div
                    key={srv.id}
                    className="healthcare-card"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '14px',
                      border: '1px solid #E2EAF4',
                      padding: '20px',
                      boxShadow: '0 2px 8px rgba(16, 41, 79, 0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            backgroundColor: '#EAF2FF',
                            color: '#1769F5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <HeartHandshake size={20} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#10294F', margin: 0 }}>
                            {language === 'en' ? srv.titleEn : srv.titleBn}
                          </h3>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#1769F5',
                              backgroundColor: '#EAF2FF',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              display: 'inline-block',
                              marginTop: '2px',
                            }}
                          >
                            {srv.badge}
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '17px', fontWeight: 800, color: '#10294F' }}>
                          ৳ {srv.feeBDT}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>per visit</div>
                      </div>
                    </div>

                    <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: '10px 0 0 0' }}>
                      {language === 'en' ? srv.descEn : srv.descBn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Booking Form */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2EAF4',
                padding: '28px',
                boxShadow: '0 4px 20px rgba(16, 41, 79, 0.05)',
                height: 'fit-content',
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#10294F', marginBottom: '6px' }}>
                {language === 'en' ? 'Book Home Service' : 'হোম ভিজিট বুকিং ফর্ম'}
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
                {language === 'en'
                  ? 'Enter patient information and convenient visit date. Our team will verify and dispatch.'
                  : 'রোগীর তথ্য ও সুবিধাজনক তারিখ দিন। আমাদের সমন্বয়কারী দ্রুত নিশ্চিত করবেন।'}
              </p>

              {bookingSuccess ? (
                <div
                  style={{
                    backgroundColor: '#E8F8F1',
                    border: '1px solid #C4EED9',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ color: '#15976A', marginBottom: '8px' }}>
                    <CheckCircle2 size={36} style={{ margin: '0 auto' }} />
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#10294F', marginBottom: '8px' }}>
                    {language === 'en' ? 'Home Visit Requested!' : 'বুকিং সম্পন্ন হয়েছে!'}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                    {bookingSuccess}
                  </p>
                  <button
                    onClick={() => setBookingSuccess(null)}
                    style={{
                      backgroundColor: '#1769F5',
                      color: '#FFFFFF',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    Done ✓
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#10294F', marginBottom: '4px' }}>
                      {language === 'en' ? 'Patient Full Name *' : 'রোগীর নাম *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Md. Tanvir Ahmed"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '13.5px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#10294F', marginBottom: '4px' }}>
                      {language === 'en' ? 'Contact Phone Number *' : 'মোবাইল নম্বর *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '13.5px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#10294F', marginBottom: '4px' }}>
                      {language === 'en' ? 'Home Address *' : 'বাসার পূর্ণাঙ্গ ঠিকানা *'}
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House #, Road #, Berirpar, Moulvibazar Sadar"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '13.5px',
                        outline: 'none',
                        resize: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#10294F', marginBottom: '4px' }}>
                      {language === 'en' ? 'Preferred Visit Date *' : 'সুবিধাজনক তারিখ *'}
                    </label>
                    <input
                      type="date"
                      required
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '13.5px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#10294F', marginBottom: '4px' }}>
                      {language === 'en' ? 'Special Instructions (Tests or Procedures)' : 'অতিরিক্ত বিবরণ'}
                    </label>
                    <input
                      type="text"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g. Fasting CBC blood draw at 8 AM, catheter flush"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '13.5px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: '#1769F5',
                      color: '#FFFFFF',
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: 800,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginTop: '6px',
                      boxShadow: '0 4px 14px rgba(23, 105, 245, 0.25)',
                    }}
                  >
                    <Send size={16} />
                    <span>
                      {isSubmitting
                        ? (language === 'en' ? 'Submitting...' : 'জমা দেওয়া হচ্ছে...')
                        : (language === 'en' ? 'Book Home Service' : 'হোম সার্ভিস বুক করুন')}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          language={language}
          onLoginSuccess={(u) => {
            setCurrentUser(u);
            setIsAuthModalOpen(false);
          }}
        />
      )}

      {/* Location Modal */}
      {isLocationModalOpen && (
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          currentLocation={selectedLocation}
          onSelectLocation={(loc) => {
            setSelectedLocation(loc);
            localStorage.setItem('dc_user_location', loc);
            setIsLocationModalOpen(false);
          }}
          language={language}
        />
      )}

      <Footer language={language} setLanguage={setLanguage} />
    </div>
  );
}
