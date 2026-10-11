import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/services/subscription.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateFilter = (searchParams.get('dateFilter') as any) || 'all';

    const metrics = await SubscriptionService.getRevenueMetrics(dateFilter);
    return NextResponse.json({ success: true, metrics }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to calculate subscription revenue metrics' },
      { status: 500 }
    );
  }
}
