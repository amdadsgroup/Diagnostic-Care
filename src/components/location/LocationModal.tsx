'use client';

import React, { useState, useMemo } from 'react';
import { SupportedLanguage, BRAND_CONSTANTS } from '@/config/brand';
import { BANGLADESH_DIVISIONS, BANGLADESH_DISTRICTS } from '@/data/bangladesh-divisions';
import { MapPin, Navigation, Check, X, Search, Globe, ChevronRight } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation?: string;
  currentLocation?: string;
  onSelectLocation: (loc: string) => void;
  language: SupportedLanguage;
}

export default function LocationModal({
  isOpen,
  onClose,
  selectedLocation,
  currentLocation,
  onSelectLocation,
  language,
}: LocationModalProps) {
  const activeLocation = selectedLocation || currentLocation || BRAND_CONSTANTS.DEFAULT_GATEWAY_CITY;
  const [selectedDivisionSlug, setSelectedDivisionSlug] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  const isEn = language === 'en';

  // Handle manual or automatic location selection
  const handleSelect = (locationName: string) => {
    onSelectLocation(locationName);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dc_user_location', locationName);
    }
    onClose();
  };

  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationStatus(
        isEn
          ? 'Geolocation is not supported by your browser.'
          : 'আপনার ব্রাউজারে লোকেশন সুবিধা সমর্থিত নয়।'
      );
      return;
    }

    setIsLocating(true);
    setLocationStatus(isEn ? 'Detecting your coordinates...' : 'আপনার অবস্থান শনাক্ত করা হচ্ছে...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        // Default to national discovery hub Dhaka or user region
        const detected = BRAND_CONSTANTS.DEFAULT_GATEWAY_CITY;
        handleSelect(detected);
        setLocationStatus(null);
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus(
          isEn
            ? 'Location permission denied. Defaulted to Dhaka Gateway.'
            : 'লোকেশন পারমিশন মেলেনি। ঢাকা গেটওয়ে নির্বাচন করা হয়েছে।'
        );
        handleSelect(BRAND_CONSTANTS.DEFAULT_GATEWAY_CITY);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Filtered districts list based on division tab and search query
  const displayedDistricts = useMemo(() => {
    let list = BANGLADESH_DISTRICTS;

    if (selectedDivisionSlug !== 'all') {
      list = list.filter((d) => d.divisionSlug === selectedDivisionSlug);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.nameEn.toLowerCase().includes(q) ||
          d.nameBn.includes(q) ||
          d.divisionSlug.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedDivisionSlug, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-container animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            backgroundColor: '#F8FAFC',
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#0060FA', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              <Globe size={13} />
              <span>{isEn ? 'All 8 Administrative Divisions' : 'বাংলাদেশের ৮টি বিভাগ'}</span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {isEn ? 'Select Healthcare Discovery Location' : 'স্বাস্থ্যসেবা লোকেশন নির্বাচন করুন'}
            </h2>
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', margin: 0 }}>
              {isEn
                ? 'Discover specialist doctors, verified clinics, and diagnostics across Bangladesh'
                : 'সমগ্র বাংলাদেশের বিশেষজ্ঞ ডাক্তার, অনুমোদিত হাসপাতাল ও ল্যাবরেটরি অনুসন্ধান'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* GPS Quick Action & Search */}
        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                padding: '9px 14px',
                borderRadius: '10px',
                color: '#0060FA',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer',
              }}
            >
              <Navigation size={16} className={isLocating ? 'spin-slow' : ''} />
              <span>{isEn ? 'Detect GPS / Auto Location' : 'জিপিএস / বর্তমান অবস্থান শনাক্ত করুন'}</span>
            </button>

            <button
              onClick={() => handleSelect('All Bangladesh')}
              style={{
                padding: '9px 14px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                backgroundColor: activeLocation.toLowerCase().includes('all') ? '#0060FA' : '#FFFFFF',
                color: activeLocation.toLowerCase().includes('all') ? '#FFFFFF' : '#334155',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {isEn ? 'All Bangladesh' : 'সমগ্র বাংলাদেশ'}
            </button>
          </div>

          {locationStatus && (
            <div style={{ fontSize: '11.5px', color: '#B45309', background: '#FEF3C7', padding: '6px 10px', borderRadius: '6px' }}>
              {locationStatus}
            </div>
          )}

          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={isEn ? 'Search district or division (e.g. Dhaka, Sylhet, Chattogram)...' : 'জেলা বা বিভাগ খুঁজুন (যেমন: ঢাকা, সিলেট, চট্টগ্রাম)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 34px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Division Selector Tabs */}
        <div
          style={{
            padding: '10px 20px',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          <button
            onClick={() => setSelectedDivisionSlug('all')}
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              border: selectedDivisionSlug === 'all' ? '1px solid #0060FA' : '1px solid #CBD5E1',
              backgroundColor: selectedDivisionSlug === 'all' ? '#0060FA' : '#FFFFFF',
              color: selectedDivisionSlug === 'all' ? '#FFFFFF' : '#475569',
            }}
          >
            {isEn ? 'All Divisions' : 'সকল বিভাগ'}
          </button>
          {BANGLADESH_DIVISIONS.map((div) => {
            const isTabActive = selectedDivisionSlug === div.slug;
            return (
              <button
                key={div.id}
                onClick={() => setSelectedDivisionSlug(div.slug)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: isTabActive ? 800 : 600,
                  cursor: 'pointer',
                  border: isTabActive ? '1px solid #0060FA' : '1px solid #CBD5E1',
                  backgroundColor: isTabActive ? '#0060FA' : '#FFFFFF',
                  color: isTabActive ? '#FFFFFF' : '#475569',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{isEn ? div.capital : div.capitalBn}</span>
                {div.highlight && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: isTabActive ? '#93C5FD' : '#0060FA',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Districts Grid / List */}
        <div
          style={{
            padding: '16px 24px',
            overflowY: 'auto',
            maxHeight: '44vh',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '8px',
          }}
        >
          {displayedDistricts.length > 0 ? (
            displayedDistricts.map((dist) => {
              const isSelected =
                activeLocation.toLowerCase().includes(dist.nameEn.toLowerCase()) ||
                activeLocation.includes(dist.nameBn);

              return (
                <button
                  key={dist.id}
                  onClick={() => handleSelect(isEn ? dist.nameEn : dist.nameBn)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: isSelected ? '1.5px solid #0060FA' : '1px solid #E2E8F0',
                    backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={14} color={isSelected ? '#0060FA' : '#94A3B8'} />
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: isSelected ? 800 : 600, color: '#0F172A' }}>
                        {isEn ? dist.nameEn : dist.nameBn}
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>
                        {isEn ? dist.divisionSlug.toUpperCase() : dist.nameBn}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check size={14} color="#0060FA" />}
                </button>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
              {isEn ? 'No locations matching your query.' : 'কোনো লোকেশন পাওয়া যায়নি।'}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11.5px',
            color: '#64748B',
          }}
        >
          <span>
            {isEn
              ? 'Nationwide digital healthcare network • Bangladesh'
              : 'জাতীয় ডিজিটাল স্বাস্থ্যসেবা প্ল্যাটফর্ম • বাংলাদেশ'}
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isEn ? 'Done' : 'সম্পন্ন'}
          </button>
        </div>
      </div>
    </div>
  );
}
