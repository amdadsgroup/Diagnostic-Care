import { NextRequest, NextResponse } from 'next/server';
import { servicesEngine } from '@/lib/services-engine';
import { createServerClient } from '@/lib/supabase/server';
import { VerificationStatus } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { organizationId, status, reviewerName, remarks } = body;

    if (!organizationId || !status) {
      return NextResponse.json(
        { success: false, error: 'organizationId and status are required.' },
        { status: 400 }
      );
    }

    const validStatuses: VerificationStatus[] = ['PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Persist to Supabase provider verifications & audit logs
    const supabase = createServerClient();
    try {
      await supabase.from('provider_verifications').insert({
        provider_type: 'diagnostic_center',
        provider_id: organizationId.length > 20 ? organizationId : 'a0000000-0000-0000-0000-000000000001',
        status: status.toLowerCase(),
        reviewer_notes: remarks || 'Manual verification audit review completed',
      });
    } catch (dbErr) {
      console.warn('Database verification audit notice:', dbErr);
    }

    const updated = servicesEngine.updateProviderVerification(organizationId, status);

    return NextResponse.json(
      {
        success: true,
        message: `Provider status successfully updated to ${status}.`,
        audit: {
          organizationId,
          status,
          reviewerName: reviewerName || 'Admin Operator',
          remarks: remarks || 'Manual verification audit review completed',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update verification status' },
      { status: 500 }
    );
  }
}
