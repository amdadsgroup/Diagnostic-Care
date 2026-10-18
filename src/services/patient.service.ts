import { supabase } from '@/lib/supabase/client';
import { StorageService } from './storage.service';
import { Doctor, Organization } from '@/types';

export interface CustomerFullProfile {
  id: string;
  fullName: string;
  fullNameBn?: string;
  displayName?: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  bloodGroup?: string;
  division?: string;
  district?: string;
  city?: string;
  areaLocality?: string;
  address?: string;
  languagePreference: 'en' | 'bn';
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  patientId: string;
  createdAt: string;
}

export interface FamilyMemberRecord {
  id: string;
  patientId: string;
  fullName: string;
  relationship: string;
  phone?: string;
  dateOfBirth?: string;
  age?: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
}

export interface MedicalProfileData {
  patientId: string;
  bloodGroup?: string;
  allergies: string[];
  currentMedications: string[];
  chronicConditions: string[];
  pastSurgeries: string[];
  familyMedicalHistory?: string;
  heightCm?: number;
  weightKg?: number;
  systolicBp?: number;
  diastolicBp?: number;
}

export interface MedicalRecordItem {
  id: string;
  patientId: string;
  recordType: 'lab_report' | 'prescription' | 'xray' | 'mri' | 'discharge_summary';
  title: string;
  fileName: string;
  documentUrl: string;
  fileSizeBytes?: number;
  recordDate: string;
  issuingOrganization?: string;
  doctorName?: string;
}

export interface SavedProviderItem {
  id: string;
  profileId: string;
  entityType: 'doctor' | 'diagnostic_center' | 'hospital';
  entityId: string;
  createdAt: string;
  doctor?: Doctor;
  organization?: Organization;
}

export interface CustomerPreferences {
  theme: string;
  smsNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundAlerts: boolean;
  preferredLanguage: 'en' | 'bn';
}

export interface CustomerPrivacySettings {
  shareMedicalHistoryWithDoctors: boolean;
  allowEmergencyAccess: boolean;
  profileDiscoverable: boolean;
}

