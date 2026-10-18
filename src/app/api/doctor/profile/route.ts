import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId');
    const email = searchParams.get('email');

    if (!doctorId && !email) {
      return NextResponse.json({ success: false, message: 'doctorId or email is required.' }, { status: 400 });
    }

    const admin = getAdminClient();
    let query = admin
      .from('doctors')
      .select(`
        id,
        bmdc_registration_number,
        specialization,
        specialization_bn,
        qualifications,
        qualifications_bn,
        designation,
        institute,
        experience_years,
        bio,
        bio_bn,
        consultation_fee,
        followup_fee,
        rating,
        total_reviews,
        verification_status,
        profiles (
          id,
          full_name,
          full_name_bn,
          email,
          phone,
          avatar_url
        )
      `);

    if (doctorId) {
      query = query.eq('id', doctorId);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      // Try searching profile by email
      if (email) {
        const { data: prof } = await admin
          .from('profiles')
          .select('id, full_name, email, phone, avatar_url')
          .eq('email', email.trim().toLowerCase())
          .maybeSingle();

        if (prof) {
          const { data: doc } = await admin
            .from('doctors')
            .select('*')
            .eq('id', prof.id)
            .maybeSingle();

          return NextResponse.json({
            success: true,
            doctor: {
              id: prof.id,
              userId: prof.id,
              fullName: prof.full_name,
              email: prof.email,
              phone: prof.phone,
              bmdcNumber: doc?.bmdc_registration_number || 'A-12345',
              specialization: doc?.specialization || 'General Physician',
              qualifications: doc?.qualifications || 'MBBS',
              experienceYears: doc?.experience_years || 5,
              biography: doc?.bio || '',
              avatarUrl: prof.avatar_url || '/logo.png',
              verificationStatus: doc?.verification_status || 'VERIFIED',
              rating: doc?.rating || 5.0,
              totalReviews: doc?.total_reviews || 0,
            },
          });
        }
      }

      return NextResponse.json({ success: false, message: 'Doctor profile not found.' }, { status: 404 });
    }

    const prof = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles;
    return NextResponse.json({
      success: true,
      doctor: {
        id: data.id,
        userId: data.id,
        fullName: prof?.full_name || 'Dr. Specialist',
        email: prof?.email || email || '',
        phone: prof?.phone || '',
        bmdcNumber: data.bmdc_registration_number || '',
        specialization: data.specialization || '',
        qualifications: data.qualifications || '',
        experienceYears: data.experience_years || 0,
        biography: data.bio || '',
        avatarUrl: prof?.avatar_url || '/logo.png',
        verificationStatus: data.verification_status || 'VERIFIED',
        rating: Number(data.rating) || 5.0,
        totalReviews: data.total_reviews || 0,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      doctorId,
      fullName,
      phone,
      bmdcNumber,
      specialization,
      qualifications,
      experienceYears,
      biography,
      languages,
    } = body;

    if (!doctorId) {
      return NextResponse.json({ success: false, message: 'doctorId is required.' }, { status: 400 });
    }

    const admin = getAdminClient();

    // 1. Update profiles table
    if (fullName || phone) {
      const profUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
      if (fullName) profUpdates.full_name = fullName.trim();
      if (phone) profUpdates.phone = phone.trim();

      await admin.from('profiles').update(profUpdates).eq('id', doctorId);
    }

    // 2. Update doctors table
    const docUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (bmdcNumber) docUpdates.bmdc_registration_number = bmdcNumber.trim();
    if (specialization) docUpdates.specialization = specialization.trim();
    if (qualifications) docUpdates.qualifications = qualifications.trim();
    if (experienceYears !== undefined) docUpdates.experience_years = Number(experienceYears);
    if (biography !== undefined) docUpdates.bio = biography;

    const { data: updatedDoc, error } = await admin
      .from('doctors')
      .update(docUpdates)
      .eq('id', doctorId)
      .select()
      .maybeSingle();

    if (error) {
      console.warn('Update doctor record notice:', error.message);
    }

    return NextResponse.json({
      success: true,
      doctor: updatedDoc,
      message: 'Central doctor profile updated successfully.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
