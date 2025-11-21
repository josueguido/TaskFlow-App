import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    businessId: z.number({
      required_error: 'Business ID is required',
      invalid_type_error: 'Business ID must be a number'
    }).int().positive('Business ID must be a positive integer'),
    name: z.string({
      required_error: 'Project name is required',
      invalid_type_error: 'Project name must be a string'
    }).min(1, 'Project name cannot be empty').max(255, 'Project name must be less than 255 characters'),
    description: z.string().max(1000, 'Description must be less than 1000 characters').optional()
  })
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Project ID must be a valid number')
  }),
  body: z.object({
    name: z.string().min(1, 'Project name cannot be empty').max(255, 'Project name must be less than 255 characters').optional(),
    description: z.string().max(1000, 'Description must be less than 1000 characters').optional()
  }).refine(data => data.name !== undefined || data.description !== undefined, {
    message: 'At least one field (name or description) must be provided'
  })
});

export const getProjectsByBusinessSchema = z.object({
  params: z.object({
    businessId: z.string().regex(/^\d+$/, 'Business ID must be a valid number')
  })
});

export const getProjectByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Project ID must be a valid number')
  })
});

export const deleteProjectSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Project ID must be a valid number')
  })
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type GetProjectsByBusinessInput = z.infer<typeof getProjectsByBusinessSchema>;
export type GetProjectByIdInput = z.infer<typeof getProjectByIdSchema>;
export type DeleteProjectInput = z.infer<typeof deleteProjectSchema>;
