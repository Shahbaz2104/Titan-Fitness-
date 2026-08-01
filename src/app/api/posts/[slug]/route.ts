import { jsonError, jsonOk } from "@/lib/api";
import { getPostBySlug, getRelatedPosts } from "@/services/content";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    const related = await getRelatedPosts(post);
    return jsonOk({ ...post, related });
  } catch (error) {
    return jsonError(error);
  }
}
