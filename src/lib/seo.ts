import type { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME, APP_URL } from "@/lib/constants";

interface SeoOptions {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description = APP_DESCRIPTION,
  image,
  path = "/",
  type = "website",
  publishedTime,
  noIndex,
}: SeoOptions = {}): Metadata {
  const fullTitle = title ? `${title} | ${APP_NAME}` : `${APP_NAME} — ${APP_TAGLINE}`;
  const url = `${APP_URL}${path}`;
  const ogImage = image ?? `${APP_URL}/og-image.png`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(APP_URL),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: APP_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
      type,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

export const APP_TAGLINE = "Train Harder. Live Stronger.";
