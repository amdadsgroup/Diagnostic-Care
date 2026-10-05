import { NextRequest, NextResponse } from 'next/server';
import { ledgerEngine } from '@/lib/ledger-engine';

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
      patientPhone: patientPhone || '01819-876543',
      organizationId: organizationId || 'org-pop-mb',
      organizationName: organizationName || 'মৌলভীবাজার সেন্ট্রাল ক্লিনিক',
    });

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
