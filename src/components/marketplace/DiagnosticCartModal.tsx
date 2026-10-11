'use client';

import React, { useState } from 'react';
import { 
  TestTube2, 
  ShoppingCart, 
  Home, 
  Building2, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  X, 
  ChevronRight,
  ShieldCheck,
  FileText,
  Trash2
} from 'lucide-react';
import { SupportedLanguage } from '@/config/brand';

export interface DiagnosticTestItem {
  id: string;
  name: string;
  nameBn: string;
  category: 'BLOOD' | 'IMAGING' | 'HORMONES' | 'CARDIOLOGY' | 'HEALTH_PACKAGE';
  price: number;
  discountPrice?: number;
  fastingRequired: boolean;
  homeCollectionAvailable: boolean;
  turnaroundHours: number;
  description: string;
  descriptionBn: string;
}

export const DIAGNOSTIC_TESTS_CATALOG: DiagnosticTestItem[] = [
  {
    id: 'test-cbc',
    name: 'Complete Blood Count (CBC)',
    nameBn: 'কমপ্লিট ব্লাড কাউন্ট (CBC)',
    category: 'BLOOD',
    price: 400,
    discountPrice: 350,
    fastingRequired: false,
    homeCollectionAvailable: true,
    turnaroundHours: 12,
    description: 'Measures red/white cells, hemoglobin, and platelets.',
    descriptionBn: 'রক্তের লোহিত ও শ্বেতকণিকা, হিমোগ্লোবিন এবং প্লেটলেট পরীক্ষা।',
  },
  {
    id: 'test-lipid',
    name: 'Lipid Profile',
    nameBn: 'লিপিড প্রোফাইল (রক্তের চর্বি)',
    category: 'BLOOD',
    price: 1000,
    discountPrice: 850,
    fastingRequired: true,
    homeCollectionAvailable: true,
    turnaroundHours: 24,
    description: 'Total cholesterol, HDL, LDL, and triglycerides.',
    descriptionBn: 'রক্তের কোলেস্টেরল ও ট্রাইগ্লিসারাইড পরীক্ষা (১০-১২ ঘণ্টা খালি পেটে থাকতে হয়)।',
  },
  {
    id: 'test-hba1c',
    name: 'HbA1c (3-Month Sugar)',
    nameBn: 'এইচবিএওয়ানসি (৩ মাসের গড় সুগার)',
    category: 'HORMONES',
    price: 900,
    discountPrice: 750,
    fastingRequired: false,
    homeCollectionAvailable: true,
    turnaroundHours: 12,
    description: 'Gold standard diabetes monitoring marker.',
    descriptionBn: 'ডায়াবেটিস রোগীদের বিগত ৩ মাসের রক্তের গ্লুকোজের গড় মাত্রা।',
  },
  {
    id: 'test-creatinine',
    name: 'Serum Creatinine (Kidney)',
    nameBn: 'সিরাম ক্রিয়েটিনিন (কিডনি পরীক্ষা)',
    category: 'BLOOD',
    price: 450,
    discountPrice: 400,
    fastingRequired: false,
    homeCollectionAvailable: true,
    turnaroundHours: 12,
    description: 'Assesses renal filtration function.',
    descriptionBn: 'কিডনির ফিল্টারিং কার্যক্ষমতা জানার জরুরি পরীক্ষা।',
  },
  {
    id: 'test-tsh',
    name: 'Thyroid Stimulating Hormone (TSH)',
    nameBn: 'টিএসএইচ (থাইরয়েড হরমোন)',
    category: 'HORMONES',
    price: 800,
    discountPrice: 700,
    fastingRequired: false,
    homeCollectionAvailable: true,
    turnaroundHours: 24,
    description: 'Evaluates thyroid hyperactivity or hypoactivity.',
    descriptionBn: 'থাইরয়েড গ্রন্থির হরমোন ভারসাম্য পরীক্ষা।',
  },
  {
    id: 'test-xray-chest',
    name: 'Digital Chest X-Ray (P/A View)',
    nameBn: 'ডিজিটাল চেস্ট এক্স-রে (বুকের এক্স-রে)',
    category: 'IMAGING',
    price: 600,
    fastingRequired: false,
    homeCollectionAvailable: false,
    turnaroundHours: 6,
    description: 'High-clarity pulmonary and cardiovascular imaging.',
    descriptionBn: 'ফুসফুস ও হৃদযন্ত্রের নির্ভুল ডিজিটাল এক্স-রে ইমেজ।',
  },
  {
    id: 'test-usg-abdomen',
    name: 'USG of Whole Abdomen',
    nameBn: 'হোল অ্যাবডোমেন আল্ট্রাসনোগ্রাফি (USG)',
    category: 'IMAGING',
    price: 1500,
    fastingRequired: true,
    homeCollectionAvailable: false,
    turnaroundHours: 4,
    description: 'Liver, gallbladder, kidneys, and abdominal sonography.',
    descriptionBn: 'লিভার, পিত্তথলি, কিডনি ও পেটের সম্পূর্ণ আল্ট্রাসনোগ্রাফি।',
  },
  {
    id: 'test-ecg',
    name: '12-Lead Digital ECG',
    nameBn: '১২-লিড ডিজিটাল ইসিজি',
    category: 'CARDIOLOGY',
    price: 400,
    fastingRequired: false,
    homeCollectionAvailable: true,
    turnaroundHours: 2,
    description: 'Instant cardiovascular rhythm analysis.',
    descriptionBn: 'হৃদস্পন্দন ও কার্ডিয়াক রিদম রেকর্ডিং।',
  },
  {
    id: 'test-full-body',
    name: 'Executive Full Body Health Package',
    nameBn: 'এক্সিকিউটিভ সম্পূর্ণ শরীর চেকআপ প্যাকেজ',
    category: 'HEALTH_PACKAGE',
    price: 4500,
    discountPrice: 3500,
    fastingRequired: true,
    homeCollectionAvailable: true,
    turnaroundHours: 24,
    description: 'CBC, Lipid, HbA1c, Creatinine, Liver (SGPT), Urine R/E + ECG.',
    descriptionBn: 'সিবিসি, লিপিড, সুগার, কিডনি ও লিভার ফাংশনসহ পূর্ণাঙ্গ স্বাস্থ্য স্ক্রীনিং।',
  },
];

