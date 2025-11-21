import { z } from 'zod';

export const addUserToProjectSchema = z.object({
  body: z.object({
    userId: z.number({
      required_error: 'User ID is required',
      invalid_type_error: 'User ID must be a number'
    }).int().positive(),
    role: z.enum(['admin', 'member']).optional().default('member')
  })
});

export const updateUserRoleSchema = z.object({
  params: z.object({
    projectId: z.string().regex(/^\d+$/, 'Project ID must be a valid number'),
    userId: z.string().regex(/^\d+$/, 'User ID must be a valid number')
  }),
  body: z.object({
    role: z.enum(['admin', 'member'], {
      required_error: 'Role is required',
      invalid_type_error: 'Role must be either "admin" or "member"'
    })
  })
});

export const projectUserIdSchema = z.object({
  params: z.object({
    projectId: z.string().regex(/^\d+$/, 'Project ID must be a valid number'),
    userId: z.string().regex(/^\d+$/, 'User ID must be a valid number')
  })
});

export const getProjectUsersSchema = z.object({
  params: z.object({
    projectId: z.string().regex(/^\d+$/, 'Project ID must be a valid number')
  })
});

export type AddUserToProjectInput = z.infer<typeof addUserToProjectSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type ProjectUserIdInput = z.infer<typeof projectUserIdSchema>;
export type GetProjectUsersInput = z.infer<typeof getProjectUsersSchema>;
