"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Droplets,
  Dumbbell,
  Flame,
  Sparkles,
  Zap,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiPost, useApiQuery } from "@/lib/api-client";
import { QUERY_KEYS, WATER_DAILY_GOAL_ML } from "@/lib/constants";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";

interface WorkoutStats {
  totalWorkouts: number;
  monthWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  avgDuration: number;
}

interface TodayWorkout {
  sessions: {
    id: string;
    isCompleted: boolean;
    durationMinutes: number | null;
    logs: { id: string; exercise: { name: string }; sets: number; reps: string | null }[];
  }[];
  plan: {
    id: string;
    name: string;
    days: { exercises: { id: string; exercise: { name: string }; sets: number; reps: string }[] }[];
  } | null;
  completed: boolean;
}

interface TodayCheck {
  checkedIn: boolean;
  checkedOut: boolean;
}

interface AttendanceStats {
  total: number;
  thisMonth: number;
  currentStreak: number;
}

interface PointsInfo {
  rank: number;
  points: number;
}

interface Booking {
  id: string;
  class: {
    id: string;
    name: string;
    type: string;
    startTime: string;
    branch: { name: string; city: string };
  };
}

interface Membership {
  id: string;
  status: string;
  daysLeft: number | null;
  plan: { name: string };
}

interface NutritionLogs {
  water: number;
}

