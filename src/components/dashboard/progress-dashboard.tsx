"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Activity,
  CalendarCheck,
  Flame,
  LineChart,
  Plus,
  Scale,
  Timer,
  Trophy,
} from "lucide-react";
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
  const { data: metrics } = useApiQuery<BodyMetric[]>(QUERY_KEYS.metrics, "/api/me/body-metrics", {
    limit: 60,
  });
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
              <p className="text-muted-foreground text-xs tracking-widest uppercase">
                Total workouts
              </p>
              <Activity className="text-primary h-4 w-4" />
            </div>
            <p className="font-display text-foreground mt-2 text-3xl font-bold">
              {stats?.totalWorkouts ?? "–"}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              +{stats?.monthWorkouts ?? 0} this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs tracking-widest uppercase">
                Minutes trained
              </p>
              <Timer className="text-accent h-4 w-4" />
            </div>
            <p className="font-display text-foreground mt-2 text-3xl font-bold">
              {stats?.totalMinutes ?? "–"}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              avg {stats?.avgDuration ?? 0} min/session
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs tracking-widest uppercase">
                Calories burned
              </p>
              <Flame className="text-warning h-4 w-4" />
            </div>
            <p className="font-display text-foreground mt-2 text-3xl font-bold">
              {(stats?.totalCalories ?? 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs tracking-widest uppercase">
                Personal records
              </p>
              <Trophy className="text-success h-4 w-4" />
            </div>
            <p className="font-display text-foreground mt-2 text-3xl font-bold">
              {prs?.length ?? "–"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weight chart */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-foreground text-sm font-bold tracking-widest uppercase">
                Body weight
              </h3>
              {weightDelta !== null && (
                <span
                  className={
                    weightDelta <= 0
                      ? "bg-success/15 text-success rounded-full px-3 py-1 text-xs font-semibold"
                      : "bg-warning/15 text-warning rounded-full px-3 py-1 text-xs font-semibold"
                  }
                >
                  {weightDelta > 0 ? "+" : ""}
                  {weightDelta.toFixed(1)} kg
                </span>
              )}
            </div>
            {weightHistory.length < 2 ? (
              <div className="border-border mt-6 flex flex-col items-center gap-2 rounded-2xl border border-dashed py-12 text-center">
                <Scale className="text-muted-foreground h-8 w-8" />
                <p className="text-muted-foreground text-sm">
                  Log your weight twice to see your trend line.
                </p>
              </div>
            ) : (
              <div className="mt-6 flex h-40 items-end gap-2">
                {weightHistory.map((m) => (
                  <div key={m.id} className="group relative flex-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{
                        height: `${(((m.weightKg ?? 0) - minWeight + weightSpan * 0.1) / (weightSpan * 1.2)) * 100}%`,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="from-primary/40 to-primary rounded-t-lg bg-gradient-to-t"
                    />
                    <div className="text-muted-foreground mt-1 text-center text-[10px]">
                      {new Date(m.date).getDate()}/{new Date(m.date).getMonth() + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add metric */}
            <div className="border-border mt-6 grid grid-cols-2 gap-3 border-t pt-4">
              <div className="space-y-2">
                <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Weight (kg)
                </label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="82.5"
                />
              </div>
              <div className="space-y-2">
                <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Body fat (%)
                </label>
                <Input
                  type="number"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  placeholder="18"
                />
              </div>
              <Button
                className="col-span-2"
                onClick={addMetric}
                disabled={saving || (!weight && !bodyFat)}
              >
                <Plus className="h-4 w-4" />
                {saving ? "Saving…" : "Log measurement"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History table */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-display text-foreground text-sm font-bold tracking-widest uppercase">
              Measurement history
            </h3>
            {!metrics || metrics.length === 0 ? (
              <p className="border-border text-muted-foreground mt-6 rounded-2xl border border-dashed py-12 text-center text-sm">
                No measurements yet. Log your first one to start tracking!
              </p>
            ) : (
              <div className="divide-border mt-4 divide-y">
                {metrics.slice(0, 10).map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.4) }}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-surface-2 text-muted-foreground flex h-9 w-9 items-center justify-center rounded-xl">
                        <CalendarCheck className="h-4 w-4" />
                      </span>
                      <p className="text-foreground text-sm font-medium">
                        {new Date(m.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-muted-foreground flex gap-4 text-xs">
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
              <Trophy className="text-warning h-4 w-4" />
              <h3 className="font-display text-foreground text-sm font-bold tracking-widest uppercase">
                Personal records
              </h3>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {prs.map((pr) => (
                <div key={pr.id} className="border-border bg-surface rounded-xl border px-4 py-3">
                  <p className="text-foreground truncate text-sm font-semibold">
                    {pr.exercise.name}
                  </p>
                  <p className="font-display text-primary mt-1 text-xl font-bold">
                    {pr.weightKg ?? 0} kg
                  </p>
                  <p className="text-muted-foreground text-xs">
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
