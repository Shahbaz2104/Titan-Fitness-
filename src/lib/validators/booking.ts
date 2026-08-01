import { z } from "zod";

export const bookingSchema = z.object({
  classId: z.string().min(1, "Class is required"),
});

export const rescheduleSchema = z.object({
  newClassId: z.string().min(1, "New class is required"),
});

export const waitlistSchema = z.object({
  classId: z.string().min(1, "Class is required"),
});

export const attendanceCheckInSchema = z.object({
  branchId: z.string().min(1, "Branch is required"),
  method: z.enum(["QR", "MANUAL", "RFID", "FACE"]).default("QR"),
  qrToken: z.string().min(1).max(500).optional(),
});

export const attendanceQuerySchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
