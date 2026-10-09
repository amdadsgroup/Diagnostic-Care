'use client';

import React, { useState, useEffect } from 'react';
import { BRAND } from '@/config/brand';
import { SearchResult } from '@/types/extended';

const MOULVIBAZAR_UPAZILAS = [
  { id: 'ALL', bn: 'সমগ্র মৌলভীবাজার', en: 'All Moulvibazar' },
  { id: 'Sadar', bn: 'সদর (Sadar)', en: 'Sadar' },
  { id: 'Sreemangal', bn: 'শ্রীমঙ্গল (Sreemangal)', en: 'Sreemangal' },
  { id: 'Kamalganj', bn: 'কমলগঞ্জ (Kamalganj)', en: 'Kamalganj' },
  { id: 'Kulaura', bn: 'কুলাউড়া (Kulaura)', en: 'Kulaura' },
  { id: 'Rajnagar', bn: 'রাজনগর (Rajnagar)', en: 'Rajnagar' },
];

export default function AdvancedSearchFilter({
  onSelectResult,
}: {
  onSelectResult?: (result: SearchResult) => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
  const [selectedUpazila, setSelectedUpazila] = useState('ALL');
  const [availableToday, setAvailableToday] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1500);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const combinedQuery = [query, selectedSpecialty !== 'ALL' ? selectedSpecialty : ''].filter(Boolean).join(' ');
      if (combinedQuery) params.append('query', combinedQuery);
      params.append('type', 'DOCTOR');
      if (availableToday) params.append('availableToday', 'true');
      if (maxPrice < 1500) params.append('maxPrice', maxPrice.toString());

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.results);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [query, selectedSpecialty, selectedUpazila, availableToday, maxPrice]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search Header Container */}
      <div className="portal-card" style={{ background: '#FFFFFF', padding: '24px', boxShadow: 'var(--shadow-md)' }}>
        {/* Main Search Bar */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ডাক্তারের নাম বা বিশেষজ্ঞ বিভাগ লিখুন (যেমন: ডাঃ আনিসুর রহমান, হৃদরোগ, মেডিসিন)..."
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '1rem',
                borderRadius: '10px',
                border: '2px solid var(--slate-300)',
                outline: 'none',
              }}
            />
          </div>
          <button
            onClick={fetchResults}
            className="btn-primary"
            style={{ padding: '0 24px', fontSize: '1rem' }}
          >
            {loading ? 'খোঁজা হচ্ছে...' : '🔍 খুঁজুন'}
          </button>
        </div>

        {/* Type Filter Tabs: Doctor Specialties */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {[
            { id: 'ALL', label: 'সকল ডাক্তার (All Doctors)' },
            { id: 'Cardiology', label: '❤️ কার্ডিওলজি (হৃদরোগ)' },
            { id: 'Medicine', label: '🩺 মেডিসিন ও ডায়াবেটিস' },
            { id: 'Gynecologist', label: '🤰 স্ত্রী ও প্রসূতিরোগ' },
            { id: 'Pediatrics', label: '👶 শিশু বিশেষজ্ঞ' },
            { id: 'Orthopedics', label: '🦴 অর্থোপেডিকস' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedSpecialty(t.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: selectedSpecialty === t.id ? 'var(--brand-teal-600)' : 'var(--slate-300)',
                background: selectedSpecialty === t.id ? 'var(--brand-teal-50)' : 'white',
                color: selectedSpecialty === t.id ? 'var(--brand-teal-600)' : 'var(--slate-700)',
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Secondary Filter Row: Upazilas, Price Slider, Available Today */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '14px', borderTop: '1px solid var(--slate-200)' }}>
          {/* Upazila Selection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-600)' }}>উপজেলা:</span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {MOULVIBAZAR_UPAZILAS.map((upz) => (
                <button
                  key={upz.id}
                  onClick={() => setSelectedUpazila(upz.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    background: selectedUpazila === upz.id ? 'var(--brand-navy-900)' : 'var(--slate-100)',
                    color: selectedUpazila === upz.id ? 'white' : 'var(--slate-700)',
                  }}
                >
                  {upz.bn}
                </button>
              ))}
            </div>
          </div>

          {/* Available Today Toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-800)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={availableToday}
              onChange={(e) => setAvailableToday(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            আজকের স্লট উপলব্ধ (Available Today)
          </label>

          {/* Price Range Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>সর্বোচ্চ ফি:</span>
            <input
              type="range"
              min={300}
              max={1500}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-teal-600)', minWidth: '55px' }}>
              ৳{maxPrice}
            </span>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
            অনুসন্ধানের ফলাফল ({results.length} টি প্রাপ্ত)
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            লোকেশন: মৌলভীবাজার ও সিলেট অঞ্চল
          </span>
        </div>

        {results.length === 0 ? (
          <div className="portal-card" style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--slate-500)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔍</div>
            <h4 style={{ fontWeight: 700, color: 'var(--brand-navy-900)' }}>কোনো ফলাফল পাওয়া যায়নি</h4>
            <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>অনুগ্রহ করে ফিল্টার পরিবর্তন করে বা ভিন্ন কিওয়ার্ড লিখে পুনরায় চেষ্টা করুন।</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {results.map((item) => (
              <div
                key={item.id}
                className="portal-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: item.isSponsored ? '1.5px solid var(--brand-amber-500)' : '1px solid var(--slate-200)',
                  position: 'relative',
                }}
              >
                {item.isSponsored && (
                  <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--brand-amber-50)', color: '#b45309', border: '1px solid var(--brand-amber-500)', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                    ★ স্পন্সরড
                  </span>
                )}

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      background: item.type === 'DOCTOR' ? 'var(--brand-teal-50)' : item.type === 'TEST' ? 'var(--brand-emerald-50)' : 'var(--slate-100)',
                      color: item.type === 'DOCTOR' ? 'var(--brand-teal-600)' : item.type === 'TEST' ? '#065f46' : 'var(--slate-700)',
                    }}>
                      {item.type === 'DOCTOR' ? 'ডাক্তার' : item.type === 'TEST' ? 'ডায়াগনস্টিক টেস্ট' : 'সেন্টার'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                      ★ {item.rating} ({item.reviewCount})
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                    {item.name}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', marginTop: '4px' }}>
                    {item.subtitle}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '4px' }}>
                    📍 {item.location}
                  </p>

                  {item.nextSlot && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--brand-emerald-50)', color: '#065f46', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, marginTop: '8px' }}>
                      ⚡ নিকটতম স্লট: {item.nextSlot}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--slate-100)' }}>
                  {item.price ? (
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)', display: 'block' }}>ফি</span>
                      <strong style={{ fontSize: '1.2rem', color: 'var(--brand-navy-900)' }}>৳{item.price}</strong>
                    </div>
                  ) : <div />}

                  <button
                    onClick={() => {
                      if (onSelectResult) {
                        onSelectResult(item);
                      } else {
                        const targetId = item.type === 'DOCTOR' ? 'doctor-discovery-section' : 'diagnostic-tests-section';
                        const el = document.getElementById(targetId);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="btn-primary"
                    style={{ fontSize: '0.82rem', padding: '8px 14px' }}
                  >
                    {item.type === 'DOCTOR' ? 'সিরিয়াল বুক করুন →' : item.type === 'TEST' ? 'টেস্ট বুক করুন →' : 'প্রোফাইল দেখুন →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
