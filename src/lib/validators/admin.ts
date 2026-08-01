import { z } from "zod";

export const programSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  category: z.enum([
    "WEIGHT_LOSS",
    "BODYBUILDING",
    "CROSSFIT",
    "YOGA",
    "CARDIO",
    "HIIT",
    "POWERLIFTING",
    "CALISTHENICS",
  ]),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ELITE"]),
  durationWeeks: z.number().int().min(1).max(52).default(8),
  price: z.number().min(0).max(10000).optional().nullable(),
  description: z.string().min(10).max(500),
  longDescription: z.string().max(3000).optional().nullable(),
  trainerId: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  videoUrl: z.string().url().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const planSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional().nullable(),
  price: z.number().min(0).max(100000),
  currency: z.string().length(3).default("USD"),
  billingCycle: z
    .enum(["MONTHLY", "QUARTERLY", "HALF_YEARLY", "YEARLY", "LIFETIME"])
    .default("MONTHLY"),
  durationDays: z.number().int().min(1).max(36500).default(30),
  features: z.array(z.string()).max(30).default([]),
  isActive: z.boolean().default(true),
  isPopular: z.boolean().default(false),
});

export const classSchema = z.object({
  branchId: z.string().min(1),
  programId: z.string().optional().nullable(),
  trainerId: z.string().optional().nullable(),
  title: z.string().min(2).max(100),
  type: z.enum([
    "YOGA",
    "CROSSFIT",
    "HIIT",
    "ZUMBA",
    "SPINNING",
    "BOXING",
    "PILATES",
    "STRENGTH",
    "CARDIO",
  ]),
  description: z.string().max(500).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  capacity: z.number().int().min(1).max(500).default(20),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  isRecurring: z.boolean().default(false),
  repeatDays: z.array(z.string()).max(7).optional(),
  isActive: z.boolean().default(true),
});

export const branchSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional().nullable(),
  address: z.string().min(5).max(200),
  city: z.string().min(2).max(80),
  country: z.string().default("Pakistan"),
  phone: z.string().max(20).optional().nullable(),
  email: z.string().email().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  timezone: z.string().default("Asia/Karachi"),
  isActive: z.boolean().default(true),
});

export const trainerSchema = z.object({
  userId: z.string().min(1),
  specialty: z.string().min(2).max(80),
  bio: z.string().max(2000).optional().nullable(),
  experienceYears: z.number().int().min(0).max(60).default(0),
  certifications: z.array(z.string()).max(20).default([]),
  hourlyRate: z.number().min(0).max(5000).optional().nullable(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const memberStatusSchema = z.object({
  isActive: z.boolean().optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "TRAINER", "RECEPTIONIST", "MEMBER"]).optional(),
  branchId: z.string().optional().nullable(),
});

export const challengeSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(1000).optional().nullable(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  goalType: z.enum(["WORKOUTS", "CALORIES", "STEPS", "WATER", "ATTENDANCE", "STREAK_DAYS"]),
  goalValue: z.number().int().min(1),
  isActive: z.boolean().default(true),
});

export const settingUpdateSchema = z.object({
  key: z.string().min(1).max(80),
  value: z.unknown(),
  group: z.string().max(40).default("general"),
});

export const blogPostAdminSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(300).optional().nullable(),
  content: z.string().min(10),
  coverImage: z.string().url().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()).max(10).default([]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  readTimeMin: z.number().int().min(1).max(60).default(5),
});
