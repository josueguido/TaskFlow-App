import { RequestHandler } from 'express';

const sanitizeString = (str: string): string => {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

const sanitizeFields = (obj: any, fields: string[]) => {
  for (const field of fields) {
    if (typeof obj?.[field] === 'string') {
      obj[field] = sanitizeString(obj[field]);
    }
  }
};


export const sanitizeInput = (fieldsToSanitize: string[]): RequestHandler => {
  return (req, res, next) => {
    if (req.body) {
      sanitizeFields(req.body, fieldsToSanitize);
    }

    if (req.query) {
      sanitizeFields(req.query, fieldsToSanitize);
    }

    next();
  };
};
