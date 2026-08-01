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
  const {
    data: classes,
    isLoading,
    isError,
  } = useApiQuery<AdminClass[]>(QUERY_KEYS.adminClasses, "/api/admin/classes");

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
            <AlertTriangle className="text-warning h-8 w-8" />
            <p className="text-muted-foreground text-sm">Could not load classes.</p>
          </CardContent>
        </Card>
      ) : classes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <CalendarDays className="text-muted-foreground h-8 w-8" />
            <p className="text-muted-foreground text-sm">No classes scheduled yet.</p>
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
                <h3 className="font-display text-muted-foreground mb-3 text-xs font-bold tracking-widest uppercase">
                  {label}
                </h3>
                <div className="space-y-3">
                  {list.map((cls, i) => {
                    const fill =
                      cls.capacity > 0 ? Math.round((cls._count.bookings / cls.capacity) * 100) : 0;
                    return (
                      <motion.div
                        key={cls.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-border bg-surface/60 hover:border-primary/30 flex flex-col gap-3 rounded-2xl border p-4 transition-all sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-foreground font-semibold">{cls.title}</p>
                            <Badge variant="outline">{cls.type}</Badge>
                            {cls.program && <Badge variant="outline">{cls.program.name}</Badge>}
                          </div>
                          <p className="text-muted-foreground mt-1 text-xs">
                            {formatTime(cls.startTime)}
                          </p>
                        </div>

                        <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-xs sm:shrink-0">
                          {cls.trainer && (
                            <span className="flex items-center gap-1.5">
                              <span className="bg-primary/15 text-primary flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold">
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
                          <div className="bg-border h-2 w-24 overflow-hidden rounded-full">
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