const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function OverviewDashboard() {
  const { data: user } = useUser();
  const { data: stats } = useApiQuery<WorkoutStats>([...QUERY_KEYS.dashboard, "stats"], "/api/workouts/stats");
  const { data: todayWorkout } = useApiQuery<TodayWorkout | null>([...QUERY_KEYS.dashboard, "today"], "/api/workouts/today");
  const { data: attendance } = useApiQuery<TodayCheck>([...QUERY_KEYS.attendance, "today"], "/api/attendance/today");
  const { data: attendanceStats } = useApiQuery<AttendanceStats>(QUERY_KEYS.attendance, "/api/attendance/stats");
  const { data: points } = useApiQuery<PointsInfo>([...QUERY_KEYS.user, "points"], "/api/me/points");  const { data: bookings } = useApiQuery<{ upcoming: Booking[]; past: Booking[] }>(QUERY_KEYS.bookings, "/api/me/bookings");
  const { data: membership } = useApiQuery<Membership | null>(QUERY_KEYS.membership, "/api/payments/membership");
  const { data: nutrition } = useApiQuery<NutritionLogs>(QUERY_KEYS.nutrition, "/api/nutrition/logs");

  const waterPct = Math.min(100, Math.round(((nutrition?.water ?? 0) / WATER_DAILY_GOAL_ML) * 100));

  const todaySession = todayWorkout?.sessions?.[0] ?? null;
  const todayExercises =
    todaySession?.logs?.map((l) => ({ id: l.id, name: l.exercise.name, sets: l.sets, reps: l.reps ?? "—" })) ??
    todayWorkout?.plan?.days?.[0]?.exercises?.map((e) => ({
      id: e.id,
      name: e.exercise.name,
      sets: e.sets,
      reps: e.reps,
    })) ??
    [];
  const isCompleted = todayWorkout?.completed ?? false;
  const todayTitle = todaySession
    ? todayWorkout?.plan?.name ?? "Today's Session"
    : todayWorkout?.plan?.name ?? null;

  return (
    <div className="space-y-6">
      {/* Hero row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/15 via-surface to-accent/10 p-8"
      >
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <Badge variant="accent" className="mb-3">
              <Sparkles className="h-3 w-3" />
              {todaySession
                ? isCompleted
                  ? "Session Completed Today"
                  : "Today's Plan Ready"
                : todayWorkout
                  ? "Plan Available"
                  : "No Session Today"}
            </Badge>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
              {todayTitle
                ? isCompleted
                  ? "Great work! 💪"
                  : todayTitle
                : `Welcome back, ${user?.name?.split(" ")[0] ?? "Athlete"} 👋`}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {todaySession
                ? `${todaySession.durationMinutes ?? "—"} min session · ${todayExercises.length} exercises`
                : todayTitle
                  ? `${todayExercises.length} exercises scheduled`
                  : "No workout scheduled for today — plan one or hit the gym!"}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="sm">
                <Link href="/dashboard/workouts">
                  <Dumbbell className="h-4 w-4" />
                  {todaySession ? "Open Workout" : "Browse Workouts"}
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/ai/chat">
                  Ask AI Coach
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex gap-8">
            <ProgressRing
              value={points ? Math.min(100, points.points) : 0}
              size={104}
              color="#E63946"
              label="Total Points"
              displayValue={points ? String(points.points) : "–"}
            />
            <ProgressRing
              value={attendance?.checkedIn ? 100 : 0}
              size={104}
              color="#00C853"
              label="Checked In"
              suffix="%"
            />
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Calories Burned"
          value={(stats?.totalCalories ?? 0).toLocaleString()}
          icon={Flame}
          href="/dashboard/workouts"
          delay={0.05}
        />
        <StatCard
          label="Total Workouts"
          value={String(stats?.totalWorkouts ?? "–")}
          icon={Dumbbell}
          deltaLabel={`+${stats?.monthWorkouts ?? 0} this month`}
          href="/dashboard/progress"
          delay={0.1}
        />
        <StatCard
          label="Check-ins"
          value={String(attendanceStats?.total ?? "–")}
          icon={Activity}
          deltaLabel={`${attendanceStats?.currentStreak ?? 0}-day streak`}
          href="/dashboard/attendance"
          delay={0.15}
        />
        <StatCard
          label="My Rank"
          value={points ? `#${points.rank}` : "–"}
          icon={Zap}
          deltaLabel={`${points?.points ?? 0} points`}
          href="/dashboard/leaderboard"
          delay={0.2}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's workout */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Today&apos;s Workout</CardTitle>
            <Link href="/dashboard/workouts" className="text-xs text-primary hover:text-accent">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayWorkout === undefined ? (
              <>
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </>
            ) : todayExercises.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
                Nothing scheduled today. Rest is productive too — or browse a workout to get after it.
              </p>
            ) : (
              <>
                {todayExercises.slice(0, 4).map((exercise, i) => (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-4 py-3",
                      isCompleted
                        ? "border-success/30 bg-success/5"
                        : "border-border bg-surface hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2
                        className={cn(
                          "h-4 w-4",
                          isCompleted ? "text-success" : "text-muted-foreground"
                        )}
                      />
                      <span className="text-sm text-foreground">{exercise.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {exercise.sets}×{exercise.reps}
                    </span>
                  </motion.div>
                ))}
                <Button asChild className="w-full" size="sm">
                  <Link href="/dashboard/workouts">
                    <Dumbbell className="h-4 w-4" />
                    {isCompleted ? "View Session" : "Start Session"}
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Upcoming classes */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Upcoming Classes</CardTitle>
            <Link href="/dashboard/classes" className="text-xs text-primary hover:text-accent">
              Book now
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {bookings === undefined ? (
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : !bookings || bookings.upcoming.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
                No upcoming classes. Check the schedule and book your spot!
              </p>
            ) : (
              <>
                {bookings.upcoming.slice(0, 3).map((booking, i) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 transition-all duration-300 hover:border-primary/30"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <CalendarDays className="h-4 w-4" />
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
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{booking.class.type}</Badge>
                  </motion.div>
                ))}
                <Button asChild variant="outline" className="w-full" size="sm">
                  <Link href="/dashboard/classes">
                    <CalendarDays className="h-4 w-4" />
                    Browse Classes
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-6">
          {/* Weekly streak */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {WEEK_DAYS.map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300",
                        attendance?.checkedIn && new Date().getDay() === i
                          ? "border-primary bg-primary/15 text-primary shadow-glow"
                          : "border-border bg-surface text-muted-foreground"
                      )}
                    >
                      {attendance?.checkedIn && new Date().getDay() === i ? "✓" : day}
                    </span>
                    <span className="text-[10px] uppercase text-muted-foreground">{day}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                {attendanceStats?.currentStreak ?? 0}-day check-in streak
              </p>
            </CardContent>
          </Card>

          {/* Water tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Water Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-5">
                <ProgressRing
                  value={waterPct}
                  size={72}
                  strokeWidth={6}
                  color="#3B82F6"
                  label="Goal"
                  displayValue={`${((nutrition?.water ?? 0) / 1000).toFixed(1)}L`}
                />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-display text-xl font-bold text-foreground">
                      {((nutrition?.water ?? 0) / 1000).toFixed(1)}L
                    </span>{" "}
                    / {WATER_DAILY_GOAL_ML / 1000}L
                  </p>
                  <div className="mt-2 flex gap-2">
                    <WaterButton amountMl={250} />
                    <WaterButton amountMl={500} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Membership */}
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/15">
                  <CreditCard className="h-5 w-5 text-success" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {membership?.plan.name ?? "No membership"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {membership
                      ? membership.daysLeft !== null
                        ? `${membership.daysLeft} days left`
                        : "Active"
                      : "Choose a plan"}
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/membership"
                className="flex items-center gap-1 text-xs text-primary hover:text-accent"
              >
                Manage <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function WaterButton({ amountMl }: { amountMl: number }) {
  const queryClient = useQueryClient();
  return (
    <Button
      size="sm"
      variant="outline"
      className="flex-1"
      onClick={async () => {
        await apiPost("/api/me/water", { amountMl });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.nutrition });
      }}
    >
      <Droplets className="h-3.5 w-3.5 text-blue-400" />
      +{amountMl}ml
    </Button>
  );
}
