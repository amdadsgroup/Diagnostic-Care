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

    const merchantId = process.env.NAGAD_MERCHANT_ID;
    const paymentId = `NGD-PAY-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    return NextResponse.json({
      success: true,
      paymentId,
      gateway: 'Nagad Checkout',
      merchantName: 'Diagnostic Care BD',
      merchantId: merchantId || 'DEMO_NAGAD_MOUVI',
      amount,
      currency: 'BDT',
      expiresInSeconds: 300,
      instructions: 'Enter Nagad mobile account number, verify OTP, and enter PIN to authorize payment.',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
