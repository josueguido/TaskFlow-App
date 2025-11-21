import { z } from 'zod';

export const createBusinessSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  admin_name: z.string().min(2, 'Admin name must be at least 2 characters'),
  admin_email: z.string().email('Invalid admin email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const updateBusinessSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  owner_id: z.number().int().positive().optional()
});

export type CreateBusinessRequest = z.infer<typeof createBusinessSchema>;
export type UpdateBusinessRequest = z.infer<typeof updateBusinessSchema>;
