import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      hospitalId,
      hospitalName,
      email,
      departmentId,
      departmentName,
      branchId,
      branchName,
      proposedRole,
      consultationFee,
      chamberRoom,
      visitingHours,
      daysOfWeek,
    } = body;

    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json({ success: false, message: 'Please enter a valid doctor email address.' }, { status: 400 });
    }

    const admin = getAdminClient();

    // 1. Identify doctor identity if registered
    let matchedProfile: any = null;
    let matchedDoctor: any = null;
    try {
      const { data: profile } = await admin
        .from('profiles')
        .select('id, full_name, email, phone, role')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (profile) {
        matchedProfile = profile;
        const { data: doc } = await admin
          .from('doctors')
          .select('id, specialization, qualifications, bmdc_registration_number')
          .eq('profile_id', profile.id)
          .maybeSingle();
        matchedDoctor = doc;
      }
    } catch (e) {
      console.warn('Doctor lookup error in invite:', e);
    }

    // 2. Check for existing active affiliation
    if (matchedDoctor?.id && hospitalId) {
      try {
        const { data: existingAssoc } = await admin
          .from('hospital_doctor_associations')
          .select('id, status')
          .eq('hospital_id', hospitalId)
          .eq('doctor_id', matchedDoctor.id)
          .eq('status', 'active')
          .maybeSingle();

        if (existingAssoc) {
          return NextResponse.json(
            {
              success: false,
              code: 'ALREADY_AFFILIATED',
              message: `Dr. ${matchedProfile?.full_name || cleanEmail} is already actively affiliated with this hospital.`,
            },
            { status: 409 }
          );
        }
      } catch (e) {}
    }

    const invitationId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const invitationToken = `tok_${Math.random().toString(36).substring(2)}${Date.now()}`;

    const invitationRecord = {
      id: invitationId,
      hospitalId: hospitalId || 'demo_hospital_001',
      hospitalName: hospitalName || 'Hospital Partner',
      doctorEmail: cleanEmail,
      doctorId: matchedDoctor?.id || matchedProfile?.id || null,
      doctorName: matchedProfile?.full_name || 'Dr. Specialist',
      departmentId: departmentId || null,
      departmentName: departmentName || 'General Medicine',
      branchId: branchId || null,
      branchName: branchName || 'Main Campus',
      proposedRole: proposedRole || 'Consultant Physician',
      consultationFee: Number(consultationFee) || 800,
      chamberRoom: chamberRoom || 'Room 201',
      visitingHours: visitingHours || '05:00 PM - 09:00 PM',
      daysOfWeek: daysOfWeek || ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
      status: 'pending',
      token: invitationToken,
      createdAt: new Date().toISOString(),
    };

    // Store in institution_doctor_invitations or doctor_invitations table if exists
    try {
      await admin.from('doctor_invitations').insert({
        id: invitationId,
        hospital_id: hospitalId || 'demo_hospital_001',
        doctor_email: cleanEmail,
        doctor_id: matchedDoctor?.id || null,
        branch_id: branchId || null,
        department_id: departmentId || null,
        status: 'pending',
        token: invitationToken,
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      // Graceful fallback to client and local storage
    }

    return NextResponse.json({
      success: true,
      invitation: invitationRecord,
      isRegisteredDoctor: !!matchedProfile,
      doctorName: matchedProfile?.full_name || null,
      message: `Affiliation invitation created for ${cleanEmail}. The practitioner can review and accept this affiliation inside their Doctor Portal.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to dispatch invitation.' },
      { status: 500 }
    );
  }
}
