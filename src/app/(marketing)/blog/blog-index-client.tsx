"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, Clock, Eye, Heart, Search } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { BLOG_CATEGORIES, searchPosts } from "@/lib/blog-data";

export function BlogIndexClient() {
  const [category, setCategory] = React.useState<string>("All");
  const [query, setQuery] = React.useState("");
  const [saved, setSaved] = React.useState<Set<string>>(new Set());
  const debouncedQuery = useDebounce(query, 300);

  const posts = React.useMemo(
    () => searchPosts(debouncedQuery, category),
    [debouncedQuery, category]
  );

  return (
    <>
      <PageHeader
        badge="The Titan Blog"
        title="Knowledge Is"
        highlight="Power"
        description="Evidence-based training, nutrition, and mindset — written by our coaches."
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search + categories */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, topics, tags…"
                className="pl-11"
                aria-label="Search articles"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {BLOG_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                    category === cat
                      ? "border-primary bg-primary/10 text-primary shadow-glow"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground hover:border-white/20"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Featured */}
          {posts.filter((p) => p.featured).length > 0 && category === "All" && !query && (
            <Link
              href={`/blog/${posts.find((p) => p.featured)?.slug}`}
              className="group border-border from-primary/15 via-surface to-accent/10 hover:border-primary/30 hover:shadow-glow relative mt-10 block overflow-hidden rounded-3xl border bg-gradient-to-br p-10 backdrop-blur-xl transition-all duration-500 sm:p-14"
            >
              <div className="bg-grid absolute inset-0 opacity-40" />
              <div className="relative max-w-2xl">
                <div className="flex items-center gap-3">
                  <Badge variant="accent">Featured</Badge>
                  <Badge variant="secondary">{posts.find((p) => p.featured)?.category}</Badge>
                </div>
                <h2 className="font-display text-foreground group-hover:text-primary mt-5 text-3xl leading-tight font-bold tracking-tight uppercase transition-colors duration-300 sm:text-4xl">
                  {posts.find((p) => p.featured)?.title}
                </h2>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {posts.find((p) => p.featured)?.excerpt}
                </p>
                <div className="text-muted-foreground mt-5 flex items-center gap-5 text-xs">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {posts.find((p) => p.featured)?.readTime} min read
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    {(posts.find((p) => p.featured)?.views ?? 0).toLocaleString()} views
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Grid */}
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group border-border bg-surface/60 hover:border-primary/30 hover:shadow-glow relative flex h-full flex-col rounded-2xl border p-7 backdrop-blur-xl transition-all duration-500"
              >
                <div className="mb-5 flex items-center justify-between">
                  <Badge variant="secondary">{post.category}</Badge>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSaved((prev) => {
                          const next = new Set(prev);
                          if (next.has(post.slug)) next.delete(post.slug);
                          else next.add(post.slug);
                          return next;
                        });
                      }}
                      aria-label={saved.has(post.slug) ? "Remove bookmark" : "Bookmark article"}
                      className={cn(
                        "rounded-full p-1.5 transition-all duration-300",
                        saved.has(post.slug)
                          ? "text-primary"
                          : "text-muted-foreground hover:text-primary"
                      )}
                    >
                      <Bookmark className={cn("h-4 w-4", saved.has(post.slug) && "fill-primary")} />
                    </button>
                    <button
                      aria-label="Like article"
                      className="text-muted-foreground hover:text-primary rounded-full p-1.5 transition-all duration-300 active:scale-125"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <Link href={`/blog/${post.slug}`} className="flex flex-1 flex-col">
                  <h2 className="font-display text-foreground group-hover:text-primary text-lg leading-snug font-semibold tracking-wide transition-colors duration-300">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mt-3 flex-1 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="border-border text-muted-foreground mt-6 flex items-center justify-between border-t pt-4 text-xs">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime} min read
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Heart className="text-primary h-3.5 w-3.5" />
                      {post.likes}
                    </span>
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="mt-16 text-center">
              <p className="font-display text-foreground text-xl font-semibold">
                No articles found
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                Try a different search term or category.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
