import { z } from "zod";

export const memberProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80).optional(),
  phone: z.string().max(20).optional().nullable(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  heightCm: z.number().min(100, "Height must be 100-250 cm").max(250).optional().nullable(),
  weightKg: z.number().min(30, "Weight must be 30-300 kg").max(300).optional().nullable(),
  bodyFatPct: z.number().min(3).max(60).optional().nullable(),
  fitnessGoal: z
    .enum(["WEIGHT_LOSS", "MUSCLE_GAIN", "STRENGTH", "ENDURANCE", "GENERAL_FITNESS", "FLEXIBILITY"])
    .optional()
    .nullable(),
  experience: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional().nullable(),
  image: z.string().url().optional().nullable(),
});

export const bodyMetricSchema = z.object({
  date: z.coerce.date().optional(),
  weightKg: z.number().min(30).max(300).optional(),
  bodyFatPct: z.number().min(3).max(60).optional(),
  muscleMassKg: z.number().min(10).max(100).optional(),
  bmi: z.number().min(10).max(70).optional(),
  waterLiters: z.number().min(0).max(10).optional(),
  waistCm: z.number().min(40).max(200).optional(),
  chestCm: z.number().min(50).max(200).optional(),
  armsCm: z.number().min(10).max(80).optional(),
  notes: z.string().max(500).optional(),
});

export const waterLogSchema = z.object({
  date: z.coerce.date().optional(),
  amountMl: z.number().int().min(50, "Minimum 50ml").max(5000, "Maximum 5000ml"),
});

export const calorieLogSchema = z.object({
  date: z.coerce.date().optional(),
  mealType: z
    .enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK", "PRE_WORKOUT", "POST_WORKOUT"])
    .default("SNACK"),
  foodName: z.string().min(1, "Food name is required").max(120),
  calories: z.number().int().min(0).max(5000),
  protein: z.number().min(0).max(200).optional(),
  carbs: z.number().min(0).max(500).optional(),
  fat: z.number().min(0).max(200).optional(),
  portion: z.string().max(100).optional(),
});

export const progressPhotoSchema = z.object({
  stage: z.enum(["BEFORE", "NOW", "AFTER"]).default("NOW"),
  note: z.string().max(300).optional(),
  imageUrl: z.string().url("Valid image URL required"),
});
