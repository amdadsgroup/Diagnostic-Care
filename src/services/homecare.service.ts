import { supabase } from '@/lib/supabase/client';

export interface HomeCareBookingPayload {
  patientName: string;
  contactPhone: string;
  serviceAddress: string;
  serviceId?: string;
  serviceType: string;
  startDate: string;
  durationType: 'hourly' | 'per_visit' | 'daily_12h' | 'daily_24h';
  rate: number;
}

export class HomeCareService {
  /**
   * Book specialized in-home nursing or caregiving services directly in PostgreSQL
   */
  static async bookHomeCare(payload: HomeCareBookingPayload): Promise<{
    bookingCode: string;
    success: boolean;
    error: string | null;
  }> {
    const bookingCode = `HC-2026-${Math.floor(1000 + Math.random() * 8999)}`;

    try {
      const { error } = await supabase.from('home_healthcare_bookings').insert({
        booking_code: bookingCode,
        patient_name: payload.patientName,
        contact_phone: payload.contactPhone,
        service_address: payload.serviceAddress,
        start_date: payload.startDate,
        duration_type: payload.durationType,
        total_cost: payload.rate,
        status: 'confirmed',
      });

      if (error) {
        return { bookingCode: '', success: false, error: error.message };
      }

      return { bookingCode, success: true, error: null };
    } catch (err: any) {
      return { bookingCode: '', success: false, error: err.message || 'Booking failed' };
    }
  }

  /**
   * Fetch home care services catalog
   */
  static async getHomeCareServices() {
    try {
      const { data, error } = await supabase
        .from('home_healthcare_providers')
        .select('*')
        .eq('status', 'active');

      if (error || !data) return [];
      return data;
    } catch {
      return [];
    }
  }
}
