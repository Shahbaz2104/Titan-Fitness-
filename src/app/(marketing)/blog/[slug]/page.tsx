import { notFound } from "next/navigation";
import { BlogPostClient } from "./blog-post-client";
import { getPublishedPost, getPublishedPosts } from "@/lib/blog";
import { getPosts } from "@/lib/blog-data";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  return buildMetadata({
    title: post?.title ?? "Article",
    description: post?.excerpt,
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPublishedPost(slug), getPublishedPosts()]);
  if (!post) notFound();

  const related = posts.filter((item) => item.slug !== slug).slice(0, 3);

  return <BlogPostClient post={post} related={related} />;
}
