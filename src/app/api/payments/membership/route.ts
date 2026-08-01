import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getActiveMembership } from "@/services/payments";

export async function GET() {
  try {
    const user = await requireUser();
    return jsonOk(await getActiveMembership(user.id));
  } catch (error) {
    return jsonError(error);
  }
}
