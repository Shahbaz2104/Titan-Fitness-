import { jsonError, jsonOk, requireAdmin } from "@/lib/api";
import { adminGetTickets } from "@/services/admin";

export async function GET() {
  try {
    await requireAdmin();
    return jsonOk(await adminGetTickets());
  } catch (error) {
    return jsonError(error);
  }
}
