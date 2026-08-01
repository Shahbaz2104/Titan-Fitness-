import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getMyBadges } from "@/services/gamification";

export async function GET() {
  try {
    const user = await requireUser();
    return jsonOk(await getMyBadges(user.id));
  } catch (error) {
    return jsonError(error);
  }
}
