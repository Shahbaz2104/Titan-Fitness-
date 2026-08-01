import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { subscribePush } from "@/services/notifications";
import { z } from "zod";

const subscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = subscribeSchema.parse(body);
    return jsonOk(
      await subscribePush({
        userId: user.id,
        endpoint: parsed.endpoint,
        keysP256dh: parsed.keys.p256dh,
        keysAuth: parsed.keys.auth,
        userAgent: request.headers.get("user-agent") ?? undefined,
      })
    );
  } catch (error) {
    return jsonError(error);
  }
}
