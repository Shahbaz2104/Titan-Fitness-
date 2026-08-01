import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getLeaderboard, getMyRank } from "@/services/gamification";

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const url = new URL(req.url);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 20) || 20, 100);
    const [leaderboard, myRank] = await Promise.all([
      getLeaderboard(limit),
      getMyRank(user.id),
    ]);
    return jsonOk({ leaderboard, myRank });
  } catch (error) {
    return jsonError(error);
  }
}
