import { jsonError, jsonOk, parseBody, requireAdmin } from "@/lib/api";
import { challengeSchema } from "@/lib/validators";
import { adminCreateChallenge, adminGetChallenges } from "@/services/admin";

export async function GET() {
  try {
    await requireAdmin();
    return jsonOk(await adminGetChallenges());
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json().catch(() => null);
    const data = parseBody(challengeSchema, body);
    return jsonOk(await adminCreateChallenge(data), { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
