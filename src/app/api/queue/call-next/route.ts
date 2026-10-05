import { NextRequest, NextResponse } from 'next/server';
import { concurrencyEngine } from '@/lib/concurrency-lock';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const doctorAssociationId = body.doctorAssociationId || 'assoc-anisur-popular';
    const date = body.date || new Date().toISOString().split('T')[0];

    const updatedQueue = concurrencyEngine.callNextQueueToken(doctorAssociationId, date);
    return NextResponse.json({ success: true, queue: updatedQueue }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
