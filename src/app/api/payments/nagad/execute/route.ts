import { NextRequest, NextResponse } from 'next/server';
import { ledgerEngine } from '@/lib/ledger-engine';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingCode, amount, patientPhone, organizationId, organizationName } = body;

    if (!bookingCode || !amount) {
      return NextResponse.json(
        { success: false, error: 'bookingCode and amount are required.' },
        { status: 400 }
      );
    }

    const { transaction, ledgerEntries } = ledgerEngine.processPayment({
      bookingCode,
      gateway: 'NAGAD',
      amount: Number(amount),
      patientPhone: patientPhone || '01886-748564',
      organizationId: organizationId || 'org-pop-mb',
      organizationName: organizationName || 'পপুলার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার)',
    });

    // Record into Supabase payments table
    try {
      const supabase = createServerClient();
      await supabase.from('payments').insert({
        payment_reference: transaction.gatewayTransactionId || transaction.id,
        gateway_name: 'nagad',
        amount: Number(amount),
        currency: 'BDT',
        payment_status: 'paid',
        purpose: 'appointment_fee',
      });
    } catch (dbErr) {
      console.warn('Database nagad payment log notice:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Nagad payment executed successfully! Balanced double-entry ledger created.',
      transaction,
      ledgerEntries,
      auditStatus: ledgerEngine.verifyLedgerIntegrity(),
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Payment execution failed' },
      { status: 500 }
    );
  }
}
