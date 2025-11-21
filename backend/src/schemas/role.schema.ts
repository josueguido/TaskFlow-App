import { z } from "zod";

export const roleSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Role name is required"),
});

export const createRoleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
});

export const updateRoleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
});

