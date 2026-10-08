import { NextRequest, NextResponse } from 'next/server';
import { searchEngine } from '@/lib/search-engine';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data: dbReviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (dbReviews && dbReviews.length > 0) {
      return NextResponse.json({ success: true, count: dbReviews.length, reviews: dbReviews }, { status: 200 });
    }

    const reviews = searchEngine.getReviews();
    return NextResponse.json({ success: true, count: reviews.length, reviews }, { status: 200 });
  } catch (error: any) {
    const reviews = searchEngine.getReviews();
    return NextResponse.json({ success: true, count: reviews.length, reviews }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { appointmentId, patientName, isAnonymous, doctorName, organizationName, rating, comment } = body;

    if (!appointmentId || !rating) {
      return NextResponse.json(
        { success: false, error: 'appointmentId and rating are required.' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    try {
      await supabase.from('reviews').insert({
        rating: Number(rating),
        comment: comment || '',
        provider_type: 'doctor',
        provider_id: 'a0000000-0000-0000-0000-000000000001',
        is_verified_patient: true,
        is_published: true,
      });
    } catch (dbErr) {
      console.warn('Database review insert notice:', dbErr);
    }

    const result = searchEngine.submitReview({
      appointmentId,
      patientName: patientName || 'তানভীর আহমেদ',
      isAnonymous: Boolean(isAnonymous),
      doctorName,
      organizationName: organizationName || 'পপুলার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার)',
      rating: Number(rating),
      comment,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Review submission failed' },
      { status: 500 }
    );
  }
}
