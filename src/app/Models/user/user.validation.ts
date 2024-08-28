import { z } from "zod";

export const createUserValidationSchema = z.object({
  body: z
    .object({
      password: z
        .string({ invalid_type_error: "Password must be string" })
        .min(6, { message: "Password must be at least 8 characters" }),
      name: z.string().min(3),
      email: z.string().email(),
      studentId: z.string().min(2).optional(),
      photo: z.string().url().optional(),
      role: z.enum(["user", "admin", "superAdmin"]).default("user"),
      status: z.enum(["in-progress", "active", "blocked"]).optional(),
      isDeleted: z.boolean().default(false),
    })
    .superRefine((data, ctx) => {
      if (data.role === "user" && !data.status) {
        data.status = "active";
      } else if (data.role !== "user" && !data.status) {
        data.status = "in-progress";
      }
    }),
});

// Partial schema for updates
export const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
    studentId: z.string().min(2).optional(),
    photo: z.string().url().optional(),
  }),
});

export const updateUserRoleAndStatusValidationSchema = z.object({
  body: z
    .object({
      role: z.enum(["user", "admin", "superAdmin"]).default("user").optional(),
      status: z.enum(["in-progress", "active", "blocked"]).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.role === "user" && !data.status) {
        data.status = "active";
      } else if (data.role !== "user" && !data.status) {
        data.status = "in-progress";
      }
    }),
});
