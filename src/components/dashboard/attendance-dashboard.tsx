"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CalendarCheck2, CalendarDays, Flame, LogIn, LogOut, MapPin, Timer } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiPost, useApiQuery } from "@/lib/api-client";
import { QUERY_KEYS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AttendanceStats {
  total: number;
  thisMonth: number;
  currentStreak: number;
  weekRecords: { id: string; checkInTime: string; checkOutTime: string | null; status: string }[];
}

interface TodayCheck {
  checkedIn: boolean;
  checkedOut: boolean;
  record: { id: string; checkInTime: string; checkOutTime: string | null } | null;
}

interface AttendanceRecord {
  id: string;
  checkInTime: string;
  checkOutTime: string | null;
  status: string;
  method: string;
  branch: { id: string; name: string; city: string };
}

interface Profile {
  id: string;
  branchId: string | null;
  branch?: { id: string; name: string } | null;
}

export function AttendanceDashboard() {
  const queryClient = useQueryClient();
  const { data: stats } = useApiQuery<AttendanceStats>(
    QUERY_KEYS.attendance,
    "/api/attendance/stats"
  );
  const { data: today } = useApiQuery<TodayCheck>(
    [...QUERY_KEYS.attendance, "today"],
    "/api/attendance/today"
  );
  const { data: history, isLoading } = useApiQuery<AttendanceRecord[]>(
    [...QUERY_KEYS.attendance, "history"],
    "/api/attendance",
    { limit: 60 }
  );
  const { data: profile } = useApiQuery<Profile>(
    [...QUERY_KEYS.user, "profile"],
    "/api/me/profile"
  );

  const [checkingIn, setCheckingIn] = React.useState(false);

  const refresh = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.attendance });

  const checkIn = async () => {
    if (!profile?.branchId) return;
    setCheckingIn(true);
    try {
      await apiPost("/api/attendance/check-in", { branchId: profile.branchId, method: "MANUAL" });
    } finally {
      setCheckingIn(false);
      refresh();
    }
  };

  const weekDays = React.useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });
  }, []);

  const recordByDay = new Map(
    (stats?.weekRecords ?? []).map((r) => {
      const key = new Date(r.checkInTime).toDateString();
      return [key, r];
    })
  );

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Attendance"
        description="Your check-ins, streaks, and weekly activity"
        icon={<CalendarCheck2 className="h-5 w-5" />}
        actions={
          <Button
            size="sm"
            onClick={checkIn}
            disabled={checkingIn || today?.checkedIn}
            variant={today?.checkedIn ? "outline" : "default"}
          >
            {today?.checkedOut ? (
              <>
                <LogOut className="h-4 w-4" /> Checked out
              </>
            ) : today?.checkedIn ? (
              <>
                <LogOut className="h-4 w-4" /> Check out
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" /> {checkingIn ? "Checking in…" : "Check in"}
              </>
            )}
          </Button>
        }
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs tracking-widest uppercase">
                Total visits
              </p>
              <CalendarDays className="text-primary h-4 w-4" />
            </div>
            <p className="font-display text-foreground mt-2 text-3xl font-bold">
              {stats?.total ?? "–"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs tracking-widest uppercase">This month</p>
              <Timer className="text-accent h-4 w-4" />
            </div>
            <p className="font-display text-foreground mt-2 text-3xl font-bold">
              {stats?.thisMonth ?? "–"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs tracking-widest uppercase">Day streak</p>
              <Flame className="text-warning h-4 w-4" />
            </div>
            <p className="font-display text-foreground mt-2 text-3xl font-bold">
              {stats?.currentStreak ?? "–"}
              <span className="text-muted-foreground text-sm font-normal"> days</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly strip */}
      <Card>
        <CardContent className="p-5">
          <h3 className="font-display text-foreground text-sm font-bold tracking-widest uppercase">
            Last 7 days
          </h3>
          <div className="mt-4 flex justify-between gap-2">
            {weekDays.map((day) => {
              const record = recordByDay.get(day.toDateString());
              const isFuture = day.getDate() > new Date().getDate();
              return (
                <div key={day.toISOString()} className="flex flex-col items-center gap-2">
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold",
                      record
                        ? "bg-success/20 text-success"
                        : isFuture
                          ? "bg-surface-2 text-muted-foreground/40"
                          : "bg-surface-2 text-muted-foreground"
                    )}
                  >
                    {record ? "✓" : day.getDate()}
                  </span>
                  <span className="text-muted-foreground text-[10px] tracking-wider uppercase">
                    {day.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 2)}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardContent className="p-5">
          <h3 className="font-display text-foreground text-sm font-bold tracking-widest uppercase">
            Check-in history
          </h3>
          {isLoading ? (
            <div className="mt-4 space-y-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : !history || history.length === 0 ? (
            <p className="border-border text-muted-foreground mt-4 rounded-2xl border border-dashed py-10 text-center text-sm">
              No check-ins yet. Check in at the gym to start tracking.
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {history.map((record, i) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.5) }}
                  className="border-border bg-surface flex items-center justify-between rounded-xl border px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-xl",
                        record.status === "LATE"
                          ? "bg-warning/15 text-warning"
                          : "bg-success/15 text-success"
                      )}
                    >
                      <CalendarCheck2 className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-foreground text-sm font-medium">
                        {new Date(record.checkInTime).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {record.branch.name} ·{" "}
                        {new Date(record.checkInTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {record.checkOutTime
                          ? ` – ${new Date(record.checkOutTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={record.status === "LATE" ? "warning" : "success"}
                      className="hidden sm:inline-flex"
                    >
                      {record.status}
                    </Badge>
                    <MapPin className="text-muted-foreground h-4 w-4" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
