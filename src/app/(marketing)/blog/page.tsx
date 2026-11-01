import { BlogIndexClient } from "./blog-index-client";
import { getPublishedPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = buildMetadata({
  title: "Blog",
  description:
    "Evidence-based training, nutrition, and mindset articles from the Titan Fitness coaching team.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return <BlogIndexClient initialPosts={posts} />;
}
