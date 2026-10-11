'use client';

import React, { useState, useEffect } from 'react';
import { AdminService, AdminAuditRecord } from '@/services/admin.service';
import {
  ShieldCheck,
  Search,
  Clock,
  Filter,
  User,
  Activity,
  Layers,
} from 'lucide-react';
import { BRAND_COLORS } from '@/config/brand';

interface AuditLogsTabProps {
  language: 'en' | 'bn';
  adminEmail: string;
}

export default function AuditLogsTab({ language, adminEmail }: AuditLogsTabProps) {
  const [logs, setLogs] = useState<AdminAuditRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    const data = await AdminService.getAuditLogs(100);
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    return (
      l.action?.toLowerCase().includes(q) ||
      l.adminEmail?.toLowerCase().includes(q) ||
      l.targetEntity?.toLowerCase().includes(q)
    );
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
          flexWrap: 'wrap',
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
            placeholder={language === 'bn' ? 'অ্যাকশন বা অ্যাডমিন ইমেইল দিয়ে খুঁজুন...' : 'Search action or admin email...'}
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
          {language === 'bn' ? 'সর্বমোট রেকর্ডকৃত অডিট লগ:' : 'Total Immutable Audit Entries:'}{' '}
          <strong style={{ color: '#0F172A' }}>{logs.length}</strong>
        </div>
      </div>

      {/* Audit Log Table */}
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
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Timestamp</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Administrator</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Action Type</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Target Entity</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Metadata & Reason</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                    Loading audit trail...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                    No audit records matching query.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 18px', color: '#64748B', fontSize: '12px' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 800, color: '#0F172A' }}>{log.adminEmail}</div>
                      <div style={{ fontSize: '10.5px', color: '#2563EB', fontWeight: 700 }}>SUPER ADMIN</div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          backgroundColor: '#F1F5F9',
                          color: '#334155',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontFamily: 'monospace',
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#334155', fontWeight: 600 }}>
                      {log.targetEntity}
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: '12px', color: '#64748B' }}>
                      {log.details ? JSON.stringify(log.details) : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
