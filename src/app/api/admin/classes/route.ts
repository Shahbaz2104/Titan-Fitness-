import { jsonError, jsonOk, requireAdmin } from "@/lib/api";
import { adminGetClasses } from "@/services/admin";

export async function GET() {
  try {
    await requireAdmin();
    return jsonOk(await adminGetClasses());
  } catch (error) {
    return jsonError(error);
  }
}
