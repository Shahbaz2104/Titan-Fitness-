import { jsonError, jsonOk, requireAdmin } from "@/lib/api";
import { adminGetRevenueReport } from "@/services/admin";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const url = new URL(req.url);
    const days = Math.min(Math.max(Number(url.searchParams.get("days") ?? 30) || 30, 1), 365);
    return jsonOk(await adminGetRevenueReport(days));
  } catch (error) {
    return jsonError(error);
  }
}
