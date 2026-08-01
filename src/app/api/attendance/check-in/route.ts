import { jsonError, jsonOk, parseBody, requireUser, withRateLimit } from "@/lib/api";
import { attendanceCheckInSchema } from "@/lib/validators";
import { checkIn } from "@/services/attendance";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    await withRateLimit(user.id, 10, 60_000);
    const body = await req.json().catch(() => null);
    const data = parseBody(attendanceCheckInSchema, body);
    return jsonOk(await checkIn(user.id, data), { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
