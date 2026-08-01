import { z } from "zod";

export const mealPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required").max(120),
  goal: z.string().max(60).optional().nullable(),
  dailyCalories: z.number().int().min(800).max(8000),
  proteinGrams: z.number().int().min(0).max(500),
  carbsGrams: z.number().int().min(0).max(1000),
  fatGrams: z.number().int().min(0).max(400),
  durationDays: z.number().int().min(1).max(30).default(7),
  isAiGenerated: z.boolean().default(false),
});

export const mealSchema = z.object({
  mealDayId: z.string().min(1),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK", "PRE_WORKOUT", "POST_WORKOUT"]),
  name: z.string().min(1).max(120),
  calories: z.number().int().min(0).max(3000),
  protein: z.number().min(0).max(300),
  carbs: z.number().min(0).max(500),
  fat: z.number().min(0).max(300),
  ingredients: z.array(z.string()).max(50).optional(),
  recipe: z.string().max(3000).optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
});

export const nutritionLogSchema = z.object({
  date: z.coerce.date().optional(),
  mealType: z
    .enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK", "PRE_WORKOUT", "POST_WORKOUT"])
    .default("SNACK"),
  foodName: z.string().min(1).max(120),
  calories: z.number().int().min(0).max(5000),
  protein: z.number().min(0).max(200).optional(),
  carbs: z.number().min(0).max(500).optional(),
  fat: z.number().min(0).max(200).optional(),
  portion: z.string().max(100).optional(),
});
