import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { unsubscribePush } from "@/services/notifications";
import { z } from "zod";

const unsubscribeSchema = z.object({
  endpoint: z.string().url(),
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = unsubscribeSchema.parse(body);
    return jsonOk(await unsubscribePush(user.id, parsed.endpoint));
  } catch (error) {
    return jsonError(error);
  }
}
