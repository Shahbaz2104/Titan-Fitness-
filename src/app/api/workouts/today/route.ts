import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getTodayWorkout } from "@/services/workouts";

export async function GET() {
  try {
    const user = await requireUser();
    return jsonOk(await getTodayWorkout(user.id));
  } catch (error) {
    return jsonError(error);
  }
}
