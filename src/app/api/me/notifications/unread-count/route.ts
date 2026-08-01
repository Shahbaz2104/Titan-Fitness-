import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getUnreadCount } from "@/services/notifications";

export async function GET() {
  try {
    const user = await requireUser();
    return jsonOk({ unreadCount: await getUnreadCount(user.id) });
  } catch (error) {
    return jsonError(error);
  }
}
