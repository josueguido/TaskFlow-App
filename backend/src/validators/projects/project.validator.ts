import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../errors/BadRequestError";
import { contextLogger } from "../../utils/contextLogger";

export const validate =
  (schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
      contextLogger.debug('Validating request body', {
        path: req.path,
        action: 'VALIDATE_REQUEST'
      });

      const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query
      });

      if (!result.success) {
        const formatted = result.error.format();
        contextLogger.error('Validation error', {
          path: req.path,
          action: 'VALIDATION_FAILED',
          errors: JSON.stringify(formatted)
        });
        throw new BadRequestError("Validation failed: " + JSON.stringify(formatted));
      }

      if (result.data.body) req.body = result.data.body;
      if (result.data.params) req.params = result.data.params;
      if (result.data.query) req.query = result.data.query;

      next();
    };

export const validateProjectId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    throw new BadRequestError('Valid project ID is required');
  }
  next();
};

export const validateBusinessId = (req: Request, res: Response, next: NextFunction) => {
  const { businessId } = req.params;
  if (!businessId || isNaN(Number(businessId))) {
    throw new BadRequestError('Valid business ID is required');
  }
  next();
};
