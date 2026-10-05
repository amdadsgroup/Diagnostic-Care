import { NextRequest, NextResponse } from 'next/server';
import { reportsEngine } from '@/lib/reports-engine';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const { reportId } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user');
    const expires = searchParams.get('expires');
    const sig = searchParams.get('sig');

    if (!userId || !expires || !sig) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Missing required signature parameters (expires, user, sig).' },
        { status: 401 }
      );
    }

    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const report = reportsEngine.verifyAndRetrieveReport(reportId, userId, expires, sig, clientIp);

    return NextResponse.json({
      success: true,
      report,
      certifiedWatermark: 'DIAGNOSTIC CARE VERIFIED PATHOLOGY REPORT • ZERO LEAKAGE CERTIFIED',
      downloadedAt: new Date().toISOString(),
    }, { status: 200 });
  } catch (error: any) {
    let status = 400;
    if (error.message.includes('TOKEN_EXPIRED')) status = 410;
    if (error.message.includes('INVALID_SIGNATURE') || error.message.includes('UNAUTHORIZED')) status = 403;

    return NextResponse.json(
      { success: false, error: error.message },
      { status }
    );
  }
}
