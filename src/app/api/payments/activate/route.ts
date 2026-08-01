import { jsonError, jsonOk, parseBody, requireUser, withRateLimit } from "@/lib/api";
import { checkoutSchema } from "@/lib/validators";
import { activateMembership } from "@/services/payments";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    await withRateLimit(user.id, 5, 60_000);
    const body = await req.json().catch(() => null);
    const data = parseBody(checkoutSchema, body);
    return jsonOk(
      await activateMembership(user.id, data.planId, { branchId: data.branchId ?? undefined }),
      { status: 201 }
    );
  } catch (error) {
    return jsonError(error);
  }
}
