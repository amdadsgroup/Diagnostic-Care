import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invitationId, action, doctorId, doctorName, doctorEmail, hospitalId } = body;

    if (!invitationId || !['accept', 'decline'].includes(action)) {
      return NextResponse.json({ success: false, message: 'Invalid response parameters.' }, { status: 400 });
    }

    const admin = getAdminClient();
    const newStatus = action === 'accept' ? 'accepted' : 'declined';

    // 1. Update invitation status in DB if exists
    try {
      await admin
        .from('doctor_invitations')
        .update({
          status: newStatus,
          responded_at: new Date().toISOString(),
        })
        .eq('id', invitationId);
    } catch (e) {
      console.warn('Update doctor_invitations error:', e);
    }

    // 2. If accepted, create or activate hospital_doctor_associations record
    if (action === 'accept' && hospitalId && (doctorId || doctorEmail)) {
      try {
        await admin.from('hospital_doctor_associations').upsert({
          hospital_id: hospitalId,
          doctor_id: doctorId || `doc_${Date.now()}`,
          status: 'active',
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Upsert hospital_doctor_associations error:', e);
      }
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
      message:
        action === 'accept'
          ? 'Affiliation accepted. You can now switch to this institution and manage your chamber consultations.'
          : 'Affiliation invitation declined.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to process invitation response.' },
      { status: 500 }
    );
  }
}
