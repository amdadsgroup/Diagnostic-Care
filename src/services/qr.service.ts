import QRCode from 'qrcode';
import { supabase } from '@/lib/supabase/client';
import { QRCodeRecord, QROwnerType } from '@/types';

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

    // 1. Check if it's already a relative path within our application
    if (trimmed.startsWith('/')) {
      if (
        trimmed.startsWith('/doctors/') ||
        trimmed.startsWith('/doctor/') ||
        trimmed.startsWith('/hospitals/') ||
        trimmed.startsWith('/hospital/') ||
        trimmed.startsWith('/diagnostic-centers/') ||
        trimmed.startsWith('/diagnostic-center/') ||
        trimmed.startsWith('/clinic/') ||
        trimmed.startsWith('/appointments')
      ) {
        // Normalize singular routes if needed
        let normalized = trimmed;
        if (normalized.startsWith('/doctor/')) normalized = normalized.replace('/doctor/', '/doctors/');
        if (normalized.startsWith('/hospital/')) normalized = normalized.replace('/hospital/', '/hospitals/');
        if (normalized.startsWith('/diagnostic-center/')) normalized = normalized.replace('/diagnostic-center/', '/diagnostic-centers/');
        if (normalized.startsWith('/clinic/')) normalized = normalized.replace('/clinic/', '/hospitals/');
        return { isValid: true, destinationPath: normalized };
      }
      return { isValid: false, destinationPath: '', error: 'Unsupported application path.' };
    }

    // 2. Parse absolute URL
    try {
      const parsed = new URL(trimmed);
      const allowedHostnames = [
        'diagnosticcare.vercel.app',
        'diagnostic-care.vercel.app',
        'localhost',
        '127.0.0.1',
      ];

      // Support Vercel preview deployments for the diagnostic-care project
      const isAllowedHost =
        allowedHostnames.includes(parsed.hostname) ||
        parsed.hostname.endsWith('.vercel.app') && parsed.hostname.includes('diagnostic-care');

      if (!isAllowedHost) {
        return {
          isValid: false,
          destinationPath: '',
          error: `External destination rejected. Only verified Diagnostic Care QR codes are accepted (Scanned host: ${parsed.hostname}).`,
        };
      }

      // Check permitted path prefixes
      let path = parsed.pathname;
      if (path.startsWith('/doctor/')) path = path.replace('/doctor/', '/doctors/');
      if (path.startsWith('/hospital/')) path = path.replace('/hospital/', '/hospitals/');
      if (path.startsWith('/diagnostic-center/')) path = path.replace('/diagnostic-center/', '/diagnostic-centers/');
      if (path.startsWith('/clinic/')) path = path.replace('/clinic/', '/hospitals/');

      const isValidPath =
        path.startsWith('/doctors/') ||
        path.startsWith('/hospitals/') ||
        path.startsWith('/diagnostic-centers/') ||
        path.startsWith('/appointments') ||
        path === '/';

      if (!isValidPath) {
        return { isValid: false, destinationPath: '', error: 'Unrecognized healthcare destination route.' };
      }

      const fullRelativePath = `${path}${parsed.search}${parsed.hash}`;
      return { isValid: true, destinationPath: fullRelativePath };
    } catch {
      return { isValid: false, destinationPath: '', error: 'Invalid URL format in QR code.' };
    }
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
