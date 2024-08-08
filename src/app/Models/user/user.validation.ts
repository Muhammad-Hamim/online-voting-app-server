import { z } from "zod";

export const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    email: z.string().email(),
    studentId: z.string().min(2).optional(),
    photo: z.string().url(),
    role: z.enum(["user", "admin"]).default("user"),
    status: z.enum(["active", "blocked"]).default("active"),
    isDeleted: z.boolean().default(false),
  }),
});

//partial schema for updates
export const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
    studentId: z.string().min(2).optional(),
    photo: z.string().url().optional(),
  }),
});

export const updateUserRoleAndStatusValidationSchema = z.object({
  body: z.object({
    role: z.enum(["user", "admin"]).default("user").optional(),
    status: z.enum(["active", "blocked"]).default("active").optional(),
  }),
});
