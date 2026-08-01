import { jsonError, jsonOk, parseBody, requireUser, withRateLimit } from "@/lib/api";
import { memberProfileSchema } from "@/lib/validators";
import { getMemberProfile, updateMemberProfile } from "@/services/members";

export async function GET() {
  try {
    const user = await requireUser();
    const profile = await getMemberProfile(user.id);
    return jsonOk(profile);
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await requireUser();
    await withRateLimit(user.id, 30, 60_000);
    const body = await req.json().catch(() => null);
    const data = parseBody(memberProfileSchema, body);
    const profile = await updateMemberProfile(user.id, data);
    return jsonOk(profile);
  } catch (error) {
    return jsonError(error);
  }
}
