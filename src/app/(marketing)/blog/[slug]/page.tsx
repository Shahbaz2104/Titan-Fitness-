import { notFound } from "next/navigation";
import { BlogPostClient } from "./blog-post-client";
import { getPosts, getPost } from "@/lib/blog-data";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return buildMetadata({
    title: post?.title ?? "Article",
    description: post?.excerpt,
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return <BlogPostClient slug={slug} />;
}
