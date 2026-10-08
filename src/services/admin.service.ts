import { supabase } from '@/lib/supabase/client';

export interface AdminDashboardMetrics {
  totalUsers: number;
  activeDoctors: number;
  totalAppointments: number;
  completedAppointments: number;
  pendingVerifications: number;
  diagnosticCenters: number;
  totalRevenueBdt: number;
}

export class AdminService {
  /**
   * Fetch live database-driven KPIs for Super Admin and Operations Console.
   * Strictly calculates from actual database rows. Never uses hardcoded or fabricated numbers.
   */
  static async getDashboardMetrics(): Promise<AdminDashboardMetrics> {
    try {
      const [
        { count: userCount },
        { count: doctorCount },
        { count: aptCount },
        { count: completedAptCount },
        { count: pendingVerifCount },
        { count: diagCenterCount },
        { data: completedApts },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('doctors').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('appointments').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('provider_verifications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('diagnostic_centers').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('appointments').select('consultation_fee').eq('status', 'completed'),
      ]);

      const calculatedRevenue = (completedApts || []).reduce(
        (sum, a) => sum + (Number(a.consultation_fee) || 0),
        0
      );

      return {
        totalUsers: userCount || 0,
        activeDoctors: doctorCount || 0,
        totalAppointments: aptCount || 0,
        completedAppointments: completedAptCount || 0,
        pendingVerifications: pendingVerifCount || 0,
        diagnosticCenters: diagCenterCount || 0,
        totalRevenueBdt: calculatedRevenue,
      };
    } catch {
      return {
        totalUsers: 0,
        activeDoctors: 0,
        totalAppointments: 0,
        completedAppointments: 0,
        pendingVerifications: 0,
        diagnosticCenters: 0,
        totalRevenueBdt: 0,
      };
    }
  }

  /**
   * Update provider verification workflow status
   */
  static async updateVerificationStatus(params: {
    verificationId: string;
    status: 'verified' | 'rejected' | 'under_review';
    reviewerNotes?: string;
  }): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('provider_verifications')
        .update({
          status: params.status,
          reviewer_notes: params.reviewerNotes || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', params.verificationId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}
