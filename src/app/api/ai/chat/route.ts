import { jsonError, jsonOk, parseBody, requireUser, withRateLimit } from "@/lib/api";
import { z } from "zod";
import { aiChat } from "@/services/ai";

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
});

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    await withRateLimit(user.id, 30, 60_000);
    const body = await req.json().catch(() => null);
    const data = parseBody(chatSchema, body);

    const { reply } = await aiChat(user.id, data.message);

    return jsonOk({ reply });
  } catch (error) {
    return jsonError(error);
  }
}
