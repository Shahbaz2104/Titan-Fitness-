import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { cancelBooking } from "@/services/bookings";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const user = await requireUser();
    const { bookingId } = await params;
    return jsonOk(await cancelBooking(user.id, bookingId));
  } catch (error) {
    return jsonError(error);
  }
}
