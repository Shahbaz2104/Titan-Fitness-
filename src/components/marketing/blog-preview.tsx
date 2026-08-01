"use client";

import Link from "next/link";
import { ArrowRight, Clock, Eye, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";

const POSTS = [
  {
    slug: "10-science-backed-habits-for-sustainable-fat-loss",
    title: "10 Science-Backed Habits for Sustainable Fat Loss",
    excerpt:
      "Forget crash diets. These evidence-based habits are what actually move the needle long-term.",
    category: "Nutrition",
    readTime: 8,
    views: 12400,
    likes: 342,
  },
  {
    slug: "the-complete-beginner-guide-to-barbell-training",
    title: "The Complete Beginner's Guide to Barbell Training",
    excerpt:
      "Master the squat, bench, and deadlift with this step-by-step guide to technique and programming.",
    category: "Strength",
    readTime: 12,
    views: 9800,
    likes: 415,
  },
  {
    slug: "why-rest-days-are-where-gains-are-made",
    title: "Why Rest Days Are Where Gains Are Made",
    excerpt:
      "Recovery isn't laziness — it's training. Here's how to optimize sleep, nutrition, and recovery.",
    category: "Recovery",
    readTime: 6,
    views: 15200,
    likes: 528,
  },
];

export function BlogPreview() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal>
            <Badge variant="default" className="mb-4">
              The Titan Blog
            </Badge>
            <h2 className="font-display text-foreground text-4xl font-bold tracking-tight uppercase sm:text-5xl">
              Latest <span className="text-gradient">Insights</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href="/blog"
              className="group text-primary hover:text-accent inline-flex items-center gap-2 text-sm font-medium transition-colors"
            >
              All articles
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {POSTS.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.1}>
              <Link
                href={`/blog/${post.slug}`}
                className="group border-border bg-surface/60 hover:border-primary/30 hover:shadow-glow flex h-full flex-col rounded-2xl border p-7 backdrop-blur-xl transition-all duration-500"
              >
                <div className="mb-5 flex items-center justify-between">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readTime} min read
                  </span>
                </div>
                <h3 className="font-display text-foreground group-hover:text-primary text-lg leading-snug font-semibold tracking-wide transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mt-3 flex-1 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="border-border text-muted-foreground mt-6 flex items-center gap-5 border-t pt-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    {(post.views / 1000).toFixed(1)}k
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="text-primary h-3.5 w-3.5" />
                    {post.likes}
                  </span>
                  <span className="text-primary ml-auto flex items-center gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Read <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
