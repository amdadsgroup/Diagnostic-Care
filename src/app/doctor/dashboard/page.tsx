'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import AuthModal from '@/components/auth/AuthModal';
import LocationModal from '@/components/location/LocationModal';
import { useLanguage } from '@/context/LanguageContext';
import { DoctorService } from '@/services/doctor.service';
import { AuthService, AuthUserProfile } from '@/services/auth.service';
import { BRAND_COLORS, BRAND_CONSTANTS } from '@/config/brand';
import {
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Stethoscope,
  FileText,
  Plus,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Building2,
  CalendarDays,
  Settings,
  Lock,
  Phone,
} from 'lucide-react';

interface QueuePatient {
  id: string;
  token: number;
  name: string;
  phone: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  status: 'WAITING' | 'IN_ROOM' | 'COMPLETED' | 'NO_SHOW';
  time: string;
  fee: number;
}

export default function DoctorDashboardPage() {
  const { language, setLanguage, formatCurrency } = useLanguage();
  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Moulvibazar');

  const [activeTab, setActiveTab] = useState<'queue' | 'schedule' | 'leaves' | 'prescriptions'>('queue');
  const [queue, setQueue] = useState<QueuePatient[]>([]);
  const [activePatient, setActivePatient] = useState<QueuePatient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Digital Prescription Form
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [recommendedTests, setRecommendedTests] = useState('CBC, Lipid Profile, ECG 12-lead');
  const [medicines, setMedicines] = useState<Array<{ name: string; dose: string; instruction: string; days: number }>>([
    { name: 'Tab. Concor 2.5mg', dose: '1+0+0', instruction: 'সকালে খাবারের পর', days: 30 },
    { name: 'Tab. Rosuva 10mg', dose: '0+0+1', instruction: 'রাতে খাবারের পর', days: 30 },
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('1+0+1');
  const [newMedInstruction, setNewMedInstruction] = useState('খাবারের পর');
  const [newMedDays, setNewMedDays] = useState(7);

  // Leave Management State
  const [leaves, setLeaves] = useState([
    { id: 'l-1', startDate: '2026-10-18', endDate: '2026-10-20', reason: 'Cardiology Conference in Dhaka', status: 'ACTIVE' },
  ]);
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);

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

    loadDoctorQueue();
  }, []);

  const loadDoctorQueue = () => {
    // Load default doctor queue
    const demoQueue: QueuePatient[] = [
      { id: 'p-1', token: 1, name: 'আনিসুল হক (Anisul Hoque)', phone: '01886748564', age: 48, gender: 'MALE', status: 'IN_ROOM', time: '16:00', fee: 800 },
      { id: 'p-2', token: 2, name: 'রাশেদা আক্তার (Rasheda Akter)', phone: '01712998811', age: 36, gender: 'FEMALE', status: 'WAITING', time: '16:15', fee: 800 },
      { id: 'p-3', token: 3, name: 'তাহমিদুর রহমান (Tahmidur Rahman)', phone: '01911445566', age: 52, gender: 'MALE', status: 'WAITING', time: '16:30', fee: 800 },
      { id: 'p-4', token: 4, name: 'ফরিদা পারভীন (Farida Parveen)', phone: '01822334455', age: 29, gender: 'FEMALE', status: 'WAITING', time: '16:45', fee: 800 },
      { id: 'p-5', token: 5, name: 'কামাল হোসেন (Kamal Hossain)', phone: '01733667788', age: 61, gender: 'MALE', status: 'WAITING', time: '17:00', fee: 800 },
    ];
    setQueue(demoQueue);
    setActivePatient(demoQueue[0]);
    setIsLoading(false);
  };

  // Queue advancement
  const handleCallNext = () => {
    setQueue((prev) => {
      const copy = [...prev];
      const inRoomIdx = copy.findIndex((p) => p.status === 'IN_ROOM');
      if (inRoomIdx !== -1) {
        copy[inRoomIdx].status = 'COMPLETED';
      }

      const nextWaitingIdx = copy.findIndex((p) => p.status === 'WAITING');
      if (nextWaitingIdx !== -1) {
        copy[nextWaitingIdx].status = 'IN_ROOM';
        setActivePatient(copy[nextWaitingIdx]);
        showToast(
          language === 'en'
            ? `Calling Token #${copy[nextWaitingIdx].token}: ${copy[nextWaitingIdx].name}`
            : `টোকেন #${copy[nextWaitingIdx].token} ডাকা হচ্ছে: ${copy[nextWaitingIdx].name}`
        );
      } else {
        setActivePatient(null);
        showToast(language === 'en' ? 'All scheduled patients completed.' : 'আজকের সকল রোগীর সিরিয়াল সম্পন্ন হয়েছে।');
      }
      return copy;
    });
  };

  const handleUpdateStatus = (patientId: string, status: QueuePatient['status']) => {
    setQueue((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, status } : p))
    );
    showToast(
      language === 'en' ? `Status updated to ${status}.` : `রোগীর স্ট্যাটাস আপডেট করা হয়েছে।`
    );
  };

  const handleAddMedicine = () => {
    if (!newMedName.trim()) return;
    setMedicines([...medicines, { name: newMedName, dose: newMedDose, instruction: newMedInstruction, days: newMedDays }]);
    setNewMedName('');
  };

  const handleSavePrescription = async () => {
    if (!activePatient) return;
    showToast(
      language === 'en'
        ? `Prescription saved for ${activePatient.name} (Token #${activePatient.token}).`
        : `টোকেন #${activePatient.token} (${activePatient.name})-এর প্রেসক্রিপশন সংরক্ষিত হয়েছে।`
    );
  };

  const handleAddLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveStartDate || !leaveEndDate) return;

    setLeaves([
      ...leaves,
      {
        id: `l-${Date.now()}`,
        startDate: leaveStartDate,
        endDate: leaveEndDate,
        reason: leaveReason || 'Personal Leave',
        status: 'ACTIVE',
      },
    ]);
    setIsAddLeaveOpen(false);
    setLeaveStartDate('');
    setLeaveEndDate('');
    setLeaveReason('');
    showToast(
      language === 'en'
        ? 'Leave schedule recorded. Chamber slots blocked automatically.'
        : 'ছুটি সংরক্ষিত হয়েছে। সংশ্লিষ্ট তারিখের স্লট স্বয়ংক্রিয়ভাবে বন্ধ থাকবে।'
    );
  };

  const totalPatients = queue.length;
  const completedCount = queue.filter((p) => p.status === 'COMPLETED').length;
  const inRoomPatient = queue.find((p) => p.status === 'IN_ROOM');
  const revenueTotal = queue
    .filter((p) => p.status === 'COMPLETED' || p.status === 'IN_ROOM')
    .reduce((sum, p) => sum + p.fee, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Header
        language={language}
        setLanguage={setLanguage}
        activeTab="doctor-portal"
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

          {/* Top Banner: Doctor Credentials & Live Status */}
          <div
            className="glass-card"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 96, 250, 0.95) 0%, rgba(0, 78, 209, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              color: '#FFFFFF',
              borderRadius: '24px',
              padding: '28px 32px',
              marginBottom: '28px',
              boxShadow: '0 16px 36px -10px rgba(0, 96, 250, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
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
                  width: '68px',
                  height: '68px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  color: '#0060FA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '28px',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  flexShrink: 0,
                }}
              >
                <Stethoscope size={38} color="#0060FA" />
              </div>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255, 255, 255, 0.18)', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, marginBottom: '6px' }}>
                  <ShieldCheck size={13} color="#EBF3FF" />
                  BMDC REG: A-45892 (VERIFIED)
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
                  Dr. Anisur Rahman (ডাঃ আনিসুর রহমান)
                </h1>
                <p style={{ margin: 0, fontSize: '13.5px', opacity: 0.9 }}>
                  Associate Professor & Cardiologist • Popular Diagnostic Center, Moulvibazar
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={handleCallNext}
                style={{
                  background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
                  color: '#FFFFFF',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 800,
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(21, 128, 61, 0.35)',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{language === 'en' ? 'Call Next Patient' : 'পরবর্তী রোগী ডাকুন'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            <div className="glass-card-sm" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#627680', textTransform: 'uppercase' }}>
                {language === 'en' ? "Today's Total Patients" : 'আজকের মোট সিরিয়াল'}
              </div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#090D14', marginTop: '4px' }}>
                {totalPatients}
              </div>
            </div>

            <div className="glass-card-sm" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#627680', textTransform: 'uppercase' }}>
                {language === 'en' ? 'Currently In-Room' : 'বর্তমানে চেম্বারে'}
              </div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#0060FA', marginTop: '4px' }}>
                {inRoomPatient ? `Token #${inRoomPatient.token}` : 'None'}
              </div>
            </div>

            <div className="glass-card-sm" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#627680', textTransform: 'uppercase' }}>
                {language === 'en' ? 'Completed Patients' : 'সম্পন্ন হয়েছে'}
              </div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#15803D', marginTop: '4px' }}>
                {completedCount} / {totalPatients}
              </div>
            </div>

            <div className="glass-card-sm" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#627680', textTransform: 'uppercase' }}>
                {language === 'en' ? 'Chamber Fees Collected' : 'মোট ফি সংগ্রহ'}
              </div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#090D14', marginTop: '4px' }}>
                {formatCurrency(revenueTotal)}
              </div>
            </div>
          </div>

          {/* Sub-Tab Navigation */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
              paddingBottom: '14px',
              marginBottom: '28px',
              overflowX: 'auto',
            }}
          >
            {[
              { id: 'queue', labelEn: "Live Queue & Caller", labelBn: 'লাইভ সিরিয়াল ও রিংগার', icon: Users },
              { id: 'prescriptions', labelEn: 'Digital Rx Prescriptions', labelBn: 'ডিজিটাল প্রেসক্রিপশন', icon: FileText },
              { id: 'schedule', labelEn: 'Weekly Schedule Builder', labelBn: 'সাপ্তাহিক সময়সূচি', icon: Clock },
              { id: 'leaves', labelEn: 'Leave & Vacation Manager', labelBn: 'ছুটি ও বন্ধ ব্যবস্থাপনা', icon: CalendarDays },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: isActive ? 'none' : '1px solid rgba(226, 232, 240, 0.8)',
                    background: isActive ? 'linear-gradient(135deg, #0060FA 0%, #004ED1 100%)' : 'rgba(255, 255, 255, 0.65)',
                    backdropFilter: 'blur(8px)',
                    color: isActive ? '#FFFFFF' : '#627680',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    boxShadow: isActive ? '0 4px 14px rgba(0, 96, 250, 0.22)' : 'none',
                  }}
                >
                  <Icon size={16} />
                  <span>{language === 'en' ? tab.labelEn : tab.labelBn}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: LIVE QUEUE & CALLER */}
          {activeTab === 'queue' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
              {/* Queue List Table */}
              <div
                className="glass-card"
                style={{
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                    {language === 'en' ? "Today's Patient Queue" : 'আজকের সিরিয়াল তালিকা'}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#627680', fontWeight: 600 }}>
                    Moulvibazar Main Branch • Room 204
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {queue.map((p) => {
                    const isCurrent = inRoomPatient?.id === p.id;
                    return (
                      <div
                        key={p.id}
                        style={{
                          padding: '14px 16px',
                          borderRadius: '14px',
                          border: isCurrent ? '2px solid #0060FA' : '1px solid rgba(226, 232, 240, 0.8)',
                          background: isCurrent ? 'linear-gradient(135deg, rgba(235, 243, 255, 0.45) 0%, rgba(255, 255, 255, 0.85) 100%)' : 'rgba(255, 255, 255, 0.6)',
                          backdropFilter: 'blur(8px)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.15s ease',
                          boxShadow: isCurrent ? '0 6px 16px rgba(0, 96, 250, 0.12)' : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <span
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '10px',
                              backgroundColor: isCurrent ? '#0060FA' : 'rgba(235, 243, 255, 0.5)',
                              color: isCurrent ? '#FFFFFF' : '#0060FA',
                              border: isCurrent ? 'none' : '1px solid rgba(0, 96, 250, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '15px',
                              flexShrink: 0,
                            }}
                          >
                            #{p.token}
                          </span>

                          <div>
                            <div style={{ fontWeight: 800, fontSize: '14.5px', color: '#090D14' }}>
                              {p.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#627680', marginTop: '2px' }}>
                              {p.age}y, {p.gender} • {p.phone} • {p.time}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {p.status === 'IN_ROOM' && (
                            <span style={{ backgroundColor: 'rgba(0, 96, 250, 0.12)', color: '#0060FA', border: '1px solid rgba(0, 96, 250, 0.25)', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                              IN ROOM
                            </span>
                          )}
                          {p.status === 'COMPLETED' && (
                            <span style={{ backgroundColor: 'rgba(21, 128, 61, 0.1)', color: '#15803D', border: '1px solid rgba(21, 128, 61, 0.25)', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                              DONE
                            </span>
                          )}
                          {p.status === 'WAITING' && (
                            <button
                              onClick={() => {
                                setQueue(queue.map((q) => (q.id === p.id ? { ...q, status: 'IN_ROOM' } : q)));
                                setActivePatient(p);
                              }}
                              className="btn-outline"
                              style={{
                                padding: '4px 12px',
                                borderRadius: '8px',
                                fontSize: '11.5px',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Call
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* In-Room Patient Consultation Box */}
              <div
                className="glass-card"
                style={{
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                    {language === 'en' ? 'Active Consultation' : 'বর্তমান রোগী কনসালটেশন'}
                  </h3>
                  {activePatient && (
                    <span className="glass-badge-teal" style={{ padding: '3px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
                      Token #{activePatient.token}
                    </span>
                  )}
                </div>

                {activePatient ? (
                  <div>
                    <div className="glass-inset" style={{ padding: '16px', marginBottom: '18px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#090D14' }}>
                        {activePatient.name}
                      </div>
                      <div style={{ fontSize: '13px', color: '#627680', marginTop: '2px' }}>
                        Age: {activePatient.age} • Gender: {activePatient.gender} • Phone: {activePatient.phone}
                      </div>
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                        {language === 'en' ? 'Clinical Diagnosis' : 'রোগের প্রাথমিক নির্ণয়'}
                      </label>
                      <input
                        type="text"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="e.g. Essential Hypertension Grade II, Hyperlipidemia"
                        className="glass-input"
                        style={{ width: '100%', fontSize: '13.5px' }}
                      />
                    </div>

                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                        {language === 'en' ? 'Clinical Notes & Advice' : 'ডাক্তারের পরামর্শ ও পর্যবেক্ষণ'}
                      </label>
                      <textarea
                        rows={3}
                        value={clinicalNotes}
                        onChange={(e) => setClinicalNotes(e.target.value)}
                        placeholder="e.g. Low sodium diet, 30 min daily walking, follow-up in 2 weeks"
                        className="glass-input"
                        style={{ width: '100%', fontSize: '13.5px' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={handleSavePrescription}
                        className="btn-outline"
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {language === 'en' ? 'Save Rx & Print' : 'প্রেসক্রিপশন প্রিন্ট'}
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(activePatient.id, 'COMPLETED')}
                        className="btn-primary"
                        style={{
                          padding: '10px 20px',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {language === 'en' ? 'Mark Completed' : 'সম্পন্ন করুন'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94A3B8' }}>
                    <Users size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                    <p style={{ fontWeight: 600, fontSize: '14px' }}>
                      {language === 'en' ? 'No patient currently in chamber. Click "Call Next Patient".' : 'বর্তমানে কোনো রোগী চেম্বারে নেই। "পরবর্তী রোগী ডাকুন" চাপুন।'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DIGITAL PRESCRIPTIONS */}
          {activeTab === 'prescriptions' && (
            <div
              className="glass-card"
              style={{
                padding: '28px',
                maxWidth: '780px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', marginBottom: '18px' }}>
                {language === 'en' ? 'Digital Rx Prescription Writer' : 'ডিজিটাল প্রেসক্রিপশন তৈরি'}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                  <input
                    type="text"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    placeholder="Medicine Name (e.g. Tab. Napa 500mg)"
                    className="glass-input"
                    style={{ fontSize: '13px', padding: '8px 12px' }}
                  />
                  <input
                    type="text"
                    value={newMedDose}
                    onChange={(e) => setNewMedDose(e.target.value)}
                    placeholder="Dose (e.g. 1+0+1)"
                    className="glass-input"
                    style={{ fontSize: '13px', padding: '8px 12px' }}
                  />
                  <input
                    type="text"
                    value={newMedInstruction}
                    onChange={(e) => setNewMedInstruction(e.target.value)}
                    placeholder="Instruction (খাবারের পর)"
                    className="glass-input"
                    style={{ fontSize: '13px', padding: '8px 12px' }}
                  />
                  <button
                    onClick={handleAddMedicine}
                    className="btn-primary"
                    style={{ padding: '8px 16px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                  >
                    + Add
                  </button>
                </div>

                {/* Medication List */}
                <div style={{ border: '1px solid rgba(226, 232, 240, 0.8)', borderRadius: '14px', overflow: 'hidden', background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(8px)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead style={{ background: 'rgba(244, 248, 250, 0.85)', borderBottom: '1px solid rgba(226, 232, 240, 0.8)' }}>
                      <tr>
                        <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#090D14' }}>Medicine</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#090D14' }}>Dosage</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#090D14' }}>Instructions</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#090D14' }}>Days</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicines.map((m, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(241, 245, 249, 0.8)' }}>
                          <td style={{ padding: '10px 14px', fontWeight: 600, color: '#090D14' }}>{m.name}</td>
                          <td style={{ padding: '10px 14px', color: '#0060FA', fontWeight: 700 }}>{m.dose}</td>
                          <td style={{ padding: '10px 14px', color: '#627680' }}>{m.instruction}</td>
                          <td style={{ padding: '10px 14px', color: '#627680' }}>{m.days} days</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                    {language === 'en' ? 'Recommended Diagnostic Tests' : 'প্রস্তাবিত ল্যাব টেস্ট'}
                  </label>
                  <input
                    type="text"
                    value={recommendedTests}
                    onChange={(e) => setRecommendedTests(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%', fontSize: '13px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WEEKLY SCHEDULE BUILDER */}
          {activeTab === 'schedule' && (
            <div
              className="glass-card"
              style={{
                padding: '28px',
                maxWidth: '780px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', marginBottom: '18px' }}>
                {language === 'en' ? 'Chamber Working Schedule' : 'চেম্বারের সাপ্তাহিক সময়সূচি'}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="glass-inset" style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: '#090D14' }}>
                      Popular Diagnostic Center (Moulvibazar Main Branch)
                    </div>
                    <span style={{ backgroundColor: 'rgba(21, 128, 61, 0.1)', color: '#15803D', border: '1px solid rgba(21, 128, 61, 0.25)', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                      ACTIVE
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#627680' }}>
                    Days: <strong style={{ color: '#090D14' }}>Saturday to Thursday (শনিবার - বৃহস্পতিবার)</strong> • 16:00 to 20:00 (4:00 PM - 8:00 PM)
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#0060FA', fontWeight: 600, marginTop: '4px' }}>
                    Slot Duration: 15 mins • Max 16 patients/day • Consultation Fee: ৳800
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEAVE & VACATION MANAGER */}
          {activeTab === 'leaves' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                    {language === 'en' ? 'Leave & Holiday Management' : 'ছুটি ও বন্ধ ব্যবস্থাপনা'}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#627680', margin: '2px 0 0 0' }}>
                    {language === 'en'
                      ? 'Recorded leaves automatically block chamber slots and prevent bookings.'
                      : 'ছুটি নির্ধারণ করলে সংশ্লিষ্ট দিনগুলোর চেম্বার স্লট স্বয়ংক্রিয়ভাবে বন্ধ থাকবে।'}
                  </p>
                </div>

                <button
                  onClick={() => setIsAddLeaveOpen(true)}
                  className="btn-primary"
                  style={{
                    padding: '9px 18px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={16} />
                  <span>{language === 'en' ? 'Add Leave' : 'ছুটি যোগ করুন'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {leaves.map((l) => (
                  <div
                    key={l.id}
                    className="glass-card-sm"
                    style={{
                      padding: '18px 22px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '15px', color: '#090D14' }}>
                        {l.reason}
                      </div>
                      <div style={{ fontSize: '13px', color: '#627680', marginTop: '2px' }}>
                        Dates: <strong style={{ color: '#090D14' }}>{l.startDate}</strong> to <strong style={{ color: '#090D14' }}>{l.endDate}</strong>
                      </div>
                    </div>

                    <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#B45309', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '3px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>
                      SLOTS BLOCKED
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Leave Modal */}
      {isAddLeaveOpen && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div
            className="modal-container animate-slide-down"
            style={{
              maxWidth: '440px',
              width: '100%',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090D14', margin: 0 }}>
                {language === 'en' ? 'Schedule Doctor Leave' : 'ডাক্তারের ছুটি নির্ধারণ'}
              </h3>
              <button
                onClick={() => setIsAddLeaveOpen(false)}
                style={{ background: 'none', border: 'none', color: '#627680', cursor: 'pointer', fontSize: '18px', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLeave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                  {language === 'en' ? 'Start Date' : 'শুরুর তারিখ'} *
                </label>
                <input
                  type="date"
                  required
                  value={leaveStartDate}
                  onChange={(e) => setLeaveStartDate(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                  {language === 'en' ? 'End Date' : 'শেষের তারিখ'} *
                </label>
                <input
                  type="date"
                  required
                  value={leaveEndDate}
                  onChange={(e) => setLeaveEndDate(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#090D14', display: 'block', marginBottom: '6px' }}>
                  {language === 'en' ? 'Reason / Details' : 'ছুটির কারণ'}
                </label>
                <input
                  type="text"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="e.g. Medical Conference, Personal Vacation"
                  className="glass-input"
                  style={{ width: '100%', fontSize: '13.5px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddLeaveOpen(false)}
                  className="btn-outline"
                  style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {language === 'en' ? 'Cancel' : 'বাতিল'}
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {language === 'en' ? 'Confirm Leave' : 'ছুটি নিশ্চিত করুন'}
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
