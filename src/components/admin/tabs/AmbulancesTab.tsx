'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { AdminService } from '@/services/admin.service';
import {
  HeartPulse,
  Search,
  CheckCircle2,
  Phone,
  Shield,
  Activity,
  Truck,
} from 'lucide-react';
import { BRAND_COLORS } from '@/config/brand';

interface AmbulancesTabProps {
  language: 'en' | 'bn';
  adminEmail: string;
}

export default function AmbulancesTab({ language, adminEmail }: AmbulancesTabProps) {
  const [ambulances, setAmbulances] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchAmbulances = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('ambulance_providers').select('*');
      if (!error && data && data.length > 0) {
        setAmbulances(data);
      } else {
        setAmbulances([
          {
            id: 'amb-001',
            name: 'Moulvibazar 24/7 ICU & AC Ambulance Express',
            name_bn: 'মৌলভীবাজার জরুরি আইসিইউ ও এসি অ্যাম্বুলেন্স',
            phone: '01886748564',
            fleet_size: 6,
            has_icu_ambulance: true,
            has_ac_ambulance: true,
            has_freezer_ambulance: true,
            status: 'active',
            verification_status: 'verified',
          },
          {
            id: 'amb-002',
            name: 'Sylhet Metro Life Support Transit',
            name_bn: 'সিলেট মেট্রো লাইফ সাপোর্ট অ্যাম্বুলেন্স',
            phone: '01711223344',
            fleet_size: 10,
            has_icu_ambulance: true,
            has_ac_ambulance: true,
            has_freezer_ambulance: false,
            status: 'active',
            verification_status: 'verified',
          },
        ]);
      }
    } catch {
      setAmbulances([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAmbulances();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    await AdminService.updateProviderStatus(
      'ambulance_providers',
      id,
      nextStatus,
      `Toggled status to ${nextStatus}`,
      adminEmail
    );
    fetchAmbulances();
  };

  const filtered = ambulances.filter((a) => {
    const q = search.toLowerCase();
    return a.name?.toLowerCase().includes(q) || a.phone?.toLowerCase().includes(q);
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
            placeholder={language === 'bn' ? 'অ্যাম্বুলেন্স সার্ভিস বা ফোন...' : 'Search ambulance or phone...'}
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
          {language === 'bn' ? 'অ্যাম্বুলেন্স প্রোভাইডার:' : 'Ambulance Fleets:'}{' '}
          <strong style={{ color: '#0F172A' }}>{ambulances.length}</strong>
        </div>
      </div>

      {/* Grid of Ambulance Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
        {filtered.map((amb) => (
          <div
            key={amb.id}
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
                      backgroundColor: '#FEF2F2',
                      color: '#EF4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <HeartPulse size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{amb.name}</h3>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                      Fleet: {amb.fleet_size || 1} Ambulances
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    backgroundColor: amb.verification_status === 'verified' ? '#DCFCE7' : '#FEF3C7',
                    color: amb.verification_status === 'verified' ? '#166534' : '#92400E',
                  }}
                >
                  {amb.verification_status?.toUpperCase() || 'VERIFIED'}
                </span>
              </div>

              {/* Fleet Capabilities */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '14px 0' }}>
                {amb.has_icu_ambulance && (
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', backgroundColor: '#FEE2E2', color: '#991B1B' }}>
                    ICU Mobile Unit
                  </span>
                )}
                {amb.has_ac_ambulance && (
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', backgroundColor: '#EFF6FF', color: '#1E40AF' }}>
                    AC Transit
                  </span>
                )}
                {amb.has_freezer_ambulance && (
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', backgroundColor: '#F1F5F9', color: '#475569' }}>
                    Freezer Box
                  </span>
                )}
              </div>

              <div style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={13} color="#94A3B8" />
                <span>24/7 Hotline: {amb.phone}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: amb.status === 'active' ? '#16A34A' : '#DC2626' }}>
                ● {amb.status === 'active' ? 'Active in Dispatch' : 'Suspended'}
              </span>

              <button
                type="button"
                onClick={() => handleToggleStatus(amb.id, amb.status)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backgroundColor: amb.status === 'active' ? '#FEF2F2' : '#F0FDF4',
                  border: amb.status === 'active' ? '1px solid #FECACA' : '1px solid #BBF7D0',
                  color: amb.status === 'active' ? '#DC2626' : '#16A34A',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {amb.status === 'active' ? (language === 'bn' ? 'স্থগিত' : 'Suspend') : (language === 'bn' ? 'সক্রিয়' : 'Activate')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
