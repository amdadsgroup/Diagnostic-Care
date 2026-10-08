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

    const supabase = createServerClient();
    const dbResults: SearchResult[] = [];

    try {
      if (type === 'ALL' || type === 'DOCTOR') {
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
      }

      if (type === 'ALL' || type === 'DIAGNOSTIC_CENTER') {
        const { data: centers } = await supabase
          .from('diagnostic_centers')
          .select('id, name, name_bn, description, description_bn, rating, total_reviews, verification_status, has_home_sample_collection')
          .eq('status', 'active');

        if (centers && centers.length > 0) {
          for (const c of centers) {
            dbResults.push({
              type: 'DIAGNOSTIC_CENTER',
              id: c.id,
              name: c.name_bn ? `${c.name_bn} (${c.name})` : c.name,
              subtitle: c.description_bn || c.description || 'Digital Pathology & Consultation',
              location: 'চৌমোহনা / কোর্ট রোড, মৌলভীবাজার সদর',
              districtName: 'Moulvibazar',
              rating: Number(c.rating) || 4.8,
              reviewCount: c.total_reviews || 0,
              verificationStatus: c.verification_status?.toUpperCase() === 'VERIFIED' ? 'VERIFIED' : 'PENDING',
              isSponsored: false,
              availableToday: true,
            });
          }
        }
      }

      if (type === 'ALL' || type === 'TEST') {
        const { data: tests } = await supabase
          .from('lab_tests')
          .select('id, name, name_bn, category, price, discount_price, is_home_sample_supported, diagnostic_centers(name, name_bn)')
          .eq('status', 'active');

        if (tests && tests.length > 0) {
          for (const t of tests) {
            const dc = (t as any).diagnostic_centers;
            dbResults.push({
              type: 'TEST',
              id: t.id,
              name: t.name_bn ? `${t.name} (${t.name_bn})` : t.name,
              subtitle: `${t.category} • টার্নঅ্যারাউন্ড: ৪ ঘণ্টা • হোম কালেকশন: ${t.is_home_sample_supported ? 'উপলব্ধ' : 'না'}`,
              location: dc?.name_bn || dc?.name || 'পপুলার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার সদর)',
              districtName: 'Moulvibazar',
              rating: 4.8,
              reviewCount: 25,
              price: Number(t.discount_price || t.price) || 500,
              verificationStatus: 'VERIFIED',
              isSponsored: false,
              availableToday: true,
            });
          }
        }
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

    return NextResponse.json({ success: true, count: finalResults.length, results: finalResults }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Search execution failed' },
      { status: 500 }
    );
  }
}
