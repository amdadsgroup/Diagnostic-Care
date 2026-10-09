'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import AuthModal from '@/components/auth/AuthModal';
import LocationModal from '@/components/location/LocationModal';
import { useLanguage } from '@/context/LanguageContext';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  ShieldCheck,
  UserCheck,
  Building2,
  ArrowRight,
  Phone,
  UserPlus,
  Send,
  EyeOff,
  User,
} from 'lucide-react';

interface AssistantQueuePatient {
  id: string;
  token: number;
  name: string;
  phone: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  status: 'WAITING' | 'CHECKED_IN' | 'IN_ROOM' | 'COMPLETED' | 'NO_SHOW';
  time: string;
}

interface AssistantInvitation {
  id: string;
  email: string;
  name: string;
  branch: string;
  status: 'PENDING' | 'ACCEPTED' | 'REVOKED';
  canManageQueue: boolean;
  canCheckIn: boolean;
}

export default function DoctorAssistantDashboardPage() {
  const { language, setLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Moulvibazar');

  const [activeTab, setActiveTab] = useState<'queue' | 'invitations'>('queue');
  const [queue, setQueue] = useState<AssistantQueuePatient[]>([
    { id: 'ap-1', token: 1, name: 'আনিসুল হক (Anisul Hoque)', phone: '01886748564', age: 48, gender: 'MALE', status: 'IN_ROOM', time: '16:00' },
    { id: 'ap-2', token: 2, name: 'রাশেদা আক্তার (Rasheda Akter)', phone: '01712998811', age: 36, gender: 'FEMALE', status: 'CHECKED_IN', time: '16:15' },
    { id: 'ap-3', token: 3, name: 'তাহমিদুর রহমান (Tahmidur Rahman)', phone: '01911445566', age: 52, gender: 'MALE', status: 'WAITING', time: '16:30' },
    { id: 'ap-4', token: 4, name: 'ফরিদা পারভীন (Farida Parveen)', phone: '01822334455', age: 29, gender: 'FEMALE', status: 'WAITING', time: '16:45' },
    { id: 'ap-5', token: 5, name: 'কামাল হোসেন (Kamal Hossain)', phone: '01733667788', age: 61, gender: 'MALE', status: 'WAITING', time: '17:00' },
  ]);

  const [invitations, setInvitations] = useState<AssistantInvitation[]>([
    { id: 'inv-1', email: 'assistant.moulvibazar@gmail.com', name: 'Md. Shofiqul Islam', branch: 'Moulvibazar Main Branch', status: 'ACCEPTED', canManageQueue: true, canCheckIn: true },
    { id: 'inv-2', email: 'chamber.desk@populardiagnostic.com', name: 'Nasrin Sultana', branch: 'Sreemangal Collection Branch', status: 'PENDING', canManageQueue: true, canCheckIn: true },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    AuthService.getCurrentUser().then((u) => {
      if (u) setCurrentUser(u);
    });

    const savedLoc = localStorage.getItem('dc_user_location');
    if (savedLoc) setSelectedLocation(savedLoc);
  }, []);

  const handleCallNext = () => {
    setQueue((prev) => {
      const copy = [...prev];
      const inRoomIdx = copy.findIndex((p) => p.status === 'IN_ROOM');
      if (inRoomIdx !== -1) copy[inRoomIdx].status = 'COMPLETED';

      const nextIdx = copy.findIndex((p) => p.status === 'CHECKED_IN' || p.status === 'WAITING');
      if (nextIdx !== -1) {
        copy[nextIdx].status = 'IN_ROOM';
        showToast(
          language === 'en'
            ? `Calling Token #${copy[nextIdx].token}: ${copy[nextIdx].name}`
            : `টোকেন #${copy[nextIdx].token} ডাকা হচ্ছে: ${copy[nextIdx].name}`
        );
      } else {
        showToast(language === 'en' ? 'All patients in queue processed.' : 'আজকের সকল রোগীর সিরিয়াল সম্পন্ন হয়েছে।');
      }
      return copy;
    });
  };

  const handleCheckIn = (id: string) => {
    setQueue((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'CHECKED_IN' as const } : p))
    );
    showToast(language === 'en' ? 'Patient checked-in at reception.' : 'রোগী রিসেপশনে চেক-ইন সম্পন্ন করেছে।');
  };

  const handleNoShow = (id: string) => {
    setQueue((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'NO_SHOW' as const } : p))
    );
    showToast(language === 'en' ? 'Patient marked as No-Show.' : 'রোগী অনুপস্থিত (No-Show) চিহ্নিত করা হয়েছে।');
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInvitations([
      ...invitations,
      {
        id: `inv-${Date.now()}`,
        email: inviteEmail.trim(),
        name: inviteName.trim() || 'New Assistant',
        branch: 'Moulvibazar Main Branch',
        status: 'PENDING',
        canManageQueue: true,
        canCheckIn: true,
      },
    ]);
    setIsInviteOpen(false);
    setInviteEmail('');
    setInviteName('');
    showToast(
      language === 'en'
        ? 'Assistant invitation sent with restricted branch permissions.'
        : 'সহকারী আমন্ত্রণপত্র পাঠানো হয়েছে (সীমিত ও নিয়ন্ত্রিত পারমিশন সহ)।'
    );
  };

  const handleRevoke = (id: string) => {
    setInvitations(
      invitations.map((inv) => (inv.id === id ? { ...inv, status: 'REVOKED' as const } : inv))
    );
    showToast(
      language === 'en'
        ? 'Assistant access revoked immediately. Protected operations blocked.'
        : 'সহকারীর অ্যাক্সেস অবিলম্বে প্রত্যাহার করা হয়েছে।'
    );
  };

  const inRoomPatient = queue.find((p) => p.status === 'IN_ROOM');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Header
        language={language}
        setLanguage={setLanguage}
        activeTab="assistant-portal"
        setActiveTab={() => {}}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenLocation={() => setIsLocationModalOpen(true)}
        selectedLocation={selectedLocation}
        currentUser={currentUser}
        onLogout={async () => {
          await AuthService.signOut();
          setCurrentUser(null);
        }}
      />

      <main style={{ flex: 1, padding: '32px 0 64px' }}>
        <div className="container" style={{ padding: '0 24px', maxWidth: '1180px' }}>
          {/* Toast Notice */}
          {toastMessage && (
            <div
              className="glass-card-sm animate-scale-in"
              style={{
                backgroundColor: 'rgba(236, 253, 245, 0.9)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#065F46',
                borderRadius: '16px',
                padding: '14px 20px',
                marginBottom: '24px',
                fontSize: '14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.12)',
              }}
            >
              <CheckCircle2 size={20} color="#059669" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Assistant Sandbox & Security Isolation Card */}
          <div
            className="glass-card"
            style={{
              padding: '28px 32px',
              marginBottom: '28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '18px',
                  backgroundColor: 'rgba(15, 118, 110, 0.1)',
                  color: 'var(--color-primary)',
                  border: '1px solid rgba(15, 118, 110, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26px',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                <UserCheck size={36} color="var(--color-primary)" />
              </div>

              <div>
                <div
                  className="glass-pill"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(239, 246, 255, 0.85)',
                    color: '#1D4ED8',
                    border: '1px solid rgba(191, 219, 254, 0.8)',
                    padding: '3px 12px',
                    fontSize: '11px',
                    fontWeight: 800,
                    marginBottom: '8px',
                  }}
                >
                  <ShieldCheck size={13} color="#2563EB" />
                  DOCTOR ASSISTANT SANDBOX • ACTIVE SESSION
                </div>
                <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
                  Md. Shofiqul Islam (Doctor Assistant)
                </h1>
                <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--color-text-secondary)' }}>
                  Assigned Doctor: <strong style={{ color: 'var(--color-text-primary)' }}>Dr. Anisur Rahman (Cardiologist)</strong> • Popular Diagnostic Center, Moulvibazar
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleCallNext}
                className="btn-primary"
                style={{
                  padding: '12px 24px',
                  borderRadius: '14px',
                  fontSize: '14px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <span>{language === 'en' ? 'Call Next' : 'পরবর্তী রোগী ডাকুন'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Server-Side Privacy Sandbox Notice */}
          <div
            className="glass-inset"
            style={{
              borderRadius: '16px',
              padding: '16px 20px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              fontSize: '13px',
              backgroundColor: 'rgba(239, 246, 255, 0.65)',
              border: '1px solid rgba(191, 219, 254, 0.6)',
              lineHeight: 1.55,
            }}
          >
            <Lock size={20} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 800, marginBottom: '2px', color: '#1E3A8A' }}>
                {language === 'en' ? 'Server-Side Access Boundary Active' : 'সার্ভার-সাইড নিরাপত্তা বাউন্ডারি সক্রিয়'}
              </div>
              <span style={{ color: '#2563EB' }}>
                {language === 'en'
                  ? 'Your assistant account is restricted strictly to assigned doctor queue management. Financial ledgers, patient medical history, prescriptions, and organization administrative settings are strictly protected.'
                  : 'আপনার সহকারী অ্যাকাউন্ট শুধুমাত্র নির্ধারিত ডাক্তারের সিরিয়াল ও চেক-ইন পরিচালনার জন্য সীমাবদ্ধ। রোগীর পূর্ববর্তী চিকিৎসা রেকর্ড বা অর্থনৈতিক তথ্যে প্রবেশাধিকার নিয়ন্ত্রিত।'}
              </span>
            </div>
          </div>

          {/* Sub-Tabs */}
          <div
            className="glass-panel"
            style={{
              display: 'flex',
              gap: '10px',
              padding: '8px',
              borderRadius: '16px',
              marginBottom: '28px',
              width: 'fit-content',
            }}
          >
            <button
              onClick={() => setActiveTab('queue')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'queue' ? 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)' : 'transparent',
                color: activeTab === 'queue' ? '#FFFFFF' : 'var(--color-text-secondary)',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
                boxShadow: activeTab === 'queue' ? '0 4px 14px rgba(15, 118, 110, 0.25)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <Users size={16} />
              <span>{language === 'en' ? 'Live Queue & Check-In' : 'লাইভ সিরিয়াল ও চেক-ইন'}</span>
            </button>

            <button
              onClick={() => setActiveTab('invitations')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'invitations' ? 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)' : 'transparent',
                color: activeTab === 'invitations' ? '#FFFFFF' : 'var(--color-text-secondary)',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
                boxShadow: activeTab === 'invitations' ? '0 4px 14px rgba(15, 118, 110, 0.25)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <UserPlus size={16} />
              <span>{language === 'en' ? 'Assistant Invitations & Access' : 'সহকারী আমন্ত্রণ ও পারমিশন'}</span>
            </button>
          </div>

          {/* TAB 1: LIVE QUEUE & CHECK-IN */}
          {activeTab === 'queue' && (
            <div
              className="glass-card"
              style={{
                padding: '28px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                  {language === 'en' ? "Today's Appointment Queue" : 'আজকের রোগীর সিরিয়াল'}
                </h3>
                <span className="glass-badge-teal" style={{ fontSize: '13px', fontWeight: 700 }}>
                  Active Chamber: Room 204
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {queue.map((p) => {
                  const isCurrent = inRoomPatient?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      className={isCurrent ? 'glass-card-sm' : 'glass-inset'}
                      style={{
                        padding: '18px 22px',
                        borderRadius: '16px',
                        border: isCurrent ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)',
                        backgroundColor: isCurrent ? 'rgba(240, 253, 244, 0.92)' : 'rgba(255, 255, 255, 0.72)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '14px',
                            background: isCurrent ? 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)' : 'rgba(241, 245, 249, 0.85)',
                            color: isCurrent ? '#FFFFFF' : 'var(--color-text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 900,
                            fontSize: '18px',
                            flexShrink: 0,
                            boxShadow: isCurrent ? '0 4px 12px rgba(15, 118, 110, 0.3)' : 'none',
                          }}
                        >
                          #{p.token}
                        </span>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 800, fontSize: '15.5px', color: 'var(--color-text-primary)' }}>
                              {p.name}
                            </span>
                            {p.status === 'IN_ROOM' && (
                              <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                                IN ROOM
                              </span>
                            )}
                            {p.status === 'CHECKED_IN' && (
                              <span style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                                CHECKED IN
                              </span>
                            )}
                            {p.status === 'COMPLETED' && (
                              <span style={{ backgroundColor: '#F1F5F9', color: '#64748B', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                                COMPLETED
                              </span>
                            )}
                            {p.status === 'NO_SHOW' && (
                              <span style={{ backgroundColor: '#FEF2F2', color: '#DC2626', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                                NO SHOW
                              </span>
                            )}
                          </div>

                          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                            {p.age}y • Mobile: <strong style={{ color: 'var(--color-text-primary)' }}>{p.phone}</strong> • Scheduled: {p.time}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        {p.status === 'WAITING' && (
                          <button
                            onClick={() => handleCheckIn(p.id)}
                            style={{
                              backgroundColor: 'rgba(239, 246, 255, 0.9)',
                              color: '#1D4ED8',
                              border: '1px solid rgba(191, 219, 254, 0.8)',
                              padding: '8px 16px',
                              borderRadius: '10px',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            Check-In
                          </button>
                        )}

                        {p.status !== 'COMPLETED' && p.status !== 'NO_SHOW' && (
                          <button
                            onClick={() => handleNoShow(p.id)}
                            style={{
                              backgroundColor: 'rgba(254, 242, 242, 0.9)',
                              color: '#DC2626',
                              border: '1px solid rgba(254, 202, 202, 0.8)',
                              padding: '8px 14px',
                              borderRadius: '10px',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            No-Show
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: ASSISTANT INVITATIONS */}
          {activeTab === 'invitations' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                    {language === 'en' ? 'Authorized Doctor Assistants' : 'অনুমোদিত ডাক্তার সহকারী'}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                    {language === 'en'
                      ? 'Secure workflow for inviting assistants with branch-isolated permissions.'
                      : 'শাখা-ভিত্তিক সীমিত পারমিশন সহ নতুন সহকারীকে আমন্ত্রণ জানান।'}
                  </p>
                </div>

                <button
                  onClick={() => setIsInviteOpen(true)}
                  className="btn-primary"
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <UserPlus size={16} />
                  <span>{language === 'en' ? 'Invite Assistant' : 'নতুন সহকারী আমন্ত্রণ'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {invitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="glass-card-sm"
                    style={{
                      padding: '20px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 800, fontSize: '15.5px', color: 'var(--color-text-primary)' }}>
                          {inv.name}
                        </span>
                        <span
                          style={{
                            backgroundColor: inv.status === 'ACCEPTED' ? 'rgba(236, 253, 245, 0.9)' : (inv.status === 'PENDING' ? 'rgba(254, 243, 199, 0.9)' : 'rgba(254, 242, 242, 0.9)'),
                            color: inv.status === 'ACCEPTED' ? '#059669' : (inv.status === 'PENDING' ? '#B45309' : '#DC2626'),
                            border: `1px solid ${inv.status === 'ACCEPTED' ? 'rgba(16, 185, 129, 0.3)' : (inv.status === 'PENDING' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)')}`,
                            padding: '3px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 800,
                          }}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                        {inv.email} • Assigned to: <strong style={{ color: 'var(--color-text-primary)' }}>{inv.branch}</strong>
                      </div>
                      <div style={{ fontSize: '12px', color: '#0F766E', marginTop: '6px', fontWeight: 600 }}>
                        Permissions: Manage Queue ({inv.canManageQueue ? '✓' : '✗'}), Check-in Patients ({inv.canCheckIn ? '✓' : '✗'}), Medical History (Strictly Blocked)
                      </div>
                    </div>

                    <div>
                      {inv.status === 'ACCEPTED' && (
                        <button
                          onClick={() => handleRevoke(inv.id)}
                          style={{
                            backgroundColor: 'rgba(254, 242, 242, 0.9)',
                            color: '#DC2626',
                            border: '1px solid rgba(254, 202, 202, 0.8)',
                            padding: '8px 14px',
                            borderRadius: '10px',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          Revoke Access
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsInviteOpen(false)}
        >
          <div
            className="modal-container animate-slide-down"
            style={{
              maxWidth: '460px',
              padding: '28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                {language === 'en' ? 'Invite Doctor Assistant' : 'সহকারী আমন্ত্রণ জানান'}
              </h3>
              <button
                onClick={() => setIsInviteOpen(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(241, 245, 249, 0.8)',
                  border: 'none',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendInvite} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--color-text-primary)', display: 'block', marginBottom: '6px' }}>
                  {language === 'en' ? 'Assistant Full Name' : 'পূর্ণ নাম'} *
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Md. Shofiqul Islam"
                  className="glass-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--color-text-primary)', display: 'block', marginBottom: '6px' }}>
                  {language === 'en' ? 'Assistant Email or Mobile' : 'ইমেইল অথবা মোবাইল'} *
                </label>
                <input
                  type="text"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g. assistant@gmail.com"
                  className="glass-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  style={{
                    backgroundColor: 'rgba(241, 245, 249, 0.8)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--color-text-secondary)',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {language === 'en' ? 'Cancel' : 'বাতিল'}
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {language === 'en' ? 'Send Invitation' : 'আমন্ত্রণ পাঠান'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode="login"
          language={language}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={(user: any) => {
            setCurrentUser(user);
            setIsAuthModalOpen(false);
          }}
        />
      )}

      {/* Location Modal */}
      {isLocationModalOpen && (
        <LocationModal
          isOpen={isLocationModalOpen}
          language={language}
          onClose={() => setIsLocationModalOpen(false)}
          onSelectLocation={(loc: string) => {
            setSelectedLocation(loc);
            localStorage.setItem('dc_user_location', loc);
            setIsLocationModalOpen(false);
          }}
        />
      )}

      <Footer language={language} />
    </div>
  );
}
