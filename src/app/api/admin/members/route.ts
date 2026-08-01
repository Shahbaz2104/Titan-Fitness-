import { jsonError, jsonOk, requireAdmin } from "@/lib/api";
import { adminGetMembers } from "@/services/admin";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1) || 1);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 20) || 20, 100);
    return jsonOk(
      await adminGetMembers({
        page,
        limit,
        search: url.searchParams.get("search") ?? undefined,
        status: url.searchParams.get("status") ?? undefined,
      })
    );
  } catch (error) {
    return jsonError(error);
  }
}
