import { generateObject, generateText } from "ai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AI_MODEL_ID, estimateCostUsd, getAiModel } from "@/lib/ai";

type AIFeature = "CHATBOT" | "WORKOUT_GENERATOR" | "NUTRITIONIST";

async function recordUsage(
  userId: string,
  feature: AIFeature,
  model: string,
  tokensIn: number,
  tokensOut: number,
  durationMs: number,
  status: "SUCCESS" | "FAILED" = "SUCCESS"
) {
  try {
    await prisma.aIUsage.create({
      data: {
        userId,
        feature,
        model,
        tokensIn,
        tokensOut,
        cost: estimateCostUsd(model, tokensIn, tokensOut),
        durationMs,
        status,
      },
    });
  } catch {
    // usage logging must never break the user request
  }
}

/* ------------------------------------------------------------------ */
/* Chat                                                                */
/* ------------------------------------------------------------------ */

const CHAT_SYSTEM_PROMPT = [
  "You are the Titan Fitness AI coach — an expert, encouraging personal trainer and nutritionist.",
  "Answer concisely in 2–5 sentences using markdown. Give concrete, actionable advice.",
  "You can reference the member's profile (height, weight, goal, experience) when relevant.",
  "If asked anything dangerous or medical, advise seeing a doctor.",
].join(" ");

const RULE_RESPONSES: { match: RegExp; reply: string }[] = [
  {
    match: /(workout|training) plan|beginner plan/i,
    reply:
      "Here's a simple beginner plan to start: 3 days/week — Day 1 full-body (squats, push-ups, rows), Day 2 rest or light cardio, Day 3 full-body again. Start with 2–3 sets of 10–12 reps, rest 90s between sets. Progress by adding reps first, then weight. Want me to generate a detailed plan with exercises from our library?",
  },
  {
    match: /(nutrition|eat|diet|food|meal)/i,
    reply:
      "Nutrition tip: aim for ~1.6–2.2g of protein per kg of bodyweight daily, spread across 3–4 meals. Pre-workout, favor carbs; post-workout, combine protein + carbs. Log your meals in the Nutrition tab and I'll help you dial in your macros. What's your current goal?",
  },
  {
    match: /(bench|squat|deadlift|strength|stronger)/i,
    reply:
      "To get stronger, stick to progressive overload: add a small amount of weight (or one rep) each session, keep proper form, and prioritize sleep and recovery. A simple protocol: 3–5 sets of 4–6 reps at 80–85% of your 1RM, with 2–3 minutes rest. Let me know which lift you're working on.",
  },
  {
    match: /(water|hydrat)/i,
    reply:
      "Hydration matters: aim for about 3L of water daily (more if you're training hard). A good habit is 500ml upon waking and 250ml every hour during the day. Track it in the dashboard's water tracker and try to hit your goal every day for a week — your energy will improve noticeably.",
  },
  {
    match: /(form|technique|injur|pain)/i,
    reply:
      "Good form beats heavy weight — always. For any lift: brace your core, keep a neutral spine, and control the eccentric (lowering) phase. If something hurts (sharp pain), stop and rest. For technique feedback, consider booking a session with one of our certified trainers — they're world-class.",
  },
  {
    match: /(recovery|sleep|rest)/i,
    reply:
      "Recovery is where gains happen. Aim for 7–9 hours of sleep, take 1–2 full rest days weekly, and keep stress in check. Active recovery (walking, light stretching) also helps. If you're sore, prioritize hydration, protein, and light movement over long stretches of inactivity.",
  },
];

