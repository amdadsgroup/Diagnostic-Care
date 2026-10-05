import { NextRequest, NextResponse } from 'next/server';
import { searchEngine } from '@/lib/search-engine';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId') || 'org-pop-mb';

    const analytics = searchEngine.getProviderAnalytics(organizationId);

    return NextResponse.json({ success: true, analytics }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Analytics query failed' },
      { status: 500 }
    );
  }
}
