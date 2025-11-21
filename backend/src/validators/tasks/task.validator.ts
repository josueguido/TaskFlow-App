import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../errors/BadRequestError";

export const validate =
  (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const formatted = result.error.format();
        throw new BadRequestError("Validation failed: " + JSON.stringify(formatted));
      }

      req.body = result.data;
      next();
    };
