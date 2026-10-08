'use client';

import React, { useState } from 'react';
import { SupportedLanguage } from '@/config/brand';
import { MapPin, Navigation, Check, X, Search } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  language: SupportedLanguage;
}

const POPULAR_LOCATIONS = [
  { id: 'moulvibazar-sadar', nameEn: 'Moulvibazar Sadar', nameBn: 'মৌলভীবাজার সদর', hub: true },
  { id: 'sreemangal', nameEn: 'Sreemangal, Moulvibazar', nameBn: 'শ্রীমঙ্গল, মৌলভীবাজার', hub: true },
  { id: 'kulaura', nameEn: 'Kulaura, Moulvibazar', nameBn: 'কুলাউড়া, মৌলভীবাজার', hub: true },
  { id: 'sylhet-sadar', nameEn: 'Sylhet City (Zindabazar)', nameBn: 'সিলেট শহর (জিন্দাবাজার)', hub: true },
  { id: 'dhaka-dhanmondi', nameEn: 'Dhaka (Dhanmondi / Shahbagh)', nameBn: 'ঢাকা (ধানমন্ডি / শাহবাগ)' },
  { id: 'dhaka-uttara', nameEn: 'Dhaka (Uttara / Mirpur)', nameBn: 'ঢাকা (উত্তরা / মিরপুর)' },
  { id: 'chittagong', nameEn: 'Chittagong (Panchlaish / GEC)', nameBn: 'চট্টগ্রাম (পাঁচলাইশ / জিইসি)' },
  { id: 'kamalganj', nameEn: 'Kamalganj, Moulvibazar', nameBn: 'কমলগঞ্জ, মৌলভীবাজার' },
  { id: 'rajnagar', nameEn: 'Rajnagar, Moulvibazar', nameBn: 'রাজনগর, মৌলভীবাজার' },
  { id: 'barlekha', nameEn: 'Barlekha, Moulvibazar', nameBn: 'বড়লেখা, মৌলভীবাজার' },
];

export default function LocationModal({
  isOpen,
  onClose,
  selectedLocation,
  onSelectLocation,
  language,
}: LocationModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationStatus(
        language === 'en'
          ? 'Geolocation is not supported by your browser.'
          : 'আপনার ব্রাউজারে লোকেশন সুবিধা সমর্থিত নয়।'
      );
      return;
    }

    setIsLocating(true);
    setLocationStatus(language === 'en' ? 'Detecting your coordinates...' : 'আপনার অবস্থান শনাক্ত করা হচ্ছে...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        // Map to initial Moulvibazar / Sylhet hub for live providers
        const detected = 'Moulvibazar Sadar';
        onSelectLocation(detected);
        if (typeof window !== 'undefined') {
          localStorage.setItem('dc_user_location', detected);
        }
        setLocationStatus(null);
        onClose();
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus(
          language === 'en'
            ? 'Location permission denied. Please choose manually.'
            : 'লোকেশন পারমিশন মেলেনি। অনুগ্রহ করে তালিকা থেকে বাছাই করুন।'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const filteredLocations = POPULAR_LOCATIONS.filter((loc) =>
    loc.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.nameBn.includes(searchQuery)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 12, 22, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 99990,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 0,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          width: '100%',
          maxWidth: '560px',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '24px 20px',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.25)',
          animation: 'slideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Drag handle */}
        <div style={{ width: '40px', height: '4px', background: '#E2E8F0', borderRadius: '2px', margin: '0 auto -6px auto' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy-900)' }}>
              {language === 'en' ? 'Select Healthcare Location' : 'স্বাস্থ্যসেবা লোকেশন নির্বাচন'}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--slate-500)', marginTop: '2px' }}>
              {language === 'en'
                ? 'Showing doctors, labs, and hospitals near you'
                : 'আপনার নিকটস্থ ডাক্তার, ডায়াগনস্টিক ও হাসপাতাল দেখাচ্ছে'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--slate-500)',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* GPS Quick Action */}
        <button
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'var(--cyan-50)',
            border: '1.5px solid var(--cyan-500)',
            padding: '12px 16px',
            borderRadius: '12px',
            color: 'var(--cyan-600)',
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(8, 145, 178, 0.15)',
            }}
          >
            <Navigation size={18} color="var(--cyan-600)" className={isLocating ? 'spin-slow' : ''} />
          </div>
          <div style={{ flex: 1 }}>
            <div>{language === 'en' ? 'Use Current GPS Location' : 'বর্তমান জিপিএস লোকেশন ব্যবহার করুন'}</div>
            <div style={{ fontSize: '11px', color: 'var(--slate-500)', fontWeight: 500 }}>
              {language === 'en' ? 'Fast automated nearby search' : 'নিকটস্থ চেম্বার ও ডায়াগনস্টিক অটো-ডিটেক্ট'}
            </div>
          </div>
        </button>

        {locationStatus && (
          <div style={{ fontSize: '12px', color: '#D97706', background: '#FFFBEB', padding: '8px 12px', borderRadius: '8px' }}>
            {locationStatus}
          </div>
        )}

        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder={language === 'en' ? 'Search district or upazila...' : 'উপজেলা বা জেলা খুঁজুন...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: '10px',
              border: '1px solid var(--slate-300)',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>

        {/* Location List */}
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '42vh' }}>
          {filteredLocations.map((loc) => {
            const isSelected = selectedLocation.toLowerCase().includes(loc.nameEn.toLowerCase()) ||
              selectedLocation.includes(loc.nameBn);

            return (
              <button
                key={loc.id}
                onClick={() => {
                  onSelectLocation(language === 'en' ? loc.nameEn : loc.nameBn);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('dc_user_location', loc.nameEn);
                  }
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: isSelected ? '1.5px solid var(--cyan-600)' : '1px solid var(--slate-200)',
                  backgroundColor: isSelected ? 'var(--cyan-50)' : '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={16} color={isSelected ? 'var(--cyan-600)' : 'var(--slate-400)'} />
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: isSelected ? 800 : 600, color: 'var(--navy-900)' }}>
                      {language === 'en' ? loc.nameEn : loc.nameBn}
                    </div>
                    {loc.hub && (
                      <span style={{ fontSize: '10px', color: '#0891B2', background: 'rgba(8, 145, 178, 0.1)', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                        {language === 'en' ? 'Active Healthcare Hub' : 'সক্রিয় স্বাস্থ্য হাব'}
                      </span>
                    )}
                  </div>
                </div>

                {isSelected && <Check size={18} color="var(--cyan-600)" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
