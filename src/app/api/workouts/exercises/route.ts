import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getExerciseLibrary } from "@/services/workouts";

export async function GET(req: Request) {
  try {
    await requireUser();
    const url = new URL(req.url);
    const category = url.searchParams.get("category") ?? undefined;
    const search = url.searchParams.get("search") ?? undefined;
    return jsonOk(await getExerciseLibrary(category, search));
  } catch (error) {
    return jsonError(error);
  }
}
