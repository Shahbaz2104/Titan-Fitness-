"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Activity, CalendarCheck, Flame, LineChart, Plus, Scale, Timer, Trophy } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiPost, useApiQuery } from "@/lib/api-client";
import { QUERY_KEYS } from "@/lib/constants";

interface WorkoutStats {
  totalWorkouts: number;
  monthWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  avgDuration: number;
}

interface PersonalRecord {
  id: string;
  weightKg: number | null;
  reps: number;
  sets: number;
  exercise: { id: string; name: string; muscleGroup: string };
}

interface BodyMetric {
  id: string;
  date: string;
  weightKg: number | null;
  bodyFatPct: number | null;
  muscleMassKg: number | null;
  bmi: number | null;
  waistCm: number | null;
}

export function ProgressDashboard() {
  const queryClient = useQueryClient();
  const { data: stats } = useApiQuery<WorkoutStats>(QUERY_KEYS.dashboard, "/api/workouts/stats");
  const { data: metrics } = useApiQuery<BodyMetric[]>(QUERY_KEYS.metrics, "/api/me/body-metrics", { limit: 60 });
  const { data: prs } = useApiQuery<PersonalRecord[]>(QUERY_KEYS.workouts, "/api/workouts/prs");

  const [weight, setWeight] = React.useState("");
  const [bodyFat, setBodyFat] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const addMetric = async () => {
    setSaving(true);
    try {
      await apiPost("/api/me/body-metrics", {
        weightKg: weight ? Number(weight) : undefined,
        bodyFatPct: bodyFat ? Number(bodyFat) : undefined,
      });
      setWeight("");
      setBodyFat("");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.metrics });
    } finally {
      setSaving(false);
    }
  };

  const weightHistory = [...(metrics ?? [])].reverse().filter((m) => m.weightKg !== null);
  const firstWeight = weightHistory[0]?.weightKg ?? null;
  const lastWeight = weightHistory[weightHistory.length - 1]?.weightKg ?? null;
  const weightDelta = firstWeight !== null && lastWeight !== null ? lastWeight - firstWeight : null;

  const maxWeight = Math.max(...weightHistory.map((m) => m.weightKg ?? 0), 1);
  const minWeight = Math.min(...weightHistory.map((m) => m.weightKg ?? 0), 0);
  const weightSpan = Math.max(maxWeight - minWeight, 1);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Progress"
        description="Track your workouts, weight, and PRs"
        icon={<LineChart className="h-5 w-5" />}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Total workouts</p>
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">
              {stats?.totalWorkouts ?? "–"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">+{stats?.monthWorkouts ?? 0} this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Minutes trained</p>
              <Timer className="h-4 w-4 text-accent" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">
              {stats?.totalMinutes ?? "–"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">avg {stats?.avgDuration ?? 0} min/session</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Calories burned</p>
              <Flame className="h-4 w-4 text-warning" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">
              {(stats?.totalCalories ?? 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Personal records</p>
              <Trophy className="h-4 w-4 text-success" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">{prs?.length ?? "–"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weight chart */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
                Body weight
              </h3>
              {weightDelta !== null && (
                <span
                  className={
                    weightDelta <= 0
                      ? "rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success"
                      : "rounded-full bg-warning/15 px-3 py-1 text-xs font-semibold text-warning"
                  }
                >
                  {weightDelta > 0 ? "+" : ""}
                  {weightDelta.toFixed(1)} kg
                </span>
              )}
            </div>
            {weightHistory.length < 2 ? (
              <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-12 text-center">
                <Scale className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Log your weight twice to see your trend line.
                </p>
              </div>
            ) : (
              <div className="mt-6 flex h-40 items-end gap-2">
                {weightHistory.map((m) => (
                  <div key={m.id} className="group relative flex-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${((m.weightKg ?? 0) - minWeight + weightSpan * 0.1) / (weightSpan * 1.2) * 100}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="rounded-t-lg bg-gradient-to-t from-primary/40 to-primary"
                    />
                    <div className="mt-1 text-center text-[10px] text-muted-foreground">
                      {new Date(m.date).getDate()}/{new Date(m.date).getMonth() + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add metric */}
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-4">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Weight (kg)
                </label>
                <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="82.5" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Body fat (%)
                </label>
                <Input type="number" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} placeholder="18" />
              </div>
              <Button className="col-span-2" onClick={addMetric} disabled={saving || (!weight && !bodyFat)}>
                <Plus className="h-4 w-4" />
                {saving ? "Saving…" : "Log measurement"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History table */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
              Measurement history
            </h3>
            {!metrics || metrics.length === 0 ? (
              <p className="mt-6 rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
                No measurements yet. Log your first one to start tracking!
              </p>
            ) : (
              <div className="mt-4 divide-y divide-border">
                {metrics.slice(0, 10).map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.4) }}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-2 text-muted-foreground">
                        <CalendarCheck className="h-4 w-4" />
                      </span>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(m.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      {m.weightKg !== null && (
                        <span>
                          <b className="text-foreground">{m.weightKg} kg</b> weight
                        </span>
                      )}
                      {m.bodyFatPct !== null && (
                        <span>
                          <b className="text-foreground">{m.bodyFatPct}%</b> fat
                        </span>
                      )}
                      {m.muscleMassKg !== null && (
                        <span>
                          <b className="text-foreground">{m.muscleMassKg} kg</b> muscle
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* PRs */}
      {prs && prs.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-warning" />
              <h3 className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
                Personal records
              </h3>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {prs.map((pr) => (
                <div key={pr.id} className="rounded-xl border border-border bg-surface px-4 py-3">
                  <p className="truncate text-sm font-semibold text-foreground">{pr.exercise.name}</p>
                  <p className="mt-1 font-display text-xl font-bold text-primary">
                    {pr.weightKg ?? 0} kg
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {pr.sets}×{pr.reps} · {pr.exercise.muscleGroup}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
