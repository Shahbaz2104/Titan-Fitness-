import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { checkInBooking } from "@/services/bookings";

export async function POST(_req: Request, { params }: { params: Promise<{ classId: string }> }) {
  try {
    const user = await requireUser();
    const { classId } = await params;
    return jsonOk(await checkInBooking(user.id, classId));
  } catch (error) {
    return jsonError(error);
  }
}
