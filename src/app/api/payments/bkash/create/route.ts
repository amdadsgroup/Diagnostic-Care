import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, bookingCode, patientPhone } = body;

    if (!amount || !bookingCode || !patientPhone) {
      return NextResponse.json(
        { success: false, error: 'amount, bookingCode, and patientPhone are required.' },
        { status: 400 }
      );
    }

    const isProduction = !!process.env.BKASH_APP_KEY;
    const paymentId = `BKH-PAY-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    return NextResponse.json({
      success: true,
      paymentId,
      gateway: 'bKash Checkout',
      merchantName: 'Diagnostic Care BD',
      mode: isProduction ? 'production' : 'sandbox',
      amount,
      currency: 'BDT',
      expiresInSeconds: 300,
      instructions: 'Enter bKash account number, OTP, and PIN to complete instant payment.',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
