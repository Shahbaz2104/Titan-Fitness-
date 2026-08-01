import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getActiveChallenges, getMyChallenges } from "@/services/gamification";

export async function GET() {
  try {
    const user = await requireUser();
    const [active, mine] = await Promise.all([
      getActiveChallenges(),
      getMyChallenges(user.id),
    ]);
    return jsonOk({ active, mine });
  } catch (error) {
    return jsonError(error);
  }
}
