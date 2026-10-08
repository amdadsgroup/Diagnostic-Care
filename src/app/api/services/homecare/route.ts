import { NextRequest, NextResponse } from 'next/server';
import { servicesEngine } from '@/lib/services-engine';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district') || undefined;

    const services = servicesEngine.getHomeCareServices(district);
    return NextResponse.json({ success: true, count: services.length, services }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch homecare services' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      patientUserId,
      patientName,
      patientPhone,
      providerId,
      providerName,
      districtName,
      upazilaName,
      deliveryAddress,
      details,
      estimatedAmountBDT,
    } = body;

    if (!patientName || !patientPhone || !deliveryAddress) {
      return NextResponse.json(
        { success: false, error: 'Patient name, phone, and home address are required.' },
        { status: 400 }
      );
    }

    const request = servicesEngine.createServiceRequest({
      patientUserId: patientUserId || 'user-patient-current',
      patientName,
      patientPhone,
      serviceType: 'HOME_CARE',
      providerId: providerId || 'homecare-01',
      providerName: providerName || 'Home Healthcare Provider',
      districtName: districtName || 'Moulvibazar',
      upazilaName: upazilaName || 'Moulvibazar Sadar',
      deliveryAddress,
      requestedDate: new Date().toISOString(),
      status: 'PENDING',
      estimatedAmountBDT: estimatedAmountBDT || 800,
      paymentMethod: 'CASH',
      details: details || 'Home Nursing & Caregiver Visit',
    });

    // Persist to Supabase home_healthcare_bookings
    try {
      const supabase = createServerClient();
      await supabase.from('home_healthcare_bookings').insert({
        booking_code: request.requestNumber,
        patient_name: patientName,
        contact_phone: patientPhone,
        service_address: deliveryAddress,
        start_date: new Date().toISOString().split('T')[0],
        duration_type: 'per_visit',
        total_cost: estimatedAmountBDT || 800,
        status: 'confirmed',
      });
    } catch (dbErr) {
      console.warn('Database homecare write notice:', dbErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'হোম কেয়ার রিকোয়েস্ট সফলভাবে গৃহীত হয়েছে। নার্স আপনার সাথে যোগাযোগ করবেন।',
        request,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to request homecare' },
      { status: 500 }
    );
  }
}
