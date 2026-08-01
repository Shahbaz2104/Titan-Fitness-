import { z } from "zod";

export const workoutSessionSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  planId: z.string().optional().nullable(),
  workoutDayId: z.string().optional().nullable(),
  date: z.coerce.date().optional(),
  durationMinutes: z.number().int().min(1).max(600).optional().nullable(),
  caloriesBurned: z.number().int().min(0).max(10000).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export const workoutLogSchema = z.object({
  exerciseId: z.string().min(1),
  setsCompleted: z.number().int().min(0).max(20).default(0),
  reps: z.string().max(50).optional().nullable(),
  weightKg: z.number().min(0).max(1000).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  personalRecord: z.boolean().default(false),
});

export const workoutLogsSchema = z.object({
  logs: z.array(workoutLogSchema).min(1, "At least one log is required"),
});

export const workoutPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required").max(120),
  goal: z.string().max(60).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  isAiGenerated: z.boolean().default(false),
});

export const workoutDaySchema = z.object({
  planId: z.string().min(1),
  dayNumber: z.number().int().min(1).max(14),
  title: z.string().min(1).max(80),
  focus: z.string().max(80).optional().nullable(),
});

export const workoutExerciseSchema = z.object({
  workoutDayId: z.string().min(1),
  exerciseId: z.string().min(1),
  sets: z.number().int().min(1).max(10),
  reps: z.string().min(1).max(50),
  restSeconds: z.number().int().min(0).max(600).default(90),
  weightKg: z.number().min(0).max(1000).optional().nullable(),
  order: z.number().int().min(0).default(0),
  notes: z.string().max(500).optional().nullable(),
});

export const customExerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required").max(80),
  muscleGroup: z.string().min(1).max(40),
  equipment: z.string().max(40).optional().nullable(),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ELITE"]).default("BEGINNER"),
  category: z
    .enum([
      "CHEST",
      "BACK",
      "SHOULDERS",
      "BICEPS",
      "TRICEPS",
      "LEGS",
      "CORE",
      "FULL_BODY",
      "CARDIO",
      "PLYOMETRICS",
      "STRETCHING",
      "OLYMPIC_LIFTING",
    ])
    .default("FULL_BODY"),
  instructions: z
    .object({
      setup: z.string().optional(),
      execution: z.string().optional(),
      tips: z.string().optional(),
    })
    .default({}),
});
