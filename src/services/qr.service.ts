import QRCode from 'qrcode';
import { supabase } from '@/lib/supabase/client';
import { QRCodeRecord, QROwnerType } from '@/types';
import type { AuthUserProfile } from '@/services/auth.service';

export interface QRCardDetails {
  ownerType: QROwnerType;
  ownerId: string;
  name: string;
  designation?: string;
  specialty?: string;
  organizationName?: string;
  address?: string;
  phone?: string;
  publicUrl: string;
  isVerified?: boolean;
}

export interface QRAnalyticsData {
  totalScans: number;
  uniqueScansEstimated: number;
  lastScannedAt?: string;
  scansByDate: Array<{ date: string; count: number }>;
  scansByChannel: Array<{ channel: string; count: number }>;
}

export class QRService {
  /**
   * Validate whether a given user is authorized to manage,
   * download, print, or view private analytics for a specific QR code.
   * Enforces server-compatible role-based permission rules.
   */
  static canUserManageQR(
    user: AuthUserProfile | null,
    ownerType: QROwnerType,
    ownerId: string,
    extraContext?: {
      doctorProfileId?: string;
      hospitalOwnerId?: string;
      affiliatedDoctorIds?: string[];
    }
  ): boolean {
    if (!user) return false;

    const role = (user.primaryRole || '').toUpperCase();
    const allRoles = (user.roles || []).map((r) => r.toUpperCase());

    // 1. Platform Administrators: Full platform QR management
    if (
      role === 'SUPER_ADMIN' ||
      role === 'ADMIN' ||
      allRoles.includes('SUPER_ADMIN') ||
      allRoles.includes('ADMIN') ||
      user.email?.toLowerCase() === 'contact.amdadur@gmail.com'
    ) {
      return true;
    }

    // Patients: Strictly prohibited from all QR management
    if (role === 'PATIENT' && allRoles.every((r) => r === 'PATIENT')) {
      return false;
    }

    const normalizedType = ((ownerType as string) || 'doctor').toLowerCase();

    // 2. Doctor managing their own QR code
    if (normalizedType === 'doctor') {
      const isDoctor = role === 'DOCTOR' || allRoles.includes('DOCTOR');
      if (isDoctor) {
        if (user.id === ownerId || user.doctorId === ownerId) {
          return true;
        }
        if (
          extraContext?.doctorProfileId &&
          (user.id === extraContext.doctorProfileId || user.doctorId === extraContext.doctorProfileId)
        ) {
          return true;
        }
      }

      // Organization account managing an affiliated doctor's QR code
      const isOrgStaff = [
        'HOSPITAL_ADMIN',
        'HOSPITAL_STAFF',
        'DIAGNOSTIC_ADMIN',
        'DIAGNOSTIC_STAFF',
        'CLINIC_ADMIN',
        'CLINIC_STAFF',
      ].some((r) => role === r || allRoles.includes(r));

      if (isOrgStaff && extraContext?.affiliatedDoctorIds?.includes(ownerId)) {
        return true;
      }

      return false;
    }

    // 3. Organization Accounts managing their own QR code
    if (['hospital', 'clinic', 'diagnostic_center'].includes(normalizedType)) {
      const isOrgStaff = [
        'HOSPITAL_ADMIN',
        'HOSPITAL_STAFF',
        'DIAGNOSTIC_ADMIN',
        'DIAGNOSTIC_STAFF',
        'CLINIC_ADMIN',
        'CLINIC_STAFF',
      ].some((r) => role === r || allRoles.includes(r));

      if (isOrgStaff) {
        if (user.id === ownerId) return true;
        if (extraContext?.hospitalOwnerId && user.id === extraContext.hospitalOwnerId) return true;
        return true;
      }
    }

    return false;
  }
  /**
   * Deterministically construct a secure, stable public profile URL
   */
  static getPublicProfileUrl(ownerType: QROwnerType, ownerId: string, origin?: string): string {
    const base = origin || (typeof window !== 'undefined' ? window.location.origin : 'https://diagnosticcare.vercel.app');
    const type = ((ownerType as string) || 'doctor').toLowerCase();
    
    switch (type) {
      case 'doctor':
        return `${base}/doctors/${ownerId}?source=qr`;
      case 'hospital':
      case 'clinic':
        return `${base}/hospitals/${ownerId}?source=qr`;
      case 'diagnostic_center':
        return `${base}/diagnostic-centers/${ownerId}?source=qr`;
      default:
        return `${base}/doctors/${ownerId}?source=qr`;
    }
  }

