'use client';

import React from 'react';
import {
  Stethoscope,
  TestTube2,
  Building2,
  HeartPulse,
  Pill,
  Ambulance,
  Home,
  UserCheck,
  Droplet,
  PackageCheck,
  Microscope,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { SupportedLanguage, BRAND_COLORS } from '@/config/brand';
import { TRANSLATIONS } from '@/i18n/translations';

export type HealthcareCategoryKey =
  | 'ALL'
  | 'DOCTOR'
  | 'DOCTORS'
  | 'DIAGNOSTIC_CENTER'
  | 'DIAGNOSTIC_TESTS'
  | 'TESTS'
  | 'HOSPITAL'
  | 'HOSPITALS'
  | 'PHARMACY'
  | 'PHARMACIES'
  | 'AMBULANCE'
  | 'HOME_CARE'
  | 'NURSING'
  | 'BLOOD_SERVICES'
  | 'PACKAGES'
  | 'MEDICAL_EQUIPMENT'
  | 'EMERGENCY';

interface CategoryNavigatorProps {
  activeCategory: HealthcareCategoryKey;
  onSelectCategory: (category: HealthcareCategoryKey) => void;
  onOpenAmbulanceModal?: () => void;
  onOpenHomeCareModal?: () => void;
  onOpenSupportModal?: () => void;
  language?: SupportedLanguage;
}

export default function CategoryNavigator({
  activeCategory,
  onSelectCategory,
  onOpenAmbulanceModal,
  onOpenHomeCareModal,
  onOpenSupportModal,
  language = 'en',
}: CategoryNavigatorProps) {
  const t = TRANSLATIONS[language];

  // Official Category Card Definitions adhering to brand icon language & required fields
  const categories = [
    {
      key: 'DOCTOR' as const,
      nameEn: 'Doctor',
      nameBn: 'বিশেষজ্ঞ ডাক্তার',
      descEn: 'Find and book verified doctors',
      descBn: 'সান্ধ্যকালীন চেম্বার ও কনসালটেশন',
      infoEn: 'BMDC Registered • Moulvibazar Hub',
      infoBn: 'বিএমডিসি রেজিস্টার্ড স্পেশালিস্ট',
      actionEn: 'Book Doctor',
      actionBn: 'সিরিয়াল নিন',
      icon: Stethoscope,
    },
    {
      key: 'DIAGNOSTIC_CENTER' as const,
      nameEn: 'Diagnostic Centers',
      nameBn: 'ডায়াগনস্টিক সেন্টার',
      descEn: 'Find nearby diagnostic services',
      descBn: 'আধুনিক প্যাথলজি ল্যাব ও চেম্বার',
      infoEn: 'Accredited Labs • Fast Turnaround',
      infoBn: 'অ্যাক্রিডিটেড ল্যাব নেটওয়ার্ক',
      actionEn: 'Find Centers',
      actionBn: 'সেন্টার খুঁজুন',
      icon: Building2,
    },
    {
      key: 'DIAGNOSTIC_TESTS' as const,
      nameEn: 'Diagnostic Tests',
      nameBn: 'প্যাথলজি ও টেস্ট',
      descEn: 'Book lab tests & compare prices',
      descBn: 'রক্ত, প্রস্রাব ও রেডিওলজি টেস্ট',
      infoEn: 'Transparent Pricing • Digital Reports',
      infoBn: 'স্বচ্ছ মূল্য • ডিজিটাল রিপোর্ট',
      actionEn: 'Book Test',
      actionBn: 'টেস্ট বুক করুন',
      icon: TestTube2,
    },
    {
      key: 'HOSPITAL' as const,
      nameEn: 'Hospitals & Clinics',
      nameBn: 'হাসপাতাল ও ক্লিনিক',
      descEn: 'Discover healthcare facilities',
      descBn: 'ভর্তি, ওটি ও সার্বক্ষণিক চিকিৎসা',
      infoEn: '24/7 Inpatient • Verified Care',
      infoBn: 'সার্বক্ষণিক ইনপেশেন্ট সেবা',
      actionEn: 'Explore Clinics',
      actionBn: 'হাসপাতাল দেখুন',
      icon: HeartPulse,
    },
    {
      key: 'PHARMACY' as const,
      nameEn: 'Pharmacies',
      nameBn: 'ফার্মেসি ও ঔষধ',
      descEn: 'Find medicines and pharmacy services',
      descBn: 'জেনুইন ঔষধ ও প্রেসক্রিপশন সার্ভিস',
      infoEn: '100% Genuine • Licensed Pharmacies',
      infoBn: 'লাইসেন্সপ্রাপ্ত ফার্মেসি',
      actionEn: 'Find Medicines',
      actionBn: 'ঔষধ খুঁজুন',
      icon: Pill,
    },
    {
      key: 'AMBULANCE' as const,
      nameEn: 'Ambulance',
      nameBn: 'জরুরি অ্যাম্বুলেন্স',
      descEn: 'Find emergency ambulance services',
      descBn: 'আইসিইউ ও এসি অ্যাম্বুলেন্স সার্ভিস',
      infoEn: '24/7 Immediate Dispatch',
      infoBn: '২৪/৭ তাৎক্ষণিক ডিসপ্যাচ',
      actionEn: 'Dispatch Now',
      actionBn: 'কল করুন',
      icon: Ambulance,
      isEmergency: true,
    },
    {
      key: 'HOME_CARE' as const,
      nameEn: 'Home Healthcare',
      nameBn: 'হোম হেলথকেয়ার',
      descEn: 'Get healthcare at home',
      descBn: 'বাসায় গিয়ে ল্যাব স্যাম্পল ও সেবা',
      infoEn: 'Doorstep Phlebotomy & Vitals',
      infoBn: 'বাসায় ল্যাব স্যাম্পল সংগ্রহ',
      actionEn: 'Request Care',
      actionBn: 'হোম কেয়ার নিন',
      icon: Home,
    },
    {
      key: 'BLOOD_SERVICES' as const,
      nameEn: 'Blood Bank',
      nameBn: 'ব্লাড ব্যাংক',
      descEn: 'Emergency blood donor network',
      descBn: 'জরুরি রক্তের গ্রুপ ও ডোনার সংযোগ',
      infoEn: 'All Blood Groups • Instant Match',
      infoBn: 'সকল রক্তের গ্রুপ প্রস্তুত',
      actionEn: 'Find Blood',
      actionBn: 'রক্ত খুঁজুন',
      icon: Droplet,
    },
    {
      key: 'PACKAGES' as const,
      nameEn: 'Health Packages',
      nameBn: 'হেলথ প্যাকেজ',
      descEn: 'Executive full body checkups',
      descBn: 'সম্পূর্ণ শারীরিক স্বাস্থ্য স্ক্রিনিং',
      infoEn: 'Special Discounts Included',
      infoBn: 'প্যাকেজে বিশেষ মূল্যছাড়',
      actionEn: 'View Packages',
      actionBn: 'প্যাকেজ দেখুন',
      icon: PackageCheck,
    },
  ];

  return (
    <section style={{ marginBottom: '40px' }} aria-labelledby="category-section-title">
      {/* Section Header */}
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
              color: BRAND_COLORS.primary,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '4px',
            }}
          >
            {t.categoriesTitle}
          </div>
          <h2
            id="category-section-title"
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#000000',
              letterSpacing: '-0.02em',
            }}
          >
            {language === 'en' ? 'Healthcare Services & Facilities' : 'স্বাস্থ্যসেবা ও ক্লিনিক্যাল ফ্যাসিলিটি'}
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
          {t.categoriesSubtitle}
        </p>
      </div>

      {/* Categories Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {categories.map((cat) => {
          const isSelected =
            activeCategory === cat.key ||
            (cat.key === 'DOCTOR' && activeCategory === 'DOCTORS') ||
            (cat.key === 'DIAGNOSTIC_TESTS' && activeCategory === 'TESTS');
          const Icon = cat.icon;

          return (
            <div
              key={cat.key}
              onClick={() => {
                onSelectCategory(cat.key);
                if (cat.key === 'AMBULANCE' && onOpenAmbulanceModal) {
                  onOpenAmbulanceModal();
                } else if (cat.key === 'HOME_CARE' && onOpenHomeCareModal) {
                  onOpenHomeCareModal();
                } else if (cat.key === 'BLOOD_SERVICES' && onOpenSupportModal) {
                  onOpenSupportModal();
                }
              }}
              className="service-card"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectCategory(cat.key);
                }
              }}
              style={{
                backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.88)' : 'var(--glass-surface-card)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: '20px',
                padding: '22px',
                border: isSelected
                  ? `2px solid ${BRAND_COLORS.primary}`
                  : '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                boxShadow: isSelected
                  ? 'var(--glass-shadow-hover)'
                  : 'var(--glass-shadow-card)',
              }}
            >
              {/* Top Row: Service Icon & Optional Status Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  className="clay-bubble"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '16px',
                    backgroundColor: isSelected ? BRAND_COLORS.primary : BRAND_COLORS.primaryLight,
                    color: isSelected ? '#FFFFFF' : BRAND_COLORS.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    flexShrink: 0,
                    boxShadow: isSelected ? 'var(--clay-btn-primary-shadow)' : 'var(--clay-pill-shadow)',
                  }}
                >
                  <Icon size={24} strokeWidth={2.2} />
                </div>

                {cat.isEmergency && (
                  <span
                    className="clay-badge-rose"
                    style={{
                      fontSize: '10px',
                      padding: '3px 10px',
                      borderRadius: '9999px',
                    }}
                  >
                    24/7 LIVE
                  </span>
                )}
              </div>

              {/* Service Info */}
              <div>
                <h3
                  style={{
                    fontSize: '16.5px',
                    fontWeight: 800,
                    color: '#10294F',
                    lineHeight: 1.25,
                    marginBottom: '5px',
                  }}
                >
                  {language === 'en' ? cat.nameEn : cat.nameBn}
                </h3>
                <p
                  style={{
                    fontSize: '12.5px',
                    color: '#576982',
                    lineHeight: 1.45,
                    marginBottom: '8px',
                  }}
                >
                  {language === 'en' ? cat.descEn : cat.descBn}
                </p>

                {/* Location / Count info */}
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#8FA2BA',
                  }}
                >
                  {language === 'en' ? cat.infoEn : cat.infoBn}
                </div>
              </div>

              {/* Clear Action Link */}
              <div
                className="clay-pill"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: isSelected ? '#1769F5' : '#10294F',
                  width: 'fit-content',
                  padding: '6px 14px',
                  border: '1.5px solid rgba(255, 255, 255, 0.95)',
                }}
              >
                <span>{language === 'en' ? cat.actionEn : cat.actionBn}</span>
                <ArrowRight size={13} color="#1769F5" />
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .service-card:hover {
          transform: translateY(-4px) scale(1.01);
          border-color: rgba(23, 105, 245, 0.35);
          box-shadow: var(--clay-card-hover-shadow);
        }
      `}</style>
    </section>
  );
}
