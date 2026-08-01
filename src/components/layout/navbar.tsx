"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { useUser } from "@/hooks/use-user";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
  { label: "Trainers", href: "/trainers" },
  { label: "BMI", href: "/bmi" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const mobileOpen = useUIStore((s) => s.mobileNavOpen);
  const setMobileOpen = useUIStore((s) => s.setMobileNavOpen);
  const { data: user } = useUser();

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "glass-strong shadow-card" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "hover:text-primary relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                isActive(link.href) ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-pill"
                  className="bg-primary/10 absolute inset-0 -z-10 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <Link
                href="/dashboard/ai/chat"
                className="group text-muted-foreground hover:text-accent flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors"
              >
                <Sparkles className="text-accent h-4 w-4 transition-transform group-hover:rotate-12" />
                AI Coach
              </Link>
              <Button asChild variant="default" size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild variant="accent" size="sm">
                <Link href="/register">Join Now</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="border-border bg-surface text-foreground flex h-10 w-10 items-center justify-center rounded-full border lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="border-border bg-background/95 overflow-hidden border-t backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-border mt-3 flex gap-3 border-t pt-4">
                {user ? (
                  <Button asChild className="flex-1">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="flex-1">
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild className="flex-1">
                      <Link href="/register">Join Now</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
