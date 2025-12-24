import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { requestContext } from '../utils/contextLogger';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = (req.headers['x-request-id'] || uuidv4()) as string;

  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);

  requestContext.run({ requestId, userId: req.user?.userId }, () => {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      logger.info('Request completed', {
        requestId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userId: req.user?.userId,
        ip: req.ip
      });
    });

    next();
  });
};
