import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  getPost as getStaticPost,
  getPosts as getStaticPosts,
  type BlogPostData,
} from "@/lib/blog-data";

const FALLBACK_IMAGE = "/images/blog/recovery.jpg";

type PostWithRelations = Prisma.BlogPostGetPayload<{
  include: {
    author: {
      select: {
        name: true;
        role: true;
        trainerProfile: { select: { specialty: true } };
      };
    };
    category: { select: { name: true } };
  };
}>;

function tagsFromJson(tags: Prisma.JsonValue): string[] {
  if (!Array.isArray(tags)) return [];
  return tags.filter((tag): tag is string => typeof tag === "string");
}

function mapPost(post: PostWithRelations, index: number): BlogPostData {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    category: post.category?.name ?? "Fitness",
    tags: tagsFromJson(post.tags),
    author: post.author.name,
    authorRole:
      post.author.role === "ADMIN" || post.author.role === "SUPER_ADMIN"
        ? "Titan Team"
        : (post.author.trainerProfile?.specialty ?? "Titan Coach"),
    readTime: post.readTimeMin,
    views: post.views,
    likes: post.likes,
    publishedAt: (post.publishedAt ?? post.createdAt).toISOString().slice(0, 10),
    content: post.content,
    image: post.coverImage ?? FALLBACK_IMAGE,
    featured: index === 0,
  };
}

export async function getPublishedPosts(): Promise<BlogPostData[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED", deletedAt: null },
      include: {
        author: {
          select: {
            name: true,
            role: true,
            trainerProfile: { select: { specialty: true } },
          },
        },
        category: { select: { name: true } },
      },
      orderBy: { publishedAt: "desc" },
    });
    if (posts.length > 0) {
      return posts.map((post, index) => mapPost(post, index));
    }
  } catch {
    // Fall back to the bundled articles when the database is unavailable.
  }
  return getStaticPosts();
}

export async function getPublishedPost(slug: string): Promise<BlogPostData | null> {
  try {
    const post = await prisma.blogPost.findFirst({
      where: { slug, status: "PUBLISHED", deletedAt: null },
      include: {
        author: {
          select: {
            name: true,
            role: true,
            trainerProfile: { select: { specialty: true } },
          },
        },
        category: { select: { name: true } },
      },
    });
    if (post) return mapPost(post, 0);
  } catch {
    // Fall back to the bundled article when the database is unavailable.
  }
  return getStaticPost(slug) ?? null;
}
