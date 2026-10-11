import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/services/payment.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscriptionId, invoiceId, gateway, customerPhone, customerName, customerEmail } = body;

    if (!subscriptionId || !invoiceId || !gateway) {
      return NextResponse.json(
        { success: false, error: 'subscriptionId, invoiceId, and gateway are required.' },
        { status: 400 }
      );
    }

    const result = await PaymentService.initiateSubscriptionPayment({
      subscriptionId,
      invoiceId,
      gateway,
      customerPhone: customerPhone || '01886748564',
      customerName: customerName || 'Healthcare Provider',
      customerEmail,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Payment initiation failed' },
      { status: 500 }
    );
  }
}
