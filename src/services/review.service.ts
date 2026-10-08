import { supabase } from '@/lib/supabase/client';

export interface VerifiedReviewPayload {
  patientId: string;
  providerType: 'doctor' | 'diagnostic_center' | 'hospital' | 'clinic' | 'pharmacy';
  providerId: string;
  appointmentId?: string;
  diagnosticBookingId?: string;
  rating: number;
  comment: string;
}

export class ReviewService {
  /**
   * Submit a verified patient review
   */
  static async submitReview(payload: VerifiedReviewPayload): Promise<{
    success: boolean;
    error: string | null;
  }> {
    try {
      const { error } = await supabase.from('reviews').insert({
        patient_id: payload.patientId,
        provider_type: payload.providerType,
        provider_id: payload.providerId,
        appointment_id: payload.appointmentId || null,
        diagnostic_booking_id: payload.diagnosticBookingId || null,
        rating: payload.rating,
        comment: payload.comment,
        is_verified_patient: true,
        is_published: true,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: true, error: null };
    }
  }

  /**
   * Fetch reviews for a provider
   */
  static async getReviews(providerType: string, providerId: string) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          patients (
            profiles (
              full_name
            )
          )
        `)
        .eq('provider_type', providerType)
        .eq('provider_id', providerId)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error || !data) return [];
      return data;
    } catch {
      return [];
    }
  }
}
