import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { deleteProgressPhoto } from "@/services/members";

export async function DELETE(_req: Request, { params }: { params: Promise<{ photoId: string }> }) {
  try {
    const user = await requireUser();
    const { photoId } = await params;
    return jsonOk(await deleteProgressPhoto(user.id, photoId));
  } catch (error) {
    return jsonError(error);
  }
}
