"use client";

import Link from "next/link";
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
  Scale,
  Sparkles,
  Zap,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TODAY_WORKOUT = {
  title: "Leg Day · Strength",
  duration: "45 min",
  exercises: [
    { name: "Barbell Squat", sets: "4 × 8", done: false },
    { name: "Romanian Deadlift", sets: "3 × 10", done: false },
    { name: "Leg Press", sets: "4 × 12", done: false },
    { name: "Walking Lunges", sets: "3 × 12", done: false },
  ],
};

const UPCOMING_CLASSES = [
  {
    id: "yoga-flow",
    type: "Yoga",
    time: "Today · 6:30 PM",
    trainer: "Sara Khan",
    spots: 12,
    icon: "🧘",
    color: "text-success",
  },
  {
    id: "hiit-blast",
    type: "HIIT",
    time: "Tomorrow · 7:00 AM",
    trainer: "David Okoro",
    spots: 4,
    icon: "⚡",
    color: "text-accent",
  },
  {
    id: "crossfit-wod",
    type: "CrossFit",
    time: "Wed · 6:00 PM",
    trainer: "David Okoro",
    spots: 18,
    icon: "🏋️",
    color: "text-warning",
  },
];

const WEEK_STREAK = [true, true, true, true, true, true, false];
const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function OverviewDashboard() {
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
              Today&apos;s Plan Ready
            </Badge>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
              {TODAY_WORKOUT.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Estimated burn: 420 kcal · {TODAY_WORKOUT.duration}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="sm">
                <Link href="/dashboard/workouts">
                  <Dumbbell className="h-4 w-4" />
                  Start Workout
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
            <ProgressRing value={72} size={104} color="#E63946" label="Weekly Goal" suffix="%" />
            <ProgressRing value={100} size={104} color="#00C853" label="Streak Today" suffix="%" />
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Calories Burned"
          value="2,480"
          icon={Flame}
          delta={12.5}
          href="/dashboard/workouts"
          delay={0.05}
        />
        <StatCard
          label="Current Weight"
          value="78.5 kg"
          icon={Scale}
          delta={-1.8}
          deltaLabel="this month"
          href="/dashboard/progress"
          delay={0.1}
        />
        <StatCard
          label="Attendance"
          value="18 / 22"
          icon={Activity}
          delta={8.2}
          href="/dashboard/attendance"
          delay={0.15}
        />
        <StatCard
          label="Workout Streak"
          value="21 days"
          icon={Zap}
          delta={5}
          deltaLabel="days in a row"
          href="/dashboard/workouts"
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
            {TODAY_WORKOUT.exercises.map((exercise, i) => (
              <motion.div
                key={exercise.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-4 py-3 transition-all duration-300",
                  exercise.done
                    ? "border-success/30 bg-success/5"
                    : "border-border bg-surface hover:border-primary/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className={cn(
                      "h-4 w-4",
                      exercise.done ? "text-success" : "text-muted-foreground"
                    )}
                  />
                  <span className="text-sm text-foreground">{exercise.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{exercise.sets}</span>
              </motion.div>
            ))}
            <Button className="w-full" size="sm">
              <Dumbbell className="h-4 w-4" />
              Log Workout
            </Button>
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
            {UPCOMING_CLASSES.map((cls, i) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 transition-all duration-300 hover:border-primary/30"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cls.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{cls.type}</p>
                    <p className="text-xs text-muted-foreground">{cls.time}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-muted-foreground">{cls.trainer}</span>
                  <Badge variant={cls.spots <= 5 ? "warning" : "secondary"}>
                    {cls.spots} spots
                  </Badge>
                </div>
              </motion.div>
            ))}
            <Button asChild variant="outline" className="w-full" size="sm">
              <Link href="/dashboard/classes">
                <CalendarDays className="h-4 w-4" />
                Browse Classes
              </Link>
            </Button>
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
                {WEEK_STREAK.map((active, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300",
                        active
                          ? "border-primary bg-primary/15 text-primary shadow-glow"
                          : "border-border bg-surface text-muted-foreground"
                      )}
                    >
                      {active ? "✓" : WEEK_DAYS[i]}
                    </span>
                    <span className="text-[10px] uppercase text-muted-foreground">
                      {WEEK_DAYS[i]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Water tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Water Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-5">
                <ProgressRing value={62} size={72} strokeWidth={6} color="#3B82F6" label="Goal" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-display text-xl font-bold text-foreground">1.9L</span>{" "}
                    / 3L
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Droplets className="h-3.5 w-3.5 text-blue-400" />
                      +250ml
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Droplets className="h-3.5 w-3.5 text-blue-400" />
                      +500ml
                    </Button>
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
                  <p className="text-sm font-semibold text-foreground">Pro Membership</p>
                  <p className="text-xs text-muted-foreground">Renews in 12 days</p>
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
