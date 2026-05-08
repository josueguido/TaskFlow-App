import Redis from 'ioredis';
import { logger } from '../utils/logger';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;

export const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  retryStrategy: (times) => {
    if (times > 5) {
      logger.error('Redis: max reconnect attempts reached');
      return null;
    }
    return Math.min(times * 200, 2000);
  },
  enableOfflineQueue: false,
});

redis.on('connect', () => logger.info('Redis: connected'));
redis.on('ready', () => logger.info('Redis: ready'));
redis.on('error', (err: Error) => logger.error('Redis error', { error: err.message }));
redis.on('close', () => logger.warn('Redis: connection closed'));
redis.on('reconnecting', () => logger.info('Redis: reconnecting'));

/**
 * Delete all keys matching a glob pattern.
 * Uses SCAN to avoid blocking the server (safe for production).
 */
export const invalidatePattern = async (pattern: string): Promise<void> => {
  let cursor = '0';
  do {
    const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
    cursor = nextCursor;
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } while (cursor !== '0');
};
