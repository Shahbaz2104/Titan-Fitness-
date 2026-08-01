import { jsonError, jsonOk, parseBody, requireAdmin } from "@/lib/api";
import { adminUpdateTicketStatus } from "@/services/admin";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    await requireAdmin();
    const { ticketId } = await params;
    const body = await req.json().catch(() => null);
    const data = parseBody(statusSchema, body);
    return jsonOk(await adminUpdateTicketStatus(ticketId, data.status));
  } catch (error) {
    return jsonError(error);
  }
}
