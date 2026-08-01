import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getPushSubscriptions } from "@/services/notifications";
import { getVapidPublicKey, pushEnabled } from "@/lib/push";

export async function GET() {
  try {
    const user = await requireUser();
    const subscriptions = await getPushSubscriptions(user.id);
    return jsonOk({
      enabled: pushEnabled(),
      vapidPublicKey: pushEnabled() ? getVapidPublicKey() : null,
      subscriptions: subscriptions.map((s) => s.endpoint),
    });
  } catch (error) {
    return jsonError(error);
  }
}
