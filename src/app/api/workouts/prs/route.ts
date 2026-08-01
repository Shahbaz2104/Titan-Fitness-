import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getPersonalRecords } from "@/services/workouts";

export async function GET() {
  try {
    const user = await requireUser();
    return jsonOk(await getPersonalRecords(user.id));
  } catch (error) {
    return jsonError(error);
  }
}
