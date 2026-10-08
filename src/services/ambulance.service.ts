import { supabase } from '@/lib/supabase/client';

export interface AmbulanceRequestPayload {
  contactName: string;
  contactPhone: string;
  pickupAddress: string;
  destinationAddress: string;
  ambulanceType: 'ac' | 'non_ac' | 'icu' | 'freezer';
  isEmergency: boolean;
  district?: string;
}

export class AmbulanceService {
  /**
   * Submit 24/7 emergency ambulance dispatch request to database
   */
  static async requestAmbulance(payload: AmbulanceRequestPayload): Promise<{
    requestCode: string;
    estimatedFare: number;
    success: boolean;
    error: string | null;
  }> {
    const requestCode = `AMB-2026-${Math.floor(1000 + Math.random() * 8999)}`;
    const fareMap = { ac: 1500, non_ac: 1000, icu: 4500, freezer: 3500 };
    const estimatedFare = fareMap[payload.ambulanceType] || 1500;

    try {
      const { error } = await supabase.from('ambulance_requests').insert({
        request_code: requestCode,
        contact_name: payload.contactName,
        contact_phone: payload.contactPhone,
        pickup_address: payload.pickupAddress,
        destination_address: payload.destinationAddress,
        ambulance_type: payload.ambulanceType,
        is_emergency: payload.isEmergency,
        estimated_fare: estimatedFare,
        status: 'requested',
      });

      if (error) {
        return { requestCode: '', estimatedFare: 0, success: false, error: error.message };
      }

      return { requestCode, estimatedFare, success: true, error: null };
    } catch (err: any) {
      return { requestCode: '', estimatedFare: 0, success: false, error: err.message || 'Dispatch request failed' };
    }
  }

  /**
   * Fetch active ambulance fleet from database
   */
  static async getAmbulanceFleet(district?: string) {
    try {
      let query = supabase.from('ambulance_providers').select('*').eq('status', 'active');
      if (district) {
        query = query.ilike('district_name', `%${district}%`);
      }
      const { data, error } = await query;
      if (error || !data) return [];
      return data;
    } catch {
      return [];
    }
  }

  /**
   * Subscribe to ambulance dispatch status updates in Realtime
   */
  static subscribeToStatus(requestCode: string, onUpdate: (status: string) => void) {
    const channel = supabase
      .channel(`ambulance:${requestCode}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ambulance_requests',
          filter: `request_code=eq.${requestCode}`,
        },
        (payload: any) => {
          if (payload.new?.status) {
            onUpdate(payload.new.status);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}
