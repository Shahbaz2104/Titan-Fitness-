import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getMembershipPlans } from "@/services/payments";

export async function GET() {
  try {
    await requireUser();
    return jsonOk(await getMembershipPlans());
  } catch (error) {
    return jsonError(error);
  }
}
