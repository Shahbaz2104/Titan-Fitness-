import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { listClasses } from "@/services/bookings";

export async function GET(req: Request) {
  try {
    await requireUser();
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1) || 1);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 20) || 20, 50);
    return jsonOk(
      await listClasses({
        branchId: url.searchParams.get("branchId") ?? undefined,
        type: url.searchParams.get("type") ?? undefined,
        date: url.searchParams.get("date") ?? undefined,
        page,
        limit,
      })
    );
  } catch (error) {
    return jsonError(error);
  }
}
