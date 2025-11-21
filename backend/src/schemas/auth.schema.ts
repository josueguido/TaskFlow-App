import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().min(3),
    business_id: z.number().int().positive(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    token: z.string().uuid(),
  }),
});

export const logoutSchema = refreshSchema;

export const businessSignupSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Business name is required"),
    admin_name: z.string().min(1, "Admin name is required"),
    admin_email: z.string().email("Valid admin email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const userSignupSchema = z.object({
  body: z.object({
    invite_token: z.string().uuid("Valid invitation token is required"),
    name: z.string().min(1, "Name is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});
