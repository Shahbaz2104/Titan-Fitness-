"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Bell,
  BellRing,
  CheckCheck,
  Dumbbell,
  Medal,
  CreditCard,
  CalendarDays,
  Sparkles,
  Info,
  Smartphone,
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

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const base64Url = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64Url);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) output[i] = rawData.charCodeAt(i);
  return output;
}

function PushCard({
  pushState,
  pushBusy,
  pushStatus,
  onEnable,
  onDisable,
}: {
  pushState: "idle" | "denied" | "supported" | "subscribed";
  pushBusy: boolean;
  pushStatus:
    { enabled: boolean; vapidPublicKey: string | null; subscriptions: string[] } | undefined;
  onEnable: () => void;
  onDisable: () => void;
}) {
  if (!pushStatus || !pushStatus.enabled) {
    return (
      <Card className="flex items-center gap-4 border-dashed px-5 py-4">
        <span className="bg-surface text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
          <Smartphone className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-foreground text-sm font-semibold">Browser push notifications</p>
          <p className="text-muted-foreground text-xs">
            Push is not configured yet — add VAPID keys to enable alerts outside the app.
          </p>
        </div>
      </Card>
    );
  }

  if (pushState === "subscribed") {
    return (
      <Card className="border-primary/25 bg-primary/5 flex items-center gap-4 px-5 py-4">
        <span className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
          <BellRing className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-foreground text-sm font-semibold">Push notifications enabled</p>
          <p className="text-muted-foreground text-xs">
            Alerts appear here and on your device even when the app is closed.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onDisable} disabled={pushBusy}>
          Turn off
        </Button>
      </Card>
    );
  }

  return (
    <Card className="flex items-center gap-4 border-dashed px-5 py-4">
      <span className="bg-surface text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
        <Smartphone className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <p className="text-foreground text-sm font-semibold">Browser push notifications</p>
        <p className="text-muted-foreground text-xs">
          {pushState === "denied"
            ? "Permission was blocked in your browser — allow notifications in site settings to enable push."
            : "Get notified in your browser when a workout, badge, or membership update arrives."}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onEnable}
        disabled={pushBusy || pushState === "denied"}
      >
        {pushBusy ? "Setting up…" : "Enable"}
      </Button>
    </Card>
  );
}

export function NotificationsDashboard() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useApiQuery<{
    notifications: NotificationItem[];
    unreadCount: number;
  }>(QUERY_KEYS.notifications, "/api/me/notifications", { limit: 100 });

  const [localSubscribed, setLocalSubscribed] = React.useState(false);
  const [pushBusy, setPushBusy] = React.useState(false);
  const { data: pushStatus } = useApiQuery<{
    enabled: boolean;
    vapidPublicKey: string | null;
    subscriptions: string[];
  }>(["push-status"], "/api/me/push/status");

  const pushState = React.useMemo(() => {
    if (!pushStatus || !pushStatus.enabled) return "idle" as const;
    if (localSubscribed || pushStatus.subscriptions.length > 0) return "subscribed" as const;
    if (typeof Notification !== "undefined" && Notification.permission === "denied") {
      return "denied" as const;
    }
    if (typeof window !== "undefined" && "serviceWorker" in navigator) return "supported" as const;
    return "idle" as const;
  }, [pushStatus, localSubscribed]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications });

  const markRead = async (id: string) => {
    await apiPost(`/api/me/notifications/${id}/read`);
    refresh();
  };

  const markAllRead = async () => {
    await apiPost("/api/me/notifications/read-all");
    refresh();
  };

  const enablePush = async () => {
    if (!pushStatus?.vapidPublicKey || !("serviceWorker" in navigator)) return;
    try {
      setPushBusy(true);
      let permission = Notification.permission;
      if (permission !== "granted") {
        permission = await Notification.requestPermission();
      }
      if (permission !== "granted") {
        setLocalSubscribed(false);
        return;
      }
      const registration = await navigator.serviceWorker.register("/sw.js");
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(pushStatus.vapidPublicKey),
      });
      await apiPost("/api/me/push/subscribe", {
        endpoint: subscription.endpoint,
        keys: subscription.toJSON().keys ?? { p256dh: "", auth: "" },
      });
      setLocalSubscribed(true);
    } catch {
      setLocalSubscribed(false);
    } finally {
      setPushBusy(false);
    }
  };

  const disablePush = async () => {
    if (!("serviceWorker" in navigator)) return;
    try {
      setPushBusy(true);
      const registration = await navigator.serviceWorker.getRegistration("/sw.js");
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) {
        await apiPost("/api/me/push/unsubscribe", { endpoint: subscription.endpoint });
        await subscription.unsubscribe();
      }
      setLocalSubscribed(false);
    } finally {
      setPushBusy(false);
    }
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

      <PushCard
        pushState={pushState}
        pushBusy={pushBusy}
        pushStatus={pushStatus}
        onEnable={enablePush}
        onDisable={disablePush}
      />

      {notifications.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 p-14 text-center">
          <span className="bg-surface text-muted-foreground flex h-16 w-16 items-center justify-center rounded-3xl">
            <Bell className="h-8 w-8" />
          </span>
          <p className="font-display text-foreground text-lg font-bold tracking-wide uppercase">
            All caught up
          </p>
          <p className="text-muted-foreground max-w-sm text-sm">
            You have no notifications. Completing workouts, earning badges, and booking classes will
            show up here.
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
                    "bg-surface mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    TYPE_COLORS[notification.type] ?? "text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-foreground text-sm font-semibold">{notification.title}</p>
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {timeAgo(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">{notification.body}</p>
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
