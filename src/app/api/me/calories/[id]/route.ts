import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { deleteCalorieLog } from "@/services/members";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    await deleteCalorieLog(user.id, id);
    return jsonOk({ deleted: true });
  } catch (error) {
    return jsonError(error);
  }
}
