import { jsonError, jsonOk, parseBody, requireAdmin } from "@/lib/api";
import { couponSchema } from "@/lib/validators";
import { adminCreateCoupon, adminGetCoupons } from "@/services/admin";

export async function GET() {
  try {
    await requireAdmin();
    return jsonOk(await adminGetCoupons());
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json().catch(() => null);
    const data = parseBody(couponSchema, body);
    return jsonOk(await adminCreateCoupon(data), { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
