import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { requestContext } from '../utils/contextLogger';

const SKIP_PATHS = ['/metrics', '/health', '/favicon.ico'];

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = (req.headers['x-request-id'] || uuidv4()) as string;
  // Capturar originalUrl AQUÍ — req.path muta cuando Express procesa routers anidados
  const route = req.originalUrl;

  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);

  if (SKIP_PATHS.some((p) => req.path.startsWith(p))) {
    return next();
  }

  requestContext.run({ requestId }, () => {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
      logger.log(level, 'Request completed', {
        requestId,
        method: req.method,
        route,
        statusCode: res.statusCode,
        duration,
        userId: req.user?.userId,
        ip: req.ip,
      });
    });

    next();
  });
};
