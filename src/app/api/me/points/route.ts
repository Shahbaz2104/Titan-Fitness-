import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getMyRank } from "@/services/gamification";

export async function GET() {
  try {
    const user = await requireUser();
    const rankInfo = await getMyRank(user.id);
    return jsonOk({ userId: user.id, ...rankInfo });
  } catch (error) {
    return jsonError(error);
  }
}
