"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Dumbbell, Loader2, Save, Sparkles } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiPost } from "@/lib/api-client";
import { EXPERIENCE_LEVELS, FITNESS_GOALS } from "@/lib/constants";

interface GeneratedExercise {
  exerciseId: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  restSeconds: number;
  order: number;
}

interface GeneratedDay {
  dayNumber: number;
  title: string;
  exercises: GeneratedExercise[];
}

interface GeneratedPlan {
  title: string;
  goal: string;
  daysPerWeek: number;
  sessionMinutes: number;
  days: GeneratedDay[];
}

const DAYS_OPTIONS = [3, 4, 5, 6];
const SESSION_OPTIONS = [30, 45, 60, 90];

export function AiWorkoutGeneratorDashboard() {
  const [goal, setGoal] = React.useState("MUSCLE_GAIN");
  const [daysPerWeek, setDaysPerWeek] = React.useState("4");
  const [sessionMinutes, setSessionMinutes] = React.useState("45");
  const [experience, setExperience] = React.useState("BEGINNER");
  const [equipment, setEquipment] = React.useState("");
  const [plan, setPlan] = React.useState<GeneratedPlan | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      setPlan(
        await apiPost<GeneratedPlan>("/api/ai/workout-generator", {
          goal,
          daysPerWeek: Number(daysPerWeek),
          sessionMinutes: Number(sessionMinutes),
          experience,
          equipment: equipment || null,
        })
      );
    } catch {
      // keep previous plan
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async () => {
    if (!plan) return;
    setSaving(true);
    try {
      await apiPost("/api/workouts/plans", {
        name: plan.title,
        goal,
        daysPerWeek: plan.daysPerWeek,
        isAiGenerated: true,
        days: plan.days.map((day) => ({
          dayNumber: day.dayNumber,
          title: day.title,
          exercises: day.exercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            restSeconds: ex.restSeconds,
            order: ex.order,
          })),
        })),
      });
      window.location.href = "/dashboard/workouts";
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Workout Generator"
        description="AI builds a personalized program in seconds"
        icon={<Sparkles className="h-5 w-5" />}
      />

      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Goal
              </label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FITNESS_GOALS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Days per week
              </label>
              <Select value={daysPerWeek} onValueChange={setDaysPerWeek}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OPTIONS.map((d) => (
                    <SelectItem key={d} value={String(d)}>
                      {d} days
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Session length
              </label>
              <Select value={sessionMinutes} onValueChange={setSessionMinutes}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SESSION_OPTIONS.map((m) => (
                    <SelectItem key={m} value={String(m)}>
                      {m} min
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Experience
              </label>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2 lg:col-span-4">
              <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Equipment (optional)
              </label>
              <Input
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                placeholder="e.g. dumbbells, pull-up bar, full gym"
              />
            </div>
          </div>
          <Button className="mt-5 w-full sm:w-auto" onClick={generate} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Dumbbell className="h-4 w-4" />
            )}
            {loading ? "Generating…" : "Generate my plan"}
          </Button>
        </CardContent>
      </Card>

      {plan && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-foreground text-xl font-bold tracking-wide uppercase">
                {plan.title}
              </h3>
              <Badge variant="accent">AI Generated</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={savePlan} disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save to my plans"}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {plan.days.map((day, i) => (
              <motion.div
                key={day.dayNumber}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="border-border bg-surface rounded-2xl border p-5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-primary text-sm font-bold tracking-widest uppercase">
                    Day {day.dayNumber}
                  </h4>
                  <Badge variant="secondary">{day.title}</Badge>
                </div>
                <div className="mt-4 space-y-2">
                  {day.exercises.map((ex) => (
                    <div
                      key={ex.exerciseId}
                      className="bg-surface-2 flex items-center justify-between rounded-lg px-3 py-2"
                    >
                      <div>
                        <p className="text-foreground text-sm font-medium">{ex.name}</p>
                        <p className="text-muted-foreground text-xs">{ex.muscleGroup}</p>
                      </div>
                      <span className="text-muted-foreground text-xs font-semibold">
                        {ex.sets}×{ex.reps} · {ex.restSeconds}s
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
