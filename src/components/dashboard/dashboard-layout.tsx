"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftRight,
  Bell,
  Bot,
  CalendarDays,
  ChevronsLeft,
  CreditCard,
  Dumbbell,
  Flame,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  Medal,
  QrCode,
  Salad,
  Sparkles,
  Trophy,
  UserRound,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { useUser } from "@/hooks/use-user";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV_SECTIONS: {
  label: string;
  items: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
}[] = [
  {
    label: "Main",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/workouts", label: "Workouts", icon: Dumbbell },
      { href: "/dashboard/nutrition", label: "Nutrition", icon: Salad },
      { href: "/dashboard/progress", label: "Progress", icon: HeartPulse },
    ],
  },
  {
    label: "AI Coach",
    items: [
      { href: "/dashboard/ai/chat", label: "AI Coach", icon: Bot },
      { href: "/dashboard/ai/workout-generator", label: "Workout Generator", icon: Sparkles },
      { href: "/dashboard/ai/nutritionist", label: "AI Nutritionist", icon: Flame },
    ],
  },
  {
    label: "Gym",
    items: [
      { href: "/dashboard/classes", label: "Classes", icon: CalendarDays },
      { href: "/dashboard/attendance", label: "Attendance", icon: QrCode },
      { href: "/dashboard/membership", label: "Membership", icon: CreditCard },
      { href: "/dashboard/payments", label: "Payments", icon: ArrowLeftRight },
    ],
  },
  {
    label: "Community",
    items: [
      { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
      { href: "/dashboard/challenges", label: "Challenges", icon: Medal },
      { href: "/dashboard/referrals", label: "Referrals", icon: Users },
    ],
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useUser();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const [signingOut, setSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await authClient.signOut();
    toast.success("Signed out");
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="bg-grid pointer-events-none fixed inset-0" />

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-border bg-surface/70 backdrop-blur-2xl transition-transform duration-300 lg:flex",
          !sidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex h-20 items-center justify-between px-6">
          <Logo />
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            aria-label="Collapse sidebar"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                      isActive(item.href)
                        ? "text-primary"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    {isActive(item.href) && (
                      <motion.span
                        layoutId="dash-nav-pill"
                        className="absolute inset-0 rounded-xl bg-primary/10"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <item.icon className="relative z-10 h-4 w-4" />
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
              <AvatarFallback>
                {(user?.name ?? "T").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {user?.name ?? "Member"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.role === "ADMIN" ? "Administrator" : "Pro Member"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleSignOut}
              disabled={signingOut}
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r border-border bg-surface/95 backdrop-blur-2xl lg:hidden"
            >
              <div className="flex h-20 items-center justify-between px-6">
                <Logo />
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/5"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
                {NAV_SECTIONS.map((section) => (
                  <div key={section.label}>
                    <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {section.label}
                    </p>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                            isActive(item.href)
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
              <div className="border-t border-border p-4">
                <Button variant="outline" className="w-full" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col transition-all duration-300 lg:ml-72",
          !sidebarOpen && "lg:ml-0"
        )}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:h-20 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
                Dashboard
              </h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Welcome back, {user?.name?.split(" ")[0] ?? "athlete"} 👋
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="success" className="hidden sm:inline-flex">
              <Zap className="h-3 w-3" />
              Streak: 21 days
            </Badge>
            <Link
              href="/dashboard/ai/chat"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-accent transition-all hover:border-accent/50 hover:shadow-glow-accent"
              aria-label="AI Coach"
            >
              <Bot className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-all hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                3
              </span>
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-all hover:text-foreground"
              aria-label="Profile"
            >
              <UserRound className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <main className="relative flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>

        <footer className="border-t border-border px-6 py-4">
          <p className="text-center text-xs text-muted-foreground">
            Titan Fitness · Train Harder. Live Stronger.
          </p>
        </footer>
      </div>
    </div>
  );
}
