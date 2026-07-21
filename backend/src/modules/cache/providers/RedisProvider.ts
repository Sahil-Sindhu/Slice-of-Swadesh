import Redis from "ioredis";
import { CacheProvider } from "./CacheProvider";

export class RedisProvider implements CacheProvider {
  private client: Redis;

  constructor(redisUrl: string) {
    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 1, // Don't hang indefinitely if Redis is down
      retryStrategy(times) {
        if (times > 3) {
          return null; // Stop retrying after 3 times, fallback logic can handle it if needed
        }
        return Math.min(times * 50, 2000);
      }
    });

    this.client.on('error', (err) => {
      console.error('[RedisProvider] Redis error:', err.message);
    });
  }

  async get(key: string): Promise<any | null> {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn(`[RedisProvider] Failed to get key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      if (ttlSeconds) {
        await this.client.set(key, stringValue, "EX", ttlSeconds);
      } else {
        await this.client.set(key, stringValue);
      }
    } catch (error) {
      console.warn(`[RedisProvider] Failed to set key ${key}:`, error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.warn(`[RedisProvider] Failed to delete key ${key}:`, error);
    }
  }
}
