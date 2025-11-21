import { z } from "zod";

export const parsePositiveInteger = (fieldName: string) =>
  z.string().transform(val => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num <= 0) {
      throw new Error(`${fieldName} must be a positive integer`);
    }
    return num;
  });

export const positiveInteger = (fieldName: string) =>
  z.number().int().positive(`${fieldName} must be a positive integer`);

export const paginationSchema = z.object({
  page: z.string().transform(val => Math.max(1, parseInt(val, 10) || 1)),
  limit: z.string().transform(val => Math.min(100, Math.max(1, parseInt(val, 10) || 10)))
});
