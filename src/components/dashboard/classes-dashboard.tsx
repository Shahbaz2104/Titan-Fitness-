"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Dumbbell,
  MapPin,
  Users,
  X,
} from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiPost, useApiQuery } from "@/lib/api-client";
import { CLASS_TYPES, QUERY_KEYS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface GymClass {
  id: string;
  name: string;
  description: string | null;
  type: string;
  startTime: string;
  endTime: string;
  capacity: number;
  difficulty: string | null;
  isActive: boolean;
  spotsLeft: number;
  branch: { id: string; name: string; city: string };
  trainer: { user: { id: string; name: string; image: string | null } } | null;
  _count?: { bookings: number };
}

interface Booking {
  id: string;
  classId: string;
  status: string;
  createdAt: string;
  class: {
    id: string;
    name: string;
    type: string;
    startTime: string;
    endTime: string;
    branch: { id: string; name: string; city: string };
    trainer: { user: { name: string; image: string | null } } | null;
  };
}

interface ClassListResponse {
  classes: GymClass[];
  total: number;
  page: number;
  pages: number;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function ClassesDashboard() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = React.useState(() => new Date().toISOString().slice(0, 10));
  const [activeType, setActiveType] = React.useState("ALL");
  const [busyClassId, setBusyClassId] = React.useState<string | null>(null);

  const { data, isLoading } = useApiQuery<ClassListResponse>(
    [...QUERY_KEYS.classes, selectedDate, activeType],
    "/api/classes",
    { date: selectedDate, type: activeType, limit: 30 }
  );
  const { data: bookingsData } = useApiQuery<{ upcoming: Booking[]; past: Booking[] }>(
    QUERY_KEYS.bookings,
    "/api/me/bookings"
  );

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.classes });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookings });
  };

  const book = async (classId: string) => {
    setBusyClassId(classId);
    try {
      await apiPost(`/api/classes/${classId}/book`);
    } catch {
      // toast handled by parent; keep simple
    } finally {
      setBusyClassId(null);
      refresh();
    }
  };

  const waitlist = async (classId: string) => {
    setBusyClassId(classId);
    try {
      await apiPost(`/api/classes/${classId}/waitlist`);
    } finally {
      setBusyClassId(null);
      refresh();
    }
  };

  const cancelBooking = async (bookingId: string) => {
    await apiPost(`/api/bookings/${bookingId}/cancel`);
    refresh();
  };

  const days = React.useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d.toISOString().slice(0, 10);
    });
  }, []);

  const upcoming = bookingsData?.upcoming ?? [];
  const bookedClassIds = new Set(upcoming.map((b) => b.classId));

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Classes"
        description="Book group classes and manage your schedule"
        icon={<CalendarDays className="h-5 w-5" />}
      />

      {/* My upcoming bookings */}
      {upcoming.length > 0 && (
        <Card className="p-5">
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
            Upcoming bookings
          </h3>
          <div className="mt-4 space-y-3">
            {upcoming.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-primary">
                    <Dumbbell className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{booking.class.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(booking.class.startTime).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      ·{" "}
                      {new Date(booking.class.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      · {booking.class.branch.name}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cancelBooking(booking.id)}
                  aria-label="Cancel booking"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Date strip */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((day) => {
          const date = new Date(day + "T12:00:00");
          const isToday = day === new Date().toISOString().slice(0, 10);
          return (
            <button
              key={day}
              onClick={() => setSelectedDate(day)}
              className={cn(
                "flex min-w-16 flex-col items-center rounded-2xl border px-3 py-2.5 transition-all duration-300",
                selectedDate === day
                  ? "border-primary/40 bg-primary text-primary-foreground shadow-card"
                  : "border-border bg-surface hover:border-primary/30"
              )}
            >
              <span className={cn("text-[10px] uppercase tracking-widest", selectedDate === day ? "text-primary-foreground/70" : "text-muted-foreground")}>
                {isToday ? "Today" : DAY_LABELS[date.getDay()]}
              </span>
              <span className="font-display text-lg font-bold">{date.getDate()}</span>
              <span className={cn("text-[10px] uppercase", selectedDate === day ? "text-primary-foreground/70" : "text-muted-foreground")}>
                {date.toLocaleDateString(undefined, { month: "short" })}
              </span>
            </button>
          );
        })}
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-2">
        <Badge
          className={cn("cursor-pointer", activeType === "ALL" && "bg-primary/25 border-primary/40")}
          variant="outline"
          onClick={() => setActiveType("ALL")}
        >
          All
        </Badge>
        {CLASS_TYPES.map((type) => (
          <Badge
            key={type}
            className={cn("cursor-pointer", activeType === type && "bg-primary/25 border-primary/40")}
            variant="outline"
            onClick={() => setActiveType(type)}
          >
            {type.charAt(0) + type.slice(1).toLowerCase()}
          </Badge>
        ))}
      </div>

      {/* Class list */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
      ) : !data || data.classes.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 p-14 text-center">
          <CalendarDays className="h-10 w-10 text-muted-foreground" />
          <p className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
            No classes
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            There are no {activeType !== "ALL" ? `${activeType.toLowerCase()} ` : ""}classes on this
            day. Try another date.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.classes.map((cls, i) => {
            const isBooked = bookedClassIds.has(cls.id);
            const isFull = cls.spotsLeft === 0;
            return (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.6) }}
                className={cn(
                  "rounded-2xl border p-5 transition-all duration-300",
                  isBooked ? "border-primary/30 bg-primary/5" : "border-border bg-surface hover:border-primary/30"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-base font-bold uppercase tracking-wide text-foreground">
                        {cls.name}
                      </h3>
                      <Badge variant="secondary">{cls.type}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {cls.difficulty ? `${cls.difficulty} level` : "All levels"} ·{" "}
                      {cls.trainer?.user.name ?? "Instructor TBD"}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      isFull
                        ? "bg-destructive/15 text-destructive"
                        : cls.spotsLeft <= 5
                          ? "bg-warning/15 text-warning"
                          : "bg-success/15 text-success"
                    )}
                  >
                    {isFull ? "Full" : `${cls.spotsLeft} left`}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(cls.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    –{" "}
                    {new Date(cls.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {cls.branch.name}, {cls.branch.city}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {cls.capacity - cls.spotsLeft}/{cls.capacity} booked
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Dumbbell className="h-3.5 w-3.5" />
                    {cls._count?.bookings ?? 0} attendees
                  </span>
                </div>

                <div className="mt-4">
                  {isBooked ? (
                    <Button className="w-full" disabled>
                      Booked ✓
                    </Button>
                  ) : isFull ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => waitlist(cls.id)}
                      disabled={busyClassId === cls.id}
                    >
                      Join waitlist
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={() => book(cls.id)} disabled={busyClassId === cls.id}>
                      {busyClassId === cls.id ? "Booking…" : "Book class"}
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
