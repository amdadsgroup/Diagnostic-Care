import { supabase } from '@/lib/supabase/client';
import { Division, District, Upazila } from '@/types';

export class LocationService {
  /**
   * Fetch all active divisions
   */
  static async getDivisions(): Promise<Division[]> {
    try {
      const { data, error } = await supabase
        .from('divisions')
        .select('id, name, name_bn')
        .eq('status', 'active')
        .order('name');

      if (error || !data || data.length === 0) {
        // Fallback default Sylhet, Dhaka, Chittagong if offline/initial
        return [
          { id: 'div-sylhet', nameEn: 'Sylhet', nameBn: 'সিলেট' },
          { id: 'div-dhaka', nameEn: 'Dhaka', nameBn: 'ঢাকা' },
          { id: 'div-chittagong', nameEn: 'Chittagong', nameBn: 'চট্টগ্রাম' },
        ];
      }

      return data.map((d) => ({
        id: d.id,
        nameEn: d.name,
        nameBn: d.name_bn,
      }));
    } catch {
      return [
        { id: 'div-sylhet', nameEn: 'Sylhet', nameBn: 'সিলেট' },
        { id: 'div-dhaka', nameEn: 'Dhaka', nameBn: 'ঢাকা' },
      ];
    }
  }

  /**
   * Fetch districts by division or all
   */
  static async getDistricts(divisionId?: string): Promise<District[]> {
    try {
      let query = supabase
        .from('districts')
        .select('id, division_id, name, name_bn')
        .eq('status', 'active')
        .order('name');

      if (divisionId) {
        query = query.eq('division_id', divisionId);
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return [
          { id: 'dist-moulvibazar', divisionId: 'div-sylhet', nameEn: 'Moulvibazar', nameBn: 'মৌলভীবাজার' },
          { id: 'dist-sylhet', divisionId: 'div-sylhet', nameEn: 'Sylhet', nameBn: 'সিলেট' },
          { id: 'dist-habiganj', divisionId: 'div-sylhet', nameEn: 'Habiganj', nameBn: 'হবিগঞ্জ' },
          { id: 'dist-sunamganj', divisionId: 'div-sylhet', nameEn: 'Sunamganj', nameBn: 'সুনামগঞ্জ' },
        ];
      }

      return data.map((d) => ({
        id: d.id,
        divisionId: d.division_id,
        nameEn: d.name,
        nameBn: d.name_bn,
      }));
    } catch {
      return [
        { id: 'dist-moulvibazar', divisionId: 'div-sylhet', nameEn: 'Moulvibazar', nameBn: 'মৌলভীবাজার' },
      ];
    }
  }

  /**
   * Fetch Upazilas by District
   */
  static async getUpazilas(districtId?: string): Promise<Upazila[]> {
    try {
      let query = supabase
        .from('upazilas')
        .select('id, district_id, name, name_bn')
        .eq('status', 'active')
        .order('name');

      if (districtId) {
        query = query.eq('district_id', districtId);
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return [
          { id: 'upz-moulvibazar-sadar', districtId: 'dist-moulvibazar', nameEn: 'Moulvibazar Sadar', nameBn: 'মৌলভীবাজার সদর' },
          { id: 'upz-sreemangal', districtId: 'dist-moulvibazar', nameEn: 'Sreemangal', nameBn: 'শ্রীমঙ্গল' },
          { id: 'upz-kamalganj', districtId: 'dist-moulvibazar', nameEn: 'Kamalganj', nameBn: 'কমলগঞ্জ' },
          { id: 'upz-kulaura', districtId: 'dist-moulvibazar', nameEn: 'Kulaura', nameBn: 'কুলাউড়া' },
          { id: 'upz-barlekha', districtId: 'dist-moulvibazar', nameEn: 'Barlekha', nameBn: 'বড়লেখা' },
          { id: 'upz-rajnagar', districtId: 'dist-moulvibazar', nameEn: 'Rajnagar', nameBn: 'রাজনগর' },
          { id: 'upz-juri', districtId: 'dist-moulvibazar', nameEn: 'Juri', nameBn: 'জুড়ী' },
        ];
      }

      return data.map((u) => ({
        id: u.id,
        districtId: u.district_id,
        nameEn: u.name,
        nameBn: u.name_bn,
      }));
    } catch {
      return [
        { id: 'upz-moulvibazar-sadar', districtId: 'dist-moulvibazar', nameEn: 'Moulvibazar Sadar', nameBn: 'মৌলভীবাজার সদর' },
      ];
    }
  }
}
