import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { ImageReveal } from "@/components/ui/image-reveal";
import { AnimeText } from "@/components/ui/anime-text";
import { GsapReveal } from "@/components/ui/gsap-reveal";

const POSTS = [
  {
    slug: "10-science-backed-habits-for-sustainable-fat-loss",
    title: "10 Science-Backed Habits for Sustainable Fat Loss",
    excerpt:
      "Forget crash diets. These evidence-based habits are what actually move the needle long-term.",
    category: "Nutrition",
    readTime: 8,
    image: "/images/blog/fat-loss.webp",
  },
  {
    slug: "the-complete-beginner-guide-to-barbell-training",
    title: "The Complete Beginner's Guide to Barbell Training",
    excerpt:
      "Master the squat, bench, and deadlift with this step-by-step guide to technique and programming.",
    category: "Strength",
    readTime: 12,
    image: "/images/blog/barbell.jpeg",
  },
  {
    slug: "why-rest-days-are-where-gains-are-made",
    title: "Why Rest Days Are Where Gains Are Made",
    excerpt:
      "Recovery isn't laziness — it's training. Here's how to optimize sleep, nutrition, and recovery.",
    category: "Recovery",
    readTime: 6,
    image: "/images/blog/recovery.jpg",
  },
];

export function BlogPreview() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <h2 className="font-display text-foreground text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
              <AnimeText text="From the Titan blog" effect="blur" scroll />
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-primary hover:text-primary-light inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
          >
            All articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {POSTS.map((post, i) => (
            <GsapReveal key={post.slug} delay={i * 0.1}>
              <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
                <div className="border-border aspect-[16/10] overflow-hidden rounded-xl border">
                  <ImageReveal
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full"
                    imgClassName="group-hover:scale-105"
                    fallbackClassName="bg-surface-2 h-full w-full"
                  />
                </div>
                <div className="flex flex-1 flex-col px-1 pt-5">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-primary font-medium">{post.category}</span>
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime} min read
                    </span>
                  </div>
                  <h3 className="text-foreground mt-3 text-lg leading-snug font-semibold tracking-[-0.01em] transition-colors duration-200 group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </GsapReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
