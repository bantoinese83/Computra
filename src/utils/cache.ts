import { UserPreferences } from '../types';
import { RecommendationResult, ProviderOffer, GpuSpec } from '../types';

interface CachedResults {
  recommendation: RecommendationResult;
  offers: ProviderOffer[];
  gpuSpecs: Record<string, GpuSpec>;
  groundingSources: { title: string; uri: string }[];
  timestamp: number;
}

const CACHE_KEY_PREFIX = 'computra_results_';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate a cache key from user preferences
 */
function getCacheKey(prefs: UserPreferences): string {
  const prefsString = JSON.stringify(prefs);
  // Simple hash function for cache key
  let hash = 0;
  for (let i = 0; i < prefsString.length; i++) {
    const char = prefsString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `${CACHE_KEY_PREFIX}${Math.abs(hash)}`;
}

/**
 * Check if cached data is still valid
 */
function isCacheValid(timestamp: number): boolean {
  const now = Date.now();
  return now - timestamp < CACHE_TTL_MS;
}

/**
 * Get cached results for given preferences
 */
export function getCachedResults(
  prefs: UserPreferences,
): CachedResults | null {
  try {
    const cacheKey = getCacheKey(prefs);
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) {
      return null;
    }

    const parsed: CachedResults = JSON.parse(cached);
    
    if (!isCacheValid(parsed.timestamp)) {
      // Cache expired, remove it
      localStorage.removeItem(cacheKey);
      return null;
    }

    return parsed;
  } catch (error) {
    // If there's any error reading cache, return null
    return null;
  }
}

/**
 * Store results in cache
 */
export function setCachedResults(
  prefs: UserPreferences,
  data: Omit<CachedResults, 'timestamp'>,
): void {
  try {
    const cacheKey = getCacheKey(prefs);
    const cached: CachedResults = {
      ...data,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cached));
  } catch (error) {
    // If storage is full or unavailable, silently fail
    // Don't break the app if caching fails
  }
}

/**
 * Clear all cached results (useful for testing or manual refresh)
 */
export function clearCache(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    // Silently fail
  }
}

