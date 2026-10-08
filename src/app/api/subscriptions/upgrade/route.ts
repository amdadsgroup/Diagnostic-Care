import { NextRequest, NextResponse } from 'next/server';
import { ledgerEngine } from '@/lib/ledger-engine';
import { createServerClient } from '@/lib/supabase/server';

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

    // Record into Supabase subscriptions table
    try {
      const supabase = createServerClient();
      await supabase.from('subscriptions').insert({
        provider_type: 'diagnostic_center',
        provider_id: organizationId.length > 20 ? organizationId : 'a0000000-0000-0000-0000-000000000001',
        plan_name: tier,
        price_bdt: subscription.monthlyFee,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
      });
    } catch (dbErr) {
      console.warn('Database subscription log notice:', dbErr);
    }

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