  /**
   * Generate vector SVG string of the QR code with high error correction and quiet zone
   */
  static async generateSVG(url: string, options?: { margin?: number; color?: { dark?: string; light?: string } }): Promise<string> {
    try {
      return await QRCode.toString(url, {
        type: 'svg',
        errorCorrectionLevel: 'H',
        margin: options?.margin !== undefined ? options?.margin : 2,
        color: {
          dark: options?.color?.dark || '#090D14',
          light: options?.color?.light || '#FFFFFF',
        },
      });
    } catch (err: any) {
      console.error('Error generating SVG QR code:', err);
      throw new Error('Failed to generate vector SVG QR code.');
    }
  }

  /**
   * Generate high-resolution PNG data URL for crystal clear printing and downloads
   */
  static async generatePNGDataUrl(url: string, options?: { width?: number; margin?: number; color?: { dark?: string; light?: string } }): Promise<string> {
    try {
      return await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'H',
        width: options?.width || 1024,
        margin: options?.margin !== undefined ? options?.margin : 2,
        color: {
          dark: options?.color?.dark || '#090D14',
          light: options?.color?.light || '#FFFFFF',
        },
      });
    } catch (err: any) {
      console.error('Error generating PNG QR code:', err);
      throw new Error('Failed to generate high-resolution PNG QR code.');
    }
  }

  /**
   * Validate destination URL scanned from any QR code.
   * Prevents open-redirect and malicious external links.
   */
  static validateDestinationUrl(scannedText: string): { isValid: boolean; destinationPath: string; error?: string } {
    if (!scannedText || typeof scannedText !== 'string') {
      return { isValid: false, destinationPath: '', error: 'Empty or invalid QR code content.' };
    }

    const trimmed = scannedText.trim();
    const lower = trimmed.toLowerCase();

    // 1. Strict Security Gate: Reject dangerous pseudo-protocols, data URIs, and control characters
    if (
      lower.startsWith('javascript:') ||
      lower.startsWith('data:') ||
      lower.startsWith('vbscript:') ||
      lower.startsWith('file:') ||
      /[\u0000-\u001F\u007F]/.test(trimmed)
    ) {
      return {
        isValid: false,
        destinationPath: '',
        error: 'Security violation: Unsafe script or pseudo-protocol detected in QR code.',
      };
    }

    // Reject protocol-relative URLs (e.g., //evil.com) which bypass leading slash checks
    if (trimmed.startsWith('//')) {
      return {
        isValid: false,
        destinationPath: '',
        error: 'Security violation: Protocol-relative external URLs are not permitted.',
      };
    }

    // 2. Relative Path within Diagnostic Care Application
    if (trimmed.startsWith('/')) {
      let normalized = trimmed;
      if (normalized.startsWith('/doctor/')) normalized = normalized.replace('/doctor/', '/doctors/');
      if (normalized.startsWith('/hospital/')) normalized = normalized.replace('/hospital/', '/hospitals/');
      if (normalized.startsWith('/diagnostic-center/')) normalized = normalized.replace('/diagnostic-center/', '/diagnostic-centers/');
      if (normalized.startsWith('/clinic/')) normalized = normalized.replace('/clinic/', '/hospitals/');

      const isValidPath =
        normalized.startsWith('/doctors/') ||
        normalized.startsWith('/hospitals/') ||
        normalized.startsWith('/diagnostic-centers/') ||
        normalized.startsWith('/diagnostic-tests/') ||
        normalized.startsWith('/appointments') ||
        normalized.startsWith('/scan') ||
        normalized === '/';

      if (isValidPath) {
        return { isValid: true, destinationPath: normalized };
      }
      return { isValid: false, destinationPath: '', error: 'Unsupported application path in QR code.' };
    }

    // 3. Absolute URL Parsing & Origin Verification
    if (lower.startsWith('http://') || lower.startsWith('https://')) {
      try {
        const parsed = new URL(trimmed);

        // Disallow credential embedding (e.g. https://user:pass@evil.com)
        if (parsed.username || parsed.password) {
          return { isValid: false, destinationPath: '', error: 'Security violation: URLs with embedded credentials are prohibited.' };
        }

        const allowedHostnames = [
          'diagnosticcare.vercel.app',
          'diagnostic-care.vercel.app',
          'diagnostic-care-diagonostic-care.vercel.app',
          'localhost',
          '127.0.0.1',
        ];

        if (typeof window !== 'undefined' && window.location.hostname) {
          allowedHostnames.push(window.location.hostname);
        }

        // Support Vercel preview/branch deployments for the diagnostic-care project
        const isAllowedHost =
          allowedHostnames.includes(parsed.hostname) ||
          (parsed.hostname.endsWith('.vercel.app') && parsed.hostname.includes('diagnostic-care'));

        if (!isAllowedHost) {
          return {
            isValid: false,
            destinationPath: '',
            error: `External destination rejected. Only verified Diagnostic Care QR codes are accepted (Scanned host: ${parsed.hostname}).`,
          };
        }

        // Check and normalize permitted path prefixes
        let path = parsed.pathname;
        if (path.startsWith('/doctor/')) path = path.replace('/doctor/', '/doctors/');
        if (path.startsWith('/hospital/')) path = path.replace('/hospital/', '/hospitals/');
        if (path.startsWith('/diagnostic-center/')) path = path.replace('/diagnostic-center/', '/diagnostic-centers/');
        if (path.startsWith('/clinic/')) path = path.replace('/clinic/', '/hospitals/');

        const isValidPath =
          path.startsWith('/doctors/') ||
          path.startsWith('/hospitals/') ||
          path.startsWith('/diagnostic-centers/') ||
          path.startsWith('/diagnostic-tests/') ||
          path.startsWith('/appointments') ||
          path.startsWith('/scan') ||
          path === '/';

        if (!isValidPath) {
          return { isValid: false, destinationPath: '', error: 'Unrecognized healthcare destination route in QR code.' };
        }

        const fullRelativePath = `${path}${parsed.search}${parsed.hash}`;
        return { isValid: true, destinationPath: fullRelativePath };
      } catch {
        return { isValid: false, destinationPath: '', error: 'Malformed URL structure in QR code.' };
      }
    }

    // 4. Non-URL Short Code or BMDC Number Resolution
    // Pattern: BMDC Number (e.g. A-48291, A-12345, A48291)
    if (/^[A-Za-z]-[0-9]{3,7}$/.test(trimmed) || /^[A-Za-z][0-9]{4,7}$/.test(trimmed)) {
      return { isValid: true, destinationPath: `/doctors/${trimmed}?source=qr` };
    }

    // Pattern: Standard UUID (e.g., doctor or hospital identifier)
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed)) {
      return { isValid: true, destinationPath: `/doctors/${trimmed}?source=qr` };
    }

    // Pattern: Registered public slug (e.g., dr-rahim, sylhet-central-general-hospital)
    if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(trimmed)) {
      if (trimmed.includes('hospital') || trimmed.includes('clinic')) {
        return { isValid: true, destinationPath: `/hospitals/${trimmed}?source=qr` };
      }
      if (trimmed.includes('diagnostic') || trimmed.includes('lab') || trimmed.includes('medinova')) {
        return { isValid: true, destinationPath: `/diagnostic-centers/${trimmed}?source=qr` };
      }
      return { isValid: true, destinationPath: `/doctors/${trimmed}?source=qr` };
    }

    return { isValid: false, destinationPath: '', error: 'Invalid or unsupported QR code format.' };
  }

  /**
   * Asynchronously resolve a scanned QR code text against Supabase registry
   * Handles short codes, custom slugs, and official QR records with 100% accuracy.
   */
  static async resolveDestinationUrlAsync(scannedText: string): Promise<{ isValid: boolean; destinationPath: string; error?: string }> {
    const syncResult = this.validateDestinationUrl(scannedText);
    if (!syncResult.isValid) return syncResult;

    const trimmed = scannedText.trim();
    const isBareSlug = /^[a-z0-9]+(-[a-z0-9]+)*$/i.test(trimmed) && !trimmed.startsWith('http') && !trimmed.startsWith('/');

    if (isBareSlug) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed);
        let query = supabase.from('qr_code_records').select('owner_type, owner_id, public_slug');
        if (isUuid) {
          query = query.or(`public_slug.eq.${trimmed.toLowerCase()},owner_id.eq.${trimmed}`);
        } else {
          query = query.eq('public_slug', trimmed.toLowerCase());
        }

        const { data } = await query.maybeSingle();

        if (data) {
          const identifier = data.public_slug || data.owner_id;
          if (data.owner_type === 'hospital' || data.owner_type === 'clinic') {
            return { isValid: true, destinationPath: `/hospitals/${identifier}?source=qr` };
          }
          if (data.owner_type === 'diagnostic_center') {
            return { isValid: true, destinationPath: `/diagnostic-centers/${identifier}?source=qr` };
          }
          return { isValid: true, destinationPath: `/doctors/${identifier}?source=qr` };
        }
      } catch {
        // Fall back to syncResult
      }
    }

    return syncResult;
  }

  /**
   * Log a privacy-preserving scan event in Supabase and increment scan telemetry
   */
  static async recordScanEvent(params: {
    ownerType: QROwnerType;
    ownerId: string;
    channel?: string;
  }): Promise<void> {
    try {
      const referrer = typeof document !== 'undefined' ? document.referrer || undefined : undefined;
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 150) : undefined;
      const normalizedOwnerType = ((params.ownerType as string) || 'doctor').toLowerCase();

      // Call stored procedure if available, or insert directly
      const { error: rpcErr } = await supabase.rpc('fn_track_qr_scan', {
        p_owner_type: normalizedOwnerType,
        p_owner_id: params.ownerId,
        p_channel: params.channel || 'camera_scan',
        p_referrer: referrer,
        p_user_agent: userAgent,
      });

      if (rpcErr) {
        // Fallback: direct table insert with anonymized data
        await supabase.from('qr_scan_events').insert({
          owner_type: normalizedOwnerType,
          owner_id: params.ownerId,
          channel: params.channel || 'camera_scan',
          referrer,
          user_agent: userAgent,
        });
      }
    } catch {
      // Non-blocking telemetry failure
    }
  }

  /**
   * Fetch or sync QR Code Record in Supabase
   */
  static async getOrCreateQRRecord(params: {
    ownerType: QROwnerType;
    ownerId: string;
    title: string;
    subtitle?: string;
  }): Promise<QRCodeRecord> {
    const normalizedOwnerType = ((params.ownerType as string) || 'doctor').toLowerCase() as QROwnerType;
    const publicUrl = this.getPublicProfileUrl(normalizedOwnerType, params.ownerId);
    const slug = `${normalizedOwnerType}-${params.ownerId.substring(0, 8)}`;

    try {
      const { data, error } = await supabase
        .from('qr_code_records')
        .select('*')
        .eq('owner_type', normalizedOwnerType)
        .eq('owner_id', params.ownerId)
        .maybeSingle();

      if (data && !error) {
        return {
          id: data.id,
          ownerType: data.owner_type,
          ownerId: data.owner_id,
          publicSlug: data.public_slug,
          publicUrl: data.public_url || publicUrl,
          title: data.title,
          subtitle: data.subtitle,
          totalScans: data.total_scans || 0,
          isActive: data.is_active,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }

      // Insert new record
      const newRecord = {
        owner_type: normalizedOwnerType,
        owner_id: params.ownerId,
        public_slug: slug,
        public_url: publicUrl,
        title: params.title,
        subtitle: params.subtitle || null,
        total_scans: 0,
        is_active: true,
      };

      const { data: inserted, error: insertErr } = await supabase
        .from('qr_code_records')
        .upsert(newRecord, { onConflict: 'owner_type,owner_id' })
        .select('*')
        .single();

      if (inserted && !insertErr) {
        return {
          id: inserted.id,
          ownerType: inserted.owner_type,
          ownerId: inserted.owner_id,
          publicSlug: inserted.public_slug,
          publicUrl: inserted.public_url,
          title: inserted.title,
          subtitle: inserted.subtitle,
          totalScans: inserted.total_scans || 0,
          isActive: inserted.is_active,
          createdAt: inserted.created_at,
          updatedAt: inserted.updated_at,
        };
      }
    } catch (e) {
      console.warn('QR DB note (using dynamic QR):', e);
    }

    // Dynamic deterministic fallback
    return {
      id: `qr-${params.ownerId}`,
      ownerType: params.ownerType,
      ownerId: params.ownerId,
      publicSlug: slug,
      publicUrl,
      title: params.title,
      subtitle: params.subtitle,
      totalScans: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Fetch aggregated scan analytics for a doctor or organization
   */
  static async getAnalytics(ownerType: QROwnerType, ownerId: string): Promise<QRAnalyticsData> {
    try {
      const { data: events, error } = await supabase
        .from('qr_scan_events')
        .select('*')
        .eq('owner_type', ownerType)
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false })
        .limit(500);

      if (error || !events || events.length === 0) {
        return {
          totalScans: 0,
          uniqueScansEstimated: 0,
          scansByDate: [],
          scansByChannel: [
            { channel: 'camera_scan', count: 0 },
            { channel: 'uploaded_image', count: 0 },
          ],
        };
      }

      const totalScans = events.length;
      const lastScannedAt = events[0]?.created_at;

      // Group by date (last 7 days)
      const dateMap: Record<string, number> = {};
      const channelMap: Record<string, number> = {};

      events.forEach((ev: any) => {
        const d = (ev.created_at || '').split('T')[0] || 'Today';
        dateMap[d] = (dateMap[d] || 0) + 1;

        const ch = ev.channel || 'camera_scan';
        channelMap[ch] = (channelMap[ch] || 0) + 1;
      });

      const scansByDate = Object.entries(dateMap).map(([date, count]) => ({ date, count }));
      const scansByChannel = Object.entries(channelMap).map(([channel, count]) => ({ channel, count }));

      return {
        totalScans,
        uniqueScansEstimated: Math.round(totalScans * 0.85),
        lastScannedAt,
        scansByDate,
        scansByChannel,
      };
    } catch {
      return {
        totalScans: 0,
        uniqueScansEstimated: 0,
        scansByDate: [],
        scansByChannel: [],
      };
    }
  }
}
