import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getNutritionLogs } from "@/services/nutrition";

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const url = new URL(req.url);
    const date = url.searchParams.get("date") ?? undefined;
    return jsonOk(await getNutritionLogs(user.id, date));
  } catch (error) {
    return jsonError(error);
  }
}
