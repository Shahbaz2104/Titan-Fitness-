import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getAttendanceStats } from "@/services/attendance";

export async function GET() {
  try {
    const user = await requireUser();
    return jsonOk(await getAttendanceStats(user.id));
  } catch (error) {
    return jsonError(error);
  }
}
