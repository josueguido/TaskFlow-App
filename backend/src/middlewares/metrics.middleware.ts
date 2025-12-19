import { Request, Response, NextFunction } from 'express';
import {
  httpRequestDuration,
  httpRequestTotal,
  errorTotal
} from '../utils/metrics';

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/metrics') {
    return next();
  }

  const start = Date.now();
  const route = `${req.method} ${req.route?.path || req.path}`;

  const originalSend = res.send;
  res.send = function (data) {
    const duration = (Date.now() - start) / 1000;
    const statusCode = res.statusCode.toString();

    httpRequestDuration.labels(req.method, route, statusCode).observe(duration);
    httpRequestTotal.labels(req.method, route, statusCode).inc();

    if (parseInt(statusCode) >= 500) {
      errorTotal.labels('http_error', route).inc();
    }

    return originalSend.call(this, data);
  };

  next();
};

export const errorMetricsMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  const route = `${req.method} ${req.route?.path || req.path}`;
  errorTotal.labels(err.name || 'unknown_error', route).inc();
  next(err);
};
