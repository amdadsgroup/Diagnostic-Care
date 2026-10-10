'use client';

import React, { useState } from 'react';
import { SupportedLanguage, BRAND_CONSTANTS } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';
import {
  MapPin,
  Navigation,
  Phone,
  Building2,
  TestTube2,
  Ambulance,
  Pill,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';

interface FacilityPin {
  id: string;
  name: string;
  type: 'DOCTOR_CHAMBER' | 'HOSPITAL_OPD';
  location: string;
  upazila: string;
  district: string;
  phone: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  coordinates: { x: number; y: number }; // percentage on stylized map
  features: string[];
  openStatus: string;
}

const SAMPLE_FACILITIES: FacilityPin[] = [
  {
    id: 'fac-1',
    name: 'Popular Diagnostic Center — Specialist Doctor Chambers',
    type: 'DOCTOR_CHAMBER',
    location: 'Court Road, Moulvibazar Sadar',
    upazila: 'Moulvibazar Sadar',
    district: 'Moulvibazar',
    phone: BRAND_CONSTANTS.CUSTOMER_CARE_PHONE,
    rating: 4.9,
    reviewCount: 142,
    distanceKm: 0.8,
    coordinates: { x: 50, y: 48 },
    features: ['Cardiology Chambers', 'Medicine Specialists', 'Gynecology OPD', 'Real-time Queue'],
    openStatus: 'Doctor Chambers Active (4:00 PM - 10:00 PM)',
  },
  {
    id: 'fac-2',
    name: 'Moulvibazar 250 Bed District Sadar Hospital — Specialist Wing',
    type: 'HOSPITAL_OPD',
    location: 'Hospital Road, Moulvibazar',
    upazila: 'Moulvibazar Sadar',
    district: 'Moulvibazar',
    phone: BRAND_CONSTANTS.CUSTOMER_CARE_PHONE,
    rating: 4.6,
    reviewCount: 218,
    distanceKm: 1.2,
    coordinates: { x: 42, y: 40 },
    features: ['General Medicine OPD', 'Pediatrics Wing', 'Orthopedics & Trauma', 'Consultant OPD'],
    openStatus: 'OPD Consultations (8:00 AM - 2:30 PM)',
  },
  {
    id: 'fac-3',
    name: 'Sreemangal Specialist Doctor Consultation Chambers',
    type: 'DOCTOR_CHAMBER',
    location: 'College Road, Sreemangal',
    upazila: 'Sreemangal',
    district: 'Moulvibazar',
    phone: BRAND_CONSTANTS.CUSTOMER_CARE_PHONE,
    rating: 4.8,
    reviewCount: 89,
    distanceKm: 19.5,
    coordinates: { x: 38, y: 72 },
    features: ['Visiting Specialists', 'Pediatric Care', 'Diabetology Chamber', 'Digital Booking'],
    openStatus: 'Open (4:30 PM - 9:30 PM)',
  },
  {
    id: 'fac-4',
    name: 'Central Clinic & Doctor Chambers Complex',
    type: 'DOCTOR_CHAMBER',
    location: 'Chowmuhani Point, Moulvibazar',
    upazila: 'Moulvibazar Sadar',
    district: 'Moulvibazar',
    phone: BRAND_CONSTANTS.CUSTOMER_CARE_PHONE,
    rating: 4.7,
    reviewCount: 64,
    distanceKm: 0.5,
    coordinates: { x: 54, y: 55 },
    features: ['Cardiology OPD', 'Dermatology Chamber', 'ENT Specialist', 'BMDC Registered'],
    openStatus: 'Evening Chambers (5:00 PM - 10:00 PM)',
  },
  {
    id: 'fac-5',
    name: 'Kulaura Specialist Medical Chambers',
    type: 'DOCTOR_CHAMBER',
    location: 'Main Road, Kulaura Upazila',
    upazila: 'Kulaura',
    district: 'Moulvibazar',
    phone: BRAND_CONSTANTS.CUSTOMER_CARE_PHONE,
    rating: 4.9,
    reviewCount: 110,
    distanceKm: 28.1,
    coordinates: { x: 62, y: 35 },
    features: ['Visiting Professor Chambers', 'Child Specialists', 'Medicine & Heart', 'Digital Serial'],
    openStatus: 'Consultation Open (3:00 PM - 9:00 PM)',
  },
];

export default function MapDiscovery({
  language,
  onSelectFacility,
}: {
  language: SupportedLanguage;
  onSelectFacility?: (facility: FacilityPin) => void;
}) {
  const t = TRANSLATIONS[language];
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedFacility, setSelectedFacility] = useState<FacilityPin>(SAMPLE_FACILITIES[0]);

  const filteredFacilities = SAMPLE_FACILITIES.filter(
    (f) => filterType === 'ALL' || f.upazila.includes(filterType) || f.type === filterType
  );

  return (
    <section style={{ margin: '48px 0' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#0891B2',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '4px',
            }}
          >
            CHAMBER NETWORK MAP
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--navy-900)' }}>
            {language === 'en' ? 'Specialist Doctor Chambers Across Moulvibazar' : 'মৌলভীবাজারের বিশেষজ্ঞ ডাক্তার চেম্বার নেটওয়ার্ক'}
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--slate-500)', marginTop: '2px' }}>
            {language === 'en' ? 'Locate verified medical consultation chambers with real-time queue tracking' : 'রিয়েল-টাইম সিরিয়াল ট্র্যাকিং সুবিধাসহ ভেরিফায়েড বিশেষজ্ঞ চেম্বার ও ক্লিনিক'}
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: language === 'en' ? 'All Chambers' : 'সকল চেম্বার' },
            { id: 'Sadar', label: language === 'en' ? 'Moulvibazar Sadar' : 'মৌলভীবাজার সদর' },
            { id: 'Sreemangal', label: language === 'en' ? 'Sreemangal' : 'শ্রীমঙ্গল' },
            { id: 'Kulaura', label: language === 'en' ? 'Kulaura' : 'কুলাউড়া' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                background: filterType === item.id ? 'var(--navy-900)' : 'var(--slate-100)',
                color: filterType === item.id ? '#FFFFFF' : 'var(--slate-700)',
                border: filterType === item.id ? '1px solid var(--navy-900)' : '1px solid var(--slate-200)',
                cursor: 'pointer',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map + Facility Card Split Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: '20px',
          background: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid var(--slate-200)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
        }}
        className="map-layout-responsive"
      >
        {/* Interactive Stylized Healthcare Map Canvas */}
        <div
          style={{
            minHeight: '440px',
            background: 'linear-gradient(135deg, #0A1628 0%, #0F1F38 100%)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '20px',
          }}
        >
          {/* Stylized Grid Lines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '36px 36px',
              pointerEvents: 'none',
            }}
          />

          {/* Regional Hub Overlay Badge */}
          <div
            style={{
              position: 'relative',
              zIndex: 3,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(10, 22, 40, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(6, 182, 212, 0.35)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#67E8F9',
              alignSelf: 'flex-start',
            }}
          >
            <span className="beacon-dot cyan" style={{ width: '6px', height: '6px' }} />
            <span>MOULVIBAZAR & SYLHET DIVISION NODE MAP</span>
          </div>

          {/* Map Pins */}
          <div style={{ position: 'absolute', inset: '40px 30px', zIndex: 4 }}>
            {filteredFacilities.map((fac) => {
              const isSelected = selectedFacility.id === fac.id;
              const isHospitalOpd = fac.type === 'HOSPITAL_OPD';
              const pinColor = isHospitalOpd ? '#0284C7' : '#0060FA';

              return (
                <div
                  key={fac.id}
                  onClick={() => setSelectedFacility(fac)}
                  style={{
                    position: 'absolute',
                    left: `${fac.coordinates.x}%`,
                    top: `${fac.coordinates.y}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: isSelected ? 10 : 5,
                  }}
                >
                  {/* Pin Bubble */}
                  <div
                    style={{
                      width: isSelected ? '44px' : '34px',
                      height: isSelected ? '44px' : '34px',
                      borderRadius: '50%',
                      background: isSelected ? pinColor : 'rgba(10, 22, 40, 0.9)',
                      border: `2px solid ${pinColor}`,
                      color: isSelected ? '#FFFFFF' : pinColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isSelected
                        ? `0 0 20px ${pinColor}`
                        : '0 4px 10px rgba(0,0,0,0.4)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Building2 size={isSelected ? 20 : 16} />
                  </div>

                  {/* Pin Tooltip */}
                  <div
                    style={{
                      background: 'rgba(5, 12, 22, 0.85)',
                      backdropFilter: 'blur(6px)',
                      border: `1px solid ${isSelected ? pinColor : 'rgba(255,255,255,0.15)'}`,
                      borderRadius: '6px',
                      padding: '2px 8px',
                      fontSize: '10px',
                      fontWeight: 700,
                      color: isSelected ? '#FFFFFF' : '#CBD5E1',
                      marginTop: '4px',
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                    }}
                  >
                    {fac.name.split('(')[0].trim()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Map Legend */}
          <div
            style={{
              position: 'relative',
              zIndex: 3,
              display: 'flex',
              gap: '12px',
              fontSize: '11px',
              color: '#94A3B8',
              flexWrap: 'wrap',
              background: 'rgba(5, 12, 22, 0.75)',
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              alignSelf: 'flex-start',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06B6D4' }} />
              Diagnostic Lab
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6' }} />
              Hospital
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
              Pharmacy
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
              Ambulance Hub
            </span>
          </div>
        </div>

        {/* Selected Facility Profile Card */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span
                style={{
                  background: 'var(--cyan-50)',
                  color: '#0891B2',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                }}
              >
                {selectedFacility.type.replace('_', ' ')}
              </span>
              <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>
                ★ {selectedFacility.rating} ({selectedFacility.reviewCount} Verified Reviews)
              </span>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '4px' }}>
              {selectedFacility.name}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--slate-600)', marginBottom: '14px' }}>
              <MapPin size={14} color="#0891B2" />
              <span>{selectedFacility.location}</span>
              <span style={{ color: 'var(--slate-400)' }}>•</span>
              <strong style={{ color: 'var(--navy-900)' }}>~{selectedFacility.distanceKm} km away</strong>
            </div>

            {/* Operating Hours / Emergency Status */}
            <div
              style={{
                background: 'var(--slate-50)',
                border: '1px solid var(--slate-200)',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '12px',
                color: 'var(--slate-700)',
                marginBottom: '16px',
              }}
            >
              <div style={{ fontWeight: 700, color: '#065F46', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span className="beacon-dot green" style={{ width: '6px', height: '6px' }} />
                <span>{selectedFacility.openStatus}</span>
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--slate-500)' }}>
                Official Verified Facility on Diagnostic Care Network
              </div>
            </div>

            {/* Clinical Capabilities / Features */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '8px' }}>
                Available Services & Departments:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedFacility.features.map((feat, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'var(--slate-100)',
                      color: 'var(--navy-900)',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    ✓ {feat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div
            style={{
              paddingTop: '20px',
              borderTop: '1px solid var(--slate-200)',
              display: 'flex',
              gap: '10px',
            }}
          >
            <a
              href={`tel:${selectedFacility.phone}`}
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'var(--navy-900)',
                color: '#FFFFFF',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <Phone size={14} />
              <span>{t.callFacility}</span>
            </a>

            <button
              onClick={() => {
                if (onSelectFacility) {
                  onSelectFacility(selectedFacility);
                } else {
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      selectedFacility.name + ', ' + selectedFacility.upazila + ', ' + selectedFacility.district + ', Bangladesh'
                    )}`,
                    '_blank'
                  );
                }
              }}
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'var(--cyan-50)',
                color: '#0891B2',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Navigation size={14} />
              <span>{t.getDirections}</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 850px) {
          .map-layout-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
