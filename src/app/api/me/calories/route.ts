import { jsonError, jsonOk, parseBody, requireUser, withRateLimit } from "@/lib/api";
import { calorieLogSchema } from "@/lib/validators";
import { addCalorieLog, getCalorieLogs } from "@/services/members";

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const url = new URL(req.url);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 30) || 30, 365);
    return jsonOk(await getCalorieLogs(user.id, limit));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    await withRateLimit(user.id, 60, 60_000);
    const body = await req.json().catch(() => null);
    const data = parseBody(calorieLogSchema, body);
    const log = await addCalorieLog(user.id, { ...data, mealType: data.mealType ?? "SNACK" });
    return jsonOk(log, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
