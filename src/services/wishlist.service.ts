import { supabase } from '@/lib/supabase/client';
import { Doctor, DoctorWishlistItem } from '@/types';
import { getCachedData } from '@/lib/cache';

const LOCAL_STORAGE_KEY_PREFIX = 'dc_wishlist_';

export class WishlistService {
  /**
   * Get all doctors in patient's wishlist
   */
  static async getWishlist(patientProfileId: string): Promise<DoctorWishlistItem[]> {
    if (!patientProfileId) return [];

    try {
      // 1. Fetch from Supabase
      const { data, error } = await supabase
        .from('doctor_wishlist')
        .select('*')
        .eq('patient_profile_id', patientProfileId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Wishlist fetch note from DB:', error.message);
        // Fallback to local storage cache if offline or unmigrated
        return this.getLocalWishlist(patientProfileId);
      }

      if (!data || data.length === 0) {
        this.saveLocalWishlist(patientProfileId, []);
        return [];
      }

      // 2. Hydrate doctor details from cached doctors directory
      const cachedDoctors = getCachedData<Doctor[]>('doctors_list_active_all', true) || [];
      const doctorMap = new Map<string, Doctor>();
      cachedDoctors.forEach((d) => doctorMap.set(d.id, d));

      const wishlistedItems: DoctorWishlistItem[] = [];

      for (const row of data) {
        let doc = doctorMap.get(row.doctor_id);

        if (!doc) {
          // Fetch single doctor if not in cache
          const { data: docData } = await supabase
            .from('doctors')
            .select(`
              id,
              bmdc_registration_number,
              specialization,
              qualifications,
              designation,
              experience_years,
              consultation_fee,
              rating,
              total_reviews,
              profiles (
                full_name,
                avatar_url,
                phone
              )
            `)
            .eq('id', row.doctor_id)
            .maybeSingle();

          if (docData) {
            const d = docData as any;
            const prof = d.profiles;
            doc = {
              id: d.id,
              userId: d.user_id || d.id,
              fullName: prof?.full_name || 'Specialist Doctor',
              bmdcNumber: d.bmdc_registration_number || '',
              title: 'Dr.',
              specialization: d.specialization || 'General Physician',
              qualifications: d.qualifications || 'MBBS',
              experienceYears: d.experience_years || 5,
              biography: d.biography || '',
              rating: Number(d.rating) || 5.0,
              reviewCount: d.total_reviews || 0,
              avatarUrl: prof?.avatar_url,
              verificationStatus: 'VERIFIED',
              languages: ['Bangla', 'English'],
            };
          }
        }

        wishlistedItems.push({
          id: row.id,
          patientProfileId: row.patient_profile_id,
          doctorId: row.doctor_id,
          createdAt: row.created_at,
          doctor: doc,
        });
      }

      // Sync local storage cache
      this.saveLocalWishlist(patientProfileId, wishlistedItems);

      return wishlistedItems;
    } catch (err) {
      console.warn('Wishlist retrieval fallback:', err);
      return this.getLocalWishlist(patientProfileId);
    }
  }

  /**
   * Check if a doctor is already in the patient's wishlist
   */
  static async isDoctorWishlisted(patientProfileId: string | undefined | null, doctorId: string): Promise<boolean> {
    if (!patientProfileId || !doctorId) return false;

    // Check fast local cache first
    const local = this.getLocalWishlist(patientProfileId);
    if (local.some((item) => item.doctorId === doctorId)) {
      return true;
    }

    try {
      const { data, error } = await supabase
        .from('doctor_wishlist')
        .select('id')
        .eq('patient_profile_id', patientProfileId)
        .eq('doctor_id', doctorId)
        .maybeSingle();

      return !!data && !error;
    } catch {
      return false;
    }
  }

  /**
   * Toggle doctor in wishlist (persists to Supabase, updates local state, dispatches event)
   */
  static async toggleWishlist(patientProfileId: string, doctor: Doctor): Promise<boolean> {
    const isSaved = await this.isDoctorWishlisted(patientProfileId, doctor.id);
    if (isSaved) {
      await this.removeFromWishlist(patientProfileId, doctor.id);
      return false;
    } else {
      await this.addToWishlist(patientProfileId, doctor.id, doctor);
      return true;
    }
  }

  /**
   * Add doctor to wishlist (persisted in Supabase + local cache)
   */
  static async addToWishlist(patientProfileId: string, doctorId: string, doctor?: Doctor): Promise<boolean> {
    if (!patientProfileId || !doctorId) return false;

    // Optimistic update
    const current = this.getLocalWishlist(patientProfileId);
    if (!current.some((item) => item.doctorId === doctorId)) {
      const newItem: DoctorWishlistItem = {
        id: `wish-${Date.now()}`,
        patientProfileId,
        doctorId,
        createdAt: new Date().toISOString(),
        doctor,
      };
      this.saveLocalWishlist(patientProfileId, [newItem, ...current]);
      this.notifyWishlistUpdate();
    }

    try {
      const { error } = await supabase.from('doctor_wishlist').upsert(
        {
          patient_profile_id: patientProfileId,
          doctor_id: doctorId,
        },
        { onConflict: 'patient_profile_id,doctor_id' }
      );

      if (error) {
        console.warn('Wishlist DB upsert note:', error.message);
      }
      return true;
    } catch (err) {
      console.warn('Wishlist add error:', err);
      return true; // Still preserved locally
    }
  }

  /**
   * Remove doctor from wishlist
   */
  static async removeFromWishlist(patientProfileId: string, doctorId: string): Promise<boolean> {
    if (!patientProfileId || !doctorId) return false;

    // Optimistic update
    const current = this.getLocalWishlist(patientProfileId);
    const filtered = current.filter((item) => item.doctorId !== doctorId);
    this.saveLocalWishlist(patientProfileId, filtered);
    this.notifyWishlistUpdate();

    try {
      await supabase
        .from('doctor_wishlist')
        .delete()
        .eq('patient_profile_id', patientProfileId)
        .eq('doctor_id', doctorId);
      return true;
    } catch (err) {
      console.warn('Wishlist delete note:', err);
      return true;
    }
  }

  /**
   * Local storage helpers
   */
  private static getLocalWishlist(patientProfileId: string): DoctorWishlistItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const key = `${LOCAL_STORAGE_KEY_PREFIX}${patientProfileId}`;
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private static saveLocalWishlist(patientProfileId: string, items: DoctorWishlistItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      const key = `${LOCAL_STORAGE_KEY_PREFIX}${patientProfileId}`;
      localStorage.setItem(key, JSON.stringify(items));
    } catch {
      // Ignore quota errors
    }
  }

  private static notifyWishlistUpdate(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('dc_wishlist_updated'));
    }
  }
}
