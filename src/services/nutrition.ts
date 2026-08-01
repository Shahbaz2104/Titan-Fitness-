import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api";
import { WATER_DAILY_GOAL_ML } from "@/lib/constants";

export async function getActiveMealPlans(userId: string) {
  return prisma.mealPlan.findMany({
    where: { userId, isActive: true, deletedAt: null },
    include: {
      days: {
        include: { meals: true },
        orderBy: { dayNumber: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getMealPlan(userId: string, planId: string) {
  const plan = await prisma.mealPlan.findFirst({
    where: { id: planId, userId, deletedAt: null },
    include: {
      days: {
        include: { meals: true },
        orderBy: { dayNumber: "asc" },
      },
    },
  });
  if (!plan) throw new ApiError("Meal plan not found", 404, "NOT_FOUND");
  return plan;
}

export async function createMealPlan(
  userId: string,
  data: {
    name: string;
    goal?: string | null;
    dailyCalories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    durationDays?: number;
    isAiGenerated?: boolean;
    days?: {
      dayNumber: number;
      meals: {
        mealType: string;
        name: string;
        calories: number;
        protein?: number;
        carbs?: number;
        fat?: number;
        ingredients?: unknown;
        recipe?: string | null;
      }[];
    }[];
  }
) {
  return prisma.mealPlan.create({
    data: {
      userId,
      name: data.name,
      goal: data.goal,
      dailyCalories: data.dailyCalories,
      proteinGrams: data.proteinGrams,
      carbsGrams: data.carbsGrams,
      fatGrams: data.fatGrams,
      durationDays: data.durationDays ?? 7,
      isAiGenerated: data.isAiGenerated ?? false,
      days: data.days
        ? {
            create: data.days.map((day) => ({
              dayNumber: day.dayNumber,
              meals: {
                create: day.meals.map((meal) => ({
                  mealType: meal.mealType as never,
                  name: meal.name,
                  calories: meal.calories,
                  protein: meal.protein ?? 0,
                  carbs: meal.carbs ?? 0,
                  fat: meal.fat ?? 0,
                  ingredients: (meal.ingredients ?? []) as never,
                  recipe: meal.recipe,
                })),
              },
            })),
          }
        : undefined,
    },
  });
}

export async function deleteMealPlan(userId: string, planId: string) {
  const plan = await prisma.mealPlan.findFirst({ where: { id: planId, userId } });
  if (!plan) throw new ApiError("Meal plan not found", 404, "NOT_FOUND");
  return prisma.mealPlan.update({
    where: { id: planId },
    data: { isActive: false, deletedAt: new Date() },
  });
}

export async function getNutritionLogs(userId: string, date?: string) {
  const dayStart = date ? new Date(date) : new Date();
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart.getTime() + 86_400_000);

  const logs = await prisma.calorieLog.findMany({
    where: { userId, date: { gte: dayStart, lt: dayEnd } },
    orderBy: { date: "asc" },
  });

  const totals = logs.reduce(
    (acc, log) => ({
      calories: acc.calories + log.calories,
      protein: acc.protein + (log.protein ?? 0),
      carbs: acc.carbs + (log.carbs ?? 0),
      fat: acc.fat + (log.fat ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const water = await prisma.waterLog.findFirst({
    where: { userId, date: { gte: dayStart, lt: dayEnd } },
  });

  return {
    logs,
    totals,
    water: water?.amountMl ?? 0,
    waterGoal: WATER_DAILY_GOAL_ML,
  };
}

export async function getNutritionStats(userId: string) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [monthLogs, todayLogs] = await Promise.all([
    prisma.calorieLog.findMany({
      where: { userId, date: { gte: monthStart } },
    }),
    prisma.calorieLog.findMany({
      where: { userId, date: { gte: todayStart } },
    }),
  ]);

  const avg = (key: "calories" | "protein" | "carbs" | "fat") =>
    monthLogs.length
      ? Math.round(monthLogs.reduce((a, l) => a + (l[key] ?? 0), 0) / monthLogs.length)
      : 0;

  return {
    monthDaysLogged: monthLogs.length,
    avgCalories: avg("calories"),
    avgProtein: avg("protein"),
    avgCarbs: avg("carbs"),
    avgFat: avg("fat"),
    todayCalories: todayLogs.reduce((a, l) => a + l.calories, 0),
  };
}
