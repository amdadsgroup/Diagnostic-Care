import { supabase } from '@/lib/supabase/client';

export class StorageService {
  /**
   * Upload file to Supabase Storage bucket
   */
  static async uploadFile(
    bucket: string,
    filePath: string,
    file: File | Blob
  ): Promise<{ path: string | null; error: string | null }> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        return { path: null, error: error.message };
      }

      return { path: data.path, error: null };
    } catch (err: any) {
      return { path: null, error: err.message || 'Upload failed' };
    }
  }

  /**
   * Get public URL for public bucket assets (avatars, logos, covers)
   */
  static getPublicUrl(bucket: string, filePath: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  }

  /**
   * Generate short-lived signed URL for sensitive private healthcare files (prescriptions, reports)
   */
  static async getSignedUrl(
    bucket: string,
    filePath: string,
    expiresInSeconds: number = 900 // 15 minutes
  ): Promise<{ signedUrl: string | null; error: string | null }> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, expiresInSeconds);

      if (error) {
        return { signedUrl: null, error: error.message };
      }

      return { signedUrl: data.signedUrl, error: null };
    } catch (err: any) {
      return { signedUrl: null, error: err.message || 'Could not generate signed URL' };
    }
  }
}
