import { jsonError, jsonOk, parseBody, requireUser } from "@/lib/api";
import { searchQuerySchema } from "@/lib/validators";
import { globalSearch } from "@/services/search";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q") ?? "";
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 12) || 12, 50);
    if (!q.trim()) return jsonOk({ programs: [], posts: [], classes: [], exercises: [] });
    return jsonOk(await globalSearch(q, limit));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req: Request) {
  try {
    await requireUser();
    const body = await req.json().catch(() => null);
    const data = parseBody(searchQuerySchema, body);
    return jsonOk(await globalSearch(data.q, data.limit));
  } catch (error) {
    return jsonError(error);
  }
}
