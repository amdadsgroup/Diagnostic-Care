'use client';

import React, { useState } from 'react';
import { BRAND } from '@/config/brand';

interface LiveQueueTrackerProps {
  doctorName?: string;
  specialization?: string;
  chamberName?: string;
}

export default function LiveQueueTracker({
  doctorName = 'ডাঃ আনিসুর রহমান (Dr. Anisur Rahman)',
  specialization = 'এমবিবিএস, এফসিপিএস (কার্ডিওলজি) - হৃদরোগ বিশেষজ্ঞ',
  chamberName = 'পপুলার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার মেইন ব্রাঞ্চ) - রুম ২০২',
}: LiveQueueTrackerProps) {
  const [currentServing, setCurrentServing] = useState(2);
  const [totalTokens, setTotalTokens] = useState(14);
  const [myToken, setMyToken] = useState<number | null>(6);
  const [avgMinutes, setAvgMinutes] = useState(15);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [smsAlertEnabled, setSmsAlertEnabled] = useState(true);



  // Calculate wait time
  const tokensAhead = myToken && myToken > currentServing ? myToken - currentServing : 0;
  const estimatedWaitMinutes = tokensAhead * avgMinutes;
  const isMyTurn = myToken === currentServing;
  const hasPassed = myToken ? myToken < currentServing : false;

  const handleNextPatient = async () => {
    try {
      const res = await fetch('/api/queue/call-next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorAssociationId: 'assoc-anisur-popular' }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentServing(data.queue.currentTokenServing);
      } else {
        setCurrentServing((prev) => Math.min(prev + 1, totalTokens));
      }
    } catch {
      setCurrentServing((prev) => Math.min(prev + 1, totalTokens));
    }
  };



  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Real-time Waiting Room Banner */}
      <div className="portal-card" style={{ background: 'linear-gradient(135deg, var(--brand-navy-900) 0%, #173863 100%)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, color: '#34d399', marginBottom: '8px' }}>
              <span className="animate-pulse-hold" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              লাইভ সিরিয়াল কিউ (Live Queue Tracker)
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{doctorName}</h2>
            <p style={{ opacity: 0.9, fontSize: '0.85rem' }}>{specialization}</p>
            <p style={{ opacity: 0.75, fontSize: '0.8rem', marginTop: '2px' }}>📍 {chamberName}</p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              style={{
                background: audioEnabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              {audioEnabled ? '🔔 সাউন্ড অ্যালার্ট: চালু' : '🔕 সাউন্ড: বন্ধ'}
            </button>
            <button
              onClick={() => setSmsAlertEnabled(!smsAlertEnabled)}
              style={{
                background: smsAlertEnabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              {smsAlertEnabled ? '📱 SMS অ্যালার্ট: চালু' : '📱 SMS: বন্ধ'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Queue Dashboard Tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* Currently Serving */}
        <div className="portal-stat-card" style={{ borderLeft: '4px solid var(--brand-teal-500)', background: 'var(--brand-teal-50)' }}>
          <div className="portal-stat-lbl" style={{ color: 'var(--brand-teal-600)', fontWeight: 700 }}>
            বর্তমানে চেম্বারে উপস্থিত (Serving Now)
          </div>
          <div className="portal-stat-val" style={{ color: 'var(--brand-teal-600)', fontSize: '2.4rem' }}>
            #{String(currentServing).padStart(2, '0')}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
            পরামর্শ চলছে • সময়: ~{avgMinutes} মিনিট
          </div>
        </div>

        {/* My Token */}
        <div className="portal-stat-card" style={{ borderLeft: '4px solid var(--brand-navy-900)' }}>
          <div className="portal-stat-lbl">আপনার সিরিয়াল টোকেন</div>
          <div className="portal-stat-val" style={{ color: 'var(--brand-navy-900)', fontSize: '2.4rem' }}>
            {myToken ? `#${String(myToken).padStart(2, '0')}` : 'বুকিং নেই'}
          </div>
          <div style={{ fontSize: '0.8rem', color: isMyTurn ? 'var(--brand-emerald-500)' : 'var(--slate-600)', fontWeight: isMyTurn ? 700 : 400 }}>
            {isMyTurn ? '🎉 আপনার ডাক পড়েছে! চেম্বারে প্রবেশ করুন।' : hasPassed ? 'সিরিয়াল সম্পন্ন হয়েছে' : `আপনার আগে ${tokensAhead} জন আছেন`}
          </div>
        </div>

        {/* Estimated Wait */}
        <div className="portal-stat-card" style={{ borderLeft: '4px solid var(--brand-amber-500)' }}>
          <div className="portal-stat-lbl">আনুমানিক অপেক্ষার সময়</div>
          <div className="portal-stat-val" style={{ color: '#b45309', fontSize: '2.4rem' }}>
            {tokensAhead > 0 ? `~${estimatedWaitMinutes} মি.` : 'প্রস্তুত'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
            গড় সময় {avgMinutes} মিনিট/রোগী
          </div>
        </div>

        {/* Total Tokens */}
        <div className="portal-stat-card" style={{ borderLeft: '4px solid var(--slate-400)' }}>
          <div className="portal-stat-lbl">আজকের মোট কোটা / রোগী</div>
          <div className="portal-stat-val" style={{ color: 'var(--slate-700)', fontSize: '2.4rem' }}>
            {totalTokens} জন
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
            অবশিষ্ট স্লট: {Math.max(0, totalTokens - currentServing)} টি
          </div>
        </div>
      </div>

      {/* Interactive Queue Controls (Doctor / Assistant Action) */}
      <div className="portal-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h4 style={{ fontWeight: 800, color: 'var(--brand-navy-900)' }}>
            চেম্বার কিউ কন্ট্রোল (Assistant / Doctor Control)
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            সহকারী রহিম মিয়া চেম্বারের বাইরে থেকে পরবর্তী রোগীকে কল করতে পারবেন।
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleNextPatient}
            className="btn-primary"
            style={{ fontSize: '0.9rem', padding: '10px 18px' }}
          >
            পরবর্তী রোগী ডাকুন (Call Next #{currentServing + 1}) 🔔
          </button>
        </div>
      </div>

      {/* Chamber Guidelines Card */}
      <div className="portal-card" style={{ border: '1px solid var(--border-subtle)', backgroundColor: '#F8FAFC' }}>
        <h4 style={{ fontWeight: 800, color: 'var(--brand-navy-900)', marginBottom: '8px' }}>
          চেম্বার পরিদর্শন নির্দেশিকা (Chamber Guidelines)
        </h4>
        <ul style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: '1.6', margin: 0, paddingLeft: '18px' }}>
          <li>আপনার সিরিয়ালের কমপক্ষে ২০ মিনিট পূর্বে ডায়াগনস্টিক সেন্টারের ওয়েটিং রুমে উপস্থিত থাকুন।</li>
          <li>পূর্ববর্তী সকল প্রেসক্রিপশন ও টেস্ট রিপোর্ট সাথে রাখুন।</li>
          <li>জরুরি সহায়তার জন্য আমাদের সার্বক্ষণিক হেল্পলাইনে যোগাযোগ করুন: <strong>01886748564</strong></li>
        </ul>
      </div>
    </div>
  );
}
