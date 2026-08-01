import { ApiError, jsonError, jsonOk, parseBody, requireUser, withRateLimit } from "@/lib/api";
import { commentSchema } from "@/lib/validators";
import { addComment, getComments } from "@/services/content";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!post) throw new ApiError("Post not found", 404, "NOT_FOUND");
    return jsonOk(await getComments(post.id));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const user = await requireUser();
    await withRateLimit(user.id, 10, 60_000);
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!post) throw new ApiError("Post not found", 404, "NOT_FOUND");
    const body = await req.json().catch(() => null);
    const data = parseBody(commentSchema, body);
    return jsonOk(await addComment(user.id, post.id, data.content), { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
