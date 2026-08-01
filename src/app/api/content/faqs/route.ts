import { jsonError, jsonOk } from "@/lib/api";
import { getFAQs } from "@/services/content";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit"));
    return jsonOk(await getFAQs(limit || undefined));
  } catch (error) {
    return jsonError(error);
  }
}
