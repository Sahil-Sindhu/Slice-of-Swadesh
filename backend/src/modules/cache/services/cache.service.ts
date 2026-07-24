import { CacheProvider } from "../providers/CacheProvider";
import { MemoryProvider } from "../providers/MemoryProvider";
import { RedisProvider } from "../providers/RedisProvider";
import { logger } from "../../../utils/logger";

export class CacheService {
  private static provider: CacheProvider;

  static initialize() {
    if (!this.provider) {
      if (process.env.REDIS_URL) {
        logger.info("Initializing Redis provider...", { service: 'cache' });
        this.provider = new RedisProvider(process.env.REDIS_URL);
      } else {
        logger.info("REDIS_URL not found. Falling back to Memory provider...", { service: 'cache' });
        this.provider = new MemoryProvider();
      }
    }
  }

  private static ensureInitialized() {
    if (!this.provider) {
      this.initialize();
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    this.ensureInitialized();
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return this.provider.get(key);
  }

  static async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    this.ensureInitialized();
    return this.provider.set(key, value, ttlSeconds);
  }

  static async delete(key: string): Promise<void> {
    this.ensureInitialized();
    return this.provider.delete(key);
  }

  /**
   * Cache-aside pattern implementation.
   * Checks the cache first. If hit, returns data.
   * If miss, runs the fallback function, caches the result, and returns data.
   */
  static async getOrSet<T>(key: string, fallbackFn: () => Promise<T>, ttlSeconds?: number): Promise<T> {
    this.ensureInitialized();

    if (process.env.NODE_ENV === 'development') {
      return fallbackFn();
    }

    const cached = await this.provider.get(key);
    if (cached) {
      return cached as T;
    }

    const freshData = await fallbackFn();
    
    // Only cache if there's actual data
    if (freshData !== undefined && freshData !== null) {
      await this.provider.set(key, freshData, ttlSeconds);
    }

    return freshData;
  }
}
