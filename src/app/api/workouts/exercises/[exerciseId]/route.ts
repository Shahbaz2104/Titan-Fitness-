import { ApiError, jsonError, jsonOk, requireUser } from "@/lib/api";
import { getExerciseById } from "@/services/workouts";

export async function GET(_req: Request, { params }: { params: Promise<{ exerciseId: string }> }) {
  try {
    await requireUser();
    const { exerciseId } = await params;
    const exercise = await getExerciseById(exerciseId);
    if (!exercise) throw new ApiError("Exercise not found", 404, "NOT_FOUND");
    return jsonOk(exercise);
  } catch (error) {
    return jsonError(error);
  }
}
