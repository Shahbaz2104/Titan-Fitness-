"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  Clock,
  Dumbbell,
  Flame,
  Play,
  Trophy,
} from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { apiPost, useApiQuery } from "@/lib/api-client";
import { QUERY_KEYS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface TodayWorkout {
  sessions: {
    id: string;
    isCompleted: boolean;
    durationMinutes: number | null;
    caloriesBurned: number | null;
    logs: { id: string; exercise: { name: string }; setsCompleted: number; reps: string | null; weightKg: number | null }[];
  }[];
  plan: {
    id: string;
    name: string;
    days: {
      id: string;
      dayNumber: number;
      title: string;
      exercises: { id: string; exercise: { id: string; name: string; muscleGroup: string }; sets: number; reps: string; weightKg: number | null }[];
    }[];
  } | null;
  completed: boolean;
}

interface WorkoutStats {
  totalWorkouts: number;
  monthWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  avgDuration: number;
}

interface SessionRecord {
  id: string;
  title: string;
  date: string;
  isCompleted: boolean;
  durationMinutes: number | null;
  caloriesBurned: number | null;
  logs: { id: string; exercise: { name: string } }[];
  plan: { id: string; name: string } | null;
}

interface PersonalRecord {
  id: string;
  weightKg: number | null;
  reps: number;
  sets: number;
  exercise: { id: string; name: string; muscleGroup: string };
}

interface ActiveLog {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: string;
  weightKg: string;
  done: boolean;
}

export function WorkoutTracker() {
  const queryClient = useQueryClient();
  const { data: today } = useApiQuery<TodayWorkout>([...QUERY_KEYS.workouts, "today"], "/api/workouts/today");
  const { data: stats } = useApiQuery<WorkoutStats>(QUERY_KEYS.dashboard, "/api/workouts/stats");
  const { data: history } = useApiQuery<SessionRecord[]>([...QUERY_KEYS.workouts, "history"], "/api/workouts/sessions", {
    limit: 30,
  });
  const { data: prs } = useApiQuery<PersonalRecord[]>(QUERY_KEYS.workouts, "/api/workouts/prs");

  const [logs, setLogs] = React.useState<ActiveLog[]>([]);
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [starting, setStarting] = React.useState(false);
  const [completing, setCompleting] = React.useState(false);
  const [duration, setDuration] = React.useState("45");
  const [calories, setCalories] = React.useState("350");

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workouts });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
  };

  const activeSession = today?.sessions.find((s) => !s.isCompleted) ?? null;
  const dayOne = today?.plan?.days?.[0];
  const planExercises = dayOne?.exercises ?? [];

  const startSession = async () => {
    setStarting(true);
    try {
      const session = await apiPost<{ id: string }>("/api/workouts/sessions", {
        title: today?.plan?.name ?? "Quick Session",
        planId: today?.plan?.id ?? null,
        workoutDayId: dayOne?.id ?? null,
      });
      setSessionId(session.id);
      setLogs(
        planExercises.map((ex) => ({
          exerciseId: ex.exercise.id,
          exerciseName: ex.exercise.name,
          sets: ex.sets,
          reps: ex.reps,
          weightKg: ex.weightKg ? String(ex.weightKg) : "",
          done: false,
        }))
      );
      refresh();
    } finally {
      setStarting(false);
    }
  };

  const toggleLog = (index: number) => {
    setLogs((prev) => prev.map((log, i) => (i === index ? { ...log, done: !log.done } : log)));
  };

  const updateLog = (index: number, field: "weightKg" | "reps", value: string) => {
    setLogs((prev) => prev.map((log, i) => (i === index ? { ...log, [field]: value } : log)));
  };

  const completeWorkout = async () => {
    const targetSession = activeSession?.id ?? sessionId;
    if (!targetSession) return;
    setCompleting(true);
    try {
      await apiPost(`/api/workouts/sessions/${targetSession}/complete`, {
        durationMinutes: Number(duration) || 30,
        caloriesBurned: Number(calories) || 0,
        logs: logs.map((log) => ({
          exerciseId: log.exerciseId,
          setsCompleted: log.done ? log.sets : 0,
          reps: log.reps,
          weightKg: log.weightKg ? Number(log.weightKg) : null,
        })),
      });
      refresh();
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Workouts"
        description="Sessions, plans, and personal records"
        icon={<Dumbbell className="h-5 w-5" />}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Total workouts</p>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">
              {stats?.totalWorkouts ?? "–"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Minutes trained</p>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">
              {stats?.totalMinutes ?? "–"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Calories burned</p>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">
              {(stats?.totalCalories ?? 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Avg session</p>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">
              {stats?.avgDuration ?? "–"}
              <span className="text-sm font-normal text-muted-foreground"> min</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active session */}
      <Card className="border-primary/25 bg-gradient-to-br from-primary/10 via-surface to-surface">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">
            {activeSession || sessionId ? "Active Session" : "Today's Plan"}
          </CardTitle>
          {today?.completed && <Badge variant="success">Completed ✓</Badge>}
        </CardHeader>
        <CardContent className="space-y-4">
          {today === undefined ? (
            <Skeleton className="h-40 w-full" />
          ) : today?.completed ? (
            <p className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              You crushed today&apos;s session. Rest up and come back stronger tomorrow! 💪
            </p>
          ) : !activeSession && !sessionId && planExercises.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <p className="max-w-sm text-sm text-muted-foreground">
                No active plan. Generate a personalized one with the AI Workout Generator.
              </p>
              <Button asChild variant="outline" size="sm">
                <a href="/dashboard/ai/workout-generator">
                  <Flame className="h-4 w-4" /> Generate plan
                </a>
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {today?.plan?.name ?? "Quick Session"}
                {dayOne ? ` · ${dayOne.title}` : ""} — {planExercises.length} exercises
              </p>
              <div className="space-y-2.5">
                {(logs.length > 0 ? logs : planExercises.map((ex) => ({
                  exerciseId: ex.exercise.id,
                  exerciseName: ex.exercise.name,
                  sets: ex.sets,
                  reps: ex.reps,
                  weightKg: ex.weightKg ? String(ex.weightKg) : "",
                  done: false,
                }))).map((log, i) => (
                  <motion.div
                    key={`${log.exerciseName}-${i}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={cn(
                      "flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-all duration-300",
                      log.done ? "border-success/30 bg-success/5" : "border-border bg-surface"
                    )}
                  >
                    <button
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                      onClick={() => toggleLog(i)}
                    >
                      <CheckCircle2
                        className={cn("h-4 w-4 shrink-0", log.done ? "text-success" : "text-muted-foreground")}
                      />
                      <span className={cn("text-sm", log.done ? "text-muted-foreground line-through" : "text-foreground")}>
                        {log.exerciseName}
                      </span>
                    </button>
                    <div className="flex items-center gap-2">
                      {activeSession || sessionId ? (
                        <>
                          <Input
                            type="number"
                            value={log.weightKg}
                            onChange={(e) => updateLog(i, "weightKg", e.target.value)}
                            placeholder="kg"
                            className="w-16 text-xs"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="text-xs text-muted-foreground">{log.sets}×{log.reps}</span>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">{log.sets}×{log.reps}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
                {activeSession || sessionId ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-20 text-xs"
                        aria-label="Duration minutes"
                      />
                      <span className="text-xs text-muted-foreground">min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-warning" />
                      <Input
                        type="number"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                        className="w-20 text-xs"
                        aria-label="Calories burned"
                      />
                      <span className="text-xs text-muted-foreground">kcal</span>
                    </div>
                    <Button className="ml-auto" size="sm" onClick={completeWorkout} disabled={completing}>
                      <CheckCircle2 className="h-4 w-4" />
                      {completing ? "Completing…" : "Complete workout"}
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={startSession} disabled={starting}>
                    <Play className="h-4 w-4" />
                    {starting ? "Starting…" : "Start session"}
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {history === undefined ? (
              <>
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </>
            ) : history.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
                No sessions yet. Start your first workout above!
              </p>
            ) : (
              history.slice(0, 8).map((session, i) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.5) }}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Activity className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{session.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                        {session.plan ? ` · ${session.plan.name}` : ""} · {session.logs.length} exercises
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-foreground">
                      {session.durationMinutes ?? "—"} min
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.caloriesBurned ? `${session.caloriesBurned} kcal` : "—"}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>

        {/* PRs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal Records</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {prs === undefined ? (
              <Skeleton className="h-24 w-full" />
            ) : prs.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
                No PRs yet. Log a heavy set to set your first record!
              </p>
            ) : (
              prs.slice(0, 6).map((pr, i) => (
                <motion.div
                  key={pr.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.5) }}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/15 text-warning">
                      <Trophy className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{pr.exercise.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {pr.exercise.muscleGroup} · {pr.sets}×{pr.reps}
                      </p>
                    </div>
                  </div>
                  <span className="font-display text-lg font-bold text-primary">
                    {pr.weightKg ?? 0} kg
                  </span>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
