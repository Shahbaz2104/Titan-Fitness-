"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, Clock, Eye, Heart, Search } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SmartImage } from "@/components/ui/smart-image";
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

  const featured = posts.find((p) => p.featured);

  return (
    <>
      <PageHeader
        badge="The Titan Blog"
        title="Knowledge is"
        highlight="power"
        description="Evidence-based training, nutrition, and mindset — written by our coaches."
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
                    category === cat
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {featured && category === "All" && !query && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group border-border bg-surface/60 hover:border-white/15 relative mt-10 block overflow-hidden rounded-2xl border transition-colors duration-300"
            >
              <div className="grid lg:grid-cols-2">
                <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:h-full">
                  <SmartImage
                    src={featured.image}
                    alt={featured.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    fallbackClassName="bg-surface-2 absolute inset-0"
                  />
                </div>
                <div className="flex flex-col justify-center p-8 sm:p-12">
                  <div className="flex items-center gap-3">
                    <Badge variant="accent">Featured</Badge>
                    <Badge variant="secondary">{featured.category}</Badge>
                  </div>
                  <h2 className="font-display text-foreground group-hover:text-primary mt-5 text-2xl leading-tight font-bold tracking-[-0.02em] transition-colors duration-300 sm:text-4xl">
                    {featured.title}
                  </h2>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    {featured.excerpt}
                  </p>
                  <div className="text-muted-foreground mt-5 flex items-center gap-5 text-xs">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {featured.readTime} min read
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      {featured.views.toLocaleString()} views
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group flex flex-col"
              >
                <div className="border-border relative aspect-[16/10] overflow-hidden rounded-xl border">
                  <Link href={`/blog/${post.slug}`} aria-label={post.title}>
                    <SmartImage
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      fallbackClassName="bg-surface-2 h-full w-full"
                    />
                  </Link>
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
                      "border-border bg-background/70 absolute top-3 right-3 rounded-full border p-2 backdrop-blur-sm transition-colors",
                      saved.has(post.slug)
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    <Bookmark className={cn("h-4 w-4", saved.has(post.slug) && "fill-primary")} />
                  </button>
                </div>
                <div className="flex flex-1 flex-col px-1 pt-5">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-muted-foreground text-xs">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="flex flex-1 flex-col">
                    <h2 className="text-foreground group-hover:text-primary mt-3 text-lg leading-snug font-semibold tracking-[-0.01em] transition-colors duration-200">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="border-border text-muted-foreground mt-5 flex items-center justify-between border-t pt-4 text-xs">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readTime} min read
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Heart className="text-primary h-3.5 w-3.5" />
                        {post.likes}
                      </span>
                    </div>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="mt-16 text-center">
              <p className="text-foreground text-xl font-semibold">No articles found</p>
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
