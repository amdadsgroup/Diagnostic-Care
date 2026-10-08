'use client';

import React, { useState } from 'react';
import { SupportedLanguage } from '@/config/brand';
import { DoctorAssociation, DiagnosticTest, ScheduleSlot } from '@/types';
import {
  Search,
  X,
  MapPin,
  Filter,
  ArrowUpDown,
  Stethoscope,
  TestTube2,
  Building2,
  Pill,
  Truck,
  ShieldCheck,
  Star,
  ChevronRight,
  Clock,
} from 'lucide-react';

interface MobileSearchViewProps {
  language: SupportedLanguage;
  doctorAssociations: DoctorAssociation[];
  diagnosticTests: DiagnosticTest[];
  selectedLocation: string;
  onSelectSlot: (slot: ScheduleSlot, assoc: DoctorAssociation) => void;
  onSelectTest: (test: DiagnosticTest) => void;
  onNavigateHome: () => void;
}

type SearchCategory = 'ALL' | 'DOCTORS' | 'TESTS' | 'HOSPITALS' | 'PHARMACIES';

const POPULAR_SEARCH_TERMS = [
  'Cardiology',
  'Complete Blood Count',
  'Gynecologist',
  'Popular Diagnostic Moulvibazar',
  'Lipid Profile',
  'Pediatrician',
  'ECG 12-Lead',
  'Orthopedic Surgeon',
];

