import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { joinChallenge } from "@/services/gamification";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ challengeId: string }> }
) {
  try {
    const user = await requireUser();
    const { challengeId } = await params;
    return jsonOk(await joinChallenge(user.id, challengeId), { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
