import { jsonError, jsonOk, parseBody, requireUser, withRateLimit } from "@/lib/api";
import { testimonialSchema } from "@/lib/validators";
import { addTestimonial, getTestimonials } from "@/services/content";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit"));
    return jsonOk(await getTestimonials(limit || undefined));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    await withRateLimit(user.id, 5, 60_000);
    const body = await req.json().catch(() => null);
    const data = parseBody(testimonialSchema, body);
    return jsonOk(await addTestimonial(user.id, { ...data, rating: data.rating ?? 5 }), {
      status: 201,
    });
  } catch (error) {
    return jsonError(error);
  }
}
