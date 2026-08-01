import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { markAllRead } from "@/services/notifications";

export async function POST() {
  try {
    const user = await requireUser();
    return jsonOk(await markAllRead(user.id));
  } catch (error) {
    return jsonError(error);
  }
}
