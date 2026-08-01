import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getMyBookmarks } from "@/services/content";

export async function GET() {
  try {
    const user = await requireUser();
    return jsonOk(await getMyBookmarks(user.id));
  } catch (error) {
    return jsonError(error);
  }
}
