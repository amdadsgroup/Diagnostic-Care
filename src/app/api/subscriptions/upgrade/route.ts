import { NextRequest, NextResponse } from 'next/server';
import { ledgerEngine } from '@/lib/ledger-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { organizationId, organizationName, tier, gateway, phone } = body;

    if (!organizationId || !tier) {
      return NextResponse.json(
        { success: false, error: 'organizationId and tier are required.' },
        { status: 400 }
      );
    }

    const { subscription, transaction } = ledgerEngine.processSubscription({
      organizationId,
      organizationName: organizationName || 'পপুলার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার)',
      tier,
      gateway: gateway || 'BKASH',
      patientPhone: phone || '01886748564',
    });

    return NextResponse.json({
      success: true,
      message: `B2B ${tier} প্ল্যান সফলভাবে সক্রিয় হয়েছে!`,
      subscription,
      transaction,
      auditStatus: ledgerEngine.verifyLedgerIntegrity(),
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Subscription processing failed' },
      { status: 500 }
    );
  }
}
