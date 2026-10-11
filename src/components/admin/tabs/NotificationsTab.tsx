'use client';

import React, { useState } from 'react';
import {
  Bell,
  Radio,
  Send,
  AlertTriangle,
  Info,
  ShieldAlert,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { BRAND_COLORS } from '@/config/brand';

interface NotificationsTabProps {
  language: 'en' | 'bn';
  adminEmail: string;
}

export default function NotificationsTab({ language, adminEmail }: NotificationsTabProps) {
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastPriority, setBroadcastPriority] = useState<'INFO' | 'WARNING' | 'CRITICAL'>('INFO');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const [alerts, setAlerts] = useState([
    {
      id: 'alt-1',
      title: 'Pending Doctor BMDC License Review',
      message: 'New application submitted by Dr. Farhana Ahmed (BMDC A-59102). Requires verification.',
      priority: 'WARNING',
      timestamp: 'Today, 10:45 AM',
      isRead: false,
    },
    {
      id: 'alt-2',
      title: 'PostgreSQL Database Health Check',
      message: 'Automated health audit completed successfully. 99.98% uptime maintained.',
      priority: 'INFO',
      timestamp: 'Today, 06:00 AM',
      isRead: true,
    },
    {
      id: 'alt-3',
      title: 'DGHS License Renewal Drive Notification',
      message: 'Scheduled reminder sent to 12 diagnostic centers in Sylhet Division.',
      priority: 'INFO',
      timestamp: 'Yesterday, 04:30 PM',
      isRead: true,
    },
  ]);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    const newAlert = {
      id: `alt-${Date.now()}`,
      title: broadcastTitle.trim(),
      message: broadcastMessage.trim(),
      priority: broadcastPriority,
      timestamp: 'Just now',
      isRead: false,
    };

    setAlerts([newAlert, ...alerts]);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3500);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
      {/* Alert Feed */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <Bell size={20} color={BRAND_COLORS.primary} />
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            {language === 'bn' ? 'অপারেশনাল নোটিফিকেশনস' : 'Operational Notifications'}
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {alerts.map((alt) => (
            <div
              key={alt.id}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: alt.isRead ? '#F8FAFC' : '#EFF6FF',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '4px',
                    backgroundColor:
                      alt.priority === 'CRITICAL'
                        ? '#FEE2E2'
                        : alt.priority === 'WARNING'
                        ? '#FEF3C7'
                        : '#E0F2FE',
                    color:
                      alt.priority === 'CRITICAL'
                        ? '#991B1B'
                        : alt.priority === 'WARNING'
                        ? '#92400E'
                        : '#0369A1',
                  }}
                >
                  {alt.priority}
                </span>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>{alt.timestamp}</span>
              </div>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                {alt.title}
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748B' }}>{alt.message}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Composer */}
      <form
        onSubmit={handleSendBroadcast}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <Radio size={20} color="#EF4444" />
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            {language === 'bn' ? 'সিস্টেম ব্রডকাস্ট প্রেরণ' : 'Broadcast Dispatcher'}
          </h3>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
            Broadcast Title:
          </label>
          <input
            type="text"
            required
            value={broadcastTitle}
            onChange={(e) => setBroadcastTitle(e.target.value)}
            placeholder="e.g. Schedule Maintenance Notice"
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
            Priority Level:
          </label>
          <select
            value={broadcastPriority}
            onChange={(e) => setBroadcastPriority(e.target.value as any)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#F8FAFC' }}
          >
            <option value="INFO">INFO (General Announcement)</option>
            <option value="WARNING">WARNING (Important Action Required)</option>
            <option value="CRITICAL">CRITICAL (System Alert)</option>
          </select>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
            Message Body:
          </label>
          <textarea
            rows={4}
            required
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            placeholder="Type platform announcement..."
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
          />
        </div>

        {broadcastSent && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#F0FDF4', color: '#16A34A', fontSize: '12.5px', fontWeight: 700, marginBottom: '14px' }}>
            ✓ Broadcast successfully dispatched.
          </div>
        )}

        <button
          type="submit"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: BRAND_COLORS.primary,
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Send size={15} />
          <span>{language === 'bn' ? 'ব্রডকাস্ট পাঠান' : 'Dispatch Broadcast'}</span>
        </button>
      </form>
    </div>
  );
}
