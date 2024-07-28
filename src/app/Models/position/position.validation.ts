import { z } from "zod";
import { Types } from "mongoose";

const candidateValidationSchema = z.object({
  userId: z.instanceof(Types.ObjectId),
  appliedAt: z.date().default(() => new Date()),
  status: z.enum(["applied", "approved", "rejected"]).default('applied'),
});

const voteValidationSchema = z.object({
  voterId: z.instanceof(Types.ObjectId),
  candidateId: z.instanceof(Types.ObjectId),
  votedAt: z.date().default(() => new Date()),
});

export const positionValidationSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  createdAt: z.date().default(() => new Date()),
  endedAt: z.date().optional(),
  duration: z.string().min(1),
  status: z.enum(["pending", "ongoing", "terminated", "completed"]).default('pending'),
  terminationMessage: z.string().optional(),
  maxVotes: z.number().int().positive(),
  maxCandidate: z.number().int().positive(),
  candidates: z.array(candidateValidationSchema),
  votes: z.array(voteValidationSchema),
});

export const updatePositionValidationSchema =
  positionValidationSchema.partial();
