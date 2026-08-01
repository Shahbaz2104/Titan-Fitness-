import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constants";
import { getPosts } from "@/lib/blog-data";
import { PROGRAMS } from "@/app/(marketing)/programs/[slug]/page";
import { TRAINERS } from "@/app/(marketing)/trainers/[slug]/page";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${APP_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${APP_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${APP_URL}/programs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${APP_URL}/trainers`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${APP_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${APP_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${APP_URL}/gallery`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${APP_URL}/bmi`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${APP_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${APP_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${APP_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${APP_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${APP_URL}/refund-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const programRoutes: MetadataRoute.Sitemap = PROGRAMS.map((p) => ({
    url: `${APP_URL}/programs/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const trainerRoutes: MetadataRoute.Sitemap = TRAINERS.map((t) => ({
    url: `${APP_URL}/trainers/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getPosts().map((post) => ({
    url: `${APP_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...programRoutes, ...trainerRoutes, ...blogRoutes];
}
