import { jsonError, jsonOk, requireAdmin } from "@/lib/api";
import { adminDeleteCoupon } from "@/services/admin";

export async function DELETE(_req: Request, { params }: { params: Promise<{ couponId: string }> }) {
  try {
    await requireAdmin();
    const { couponId } = await params;
    return jsonOk(await adminDeleteCoupon(couponId));
  } catch (error) {
    return jsonError(error);
  }
}
