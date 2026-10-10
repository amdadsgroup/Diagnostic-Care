'use client';

import React from 'react';
import {
  Stethoscope,
  HeartPulse,
  Baby,
  Activity,
  Bone,
  Sparkles,
  Smile,
  ArrowRight,
} from 'lucide-react';
import { SupportedLanguage } from '@/config/brand';

export type HealthcareCategoryKey =
  | 'ALL'
  | 'DOCTOR'
  | 'DOCTORS'
  | 'Cardiologist'
  | 'Gynecologist'
  | 'Pediatrics'
  | 'Medicine'
  | 'Orthopedics'
  | 'Dermatology'
  | 'Dentist'
  | 'Neurology'
  | 'ENT';

interface CategoryNavigatorProps {
  activeCategory: string;
  onSelectCategory: (specialty: string) => void;
  onOpenSupportModal?: () => void;
  language?: SupportedLanguage;
}

export default function CategoryNavigator({
  activeCategory,
  onSelectCategory,
  language = 'en',
}: CategoryNavigatorProps) {
  const specialties = [
    {
      key: 'ALL',
      nameEn: 'All Doctors',
      nameBn: 'সব ডাক্তার',
      descEn: 'Browse all verified specialists',
      descBn: 'সকল ভেরিফায়েড বিশেষজ্ঞ চিকিৎসক',
      count: '1,200+ Doctors',
      icon: Stethoscope,
      bg: 'rgba(0, 96, 250, 0.1)',
      color: '#0060FA',
    },
    {
      key: 'Cardiologist',
      nameEn: 'Cardiology',
      nameBn: 'কার্ডিওলজি (হৃদরোগ)',
      descEn: 'Heart, ECG, Echo & Cardiac care',
      descBn: 'হৃদরোগ, ইসিজি ও কার্ডিয়াক কেয়ার',
      count: '140+ Doctors',
      icon: HeartPulse,
      bg: 'rgba(239, 68, 68, 0.1)',
      color: '#DC2626',
    },
    {
      key: 'Medicine',
      nameEn: 'General Medicine',
      nameBn: 'জেনারেল মেডিসিন',
      descEn: 'Internal medicine & chronic care',
      descBn: 'সাধারণ রোগ, ডায়াবেটিস ও জ্বর',
      count: '320+ Doctors',
      icon: Activity,
      bg: 'rgba(37, 99, 235, 0.1)',
      color: '#2563EB',
    },
    {
      key: 'Gynecologist',
      nameEn: 'Gynecology & Obs',
      nameBn: 'স্ত্রী ও প্রসূতি রোগ',
      descEn: "Maternity, pregnancy & women's care",
      descBn: 'মাতৃত্ব, গর্ভকালীন ও প্রসূতি সেবা',
      count: '190+ Doctors',
      icon: Sparkles,
      bg: 'rgba(217, 70, 239, 0.1)',
      color: '#C026D3',
    },
    {
      key: 'Pediatrics',
      nameEn: 'Pediatrics',
      nameBn: 'শিশু রোগ বিশেষজ্ঞ',
      descEn: 'Newborn, infant & child health',
      descBn: 'নবজাতক ও শিশু বিশেষজ্ঞ চিকিৎসক',
      count: '160+ Doctors',
      icon: Baby,
      bg: 'rgba(245, 158, 11, 0.1)',
      color: '#D97706',
    },
    {
      key: 'Orthopedics',
      nameEn: 'Orthopedics',
      nameBn: 'অর্থোপেডিকস (হাড়)',
      descEn: 'Bones, joints, fractures & spine',
      descBn: 'হাড়, জোড়া, বাত ও স্পাইন কেয়ার',
      count: '110+ Doctors',
      icon: Bone,
      bg: 'rgba(13, 148, 136, 0.1)',
      color: '#0D9488',
    },
    {
      key: 'Dermatology',
      nameEn: 'Dermatology',
      nameBn: 'চর্ম ও যৌন রোগ',
      descEn: 'Skin, hair, allergy & cosmetic care',
      descBn: 'ত্বক, চুল, এলার্জি ও চর্মরোগ',
      count: '95+ Doctors',
      icon: Sparkles,
      bg: 'rgba(168, 85, 247, 0.1)',
      color: '#9333EA',
    },
    {
      key: 'Dentist',
      nameEn: 'Dentistry',
      nameBn: 'দন্ত ও ডেন্টাল সার্জারি',
      descEn: 'Teeth, gums, root canal & dental care',
      descBn: 'দাঁত, মাড়ি ও রুট ক্যানেল সার্জারি',
      count: '80+ Doctors',
      icon: Smile,
      bg: 'rgba(6, 182, 212, 0.1)',
      color: '#0891B2',
    },
  ];

  return (
    <div style={{ width: '100%', marginBottom: '16px' }}>
      {/* Section Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div
            className="glass-badge-teal"
            style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '6px',
            }}
          >
            {language === 'en' ? 'MEDICAL SPECIALTIES' : 'মেডিকেল স্পেশালিস্ট ক্যাটাগরি'}
          </div>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            {language === 'en' ? 'Find by Medical Specialty' : 'বিভাগ অনুযায়ী বিশেষজ্ঞ ডাক্তার খুঁজুন'}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13.5px', marginTop: '4px', margin: 0 }}>
            {language === 'en'
              ? 'Select a department to filter verified BMDC doctors and view available appointments.'
              : 'বিভাগ নির্বাচন করে ভেরিফাইড ডাক্তারের চেম্বার ও আজকের সিরিয়াল দেখুন।'}
          </p>
        </div>

        <a
          href="/doctors"
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--color-primary)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>{language === 'en' ? 'View All Doctors' : 'সব ডাক্তার দেখুন'}</span>
          <ArrowRight size={14} />
        </a>
      </div>

      {/* Specialty Grid */}
      <div
        className="category-navigator-grid"
        style={{
          display: 'grid',
          gap: '16px',
        }}
      >
        {specialties.map((item) => {
          const Icon = item.icon;
          const isSelected = activeCategory.toLowerCase() === item.key.toLowerCase();

          return (
            <div
              key={item.key}
              onClick={() => onSelectCategory(item.key)}
              className="glass-card-interactive"
              style={{
                padding: '20px',
                borderRadius: '18px',
                border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)',
                backgroundColor: isSelected ? 'rgba(235, 243, 255, 0.75)' : 'var(--glass-surface-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                boxShadow: isSelected ? '0 8px 24px rgba(0, 96, 250, 0.2)' : 'var(--glass-shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: item.bg,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: `1px solid ${item.color}30`,
                  }}
                >
                  <Icon size={22} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: 800,
                      color: 'var(--color-text-primary)',
                      lineHeight: 1.25,
                    }}
                  >
                    {language === 'en' ? item.nameEn : item.nameBn}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-text-secondary)',
                      marginTop: '4px',
                      lineHeight: 1.35,
                    }}
                  >
                    {language === 'en' ? item.descEn : item.descBn}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(226, 232, 240, 0.6)',
                }}
              >
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  }}
                >
                  {item.count}
                </span>

                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: 'var(--color-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {language === 'en' ? 'Find' : 'দেখুন'}
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
