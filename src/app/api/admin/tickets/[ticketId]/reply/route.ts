import { jsonError, jsonOk, parseBody, requireAdmin } from "@/lib/api";
import { ticketMessageSchema } from "@/lib/validators";
import { adminReplyTicket } from "@/services/admin";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { ticketId } = await params;
    const body = await req.json().catch(() => null);
    const data = parseBody(ticketMessageSchema, body);
    return jsonOk(await adminReplyTicket(ticketId, admin.id, data.content), { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
