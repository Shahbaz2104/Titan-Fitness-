import { jsonError, jsonOk, parseBody, requireUser, withRateLimit } from "@/lib/api";
import { checkoutSchema } from "@/lib/validators";
import { createMembershipOrder } from "@/services/payments";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    await withRateLimit(user.id, 10, 60_000);
    const body = await req.json().catch(() => null);
    const data = parseBody(checkoutSchema, body);
    return jsonOk(
      await createMembershipOrder(user.id, {
        planId: data.planId,
        branchId: data.branchId ?? undefined,
        couponCode: data.couponCode ?? undefined,
      }),
      { status: 201 }
    );
  } catch (error) {
    return jsonError(error);
  }
}
