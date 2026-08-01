import { jsonError, jsonOk, parseBody, requireUser } from "@/lib/api";
import { rescheduleSchema } from "@/lib/validators";
import { rescheduleBooking } from "@/services/bookings";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const user = await requireUser();
    const { bookingId } = await params;
    const body = await req.json().catch(() => null);
    const data = parseBody(rescheduleSchema, body);
    return jsonOk(await rescheduleBooking(user.id, bookingId, data.newClassId));
  } catch (error) {
    return jsonError(error);
  }
}
