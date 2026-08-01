import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getMyBookings } from "@/services/bookings";

export async function GET() {
  try {
    const user = await requireUser();
    return jsonOk(await getMyBookings(user.id));
  } catch (error) {
    return jsonError(error);
  }
}
