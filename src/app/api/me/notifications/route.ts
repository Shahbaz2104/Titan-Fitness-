import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getNotifications, getUnreadCount } from "@/services/notifications";

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const url = new URL(req.url);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 50) || 50, 200);
    const [notifications, unreadCount] = await Promise.all([
      getNotifications(user.id, limit),
      getUnreadCount(user.id),
    ]);
    return jsonOk({ notifications, unreadCount });
  } catch (error) {
    return jsonError(error);
  }
}
