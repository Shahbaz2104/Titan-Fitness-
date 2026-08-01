import { z } from "zod";
import { jsonError, jsonOk, parseBody, requireUser } from "@/lib/api";
import { validateCoupon } from "@/services/payments";

const validateSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(30)
    .transform((v) => v.toUpperCase()),
  amount: z.number().min(0),
});

export async function POST(req: Request) {
  try {
    await requireUser();
    const body = await req.json().catch(() => null);
    const data = parseBody(validateSchema, body);
    return jsonOk(await validateCoupon(data.code, data.amount));
  } catch (error) {
    return jsonError(error);
  }
}
