import { RequestHandler } from 'express';
import { logger } from '../utils/logger';

export const securityLogger: RequestHandler = (req, res, next) => {
  const startTime = Date.now();
  const ignoredPaths = ['/favicon.ico', '/docs', '/health'];
  if (ignoredPaths.includes(req.path)) return next();

  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  const originalEnd = res.end.bind(res);
  res.end = function (chunk?: any, encoding?: any, cb?: any) {
    const duration = Date.now() - startTime;

    logger.info(`Response ${res.statusCode} - ${duration}ms`, {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      ip: req.ip,
    });

    if (res.statusCode >= 400) {
      logger.warn(`Suspicious activity detected`, {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        body: { ...(req.body?.email && { email: req.body.email }) },
        params: req.params,
        query: req.query
      });
    }

    return originalEnd(chunk, encoding, cb);
  };

  next();
};


export const failedAttempts = new Map<string, { count: number; lastAttempt: number }>();

export const bruteForceProtection: RequestHandler = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 5;

  const attempts = failedAttempts.get(ip);

  if (attempts && attempts.count >= maxAttempts) {
    if (now - attempts.lastAttempt < windowMs) {
      logger.warn(`Brute force attack detected from IP: ${ip}`, {
        ip,
        attempts: attempts.count,
        path: req.path,
        userAgent: req.get('User-Agent')
      });

      res.status(429).json({
        status: 'error',
        message: 'Too many failed attempts. Please try again later.'
      });
      return;
    } else {
      failedAttempts.delete(ip);
    }
  }

  const originalEnd = res.end.bind(res);
  res.end = function (chunk?: any, encoding?: any, cb?: any) {
    if (res.statusCode === 401 || res.statusCode === 403) {
      const current = failedAttempts.get(ip) || { count: 0, lastAttempt: 0 };
      failedAttempts.set(ip, {
        count: current.count + 1,
        lastAttempt: now
      });
    }

    return originalEnd(chunk, encoding, cb);
  };

  next();
};
