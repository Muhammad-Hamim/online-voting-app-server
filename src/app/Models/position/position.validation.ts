import { z } from "zod";

export const createPositionValidationSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(5),
    duration: z.string().min(1),
    status: z
      .enum(["pending", "ongoing", "terminated", "completed"])
      .default("pending"),
    terminationMessage: z.string().optional(),
    maxVotes: z.number().int().positive(),
    maxCandidate: z.number().int().positive(),
    isDeleted: z.boolean().default(false),
  }),
});

export const updatePositionValidationSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(5).optional(),
    duration: z.string().min(1).optional(),
    status: z
      .enum(["pending", "ongoing", "terminated", "completed"])
      .default("pending")
      .optional(),
    terminationMessage: z.string().optional(),
    maxVotes: z.number().int().positive().optional(),
    maxCandidate: z.number().int().positive().optional(),
  }),
});
