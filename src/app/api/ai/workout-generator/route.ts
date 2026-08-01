import { jsonError, jsonOk, parseBody, requireUser, withRateLimit } from "@/lib/api";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const generatorSchema = z.object({
  goal: z.enum(["WEIGHT_LOSS", "MUSCLE_GAIN", "STRENGTH", "ENDURANCE", "GENERAL_FITNESS"]),
  daysPerWeek: z.number().int().min(2).max(6).default(4),
  sessionMinutes: z.number().int().min(20).max(120).default(45),
  equipment: z.string().max(40).optional().nullable(),
  experience: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"),
});

const DAY_FOCUS: Record<string, string[]> = {
  MUSCLE_GAIN: ["Push · Chest & Triceps", "Pull · Back & Biceps", "Legs & Core", "Shoulders & Arms"],
  STRENGTH: ["Squat Focus", "Bench Focus", "Deadlift Focus", "Overhead & Accessories"],
  WEIGHT_LOSS: ["Full Body · Circuit", "HIIT & Core", "Full Body · Circuit", "Cardio & Conditioning"],
  ENDURANCE: ["Long Session · Low-Intensity", "Interval Training", "Aerobic Base", "Tempo & Fartlek"],
  GENERAL_FITNESS: ["Full Body A", "Cardio & Mobility", "Full Body B", "Conditioning"],
};

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    await withRateLimit(user.id, 10, 60_000);
    const body = await req.json().catch(() => null);
    const data = parseBody(generatorSchema, body);

    const focus = DAY_FOCUS[data.goal] ?? DAY_FOCUS.GENERAL_FITNESS;
    const exercises = await prisma.exercise.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
      take: 60,
    });

    const days = focus.slice(0, data.daysPerWeek).map((title, i) => {
      const picked = exercises.slice((i * 7) % Math.max(1, exercises.length - 6), (i * 7 + 6) % Math.max(1, exercises.length) || 6);
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

    await prisma.aIUsage.create({
      data: {
        userId: user.id,
        feature: "WORKOUT_GENERATOR",
        model: "rule-based",
        status: "SUCCESS",
        tokensIn: 0,
        tokensOut: 0,
        cost: 0,
      },
    });

    return jsonOk({
      title: `${data.goal ?? "GENERAL_FITNESS"} · ${data.daysPerWeek ?? 4} days/week`,
      goal: data.goal,
      daysPerWeek: data.daysPerWeek,
      sessionMinutes: data.sessionMinutes,
      days,
    });
  } catch (error) {
    return jsonError(error);
  }
}
