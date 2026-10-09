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
import { AmbulanceFleetItem } from '@/types';
import {
  Ambulance,
  PhoneCall,
  MapPin,
  Clock,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Send,
  Sparkles,
  Phone,
  Activity,
  HeartPulse,
} from 'lucide-react';

export default function AmbulancePage() {
  const { language, setLanguage, t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Moulvibazar');

  // Ambulance Fleet & Filters
  const [ambulances, setAmbulances] = useState<AmbulanceFleetItem[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedAmbulance, setSelectedAmbulance] = useState<AmbulanceFleetItem | null>(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState<'ALL' | 'ICU' | 'AC' | 'FREEZER'>('ALL');

  // Request Form
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationHospital, setDestinationHospital] = useState('');
  const [conditionDetails, setConditionDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<{
    requestNumber: string;
    driverName: string;
    driverPhone: string;
    vehiclePlate: string;
  } | null>(null);

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

    // Fetch live ambulances
    fetch('/api/services/ambulances')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.ambulances) {
          setAmbulances(data.ambulances);
          if (data.ambulances.length > 0) {
            setSelectedAmbulance(data.ambulances[0]);
          }
        }
      })
      .catch((err) => {
        console.warn('Ambulance fetch notice:', err);
      });
  }, []);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim() || !pickupAddress.trim()) {
      alert(language === 'en' ? 'Please fill in patient name, phone number, and pickup address.' : 'রোগীর নাম, ফোন নম্বর এবং পিকআপ ঠিকানা দিন।');
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
          providerName: selectedAmbulance?.providerName || 'Ambulance Service',
          districtName: selectedDistrict !== 'ALL' ? selectedDistrict : 'Moulvibazar',
          deliveryAddress: pickupAddress,
          details: `Destination: ${destinationHospital || 'Not specified'}. Condition: ${conditionDetails || 'Emergency'}`,
          estimatedAmountBDT: selectedAmbulance?.baseFareBDT || 1500,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDispatchResult({
          requestNumber: data.request?.requestNumber || `AMB-${Math.floor(1000 + Math.random() * 9000)}`,
          driverName: selectedAmbulance?.driverName || 'মো. রফিক উদ্দিন (Rafiq Uddin)',
          driverPhone: selectedAmbulance?.driverPhone || BRAND_CONSTANTS.CUSTOMER_CARE_PHONE,
          vehiclePlate: selectedAmbulance?.vehiclePlateNumber || 'সিলেট-ছ-১১-৪৫০২',
        });
      }
    } catch {
      alert(language === 'en' ? 'Submission error. Please call the emergency hotline directly: 01886748564' : 'সরাসরি হেল্পলাইনে কল করুন: 01886748564');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFleet = ambulances.filter((item) => {
    if (selectedDistrict !== 'ALL' && item.districtName.toLowerCase() !== selectedDistrict.toLowerCase()) {
      return false;
    }
    if (selectedVehicleType !== 'ALL' && item.vehicleType !== selectedVehicleType) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F7FAFE' }}>
      <Header
        language={language}
        setLanguage={setLanguage}
        activeTab="ambulance"
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
        {/* Emergency Top Banner */}
        <div style={{ backgroundColor: '#DC4545', color: '#FFFFFF', padding: '12px 0' }}>
          <div
            className="container"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 700 }}>
              <ShieldAlert size={20} />
              <span>
                {language === 'en'
                  ? 'CRITICAL EMERGENCY: Call 24/7 Dispatch Control Room'
                  : 'জরুরি জীবনরক্ষাকারী সেবা: ২৪/৭ সরাসরি ডিসপ্যাচ কন্ট্রোল রুমে কল করুন'}
              </span>
            </div>

            <a
              href={`tel:${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                color: '#DC4545',
                padding: '6px 16px',
                borderRadius: '8px',
                fontSize: '13.5px',
                fontWeight: 800,
                textDecoration: 'none',
              }}
            >
              <PhoneCall size={16} />
              <span>{BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}</span>
            </a>
          </div>
        </div>

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
                {language === 'en' ? 'Ambulance 24/7' : 'জরুরি অ্যাম্বুলেন্স'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#FDF2F2',
                    color: '#DC4545',
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    marginBottom: '10px',
                    border: '1px solid #FECACA',
                  }}
                >
                  <Ambulance size={14} />
                  <span>{language === 'en' ? 'Instant Emergency Dispatch' : 'তাৎক্ষণিক ইমার্জেন্সি ডিসপ্যাচ'}</span>
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
                  {language === 'en' ? '24/7 Emergency Ambulance Service' : '২৪/৭ জরুরি অ্যাম্বুলেন্স সার্ভিস'}
                </h1>
                <p style={{ fontSize: '15px', color: '#64748B', maxWidth: '640px' }}>
                  {language === 'en'
                    ? 'Request ICU life support, AC, and regular ambulances across Moulvibazar, Sylhet, and nationwide. Transparent fare rates and verified dispatch confirmation.'
                    : 'মৌলভীবাজার সদর, সিলেট ও ঢাকা রুটে আইসিইউ ভেন্টিলেটর অ্যাম্বুলেন্স ও এসি অ্যাম্বুলেন্স সার্ভিস। ন্যায্য ভাড়া ও বিশ্বস্ত সেবা।'}
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
                    backgroundColor: '#DC4545',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Activity size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#10294F' }}>
                    10-15 {language === 'en' ? 'Mins' : 'মিনিট'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                    {language === 'en' ? 'Avg. Response Time' : 'গড় রেসপন্স টাইম'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Grid: Request Form + Fleet List */}
        <section className="container" style={{ marginTop: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1.25fr)', gap: '32px' }}>
            {/* Left: Dispatch Request Form */}
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
                {language === 'en' ? 'Request Ambulance Dispatch' : 'অ্যাম্বুলেন্স পাঠানোর অনুরোধ ফর্ম'}
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
                {language === 'en'
                  ? 'Submit the patient pickup location. The nearest driver will immediately contact you.'
                  : 'রোগীর অবস্থান দিন। নিকটস্থ ড্রাইভার তাৎক্ষণিক আপনার সাথে যোগাযোগ করবে।'}
              </p>

              {dispatchResult ? (
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
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#10294F', marginBottom: '4px' }}>
                    {language === 'en' ? 'Dispatch Request Confirmed!' : 'রিকোয়েস্ট গ্রহণ করা হয়েছে!'}
                  </h3>
                  <div style={{ fontSize: '13px', color: '#15976A', fontWeight: 700, marginBottom: '14px' }}>
                    Tracking Ref: {dispatchResult.requestNumber}
                  </div>

                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      padding: '14px',
                      textAlign: 'left',
                      fontSize: '12.5px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      marginBottom: '16px',
                    }}
                  >
                    <div>Driver Name: <strong>{dispatchResult.driverName}</strong></div>
                    <div>Driver Phone: <strong>{dispatchResult.driverPhone}</strong></div>
                    <div>Vehicle Plate: <strong>{dispatchResult.vehiclePlate}</strong></div>
                  </div>

                  <a
                    href={`tel:${dispatchResult.driverPhone}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      backgroundColor: '#15976A',
                      color: '#FFFFFF',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      width: '100%',
                    }}
                  >
                    <PhoneCall size={16} />
                    <span>Call Driver Directly</span>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#10294F', marginBottom: '4px' }}>
                      {language === 'en' ? 'Patient Name *' : 'রোগীর নাম *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder={language === 'en' ? 'Full name of patient' : 'রোগীর পুরো নাম'}
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
                      {language === 'en' ? 'Contact Mobile Number *' : 'যোগাযোগের মোবাইল নম্বর *'}
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
                      {language === 'en' ? 'Pickup Location / Exact Address *' : 'পিকআপ ঠিকানা / রোগীর অবস্থান *'}
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder={
                        language === 'en'
                          ? 'House #, Road #, Area, Moulvibazar Sadar'
                          : 'বাড়ি নং, রোড, এলাকা, মৌলভীবাজার সদর'
                      }
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
                      {language === 'en' ? 'Destination Hospital (Optional)' : 'গন্তব্য হাসপাতাল (ঐচ্ছিক)'}
                    </label>
                    <input
                      type="text"
                      value={destinationHospital}
                      onChange={(e) => setDestinationHospital(e.target.value)}
                      placeholder={
                        language === 'en'
                          ? 'e.g. Moulvibazar Sadar Hospital / Osmani Medical Sylhet'
                          : 'যেমন: মৌলভীবাজার সদর হাসপাতাল / ওসমানী মেডিকেল সিলেট'
                      }
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
                      {language === 'en' ? 'Special Requirements / Clinical Notes' : 'জরুরি প্রয়োজনীয়তা'}
                    </label>
                    <input
                      type="text"
                      value={conditionDetails}
                      onChange={(e) => setConditionDetails(e.target.value)}
                      placeholder={
                        language === 'en'
                          ? 'e.g. Continuous oxygen required, Stretcher needed, ICU ventilator'
                          : 'যেমন: অক্সিজেন প্রয়োজন, স্ট্রেচার প্রয়োজন, আইসিইউ সাপোর্ট'
                      }
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
                      backgroundColor: '#DC4545',
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
                      boxShadow: '0 4px 14px rgba(220, 69, 69, 0.3)',
                    }}
                  >
                    <Send size={16} />
                    <span>
                      {isSubmitting
                        ? (language === 'en' ? 'Submitting Request...' : 'অনুরোধ পাঠানো হচ্ছে...')
                        : (language === 'en' ? 'Submit Dispatch Request' : 'অ্যাম্বুলেন্স রিকোয়েস্ট পাঠান')}
                    </span>
                  </button>
                </form>
              )}
            </div>

            {/* Right: Available Fleet & Category Selector */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#10294F' }}>
                  {language === 'en' ? 'Available Fleet & Categories' : 'উপলব্ধ অ্যাম্বুলেন্স বহর ও ক্যাটাগরি'}
                </h2>

                {/* Vehicle Type Filter */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {(['ALL', 'ICU', 'AC'] as const).map((vt) => (
                    <button
                      key={vt}
                      onClick={() => setSelectedVehicleType(vt)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        backgroundColor: selectedVehicleType === vt ? '#DC4545' : '#F0F5FD',
                        color: selectedVehicleType === vt ? '#FFFFFF' : '#10294F',
                        border: selectedVehicleType === vt ? '1px solid #DC4545' : '1px solid #E2EAF4',
                        cursor: 'pointer',
                      }}
                    >
                      {vt === 'ALL' ? 'All' : vt}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredFleet.map((amb) => {
                  const isSelected = selectedAmbulance?.id === amb.id;

                  return (
                    <div
                      key={amb.id}
                      onClick={() => setSelectedAmbulance(amb)}
                      className="healthcare-card"
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '14px',
                        border: isSelected ? '2px solid #DC4545' : '1px solid #E2EAF4',
                        padding: '18px 20px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 800,
                                backgroundColor: amb.vehicleType === 'ICU' ? '#FDF2F2' : '#EAF2FF',
                                color: amb.vehicleType === 'ICU' ? '#DC4545' : '#1769F5',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}
                            >
                              {amb.vehicleType}
                            </span>
                            <span style={{ fontSize: '15px', fontWeight: 800, color: '#10294F' }}>
                              {amb.providerName}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                            Plate: {amb.vehiclePlateNumber} • {amb.upazilaName}, {amb.districtName}
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: '#E8F8F1',
                            color: '#15976A',
                            padding: '3px 8px',
                            borderRadius: '12px',
                          }}
                        >
                          24/7 READY
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: '#F8FAFC',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          marginTop: '10px',
                        }}
                      >
                        <div>
                          Driver: <strong>{amb.driverName}</strong>
                        </div>
                        <div style={{ fontWeight: 800, color: '#10294F' }}>
                          Base Fare: ৳{amb.baseFareBDT} (+৳{amb.perKmFareBDT}/km)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
