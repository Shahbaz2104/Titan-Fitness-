import { jsonError, jsonOk, parseBody, requireUser, withRateLimit } from "@/lib/api";
import { z } from "zod";
import { generateMealPlan } from "@/services/ai";

const nutritionistSchema = z.object({
  goal: z.enum(["WEIGHT_LOSS", "MUSCLE_GAIN", "MAINTENANCE"]),
  dailyCalories: z.number().int().min(1200).max(5000).default(2200),
  proteinPreference: z.enum(["STANDARD", "HIGH_PROTEIN", "VEGETARIAN"]).default("STANDARD"),
  mealsPerDay: z.number().int().min(3).max(6).default(4),
});

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    await withRateLimit(user.id, 10, 60_000);
    const body = await req.json().catch(() => null);
    const data = parseBody(nutritionistSchema, body);

    const plan = await generateMealPlan(user.id, {
      goal: data.goal,
      dailyCalories: data.dailyCalories ?? 2200,
      proteinPreference: data.proteinPreference ?? "STANDARD",
      mealsPerDay: data.mealsPerDay ?? 4,
    });

    return jsonOk(plan);
  } catch (error) {
    return jsonError(error);
  }
}
