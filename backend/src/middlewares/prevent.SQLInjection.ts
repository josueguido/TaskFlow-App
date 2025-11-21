import { RequestHandler } from 'express';
import { logger } from '../utils/logger';
import { BadRequestError } from '../errors/BadRequestError';

const sqlInjectionPatterns = [
  /\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b/gi,
  /\b(OR|AND)\s+\d+\s*=\s*\d+/gi,
  /(--|\/\*|\*\/)/g,
  /\b(WAITFOR|DELAY)\b/gi,
  /\b(xp_|sp_)\w+/gi
];

const checkForSQLInjection = (value: string): boolean => {
  return sqlInjectionPatterns.some(pattern => pattern.test(value));
};

const validateFields = (obj: any, fields: string[], strict: boolean) => {
  for (const field of fields) {
    const value = obj?.[field];
    if (typeof value === 'string' && checkForSQLInjection(value)) {
      if (strict) {
        throw new BadRequestError(`Invalid input in field "${field}"`);
      } else {
        logger.warn(`Potential SQL Injection detected in "${field}": ${value}`);
      }
    }
  }
};

export const preventSQLInjection = (fieldsToCheck: string[], strictMode = false): RequestHandler => {
  return (req, res, next) => {
    try {
      if (req.body) {
        validateFields(req.body, fieldsToCheck, strictMode);
      }

      if (req.query) {
        validateFields(req.query, fieldsToCheck, strictMode);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
