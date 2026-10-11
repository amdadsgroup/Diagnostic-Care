import { NextRequest, NextResponse } from 'next/server';
import { ledgerEngine } from '@/lib/ledger-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { organizationId, organizationName, amount, payoutChannel, destinationAccount } = body;

    if (!organizationId || !amount || !destinationAccount) {
      return NextResponse.json(
        { success: false, error: 'organizationId, amount, and destinationAccount are required.' },
        { status: 400 }
      );
    }

    const payableBalance = ledgerEngine.getProviderPayableBalance(organizationId);

    // Ledger settlement
    const payoutResult = ledgerEngine.processPayout({
      organizationId,
      organizationName: organizationName || 'Diagnostic Provider Partner',
      amount: Number(amount),
      payoutChannel: payoutChannel === 'BANK_TRANSFER' ? 'BANK_TRANSFER' : 'BKASH_MERCHANT',
      destinationAccount,
    });

    return NextResponse.json({
      success: true,
      message: `Disbursement of ৳${amount} processed successfully!`,
      payoutTxId: payoutResult.payoutTxId,
      remainingPayableBalance: ledgerEngine.getProviderPayableBalance(organizationId),
      ledgerEntries: payoutResult.ledgerEntries,
      auditStatus: ledgerEngine.verifyLedgerIntegrity(),
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Payout disbursement failed' },
      { status: 500 }
    );
  }
}