export async function aiChat(userId: string, message: string): Promise<{ reply: string }> {
  const start = Date.now();
  const model = getAiModel();

  if (model) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
          heightCm: true,
          weightKg: true,
          fitnessGoal: true,
          experience: true,
        },
      });
      const profile = [
        `Name: ${user?.name ?? "member"}`,
        user?.heightCm ? `Height: ${user.heightCm}cm` : null,
        user?.weightKg ? `Weight: ${user.weightKg}kg` : null,
        user?.fitnessGoal ? `Goal: ${user.fitnessGoal}` : null,
        user?.experience ? `Experience: ${user.experience}` : null,
      ]
        .filter(Boolean)
        .join(", ");

      const result = await generateText({
        model,
        system: CHAT_SYSTEM_PROMPT,
        prompt: `Member profile: ${profile}\n\nMessage: ${message}`,
        maxOutputTokens: 500,
      });

      await recordUsage(
        userId,
        "CHATBOT",
        AI_MODEL_ID,
        result.usage.inputTokens ?? 0,
        result.usage.outputTokens ?? 0,
        Date.now() - start
      );
      return { reply: result.text };
    } catch {
      // fall through to rule-based
    }
  }

  const match = RULE_RESPONSES.find((r) => r.match.test(message));
  const reply = match
    ? match.reply
    : "Great question! As your Titan AI coach, my advice: stay consistent, train hard but smart, log every session, and focus on small improvements each week. What are you training today — strength, cardio, or recovery?";

  await recordUsage(userId, "CHATBOT", "rule-based", 0, 0, Date.now() - start);
  return { reply };
}

/* ------------------------------------------------------------------ */
/* Workout generator                                                   */
/* ------------------------------------------------------------------ */

export interface GeneratedExercise {
  exerciseId: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  restSeconds: number;
  order: number;
}

export interface GeneratedWorkoutDay {
  dayNumber: number;
  title: string;
  exercises: GeneratedExercise[];
}

export interface GeneratedWorkoutPlan {
  title: string;
  goal: string;
  daysPerWeek: number;
  sessionMinutes: number;
  days: GeneratedWorkoutDay[];
}

export interface WorkoutGeneratorInput {
  goal: "WEIGHT_LOSS" | "MUSCLE_GAIN" | "STRENGTH" | "ENDURANCE" | "GENERAL_FITNESS";
  daysPerWeek: number;
  sessionMinutes: number;
  equipment?: string | null;
  experience?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}

const DAY_FOCUS: Record<string, string[]> = {
  MUSCLE_GAIN: [
    "Push · Chest & Triceps",
    "Pull · Back & Biceps",
    "Legs & Core",
    "Shoulders & Arms",
  ],
  STRENGTH: ["Squat Focus", "Bench Focus", "Deadlift Focus", "Overhead & Accessories"],
  WEIGHT_LOSS: [
    "Full Body · Circuit",
    "HIIT & Core",
    "Full Body · Circuit",
    "Cardio & Conditioning",
  ],
  ENDURANCE: [
    "Long Session · Low-Intensity",
    "Interval Training",
    "Aerobic Base",
    "Tempo & Fartlek",
  ],
  GENERAL_FITNESS: ["Full Body A", "Cardio & Mobility", "Full Body B", "Conditioning"],
};

const aiWorkoutSchema = z.object({
  title: z.string().describe("Short plan title, e.g. '4-Day Strength Builder'"),
  days: z
    .array(
      z.object({
        dayNumber: z.number().int().min(1),
        title: z.string().describe("Day focus, e.g. 'Push · Chest & Triceps'"),
        exercises: z
          .array(
            z.object({
              name: z
                .string()
                .describe("Exercise name — must be picked EXACTLY from the provided library"),
              sets: z.number().int().min(1).max(8),
              reps: z.string().describe("e.g. '8-12'"),
              restSeconds: z.number().int().min(0).max(300),
            })
          )
          .min(3)
          .max(8),
      })
    )
    .min(2)
    .max(6),
});

async function buildWorkoutFallback(
  userId: string,
  data: WorkoutGeneratorInput,
  start: number
): Promise<GeneratedWorkoutPlan> {
  const focus = DAY_FOCUS[data.goal] ?? DAY_FOCUS.GENERAL_FITNESS;
  const exercises = await prisma.exercise.findMany({
    where: { deletedAt: null },
    orderBy: { name: "asc" },
    take: 60,
  });

  const days = focus.slice(0, data.daysPerWeek).map((title, i) => {
    const startIdx = (i * 7) % Math.max(1, exercises.length - 6);
    const picked = exercises.slice(startIdx, Math.min(startIdx + 6, exercises.length));
    return {
      dayNumber: i + 1,
      title,
      exercises: picked.map((ex, j) => ({
        exerciseId: ex.id,
        name: ex.name,
        muscleGroup: ex.muscleGroup,
        sets: data.goal === "STRENGTH" ? 4 : 3,
        reps: data.goal === "STRENGTH" ? "4-6" : data.goal === "MUSCLE_GAIN" ? "8-12" : "12-15",
        restSeconds: data.goal === "STRENGTH" ? 150 : 90,
        order: j,
      })),
    };
  });

  const plan: GeneratedWorkoutPlan = {
    title: `${data.goal ?? "GENERAL_FITNESS"} · ${data.daysPerWeek ?? 4} days/week`,
    goal: data.goal,
    daysPerWeek: data.daysPerWeek,
    sessionMinutes: data.sessionMinutes,
    days,
  };

  await recordUsage(userId, "WORKOUT_GENERATOR", "rule-based", 0, 0, Date.now() - start);
  return plan;
}

