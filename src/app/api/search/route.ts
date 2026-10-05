import { NextRequest, NextResponse } from 'next/server';
import { searchEngine } from '@/lib/search-engine';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || undefined;
    const type = (searchParams.get('type') as any) || 'ALL';
    const district = searchParams.get('district') || undefined;
    const availableToday = searchParams.get('availableToday') === 'true';
    const maxPriceStr = searchParams.get('maxPrice');
    const maxPrice = maxPriceStr ? parseInt(maxPriceStr, 10) : undefined;

    const results = searchEngine.search({
      query,
      type,
      district,
      availableToday,
      maxPrice,
    });

    return NextResponse.json({ success: true, count: results.length, results }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Search execution failed' },
      { status: 500 }
    );
  }
}
