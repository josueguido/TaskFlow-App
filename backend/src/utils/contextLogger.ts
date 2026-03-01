import { AsyncLocalStorage } from 'async_hooks';
import { logger } from './logger';

export const requestContext = new AsyncLocalStorage<{ requestId?: string; userId?: string }>();

export const contextLogger = {
  info: (message: string, meta?: Record<string, any>) => {
    const context = requestContext.getStore();
    logger.info(message, {
      ...meta,
      requestId: context?.requestId,
      userId: context?.userId,
    });
  },

  error: (message: string, meta?: Record<string, any>) => {
    const context = requestContext.getStore();
    logger.error(message, {
      ...meta,
      requestId: context?.requestId,
      userId: context?.userId,
    });
  },

  warn: (message: string, meta?: Record<string, any>) => {
    const context = requestContext.getStore();
    logger.warn(message, {
      ...meta,
      requestId: context?.requestId,
      userId: context?.userId,
    });
  },

  debug: (message: string, meta?: Record<string, any>) => {
    const context = requestContext.getStore();
    logger.debug(message, {
      ...meta,
      requestId: context?.requestId,
      userId: context?.userId,
    });
  },
};
