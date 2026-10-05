import { NextRequest, NextResponse } from 'next/server';
import { concurrencyEngine } from '@/lib/concurrency-lock';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorAssociationId = searchParams.get('doctorAssociationId') || 'assoc-anisur-popular';
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const tokenStr = searchParams.get('token');
    const token = tokenStr ? parseInt(tokenStr, 10) : undefined;

    const status = concurrencyEngine.getQueueStatus(doctorAssociationId, date, token);
    return NextResponse.json({ success: true, ...status }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
