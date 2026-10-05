import { NextRequest, NextResponse } from 'next/server';

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

    const bookingCode = `LAB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    return NextResponse.json({
      success: true,
      bookingCode,
      message: `${testName} টেস্ট বুকিং সফল হয়েছে! সেন্টার প্রতিনিধি শীঘ্রই যোগাযোগ করবেন।`,
      details: {
        testName,
        organizationName,
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
