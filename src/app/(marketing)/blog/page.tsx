import { BlogIndexClient } from "./blog-index-client";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog",
  description:
    "Evidence-based training, nutrition, and mindset articles from the Titan Fitness coaching team.",
  path: "/blog",
});

export default function BlogPage() {
  return <BlogIndexClient />;
}
