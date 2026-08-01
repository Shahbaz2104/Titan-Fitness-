import { z } from "zod";
import { jsonError, jsonOk, parseBody, requireUser } from "@/lib/api";
import { workoutLogSchema, workoutSessionSchema } from "@/lib/validators";
import { completeSession } from "@/services/workouts";

const completionSchema = z.object({
  durationMinutes: workoutSessionSchema.shape.durationMinutes,
  caloriesBurned: workoutSessionSchema.shape.caloriesBurned,
  notes: workoutSessionSchema.shape.notes,
  logs: z.array(workoutLogSchema).optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const user = await requireUser();
    const { sessionId } = await params;
    const body = await req.json().catch(() => null);
    const data = parseBody(completionSchema, body);
    const logs = data.logs?.map((log) => ({
      ...log,
      setsCompleted: log.setsCompleted ?? 0,
      personalRecord: log.personalRecord ?? false,
    }));
    return jsonOk(await completeSession(user.id, sessionId, { ...data, logs }));
  } catch (error) {
    return jsonError(error);
  }
}
