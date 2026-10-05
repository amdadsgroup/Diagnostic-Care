'use client';

import React, { useState } from 'react';
import { BRAND } from '@/config/brand';

const DAYS_OF_WEEK = [
  { id: 'SATURDAY', bn: 'শনিবার', en: 'Saturday' },
  { id: 'SUNDAY', bn: 'রবিবার', en: 'Sunday' },
  { id: 'MONDAY', bn: 'সোমবার', en: 'Monday' },
  { id: 'TUESDAY', bn: 'মঙ্গলবার', en: 'Tuesday' },
  { id: 'WEDNESDAY', bn: 'বুধবার', en: 'Wednesday' },
  { id: 'THURSDAY', bn: 'বৃহস্পতিবার', en: 'Thursday' },
  { id: 'FRIDAY', bn: 'শুক্রবার', en: 'Friday' },
];

interface ScheduleBuilderProps {
  doctorName?: string;
  bmdcNumber?: string;
  onSave?: (schedule: any) => void;
  onClose?: () => void;
}

export default function ScheduleBuilder({
  doctorName = 'ডাঃ রফিকুল ইসলাম (Dr. Rafiqul Islam)',
  bmdcNumber = 'A-45892',
  onSave,
  onClose,
}: ScheduleBuilderProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>(['SATURDAY', 'MONDAY', 'WEDNESDAY']);
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('20:00');
  const [slotDuration, setSlotDuration] = useState(15);
  const [maxCapacity, setMaxCapacity] = useState(16);
  const [consultationFee, setConsultationFee] = useState(800);
  const [followupFee, setFollowupFee] = useState(400);
  const [followupDays, setFollowupDays] = useState(14);
  const [chamberRoom, setChamberRoom] = useState('Room 204 (Level 2)');
  const [isSaved, setIsSaved] = useState(false);

  // Toggle Day
  const toggleDay = (dayId: string) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  // Calculate generated slot count
  const calculateTotalMinutes = () => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const diff = (endH * 60 + endM) - (startH * 60 + startM);
    return diff > 0 ? diff : 0;
  };

  const totalSessionMinutes = calculateTotalMinutes();
  const calculatedPossibleSlots = slotDuration > 0 ? Math.floor(totalSessionMinutes / slotDuration) : 0;
  const effectiveCapacity = Math.min(calculatedPossibleSlots, maxCapacity);

  // Generate slot sample previews
  const generatePreviewSlots = () => {
    const slots = [];
    const [startH, startM] = startTime.split(':').map(Number);
    let curMinutes = startH * 60 + startM;

    for (let i = 0; i < Math.min(effectiveCapacity, 8); i++) {
      const h = Math.floor(curMinutes / 60);
      const m = curMinutes % 60;
      const formatted = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      slots.push({ token: i + 1, time: formatted });
      curMinutes += slotDuration;
    }
    return slots;
  };

  const previewSlots = generatePreviewSlots();

  const handleSave = () => {
    const payload = {
      doctorName,
      bmdcNumber,
      selectedDays,
      startTime,
      endTime,
      slotDuration,
      maxCapacity: effectiveCapacity,
      consultationFee,
      followupFee,
      followupDays,
      chamberRoom,
    };
    setIsSaved(true);
    onSave?.(payload);
    setTimeout(() => {
      setIsSaved(false);
      onClose?.();
    }, 1500);
  };

  return (
    <div className="portal-card" style={{ maxWidth: '820px', margin: '0 auto' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid var(--slate-200)', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--brand-teal-50)', color: 'var(--brand-teal-600)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
            <span>📅</span> শিডিউল কনফিগারেশন ইঞ্জিন (Slot Schedule Builder)
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-navy-900)' }}>
            {doctorName}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            BMDC: {bmdcNumber} • মৌলভীবাজার প্রধান শাখা
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ padding: '6px 12px', background: 'var(--slate-100)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-600)' }}>
            বন্ধ করুন ✕
          </button>
        )}
      </div>

      {isSaved && (
        <div className="auth-success" style={{ marginBottom: '16px' }}>
          ✓ ডাক্তারের চেম্বার শিডিউল এবং স্লট কাঠামো সফলভাবে আপডেট হয়েছে!
        </div>
      )}

      {/* 1. Day of Week Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '8px' }}>
          রোগী দেখার দিনসমূহ নির্ধারণ করুন (Days of Week) *
        </label>
        <div className="day-pills-row">
          {DAYS_OF_WEEK.map((day) => {
            const isSelected = selectedDays.includes(day.id);
            return (
              <button
                key={day.id}
                type="button"
                className={`day-pill ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleDay(day.id)}
              >
                {day.bn} ({day.en.slice(0, 3)})
              </button>
            );
          })}
        </div>
        {selectedDays.length === 0 && (
          <p style={{ fontSize: '0.8rem', color: 'var(--brand-rose-600)', marginTop: '4px' }}>
            অন্তত একটি দিন নির্বাচন করুন।
          </p>
        )}
      </div>

      {/* 2. Timing and Slot Rules */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div className="auth-field">
          <label>সেশন শুরুর সময়</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label>সেশন সমাপ্তির সময়</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label>স্লট প্রতি সময় (মিনিট)</label>
          <select value={slotDuration} onChange={(e) => setSlotDuration(Number(e.target.value))}>
            <option value={10}>১০ মিনিট</option>
            <option value={15}>১৫ মিনিট (মানসম্মত)</option>
            <option value={20}>২০ মিনিট</option>
            <option value={30}>৩০ মিনিট</option>
          </select>
        </div>

        <div className="auth-field">
          <label>সর্বোচ্চ রোগী ক্ষমতা (Capacity)</label>
          <input
            type="number"
            value={maxCapacity}
            onChange={(e) => setMaxCapacity(Number(e.target.value))}
            min={1}
            max={60}
          />
        </div>
      </div>

      {/* 3. Fees and Chamber Room */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="auth-field">
          <label>নতুন রোগীর ভিজিট ফি (BDT)</label>
          <input
            type="number"
            value={consultationFee}
            onChange={(e) => setConsultationFee(Number(e.target.value))}
            min={0}
            step={50}
          />
        </div>

        <div className="auth-field">
          <label>ফলো-আপ ফি (BDT)</label>
          <input
            type="number"
            value={followupFee}
            onChange={(e) => setFollowupFee(Number(e.target.value))}
            min={0}
            step={50}
          />
        </div>

        <div className="auth-field">
          <label>ফলো-আপ মেয়াদ (দিন)</label>
          <input
            type="number"
            value={followupDays}
            onChange={(e) => setFollowupDays(Number(e.target.value))}
            min={1}
            max={90}
          />
        </div>

        <div className="auth-field">
          <label>চেম্বার কক্ষ নম্বর</label>
          <input
            type="text"
            value={chamberRoom}
            onChange={(e) => setChamberRoom(e.target.value)}
          />
        </div>
      </div>

      {/* 4. Live Slot Generator Preview */}
      <div style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: '10px', border: '1px solid var(--slate-200)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--brand-navy-900)' }}>
            ⚡ লাইভ স্লট ও টোকেন জেনারেটর প্রিভিউ (Slot Engine Calculation)
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', background: 'white', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--slate-300)' }}>
            মোট সময়: {Math.floor(totalSessionMinutes / 60)} ঘণ্টা {totalSessionMinutes % 60} মিনিট • নির্ধারিত কোটা: <strong>{effectiveCapacity} জন</strong>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {previewSlots.map((slot) => (
            <div
              key={slot.token}
              style={{
                background: 'white',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
              }}
            >
              <span style={{ background: 'var(--brand-teal-50)', color: 'var(--brand-teal-600)', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>
                #{slot.token}
              </span>
              <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{slot.time}</span>
            </div>
          ))}
          {effectiveCapacity > previewSlots.length && (
            <div style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center' }}>
              + আরো {effectiveCapacity - previewSlots.length} টি স্লট স্বয়ংক্রিয়ভাবে তৈরি হবে
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{ padding: '10px 18px', border: '1px solid var(--slate-300)', borderRadius: '8px', fontWeight: 600, color: 'var(--slate-700)' }}
          >
            বাতিল
          </button>
        )}
        <button
          type="button"
          className="btn-primary"
          onClick={handleSave}
          disabled={selectedDays.length === 0 || effectiveCapacity <= 0}
        >
          শিডিউল সংরক্ষণ করুন ও স্লট সক্রিয় করুন ✓
        </button>
      </div>
    </div>
  );
}
