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
              style={{
                backgroundColor: '#ECFDF5',
                border: '1px solid #10B981',
                color: '#065F46',
                borderRadius: '12px',
                padding: '14px 20px',
                marginBottom: '24px',
                fontSize: '14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
              }}
            >
              <CheckCircle2 size={20} color="#059669" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Assistant Sandbox & Security Isolation Card */}
          <div
            className="portal-card"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '28px 32px',
              border: '1px solid #E2E8F0',
              marginBottom: '28px',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
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
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26px',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                <UserCheck size={36} color="#059669" />
              </div>

              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, marginBottom: '6px' }}>
                  <ShieldCheck size={13} color="#2563EB" />
                  DOCTOR ASSISTANT SANDBOX • ACTIVE SESSION
                </div>
                <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                  Md. Shofiqul Islam (Doctor Assistant)
                </h1>
                <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B' }}>
                  Assigned Doctor: <strong>Dr. Anisur Rahman (Cardiologist)</strong> • Popular Diagnostic Center, Moulvibazar
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleCallNext}
                style={{
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  padding: '12px 22px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 800,
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                }}
              >
                <span>{language === 'en' ? 'Call Next' : 'পরবর্তী রোগী ডাকুন'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Server-Side Privacy Sandbox Notice */}
          <div
            style={{
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              fontSize: '13px',
              color: '#1E40AF',
              lineHeight: 1.5,
            }}
          >
            <Lock size={20} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 800, marginBottom: '2px' }}>
                {language === 'en' ? 'Server-Side Access Boundary Active' : 'সার্ভার-সাইড নিরাপত্তা বাউন্ডারি সক্রিয়'}
              </div>
              <span>
                {language === 'en'
                  ? 'Your assistant account is restricted strictly to assigned doctor queue management. Financial ledgers, patient medical history, prescriptions, and organization administrative settings are strictly protected.'
                  : 'আপনার সহকারী অ্যাকাউন্ট শুধুমাত্র নির্ধারিত ডাক্তারের সিরিয়াল ও চেক-ইন পরিচালনার জন্য সীমাবদ্ধ। রোগীর পূর্ববর্তী চিকিৎসা রেকর্ড বা অর্থনৈতিক তথ্যে প্রবেশাধিকার নিয়ন্ত্রিত।'}
              </span>
            </div>
          </div>

          {/* Sub-Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              borderBottom: '1px solid #E2E8F0',
              paddingBottom: '12px',
              marginBottom: '28px',
            }}
          >
            <button
              onClick={() => setActiveTab('queue')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'queue' ? '#10294F' : 'transparent',
                color: activeTab === 'queue' ? '#FFFFFF' : '#64748B',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
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
                padding: '10px 18px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'invitations' ? '#10294F' : 'transparent',
                color: activeTab === 'invitations' ? '#FFFFFF' : '#64748B',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
              }}
            >
              <UserPlus size={16} />
              <span>{language === 'en' ? 'Assistant Invitations & Access' : 'সহকারী আমন্ত্রণ ও পারমিশন'}</span>
            </button>
          </div>

          {/* TAB 1: LIVE QUEUE & CHECK-IN */}
          {activeTab === 'queue' && (
            <div
              className="portal-card"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {language === 'en' ? "Today's Appointment Queue" : 'আজকের রোগীর সিরিয়াল'}
                </h3>
                <span style={{ fontSize: '13px', color: '#059669', fontWeight: 700 }}>
                  Active Chamber: Room 204
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {queue.map((p) => {
                  const isCurrent = inRoomPatient?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '14px',
                        border: isCurrent ? '2px solid #10B981' : '1px solid #E2E8F0',
                        backgroundColor: isCurrent ? '#F0FDF4' : '#FFFFFF',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            backgroundColor: isCurrent ? '#10B981' : '#F1F5F9',
                            color: isCurrent ? '#FFFFFF' : '#0F172A',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 900,
                            fontSize: '18px',
                            flexShrink: 0,
                          }}
                        >
                          #{p.token}
                        </span>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 800, fontSize: '15px', color: '#0F172A' }}>
                              {p.name}
                            </span>
                            {p.status === 'IN_ROOM' && (
                              <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 800 }}>
                                IN ROOM
                              </span>
                            )}
                            {p.status === 'CHECKED_IN' && (
                              <span style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 800 }}>
                                CHECKED IN
                              </span>
                            )}
                            {p.status === 'COMPLETED' && (
                              <span style={{ backgroundColor: '#F1F5F9', color: '#64748B', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 800 }}>
                                COMPLETED
                              </span>
                            )}
                            {p.status === 'NO_SHOW' && (
                              <span style={{ backgroundColor: '#FEF2F2', color: '#DC2626', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 800 }}>
                                NO SHOW
                              </span>
                            )}
                          </div>

                          <div style={{ fontSize: '13px', color: '#64748B', marginTop: '3px' }}>
                            {p.age}y • Mobile: <strong>{p.phone}</strong> • Scheduled: {p.time}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        {p.status === 'WAITING' && (
                          <button
                            onClick={() => handleCheckIn(p.id)}
                            style={{
                              backgroundColor: '#EFF6FF',
                              color: '#1D4ED8',
                              border: '1px solid #BFDBFE',
                              padding: '8px 14px',
                              borderRadius: '8px',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Check-In
                          </button>
                        )}

                        {p.status !== 'COMPLETED' && p.status !== 'NO_SHOW' && (
                          <button
                            onClick={() => handleNoShow(p.id)}
                            style={{
                              backgroundColor: '#FEF2F2',
                              color: '#DC2626',
                              border: '1px solid #FECACA',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              cursor: 'pointer',
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
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {language === 'en' ? 'Authorized Doctor Assistants' : 'অনুমোদিত ডাক্তার সহকারী'}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0 0' }}>
                    {language === 'en'
                      ? 'Secure workflow for inviting assistants with branch-isolated permissions.'
                      : 'শাখা-ভিত্তিক সীমিত পারমিশন সহ নতুন সহকারীকে আমন্ত্রণ জানান।'}
                  </p>
                </div>

                <button
                  onClick={() => setIsInviteOpen(true)}
                  style={{
                    backgroundColor: '#10294F',
                    color: '#FFFFFF',
                    padding: '9px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
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
                    className="portal-card"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '20px 24px',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 800, fontSize: '15px', color: '#0F172A' }}>
                          {inv.name}
                        </span>
                        <span
                          style={{
                            backgroundColor: inv.status === 'ACCEPTED' ? '#ECFDF5' : (inv.status === 'PENDING' ? '#FEF3C7' : '#FEF2F2'),
                            color: inv.status === 'ACCEPTED' ? '#059669' : (inv.status === 'PENDING' ? '#B45309' : '#DC2626'),
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 800,
                          }}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748B' }}>
                        {inv.email} • Assigned to: {inv.branch}
                      </div>
                      <div style={{ fontSize: '12px', color: '#0284C7', marginTop: '4px' }}>
                        Permissions: Manage Queue ({inv.canManageQueue ? '✓' : '✗'}), Check-in Patients ({inv.canCheckIn ? '✓' : '✗'}), Medical History (Strictly Blocked)
                      </div>
                    </div>

                    <div>
                      {inv.status === 'ACCEPTED' && (
                        <button
                          onClick={() => handleRevoke(inv.id)}
                          style={{
                            backgroundColor: '#FEF2F2',
                            color: '#DC2626',
                            border: '1px solid #FECACA',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
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
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div
            className="portal-card"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '440px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {language === 'en' ? 'Invite Doctor Assistant' : 'সহকারী আমন্ত্রণ জানান'}
              </h3>
              <button
                onClick={() => setIsInviteOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '18px', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendInvite} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                  {language === 'en' ? 'Assistant Full Name' : 'পূর্ণ নাম'} *
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Md. Shofiqul Islam"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                  {language === 'en' ? 'Assistant Email or Mobile' : 'ইমেইল অথবা মোবাইল'} *
                </label>
                <input
                  type="text"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g. assistant@gmail.com"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  style={{ backgroundColor: '#F1F5F9', border: 'none', color: '#475569', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {language === 'en' ? 'Cancel' : 'বাতিল'}
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#10294F', border: 'none', color: '#FFFFFF', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
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
