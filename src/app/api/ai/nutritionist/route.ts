import { jsonError, jsonOk, parseBody, requireUser, withRateLimit } from "@/lib/api";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const nutritionistSchema = z.object({
  goal: z.enum(["WEIGHT_LOSS", "MUSCLE_GAIN", "MAINTENANCE"]),
  dailyCalories: z.number().int().min(1200).max(5000).default(2200),
  proteinPreference: z.enum(["STANDARD", "HIGH_PROTEIN", "VEGETARIAN"]).default("STANDARD"),
  mealsPerDay: z.number().int().min(3).max(6).default(4),
});

const MEAL_TEMPLATES: Record<string, { mealType: string; name: string; calories: number; protein: number }[]> = {
  STANDARD: [
    { mealType: "BREAKFAST", name: "Overnight oats with berries & almonds", calories: 420, protein: 18 },
    { mealType: "LUNCH", name: "Grilled chicken, quinoa & roasted vegetables", calories: 560, protein: 42 },
    { mealType: "SNACK", name: "Greek yogurt with honey & walnuts", calories: 280, protein: 20 },
    { mealType: "DINNER", name: "Salmon, sweet potato & green beans", calories: 620, protein: 38 },
  ],
  HIGH_PROTEIN: [
    { mealType: "BREAKFAST", name: "Egg white scramble with turkey & avocado", calories: 460, protein: 40 },
    { mealType: "LUNCH", name: "Beef stir-fry with brown rice", calories: 580, protein: 48 },
    { mealType: "SNACK", name: "Whey protein shake with banana", calories: 320, protein: 35 },
    { mealType: "DINNER", name: "Chicken thighs, lentils & broccoli", calories: 640, protein: 52 },
  ],
  VEGETARIAN: [
    { mealType: "BREAKFAST", name: "Paneer paratha with mint yogurt", calories: 440, protein: 22 },
    { mealType: "LUNCH", name: "Chickpea & quinoa salad bowl", calories: 540, protein: 24 },
    { mealType: "SNACK", name: "Protein smoothie with soy milk", calories: 300, protein: 25 },
    { mealType: "DINNER", name: "Tofu & vegetable curry with basmati", calories: 600, protein: 30 },
  ],
};

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    await withRateLimit(user.id, 10, 60_000);
    const body = await req.json().catch(() => null);
    const data = parseBody(nutritionistSchema, body);

    const template = MEAL_TEMPLATES[data.proteinPreference ?? "STANDARD"] ?? MEAL_TEMPLATES.STANDARD;
    const scale = (data.dailyCalories ?? 2200) / 2200;

    const days = Array.from({ length: 7 }, (_, dayIndex) => ({
      dayNumber: dayIndex + 1,
      meals: template.slice(0, data.mealsPerDay ?? 4).map((meal) => ({
        mealType: meal.mealType,
        name: meal.name,
        calories: Math.round(meal.calories * scale),
        protein: Math.round(meal.protein * scale),
        carbs: Math.round((meal.calories * scale * 0.45) / 4),
        fat: Math.round((meal.calories * scale * 0.3) / 9),
        ingredients: [],
      })),
    }));

    const totals = days[0].meals.reduce(
      (acc, m) => ({
        calories: acc.calories + m.calories,
        protein: acc.protein + m.protein,
      }),
      { calories: 0, protein: 0 }
    );

    await prisma.aIUsage.create({
      data: {
        userId: user.id,
        feature: "NUTRITIONIST",
        model: "rule-based",
        status: "SUCCESS",
        tokensIn: 0,
        tokensOut: 0,
        cost: 0,
      },
    });

    return jsonOk({
      title: `${data.goal ?? "MAINTENANCE"} · ${data.proteinPreference ?? "STANDARD"} · ${data.dailyCalories ?? 2200} kcal`,
      goal: data.goal,
      dailyCalories: totals.calories,
      proteinGrams: Math.round(totals.protein),
      days,
    });
  } catch (error) {
    return jsonError(error);
  }
}
