import { NextRequest, NextResponse } from 'next/server';
import { concurrencyEngine } from '@/lib/concurrency-lock';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const slotId = body.slotId || 'slot-moulvibazar-anisur-' + new Date().toISOString().split('T')[0] + '-1615';
    const candidateCount = Math.min(Math.max(body.candidateCount || 5, 2), 20);

    const simulatedUsers = Array.from({ length: candidateCount }).map(
      (_, i) => `Patient_${i + 1}_(01712-${100000 + i})`
    );

    const report = await concurrencyEngine.simulateRaceCondition(slotId, simulatedUsers);

    return NextResponse.json({ success: true, report }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
