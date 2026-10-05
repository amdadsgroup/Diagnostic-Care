import { NextRequest, NextResponse } from 'next/server';
import { concurrencyEngine } from '@/lib/concurrency-lock';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slotId, userId } = body;

    if (!slotId || !userId) {
      return NextResponse.json(
        { success: false, error: 'slotId and userId are required.' },
        { status: 400 }
      );
    }

    const result = await concurrencyEngine.holdSlot(slotId, userId);

    if (!result.success) {
      return NextResponse.json(result, { status: 409 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