export async function generateWorkoutPlan(
  userId: string,
  data: WorkoutGeneratorInput
): Promise<GeneratedWorkoutPlan> {
  const start = Date.now();
  const model = getAiModel();

  if (model) {
    try {
      const library = await prisma.exercise.findMany({
        where: { deletedAt: null },
        orderBy: { name: "asc" },
        take: 60,
        select: { id: true, name: true, muscleGroup: true },
      });
      const libraryText = library.map((e) => `${e.name} (${e.muscleGroup})`).join("\n");
      const dayCount = data.daysPerWeek ?? 4;

      const result = await generateObject({
        model,
        schema: aiWorkoutSchema,
        system:
          "You are a world-class strength coach. Build a workout plan using ONLY exercises from the provided library. Output structured JSON.",
        prompt: [
          `Goal: ${data.goal}`,
          `Days per week: ${dayCount}`,
          `Session length: ${data.sessionMinutes} minutes`,
          `Experience: ${data.experience ?? "BEGINNER"}`,
          data.equipment ? `Equipment available: ${data.equipment}` : "Equipment: gym (full)",
          `Exercise library (pick names EXACTLY as written, each at most once per day):\n${libraryText}`,
        ].join("\n"),
      });

      const llmNames = result.object.days.flatMap((d) => d.exercises.map((e) => e.name));
      const dbLookup = new Map(
        (
          await prisma.exercise.findMany({
            where: { name: { in: llmNames } },
          })
        ).map((e) => [e.name.toLowerCase().trim(), e])
      );
      const defaultExercise = library[0];

      const days = result.object.days
        .sort((a, b) => a.dayNumber - b.dayNumber)
        .slice(0, dayCount)
        .map((day) => ({
          dayNumber: day.dayNumber,
          title: day.title,
          exercises: day.exercises.map((ex, j) => {
            const db = dbLookup.get(ex.name.toLowerCase().trim());
            return {
              exerciseId: (db ?? defaultExercise)?.id ?? "",
              name: (db ?? defaultExercise)?.name ?? ex.name,
              muscleGroup: db?.muscleGroup ?? defaultExercise?.muscleGroup ?? "GENERAL",
              sets: ex.sets,
              reps: ex.reps,
              restSeconds: ex.restSeconds,
              order: j,
            };
          }),
        }));

      const plan: GeneratedWorkoutPlan = {
        title: result.object.title,
        goal: data.goal,
        daysPerWeek: dayCount,
        sessionMinutes: data.sessionMinutes,
        days,
      };

      await recordUsage(
        userId,
        "WORKOUT_GENERATOR",
        AI_MODEL_ID,
        result.usage.inputTokens ?? 0,
        result.usage.outputTokens ?? 0,
        Date.now() - start
      );
      return plan;
    } catch {
      // fall through to rule-based
    }
  }

  return buildWorkoutFallback(userId, data, start);
}

/* ------------------------------------------------------------------ */
/* Nutritionist                                                        */
/* ------------------------------------------------------------------ */

