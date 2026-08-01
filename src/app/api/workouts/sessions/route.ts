import { jsonError, jsonOk, parseBody, requireUser } from "@/lib/api";
import { workoutSessionSchema } from "@/lib/validators";
import { getSessionHistory, startSession } from "@/services/workouts";

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const url = new URL(req.url);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 60) || 60, 200);
    return jsonOk(await getSessionHistory(user.id, limit));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json().catch(() => null);
    const data = parseBody(workoutSessionSchema, body);
    const { date: _date, ...rest } = data;
    void _date;
    return jsonOk(await startSession(user.id, rest), { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
