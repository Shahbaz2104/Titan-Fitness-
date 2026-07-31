import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { AnalyticsProvider } from "@/providers/analytics-provider";
import { inter, oswald } from "@/lib/fonts";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: `${APP_NAME} — AI Gym Management Platform`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "gym",
    "fitness",
    "workout",
    "AI personal trainer",
    "nutrition",
    "gym management",
    "membership",
    "Titan Fitness",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-icon.png" }],
    shortcut: [{ url: "/favicon-64.png", type: "image/png" }],
  },
  openGraph: {
    title: `${APP_NAME} — AI Gym Management Platform`,
    description: APP_DESCRIPTION,
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    siteName: APP_NAME,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: APP_NAME }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — AI Gym Management Platform`,
    description: APP_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#050505",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} ${oswald.variable} font-sans`}>
        <ThemeProvider>
          <AnalyticsProvider>
            <QueryProvider>{children}</QueryProvider>
          </AnalyticsProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
