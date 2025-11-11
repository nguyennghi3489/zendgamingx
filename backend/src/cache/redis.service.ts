import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Acquire a distributed lock with a timeout
   * @param key Lock identifier
   * @param ttl Time to live in seconds
   * @param maxRetries Maximum number of retry attempts
   * @param retryDelay Delay between retries in milliseconds
   */
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
        // Try to get existing lock
        const existingLock = await this.cacheManager.get(lockKey);

        // If no lock exists, set it
        if (!existingLock) {
          await this.cacheManager.set(lockKey, lockValue, ttl * 1000);

          // Verify we got the lock by checking if our value is there
          const verifyLock = await this.cacheManager.get(lockKey);
          if (verifyLock === lockValue) {
            return true;
          }
        }
      } catch (error) {
        // Log error but continue retrying
        console.error('Error acquiring lock:', error);
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }

    return false;
  }

  /**
   * Release a distributed lock
   * @param key Lock identifier
   */
  async releaseLock(key: string): Promise<void> {
    const lockKey = `lock:${key}`;
    try {
      await this.cacheManager.del(lockKey);
    } catch (error) {
      console.error('Error releasing lock:', error);
    }
  }

  /**
   * Execute a function with distributed lock
   * @param key Lock identifier
   * @param fn Function to execute
   * @param ttl Lock TTL in seconds
   */
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
