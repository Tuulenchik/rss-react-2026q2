const DEFAULT_CACHE_TTL_SECONDS = 300;

export function getCacheTtlSeconds() {
  const cacheTtl = Number(import.meta.env.VITE_RTK_QUERY_CACHE_TTL_SECONDS);

  if (!Number.isFinite(cacheTtl) || cacheTtl < 0) {
    return DEFAULT_CACHE_TTL_SECONDS;
  }

  return cacheTtl;
}
