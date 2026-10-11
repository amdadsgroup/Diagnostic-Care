import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/services/payment.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      paymentReference,
      gatewayTransactionId,
      subscriptionId,
      invoiceId,
      amountBdt,
      gateway,
      organizationName,
      adminEmail,
    } = body;

    if (!paymentReference || !subscriptionId) {
      return NextResponse.json(
        { success: false, error: 'paymentReference and subscriptionId are required.' },
        { status: 400 }
      );
    }

    const result = await PaymentService.verifyAndActivateSubscription({
      paymentReference,
      gatewayTransactionId: gatewayTransactionId || `TX-${Date.now()}`,
      subscriptionId,
      invoiceId: invoiceId || 'inv-default',
      amountBdt: Number(amountBdt) || 500,
      gateway: gateway || 'sslcommerz',
      organizationName: organizationName || 'Healthcare Provider',
      adminEmail,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
