"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  BellRing,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronsLeft,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  ShieldAlert,
  Settings,
  Tag,
  Ticket,
  Trophy,
  Users,
  X,
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
      { href: "/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/admin/members", label: "Members", icon: Users },
      { href: "/admin/programs", label: "Programs", icon: Dumbbell },
      { href: "/admin/classes", label: "Classes", icon: CalendarDays },
    ],
  },
  {
    label: "Commerce",
    items: [{ href: "/admin/coupons", label: "Coupons", icon: Tag }],
  },
  {
    label: "Support",
    items: [{ href: "/admin/tickets", label: "Tickets", icon: Ticket }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/blog", label: "Blog Posts", icon: BookOpen },
      { href: "/admin/challenges", label: "Challenges", icon: Trophy },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/branches", label: "Branches", icon: Building2 },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

function isAdminRole(role?: string) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useUser();
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
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  if (userLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-3">
          <div className="border-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
          <p className="text-sm">Checking access…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <ShieldAlert className="text-primary h-14 w-14" />
        <div>
          <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
            Admin area
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">Sign in to continue.</p>
        </div>
        <Button asChild>
          <Link href="/login">Go to login</Link>
        </Button>
      </div>
    );
  }

  if (!isAdminRole(user?.role)) {
    return (
      <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <ShieldAlert className="text-warning h-14 w-14" />
        <div>
          <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
            Access denied
          </h1>
          <p className="text-muted-foreground mt-2 max-w-sm text-sm">
            This area is restricted to administrators. Contact support if you believe this is a
            mistake.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-screen">
      <div className="bg-grid pointer-events-none fixed inset-0" />

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "border-border bg-surface/70 fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r backdrop-blur-2xl transition-transform duration-300 lg:flex",
          !sidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex h-20 items-center justify-between px-6">
          <Logo />
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-muted-foreground hover:text-foreground rounded-full p-2 transition-colors hover:bg-white/5"
            aria-label="Collapse sidebar"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 px-6 pb-4">
          <Badge className="bg-primary/15 text-primary hover:bg-primary/20">
            <ShieldAlert className="h-3 w-3" />
            Admin Panel
          </Badge>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-4 pb-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="text-muted-foreground px-3 pb-2 text-[10px] font-semibold tracking-[0.2em] uppercase">
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
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    {isActive(item.href) && (
                      <motion.span
                        layoutId="admin-nav-pill"
                        className="bg-primary/10 absolute inset-0 rounded-xl"
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

        <div className="border-border border-t p-4">
          <div className="border-border bg-surface flex items-center gap-3 rounded-xl border p-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "Admin"} />
              <AvatarFallback>{(user?.name ?? "A").slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm font-semibold">
                {user?.name ?? "Administrator"}
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {user?.role === "SUPER_ADMIN" ? "Super Admin" : "Administrator"}
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
              className="border-border bg-surface/95 fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r backdrop-blur-2xl lg:hidden"
            >
              <div className="flex h-20 items-center justify-between px-6">
                <Logo />
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-muted-foreground rounded-full p-2 transition-colors hover:bg-white/5"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
                {NAV_SECTIONS.map((section) => (
                  <div key={section.label}>
                    <p className="text-muted-foreground px-3 pb-2 text-[10px] font-semibold tracking-[0.2em] uppercase">
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
                              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
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
              <div className="border-border border-t p-4">
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
        <header className="border-border bg-background/80 sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 backdrop-blur-xl sm:h-20 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="border-border bg-surface text-foreground flex h-10 w-10 items-center justify-center rounded-full border lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-display text-foreground text-lg font-bold tracking-wide uppercase">
                Admin Panel
              </h1>
              <p className="text-muted-foreground hidden text-xs sm:block">
                Manage your gym, {user?.name?.split(" ")[0] ?? "admin"} 🏋️
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="warning" className="hidden sm:inline-flex">
              <BellRing className="h-3 w-3" />
              Admin
            </Badge>
            <Link
              href="/admin/tickets"
              className="border-border bg-surface text-muted-foreground hover:text-foreground relative flex h-10 w-10 items-center justify-center rounded-full border transition-all"
              aria-label="Support tickets"
            >
              <MessageSquare className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="border-border bg-surface text-muted-foreground hover:text-foreground flex h-10 w-10 items-center justify-center rounded-full border transition-all"
              aria-label="View user dashboard"
            >
              <LayoutDashboard className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <main className="relative flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>

        <footer className="border-border border-t px-6 py-4">
          <p className="text-muted-foreground text-center text-xs">Titan Fitness · Admin Console</p>
        </footer>
      </div>
    </div>
  );
}