export default function MobileSearchView({
  language,
  doctorAssociations,
  diagnosticTests,
  selectedLocation,
  onSelectSlot,
  onSelectTest,
  onNavigateHome,
}: MobileSearchViewProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory>('ALL');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [sortBy, setSortBy] = useState<'relevance' | 'price_low' | 'price_high' | 'rating'>('relevance');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Dr. Anisur Rahman',
    'CBC Test',
    'Moulvibazar Diagnostic',
  ]);

  const handleSearchSubmit = (term: string) => {
    setQuery(term);
    if (term && !recentSearches.includes(term)) {
      setRecentSearches([term, ...recentSearches.slice(0, 4)]);
    }
  };

  // Filter Doctors
  const filteredDoctors = doctorAssociations.filter((assoc) => {
    if (category === 'TESTS' || category === 'PHARMACIES') return false;
    const matchesQ =
      !query ||
      assoc.doctor?.fullName.toLowerCase().includes(query.toLowerCase()) ||
      assoc.doctor?.specialization.toLowerCase().includes(query.toLowerCase()) ||
      assoc.organizationName.toLowerCase().includes(query.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === 'ALL' ||
      assoc.doctor?.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase());
    return matchesQ && matchesSpecialty;
  });

  // Filter Diagnostic Tests
  const filteredTests = diagnosticTests.filter((test) => {
    if (category === 'DOCTORS' || category === 'HOSPITALS' || category === 'PHARMACIES') return false;
    const matchesQ =
      !query ||
      test.name.toLowerCase().includes(query.toLowerCase()) ||
      test.category.toLowerCase().includes(query.toLowerCase()) ||
      test.organizationName.toLowerCase().includes(query.toLowerCase());
    return matchesQ;
  });

  // Sort logic
  if (sortBy === 'price_low') {
    filteredDoctors.sort((a, b) => a.consultationFee - b.consultationFee);
    filteredTests.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_high') {
    filteredDoctors.sort((a, b) => b.consultationFee - a.consultationFee);
    filteredTests.sort((a, b) => b.price - a.price);
  }

  const totalResults = filteredDoctors.length + filteredTests.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '36px' }}>
      {/* Search Input Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder={
              language === 'en'
                ? 'Search doctors, tests, clinics in ' + selectedLocation
                : 'ডাক্তার, ল্যাব টেস্ট বা ক্লিনিক খুঁজুন'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              padding: '12px 38px 12px 42px',
              borderRadius: '12px',
              border: '1.5px solid var(--cyan-500)',
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
            backgroundColor: isFilterSheetOpen || selectedSpecialty !== 'ALL' ? 'var(--cyan-600)' : '#FFFFFF',
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

      {/* Category Pills */}
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
          { key: 'ALL', labelEn: 'All Services', labelBn: 'সব সেবা' },
          { key: 'DOCTORS', labelEn: 'Doctors', labelBn: 'ডাক্তার' },
          { key: 'TESTS', labelEn: 'Diagnostic Tests', labelBn: 'ল্যাব টেস্ট' },
          { key: 'HOSPITALS', labelEn: 'Hospitals', labelBn: 'হাসপাতাল' },
          { key: 'PHARMACIES', labelEn: 'Pharmacies', labelBn: 'ফার্মেসি' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setCategory(item.key as SearchCategory)}
            style={{
              padding: '7px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: category === item.key ? 'var(--navy-900)' : '#FFFFFF',
              color: category === item.key ? '#FFFFFF' : 'var(--slate-600)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: category === item.key ? 'var(--navy-900)' : 'var(--slate-200)',
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
              {language === 'en' ? 'Trending Health Searches' : 'জনপ্রিয় স্বাস্থ্য অনুসন্ধান'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {POPULAR_SEARCH_TERMS.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearchSubmit(term)}
                  style={{
                    backgroundColor: 'var(--cyan-50)',
                    border: '1px solid var(--cyan-200, #A5F3FC)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    color: 'var(--cyan-700, #0E7490)',
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
          {language === 'en' ? `Results (${totalResults})` : `ফলাফল (${totalResults} টি)`}
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
            <option value="price_low">{language === 'en' ? 'Price: Low to High' : 'ফি: কম থেকে বেশি'}</option>
            <option value="price_high">{language === 'en' ? 'Price: High to Low' : 'ফি: বেশি থেকে কম'}</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {totalResults === 0 && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '40px 20px',
            textAlign: 'center',
            border: '1px solid #E2E8F0',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--navy-900)' }}>
            {language === 'en' ? 'No Matching Healthcare Services' : 'কোনো সেবা বা ডাক্তার পাওয়া যায়নি'}
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--slate-500)', marginTop: '4px' }}>
            {language === 'en'
              ? 'Try changing keywords, clearing specialty filters, or searching in Moulvibazar.'
              : 'ভিন্ন কিওয়ার্ড দিয়ে চেষ্টা করুন অথবা ফিল্টার রিসেট করুন।'}
          </p>
        </div>
      )}

      {/* Results List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Doctors */}
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
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '10px', background: 'var(--cyan-50)', color: 'var(--cyan-600)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  BMDC Specialist
                </span>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--navy-900)', marginTop: '4px' }}>
                  {assoc.doctor?.fullName}
                </h3>
                <div style={{ fontSize: '12.5px', color: 'var(--cyan-600)', fontWeight: 600 }}>
                  {assoc.doctor?.specialization}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--slate-500)', marginTop: '2px' }}>
                  📍 {assoc.organizationName}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy-900)' }}>
                  ৳{assoc.consultationFee}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--slate-400)' }}>{language === 'en' ? 'Fee' : 'ফি'}</div>
              </div>
            </div>

            {/* Real-time Chamber Slots Selector */}
            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: 700 }}>
                  {language === 'en' ? '✓ Evening Chamber (4:00 PM - 8:00 PM)' : '✓ সান্ধ্যকালীন চেম্বার (বিকেল ৪:০০ - রাত ৮:০০)'}
                </span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>
                  {language === 'en' ? 'Select Real-time Slot:' : 'সরাসরি স্লট বেছে নিন:'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { time: '16:00', token: 1, end: '16:15' },
                  { time: '16:15', token: 2, end: '16:30' },
                  { time: '16:30', token: 3, end: '16:45' },
                  { time: '16:45', token: 4, end: '17:00' },
                  { time: '17:00', token: 5, end: '17:15' },
                  { time: '17:15', token: 6, end: '17:30' },
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
                        border: '1px solid #0057FF',
                        backgroundColor: '#EFF6FF',
                        color: '#0057FF',
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

        {/* Diagnostic Tests */}
        {filteredTests.map((test) => (
          <div
            key={test.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(10, 22, 40, 0.04)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '10px', background: 'var(--emerald-50)', color: 'var(--emerald-600)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                {test.category}
              </span>
              <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--navy-900)', marginTop: '4px' }}>
                {test.name}
              </h3>
              <div style={{ fontSize: '11.5px', color: 'var(--slate-500)', marginTop: '2px' }}>
                {test.organizationName}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--navy-900)' }}>
                ৳{test.price}
              </div>
              <button
                onClick={() => onSelectTest(test)}
                style={{
                  backgroundColor: 'var(--cyan-600)',
                  color: '#FFFFFF',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '11.5px',
                  border: 'none',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                {language === 'en' ? 'Book Test' : 'টেস্ট বুক'}
              </button>
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
                {language === 'en' ? 'Filter & Refine Search' : 'ফিল্টার ও বাছাই করুন'}
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
                {['ALL', 'Cardiology', 'Gynecology', 'Orthopedics', 'Pediatrics', 'Medicine'].map((spec) => (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialty(spec)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      border: '1px solid',
                      borderColor: selectedSpecialty === spec ? 'var(--cyan-600)' : '#E2E8F0',
                      backgroundColor: selectedSpecialty === spec ? 'var(--cyan-50)' : '#FFFFFF',
                      color: selectedSpecialty === spec ? 'var(--cyan-600)' : 'var(--slate-700)',
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
                  background: 'var(--cyan-600)',
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
