import { z } from "zod";

export const taskParamsSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive()),
});

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    status_id: z.string().min(1, "Status is required"),
  })
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status_id: z.string().min(1).optional(),
  })
});

export const changeStatusSchema = z.object({
  body: z.object({
    statusId: z.number({
      required_error: 'Status ID is required',
      invalid_type_error: 'Status ID must be a number'
    }).int().positive('Status ID must be positive')
  })
});

export const assignUsersSchema = z.object({
  body: z.object({
    user_id: z.number({
      required_error: 'User ID is required',
      invalid_type_error: 'User ID must be a number'
    }).int().positive('User ID must be positive')
  })
});
