"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  History,
  Library,
  Pause,
  Play,
  RotateCcw,
  Search,
  Timer,
  Trophy,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressRing } from "@/components/ui/progress-ring";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { MUSCLE_GROUPS, searchExercises } from "@/lib/exercise-data";

function useRestTimer() {
  const [seconds, setSeconds] = React.useState(90);
  const [running, setRunning] = React.useState(false);

  React.useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running]);

  const reset = (secs = 90) => {
    setRunning(false);
    setSeconds(secs);
  };

  return { seconds, running, setRunning, reset };
}

const PRESETS = [60, 90, 120, 180];

const HISTORY = [
  { date: "Mon", minutes: 45, calories: 420 },
  { date: "Tue", minutes: 30, calories: 290 },
  { date: "Wed", minutes: 55, calories: 510 },
  { date: "Thu", minutes: 0, calories: 0 },
  { date: "Fri", minutes: 40, calories: 380 },
  { date: "Sat", minutes: 35, calories: 330 },
  { date: "Sun", minutes: 50, calories: 460 },
];

const PRS = [
  { exercise: "Deadlift", weight: "160 kg", date: "Jul 28", pr: true },
  { exercise: "Barbell Squat", weight: "130 kg", date: "Jul 21", pr: false },
  { exercise: "Bench Press", weight: "95 kg", date: "Jul 14", pr: false },
  { exercise: "Pull-Up", weight: "20 reps", date: "Jul 05", pr: false },
];

