import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/AppError';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
    return;
  }

  if (err.name === 'DatabaseError' || err.message.includes('relation')) {
    res.status(500).json({
      status: 'error',
      message: 'Database operation failed',
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
    return;
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({
      status: 'error',
      message: 'Authentication failed',
    });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      details: err.message
    });
    return;
  }

  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
