import { NextRequest, NextResponse } from 'next/server';
import { searchEngine } from '@/lib/search-engine';
import { createServerClient } from '@/lib/supabase/server';
import { SearchResult } from '@/types/extended';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || undefined;
    const type = (searchParams.get('type') as any) || 'ALL';
    const district = searchParams.get('district') || undefined;
    const availableToday = searchParams.get('availableToday') === 'true';
    const maxPriceStr = searchParams.get('maxPrice');
    const maxPrice = maxPriceStr ? parseInt(maxPriceStr, 10) : undefined;

    // Log query in search_history table asynchronously (non-blocking)
    if (query && query.trim().length > 1) {
      try {
        const supabase = createServerClient();
        supabase
          .from('search_history')
          .insert({
            query_term: query.trim(),
            category_filter: type !== 'ALL' ? type : null,
            district_filter: district || null,
          })
          .then(
            () => {},
            (dbErr) => {
              console.warn('Database search log notice:', dbErr);
            }
          );
      } catch (dbErr) {
        // non-blocking
      }
    }

    const supabase = createServerClient();
    const dbResults: SearchResult[] = [];

    try {
      const queryPromises: Promise<any>[] = [];

      if (type === 'ALL' || type === 'DOCTOR') {
        queryPromises.push(
          (async () => {
            try {
              const { data: doctors } = await supabase
                .from('doctors')
                .select('id, specialization, designation, institute, consultation_fee, rating, total_reviews, verification_status, profiles(full_name, full_name_bn)')
                .eq('status', 'active');

              if (doctors && doctors.length > 0) {
                for (const doc of doctors) {
                  const profile = (doc as any).profiles;
                  const name = profile?.full_name_bn
                    ? `${profile.full_name_bn} (${profile.full_name})`
                    : (profile?.full_name || 'Specialist Doctor');
                  dbResults.push({
                    type: 'DOCTOR',
                    id: doc.id,
                    name,
                    subtitle: `${doc.designation || 'Consultant'} • ${doc.institute || doc.specialization}`,
                    location: 'মৌলভীবাজার / সিলেট',
                    districtName: 'Moulvibazar',
                    rating: Number(doc.rating) || 4.8,
                    reviewCount: doc.total_reviews || 0,
                    price: Number(doc.consultation_fee) || 800,
                    verificationStatus: doc.verification_status?.toUpperCase() === 'VERIFIED' ? 'VERIFIED' : 'PENDING',
                    isSponsored: false,
                    availableToday: true,
                    nextSlot: 'আজ ৪:১৫ PM',
                  });
                }
              }
            } catch (e) {
              // silent fallback
            }
          })()
        );
      }

      if (queryPromises.length > 0) {
        await Promise.allSettled(queryPromises);
      }
    } catch (dbErr) {
      console.warn('Database live search query notice:', dbErr);
    }

    let finalResults = dbResults;
    if (finalResults.length === 0) {
      finalResults = searchEngine.search({
        query,
        type,
        district,
        availableToday,
        maxPrice,
      });
    } else {
      if (query && query.trim()) {
        const q = query.toLowerCase().trim();
        finalResults = finalResults.filter((r) =>
          r.name.toLowerCase().includes(q) ||
          r.subtitle.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q)
        );
      }
      if (district && district !== 'ALL') {
        finalResults = finalResults.filter(
          (r) => r.districtName.toLowerCase() === district.toLowerCase()
        );
      }
      if (maxPrice) {
        finalResults = finalResults.filter((r) => !r.price || r.price <= maxPrice);
      }
    }

    return NextResponse.json(
      { success: true, count: finalResults.length, results: finalResults },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Search execution failed' },
      { status: 500 }
    );
  }
}
