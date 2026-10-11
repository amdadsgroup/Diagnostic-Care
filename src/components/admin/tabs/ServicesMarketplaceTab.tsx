'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Layers,
  Search,
  Plus,
  TestTube2,
  DollarSign,
  Clock,
  CheckCircle2,
  Edit2,
  Tag,
} from 'lucide-react';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';

interface ServicesMarketplaceTabProps {
  language: 'en' | 'bn';
  adminEmail: string;
}

export default function ServicesMarketplaceTab({ language, adminEmail }: ServicesMarketplaceTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'tests' | 'packages' | 'categories'>('tests');
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // New Test Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTestName, setNewTestName] = useState('');
  const [newTestCategory, setNewTestCategory] = useState('Pathology');
  const [newTestPrice, setNewTestPrice] = useState('500');
  const [newTestHours, setNewTestHours] = useState('24');

  const fetchTests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('healthcare_services').select('*');
      if (!error && data && data.length > 0) {
        setTests(data);
      } else {
        setTests([
          {
            id: 't-1',
            name: 'Complete Blood Count (CBC)',
            name_bn: 'কমপ্লিট ব্লাড কাউন্ট (সিবিসি)',
            code: 'CBC-001',
            category: 'Hematology',
            price: 400,
            turnaround_hours: 12,
            status: 'active',
          },
          {
            id: 't-2',
            name: 'Lipid Profile (Cholesterol Panel)',
            name_bn: 'লিপিড প্রোফাইল',
            code: 'LIP-001',
            category: 'Biochemistry',
            price: 900,
            turnaround_hours: 24,
            status: 'active',
          },
          {
            id: 't-3',
            name: 'HbA1c (Glycated Hemoglobin)',
            name_bn: 'এইচবিএওয়ানসি',
            code: 'HBA1C-001',
            category: 'Diabetes Care',
            price: 750,
            turnaround_hours: 12,
            status: 'active',
          },
          {
            id: 't-4',
            name: 'Serum Creatinine (Kidney Function)',
            name_bn: 'সিরাম ক্রিয়েটিনিন',
            code: 'CREAT-001',
            category: 'Nephrology',
            price: 350,
            turnaround_hours: 6,
            status: 'active',
          },
          {
            id: 't-5',
            name: 'Ultrasonography of Whole Abdomen (USG)',
            name_bn: 'হোল অ্যাবডোমেন ইউএসজি',
            code: 'USG-001',
            category: 'Sonography',
            price: 1500,
            turnaround_hours: 2,
            status: 'active',
          },
          {
            id: 't-6',
            name: 'Digital Chest X-Ray (P/A View)',
            name_bn: 'ডিজিটাল চেস্ট এক্স-রে',
            code: 'XRAY-001',
            category: 'Radiology',
            price: 650,
            turnaround_hours: 2,
            status: 'active',
          },
          {
            id: 't-7',
            name: '12-Lead Electrocardiogram (ECG)',
            name_bn: '১২-লিড ইসিজি',
            code: 'ECG-001',
            category: 'Cardiology',
            price: 400,
            turnaround_hours: 1,
            status: 'active',
          },
        ]);
      }
    } catch {
      setTests([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName.trim()) return;

    const newService = {
      id: `svc-${Date.now()}`,
      name: newTestName.trim(),
      name_bn: newTestName.trim(),
      code: `TEST-${Math.floor(100 + Math.random() * 900)}`,
      category: newTestCategory,
      price: Number(newTestPrice) || 500,
      turnaround_hours: Number(newTestHours) || 24,
      status: 'active',
    };

    setTests([newService, ...tests]);
    setShowAddModal(false);
    setNewTestName('');
  };

  const filtered = tests.filter((t) => {
    const q = search.toLowerCase();
    return t.name?.toLowerCase().includes(q) || t.code?.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header & Actions */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '18px 20px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '8px 12px',
              width: '280px',
            }}
          >
            <Search size={16} color="#94A3B8" style={{ marginRight: '8px' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === 'bn' ? 'টেস্ট বা কোড দিয়ে খুঁজুন...' : 'Search test name or code...'}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '13px',
              }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: BRAND_COLORS.primary,
            color: '#FFFFFF',
            padding: '9px 16px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Plus size={16} />
          <span>{language === 'bn' ? 'নতুন টেস্ট যোগ করুন' : 'Add New Service'}</span>
        </button>
      </div>

      {/* Services Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569' }}>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>{language === 'bn' ? 'টেস্ট নাম ও কোড' : 'Service & Code'}</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>{language === 'bn' ? 'ক্যাটাগরি' : 'Category'}</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>{language === 'bn' ? 'স্ট্যান্ডার্ড মূল্য' : 'Base Price'}</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>{language === 'bn' ? 'রিপোর্ট ডেলিভারি' : 'TAT (Hours)'}</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A' }}>{t.name}</div>
                    <div style={{ fontSize: '11px', color: '#2563EB', fontFamily: 'monospace', marginTop: '2px' }}>
                      {t.code || 'SVC-001'}
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: '#F1F5F9',
                        color: '#334155',
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {t.category || 'Clinical Pathology'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: '#0F172A' }}>
                    ৳{t.price || 500}
                  </td>
                  <td style={{ padding: '14px 18px', color: '#475569' }}>
                    {t.turnaround_hours || 24} {language === 'bn' ? 'ঘণ্টা' : 'Hours'}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        backgroundColor: '#DCFCE7',
                        color: '#166534',
                      }}
                    >
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Test Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <form
            onSubmit={handleCreateTest}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '26px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
            }}
          >
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: '0 0 16px 0' }}>
              {language === 'bn' ? 'নতুন ডায়াগনস্টিক টেস্ট যুক্ত করুন' : 'Add Diagnostic Investigation'}
            </h3>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Test Name:
              </label>
              <input
                type="text"
                required
                value={newTestName}
                onChange={(e) => setNewTestName(e.target.value)}
                placeholder="e.g. Thyroid Stimulating Hormone (TSH)"
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Price (৳):
                </label>
                <input
                  type="number"
                  required
                  value={newTestPrice}
                  onChange={(e) => setNewTestPrice(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Delivery (Hours):
                </label>
                <input
                  type="number"
                  required
                  value={newTestHours}
                  onChange={(e) => setNewTestHours(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ padding: '9px 16px', borderRadius: '10px', backgroundColor: '#F1F5F9', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ padding: '9px 18px', borderRadius: '10px', backgroundColor: BRAND_COLORS.primary, color: '#FFFFFF', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                Save Test
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
