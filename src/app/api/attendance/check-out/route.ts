import { jsonError, jsonOk, requireUser, withRateLimit } from "@/lib/api";
import { checkOut } from "@/services/attendance";

export async function POST() {
  try {
    const user = await requireUser();
    await withRateLimit(user.id, 10, 60_000);
    return jsonOk(await checkOut(user.id));
  } catch (error) {
    return jsonError(error);
  }
}
