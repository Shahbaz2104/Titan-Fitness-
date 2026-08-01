import { jsonError, jsonOk, requireAdmin } from "@/lib/api";
import { adminGetDashboardStats } from "@/services/admin";

export async function GET() {
  try {
    await requireAdmin();
    return jsonOk(await adminGetDashboardStats());
  } catch (error) {
    return jsonError(error);
  }
}
