import { NextRequest, NextResponse } from 'next/server';
import { searchEngine } from '@/lib/search-engine';

export async function GET() {
  try {
    const reviews = searchEngine.getReviews();
    return NextResponse.json({ success: true, count: reviews.length, reviews }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
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

    const result = searchEngine.submitReview({
      appointmentId,
      patientName: patientName || 'তানভীর আহমেদ',
      isAnonymous: Boolean(isAnonymous),
      doctorName,
      organizationName: organizationName || 'পপুলার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার)',
      rating: Number(rating),
      comment,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 403 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Review submission failed' },
      { status: 500 }
    );
  }
}
