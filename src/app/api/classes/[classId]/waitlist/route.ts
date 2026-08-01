import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { joinWaitlist } from "@/services/bookings";

export async function POST(_req: Request, { params }: { params: Promise<{ classId: string }> }) {
  try {
    const user = await requireUser();
    const { classId } = await params;
    return jsonOk(await joinWaitlist(user.id, classId), { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
