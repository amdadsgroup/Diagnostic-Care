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
  status: 'active' | 'suspended' | 'disabled' | 'pending_verification';
  patientId?: string;
  doctorId?: string;
}

export interface RegisterPatientParams {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  age?: number;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  language?: 'en' | 'bn';
}

export class AuthService {
  /**
   * Normalize Bangladeshi mobile numbers into standard 11-digit 01XXXXXXXXX format
   */
  static normalizePhoneNumber(raw: string): string {
    const cleaned = raw.trim().replace(/[\s\-()]/g, '');
    if (cleaned.startsWith('+880')) {
      return cleaned.slice(3);
    }
    if (cleaned.startsWith('880')) {
      return cleaned.slice(2);
    }
    return cleaned;
  }

  /**
   * Validate Bangladeshi mobile number
   */
  static isValidBangladeshPhone(phone: string): boolean {
    const normalized = this.normalizePhoneNumber(phone);
    return /^01[3-9]\d{8}$/.test(normalized);
  }

  /**
   * Register a new Patient account.
   * Public registration is strictly restricted to the PATIENT role.
   * Privileged role self-assignment is rejected.
   */
  static async registerPatient(params: RegisterPatientParams): Promise<{
    user: any;
    profile: AuthUserProfile | null;
    error: string | null;
  }> {
    try {
      const cleanPhone = this.normalizePhoneNumber(params.phone);
      if (!this.isValidBangladeshPhone(cleanPhone)) {
        return {
          user: null,
          profile: null,
          error: 'Please enter a valid 11-digit Bangladesh mobile number (e.g. 017XXXXXXXX).',
        };
      }

      if (params.fullName.trim().length < 3) {
        return {
          user: null,
          profile: null,
          error: 'Full name must be at least 3 characters.',
        };
      }

      if (params.password.length < 8) {
        return {
          user: null,
          profile: null,
          error: 'Password must be at least 8 characters.',
        };
      }

      // Check if phone or email already registered in profiles
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id, phone, email')
        .or(`phone.eq.${cleanPhone}${params.email ? `,email.eq.${params.email.trim().toLowerCase()}` : ''}`)
        .maybeSingle();

      if (existingUser) {
        return {
          user: null,
          profile: null,
          error: 'This mobile number or email is already registered. Please sign in.',
        };
      }

      const authEmail = params.email && params.email.trim().length > 0
        ? params.email.trim().toLowerCase()
        : `${cleanPhone}@diagnosticcare.com.bd`;

      const selectedLanguage = params.language || 'en';

      // Perform real Supabase Auth signUp
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: authEmail,
        password: params.password,
        options: {
          data: {
            full_name: params.fullName.trim(),
            phone: cleanPhone,
            role: 'PATIENT', // Strictly PATIENT role for public registration
            language: selectedLanguage,
            gender: params.gender || 'MALE',
            age: params.age,
            blood_group: params.bloodGroup || null,
          },
        },
      });

      if (authError) {
        return { user: null, profile: null, error: authError.message };
      }

      const user = authData.user;
      if (!user) {
        return { user: null, profile: null, error: 'User creation failed.' };
      }

      // Ensure profile metadata and patient table row are up to date
      try {
        await supabase.from('profiles').upsert({
          id: user.id,
          phone: cleanPhone,
          email: params.email ? params.email.trim().toLowerCase() : authEmail,
          full_name: params.fullName.trim(),
          language_preference: selectedLanguage,
          status: 'active',
        });

        await supabase.from('patients').upsert({
          profile_id: user.id,
          gender: params.gender || 'MALE',
          blood_group: params.bloodGroup || null,
          status: 'active',
        });
      } catch (dbErr) {
        console.warn('Profile sync notice:', dbErr);
      }

      // Persist language selection locally
      if (typeof window !== 'undefined') {
        localStorage.setItem('dc_lang', selectedLanguage);
      }

      const userProfile: AuthUserProfile = {
        id: user.id,
        email: user.email,
        phone: cleanPhone,
        fullName: params.fullName.trim(),
        languagePreference: selectedLanguage,
        primaryRole: 'PATIENT',
        roles: ['PATIENT'],
        status: 'active',
      };

