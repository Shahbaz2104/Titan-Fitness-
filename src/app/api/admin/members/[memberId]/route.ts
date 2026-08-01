import { jsonError, jsonOk, parseBody, requireAdmin } from "@/lib/api";
import { memberStatusSchema } from "@/lib/validators";
import { adminGetMemberDetail, adminUpdateMemberStatus } from "@/services/admin";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    await requireAdmin();
    const { memberId } = await params;
    return jsonOk(await adminGetMemberDetail(memberId));
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    await requireAdmin();
    const { memberId } = await params;
    const body = await req.json().catch(() => null);
    const data = parseBody(memberStatusSchema, body);
    const result: Record<string, unknown> = {};
    if (data.isActive !== undefined) {
      result.member = await adminUpdateMemberStatus(memberId, data.isActive);
    }
    return jsonOk(result);
  } catch (error) {
    return jsonError(error);
  }
}
