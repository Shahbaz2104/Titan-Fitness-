import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { markNotificationRead } from "@/services/notifications";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    return jsonOk(await markNotificationRead(user.id, id));
  } catch (error) {
    return jsonError(error);
  }
}
