import { NextRequest, NextResponse } from 'next/server';
import { concurrencyEngine } from '@/lib/concurrency-lock';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slotId, userId, patientData } = body;

    if (!slotId || !userId || !patientData) {
      return NextResponse.json(
        { success: false, error: 'slotId, userId, and patientData are required.' },
        { status: 400 }
      );
    }

    const result = await concurrencyEngine.confirmSlot(slotId, userId, patientData);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
