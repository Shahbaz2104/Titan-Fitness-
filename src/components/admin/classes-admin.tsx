"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CalendarDays, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { QUERY_KEYS } from "@/lib/constants";
import { useApiQuery } from "@/lib/api-client";

interface AdminClass {
  id: string;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  capacity: number;
  location: string | null;
  isActive: boolean;
  branch: { name: string; city: string };
  trainer: { user: { name: string; image: string | null } } | null;
  program: { name: string } | null;
  _count: { bookings: number };
}

function formatTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ClassesAdmin() {
  const { data: classes, isLoading, isError } = useApiQuery<AdminClass[]>(QUERY_KEYS.adminClasses, "/api/admin/classes");

  const [now] = React.useState(() => Date.now());
  const upcoming = (classes ?? []).filter((c) => new Date(c.startTime).getTime() > now);
  const past = (classes ?? []).filter((c) => new Date(c.startTime).getTime() <= now);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Classes"
        description={`${classes?.length ?? "…"} classes in the schedule`}
        icon={<CalendarDays className="h-5 w-5" />}
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : isError || !classes ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <AlertTriangle className="h-8 w-8 text-warning" />
            <p className="text-sm text-muted-foreground">Could not load classes.</p>
          </CardContent>
        </Card>
      ) : classes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <CalendarDays className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No classes scheduled yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {[
            { label: "Upcoming classes", list: upcoming },
            { label: "Past classes", list: past },
          ].map(({ label, list }) =>
            list.length === 0 ? null : (
              <div key={label}>
                <h3 className="mb-3 font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {label}
                </h3>
                <div className="space-y-3">
                  {list.map((cls, i) => {
                    const fill = cls.capacity > 0 ? Math.round((cls._count.bookings / cls.capacity) * 100) : 0;
                    return (
                      <motion.div
                        key={cls.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex flex-col gap-3 rounded-2xl border border-border bg-surface/60 p-4 transition-all hover:border-primary/30 sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-foreground">{cls.title}</p>
                            <Badge variant="outline">{cls.type}</Badge>
                            {cls.program && <Badge variant="outline">{cls.program.name}</Badge>}
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{formatTime(cls.startTime)}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground sm:shrink-0">
                          {cls.trainer && (
                            <span className="flex items-center gap-1.5">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                                {cls.trainer.user.name.slice(0, 2).toUpperCase()}
                              </span>
                              {cls.trainer.user.name}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {cls.branch.name}, {cls.branch.city}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            {cls._count.bookings}/{cls.capacity}
                          </span>
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-border">
                            <div
                              className={`h-full rounded-full ${fill >= 90 ? "bg-destructive" : fill >= 60 ? "bg-warning" : "bg-success"}`}
                              style={{ width: `${fill}%` }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
