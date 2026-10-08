import { supabase } from '@/lib/supabase/client';
import { UserRole } from '@/types';

export interface AuthUserProfile {
  id: string;
  email?: string;
  phone?: string;
  fullName: string;
  fullNameBn?: string;
  avatarUrl?: string;
  languagePreference: 'en' | 'bn';
  primaryRole: UserRole;
  roles: UserRole[];
  patientId?: string;
  doctorId?: string;
}

export class AuthService {
  /**
   * Register a new user with email and password
   */
  static async signUp(params: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role?: UserRole;
    language?: 'en' | 'bn';
  }): Promise<{ user: any; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            full_name: params.fullName,
            phone: params.phone,
            role: params.role || 'PATIENT',
            language: params.language || 'en',
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      return { user: data.user, error: null };
    } catch (err: any) {
      return { user: null, error: err.message || 'Registration failed' };
    }
  }

  /**
   * Log in user with email & password
   */
  static async signIn(email: string, password: string): Promise<{ user: any; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      return { user: data.user, error: null };
    } catch (err: any) {
      return { user: null, error: err.message || 'Login failed' };
    }
  }

  /**
   * Log out active user
   */
  static async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error ? error.message : null };
    } catch (err: any) {
      return { error: err.message || 'Signout error' };
    }
  }

  /**
   * Send password reset email
   */
  static async resetPassword(email: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback?type=recovery`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Password reset request failed' };
    }
  }

  /**
   * Get currently active session and user
   */
  static async getCurrentUser(): Promise<AuthUserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Fetch profile & roles from database
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('role, is_primary')
        .eq('user_id', user.id);

      const roles = (rolesData || []).map((r) => r.role.toUpperCase() as UserRole);
      const primaryRole = roles[0] || (user.user_metadata?.role as UserRole) || 'PATIENT';

      // Check for associated patient or doctor ID
      let patientId: string | undefined;
      let doctorId: string | undefined;

      const { data: patient } = await supabase
        .from('patients')
        .select('id')
        .eq('profile_id', user.id)
        .maybeSingle();
      if (patient) patientId = patient.id;

      const { data: doctor } = await supabase
        .from('doctors')
        .select('id')
        .eq('profile_id', user.id)
        .maybeSingle();
      if (doctor) doctorId = doctor.id;

      return {
        id: user.id,
        email: user.email,
        phone: profile?.phone || user.user_metadata?.phone,
        fullName: profile?.full_name || user.user_metadata?.full_name || 'User',
        fullNameBn: profile?.full_name_bn,
        avatarUrl: profile?.avatar_url,
        languagePreference: (profile?.language_preference as 'en' | 'bn') || 'en',
        primaryRole,
        roles,
        patientId,
        doctorId,
      };
    } catch (err) {
      console.warn('Error fetching current user:', err);
      return null;
    }
  }

  /**
   * Subscribe to Supabase Auth state changes
   */
  static onAuthStateChange(callback: (user: AuthUserProfile | null) => void) {
    return supabase.auth.onAuthStateChange(async (_event, _session) => {
      const profile = await AuthService.getCurrentUser();
      callback(profile);
    });
  }
}
