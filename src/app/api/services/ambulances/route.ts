import { NextRequest, NextResponse } from 'next/server';
import { servicesEngine } from '@/lib/services-engine';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district') || undefined;

    const ambulances = servicesEngine.getAmbulances(district);
    return NextResponse.json({ success: true, count: ambulances.length, ambulances }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch ambulances' },
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
        { success: false, error: 'Patient name, phone, and pickup address are required.' },
        { status: 400 }
      );
    }

    const request = servicesEngine.createServiceRequest({
      patientUserId: patientUserId || 'user-patient-current',
      patientName,
      patientPhone,
      serviceType: 'AMBULANCE',
      providerId: providerId || 'amb-mb-01',
      providerName: providerName || 'Emergency Ambulance Service',
      districtName: districtName || 'Moulvibazar',
      upazilaName: upazilaName || 'Moulvibazar Sadar',
      deliveryAddress,
      requestedDate: new Date().toISOString(),
      status: 'DISPATCHED',
      estimatedAmountBDT: estimatedAmountBDT || 1500,
      paymentMethod: 'CASH',
      details: details || 'Emergency Patient Transfer',
    });

    // Persist to Supabase ambulance_requests
    try {
      const supabase = createServerClient();
      await supabase.from('ambulance_requests').insert({
        request_code: request.requestNumber,
        contact_name: patientName,
        contact_phone: patientPhone,
        pickup_address: deliveryAddress,
        destination_address: details || 'Hospital / Diagnostic Center',
        ambulance_type: 'ac',
        is_emergency: true,
        estimated_fare: estimatedAmountBDT || 1500,
        driver_name: 'মো. রফিক উদ্দিন',
        driver_phone: '01886748564',
        vehicle_number: 'সিলেট-ছ-১১-৪৫০২',
        status: 'assigned',
      });
    } catch (dbErr) {
      console.warn('Database ambulance write notice:', dbErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'অ্যাম্বুলেন্স তাৎক্ষণিক ডেসপ্যাচ করা হয়েছে। ড্রাইভারের সাথে যোগাযোগ করুন: 01886748564',
        request,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to dispatch ambulance' },
      { status: 500 }
    );
  }
}
