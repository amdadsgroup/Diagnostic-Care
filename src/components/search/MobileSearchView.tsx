'use client';

import React, { useState } from 'react';
import { SupportedLanguage } from '@/config/brand';
import { DoctorAssociation, ScheduleSlot } from '@/types';
import {
  Search,
  X,
  MapPin,
  Filter,
  ArrowUpDown,
  Stethoscope,
  Building2,
  ShieldCheck,
  Star,
  ChevronRight,
  Clock,
  Calendar,
  ArrowLeft,
} from 'lucide-react';

interface MobileSearchViewProps {
  language: SupportedLanguage;
  doctorAssociations: DoctorAssociation[];
  selectedLocation: string;
  onSelectSlot: (slot: ScheduleSlot, assoc: DoctorAssociation) => void;
  onNavigateHome: () => void;
}

const POPULAR_DOCTOR_SEARCHES = [
  'Cardiology',
  'Medicine',
  'Gynecology & Obs',
  'Pediatrics',
  'Orthopedics',
  'ENT Specialist',
  'Dermatology',
  'Neurology',
];

export default function MobileSearchView({
  language,
  doctorAssociations,
  selectedLocation,
  onSelectSlot,
  onNavigateHome,
}: MobileSearchViewProps) {
  const [query, setQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [sortBy, setSortBy] = useState<'relevance' | 'price_low' | 'price_high' | 'rating'>('relevance');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Cardiology',
    'General Medicine',
  ]);

  const handleSearchSubmit = (term: string) => {
    setQuery(term);
    if (term && !recentSearches.includes(term)) {
      setRecentSearches([term, ...recentSearches.slice(0, 4)]);
    }
  };

  // Filter Doctors
  const filteredDoctors = doctorAssociations.filter((assoc) => {
    const matchesQ =
      !query ||
      assoc.doctor?.fullName.toLowerCase().includes(query.toLowerCase()) ||
      assoc.doctor?.specialization.toLowerCase().includes(query.toLowerCase()) ||
      assoc.organizationName.toLowerCase().includes(query.toLowerCase()) ||
      assoc.doctor?.qualifications?.toLowerCase().includes(query.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === 'ALL' ||
      assoc.doctor?.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase());
    return matchesQ && matchesSpecialty;
  });

  // Sort logic
  if (sortBy === 'price_low') {
    filteredDoctors.sort((a, b) => a.consultationFee - b.consultationFee);
  } else if (sortBy === 'price_high') {
    filteredDoctors.sort((a, b) => b.consultationFee - a.consultationFee);
  } else if (sortBy === 'rating') {
    filteredDoctors.sort((a, b) => (b.doctor?.bmdcNumber ? 1 : 0) - (a.doctor?.bmdcNumber ? 1 : 0));
  }

  const totalResults = filteredDoctors.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '36px' }}>
      {/* Search Input Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            aria-label="Back to Home"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--slate-200)',
              color: 'var(--navy-900)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            }}
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder={
              language === 'en'
                ? 'Search specialist doctor, chamber in ' + selectedLocation
                : 'বিশেষজ্ঞ ডাক্তার বা চেম্বার খুঁজুন'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              padding: '12px 38px 12px 42px',
              borderRadius: '12px',
              border: '1.5px solid var(--color-primary)',
              fontSize: '13.5px',
              outline: 'none',
              backgroundColor: '#FFFFFF',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--slate-400)',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Trigger Button */}
        <button
          onClick={() => setIsFilterSheetOpen(true)}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: isFilterSheetOpen || selectedSpecialty !== 'ALL' ? 'var(--color-primary)' : '#FFFFFF',
            color: isFilterSheetOpen || selectedSpecialty !== 'ALL' ? '#FFFFFF' : 'var(--slate-700)',
            border: '1px solid var(--slate-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            flexShrink: 0,
          }}
          title="Open Filters"
        >
          <Filter size={18} />
        </button>
      </div>

      {/* Specialty Filter Pills */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '4px',
          scrollbarWidth: 'none',
        }}
      >
        {[
          { key: 'ALL', labelEn: 'All Doctors', labelBn: 'সব ডাক্তার' },
          { key: 'Cardiology', labelEn: 'Cardiology', labelBn: 'কার্ডিওলজি' },
          { key: 'Medicine', labelEn: 'Medicine', labelBn: 'মেডিসিন' },
          { key: 'Gynecologist', labelEn: 'Gynecology & Obs', labelBn: 'স্ত্রী ও প্রসূতি' },
          { key: 'Pediatrics', labelEn: 'Pediatrics', labelBn: 'শিশু রোগ' },
          { key: 'Orthopedics', labelEn: 'Orthopedics', labelBn: 'হাড় ও জোড়া' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setSelectedSpecialty(item.key)}
            style={{
              padding: '7px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: selectedSpecialty === item.key ? 'var(--navy-900)' : '#FFFFFF',
              color: selectedSpecialty === item.key ? '#FFFFFF' : 'var(--slate-600)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: selectedSpecialty === item.key ? 'var(--navy-900)' : 'var(--slate-200)',
            }}
          >
            {language === 'en' ? item.labelEn : item.labelBn}
          </button>
        ))}
      </div>

      {/* Popular & Recent searches if no query */}
      {!query && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {recentSearches.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                  {language === 'en' ? 'Recent Searches' : 'সাম্প্রতিক অনুসন্ধান'}
                </span>
                <button
                  onClick={() => setRecentSearches([])}
                  style={{ fontSize: '11px', color: 'var(--slate-400)', border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  {language === 'en' ? 'Clear' : 'মুছুন'}
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearchSubmit(term)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--slate-200)',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      color: 'var(--slate-700)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Clock size={12} color="var(--slate-400)" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '8px' }}>
              {language === 'en' ? 'Trending Doctor Searches' : 'জনপ্রিয় ডাক্তার অনুসন্ধান'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {POPULAR_DOCTOR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearchSubmit(term)}
                  style={{
                    backgroundColor: 'rgba(0, 96, 250, 0.08)',
                    border: '1px solid rgba(0, 96, 250, 0.2)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy-900)' }}>
          {language === 'en' ? `Specialist Doctors (${totalResults})` : `বিশেষজ্ঞ ডাক্তার (${totalResults} জন)`}
        </span>

        {/* Sort Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowUpDown size={13} color="var(--slate-500)" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--slate-600)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="relevance">{language === 'en' ? 'Relevance' : 'প্রাসঙ্গিকতা'}</option>
            <option value="price_low">{language === 'en' ? 'Fee: Low to High' : 'ফি: কম থেকে বেশি'}</option>
            <option value="price_high">{language === 'en' ? 'Fee: High to Low' : 'ফি: বেশি থেকে কম'}</option>
            <option value="rating">{language === 'en' ? 'BMDC Verified First' : 'ভেরিফায়েড প্রথমে'}</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {totalResults === 0 && (
        <div
          style={{
            padding: '48px 20px',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
          }}
        >
          <Stethoscope size={36} color="var(--slate-300)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '4px' }}>
            {language === 'en' ? 'No Specialist Doctors Found' : 'কোনো ডাক্তার পাওয়া যায়নি'}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--slate-500)', maxWidth: '320px', margin: '0 auto 16px auto' }}>
            {language === 'en'
              ? 'Try searching by specialty such as Cardiology, Medicine, or doctor name.'
              : 'কার্ডিওলজি, মেডিসিন বা ডাক্তারের নাম লিখে পুনরায় চেষ্টা করুন।'}
          </p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedSpecialty('ALL');
            }}
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontWeight: 700,
              fontSize: '12.5px',
              cursor: 'pointer',
            }}
          >
            {language === 'en' ? 'Reset Search' : 'রিসেট করুন'}
          </button>
        </div>
      )}

      {/* Results List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredDoctors.map((assoc) => (
          <div
            key={assoc.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(10, 22, 40, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', gap: '12px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(0, 96, 250, 0.1)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '18px',
                  fontWeight: 800,
                }}
              >
                {assoc.doctor?.fullName.replace('Dr. ', '').charAt(0) || 'D'}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--navy-900)', margin: 0 }}>
                    {assoc.doctor?.fullName}
                  </h3>
                  {assoc.doctor?.bmdcNumber && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px',
                        fontSize: '10px',
                        fontWeight: 700,
                        backgroundColor: '#DCFCE7',
                        color: '#15803D',
                        padding: '1px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      <ShieldCheck size={11} />
                      BMDC
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600, marginTop: '2px' }}>
                  {assoc.doctor?.specialization}
                </div>

                <div style={{ fontSize: '11px', color: 'var(--slate-500)', marginTop: '2px' }}>
                  {assoc.doctor?.qualifications}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '11.5px', color: 'var(--slate-600)' }}>
                  <Building2 size={12} color="var(--slate-400)" />
                  <span>{assoc.organizationName} ({assoc.branchName})</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--navy-900)' }}>
                  ৳{assoc.consultationFee}
                </div>
              </div>
            </div>

            {/* Quick Slot Booking Buttons */}
            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--slate-500)', marginBottom: '6px' }}>
                {language === 'en' ? 'Today Chamber Slots:' : 'আজকের চেম্বার স্লট:'}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { time: '16:00', token: 1, end: '16:15' },
                  { time: '16:30', token: 3, end: '16:45' },
                  { time: '17:00', token: 5, end: '17:15' },
                  { time: '17:30', token: 7, end: '17:45' },
                ].map((slotItem) => {
                  const todayStr = new Date().toISOString().split('T')[0];
                  const realSlot: ScheduleSlot = {
                    id: `slot-${assoc.id}-${slotItem.time.replace(':', '')}`,
                    doctorScheduleId: `sched-${assoc.id}`,
                    doctorAssociationId: assoc.id,
                    branchId: assoc.branchId,
                    slotDate: todayStr,
                    date: todayStr,
                    startTime: slotItem.time,
                    endTime: slotItem.end,
                    tokenNumber: slotItem.token,
                    status: 'AVAILABLE',
                  };

                  return (
                    <button
                      key={slotItem.time}
                      onClick={() => onSelectSlot(realSlot, assoc)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-primary)',
                        backgroundColor: 'rgba(0, 96, 250, 0.08)',
                        color: 'var(--color-primary)',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {slotItem.time} (T#{slotItem.token})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bottom Sheet */}
      {isFilterSheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 12, 22, 0.65)',
            backdropFilter: 'blur(8px)',
            zIndex: 99990,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          onClick={() => setIsFilterSheetOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '540px',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '24px 20px',
              paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              animation: 'slideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--navy-900)' }}>
                {language === 'en' ? 'Filter & Refine Doctor Search' : 'ডাক্তার সার্চ ফিল্টার'}
              </h3>
              <button
                onClick={() => setIsFilterSheetOpen(false)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Specialty Selection */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '8px' }}>
                {language === 'en' ? 'Specialty / Clinical Department' : 'বিশেষজ্ঞ বিভাগ'}
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['ALL', 'Cardiology', 'Gynecologist', 'Orthopedics', 'Pediatrics', 'Medicine'].map((spec) => (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialty(spec)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      border: '1px solid',
                      borderColor: selectedSpecialty === spec ? 'var(--color-primary)' : '#E2E8F0',
                      backgroundColor: selectedSpecialty === spec ? 'rgba(0, 96, 250, 0.1)' : '#FFFFFF',
                      color: selectedSpecialty === spec ? 'var(--color-primary)' : 'var(--slate-700)',
                      cursor: 'pointer',
                    }}
                  >
                    {spec === 'ALL' ? (language === 'en' ? 'All Specialties' : 'সকল বিভাগ') : spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply & Reset Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => {
                  setSelectedSpecialty('ALL');
                  setSortBy('relevance');
                  setIsFilterSheetOpen(false);
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: 'var(--slate-700)',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {language === 'en' ? 'Reset' : 'রিসেট'}
              </button>

              <button
                onClick={() => setIsFilterSheetOpen(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {language === 'en' ? 'Apply Filters' : 'ফিল্টার প্রয়োগ করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
