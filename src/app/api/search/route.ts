import { NextRequest, NextResponse } from 'next/server';
import { searchEngine } from '@/lib/search-engine';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || undefined;
    const type = (searchParams.get('type') as any) || 'ALL';
    const district = searchParams.get('district') || undefined;
    const availableToday = searchParams.get('availableToday') === 'true';
    const maxPriceStr = searchParams.get('maxPrice');
    const maxPrice = maxPriceStr ? parseInt(maxPriceStr, 10) : undefined;

    // Log query in search_history table
    if (query && query.trim().length > 1) {
      try {
        const supabase = createServerClient();
        await supabase.from('search_history').insert({
          query_term: query.trim(),
          category_filter: type !== 'ALL' ? type : null,
          district_filter: district || null,
        });
      } catch (dbErr) {
        console.warn('Database search log notice:', dbErr);
      }
    }

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
