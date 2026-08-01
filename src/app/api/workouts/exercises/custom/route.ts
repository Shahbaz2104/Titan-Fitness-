import { jsonError, jsonOk, parseBody, requireUser } from "@/lib/api";
import { customExerciseSchema } from "@/lib/validators";
import { createCustomExercise } from "@/services/workouts";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json().catch(() => null);
    const data = parseBody(customExerciseSchema, body);
    return jsonOk(await createCustomExercise(user.id, data), { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