export class PatientService {
  /**
   * Fetch full consolidated customer profile from Supabase
   */
  static async getCustomerFullProfile(userId: string): Promise<CustomerFullProfile | null> {
    try {
      // 1. Fetch profile record
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileErr) {
        console.warn('Profile fetch note:', profileErr.message);
      }

      // 2. Fetch patient record
      let { data: patient } = await supabase
        .from('patients')
        .select('*')
        .eq('profile_id', userId)
        .maybeSingle();

      // If patient row does not exist yet, initialize it
      if (!patient && userId) {
        const { data: newPatient } = await supabase
          .from('patients')
          .insert({ profile_id: userId, status: 'active' })
          .select()
          .maybeSingle();
        patient = newPatient;
      }

      // 3. Fetch default address
      const { data: address } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .limit(1)
        .maybeSingle();

      // 4. Fetch emergency contact
      const { data: emergency } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', userId)
        .order('is_primary', { ascending: false })
        .limit(1)
        .maybeSingle();

      const patientId = patient?.id || userId;

      return {
        id: userId,
        fullName: profile?.full_name || 'Valued Patient',
        fullNameBn: profile?.full_name_bn,
        displayName: profile?.full_name ? profile.full_name.split(' ')[0] : 'Patient',
        email: profile?.email || '',
        phone: profile?.phone || '',
        avatarUrl: profile?.avatar_url,
        dateOfBirth: patient?.date_of_birth,
        gender: patient?.gender || 'PREFER_NOT_TO_SAY',
        bloodGroup: patient?.blood_group,
        division: address?.division_id || 'Sylhet',
        district: address?.district_id || 'Moulvibazar',
        city: address?.address_line_2 || 'Moulvibazar Sadar',
        areaLocality: address?.address_line_2 || '',
        address: address?.address_line_1 || '',
        languagePreference: profile?.language_preference || 'en',
        isPhoneVerified: !!profile?.is_phone_verified,
        isEmailVerified: !!profile?.is_email_verified,
        emergencyContactName: emergency?.contact_name,
        emergencyContactPhone: emergency?.phone,
        emergencyContactRelation: emergency?.relationship,
        patientId,
        createdAt: profile?.created_at || new Date().toISOString(),
      };
    } catch (err) {
      console.error('Error in getCustomerFullProfile:', err);
      return null;
    }
  }

  /**
   * Update personal profile information
   */
  static async updateCustomerProfile(
    userId: string,
    updates: Partial<CustomerFullProfile>
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      // 1. Update profiles table
      const profileUpdates: any = { updated_at: new Date().toISOString() };
      if (updates.fullName !== undefined) profileUpdates.full_name = updates.fullName;
      if (updates.fullNameBn !== undefined) profileUpdates.full_name_bn = updates.fullNameBn;
      if (updates.languagePreference !== undefined)
        profileUpdates.language_preference = updates.languagePreference;

      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', userId);

      if (profileError) {
        return { success: false, error: profileError.message };
      }

      // 2. Update patients table
      const patientUpdates: any = { updated_at: new Date().toISOString() };
      if (updates.bloodGroup !== undefined) patientUpdates.blood_group = updates.bloodGroup;
      if (updates.dateOfBirth !== undefined) patientUpdates.date_of_birth = updates.dateOfBirth;
      if (updates.gender !== undefined) patientUpdates.gender = updates.gender;
      if (updates.emergencyContactPhone !== undefined)
        patientUpdates.emergency_contact_phone = updates.emergencyContactPhone;

      await supabase
        .from('patients')
        .upsert({ profile_id: userId, ...patientUpdates }, { onConflict: 'profile_id' });

      // 3. Update address if provided
      if (updates.address !== undefined || updates.district !== undefined) {
        const { data: existingAddress } = await supabase
          .from('addresses')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();

        if (existingAddress) {
          await supabase
            .from('addresses')
            .update({
              address_line_1: updates.address || '',
              address_line_2: updates.areaLocality || updates.city || '',
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingAddress.id);
        } else if (updates.address) {
          await supabase.from('addresses').insert({
            user_id: userId,
            address_line_1: updates.address,
            address_line_2: updates.areaLocality || updates.city || '',
            is_default: true,
          });
        }
      }

      // 4. Update emergency contact if provided
      if (updates.emergencyContactName && updates.emergencyContactPhone) {
        const { data: existingEmergency } = await supabase
          .from('emergency_contacts')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();

        if (existingEmergency) {
          await supabase
            .from('emergency_contacts')
            .update({
              contact_name: updates.emergencyContactName,
              phone: updates.emergencyContactPhone,
              relationship: updates.emergencyContactRelation || 'Family',
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingEmergency.id);
        } else {
          await supabase.from('emergency_contacts').insert({
            user_id: userId,
            contact_name: updates.emergencyContactName,
            phone: updates.emergencyContactPhone,
            relationship: updates.emergencyContactRelation || 'Family',
            is_primary: true,
          });
        }
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Profile update failed' };
    }
  }

  /**
   * Upload user avatar to 'avatars' storage bucket
   */
  static async uploadAvatar(
    userId: string,
    file: File
  ): Promise<{ avatarUrl: string | null; error: string | null }> {
    try {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return { avatarUrl: null, error: 'Avatar file size must be less than 5MB.' };
      }

      // Validate mime type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return { avatarUrl: null, error: 'Only JPG, PNG, and WebP images are supported.' };
      }

      const fileExt = file.name.split('.').pop() || 'png';
      const filePath = `user_${userId}/avatar_${Date.now()}.${fileExt}`;

      const { path, error: uploadErr } = await StorageService.uploadFile('avatars', filePath, file);
      if (uploadErr || !path) {
        return { avatarUrl: null, error: uploadErr || 'Failed to upload image.' };
      }

      const publicUrl = StorageService.getPublicUrl('avatars', path);

      // Save url to profile record
      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', userId);

      return { avatarUrl: publicUrl, error: null };
    } catch (err: any) {
      return { avatarUrl: null, error: err.message || 'Avatar upload error' };
    }
  }

  /**
   * Remove avatar
   */
  static async removeAvatar(userId: string): Promise<boolean> {
    try {
      await supabase
        .from('profiles')
        .update({ avatar_url: null, updated_at: new Date().toISOString() })
        .eq('id', userId);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Family Members management
   */
  static async getFamilyMembers(patientId: string): Promise<FamilyMemberRecord[]> {
    try {
      const { data, error } = await supabase
        .from('patient_family_members')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((d: any) => ({
        id: d.id,
        patientId: d.patient_id,
        fullName: d.full_name,
        relationship: d.relationship,
        phone: d.phone,
        dateOfBirth: d.date_of_birth,
        age: d.age,
        gender: d.gender,
        bloodGroup: d.blood_group,
      }));
    } catch {
      return [];
    }
  }

  static async addFamilyMember(
    patientId: string,
    member: Omit<FamilyMemberRecord, 'id' | 'patientId'>
  ): Promise<{ member: FamilyMemberRecord | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('patient_family_members')
        .insert({
          patient_id: patientId,
          full_name: member.fullName,
          relationship: member.relationship,
          phone: member.phone || null,
          age: member.age || null,
          gender: member.gender,
          blood_group: member.bloodGroup || null,
        })
        .select()
        .single();

      if (error) {
        return { member: null, error: error.message };
      }

      return {
        member: {
          id: data.id,
          patientId: data.patient_id,
          fullName: data.full_name,
          relationship: data.relationship,
          phone: data.phone,
          age: data.age,
          gender: data.gender,
          bloodGroup: data.blood_group,
        },
        error: null,
      };
    } catch (err: any) {
      return { member: null, error: err.message || 'Failed to add family member' };
    }
  }

  static async deleteFamilyMember(memberId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('patient_family_members')
        .delete()
        .eq('id', memberId);
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Medical Profile management
   */
  static async getMedicalProfile(patientId: string): Promise<MedicalProfileData | null> {
    try {
      const { data, error } = await supabase
        .from('patients_medical_profiles')
        .select('*')
        .eq('patient_id', patientId)
        .maybeSingle();

      if (error || !data) return null;

      return {
        patientId: data.patient_id,
        bloodGroup: data.blood_group,
        allergies: data.allergies || [],
        currentMedications: data.current_medications || [],
        chronicConditions: data.chronic_conditions || [],
        pastSurgeries: data.past_surgeries || [],
        familyMedicalHistory: data.family_medical_history,
        heightCm: data.height_cm,
        weightKg: data.weight_kg,
        systolicBp: data.blood_pressure_systolic,
        diastolicBp: data.blood_pressure_diastolic,
      };
    } catch {
      return null;
    }
  }

  static async updateMedicalProfile(
    patientId: string,
    profile: Partial<MedicalProfileData>
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const payload: any = {
        patient_id: patientId,
        allergies: profile.allergies,
        current_medications: profile.currentMedications,
        chronic_conditions: profile.chronicConditions,
        past_surgeries: profile.pastSurgeries,
        family_medical_history: profile.familyMedicalHistory,
        height_cm: profile.heightCm,
        weight_kg: profile.weightKg,
        blood_pressure_systolic: profile.systolicBp,
        blood_pressure_diastolic: profile.diastolicBp,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('patients_medical_profiles')
        .upsert(payload, { onConflict: 'patient_id' });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update medical profile' };
    }
  }

  /**
   * Medical Documents / Records
   */
  static async getMedicalRecords(patientId: string): Promise<MedicalRecordItem[]> {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', patientId)
        .order('record_date', { ascending: false });

      if (error || !data) return [];

      return data.map((r: any) => ({
        id: r.id,
        patientId: r.patient_id,
        recordType: r.record_type,
        title: r.title,
        fileName: r.file_name,
        documentUrl: r.document_url,
        fileSizeBytes: r.file_size_bytes,
        recordDate: r.record_date,
        issuingOrganization: r.issuing_organization,
        doctorName: r.doctor_name,
      }));
    } catch {
      return [];
    }
  }

  static async uploadMedicalRecord(params: {
    patientId: string;
    userId: string;
    title: string;
    recordType: 'lab_report' | 'prescription' | 'xray' | 'mri' | 'discharge_summary';
    file: File;
    doctorName?: string;
    issuingOrganization?: string;
  }): Promise<{ record: MedicalRecordItem | null; error: string | null }> {
    try {
      const fileExt = params.file.name.split('.').pop() || 'pdf';
      const filePath = `patient_${params.patientId}/${Date.now()}_${params.file.name}`;

      const { path, error: uploadErr } = await StorageService.uploadFile(
        'medical_documents',
        filePath,
        params.file
      );

      if (uploadErr || !path) {
        return { record: null, error: uploadErr || 'Failed to upload medical document' };
      }

      // Generate signed access URL or reference
      const { signedUrl } = await StorageService.getSignedUrl('medical_documents', path, 86400); // 24hr access

      const { data, error: insertErr } = await supabase
        .from('medical_records')
        .insert({
          patient_id: params.patientId,
          record_type: params.recordType,
          title: params.title,
          file_name: params.file.name,
          document_url: signedUrl || path,
          file_size_bytes: params.file.size,
          mime_type: params.file.type,
          record_date: new Date().toISOString().split('T')[0],
          doctor_name: params.doctorName || null,
          issuing_organization: params.issuingOrganization || null,
          created_by: params.userId,
        })
        .select()
        .single();

      if (insertErr) {
        return { record: null, error: insertErr.message };
      }

      return {
        record: {
          id: data.id,
          patientId: data.patient_id,
          recordType: data.record_type,
          title: data.title,
          fileName: data.file_name,
          documentUrl: data.document_url,
          fileSizeBytes: data.file_size_bytes,
          recordDate: data.record_date,
          issuingOrganization: data.issuing_organization,
          doctorName: data.doctor_name,
        },
        error: null,
      };
    } catch (err: any) {
      return { record: null, error: err.message || 'Upload medical record failed' };
    }
  }

  /**
   * Saved Providers (Favorites)
   */
  static async getSavedProviders(profileId: string): Promise<SavedProviderItem[]> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false });

      if (error || !data) {
        // Fallback to local storage for guests or pre-sync favorites
        const localFavs = typeof window !== 'undefined' ? localStorage.getItem(`dc_favs_${profileId}`) : null;
        if (localFavs) {
          try {
            return JSON.parse(localFavs);
          } catch {}
        }
        return [];
      }

      return data.map((fav: any) => ({
        id: fav.id,
        profileId: fav.profile_id,
        entityType: fav.entity_type,
        entityId: fav.entity_id,
        createdAt: fav.created_at,
        doctor: undefined,
        organization: undefined,
      }));
    } catch {
      return [];
    }
  }

  static async toggleSaveProvider(
    profileId: string,
    entityType: 'doctor' | 'diagnostic_center' | 'hospital',
    entityId: string
  ): Promise<{ isSaved: boolean; error: string | null }> {
    try {
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('profile_id', profileId)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .maybeSingle();

      if (existing) {
        await supabase.from('favorites').delete().eq('id', existing.id);
        return { isSaved: false, error: null };
      } else {
        await supabase.from('favorites').insert({
          profile_id: profileId,
          entity_type: entityType,
          entity_id: entityId,
        });
        return { isSaved: true, error: null };
      }
    } catch (err: any) {
      return { isSaved: false, error: err.message || 'Toggle save failed' };
    }
  }

  /**
   * User Preferences
   */
  static async getUserPreferences(userId: string): Promise<CustomerPreferences> {
    try {
      const { data } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      return {
        theme: data?.theme || 'light',
        smsNotifications: data?.sms_notifications !== false,
        emailNotifications: data?.email_notifications !== false,
        pushNotifications: data?.push_notifications !== false,
        soundAlerts: data?.sound_alerts !== false,
        preferredLanguage: (data?.preferred_language as any) || 'en',
      };
    } catch {
      return {
        theme: 'light',
        smsNotifications: true,
        emailNotifications: true,
        pushNotifications: true,
        soundAlerts: true,
        preferredLanguage: 'en',
      };
    }
  }

  static async updateUserPreferences(
    userId: string,
    prefs: Partial<CustomerPreferences>
  ): Promise<boolean> {
    try {
      const payload: any = {
        user_id: userId,
        updated_at: new Date().toISOString(),
      };
      if (prefs.theme !== undefined) payload.theme = prefs.theme;
      if (prefs.smsNotifications !== undefined) payload.sms_notifications = prefs.smsNotifications;
      if (prefs.emailNotifications !== undefined) payload.email_notifications = prefs.emailNotifications;
      if (prefs.pushNotifications !== undefined) payload.push_notifications = prefs.pushNotifications;
      if (prefs.soundAlerts !== undefined) payload.sound_alerts = prefs.soundAlerts;
      if (prefs.preferredLanguage !== undefined) payload.preferred_language = prefs.preferredLanguage;

      const { error } = await supabase
        .from('user_preferences')
        .upsert(payload, { onConflict: 'user_id' });

      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Privacy Settings
   */
  static async getPrivacySettings(userId: string): Promise<CustomerPrivacySettings> {
    try {
      const { data } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      return {
        shareMedicalHistoryWithDoctors: data?.share_medical_history_with_doctors !== false,
        allowEmergencyAccess: data?.allow_emergency_access !== false,
        profileDiscoverable: data?.profile_discoverable !== false,
      };
    } catch {
      return {
        shareMedicalHistoryWithDoctors: true,
        allowEmergencyAccess: true,
        profileDiscoverable: true,
      };
    }
  }

  static async updatePrivacySettings(
    userId: string,
    settings: Partial<CustomerPrivacySettings>
  ): Promise<boolean> {
    try {
      const payload: any = {
        user_id: userId,
        updated_at: new Date().toISOString(),
      };
      if (settings.shareMedicalHistoryWithDoctors !== undefined)
        payload.share_medical_history_with_doctors = settings.shareMedicalHistoryWithDoctors;
      if (settings.allowEmergencyAccess !== undefined)
        payload.allow_emergency_access = settings.allowEmergencyAccess;
      if (settings.profileDiscoverable !== undefined)
        payload.profile_discoverable = settings.profileDiscoverable;

      const { error } = await supabase
        .from('privacy_settings')
        .upsert(payload, { onConflict: 'user_id' });

      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Calculate profile completion percentage based on core healthcare fields
   */
  static calculateProfileCompletion(profile: CustomerFullProfile): number {
    let score = 0;
    const weights = [
      { field: profile.fullName, points: 15 },
      { field: profile.phone, points: 15 },
      { field: profile.email, points: 10 },
      { field: profile.avatarUrl, points: 10 },
      { field: profile.dateOfBirth, points: 10 },
      { field: profile.gender && profile.gender !== 'PREFER_NOT_TO_SAY', points: 10 },
      { field: profile.bloodGroup, points: 10 },
      { field: profile.address, points: 10 },
      { field: profile.emergencyContactName && profile.emergencyContactPhone, points: 10 },
    ];

    for (const w of weights) {
      if (w.field) score += w.points;
    }

    return Math.min(100, score);
  }
}