export interface GeneratedMeal {
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface GeneratedMealDay {
  dayNumber: number;
  meals: GeneratedMeal[];
}

export interface GeneratedMealPlan {
  title: string;
  goal: string;
  dailyCalories: number;
  proteinGrams: number;
  days: GeneratedMealDay[];
}

export interface NutritionistInput {
  goal: "WEIGHT_LOSS" | "MUSCLE_GAIN" | "MAINTENANCE";
  dailyCalories: number;
  proteinPreference: "STANDARD" | "HIGH_PROTEIN" | "VEGETARIAN";
  mealsPerDay: number;
}

const MEAL_TEMPLATES: Record<
  string,
  { mealType: GeneratedMeal["mealType"]; name: string; calories: number; protein: number }[]
> = {
  STANDARD: [
    {
      mealType: "BREAKFAST",
      name: "Overnight oats with berries & almonds",
      calories: 420,
      protein: 18,
    },
    {
      mealType: "LUNCH",
      name: "Grilled chicken, quinoa & roasted vegetables",
      calories: 560,
      protein: 42,
    },
    { mealType: "SNACK", name: "Greek yogurt with honey & walnuts", calories: 280, protein: 20 },
    { mealType: "DINNER", name: "Salmon, sweet potato & green beans", calories: 620, protein: 38 },
  ],
  HIGH_PROTEIN: [
    {
      mealType: "BREAKFAST",
      name: "Egg white scramble with turkey & avocado",
      calories: 460,
      protein: 40,
    },
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

const aiMealSchema = z.object({
  title: z.string().describe("Short plan title, e.g. '7-Day Muscle Gain Meal Plan'"),
  days: z
    .array(
      z.object({
        dayNumber: z.number().int().min(1),
        meals: z
          .array(
            z.object({
              mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]),
              name: z.string().describe("Simple, realistic meal name"),
              calories: z.number().int().min(100).max(1500),
              protein: z.number().int().min(0).max(100),
              carbs: z.number().int().min(0).max(150),
              fat: z.number().int().min(0).max(80),
            })
          )
          .min(3)
          .max(6),
      })
    )
    .min(7)
    .max(7),
});

async function buildMealFallback(
  userId: string,
  data: NutritionistInput,
  start: number
): Promise<GeneratedMealPlan> {
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
    })),
  }));

  const totals = days[0].meals.reduce(
    (acc, m) => ({ calories: acc.calories + m.calories, protein: acc.protein + m.protein }),
    { calories: 0, protein: 0 }
  );

  const plan: GeneratedMealPlan = {
    title: `${data.goal ?? "MAINTENANCE"} · ${data.proteinPreference ?? "STANDARD"} · ${data.dailyCalories ?? 2200} kcal`,
    goal: data.goal,
    dailyCalories: totals.calories,
    proteinGrams: Math.round(totals.protein),
    days,
  };

  await recordUsage(userId, "NUTRITIONIST", "rule-based", 0, 0, Date.now() - start);
  return plan;
}

export async function generateMealPlan(
  userId: string,
  data: NutritionistInput
): Promise<GeneratedMealPlan> {
  const start = Date.now();
  const model = getAiModel();

  if (model) {
    try {
      const result = await generateObject({
        model,
        schema: aiMealSchema,
        system:
          "You are an expert sports nutritionist. Produce a 7-day meal plan as structured JSON. Vary the meals across days.",
        prompt: [
          `Goal: ${data.goal}`,
          `Target daily calories: ~${data.dailyCalories}`,
          `Protein preference: ${data.proteinPreference}`,
          `Meals per day: ${data.mealsPerDay}`,
          "Keep each day's total calories within 10% of the target.",
        ].join("\n"),
      });

      const days = result.object.days
        .sort((a, b) => a.dayNumber - b.dayNumber)
        .map((day) => ({
          dayNumber: day.dayNumber,
          meals: day.meals.map((m) => ({
            mealType: m.mealType,
            name: m.name,
            calories: m.calories,
            protein: m.protein,
            carbs: m.carbs,
            fat: m.fat,
          })),
        }));

      const dayTotals = days.map((d) => ({
        calories: d.meals.reduce((acc, m) => acc + m.calories, 0),
        protein: d.meals.reduce((acc, m) => acc + m.protein, 0),
      }));
      const avgCalories = Math.round(
        dayTotals.reduce((acc, d) => acc + d.calories, 0) / dayTotals.length
      );

      const plan: GeneratedMealPlan = {
        title: result.object.title,
        goal: data.goal,
        dailyCalories: avgCalories,
        proteinGrams: Math.round(
          dayTotals.reduce((acc, d) => acc + d.protein, 0) / dayTotals.length
        ),
        days,
      };

      await recordUsage(
        userId,
        "NUTRITIONIST",
        AI_MODEL_ID,
        result.usage.inputTokens ?? 0,
        result.usage.outputTokens ?? 0,
        Date.now() - start
      );
      return plan;
    } catch {
      // fall through to rule-based
    }
  }

  return buildMealFallback(userId, data, start);
}
