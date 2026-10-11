'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { AdminService } from '@/services/admin.service';
import {
  Activity,
  Search,
  CheckCircle2,
  Phone,
  Shield,
  Heart,
  UserCheck,
} from 'lucide-react';
import { BRAND_COLORS } from '@/config/brand';

interface HomeCareTabProps {
  language: 'en' | 'bn';
  adminEmail: string;
}

export default function HomeCareTab({ language, adminEmail }: HomeCareTabProps) {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('home_healthcare_providers').select('*');
      if (!error && data && data.length > 0) {
        setProviders(data);
      } else {
        setProviders([
          {
            id: 'hc-001',
            name: 'Diagnostic Care Certified Home Nursing Service',
            name_bn: 'ডায়াগনস্টিক কেয়ার হোম নার্সিং সার্ভিস',
            phone: '01886748564',
            services_offered: ['Professional In-Home Nursing', 'Post-Op Wound Dressing', 'Elderly Assistance', 'Physiotherapy'],
            status: 'active',
            verification_status: 'verified',
          },
          {
            id: 'hc-002',
            name: 'Sylhet Physiotherapy & Rehab Care',
            name_bn: 'সিলেট ফিজিওথেরাপী ও রিহ্যাব কেয়ার',
            phone: '01711889900',
            services_offered: ['Stroke Recovery Physiotherapy', 'Mobility Therapy'],
            status: 'active',
            verification_status: 'verified',
          },
        ]);
      }
    } catch {
      setProviders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    await AdminService.updateProviderStatus(
      'home_healthcare_providers',
      id,
      nextStatus,
      `Toggled status to ${nextStatus}`,
      adminEmail
    );
    fetchProviders();
  };

  const filtered = providers.filter((p) => {
    const q = search.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.phone?.toLowerCase().includes(q);
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
            placeholder={language === 'bn' ? 'হোম কেয়ার প্রোভাইডার খুঁজুন...' : 'Search home care provider...'}
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
          {language === 'bn' ? 'হোম কেয়ার প্রোভাইডার:' : 'Home Care Providers:'}{' '}
          <strong style={{ color: '#0F172A' }}>{providers.length}</strong>
        </div>
      </div>

      {/* Grid of Home Care Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
        {filtered.map((hc) => (
          <div
            key={hc.id}
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
                      backgroundColor: '#F0FDFA',
                      color: '#0D9488',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Activity size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{hc.name}</h3>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                      Certified Caregivers & Registered Nurses
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    backgroundColor: hc.verification_status === 'verified' ? '#DCFCE7' : '#FEF3C7',
                    color: hc.verification_status === 'verified' ? '#166534' : '#92400E',
                  }}
                >
                  {hc.verification_status?.toUpperCase() || 'VERIFIED'}
                </span>
              </div>

              {/* Services Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '14px 0' }}>
                {Array.isArray(hc.services_offered) &&
                  hc.services_offered.map((svc: string, i: number) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#F1F5F9',
                        color: '#334155',
                      }}
                    >
                      {svc}
                    </span>
                  ))}
              </div>

              <div style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={13} color="#94A3B8" />
                <span>Helpline: {hc.phone}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: hc.status === 'active' ? '#16A34A' : '#DC2626' }}>
                ● {hc.status === 'active' ? 'Active in Service' : 'Suspended'}
              </span>

              <button
                type="button"
                onClick={() => handleToggleStatus(hc.id, hc.status)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backgroundColor: hc.status === 'active' ? '#FEF2F2' : '#F0FDF4',
                  border: hc.status === 'active' ? '1px solid #FECACA' : '1px solid #BBF7D0',
                  color: hc.status === 'active' ? '#DC2626' : '#16A34A',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {hc.status === 'active' ? (language === 'bn' ? 'স্থগিত' : 'Suspend') : (language === 'bn' ? 'সক্রিয়' : 'Activate')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
