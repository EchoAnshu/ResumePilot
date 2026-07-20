interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const store = new Map<string, CacheEntry<unknown>>()
const DEFAULT_TTL_MS = 30_000

export function getCached<T>(key: string): T | undefined {
  const entry = store.get(key)
  if (!entry) return undefined
  if (Date.now() > entry.expiresAt) {
    store.delete(key)
    return undefined
  }
  return entry.data as T
}

export function setCache<T>(key: string, data: T, ttlMs = DEFAULT_TTL_MS): void {
  if (store.size > 100) {
    const firstKey = store.keys().next().value
    if (firstKey) store.delete(firstKey)
  }
  store.set(key, { data, expiresAt: Date.now() + ttlMs })
}

export function invalidateCache(pattern?: string): void {
  if (!pattern) {
    store.clear()
    return
  }
  for (const key of store.keys()) {
    if (key.startsWith(pattern)) store.delete(key)
  }
}
