import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api";

export async function getPosts(params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 12;
  const where = {
    status: "PUBLISHED" as const,
    deletedAt: null,
    ...(params.category && params.category !== "ALL" ? { category: { slug: params.category } } : {}),
    ...(params.search
      ? {
          OR: [
            { title: { contains: params.search, mode: "insensitive" as const } },
            { excerpt: { contains: params.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { comments: { where: { status: "APPROVED" } }, likesBy: true } },
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return { posts, total, page, pages: Math.ceil(total / limit) };
}

export async function getPostBySlug(slug: string) {
  const post = await prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: { select: { id: true, name: true, slug: true } },
    },
  });
  if (!post) throw new ApiError("Post not found", 404, "NOT_FOUND");

  await prisma.blogPost.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  });

  return post;
}

export async function getRelatedPosts(post: { id: string; categoryId: string | null; tags: unknown }) {
  const tags = Array.isArray(post.tags) ? post.tags.slice(0, 4) : [];
  return prisma.blogPost.findMany({
    where: {
      id: { not: post.id },
      status: "PUBLISHED",
      deletedAt: null,
      OR: [
        ...(post.categoryId ? [{ categoryId: post.categoryId }] : []),
        ...(tags.length ? [{ tags: { array_contains: tags } }] : []),
      ],
    },
    include: { author: { select: { name: true, image: true } } },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });
}

export async function getBlogCategories() {
  return prisma.blogCategory.findMany({
    include: { _count: { select: { posts: { where: { status: "PUBLISHED", deletedAt: null } } } } },
    orderBy: { name: "asc" },
  });
}

export async function getComments(postId: string) {
  return prisma.blogComment.findMany({
    where: { postId, status: "APPROVED", parentId: null },
    include: {
      user: { select: { id: true, name: true, image: true } },
      replies: {
        where: { status: "APPROVED" },
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function addComment(userId: string, postId: string, content: string) {
  const post = await prisma.blogPost.findFirst({
    where: { id: postId, status: "PUBLISHED", deletedAt: null },
  });
  if (!post) throw new ApiError("Post not found", 404, "NOT_FOUND");

  return prisma.blogComment.create({
    data: { postId, userId, content, status: "APPROVED" },
    include: { user: { select: { id: true, name: true, image: true } } },
  });
}

export async function toggleLike(userId: string, postId: string) {
  const existing = await prisma.blogLike.findUnique({
    where: { postId_userId: { postId, userId } },
  });
  if (existing) {
    await prisma.blogLike.delete({ where: { id: existing.id } });
    await prisma.blogPost.update({ where: { id: postId }, data: { likes: { decrement: 1 } } });
    return { liked: false };
  }
  await prisma.blogLike.create({ data: { userId, postId } });
  await prisma.blogPost.update({ where: { id: postId }, data: { likes: { increment: 1 } } });
  return { liked: true };
}

export async function toggleBookmark(userId: string, postId: string) {
  const existing = await prisma.blogBookmark.findUnique({
    where: { postId_userId: { postId, userId } },
  });
  if (existing) {
    await prisma.blogBookmark.delete({ where: { id: existing.id } });
    return { bookmarked: false };
  }
  await prisma.blogBookmark.create({ data: { userId, postId } });
  return { bookmarked: true };
}

export async function getMyBookmarks(userId: string) {
  return prisma.blogBookmark.findMany({
    where: { userId, post: { status: "PUBLISHED", deletedAt: null } },
    include: {
      post: {
        include: {
          author: { select: { name: true, image: true } },
          category: { select: { name: true, slug: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getFAQs(limit?: number) {
  return prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    take: limit,
  });
}

export async function getTestimonials(limit?: number) {
  return prisma.testimonial.findMany({
    where: { status: "APPROVED" },
    orderBy: { isFeatured: "desc" },
    take: limit,
  });
}

export async function addTestimonial(userId: string, data: {
  content: string;
  rating: number;
  programId?: string | null;
}) {
  return prisma.testimonial.create({
    data: { userId, ...data },
  });
}

export async function getGalleryImages() {
  return prisma.galleryImage.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });
}

export async function submitContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string | null;
}) {
  return prisma.contactMessage.create({ data });
}
