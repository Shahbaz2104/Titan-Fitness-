import { jsonError, jsonOk, requireAdmin } from "@/lib/api";
import { adminGetBranches } from "@/services/admin";

export async function GET() {
  try {
    await requireAdmin();
    return jsonOk(await adminGetBranches());
  } catch (error) {
    return jsonError(error);
  }
}
