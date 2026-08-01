import { jsonError, jsonOk, parseBody, requireUser, withRateLimit } from "@/lib/api";
import { referralApplySchema } from "@/lib/validators";
import { applyReferral } from "@/services/payments";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    await withRateLimit(user.id, 5, 60_000);
    const body = await req.json().catch(() => null);
    const data = parseBody(referralApplySchema, body);
    return jsonOk(await applyReferral(user.id, data.code), { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
