/**
 * Diagnostic Care — Intelligent Client-Side Caching & Request Deduplication
 * Stale-While-Revalidate pattern with in-memory & session storage tiers.
 * Guarantees zero blocking loaders on repeat visits and deduplicates concurrent queries.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();
const inflightRequests = new Map<string, Promise<any>>();

// Default TTLs
export const CACHE_TTL = {
  DOCTORS_LIST: 3 * 60 * 1000, // 3 minutes
  DOCTOR_DETAIL: 5 * 60 * 1000, // 5 minutes
  HOSPITALS_LIST: 5 * 60 * 1000, // 5 minutes
  HOSPITAL_DETAIL: 10 * 60 * 1000, // 10 minutes
  DIAGNOSTIC_CENTERS: 5 * 60 * 1000, // 5 minutes
  LAB_TESTS: 5 * 60 * 1000, // 5 minutes
  SPECIALTIES: 30 * 60 * 1000, // 30 minutes
  LOCATIONS: 60 * 60 * 1000, // 1 hour
};

/**
 * Fetch data with caching, request deduplication, and stale-while-revalidate
 */
export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttlMs?: number;
    persist?: boolean;
    onBackgroundUpdate?: (data: T) => void;
  } = {}
): Promise<{ data: T; fromCache: boolean }> {
  const ttl = options.ttlMs ?? CACHE_TTL.DOCTORS_LIST;
  const now = Date.now();

  // 1. Check in-memory cache
  let cached = memoryCache.get(key);

  // 2. Fallback to session storage if not in memory
  if (!cached && options.persist && typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem(`dc_cache_${key}`);
      if (stored) {
        const parsed: CacheEntry<T> = JSON.parse(stored);
        if (now - parsed.timestamp < parsed.ttl * 2) {
          cached = parsed;
          memoryCache.set(key, parsed);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }

  // If valid cached entry exists
  if (cached) {
    const isStale = now - cached.timestamp > cached.ttl;

    // If still fresh, return immediately
    if (!isStale) {
      return { data: cached.data, fromCache: true };
    }

    // If stale, trigger background revalidation without blocking
    if (options.onBackgroundUpdate) {
      triggerBackgroundRevalidate(key, fetcher, ttl, options.persist, options.onBackgroundUpdate);
    }

    return { data: cached.data, fromCache: true };
  }

  // 3. Request deduplication: check if identical request is already inflight
  if (inflightRequests.has(key)) {
    const data = await inflightRequests.get(key);
    return { data, fromCache: false };
  }

  // 4. Execute fetcher with deduplication
  const fetchPromise = (async () => {
    try {
      const data = await fetcher();

      // Store in memory cache
      const entry: CacheEntry<T> = { data, timestamp: Date.now(), ttl };
      memoryCache.set(key, entry);

      // Optionally persist
      if (options.persist && typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(`dc_cache_${key}`, JSON.stringify(entry));
        } catch {
          // Ignore storage quota errors
        }
      }

      return data;
    } finally {
      inflightRequests.delete(key);
    }
  })();

  inflightRequests.set(key, fetchPromise);
  const data = await fetchPromise;
  return { data, fromCache: false };
}

/**
 * Background revalidation helper
 */
async function triggerBackgroundRevalidate<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number,
  persist?: boolean,
  callback?: (data: T) => void
) {
  if (inflightRequests.has(key)) return;

  const fetchPromise = (async () => {
    try {
      const freshData = await fetcher();
      const entry: CacheEntry<T> = { data: freshData, timestamp: Date.now(), ttl };
      memoryCache.set(key, entry);

      if (persist && typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(`dc_cache_${key}`, JSON.stringify(entry));
        } catch {}
      }

      if (callback) {
        callback(freshData);
      }
      return freshData;
    } catch {
      // Ignore background errors
    } finally {
      inflightRequests.delete(key);
    }
  })();

  inflightRequests.set(key, fetchPromise);
}

/**
 * Synchronous cache lookup for instantaneous initial state hydration
 */
export function getCachedData<T>(key: string, persist = false): T | null {
  const now = Date.now();
  const cached = memoryCache.get(key);

  if (cached && now - cached.timestamp < cached.ttl * 2) {
    return cached.data;
  }

  if (persist && typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem(`dc_cache_${key}`);
      if (stored) {
        const parsed: CacheEntry<T> = JSON.parse(stored);
        if (now - parsed.timestamp < parsed.ttl * 2) {
          memoryCache.set(key, parsed);
          return parsed.data;
        }
      }
    } catch {}
  }

  return null;
}

/**
 * Invalidate cache entry
 */
export function invalidateCache(key: string) {
  memoryCache.delete(key);
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem(`dc_cache_${key}`);
    } catch {}
  }
}
