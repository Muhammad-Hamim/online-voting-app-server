import { z } from "zod";

export const candidateValidationSchema = z.object({
  body: z.object({
    candidate: z.string(),
    email: z.string().email(),
    position: z.string(),
    votes: z.number().default(0),
    status: z.enum(["applied", "approved", "rejected"]).default("applied"),
    photo: z.string().optional(),
    message: z.string().optional(),
  }),
});

export const updateCandidateVoteValidationSchema = z.object({
  body: z.object({
    votes: z.number(),
  }),
});
