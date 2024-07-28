import { z } from "zod";
import { Types } from "mongoose";

const appliedPositionValidationSchema = z.object({
  positionId: z.instanceof(Types.ObjectId),
  status: z.enum(["applied", "approved", "rejected"]).default("applied"),
  appliedAt: z.date().default(() => new Date()),
});

const voteValidationSchema = z.object({
  positionId: z.instanceof(Types.ObjectId),
  candidateId: z.instanceof(Types.ObjectId),
  votedAt: z.date().default(() => new Date()),
});

export const userValidationSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  studentId: z.string().min(2),
  photo: z.string().url(),
  role: z.enum(["user", "admin"]).default("user"),
  createdAt: z.date().default(() => new Date()),
  status: z.enum(["active", "blocked"]).default("active"),
  appliedPositions: z.array(appliedPositionValidationSchema).optional(),
  votes: z.array(voteValidationSchema).optional(),
});

//partial schema for updates
export const updateUserValidationSchema = userValidationSchema.partial();
