"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Dumbbell,
  Medal,
  CreditCard,
  CalendarDays,
  Sparkles,
  Info,
} from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiPost, useApiQuery } from "@/lib/api-client";
import { QUERY_KEYS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: string;
  readAt: string | null;
  createdAt: string;
  data?: Record<string, unknown> | null;
}

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ACHIEVEMENT: Medal,
  WORKOUT: Dumbbell,
  MEMBERSHIP: CreditCard,
  CLASS: CalendarDays,
  CHALLENGE: Sparkles,
  SYSTEM: Bell,
};

const TYPE_COLORS: Record<string, string> = {
  ACHIEVEMENT: "text-warning",
  WORKOUT: "text-primary",
  MEMBERSHIP: "text-success",
  CLASS: "text-accent",
  CHALLENGE: "text-accent",
  SYSTEM: "text-muted-foreground",
};

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function NotificationsDashboard() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useApiQuery<{
    notifications: NotificationItem[];
    unreadCount: number;
  }>(QUERY_KEYS.notifications, "/api/me/notifications", { limit: 100 });

  const refresh = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications });

  const markRead = async (id: string) => {
    await apiPost(`/api/me/notifications/${id}/read`);
    refresh();
  };

  const markAllRead = async () => {
    await apiPost("/api/me/notifications/read-all");
    refresh();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Notifications"
        description={`${unreadCount} unread · ${notifications.length} total`}
        icon={<Bell className="h-5 w-5" />}
        actions={
          unreadCount > 0 ? (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 p-14 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-surface text-muted-foreground">
            <Bell className="h-8 w-8" />
          </span>
          <p className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
            All caught up
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            You have no notifications. Completing workouts, earning badges, and booking classes
            will show up here.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification, i) => {
            const Icon = TYPE_ICONS[notification.type] ?? Info;
            return (
              <motion.button
                key={notification.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.5) }}
                onClick={() => !notification.readAt && markRead(notification.id)}
                className={cn(
                  "flex w-full items-start gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-300",
                  notification.readAt
                    ? "border-border bg-surface/50"
                    : "border-primary/25 bg-primary/5 hover:border-primary/50"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface",
                    TYPE_COLORS[notification.type] ?? "text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">{notification.title}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {timeAgo(notification.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{notification.body}</p>
                </div>
                {!notification.readAt && (
                  <Badge className="mt-1 shrink-0" variant="default">
                    New
                  </Badge>
                )}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
