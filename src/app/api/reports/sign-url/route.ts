import { NextRequest, NextResponse } from 'next/server';
import { reportsEngine } from '@/lib/reports-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reportId, userId } = body;

    if (!reportId || !userId) {
      return NextResponse.json(
        { success: false, error: 'reportId and userId are required.' },
        { status: 400 }
      );
    }

    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const signedData = reportsEngine.generateSignedReportUrl(reportId, userId, clientIp);

    return NextResponse.json({ success: true, ...signedData }, { status: 200 });
  } catch (error: any) {
    const status = error.message.includes('UNAUTHORIZED_ACCESS') ? 403 : 400;
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to sign report URL' },
      { status }
    );
  }
}
