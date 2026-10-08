import { supabase } from '@/lib/supabase/client';
import { Organization } from '@/types';

export interface ProviderOnboardingData {
  name: string;
  nameBn?: string;
  orgType: string;
  tradeLicenseNumber: string;
  dghsNumber?: string;
  contactPhone: string;
  contactEmail: string;
  divisionId?: string;
  districtId?: string;
  upazilaId?: string;
  addressLine: string;
}

export class ProviderService {
  /**
   * Onboard a new provider organization (Diagnostic Center, Clinic, Hospital, Pharmacy, Ambulance)
   */
  static async onboardProvider(data: ProviderOnboardingData): Promise<{
    providerId: string;
    success: boolean;
    error: string | null;
  }> {
    try {
      const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Insert organization depending on orgType
      let table = 'diagnostic_centers';
      if (data.orgType === 'HOSPITAL') table = 'hospitals';
      else if (data.orgType === 'CLINIC') table = 'clinics';
      else if (data.orgType === 'PHARMACY') table = 'pharmacies';
      else if (data.orgType === 'AMBULANCE') table = 'ambulance_providers';

      const { data: inserted, error } = await supabase
        .from(table)
        .insert({
          name: data.name,
          name_bn: data.nameBn || data.name,
          slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
          trade_license_number: data.tradeLicenseNumber,
          dghs_registration_number: data.dghsNumber || null,
          phone: data.contactPhone,
          email: data.contactEmail,
          verification_status: 'pending',
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        return { providerId: '', success: false, error: error.message };
      }

      // Insert initial branch location if address provided
      if (inserted?.id && data.addressLine) {
        await supabase.from('provider_locations').insert({
          provider_type: table === 'diagnostic_centers' ? 'diagnostic_center' : data.orgType.toLowerCase(),
          provider_id: inserted.id,
          branch_name: 'Main Facility',
          address_line: data.addressLine,
          district_id: data.districtId || null,
          upazila_id: data.upazilaId || null,
          division_id: data.divisionId || null,
          phone: data.contactPhone,
          is_main_branch: true,
          status: 'active',
        });
      }

      return { providerId: inserted.id, success: true, error: null };
    } catch (err: any) {
      return { providerId: '', success: false, error: err.message || 'Onboarding failed' };
    }
  }

  /**
   * Get all verified healthcare organizations
   */
  static async getProviders(): Promise<Organization[]> {
    try {
      const { data, error } = await supabase
        .from('diagnostic_centers')
        .select(`
          *,
          provider_locations (
            id,
            branch_name,
            address_line,
            phone,
            opening_time,
            closing_time
          )
        `)
        .eq('status', 'active');

      if (error || !data || data.length === 0) {
        return [];
      }

      return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        orgType: 'DIAGNOSTIC_CENTER',
        tradeLicenseNumber: d.trade_license_number,
        logoUrl: d.logo_url || '/logo.png',
        contactPhone: d.phone,
        contactEmail: d.email,
        verificationStatus: (d.verification_status?.toUpperCase() as any) || 'VERIFIED',
        isFeatured: true,
        rating: Number(d.rating) || 5.0,
        reviewCount: d.total_reviews || 0,
        branches: (d.provider_locations || []).map((loc: any) => ({
          id: loc.id,
          organizationId: d.id,
          name: loc.branch_name,
          isMainBranch: true,
          upazilaId: 'upz-sadar',
          upazilaName: 'Moulvibazar Sadar',
          districtName: 'Moulvibazar',
          addressLine: loc.address_line,
          phone: loc.phone || d.phone,
          openingTime: loc.opening_time || '08:00',
          closingTime: loc.closing_time || '22:00',
          isActive: true,
        })),
      }));
    } catch {
      return [];
    }
  }
}
