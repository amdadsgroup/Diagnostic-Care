'use client';

import React, { useState } from 'react';
import { SupportedLanguage } from '@/config/brand';
import { MapPin, Navigation, Check, X, Search } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation?: string;
  currentLocation?: string;
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
  currentLocation,
  onSelectLocation,
  language,
}: LocationModalProps) {
  const activeLocation = selectedLocation || currentLocation || 'Moulvibazar';
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
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-container animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '24px 22px',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Drag handle */}
        <div style={{ width: '40px', height: '4px', background: 'rgba(203, 213, 225, 0.8)', borderRadius: '2px', margin: '0 auto -4px auto' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              {language === 'en' ? 'Select Healthcare Location' : 'স্বাস্থ্যসেবা লোকেশন নির্বাচন'}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {language === 'en'
                ? 'Showing doctors, labs, and hospitals near you'
                : 'আপনার নিকটস্থ ডাক্তার, ডায়াগনস্টিক ও হাসপাতাল দেখাচ্ছে'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'rgba(241, 245, 249, 0.8)',
              border: '1px solid var(--glass-border)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* GPS Quick Action */}
        <button
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="glass-card-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(235, 243, 255, 0.65)',
            border: '1.5px solid rgba(0, 96, 250, 0.35)',
            padding: '12px 16px',
            borderRadius: '14px',
            color: 'var(--color-primary)',
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
              boxShadow: '0 2px 8px rgba(0, 96, 250, 0.15)',
            }}
          >
            <Navigation size={18} color="var(--color-primary)" className={isLocating ? 'spin-slow' : ''} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'var(--color-primary)', fontWeight: 800 }}>
              {language === 'en' ? 'Use Current GPS Location' : 'বর্তমান জিপিএস লোকেশন ব্যবহার করুন'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              {language === 'en' ? 'Fast automated nearby search' : 'নিকটস্থ চেম্বার ও ডায়াগনস্টিক অটো-ডিটেক্ট'}
            </div>
          </div>
        </button>

        {locationStatus && (
          <div style={{ fontSize: '12px', color: '#B45309', background: 'rgba(254, 243, 199, 0.8)', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '8px 12px', borderRadius: '10px' }}>
            {locationStatus}
          </div>
        )}

        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--color-text-secondary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder={language === 'en' ? 'Search district or upazila...' : 'উপজেলা বা জেলা খুঁজুন...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input"
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: '12px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Location List */}
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '42vh' }}>
          {filteredLocations.map((loc) => {
            const isSelected = activeLocation.toLowerCase().includes(loc.nameEn.toLowerCase()) ||
              activeLocation.includes(loc.nameBn);

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
                className={isSelected ? 'glass-card-sm' : 'glass-inset'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid var(--glass-border)',
                  backgroundColor: isSelected ? 'rgba(235, 243, 255, 0.6)' : 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={16} color={isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)'} />
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: isSelected ? 800 : 600, color: 'var(--color-text-primary)' }}>
                      {language === 'en' ? loc.nameEn : loc.nameBn}
                    </div>
                    {loc.hub && (
                      <span className="glass-badge-teal" style={{ fontSize: '10px', padding: '1px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        {language === 'en' ? 'Active Healthcare Hub' : 'সক্রিয় স্বাস্থ্য হাব'}
                      </span>
                    )}
                  </div>
                </div>

                {isSelected && <Check size={18} color="var(--color-primary)" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
