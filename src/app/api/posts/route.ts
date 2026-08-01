import { jsonError, jsonOk } from "@/lib/api";
import { getPosts } from "@/services/content";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1) || 1);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 12) || 12, 50);
    return jsonOk(
      await getPosts({
        page,
        limit,
        category: url.searchParams.get("category") ?? undefined,
        search: url.searchParams.get("search") ?? undefined,
      })
    );
  } catch (error) {
    return jsonError(error);
  }
}
