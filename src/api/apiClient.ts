export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

// In-memory cache for GET requests: stores { data, expiry }
const cache = new Map<string, { data: any; expiry: number }>();
// In-flight request deduplication map to prevent multiple identical network calls
const pendingRequests = new Map<string, Promise<any>>();

const DEFAULT_CACHE_TTL = 1000 * 60 * 3; // 3 minutes
const REQUEST_TIMEOUT_MS = 15000; // 15 seconds production timeout

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {},
  cacheTtl: number = DEFAULT_CACHE_TTL
): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Helper to attach timeout controller
  const createTimedSignal = (signal?: AbortSignal | null) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(new Error('Request timeout')), REQUEST_TIMEOUT_MS);
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        controller.abort();
      });
    }
    return { signal: controller.signal, cleanup: () => clearTimeout(timeoutId) };
  };

  // For non-GET requests (mutations), skip cache and invalidate cache
  if (method !== 'GET') {
    cache.clear();
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const { signal, cleanup } = createTimedSignal(options.signal);
    try {
      const response = await fetch(url, {
        ...options,
        signal,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      const json: ApiResponse<T> = await response.json();

      if (!response.ok || json.success === false) {
        throw new Error(json.message || `API request failed with status ${response.status}`);
      }

      return (json.data !== undefined ? json.data : json) as T;
    } finally {
      cleanup();
    }
  }

  // 1. Check in-memory cache for GET requests
  const cached = cache.get(url);
  if (cached && Date.now() < cached.expiry) {
    return cached.data as T;
  }

  // 2. Request deduplication: reuse active in-flight request if one is already pending
  if (pendingRequests.has(url)) {
    return pendingRequests.get(url) as Promise<T>;
  }

  // 3. Execute network fetch
  const fetchPromise = (async () => {
    const { signal, cleanup } = createTimedSignal(options.signal);
    try {
      const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      const response = await fetch(url, {
        ...options,
        signal,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      const json: ApiResponse<T> = await response.json();

      if (!response.ok || json.success === false) {
        throw new Error(json.message || `API request failed with status ${response.status}`);
      }

      const result = (json.data !== undefined ? json.data : json) as T;

      // Cache the result
      if (cacheTtl > 0) {
        cache.set(url, {
          data: result,
          expiry: Date.now() + cacheTtl,
        });
      }

      return result;
    } finally {
      cleanup();
      pendingRequests.delete(url);
    }
  })();

  pendingRequests.set(url, fetchPromise);
  return fetchPromise;
}

/**
 * Invalidate in-memory cache to force fresh data fetching.
 * If pattern is provided, only matching URLs are evicted.
 */
export function invalidateCache(pattern?: string): void {
  if (!pattern) {
    cache.clear();
    return;
  }
  const needle = pattern.toLowerCase();
  for (const key of cache.keys()) {
    if (key.toLowerCase().includes(needle)) {
      cache.delete(key);
    }
  }
}
