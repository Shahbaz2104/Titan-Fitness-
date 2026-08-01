import { ApiError, jsonError, jsonOk, requireUser, withRateLimit } from "@/lib/api";
import { toggleBookmark } from "@/services/content";
import { prisma } from "@/lib/prisma";

export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const user = await requireUser();
    await withRateLimit(user.id, 30, 60_000);
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!post) throw new ApiError("Post not found", 404, "NOT_FOUND");
    return jsonOk(await toggleBookmark(user.id, post.id));
  } catch (error) {
    return jsonError(error);
  }
}
