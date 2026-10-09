import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

let adminInstance: SupabaseClient | null = null;

/**
 * Creates a privileged Supabase client using the service role key.
 * Strictly forbidden on the client side; only for secure server-side operations and edge handlers.
 */
export function getAdminClient(): SupabaseClient {
  if (typeof window !== 'undefined') {
    throw new Error('SECURITY VIOLATION: Admin client cannot be instantiated in browser context!');
  }

  if (!adminInstance) {
    adminInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        fetch: (input, init) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1200);
          if (init?.signal) {
            init.signal.addEventListener('abort', () => controller.abort());
          }
          return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timeoutId));
        },
      },
    });
  }

  return adminInstance;
}
