import { jsonError, jsonOk, parseBody, requireAdmin } from "@/lib/api";
import { blogPostAdminSchema } from "@/lib/validators";
import { adminCreateBlogPost, adminGetBlogPosts } from "@/services/admin";

const createBlogPostSchema = blogPostAdminSchema.extend({
  slug: blogPostAdminSchema.shape.slug.optional(),
});

export async function GET() {
  try {
    await requireAdmin();
    return jsonOk(await adminGetBlogPosts());
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json().catch(() => null);
    const data = parseBody(createBlogPostSchema, body);
    const { slug: _slug, ...rest } = data;
    void _slug;
    return jsonOk(
      await adminCreateBlogPost({ ...rest, authorId: admin.id, status: data.status ?? "DRAFT" }),
      { status: 201 }
    );
  } catch (error) {
    return jsonError(error);
  }
}
