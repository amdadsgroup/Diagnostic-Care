import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { testName, organizationName, patientName, patientPhone, collectionType, preferredDate, fee } = body;

    if (!testName || !patientName || !patientPhone) {
      return NextResponse.json(
        { success: false, error: 'testName, patientName, and patientPhone are required.' },
        { status: 400 }
      );
    }

    const bookingCode = `DC-LAB-${Math.floor(1000 + Math.random() * 9000)}`;
    const supabase = createServerClient();

    // Persist to Supabase diagnostic bookings
    try {
      await supabase.from('diagnostic_bookings').insert({
        booking_code: bookingCode,
        booking_date: preferredDate || new Date().toISOString().split('T')[0],
        is_home_collection: collectionType === 'HOME_COLLECTION',
        patient_name: patientName,
        patient_phone: patientPhone,
        total_amount: fee || 500,
        net_payable: fee || 500,
        status: 'confirmed',
        payment_status: 'cash_at_desk',
      });
    } catch (dbErr) {
      console.warn('Database write bypassed in offline/local mode:', dbErr);
    }

    return NextResponse.json({
      success: true,
      bookingCode,
      message: `${testName} টেস্ট বুকিং সফল হয়েছে! সেন্টার প্রতিনিধি শীঘ্রই যোগাযোগ করবেন।`,
      details: {
        testName,
        organizationName: organizationName || 'Diagnostic Care Partner',
        patientName,
        patientPhone,
        collectionType: collectionType || 'CENTER_VISIT',
        preferredDate: preferredDate || new Date().toISOString().split('T')[0],
        fee: fee || 500,
        status: 'CONFIRMED',
      },
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