interface DiagnosticCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  onProceedToPayment?: (order: {
    tests: DiagnosticTestItem[];
    totalAmount: number;
    collectionType: 'LAB_VISIT' | 'HOME_COLLECTION';
    address?: string;
    preferredDate?: string;
    preferredTime?: string;
    patientName: string;
    patientPhone: string;
  }) => void;
}

export default function DiagnosticCartModal({
  isOpen,
  onClose,
  language,
  onProceedToPayment,
}: DiagnosticCartModalProps) {
  const [cart, setCart] = useState<DiagnosticTestItem[]>([]);
  const [collectionType, setCollectionType] = useState<'LAB_VISIT' | 'HOME_COLLECTION'>('LAB_VISIT');
  const [selectedCenter, setSelectedCenter] = useState('পপুলার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার)');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [address, setAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('08:00 AM - 10:00 AM');
  const [orderStep, setOrderStep] = useState<'SELECT' | 'CHECKOUT' | 'SUCCESS'>('SELECT');
  const [confirmedBookingCode, setConfirmedBookingCode] = useState('');

  if (!isOpen) return null;

  const isBn = language === 'bn';

  const toggleTest = (test: DiagnosticTestItem) => {
    if (cart.some((t) => t.id === test.id)) {
      setCart(cart.filter((t) => t.id !== test.id));
    } else {
      setCart([...cart, test]);
    }
  };

  const removeFromCart = (testId: string) => {
    setCart(cart.filter((t) => t.id !== testId));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.discountPrice || item.price), 0);
  const homeCollectionFee = collectionType === 'HOME_COLLECTION' ? 150 : 0;
  const grandTotal = totalAmount + homeCollectionFee;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setOrderStep('CHECKOUT');
  };

  const handleConfirmOrder = () => {
    if (!patientName || !patientPhone) {
      alert(isBn ? 'দয়া করে রোগীর নাম এবং মোবাইল নাম্বার দিন।' : 'Please enter patient name and phone number.');
      return;
    }
    if (collectionType === 'HOME_COLLECTION' && !address) {
      alert(isBn ? 'দয়া করে হোম কালেকশনের ঠিকানা উল্লেখ করুন।' : 'Please specify address for home sample collection.');
      return;
    }

    const code = `LAB-${Date.now().toString().slice(-6)}`;
    setConfirmedBookingCode(code);
    setOrderStep('SUCCESS');

    if (onProceedToPayment) {
      onProceedToPayment({
        tests: cart,
        totalAmount: grandTotal,
        collectionType,
        address,
        preferredDate,
        preferredTime,
        patientName,
        patientPhone,
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div 
        className="modal-container" 
        style={{ maxWidth: '840px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--brand-navy-900) 0%, var(--brand-teal-800) 100%)',
          color: 'white',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 800 }}>
              <TestTube2 size={24} color="#34d399" />
              {isBn ? 'ডায়াগনস্টিক ও প্যাথলজি টেস্ট ক্যাটালগ' : 'Diagnostic & Pathology Test Catalog'}
            </div>
            <div style={{ fontSize: '0.82rem', opacity: 0.9, marginTop: '4px' }}>
              {isBn ? 'স্বীকৃত ল্যাব টেস্ট নির্বাচন করুন এবং হোম স্যাম্পল সংগ্রহ বুক করুন' : 'Select accredited lab tests & book home sample collection'}
            </div>
          </div>
          <button className="modal-close" onClick={onClose} style={{ color: 'white', opacity: 0.8 }}>
            <X size={20} />
          </button>
        </div>

        {orderStep === 'SELECT' && (
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }} className="diagnostic-modal-grid">
              {/* Test List */}
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--brand-navy-900)', marginBottom: '12px' }}>
                  {isBn ? 'উপলব্ধ টেস্টসমূহ (ক্লিক করে কার্টে যোগ করুন)' : 'Available Tests (Click to Add to Cart)'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {DIAGNOSTIC_TESTS_CATALOG.map((test) => {
                    const isSelected = cart.some((t) => t.id === test.id);
                    return (
                      <div
                        key={test.id}
                        onClick={() => toggleTest(test)}
                        style={{
                          border: isSelected ? '2px solid var(--brand-teal-600)' : '1px solid var(--slate-200)',
                          backgroundColor: isSelected ? 'var(--brand-teal-50)' : '#FFFFFF',
                          borderRadius: '12px',
                          padding: '14px 16px',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--brand-navy-900)' }}>
                              {isBn ? test.nameBn : test.name}
                            </span>
                            {test.homeCollectionAvailable && (
                              <span style={{
                                backgroundColor: '#ecfdf5',
                                color: '#059669',
                                fontSize: '0.68rem',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontWeight: 700,
                              }}>
                                🏠 {isBn ? 'হোম স্যাম্পল' : 'Home Sample'}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '4px' }}>
                            {isBn ? test.descriptionBn : test.description}
                          </div>
                          <div style={{ display: 'flex', gap: '12px', fontSize: '0.72rem', color: 'var(--slate-600)', marginTop: '6px' }}>
                            <span>⏱️ রিপোর্ট: {test.turnaroundHours} ঘণ্টা</span>
                            {test.fastingRequired && <span style={{ color: '#d97706', fontWeight: 600 }}>⚠️ খালি পেটে প্রয়োজন</span>}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', minWidth: '90px' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-teal-700)' }}>
                            ৳{test.discountPrice || test.price}
                          </div>
                          {test.discountPrice && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', textDecoration: 'line-through' }}>
                              ৳{test.price}
                            </div>
                          )}
                          <div style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: isSelected ? 'var(--brand-teal-700)' : 'var(--slate-500)',
                            marginTop: '6px',
                          }}>
                            {isSelected ? '✓ যোগ করা হয়েছে' : '+ যোগ করুন'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cart Summary Side Column */}
              <div style={{
                backgroundColor: 'var(--slate-50)',
                border: '1px solid var(--slate-200)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                height: 'fit-content',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem', fontWeight: 800, color: 'var(--brand-navy-900)', marginBottom: '14px' }}>
                  <ShoppingCart size={18} color="var(--brand-teal-600)" />
                  {isBn ? 'টেস্ট কার্ট' : 'Test Cart'} ({cart.length})
                </div>

                {cart.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--slate-400)', fontSize: '0.85rem' }}>
                    {isBn ? 'আপনার কার্টে কোনো টেস্ট নির্বাচন করা হয়নি।' : 'No tests added to cart yet.'}
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', maxHeight: '220px', overflowY: 'auto' }}>
                      {cart.map((t) => (
                        <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', backgroundColor: '#FFFFFF', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
                          <span style={{ fontWeight: 600, color: 'var(--brand-navy-900)' }}>
                            {isBn ? t.nameBn : t.name}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, color: 'var(--brand-teal-700)' }}>
                              ৳{t.discountPrice || t.price}
                            </span>
                            <button
                              onClick={() => removeFromCart(t.id)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ borderTop: '1px dashed var(--slate-300)', paddingTop: '12px', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                        <span style={{ color: 'var(--slate-600)' }}>{isBn ? 'টেস্টের মোট মূল্য' : 'Subtotal'}:</span>
                        <span style={{ fontWeight: 700 }}>৳{totalAmount}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: 'var(--brand-navy-900)', marginTop: '8px' }}>
                        <span>{isBn ? 'মোট' : 'Total'}:</span>
                        <span style={{ color: 'var(--brand-teal-700)' }}>৳{totalAmount}</span>
                      </div>

                      <button
                        onClick={handleCheckout}
                        style={{
                          width: '100%',
                          backgroundColor: 'var(--brand-teal-600)',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          padding: '12px',
                          borderRadius: '10px',
                          border: 'none',
                          cursor: 'pointer',
                          marginTop: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        {isBn ? 'পরবর্তী ধাপ (বুকিং)' : 'Proceed to Checkout'}
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Checkout & Home Collection Option */}
        {orderStep === 'CHECKOUT' && (
          <div style={{ padding: '24px' }}>
            <button
              onClick={() => setOrderStep('SELECT')}
              style={{ background: 'none', border: 'none', color: 'var(--brand-teal-600)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', marginBottom: '16px', padding: 0 }}
            >
              ← {isBn ? 'টেস্ট পরিবর্তন করুন' : 'Change Selected Tests'}
            </button>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-navy-900)', marginBottom: '16px' }}>
              {isBn ? 'স্যাম্পল সংগ্রহ এবং রোগীর তথ্য' : 'Sample Collection & Patient Information'}
            </h3>

            {/* Collection Mode Selection */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <div
                onClick={() => setCollectionType('LAB_VISIT')}
                style={{
                  border: collectionType === 'LAB_VISIT' ? '2px solid var(--brand-teal-600)' : '1px solid var(--slate-300)',
                  backgroundColor: collectionType === 'LAB_VISIT' ? 'var(--brand-teal-50)' : '#FFFFFF',
                  padding: '14px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Building2 size={24} color={collectionType === 'LAB_VISIT' ? 'var(--brand-teal-600)' : 'var(--slate-500)'} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{isBn ? 'ল্যাব সেন্টারে গিয়ে টেস্ট' : 'Visit Lab Center'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{isBn ? 'কোনো অতিরিক্ত ফি নেই' : 'No extra collection charge'}</div>
                </div>
              </div>

              <div
                onClick={() => setCollectionType('HOME_COLLECTION')}
                style={{
                  border: collectionType === 'HOME_COLLECTION' ? '2px solid var(--brand-teal-600)' : '1px solid var(--slate-300)',
                  backgroundColor: collectionType === 'HOME_COLLECTION' ? 'var(--brand-teal-50)' : '#FFFFFF',
                  padding: '14px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Home size={24} color={collectionType === 'HOME_COLLECTION' ? 'var(--brand-teal-600)' : 'var(--slate-500)'} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{isBn ? 'হোম স্যাম্পল কালেকশন' : 'Home Sample Collection'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--brand-emerald-600)', fontWeight: 600 }}>+৳১৫০ {isBn ? 'হোম সার্ভিস চার্জ' : 'Service fee'}</div>
                </div>
              </div>
            </div>

            {/* Diagnostic Center Selection */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                {isBn ? 'ডায়াগনস্টিক সেন্টার' : 'Diagnostic Center'}
              </label>
              <select
                value={selectedCenter}
                onChange={(e) => setSelectedCenter(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }}
              >
                <option value="পপুলার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার)">পপুলার ডায়াগনস্টিক সেন্টার (চৌমোহনা, মৌলভীবাজার)</option>
                <option value="লাইফ কেয়ার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার)">লাইফ কেয়ার ডায়াগনস্টিক সেন্টার (কুসুমবাগ, মৌলভীবাজার)</option>
                <option value="ইবনে সিনা ডায়াগনস্টিক সেন্টার (সিলেট)">ইবনে সিনা ডায়াগনস্টিক সেন্টার (রিকাবীবাজার, সিলেট)</option>
              </select>
            </div>

            {/* Patient Form */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                  {isBn ? 'রোগীর পূর্ণ নাম *' : 'Patient Full Name *'}
                </label>
                <input
                  type="text"
                  placeholder="যেমন: মোঃ কামরুল হাসান"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                  {isBn ? 'মোবাইল নাম্বার *' : 'Mobile Number *'}
                </label>
                <input
                  type="tel"
                  placeholder="017XXXXXXXX"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            {collectionType === 'HOME_COLLECTION' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                  {isBn ? 'হোম কালেকশনের পূর্ণ ঠিকানা (মৌলভীবাজার এলাকা) *' : 'Home Address (Moulvibazar Area) *'}
                </label>
                <input
                  type="text"
                  placeholder="বাড়ি নং, রাস্তা, এলাকা (যেমন: বাসা #৪, লেইক ভিউ রোড, বেরীরপাড়)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }}
                />
              </div>
            )}

            {/* Date and Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                  {isBn ? 'স্যাম্পল সংগ্রহের তারিখ' : 'Preferred Date'}
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                  {isBn ? 'পছন্দের সময়' : 'Preferred Time Window'}
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }}
                >
                  <option value="07:30 AM - 09:30 AM">সকাল ০৭:৩০ - ০৯:৩০ (খালি পেটের টেস্টের জন্য উত্তম)</option>
                  <option value="09:30 AM - 11:30 AM">সকাল ০৯:৩০ - ১১:৩০</option>
                  <option value="11:30 AM - 01:30 PM">দুপুর ১১:৩০ - ০১:৩০</option>
                  <option value="04:00 PM - 07:00 PM">বিকাল ০৪:০০ - সন্ধ্যা ০৭:০০</option>
                </select>
              </div>
            </div>

            {/* Total Billing Ribbon */}
            <div style={{
              backgroundColor: 'var(--slate-100)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                  {isBn ? 'টেস্টের সংখ্যা' : 'Tests'}: {cart.length} টি • {collectionType === 'HOME_COLLECTION' ? 'হোম স্যাম্পল (+৳১৫০)' : 'সেন্টার ভিজিট'}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                  {isBn ? 'পরিশোধযোগ্য সর্বমোট:' : 'Grand Total:'} <span style={{ color: 'var(--brand-teal-700)' }}>৳{grandTotal}</span>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                style={{
                  backgroundColor: 'var(--brand-teal-600)',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '1rem',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {isBn ? 'বুকিং চূড়ান্ত করুন' : 'Confirm & Proceed'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success Confirmation */}
        {orderStep === 'SUCCESS' && (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#ecfdf5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <CheckCircle2 size={36} color="#059669" />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-navy-900)', marginBottom: '8px' }}>
              {isBn ? 'আপনার টেস্ট বুকিং সফল হয়েছে!' : 'Test Booking Successful!'}
            </h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 20px' }}>
              {isBn
                ? `বুকিং কোড #${confirmedBookingCode} তৈরি হয়েছে। আপনার মোবাইল নাম্বারে (${patientPhone}) বিস্তারিত এসএমএস পাঠানো হয়েছে।`
                : `Booking reference #${confirmedBookingCode} generated. Confirmation SMS sent to ${patientPhone}.`}
            </p>

            <div style={{
              backgroundColor: 'var(--slate-50)',
              border: '1px solid var(--slate-200)',
              borderRadius: '12px',
              padding: '16px',
              maxWidth: '420px',
              margin: '0 auto 24px',
              textAlign: 'left',
              fontSize: '0.85rem',
            }}>
              <div><strong>রোগী:</strong> {patientName}</div>
              <div><strong>ডায়াগনস্টিক সেন্টার:</strong> {selectedCenter}</div>
              <div><strong>স্যাম্পল সংগ্রহ:</strong> {collectionType === 'HOME_COLLECTION' ? `হোম কালেকশন (${address})` : 'ল্যাব সেন্টার'}</div>
              <div><strong>সময়:</strong> {preferredDate || 'আগামীকাল'} • {preferredTime}</div>
              <div><strong>মোট প্রদেয়:</strong> ৳{grandTotal} (bKash/Nagad বা ক্যাশ অন কালেকশন)</div>
            </div>

            <button
              onClick={onClose}
              style={{
                backgroundColor: 'var(--brand-navy-900)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.9rem',
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {isBn ? 'বন্ধ করুন' : 'Done'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
