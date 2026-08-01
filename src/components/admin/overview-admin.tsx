"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  CalendarClock,
  CreditCard,
  DollarSign,
  Package,
  Ticket,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { QUERY_KEYS } from "@/lib/constants";
import { useApiQuery } from "@/lib/api-client";

interface AdminStats {
  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
  totalTrainers: number;
  totalRevenue: number;
  monthRevenue: number;
  todayAttendance: number;
  activePlans: number;
  pendingTickets: number;
  expiringMemberships: number;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function OverviewAdmin() {
  const { data: stats, isLoading, isError } = useApiQuery<AdminStats>(QUERY_KEYS.adminDashboard, "/api/admin/stats");

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Overview"
        description="Gym performance at a glance"
        icon={<TrendingUp className="h-5 w-5" />}
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/reports">
              View reports
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : isError || !stats ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <AlertTriangle className="h-8 w-8 text-warning" />
            <p className="text-sm text-muted-foreground">Could not load dashboard stats.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total members" value={String(stats.totalMembers)} icon={Users} href="/admin/members" />
          <StatCard label="Active memberships" value={String(stats.activeMembers)} icon={CreditCard} href="/admin/members" />
          <StatCard label="New this month" value={`+${stats.newMembersThisMonth}`} icon={UserPlus} />
          <StatCard label="Trainers" value={String(stats.totalTrainers)} icon={Users} />
          <StatCard label="Total revenue" value={formatMoney(stats.totalRevenue)} icon={Banknote} href="/admin/reports" />
          <StatCard label="Revenue this month" value={formatMoney(stats.monthRevenue)} icon={DollarSign} href="/admin/reports" />
          <StatCard label="Check-ins this month" value={String(stats.todayAttendance)} icon={CalendarClock} href="/admin/classes" />
          <StatCard label="Active plans" value={String(stats.activePlans)} icon={Package} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
                Needs attention
              </h3>
              {!isLoading && !isError && stats && stats.expiringMemberships > 0 && (
                <Badge variant="warning">{stats.expiringMemberships} expiring</Badge>
              )}
            </div>
            {isLoading ? (
              <Skeleton className="h-24 rounded-xl" />
            ) : isError || !stats ? null : (
              <div className="space-y-3">
                <Link
                  href="/admin/members"
                  className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 transition-colors hover:border-warning/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/15 text-warning">
                      <AlertTriangle className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {stats.expiringMemberships} membership{stats.expiringMemberships === 1 ? "" : "s"} expiring within 7 days
                      </p>
                      <p className="text-xs text-muted-foreground">Renewals needed soon</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link
                  href="/admin/tickets"
                  className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Ticket className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {stats.pendingTickets} open support ticket{stats.pendingTickets === 1 ? "" : "s"}
                      </p>
                      <p className="text-xs text-muted-foreground">Awaiting response</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-6">
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
              Quick actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: "/admin/programs", label: "New program" },
                { href: "/admin/coupons", label: "Create coupon" },
                { href: "/admin/blog", label: "Write a post" },
                { href: "/admin/challenges", label: "Start challenge" },
              ].map((action, i) => (
                <motion.div
                  key={action.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Button asChild variant="outline" className="w-full justify-between">
                    <Link href={action.href}>
                      {action.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
