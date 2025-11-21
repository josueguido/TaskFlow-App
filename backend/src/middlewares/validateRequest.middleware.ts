import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';
import { BadRequestError } from '../errors/BadRequestError';


export const validateRequest = (
  schema: ZodSchema<any>
): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      throw new BadRequestError(
        JSON.stringify(result.error.flatten().fieldErrors)
      );
    }

    if (result.data.body) req.body = result.data.body;
    if (result.data.params) req.params = result.data.params;
    if (result.data.query) req.query = result.data.query;

    next();
  };
};
