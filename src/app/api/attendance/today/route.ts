import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { isCheckedInToday } from "@/services/attendance";

export async function GET() {
  try {
    const user = await requireUser();
    return jsonOk(await isCheckedInToday(user.id));
  } catch (error) {
    return jsonError(error);
  }
}
