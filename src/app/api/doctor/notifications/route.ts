import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId');
    const email = searchParams.get('email');

    const admin = getAdminClient();
    const notifications: any[] = [];

    // 1. Check pending invitations
    if (email) {
      try {
        const { data: invs } = await admin
          .from('doctor_invitations')
          .select('*')
          .eq('doctor_email', email.trim().toLowerCase())
          .eq('status', 'pending');

        if (invs) {
          invs.forEach((inv) => {
            notifications.push({
              id: `notif-inv-${inv.id}`,
              type: 'INVITATION',
              title: 'New Hospital Affiliation Invitation',
              titleBn: 'নতুন হাসপাতাল এফিলিয়েশন আমন্ত্রণ',
              message: `${inv.hospital_name || 'A partner hospital'} has invited you to join their specialist clinical roster.`,
              messageBn: `${inv.hospital_name || 'একটি পার্টনার হাসপাতাল'} আপনাকে তাদের কনসালটেন্ট প্যানেলে যুক্ত হওয়ার আমন্ত্রণ জানিয়েছে।`,
              timestamp: inv.created_at || new Date().toISOString(),
              isRead: false,
              actionUrl: '/doctor/portal?tab=affiliations',
              data: inv,
            });
          });
        }
      } catch (e) {
        console.warn('Invitations query notice:', e);
      }
    }

    // 2. Check recent appointments
    if (doctorId) {
      try {
        const { data: apts } = await admin
          .from('appointments')
          .select('id, patient_name, appointment_date, start_time, booking_source, created_at, status')
          .eq('doctor_id', doctorId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (apts) {
          apts.forEach((a) => {
            const isManual = a.booking_source === 'manual' || a.booking_source === 'phone_call' || a.booking_source === 'walk_in';
            notifications.push({
              id: `notif-apt-${a.id}`,
              type: isManual ? 'MANUAL_SERIAL' : 'ONLINE_BOOKING',
              title: isManual ? 'New Hospital Reception Serial' : 'New Online Patient Booking',
              titleBn: isManual ? 'হাসপাতাল রিসেপশন থেকে নতুন সিরিয়াল' : 'অনলাইন থেকে নতুন রোগী বুকিং',
              message: `Patient ${a.patient_name} booked for ${a.appointment_date} at ${a.start_time} (${a.status}).`,
              messageBn: `রোগী ${a.patient_name} ${a.appointment_date} তারিখে ${a.start_time} সময়ে সিরিয়াল নিয়েছেন।`,
              timestamp: a.created_at || new Date().toISOString(),
              isRead: false,
              actionUrl: '/doctor/portal?tab=appointments',
            });
          });
        }
      } catch (e) {
        console.warn('Appointments query notice:', e);
      }
    }

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
