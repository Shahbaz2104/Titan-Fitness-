import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getAttendanceHistory } from "@/services/attendance";

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const url = new URL(req.url);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 60) || 60, 365);
    return jsonOk(await getAttendanceHistory(user.id, limit));
  } catch (error) {
    return jsonError(error);
  }
}
