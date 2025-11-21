import { z } from "zod";

export const createStatusSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    order: z.number().int().min(0, "Order must be a non-negative integer"),
    business_id: z.number().int().positive("Business ID is required and must be positive")
  })
});

export const updateStatusSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive())
  }),
  body: z.object({
    name: z.string().min(1, "Name is required").optional(),
    order: z.number().int().min(0, "Order must be a non-negative integer").optional()
  }).refine(data => data.name !== undefined || data.order !== undefined, {
    message: 'At least one field (name or order) must be provided'
  })
});

export const statusIdSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive())
  })
});

export const getStatusByBusinessSchema = z.object({
  params: z.object({
    businessId: z.string().regex(/^\d+$/, 'Business ID must be a valid number')
  })
});

export type CreateStatusInput = z.infer<typeof createStatusSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type StatusIdInput = z.infer<typeof statusIdSchema>;
export type GetStatusByBusinessInput = z.infer<typeof getStatusByBusinessSchema>;
