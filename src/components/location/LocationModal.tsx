'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { SupportedLanguage, BRAND_CONSTANTS } from '@/config/brand';
import {
  BANGLADESH_DIVISIONS,
  BANGLADESH_DISTRICTS,
  AdministrativeDistrict,
} from '@/data/bangladesh-divisions';
import {
  GeoService,
  UserLocationDetails,
  GeoError,
} from '@/services/geo.service';
import {
  MapPin,
  Navigation,
  Check,
  X,
  Search,
  Globe,
  AlertCircle,
  RotateCw,
  CheckCircle2,
  Shield,
  Radio,
  ChevronRight,
} from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation?: string;
  currentLocation?: string;
  onSelectLocation: (loc: string, details?: UserLocationDetails) => void;
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
  const [geoError, setGeoError] = useState<GeoError | null>(null);
  const [gpsSuccess, setGpsSuccess] = useState<{
    locationName: string;
    accuracy?: number;
    distanceKm?: number;
  } | null>(null);
  const [selectedDistrictObj, setSelectedDistrictObj] = useState<AdministrativeDistrict | null>(null);
  const [storedDetails, setStoredDetails] = useState<UserLocationDetails | null>(null);

  const isEn = language === 'en';

  useEffect(() => {
    if (isOpen) {
      setGeoError(null);
      setGpsSuccess(null);
      const stored = GeoService.getStoredUserLocation();
      setStoredDetails(stored);
    }
  }, [isOpen]);

  // Handle manual selection of district or upazila
  const handleManualSelect = (districtName: string, upazilaName?: string) => {
    setGeoError(null);
    setGpsSuccess(null);
    const details = GeoService.setManualLocation(districtName, upazilaName);
    onSelectLocation(details.districtName === 'ALL' ? 'All Bangladesh' : details.name, details);
    onClose();
  };

  // Handle GPS detection using browser Geolocation API
  const handleUseCurrentLocation = async () => {
    setIsLocating(true);
    setGeoError(null);
    setGpsSuccess(null);

    try {
      const { details, distanceKm } = await GeoService.requestCurrentPosition({
        timeout: 10000,
        enableHighAccuracy: true,
      });

      setIsLocating(false);
      setGpsSuccess({
        locationName: isEn ? details.name : details.nameBn,
        accuracy: details.accuracy,
        distanceKm,
      });
      setStoredDetails(details);

      // Trigger nearby search with detected location & coordinates
      onSelectLocation(details.districtName, details);

      // Auto-dismiss modal smoothly after showing confirmation
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setIsLocating(false);
      if (err && err.code) {
        setGeoError(err as GeoError);
      } else {
        setGeoError({
          code: 'POSITION_UNAVAILABLE',
          messageEn: 'Unable to detect GPS position.',
          messageBn: 'জিপিএস অবস্থান শনাক্ত করা সম্ভব হয়নি।',
          actionEn: 'Please select your district manually below.',
          actionBn: 'দয়া করে নিচের তালিকা থেকে আপনার জেলা নির্বাচন করুন।',
        });
      }
    }
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
          d.divisionSlug.toLowerCase().includes(q) ||
          d.upazilas?.some((u) => u.toLowerCase().includes(q))
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
        backgroundColor: 'rgba(15, 23, 42, 0.70)',
        backdropFilter: 'blur(6px)',
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
          maxWidth: '640px',
          maxHeight: '92vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
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
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#0060FA',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '4px',
              }}
            >
              <Globe size={13} />
              <span>
                {isEn ? 'All 8 Divisions • 64 Districts' : 'বাংলাদেশের ৮টি বিভাগ • ৬৪টি জেলা'}
              </span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {isEn ? 'Select Healthcare Location' : 'স্বাস্থ্যসেবা লোকেশন নির্বাচন করুন'}
            </h2>
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', margin: 0 }}>
              {isEn
                ? 'Find verified doctors, diagnostics, and hospitals near you'
                : 'আপনার কাছের বিশেষজ্ঞ ডাক্তার, ল্যাব ও হাসপাতাল খুঁজুন'}
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

        {/* GPS Quick Action & Manual Controls */}
        <div
          style={{
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
          }}
        >
          {/* Active location indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              backgroundColor: '#F1F5F9',
              borderRadius: '10px',
              fontSize: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={14} color="#0060FA" />
              <span style={{ color: '#475569' }}>
                {isEn ? 'Current Selection:' : 'বর্তমান নির্বাচন:'}{' '}
                <strong style={{ color: '#0F172A' }}>{activeLocation}</strong>
              </span>
            </div>
            {storedDetails?.isGps && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                }}
              >
                <Radio size={11} />
                <span>GPS Active</span>
              </span>
            )}
          </div>

          {/* Action Buttons: GPS and All Bangladesh */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: isLocating ? '#DBEAFE' : '#EFF6FF',
                border: '1.5px solid #3B82F6',
                padding: '10px 16px',
                borderRadius: '10px',
                color: '#1D4ED8',
                fontWeight: 700,
                fontSize: '13px',
                cursor: isLocating ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Navigation
                size={16}
                className={isLocating ? 'animate-spin' : ''}
                style={{
                  color: '#1D4ED8',
                }}
              />
              <span>
                {isLocating
                  ? (isEn ? 'Detecting GPS Location...' : 'জিপিএস শনাক্ত করা হচ্ছে...')
                  : (isEn ? 'Use My Location (GPS)' : 'আমার বর্তমান অবস্থান (জিপিএস)')}
              </span>
            </button>

            <button
              onClick={() => handleManualSelect('All Bangladesh')}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                backgroundColor:
                  activeLocation.toLowerCase().includes('all') ? '#0060FA' : '#FFFFFF',
                color: activeLocation.toLowerCase().includes('all') ? '#FFFFFF' : '#334155',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {isEn ? 'All Bangladesh' : 'সমগ্র বাংলাদেশ'}
            </button>
          </div>

          {/* GPS Success Feedback Banner */}
          {gpsSuccess && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#F0FDF4',
                border: '1px solid #86EFAC',
                padding: '10px 14px',
                borderRadius: '10px',
                color: '#166534',
                fontSize: '12.5px',
              }}
            >
              <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0 }} />
              <div>
                <strong>
                  {isEn
                    ? `GPS Verified: ${gpsSuccess.locationName}`
                    : `জিপিএস নিশ্চিত: ${gpsSuccess.locationName}`}
                </strong>
                <div style={{ fontSize: '11px', color: '#15803D', marginTop: '2px' }}>
                  {isEn
                    ? `Coordinates retrieved (Accuracy: ±${gpsSuccess.accuracy || 15}m). Filtering nearby healthcare...`
                    : `অবস্থান শনাক্ত হয়েছে (নির্ভুলতা: ±${gpsSuccess.accuracy || 15} মিটার)। সেবা সাজানো হচ্ছে...`}
                </div>
              </div>
            </div>
          )}

          {/* GPS Error & Recovery Instructions Banner */}
          {geoError && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                padding: '12px 14px',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#991B1B' }}>
                    {isEn ? geoError.messageEn : geoError.messageBn}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#7F1D1D', marginTop: '3px', lineHeight: 1.4 }}>
                    {isEn ? geoError.actionEn : geoError.actionBn}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <RotateCw size={12} className={isLocating ? 'animate-spin' : ''} />
                  <span>{isEn ? 'Retry GPS' : 'পুনরায় চেষ্টা করুন'}</span>
                </button>
                <span style={{ fontSize: '11.5px', color: '#991B1B', alignSelf: 'center' }}>
                  {isEn ? 'or select your district below:' : 'অথবা নিচে থেকে জেলা বেছে নিন:'}
                </span>
              </div>
            </div>
          )}

          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search
              size={15}
              color="#94A3B8"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder={
                isEn
                  ? 'Search district or upazila (e.g. Moulvibazar, Sylhet, Dhanmondi, Chittagong)...'
                  : 'জেলা বা উপজেলা খুঁজুন (যেমন: মৌলভীবাজার, সিলেট, ধানমন্ডি, চট্টগ্রাম)...'
              }
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
            onClick={() => {
              setSelectedDivisionSlug('all');
              setSelectedDistrictObj(null);
            }}
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
                onClick={() => {
                  setSelectedDivisionSlug(div.slug);
                  setSelectedDistrictObj(null);
                }}
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

        {/* Granular Upazila View if a district is clicked */}
        {selectedDistrictObj && selectedDistrictObj.upazilas && (
          <div
            style={{
              padding: '10px 20px',
              backgroundColor: '#EFF6FF',
              borderBottom: '1px solid #BFDBFE',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E40AF' }}>
                {isEn
                  ? `Select specific area in ${selectedDistrictObj.nameEn}:`
                  : `${selectedDistrictObj.nameBn} জেলার উপজেলা/এলাকা:`}
              </span>
              <button
                onClick={() => setSelectedDistrictObj(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '11px',
                  color: '#64748B',
                  cursor: 'pointer',
                }}
              >
                {isEn ? 'Back to all districts' : 'সকল জেলা'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleManualSelect(selectedDistrictObj.nameEn)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: '#0060FA',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {isEn ? `Entire ${selectedDistrictObj.nameEn} District` : `সমগ্র ${selectedDistrictObj.nameBn} জেলা`}
              </button>
              {selectedDistrictObj.upazilas.map((u) => (
                <button
                  key={u}
                  onClick={() => handleManualSelect(selectedDistrictObj.nameEn, u)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    backgroundColor: '#FFFFFF',
                    color: '#1E293B',
                    border: '1px solid #CBD5E1',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Districts Grid */}
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
                <div
                  key={dist.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: isSelected ? '1.5px solid #0060FA' : '1px solid #E2E8F0',
                    backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onClick={() => {
                    if (dist.upazilas && dist.upazilas.length > 0) {
                      setSelectedDistrictObj(dist);
                    } else {
                      handleManualSelect(dist.nameEn);
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <MapPin
                      size={14}
                      color={isSelected ? '#0060FA' : '#94A3B8'}
                      style={{ flexShrink: 0 }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '12.5px',
                          fontWeight: isSelected ? 800 : 600,
                          color: '#0F172A',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {isEn ? dist.nameEn : dist.nameBn}
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>
                        {isEn ? dist.divisionSlug.toUpperCase() : dist.nameBn}
                      </div>
                    </div>
                  </div>
                  {isSelected ? (
                    <Check size={14} color="#0060FA" style={{ flexShrink: 0 }} />
                  ) : dist.upazilas && dist.upazilas.length > 0 ? (
                    <ChevronRight size={13} color="#94A3B8" style={{ flexShrink: 0 }} />
                  ) : null}
                </div>
              );
            })
          ) : (
            <div
              style={{
                gridColumn: '1 / -1',
                padding: '24px',
                textAlign: 'center',
                color: '#64748B',
                fontSize: '13px',
              }}
            >
              {isEn ? 'No districts or areas matching your query.' : 'কোনো জেলা বা এলাকা পাওয়া যায়নি।'}
            </div>
          )}
        </div>

        {/* Privacy & Guarantee Footer */}
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            color: '#64748B',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={12} color="#0060FA" />
            <span>
              {isEn
                ? 'Patient GPS coordinates are processed solely on your device for proximity sorting'
                : 'রোগীর জিপিএস তথ্য শুধুমাত্র দূরত্ব নির্ণয়ে ব্রাউজারে ব্যবহৃত হয়, কোথাও সংরক্ষিত হয় না'}
            </span>
          </div>
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
