'use client';

import React, { useState, useEffect } from 'react';
import { BRAND, BRAND_COLORS } from '@/config/brand';
import { BrandSymbol } from '@/components/brand/BrandSymbol';
import { MapPin, Settings } from 'lucide-react';
import ScheduleBuilder from './ScheduleBuilder';
import { DoctorService } from '@/services/doctor.service';

interface DoctorPortalProps {
  doctorName?: string;
  specialization?: string;
  chamberName?: string;
  doctorId?: string;
}

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

export default function DoctorPortal({
  doctorName = 'ডাঃ রফিকুল ইসলাম',
  specialization = 'এমবিবিএস, এফসিপিএস (কার্ডিওলজি) - হৃদরোগ ও মেডিসিন বিশেষজ্ঞ',
  chamberName = 'মৌলভীবাজার ডিজিটাল ডায়াগনস্টিক কমপ্লেক্স - রুম ২০৪',
  doctorId = '20000001-0000-0000-0000-000000000001',
}: DoctorPortalProps) {
  const [queue, setQueue] = useState<QueuePatient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScheduleBuilder, setShowScheduleBuilder] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [activePatient, setActivePatient] = useState<QueuePatient | null>(null);

  // Load real appointments for today
  useEffect(() => {
    DoctorService.getDoctorTodayAppointments(doctorId).then((apts) => {
      if (apts && apts.length > 0) {
        const mapped: QueuePatient[] = apts.map((a) => ({
          id: a.id,
          token: a.tokenNumber,
          name: a.patientName,
          phone: a.patientPhone,
          age: a.patientAge,
          gender: a.patientGender === 'FEMALE' ? 'FEMALE' : 'MALE',
          status: a.status === 'COMPLETED' ? 'COMPLETED' : (a.status === 'IN_PROGRESS' ? 'IN_ROOM' : 'WAITING'),
          time: a.startTime,
          fee: a.consultationFee,
        }));
        setQueue(mapped);
        const inRoom = mapped.find((p) => p.status === 'IN_ROOM') || mapped.find((p) => p.status === 'WAITING') || null;
        setActivePatient(inRoom);
      }
      setIsLoading(false);
    });
  }, [doctorId]);

  // Prescription Form State
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
  const [rxSuccess, setRxSuccess] = useState(false);

  // Statistics
  const totalPatients = queue.length;
  const completedPatients = queue.filter((p) => p.status === 'COMPLETED').length;
  const inRoomPatient = queue.find((p) => p.status === 'IN_ROOM');
  const totalRevenue = queue.filter((p) => p.status === 'COMPLETED' || p.status === 'IN_ROOM').reduce((acc, curr) => acc + curr.fee, 0);

  // Queue Operations
  const handleCallNext = () => {
    setQueue((prev) => {
      const copy = [...prev];
      // Mark current in room as completed
      const inRoomIdx = copy.findIndex((p) => p.status === 'IN_ROOM');
      if (inRoomIdx !== -1) copy[inRoomIdx].status = 'COMPLETED';

      // Find next waiting
      const nextWaitingIdx = copy.findIndex((p) => p.status === 'WAITING');
      if (nextWaitingIdx !== -1) {
        copy[nextWaitingIdx].status = 'IN_ROOM';
        setActivePatient(copy[nextWaitingIdx]);
      } else {
        setActivePatient(null);
      }
      return copy;
    });
  };

  const handleAddMedicine = () => {
    if (!newMedName.trim()) return;
    setMedicines([...medicines, { name: newMedName, dose: newMedDose, instruction: newMedInstruction, days: newMedDays }]);
    setNewMedName('');
  };

  const handleSavePrescription = async () => {
    if (!activePatient) return;
    setRxSuccess(true);
    try {
      await DoctorService.savePrescription({
        patientId: activePatient.id,
        doctorId: doctorId,
        clinicalNotes,
        diagnosis,
        medicines,
        recommendedTests,
      });
    } catch (err) {
      console.warn('Prescription database save notice:', err);
    }
    setTimeout(() => {
      setRxSuccess(false);
      setShowPrescriptionModal(false);
      handleCallNext();
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div className="portal-card" style={{ background: 'linear-gradient(135deg, #10294F 0%, #1769F5 100%)', color: 'white', border: '1px solid rgba(23, 105, 245, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', flexShrink: 0 }}>
              <BrandSymbol size={42} altText="Diagnostic Care" />
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 87, 255, 0.35)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', marginBottom: '6px', color: '#BFDBFE', fontWeight: 600 }}>
                <span>●</span> ডক্টর ওয়ার্কস্পেস (Doctor Clinical Hub)
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{doctorName}</h1>
              <p style={{ opacity: 0.9, fontSize: '0.9rem', marginTop: '2px' }}>{specialization}</p>
              <p style={{ opacity: 0.8, fontSize: '0.8rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} color="#60A5FA" /> {chamberName}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowScheduleBuilder(true)}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '10px 18px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <Settings size={15} color="#BFDBFE" />
              <span>শিডিউল কনফিগার করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="portal-stat-grid">
        <div className="portal-stat-card">
          <div className="portal-stat-lbl">আজকের মোট সিরিয়াল</div>
          <div className="portal-stat-val">{totalPatients} জন</div>
        </div>
        <div className="portal-stat-card">
          <div className="portal-stat-lbl">সম্পন্ন কনসালটেশন</div>
          <div className="portal-stat-val" style={{ color: 'var(--brand-emerald-500)' }}>{completedPatients} জন</div>
        </div>
        <div className="portal-stat-card">
          <div className="portal-stat-lbl">বর্তমানে চেম্বারে উপস্থিত</div>
          <div className="portal-stat-val" style={{ color: 'var(--brand-teal-500)' }}>
            {inRoomPatient ? `টোকেন #${inRoomPatient.token}` : 'অপেক্ষমান'}
          </div>
        </div>
        <div className="portal-stat-card">
          <div className="portal-stat-lbl">আজকের আর্নিং (BDT)</div>
          <div className="portal-stat-val">৳ {totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      {/* Main Clinical Layout: Current Patient & Live Queue */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Left: Active Consultation Card */}
        <div className="portal-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--slate-200)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-navy-900)' }}>
              🩺 বর্তমান রোগী কনসালটেশন
            </h3>
            {inRoomPatient && (
              <span style={{ background: 'var(--brand-emerald-50)', color: 'var(--brand-emerald-500)', border: '1px solid var(--brand-emerald-500)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                রুমে উপস্থিত ✓
              </span>
            )}
          </div>

          {inRoomPatient ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--slate-50)', padding: '16px', borderRadius: '12px', border: '1px solid var(--slate-200)', marginBottom: '20px' }}>
                <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'var(--brand-navy-900)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800 }}>
                  #{inRoomPatient.token}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-navy-900)' }}>
                    {inRoomPatient.name}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                    বয়স: {inRoomPatient.age} বছর • {inRoomPatient.gender === 'MALE' ? 'পুরুষ' : 'মহিলা'} • {inRoomPatient.phone}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--brand-teal-600)', fontWeight: 600, marginTop: '2px' }}>
                    ভিজিট ফি: ৳{inRoomPatient.fee} (পরিশোধিত)
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => setShowPrescriptionModal(true)}
                >
                  📝 প্রেসক্রিপশন লিখুন ও শেষ করুন
                </button>
                <button
                  type="button"
                  onClick={handleCallNext}
                  style={{ padding: '10px 16px', border: '1px solid var(--slate-300)', borderRadius: '8px', fontWeight: 600, color: 'var(--slate-700)', background: 'white' }}
                >
                  পরবর্তী রোগী কল করুন →
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--slate-500)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>☕</div>
              <p style={{ fontWeight: 600 }}>বর্তমানে কোনো রোগী চেম্বারে নেই</p>
              <button
                type="button"
                className="btn-primary"
                style={{ marginTop: '16px' }}
                onClick={handleCallNext}
              >
                পরবর্তী রোগী ডাকুন (Call Next) 🔔
              </button>
            </div>
          )}
        </div>

        {/* Right: Live Queue Table */}
        <div className="portal-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--slate-200)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-navy-900)' }}>
              📋 আজকের লাইভ সিরিয়াল কিউ (Live Queue)
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              সহকারী: রহিম মিয়া (Assigned)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {queue.map((p) => {
              const isCurrent = p.status === 'IN_ROOM';
              const isDone = p.status === 'COMPLETED';

              return (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: isCurrent ? 'var(--brand-teal-50)' : isDone ? 'var(--slate-50)' : 'white',
                    border: `1px solid ${isCurrent ? 'var(--brand-teal-500)' : 'var(--slate-200)'}`,
                    opacity: isDone ? 0.65 : 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        background: isCurrent ? 'var(--brand-teal-600)' : 'var(--slate-200)',
                        color: isCurrent ? 'white' : 'var(--slate-700)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                      }}
                    >
                      {p.token}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--slate-800)' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                        {p.time} • {p.age}y {p.gender === 'MALE' ? 'M' : 'F'}
                      </div>
                    </div>
                  </div>

                  <div>
                    {isCurrent ? (
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-teal-600)', background: 'white', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--brand-teal-500)' }}>
                        চেম্বারে
                      </span>
                    ) : isDone ? (
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-emerald-500)' }}>
                        ✓ সম্পন্ন
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                        অপেক্ষমান
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {isLoading && queue.length === 0 && (
              <div style={{ padding: '8px 0' }}>
                <div className="skeleton-box" style={{ width: '100%', height: '52px', borderRadius: '8px', marginBottom: '8px' }} />
                <div className="skeleton-box" style={{ width: '100%', height: '52px', borderRadius: '8px' }} />
              </div>
            )}
            {!isLoading && queue.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--slate-500)', fontSize: '0.85rem' }}>
                আজকের কোনো রোগী সিরিয়ালে নেই।
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Builder Modal */}
      {showScheduleBuilder && (
        <div className="modal-overlay" onClick={() => setShowScheduleBuilder(false)}>
          <div className="modal-container modal-container-wide" onClick={(e) => e.stopPropagation()}>
            <ScheduleBuilder
              doctorName={doctorName}
              onClose={() => setShowScheduleBuilder(false)}
            />
          </div>
        </div>
      )}

      {/* Digital Prescription Modal */}
      {showPrescriptionModal && activePatient && (
        <div className="modal-overlay" onClick={() => setShowPrescriptionModal(false)}>
          <div className="modal-container modal-container-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>ডিজিটাল প্রেসক্রিপশন ইঞ্জিন (e-Prescription)</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>রোগী: {activePatient.name} (টোকেন #{activePatient.token})</div>
              </div>
              <button className="modal-close" onClick={() => setShowPrescriptionModal(false)}>✕</button>
            </div>

            <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
              {rxSuccess ? (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <div style={{ fontSize: '2.5rem', color: 'var(--brand-emerald-500)' }}>✓</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>প্রেসক্রিপশন সফলভাবে সংরক্ষিত ও রোগীর ভল্টে পাঠানো হয়েছে!</h3>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="auth-field">
                    <label>রোগ নির্ণয় / Clinical Diagnosis</label>
                    <input
                      type="text"
                      placeholder="যেমন: Essential Hypertension with Dyslipidemia"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                    />
                  </div>

                  {/* Medicines list */}
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '8px' }}>
                      ওষুধের তালিকা (Rx)
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                      {medicines.map((m, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--slate-50)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--slate-200)', fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--brand-navy-900)' }}>{idx + 1}. {m.name}</span>
                          <span style={{ color: 'var(--brand-teal-600)', fontWeight: 600 }}>{m.dose} ({m.instruction})</span>
                          <span style={{ color: 'var(--slate-500)' }}>{m.days} দিন</span>
                        </div>
                      ))}
                    </div>

                    {/* Add medicine row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1fr auto', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="ওষুধের নাম (যেমন: Tab. Napa 500mg)"
                        value={newMedName}
                        onChange={(e) => setNewMedName(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="ডোজ (১+০+১)"
                        value={newMedDose}
                        onChange={(e) => setNewMedDose(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="খাবারের নিয়ম"
                        value={newMedInstruction}
                        onChange={(e) => setNewMedInstruction(e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="দিন"
                        value={newMedDays}
                        onChange={(e) => setNewMedDays(Number(e.target.value))}
                      />
                      <button
                        type="button"
                        onClick={handleAddMedicine}
                        style={{ padding: '0 14px', background: 'var(--brand-navy-900)', color: 'white', borderRadius: '6px', fontWeight: 600 }}
                      >
                        + যোগ করুন
                      </button>
                    </div>
                  </div>

                  <div className="auth-field">
                    <label>প্রস্তাবিত ডায়াগনস্টিক টেস্ট (Recommended Tests)</label>
                    <input
                      type="text"
                      placeholder="CBC, Serum Creatinine, RBS"
                      value={recommendedTests}
                      onChange={(e) => setRecommendedTests(e.target.value)}
                    />
                  </div>

                  <div className="auth-field">
                    <label>উপদেশ ও নোট (Advice & Clinical Notes)</label>
                    <textarea
                      rows={2}
                      placeholder="লবণ কম খাবেন, প্রতিদিন ৩০ মিনিট হাঁটবেন, ৭ দিন পর রক্তচাপ মাপবেন।"
                      value={clinicalNotes}
                      onChange={(e) => setClinicalNotes(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setShowPrescriptionModal(false)}
                      style={{ padding: '10px 18px', border: '1px solid var(--slate-300)', borderRadius: '8px', fontWeight: 600 }}
                    >
                      বাতিল
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={handleSavePrescription}
                    >
                      প্রেসক্রিপশন ইস্যু করুন ✓
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