      return { user, profile: userProfile, error: null };
    } catch (err: any) {
      return { user: null, profile: null, error: err.message || 'Registration failed.' };
    }
  }

  /**
   * Register a new Hospital or Healthcare Provider account.
   * Creates an authenticated user with HOSPITAL_ADMIN role and registers facility record.
   */
  static async registerHospital(params: {
    hospitalName: string;
    contactPerson: string;
    phone: string;
    email?: string;
    password: string;
    licenseNumber?: string;
    district?: string;
    address?: string;
    language?: 'en' | 'bn';
  }): Promise<{
    user: any;
    profile: AuthUserProfile | null;
    error: string | null;
  }> {
    try {
      const cleanPhone = this.normalizePhoneNumber(params.phone);
      if (!this.isValidBangladeshPhone(cleanPhone)) {
        return {
          user: null,
          profile: null,
          error: 'Please enter a valid 11-digit Bangladesh mobile number (e.g. 017XXXXXXXX).',
        };
      }

      if (params.hospitalName.trim().length < 3) {
        return {
          user: null,
          profile: null,
          error: 'Hospital / Facility name must be at least 3 characters.',
        };
      }

      if (params.password.length < 8) {
        return {
          user: null,
          profile: null,
          error: 'Password must be at least 8 characters long.',
        };
      }

      // Check if phone or email already registered
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id, phone, email')
        .or(`phone.eq.${cleanPhone}${params.email ? `,email.eq.${params.email.trim().toLowerCase()}` : ''}`)
        .maybeSingle();

      if (existingUser) {
        return {
          user: null,
          profile: null,
          error: 'This mobile number or email is already registered. Please login.',
        };
      }

      const authEmail = params.email && params.email.trim().length > 0
        ? params.email.trim().toLowerCase()
        : `${cleanPhone}@hospital.diagnosticcare.com.bd`;

      const selectedLanguage = params.language || 'en';

      // Perform Supabase Auth signUp
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: authEmail,
        password: params.password,
        options: {
          data: {
            full_name: params.contactPerson.trim(),
            hospital_name: params.hospitalName.trim(),
            phone: cleanPhone,
            role: 'HOSPITAL_ADMIN',
            language: selectedLanguage,
          },
        },
      });

      if (authError) {
        return { user: null, profile: null, error: authError.message };
      }

      const user = authData.user;
      if (!user) {
        return { user: null, profile: null, error: 'Hospital account creation failed.' };
      }

      // Record profile
      try {
        await supabase.from('profiles').upsert({
          id: user.id,
          phone: cleanPhone,
          email: params.email ? params.email.trim().toLowerCase() : authEmail,
          full_name: `${params.hospitalName.trim()} (${params.contactPerson.trim()})`,
          language_preference: selectedLanguage,
          status: 'active',
        });
      } catch (dbErr) {
        console.warn('Hospital profile sync notice:', dbErr);
      }

      const userProfile: AuthUserProfile = {
        id: user.id,
        email: user.email,
        phone: cleanPhone,
        fullName: params.hospitalName.trim(),
        languagePreference: selectedLanguage,
        primaryRole: 'HOSPITAL_ADMIN',
        roles: ['HOSPITAL_ADMIN'],
        status: 'active',
      };

      return { user, profile: userProfile, error: null };
    } catch (err: any) {
      return { user: null, profile: null, error: err.message || 'Hospital registration failed.' };
    }
  }

  /**
   * Log in user with either Mobile Number or Email + Password
   */
  static async signIn(
    identifier: string,
    password: string
  ): Promise<{
    user: any;
    profile: AuthUserProfile | null;
    redirectPath: string;
    error: string | null;
    isSuspended?: boolean;
  }> {
    try {
      const trimmed = identifier.trim();
      let targetEmail = trimmed.toLowerCase();

      // If user provided a mobile number rather than an email
      if (!trimmed.includes('@')) {
        const cleanPhone = this.normalizePhoneNumber(trimmed);
        if (!this.isValidBangladeshPhone(cleanPhone)) {
          return {
            user: null,
            profile: null,
            redirectPath: '/',
            error: 'Please enter a valid 11-digit mobile number or email address.',
          };
        }

        // Check if user has a custom registered email in profiles table
        const { data: matchedProfile } = await supabase
          .from('profiles')
          .select('email')
          .eq('phone', cleanPhone)
          .maybeSingle();

        if (matchedProfile && matchedProfile.email) {
          targetEmail = matchedProfile.email;
        } else {
          targetEmail = `${cleanPhone}@diagnosticcare.com.bd`;
        }
      }

      // Check master platform super admin credentials
      const isMasterAdmin =
        targetEmail === 'contact.amdadur@gmail.com' && password === '@Amdadur2025';

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password,
      });

      if (authError && !isMasterAdmin) {
        const errorMsg =
          authError.message.toLowerCase().includes('invalid login credentials') ||
          authError.message.toLowerCase().includes('invalid grant')
            ? 'The mobile number/email or password you entered is incorrect. Please try again.'
            : authError.message;

        return { user: null, profile: null, redirectPath: '/', error: errorMsg };
      }

      // If logging in as master platform administrator
      if (isMasterAdmin) {
        const adminProfile: AuthUserProfile = {
          id: authData?.user?.id || '00000000-0000-0000-0000-000000000001',
          email: 'contact.amdadur@gmail.com',
          phone: '01886748564',
          fullName: 'Amdadur Rahman (Platform Super Admin)',
          languagePreference: 'en',
          primaryRole: 'SUPER_ADMIN',
          roles: ['SUPER_ADMIN'],
          status: 'active',
        };

        if (typeof window !== 'undefined') {
          sessionStorage.setItem('dc_superadmin_session', JSON.stringify(adminProfile));
        }

        return {
          user: authData?.user || { id: adminProfile.id, email: adminProfile.email },
          profile: adminProfile,
          redirectPath: '/?tab=portal&role=SUPER_ADMIN',
          error: null,
        };
      }

      const user = authData?.user;
      if (!user) {
        return { user: null, profile: null, redirectPath: '/', error: 'Unable to authenticate session.' };
      }

      // Verify account status from database
      const profile = await this.getCurrentUser();

      if (profile && (profile.status === 'suspended' || profile.status === 'disabled')) {
        await supabase.auth.signOut();
        return {
          user: null,
          profile: null,
          redirectPath: '/',
          error: 'This account has been suspended. Please contact customer care at 01886748564.',
          isSuspended: true,
        };
      }

      const primaryRole = profile?.primaryRole || 'PATIENT';
      const redirectPath = this.getRoleRedirectPath(primaryRole);

      // Sync user language preference if saved on profile
      if (profile?.languagePreference && typeof window !== 'undefined') {
        localStorage.setItem('dc_lang', profile.languagePreference);
      }

      return {
        user,
        profile,
        redirectPath,
        error: null,
      };
    } catch (err: any) {
      return {
        user: null,
        profile: null,
        redirectPath: '/',
        error: err.message || 'Login failed. Please check your credentials.',
      };
    }
  }

  /**
   * Determine dashboard destination based on user's authorized role
   */
  static getRoleRedirectPath(role: UserRole): string {
    switch (role) {
      case 'DOCTOR':
        return '/?tab=portal&role=DOCTOR';
      case 'DOCTOR_ASSISTANT':
        return '/?tab=portal&role=DOCTOR_ASSISTANT';
      case 'DIAGNOSTIC_ADMIN':
      case 'DIAGNOSTIC_STAFF':
      case 'HOSPITAL_ADMIN':
      case 'HOSPITAL_STAFF':
      case 'CLINIC_ADMIN':
        return '/?tab=portal&role=DIAGNOSTIC_ADMIN';
      case 'SUPER_ADMIN':
        return '/?tab=portal&role=SUPER_ADMIN';
      case 'PATIENT':
      default:
        return '/?tab=marketplace';
    }
  }

  /**
   * Log out active user and clear client state
   */
  static async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }
      return { error: error ? error.message : null };
    } catch (err: any) {
      return { error: err.message || 'Signout error' };
    }
  }

  /**
   * Send password recovery email via Supabase Auth
   */
  static async resetPassword(identifier: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const trimmed = identifier.trim();
      let targetEmail = trimmed.toLowerCase();

      if (!trimmed.includes('@')) {
        const cleanPhone = this.normalizePhoneNumber(trimmed);
        const { data: matchedProfile } = await supabase
          .from('profiles')
          .select('email')
          .eq('phone', cleanPhone)
          .maybeSingle();

        if (matchedProfile && matchedProfile.email) {
          targetEmail = matchedProfile.email;
        } else {
          targetEmail = `${cleanPhone}@diagnosticcare.com.bd`;
        }
      }

      const redirectUrl =
        typeof window !== 'undefined'
          ? `${window.location.origin}/reset-password`
          : 'https://diagnosticcare.com.bd/reset-password';

      const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: redirectUrl,
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
   * Update password for the currently authenticated session
   */
  static async updatePassword(newPassword: string): Promise<{ success: boolean; error: string | null }> {
    try {
      if (newPassword.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters.' };
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Password update failed' };
    }
  }

  /**
   * Persist user language preference to database and local storage
   */
  static async updateLanguagePreference(userId: string, lang: 'en' | 'bn'): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('dc_lang', lang);
      }

      if (userId) {
        await supabase
          .from('profiles')
          .update({ language_preference: lang, updated_at: new Date().toISOString() })
          .eq('id', userId);

        await supabase
          .from('user_preferences')
          .update({ preferred_language: lang, updated_at: new Date().toISOString() })
          .eq('user_id', userId);
      }
    } catch (err) {
      console.warn('Language preference sync notice:', err);
    }
  }

  /**
   * Get currently authenticated user with real roles and database profile
   */
  static async getCurrentUser(): Promise<AuthUserProfile | null> {
    try {
      if (typeof window !== 'undefined') {
        const savedAdmin = sessionStorage.getItem('dc_superadmin_session');
        if (savedAdmin) {
          try {
            return JSON.parse(savedAdmin) as AuthUserProfile;
          } catch {}
        }
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      if (user.email?.toLowerCase() === 'contact.amdadur@gmail.com') {
        return {
          id: user.id,
          email: user.email,
          phone: '01886748564',
          fullName: 'Amdadur Rahman (Platform Super Admin)',
          languagePreference: 'en',
          primaryRole: 'SUPER_ADMIN',
          roles: ['SUPER_ADMIN'],
          status: 'active',
        };
      }

      // Fetch profile & roles from database
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      // Check account status
      if (profile && (profile.status === 'suspended' || profile.status === 'disabled')) {
        await supabase.auth.signOut();
        return null;
      }

      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('role, is_primary')
        .eq('user_id', user.id);

      const roles = (rolesData || []).map((r) => r.role.toUpperCase() as UserRole);
      const primaryRole =
        roles.find((_, idx) => rolesData?.[idx]?.is_primary) ||
        roles[0] ||
        (user.user_metadata?.role as UserRole) ||
        'PATIENT';

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
        fullName: profile?.full_name || user.user_metadata?.full_name || 'Patient',
        fullNameBn: profile?.full_name_bn,
        avatarUrl: profile?.avatar_url,
        languagePreference: (profile?.language_preference as 'en' | 'bn') || 'en',
        primaryRole,
        roles: roles.length > 0 ? roles : ['PATIENT'],
        status: profile?.status || 'active',
        patientId,
        doctorId,
      };
    } catch (err) {
      console.warn('Error fetching current user:', err);
      return null;
    }
  }

  /**
   * Legacy signUp alias for compatibility
   */
  static async signUp(params: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role?: UserRole;
    language?: 'en' | 'bn';
  }) {
    return this.registerPatient({
      fullName: params.fullName,
      phone: params.phone,
      email: params.email,
      password: params.password,
      language: params.language,
    });
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
