import { CacheProvider } from "./CacheProvider";

interface CacheEntry {
  value: any;
  expiry: number | null;
}

export class MemoryProvider implements CacheProvider {
  private cache = new Map<string, CacheEntry>();

  async get(key: string): Promise<any | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (entry.expiry !== null && Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.cache.set(key, { value, expiry });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }
}
