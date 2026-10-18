import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId');
    const hospitalId = searchParams.get('hospitalId');
    const date = searchParams.get('date');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    if (!doctorId) {
      return NextResponse.json({ success: false, message: 'doctorId is required.' }, { status: 400 });
    }

    const admin = getAdminClient();
    let query = admin
      .from('appointments')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('appointment_date', { ascending: false })
      .order('token_number', { ascending: true });

    if (hospitalId && hospitalId !== 'ALL') {
      query = query.eq('hospital_id', hospitalId);
    }
    if (date) {
      query = query.eq('appointment_date', date);
    }
    if (status && status !== 'ALL') {
      query = query.eq('status', status.toLowerCase());
    }

    const { data, error } = await query;
    if (error) {
      console.warn('Doctor appointments query warning:', error.message);
      return NextResponse.json({ success: true, appointments: [] });
    }

    let appointments = data || [];
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      appointments = appointments.filter(
        (a: any) =>
          (a.patient_name && a.patient_name.toLowerCase().includes(q)) ||
          (a.patient_phone && a.patient_phone.includes(q)) ||
          (a.booking_code && a.booking_code.toLowerCase().includes(q)) ||
          (a.serial_number && String(a.serial_number).includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      appointments,
      count: appointments.length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { appointmentId, status, notes, cancellationReason, actorId, actorRole } = body;

    if (!appointmentId || !status) {
      return NextResponse.json({ success: false, message: 'appointmentId and status are required.' }, { status: 400 });
    }

    const admin = getAdminClient();
    const updates: Record<string, any> = {
      status: status.toLowerCase(),
      updated_at: new Date().toISOString(),
    };

    if (notes) updates.notes = notes;
    if (cancellationReason) updates.cancellation_reason = cancellationReason;

    const { data: updatedApt, error } = await admin
      .from('appointments')
      .update(updates)
      .eq('id', appointmentId)
      .select()
      .maybeSingle();

    if (error) {
      console.warn('Update appointment status error:', error.message);
    }

    // Log booking audit event
    try {
      await admin.from('booking_audit_events').insert({
        appointment_id: appointmentId,
        booking_code: updatedApt?.booking_code || null,
        doctor_id: updatedApt?.doctor_id || null,
        patient_id: updatedApt?.patient_id || null,
        event_type: `STATUS_${status.toUpperCase()}`,
        actor_id: actorId || null,
        actor_role: actorRole || 'DOCTOR',
        details: { status, notes, cancellationReason, timestamp: new Date().toISOString() },
      });
    } catch (auditErr) {
      console.warn('Audit log warning:', auditErr);
    }

    return NextResponse.json({
      success: true,
      appointment: updatedApt || { id: appointmentId, status },
      message: `Appointment status updated to ${status}.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
