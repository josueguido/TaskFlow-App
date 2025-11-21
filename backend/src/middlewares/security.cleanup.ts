import { failedAttempts } from './security.middleware';
import { logger } from '../utils/logger';

const CLEANUP_INTERVAL = 30 * 60 * 1000;
const MAX_ENTRIES = 10000;

export function startSecurityCleanup() {
  setInterval(() => {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;

    for (const [ip, data] of failedAttempts.entries()) {
      if (now - data.lastAttempt > windowMs) {
        failedAttempts.delete(ip);
      }
    }

    if (failedAttempts.size > MAX_ENTRIES) {
      const sorted = Array.from(failedAttempts.entries()).sort(
        ([, a], [, b]) => a.lastAttempt - b.lastAttempt
      );

      const toRemove = sorted.slice(0, failedAttempts.size - MAX_ENTRIES);
      toRemove.forEach(([ip]) => failedAttempts.delete(ip));
    }

    logger.info(`Security cleanup done. Failed attempts: ${failedAttempts.size}`);
  }, CLEANUP_INTERVAL);
}
