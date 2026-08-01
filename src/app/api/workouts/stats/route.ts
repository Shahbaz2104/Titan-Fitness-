import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getWorkoutStats } from "@/services/workouts";

export async function GET() {
  try {
    const user = await requireUser();
    return jsonOk(await getWorkoutStats(user.id));
  } catch (error) {
    return jsonError(error);
  }
}
