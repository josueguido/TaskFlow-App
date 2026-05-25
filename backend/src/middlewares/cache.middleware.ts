import { Request, Response, NextFunction } from 'express';
import { redis, invalidatePattern } from '../config/redis';
import { cacheHits, cacheMisses } from '../utils/metrics';

export const cacheResponse = (ttlSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const businessId = req.user?.business_id;
    const key = `cache:${req.method}:${req.originalUrl}:${businessId}`;

    const route = req.route?.path || req.path;

    const cached = await redis.get(key);
    if (cached !== null) {
      cacheHits.labels(route).inc();
      res.setHeader('X-Cache', 'HIT');
      res.json(JSON.parse(cached));
      return;
    }

    cacheMisses.labels(route).inc();
    res.setHeader('X-Cache', 'MISS');
    const originalJson = res.json.bind(res);
    res.json = (body): Response => {
      if (res.statusCode === 200) {
        redis.set(key, JSON.stringify(body), 'EX', ttlSeconds).catch(() => {});
      }
      return originalJson(body);
    };

    next();
  };
};

export const invalidateCache = (pattern: string): Promise<void> =>
  invalidatePattern(`cache:*:${pattern}*`);
