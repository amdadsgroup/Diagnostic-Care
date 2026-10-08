import { supabase } from '@/lib/supabase/client';
import { Doctor, DoctorAssociation } from '@/types';
import { INITIAL_DOCTORS, INITIAL_DOCTOR_ASSOCIATIONS } from '@/lib/mock-data';

export class DoctorService {
  /**
   * Fetch doctors with optional specialty and search filters
   */
  static async getDoctors(params?: {
    specialty?: string;
    searchQuery?: string;
    limit?: number;
    offset?: number;
  }): Promise<Doctor[]> {
    try {
      let query = supabase
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
            full_name,
            full_name_bn,
            avatar_url,
            phone
          )
        `)
        .eq('status', 'active');

      if (params?.specialty && params.specialty !== 'ALL') {
        query = query.ilike('specialization', `%${params.specialty}%`);
      }

      if (params?.searchQuery && params.searchQuery.trim().length > 0) {
        query = query.or(`specialization.ilike.%${params.searchQuery}%,profiles.full_name.ilike.%${params.searchQuery}%`);
      }

      query = query.order('rating', { ascending: false }).limit(params?.limit || 20);

      const { data, error } = await query;

      if (error || !data || data.length === 0) {
        // Return seeded fallback doctors if table is yet unpopulated
        return INITIAL_DOCTORS;
      }

      return data.map((d: any) => ({
        id: d.id,
        userId: d.id,
        fullName: d.profiles?.full_name || 'Dr. Specialist',
        bmdcNumber: d.bmdc_registration_number || 'A-12345',
        title: d.designation || 'Specialist Consultant',
        specialization: d.specialization,
        qualifications: d.qualifications,
        experienceYears: d.experience_years || 5,
        biography: d.bio,
        avatarUrl: d.profiles?.avatar_url || '/logo.png',
        verificationStatus: 'VERIFIED' as const,
        rating: Number(d.rating) || 5.0,
        reviewCount: d.total_reviews || 0,
        languages: ['Bangla', 'English'],
      }));
    } catch {
      return INITIAL_DOCTORS;
    }
  }

  /**
   * Fetch doctor associations (Chambers/Branches where the doctor sits)
   */
  static async getDoctorAssociations(): Promise<DoctorAssociation[]> {
    try {
      const { data, error } = await supabase
        .from('doctor_schedules')
        .select(`
          id,
          doctor_id,
          provider_type,
          provider_id,
          branch_id,
          day_of_week,
          start_time,
          end_time,
          consultation_fee,
          doctors (
            id,
            specialization,
            qualifications,
            experience_years,
            profiles (
              full_name,
              avatar_url
            )
          ),
          provider_locations (
            branch_name,
            address_line
          )
        `)
        .eq('is_active', true);

      if (error || !data || data.length === 0) {
        return INITIAL_DOCTOR_ASSOCIATIONS;
      }

      return data.map((s: any) => ({
        id: s.id,
        doctorId: s.doctor_id,
        organizationId: s.provider_id,
        organizationName: 'Diagnostic Care Partner',
        branchId: s.branch_id || 'branch-default',
        branchName: s.provider_locations?.branch_name || 'Main Branch',
        districtName: 'Moulvibazar',
        upazilaName: 'Moulvibazar Sadar',
        chamberRoomNumber: 'Room 204',
        consultationFee: Number(s.consultation_fee) || 800,
        followupFee: 500,
        followupValidityDays: 14,
        commissionRatePercent: 10,
        isActive: true,
        doctor: {
          id: s.doctor_id,
          userId: s.doctor_id,
          bmdcNumber: 'BMDC-REG',
          fullName: s.doctors?.profiles?.full_name || 'Specialist Doctor',
          title: 'Consultant Physician',
          specialization: s.doctors?.specialization || 'Consultant',
          qualifications: s.doctors?.qualifications || 'MBBS, FCPS',
          experienceYears: s.doctors?.experience_years || 10,
          biography: 'Experienced specialist practitioner',
          avatarUrl: s.doctors?.profiles?.avatar_url || '/logo.png',
          verificationStatus: 'VERIFIED' as const,
          rating: 4.9,
          reviewCount: 50,
          languages: ['Bangla', 'English'],
        },
      }));
    } catch {
      return INITIAL_DOCTOR_ASSOCIATIONS;
    }
  }
}
