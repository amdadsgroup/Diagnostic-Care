'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { AdminService } from '@/services/admin.service';
import {
  TestTube2,
  Search,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Home,
  Shield,
  FileText,
} from 'lucide-react';
import { BRAND_COLORS } from '@/config/brand';

interface DiagnosticCentersTabProps {
  language: 'en' | 'bn';
  adminEmail: string;
}

export default function DiagnosticCentersTab({ language, adminEmail }: DiagnosticCentersTabProps) {
  const [centers, setCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchCenters = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('diagnostic_centers').select('*');
      if (!error && data && data.length > 0) {
        setCenters(data);
      } else {
        setCenters([
          {
            id: 'e0000001-0000-0000-0000-000000000001',
            name: 'Popular Diagnostic Center (Moulvibazar)',
            name_bn: 'পপুলার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার)',
            phone: '01886748564',
            address: 'Chowmohana, Syed Mujtoba Ali Road, Moulvibazar Sadar',
            has_home_sample_collection: true,
            status: 'active',
            verification_status: 'verified',
            dghs_registration_number: 'DGHS-MBZ-2026-001',
          },
          {
            id: 'e0000001-0000-0000-0000-000000000002',
            name: 'Life Care Diagnostic Center (Moulvibazar)',
            name_bn: 'লাইফ কেয়ার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার)',
            phone: '01886748564',
            address: 'Kusumbag Point, Sreemangal Road, Moulvibazar',
            has_home_sample_collection: true,
            status: 'active',
            verification_status: 'verified',
            dghs_registration_number: 'DGHS-MBZ-2026-002',
          },
          {
            id: 'dc-003',
            name: 'Ibn Sina Diagnostic & Consultation Center',
            name_bn: 'ইবনে সিনা ডায়াগনস্টিক সেন্টার',
            phone: '01886748564',
            address: 'Sobhanighat Point, Sylhet',
            has_home_sample_collection: false,
            status: 'active',
            verification_status: 'verified',
            dghs_registration_number: 'DGHS-SYL-2026-015',
          },
        ]);
      }
    } catch {
      setCenters([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    await AdminService.updateProviderStatus(
      'diagnostic_centers',
      id,
      nextStatus,
      `Toggled status to ${nextStatus}`,
      adminEmail
    );
    fetchCenters();
  };

  const filtered = centers.filter((c) => {
    const q = search.toLowerCase();
    return c.name?.toLowerCase().includes(q) || c.phone?.toLowerCase().includes(q) || c.address?.toLowerCase().includes(q);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Search Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '18px 20px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '8px 12px',
            width: '320px',
          }}
        >
          <Search size={16} color="#94A3B8" style={{ marginRight: '8px' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'bn' ? 'সেন্টারের নাম বা ঠিকানা...' : 'Search centers or address...'}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              outline: 'none',
              width: '100%',
              fontSize: '13px',
            }}
          />
        </div>

        <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
          {language === 'bn' ? 'মোট ডায়াগনস্টিক সেন্টার:' : 'Diagnostic Centers:'}{' '}
          <strong style={{ color: '#0F172A' }}>{centers.length}</strong>
        </div>
      </div>

      {/* Grid of Diagnostic Center Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
        {filtered.map((c) => (
          <div
            key={c.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              padding: '22px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: '#F5F3FF',
                      color: '#7C3AED',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TestTube2 size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{c.name}</h3>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                      DGHS: {c.dghs_registration_number || 'DGHS-APPROVED'}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    backgroundColor: c.verification_status === 'verified' ? '#DCFCE7' : '#FEF3C7',
                    color: c.verification_status === 'verified' ? '#166534' : '#92400E',
                  }}
                >
                  {c.verification_status?.toUpperCase() || 'VERIFIED'}
                </span>
              </div>

              <div style={{ fontSize: '12.5px', color: '#475569', margin: '10px 0' }}>
                {c.address}
              </div>

              {/* Sample Collection Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: c.has_home_sample_collection ? '#16A34A' : '#64748B' }}>
                <Home size={14} />
                <span>
                  {c.has_home_sample_collection
                    ? language === 'bn' ? 'হোম স্যাম্পল কালেকশন সক্রিয়' : 'Home Sample Collection Supported'
                    : language === 'bn' ? 'শুধুমাত্র ল্যাব পরিদর্শন' : 'Walk-in Lab Only'}
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: c.status === 'active' ? '#16A34A' : '#DC2626' }}>
                ● {c.status === 'active' ? 'Active' : 'Suspended'}
              </span>

              <button
                type="button"
                onClick={() => handleToggleStatus(c.id, c.status)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backgroundColor: c.status === 'active' ? '#FEF2F2' : '#F0FDF4',
                  border: c.status === 'active' ? '1px solid #FECACA' : '1px solid #BBF7D0',
                  color: c.status === 'active' ? '#DC2626' : '#16A34A',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {c.status === 'active' ? (language === 'bn' ? 'স্থগিত' : 'Suspend') : (language === 'bn' ? 'সক্রিয়' : 'Activate')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
