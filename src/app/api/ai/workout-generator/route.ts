import { jsonError, jsonOk, parseBody, requireUser, withRateLimit } from "@/lib/api";
import { z } from "zod";
import { generateWorkoutPlan } from "@/services/ai";

const generatorSchema = z.object({
  goal: z.enum(["WEIGHT_LOSS", "MUSCLE_GAIN", "STRENGTH", "ENDURANCE", "GENERAL_FITNESS"]),
  daysPerWeek: z.number().int().min(2).max(6).default(4),
  sessionMinutes: z.number().int().min(20).max(120).default(45),
  equipment: z.string().max(40).optional().nullable(),
  experience: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"),
});

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    await withRateLimit(user.id, 10, 60_000);
    const body = await req.json().catch(() => null);
    const data = parseBody(generatorSchema, body);

    const plan = await generateWorkoutPlan(user.id, {
      goal: data.goal,
      daysPerWeek: data.daysPerWeek ?? 4,
      sessionMinutes: data.sessionMinutes ?? 45,
      equipment: data.equipment ?? null,
      experience: data.experience ?? "BEGINNER",
    });

    return jsonOk(plan);
  } catch (error) {
    return jsonError(error);
  }
}
