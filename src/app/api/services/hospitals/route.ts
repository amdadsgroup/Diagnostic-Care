import { NextRequest, NextResponse } from 'next/server';
import { servicesEngine } from '@/lib/services-engine';

export async function GET(req: NextRequest) {
  try {
    const hospitals = servicesEngine.getOrganizations('HOSPITAL');
    const enriched = hospitals.map((h) => ({
      ...h,
      hospitalDetails: servicesEngine.getHospitalDetails(h.id),
    }));

    return NextResponse.json({ success: true, count: enriched.length, hospitals: enriched }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch hospitals' },
      { status: 500 }
    );
  }
}
