import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getNutritionStats } from "@/services/nutrition";

export async function GET() {
  try {
    const user = await requireUser();
    return jsonOk(await getNutritionStats(user.id));
  } catch (error) {
    return jsonError(error);
  }
}
