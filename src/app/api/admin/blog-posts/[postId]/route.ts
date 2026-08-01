import { jsonError, jsonOk, requireAdmin } from "@/lib/api";
import { adminDeleteBlogPost } from "@/services/admin";

export async function DELETE(_req: Request, { params }: { params: Promise<{ postId: string }> }) {
  try {
    await requireAdmin();
    const { postId } = await params;
    return jsonOk(await adminDeleteBlogPost(postId));
  } catch (error) {
    return jsonError(error);
  }
}
