import { z } from "zod";

export const taskIdSchema = z.object({
  params: z.object({
    taskId: z.string().refine(val => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num > 0;
    }, {
      message: "Task ID must be a positive integer"
    }),
  }),
});

export const updateAssignmentSchema = z.object({
  body: z.object({
    assignedAt: z.string().datetime().optional(),
  }),
});

export const assignmentIdSchema = z.object({
  params: z.object({
    id: z.number().int().positive("Assignment ID must be a positive integer"),
  }),
});

export const assignmentParamsSchema = z.object({
  params: z.object({
    taskId: z.string().transform(val => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num <= 0) {
        throw new Error("Task ID must be a positive integer");
      }
      return num;
    }),
    userId: z.string().transform(val => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num <= 0) {
        throw new Error("User ID must be a positive integer");
      }
      return num;
    })
  }),
});

export const createAssignmentSchema = z.object({
  body: z.object({
    task_id: z.number().int().positive("Task ID must be a positive integer"),
    user_id: z.number().int().positive("User ID must be a positive integer"),
  }),
});

export const assignUsersSchema = z.object({
  body: z.object({
    userIds: z.array(z.number().int().positive("Each user ID must be a positive integer")).min(1, "At least one user ID is required")
  }),
});

export const deleteAssignmentParamsSchema = z.object({
  params: z.object({
    taskId: z.string().transform(val => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num <= 0) {
        throw new Error("Task ID must be a positive integer");
      }
      return num;
    }),
    userId: z.string().transform(val => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num <= 0) {
        throw new Error("User ID must be a positive integer");
      }
      return num;
    })
  }),
});
