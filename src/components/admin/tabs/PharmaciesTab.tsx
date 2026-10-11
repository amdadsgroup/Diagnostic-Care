'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { AdminService } from '@/services/admin.service';
import {
  Pill,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Phone,
  Shield,
} from 'lucide-react';
import { BRAND_COLORS } from '@/config/brand';

interface PharmaciesTabProps {
  language: 'en' | 'bn';
  adminEmail: string;
}

export default function PharmaciesTab({ language, adminEmail }: PharmaciesTabProps) {
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchPharmacies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('pharmacies').select('*');
      if (!error && data && data.length > 0) {
        setPharmacies(data);
      } else {
        setPharmacies([
          {
            id: 'ph-001',
            name: 'Central Model Pharmacy (Moulvibazar)',
            name_bn: 'সেন্ট্রাল মডেল ফার্মেসি',
            drug_license_number: 'DL-SYL-9843-M',
            phone: '01886748564',
            has_home_delivery: true,
            is_24_hours: true,
            status: 'active',
            verification_status: 'verified',
          },
          {
            id: 'ph-002',
            name: 'Apollo Drug House',
            name_bn: 'অ্যাপোলো ড্রাগ হাউস',
            drug_license_number: 'DL-SYL-7712-M',
            phone: '01711000000',
            has_home_delivery: true,
            is_24_hours: false,
            status: 'active',
            verification_status: 'verified',
          },
          {
            id: 'ph-003',
            name: 'Labaid Pharmacy',
            name_bn: 'ল্যাবএইড ফার্মেসি',
            drug_license_number: 'DL-DHK-4421-C',
            phone: '01886748564',
            has_home_delivery: true,
            is_24_hours: true,
            status: 'active',
            verification_status: 'pending',
          },
        ]);
      }
    } catch {
      setPharmacies([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    await AdminService.updateProviderStatus(
      'pharmacies',
      id,
      nextStatus,
      `Toggled status to ${nextStatus}`,
      adminEmail
    );
    fetchPharmacies();
  };

  const filtered = pharmacies.filter((p) => {
    const q = search.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.drug_license_number?.toLowerCase().includes(q);
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
            placeholder={language === 'bn' ? 'ফার্মেসির নাম বা ড্রাগ লাইসেন্স...' : 'Search pharmacy or drug license...'}
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
          {language === 'bn' ? 'নিবন্ধিত ফার্মেসি:' : 'Registered Pharmacies:'}{' '}
          <strong style={{ color: '#0F172A' }}>{pharmacies.length}</strong>
        </div>
      </div>

      {/* Grid of Pharmacy Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
        {filtered.map((p) => (
          <div
            key={p.id}
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
                      backgroundColor: '#FDF2F8',
                      color: '#DB2777',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Pill size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{p.name}</h3>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                      Lic: {p.drug_license_number}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    backgroundColor: p.verification_status === 'verified' ? '#DCFCE7' : '#FEF3C7',
                    color: p.verification_status === 'verified' ? '#166534' : '#92400E',
                  }}
                >
                  {p.verification_status?.toUpperCase() || 'VERIFIED'}
                </span>
              </div>

              {/* Tags: 24h & Delivery */}
              <div style={{ display: 'flex', gap: '8px', margin: '14px 0' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    backgroundColor: p.is_24_hours ? '#EFF6FF' : '#F8FAFC',
                    color: p.is_24_hours ? '#2563EB' : '#64748B',
                  }}
                >
                  <Clock size={12} />
                  {p.is_24_hours ? '24/7 Open' : 'Day Service'}
                </span>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    backgroundColor: p.has_home_delivery ? '#ECFDF5' : '#F8FAFC',
                    color: p.has_home_delivery ? '#059669' : '#64748B',
                  }}
                >
                  <Truck size={12} />
                  {p.has_home_delivery ? 'Home Delivery' : 'Pickup Only'}
                </span>
              </div>

              <div style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={13} color="#94A3B8" />
                <span>{p.phone}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: p.status === 'active' ? '#16A34A' : '#DC2626' }}>
                ● {p.status === 'active' ? 'Active' : 'Suspended'}
              </span>

              <button
                type="button"
                onClick={() => handleToggleStatus(p.id, p.status)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backgroundColor: p.status === 'active' ? '#FEF2F2' : '#F0FDF4',
                  border: p.status === 'active' ? '1px solid #FECACA' : '1px solid #BBF7D0',
                  color: p.status === 'active' ? '#DC2626' : '#16A34A',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {p.status === 'active' ? (language === 'bn' ? 'স্থগিত' : 'Suspend') : (language === 'bn' ? 'সক্রিয়' : 'Activate')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
