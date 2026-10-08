import { supabase } from '@/lib/supabase/client';
import { DiagnosticTest, Organization } from '@/types';

export class DiagnosticService {
  /**
   * Fetch all diagnostic tests with optional category or center filtering directly from PostgreSQL
   */
  static async getLabTests(params?: {
    centerId?: string;
    category?: string;
    search?: string;
  }): Promise<DiagnosticTest[]> {
    try {
      let query = supabase
        .from('lab_tests')
        .select(`
          id,
          name,
          name_bn,
          category,
          sample_type,
          turnaround_hours,
          preparation_instructions,
          preparation_instructions_bn,
          price,
          discount_price,
          is_home_sample_supported,
          diagnostic_center_id,
          diagnostic_centers (
            name,
            name_bn
          )
        `)
        .eq('is_available', true);

      if (params?.centerId) {
        query = query.eq('diagnostic_center_id', params.centerId);
      }

      if (params?.category && params.category !== 'ALL') {
        query = query.ilike('category', `%${params.category}%`);
      }

      if (params?.search && params.search.trim()) {
        query = query.or(`name.ilike.%${params.search}%,name_bn.ilike.%${params.search}%`);
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return [];
      }

      return data.map((t: any) => ({
        id: t.id,
        organizationId: t.diagnostic_center_id || 'org-popular-moulvibazar',
        organizationName: t.diagnostic_centers?.name || 'Popular Diagnostic Center',
        name: t.name,
        code: t.id.slice(0, 8).toUpperCase(),
        category: t.category,
        description: t.name_bn || t.name,
        preparationInstructions: t.preparation_instructions || 'No special preparation needed',
        price: Number(t.price),
        discountPrice: t.discount_price ? Number(t.discount_price) : undefined,
        sampleType: t.sample_type || 'Blood',
        expectedDeliveryHours: t.turnaround_hours || 24,
        homeCollectionAvailable: Boolean(t.is_home_sample_supported),
        isActive: true,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Create a new diagnostic test in the database
   */
  static async createLabTest(params: {
    diagnosticCenterId: string;
    name: string;
    nameBn?: string;
    category: string;
    sampleType?: string;
    turnaroundHours?: number;
    preparationInstructions?: string;
    price: number;
    discountPrice?: number;
    isHomeSampleSupported?: boolean;
  }): Promise<{ test: DiagnosticTest | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('lab_tests')
        .insert({
          diagnostic_center_id: params.diagnosticCenterId,
          name: params.name,
          name_bn: params.nameBn || params.name,
          category: params.category,
          sample_type: params.sampleType || 'Blood',
          turnaround_hours: params.turnaroundHours || 24,
          preparation_instructions: params.preparationInstructions || null,
          price: params.price,
          discount_price: params.discountPrice || null,
          is_home_sample_supported: Boolean(params.isHomeSampleSupported),
          is_available: true,
          status: 'active',
        })
        .select(`
          *,
          diagnostic_centers (name)
        `)
        .single();

      if (error) {
        return { test: null, error: error.message };
      }

      const created: DiagnosticTest = {
        id: data.id,
        organizationId: data.diagnostic_center_id,
        organizationName: data.diagnostic_centers?.name || 'Diagnostic Center',
        name: data.name,
        code: data.id.slice(0, 8).toUpperCase(),
        category: data.category,
        description: data.name_bn || data.name,
        preparationInstructions: data.preparation_instructions || '',
        price: Number(data.price),
        discountPrice: data.discount_price ? Number(data.discount_price) : undefined,
        sampleType: data.sample_type,
        expectedDeliveryHours: data.turnaround_hours,
        homeCollectionAvailable: Boolean(data.is_home_sample_supported),
        isActive: true,
      };

      return { test: created, error: null };
    } catch (err: any) {
      return { test: null, error: err.message || 'Failed to create test' };
    }
  }

  /**
   * Book a diagnostic test (Home sample collection or center visit)
   */
  static async bookDiagnosticTest(params: {
    patientId: string;
    centerId: string;
    testId: string;
    testName: string;
    price: number;
    patientName: string;
    patientPhone: string;
    bookingDate: string;
    isHomeCollection: boolean;
    collectionAddress?: string;
  }): Promise<{ bookingCode: string; success: boolean; error: string | null }> {
    try {
      const bookingCode = `DC-LAB-${Math.floor(1000 + Math.random() * 8999)}`;

      const { data, error } = await supabase
        .from('diagnostic_bookings')
        .insert({
          booking_code: bookingCode,
          patient_id: params.patientId,
          diagnostic_center_id: params.centerId,
          booking_date: params.bookingDate,
          is_home_collection: params.isHomeCollection,
          collection_address: params.collectionAddress || null,
          patient_name: params.patientName,
          patient_phone: params.patientPhone,
          total_amount: params.price,
          net_payable: params.price,
          payment_status: 'cash_at_desk',
          status: 'confirmed',
        })
        .select()
        .single();

      if (error) {
        return { bookingCode: '', success: false, error: error.message };
      }

      // Insert item
      if (data?.id) {
        await supabase.from('diagnostic_booking_items').insert({
          booking_id: data.id,
          test_id: params.testId,
          item_name: params.testName,
          price: params.price,
        });
      }

      return { bookingCode, success: true, error: null };
    } catch (err: any) {
      return { bookingCode: '', success: false, error: err.message || 'Booking failed' };
    }
  }

  /**
   * Get Diagnostic Centers
   */
  static async getDiagnosticCenters(): Promise<Organization[]> {
    try {
      const { data, error } = await supabase
        .from('diagnostic_centers')
        .select(`
          id,
          name,
          name_bn,
          slug,
          trade_license_number,
          logo_url,
          phone,
          email,
          rating,
          total_reviews,
          verification_status,
          has_home_sample_collection,
          provider_locations (
            id,
            branch_name,
            address_line,
            phone,
            opening_time,
            closing_time,
            districts (name),
            upazilas (name)
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
        rating: Number(d.rating) || 4.9,
        reviewCount: d.total_reviews || 0,
        branches: (d.provider_locations || []).map((loc: any) => ({
          id: loc.id,
          organizationId: d.id,
          name: loc.branch_name,
          isMainBranch: true,
          upazilaId: 'upz-moulvibazar-sadar',
          upazilaName: loc.upazilas?.name || 'Moulvibazar Sadar',
          districtName: loc.districts?.name || 'Moulvibazar',
          addressLine: loc.address_line,
          phone: loc.phone || d.phone,
          openingTime: loc.opening_time || '07:30',
          closingTime: loc.closing_time || '23:00',
          isActive: true,
        })),
      }));
    } catch {
      return [];
    }
  }
}
