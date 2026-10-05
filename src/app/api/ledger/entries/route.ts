import { NextRequest, NextResponse } from 'next/server';
import { ledgerEngine } from '@/lib/ledger-engine';

export async function GET(req: NextRequest) {
  try {
    const entries = ledgerEngine.getAllLedgerEntries();
    const transactions = ledgerEngine.getAllTransactions();
    const audit = ledgerEngine.verifyLedgerIntegrity();

    return NextResponse.json({
      success: true,
      entries,
      transactions,
      audit,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
