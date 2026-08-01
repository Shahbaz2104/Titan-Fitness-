import { jsonError, jsonOk, parseBody, requireUser } from "@/lib/api";
import { bodyMetricSchema } from "@/lib/validators";
import { addBodyMetric, getBodyMetrics } from "@/services/members";

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const url = new URL(req.url);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 30) || 30, 365);
    return jsonOk(await getBodyMetrics(user.id, limit));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json().catch(() => null);
    const data = parseBody(bodyMetricSchema, body);
    const metric = await addBodyMetric(user.id, data);
    return jsonOk(metric, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
