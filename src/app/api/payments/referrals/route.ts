import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getReferralInfo } from "@/services/payments";

export async function GET() {
  try {
    const user = await requireUser();
    return jsonOk(await getReferralInfo(user.id));
  } catch (error) {
    return jsonError(error);
  }
}
