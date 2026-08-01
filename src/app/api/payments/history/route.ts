import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getPaymentHistory } from "@/services/payments";

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const url = new URL(req.url);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 30) || 30, 200);
    return jsonOk(await getPaymentHistory(user.id, limit));
  } catch (error) {
    return jsonError(error);
  }
}
