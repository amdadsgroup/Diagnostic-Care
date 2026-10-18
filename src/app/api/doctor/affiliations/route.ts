import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId');
    const email = searchParams.get('email');

    const admin = getAdminClient();
    let affiliations: any[] = [];

    if (doctorId) {
      try {
        const { data, error } = await admin
          .from('hospital_doctor_associations')
          .select(`
            id,
            hospital_id,
            doctor_id,
            branch_id,
            department_id,
            status,
            consultation_fee,
            followup_fee,
            chamber_room,
            days_of_week,
            visiting_start_time,
            visiting_end_time,
            daily_serial_limit,
            hospitals:hospital_id (
              id,
              name,
              name_bn,
              phone,
              email
            ),
            branches:branch_id (
              id,
              branch_name,
              address_line
            ),
            departments:department_id (
              id,
              name
            )
          `)
          .eq('doctor_id', doctorId);

        if (!error && data) {
          affiliations = data;
        }
      } catch (e) {
        console.warn('Fetch affiliations error:', e);
      }
    }

    return NextResponse.json({
      success: true,
      affiliations,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
