import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async acquireLock(
    key: string,
    ttl: number = 10,
    maxRetries: number = 5,
    retryDelay: number = 100,
  ): Promise<boolean> {
    const lockKey = `lock:${key}`;
    const lockValue = Date.now().toString();

    for (let i = 0; i < maxRetries; i++) {
      try {
        const existingLock = await this.cacheManager.get(lockKey);

        if (!existingLock) {
          await this.cacheManager.set(lockKey, lockValue, ttl * 1000);

          const verifyLock = await this.cacheManager.get(lockKey);
          if (verifyLock === lockValue) {
            return true;
          }
        }
      } catch (error) {
        console.error('Error acquiring lock:', error);
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }

    return false;
  }

  async releaseLock(key: string): Promise<void> {
    const lockKey = `lock:${key}`;
    try {
      await this.cacheManager.del(lockKey);
    } catch (error) {
      console.error('Error releasing lock:', error);
    }
  }

  async withLock<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = 10,
  ): Promise<T> {
    const acquired = await this.acquireLock(key, ttl);

    if (!acquired) {
      throw new Error(`Failed to acquire lock for key: ${key}`);
    }

    try {
      return await fn();
    } finally {
      await this.releaseLock(key);
    }
  }
}