export function WorkoutTracker() {
  const [tab, setTab] = React.useState("today");
  const [query, setQuery] = React.useState("");
  const [group, setGroup] = React.useState("All");
  const debouncedQuery = useDebounce(query, 200);
  const exercises = searchExercises(debouncedQuery, group);
  const timer = useRestTimer();
  const [progress, setProgress] = React.useState(0);

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full overflow-x-auto sm:w-auto">
          <TabsTrigger value="today">
            <Dumbbell className="h-4 w-4" /> Today
          </TabsTrigger>
          <TabsTrigger value="library">
            <Library className="h-4 w-4" /> Library
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4" /> History
          </TabsTrigger>
          <TabsTrigger value="prs">
            <Trophy className="h-4 w-4" /> PRs
          </TabsTrigger>
        </TabsList>

        {/* TODAY */}
        <TabsContent value="today">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl font-bold uppercase tracking-wide text-foreground">
                      Leg Day · Strength
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      6 exercises · 45 min · est. 420 kcal
                    </p>
                  </div>
                  <Badge variant="success">In Progress</Badge>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    { name: "Barbell Squat", sets: "4 × 8", done: true, weight: "100 kg" },
                    { name: "Romanian Deadlift", sets: "3 × 10", done: true, weight: "80 kg" },
                    { name: "Leg Press", sets: "4 × 12", done: true, weight: "180 kg" },
                    { name: "Walking Lunges", sets: "3 × 12", done: false, weight: "BW" },
                    { name: "Calf Raise", sets: "4 × 15", done: false, weight: "60 kg" },
                  ].map((exercise, i) => (
                    <motion.button
                      key={exercise.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => {
                        setProgress(Math.min(100, progress + 20));
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all duration-300",
                        exercise.done
                          ? "border-success/30 bg-success/5"
                          : "border-border bg-surface hover:border-primary/40"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2
                          className={cn(
                            "h-5 w-5",
                            exercise.done ? "text-success" : "text-muted-foreground"
                          )}
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">{exercise.name}</p>
                          <p className="text-xs text-muted-foreground">{exercise.weight}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{exercise.sets}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <ProgressRing value={progress} size={64} strokeWidth={6} label="Session" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-display text-lg font-bold text-foreground">
                        {progress === 100 ? "Workout complete!" : "Keep going, you're doing great!"}
                      </span>
                    </p>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rest timer */}
            <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
                  <Timer className="h-5 w-5 text-accent" />
                </span>
                <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
                  Rest Timer
                </h3>
              </div>

              <div className="mt-6 text-center">
                <p
                  className={cn(
                    "font-display text-6xl font-bold tabular-nums",
                    timer.seconds <= 10 && timer.seconds > 0 ? "animate-pulse text-primary" : "text-foreground"
                  )}
                >
                  {Math.floor(timer.seconds / 60)}:
                  {String(timer.seconds % 60).padStart(2, "0")}
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {timer.running ? "Resting" : timer.seconds === 0 ? "Ready!" : "Paused"}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => timer.reset(preset)}
                    className="rounded-xl border border-border bg-surface py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-accent/40 hover:text-accent"
                  >
                    {Math.floor(preset / 60)}:{String(preset % 60).padStart(2, "0")}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex gap-3">
                <Button
                  variant={timer.running ? "destructive" : "default"}
                  className="flex-1"
                  onClick={() => timer.setRunning(!timer.running)}
                >
                  {timer.running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {timer.running ? "Pause" : "Start"}
                </Button>
                <Button variant="outline" size="icon" onClick={() => timer.reset(90)} aria-label="Reset timer">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-6 rounded-xl border border-border bg-surface p-4">
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Flame className="h-4 w-4 text-primary" />
                  Tip: 90s rest for big lifts, 60s for isolation.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* LIBRARY */}
        <TabsContent value="library">
          <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search exercises…"
                  className="pl-11"
                  aria-label="Search exercises"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {MUSCLE_GROUPS.map((mg) => (
                  <button
                    key={mg}
                    onClick={() => setGroup(mg)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                      group === mg
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-surface text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {mg}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {exercises.map((exercise, i) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.4) }}
                  className="group flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3.5 transition-all duration-300 hover:border-primary/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                      <Dumbbell className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{exercise.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {exercise.category} · {exercise.equipment}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      exercise.difficulty === "Advanced"
                        ? "warning"
                        : exercise.difficulty === "Intermediate"
                          ? "accent"
                          : "success"
                    }
                  >
                    {exercise.difficulty}
                  </Badge>
                </motion.div>
              ))}
            </div>

            {exercises.length === 0 && (
              <p className="mt-10 text-center text-sm text-muted-foreground">
                No exercises found. Try a different search.
              </p>
            )}
          </div>
        </TabsContent>

        {/* HISTORY */}
        <TabsContent value="history">
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl lg:col-span-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
                  This Week
                </h3>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> 255 min
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5 text-primary" /> 2,390 kcal
                  </span>
                </div>
              </div>
              <div className="mt-8 flex h-40 items-end justify-between gap-3">
                {HISTORY.map((day, i) => (
                  <div key={day.date} className="group flex flex-1 flex-col items-center gap-2">
                    <span className="text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      {day.minutes}m
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.minutes / 60) * 100}%` }}
                      transition={{ delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className={cn(
                        "w-full rounded-t-lg transition-colors",
                        day.minutes > 0
                          ? "bg-gradient-to-t from-primary/60 to-accent group-hover:from-primary group-hover:to-accent"
                          : "bg-surface-2"
                      )}
                      style={{ minHeight: day.minutes > 0 ? 12 : 6 }}
                    />
                    <span className="text-[10px] uppercase text-muted-foreground">{day.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl lg:col-span-2">
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
                Recent Sessions
              </h3>
              <div className="mt-5 space-y-3">
                {[
                  { name: "Leg Day · Strength", date: "Today", duration: "45 min", calories: 420 },
                  { name: "Upper Body · Push", date: "Yesterday", duration: "40 min", calories: 380 },
                  { name: "Cardio · Zone 2", date: "Jul 28", duration: "35 min", calories: 330 },
                  { name: "Pull Day · Hypertrophy", date: "Jul 27", duration: "55 min", calories: 510 },
                ].map((session) => (
                  <div
                    key={session.name}
                    className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 transition-colors hover:border-primary/30"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{session.name}</p>
                      <p className="text-xs text-muted-foreground">{session.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-foreground">{session.duration}</p>
                      <p className="text-xs text-muted-foreground">{session.calories} kcal</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* PRs */}
        <TabsContent value="prs">
          <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
                Personal Records
              </h3>
              <Badge variant="warning">
                <Trophy className="h-3 w-3" /> 4 PRs this month
              </Badge>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {PRS.map((pr) => (
                <div
                  key={pr.exercise}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-5 py-4 transition-all",
                    pr.pr ? "border-warning/40 bg-warning/5" : "border-border bg-surface"
                  )}
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{pr.exercise}</p>
                    <p className="text-xs text-muted-foreground">{pr.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn("font-display text-xl font-bold", pr.pr ? "text-warning" : "text-foreground")}>
                      {pr.weight}
                    </p>
                    {pr.pr && <p className="text-[10px] font-bold uppercase text-warning">New PR!</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
