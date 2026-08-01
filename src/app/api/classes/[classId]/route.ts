import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getClassById } from "@/services/bookings";

export async function GET(_req: Request, { params }: { params: Promise<{ classId: string }> }) {
  try {
    const user = await requireUser();
    const { classId } = await params;
    return jsonOk(await getClassById(classId, user.id));
  } catch (error) {
    return jsonError(error);
  }
}
