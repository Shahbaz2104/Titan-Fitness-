import { jsonError, jsonOk, parseBody, requireUser, withRateLimit } from "@/lib/api";
import { waterLogSchema } from "@/lib/validators";
import { addWaterLog, getWaterLogs } from "@/services/members";

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const url = new URL(req.url);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 30) || 30, 365);
    return jsonOk(await getWaterLogs(user.id, limit));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    await withRateLimit(user.id, 60, 60_000);
    const body = await req.json().catch(() => null);
    const data = parseBody(waterLogSchema, body);
    const log = await addWaterLog(user.id, data.amountMl, data.date);
    return jsonOk(log, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
