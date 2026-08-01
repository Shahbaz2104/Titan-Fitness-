"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CalendarHeart, Loader2, Salad, Save, Sparkles } from "lucide-react";
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

interface GeneratedMeal {
  mealType: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface GeneratedDay {
  dayNumber: number;
  meals: GeneratedMeal[];
}

interface GeneratedPlan {
  title: string;
  goal: string;
  dailyCalories: number;
  proteinGrams: number;
  days: GeneratedDay[];
}

const GOALS = [
  { label: "Weight Loss", value: "WEIGHT_LOSS" },
  { label: "Muscle Gain", value: "MUSCLE_GAIN" },
  { label: "Maintenance", value: "MAINTENANCE" },
];

const PROTEIN_PREFS = [
  { label: "Standard", value: "STANDARD" },
  { label: "High protein", value: "HIGH_PROTEIN" },
  { label: "Vegetarian", value: "VEGETARIAN" },
];

const MEALS_PER_DAY = [3, 4, 5, 6];

export function AiNutritionistDashboard() {
  const [goal, setGoal] = React.useState("MUSCLE_GAIN");
  const [proteinPreference, setProteinPreference] = React.useState("STANDARD");
  const [calories, setCalories] = React.useState("2200");
  const [mealsPerDay, setMealsPerDay] = React.useState("4");
  const [plan, setPlan] = React.useState<GeneratedPlan | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const generate = async () => {
    setLoading(true);
    setSaved(false);
    try {
      setPlan(
        await apiPost<GeneratedPlan>("/api/ai/nutritionist", {
          goal,
          proteinPreference,
          dailyCalories: Number(calories) || 2200,
          mealsPerDay: Number(mealsPerDay) || 4,
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
      await apiPost("/api/nutrition/plans", {
        name: plan.title,
        goal: plan.goal,
        dailyCalories: plan.dailyCalories,
        proteinGrams: plan.proteinGrams,
        carbsGrams: Math.round((plan.dailyCalories * 0.45) / 4),
        fatGrams: Math.round((plan.dailyCalories * 0.3) / 9),
        durationDays: plan.days.length,
        isAiGenerated: true,
        days: plan.days.map((day) => ({
          dayNumber: day.dayNumber,
          meals: day.meals.map((meal) => ({
            mealType: meal.mealType,
            name: meal.name,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
          })),
        })),
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const day0 = plan?.days[0];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="AI Nutritionist"
        description="Get a personalized 7-day meal plan"
        icon={<Sparkles className="h-5 w-5" />}
      />

      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Goal
              </label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GOALS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Protein preference
              </label>
              <Select value={proteinPreference} onValueChange={setProteinPreference}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROTEIN_PREFS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Daily calories
              </label>
              <Input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="2200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Meals per day
              </label>
              <Select value={mealsPerDay} onValueChange={setMealsPerDay}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEALS_PER_DAY.map((m) => (
                    <SelectItem key={m} value={String(m)}>
                      {m} meals
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="mt-5 w-full sm:w-auto" onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Salad className="h-4 w-4" />}
            {loading ? "Creating your plan…" : "Generate meal plan"}
          </Button>
        </CardContent>
      </Card>

      {plan && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-xl font-bold uppercase tracking-wide text-foreground">
                {plan.title}
              </h3>
              <Badge variant="accent">AI Generated</Badge>
            </div>
            {saved ? (
              <Badge variant="success">Saved to your plans ✓</Badge>
            ) : (
              <Button variant="outline" size="sm" onClick={savePlan} disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? "Saving…" : "Save to my plans"}
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{plan.dailyCalories} kcal/day</Badge>
            <Badge variant="secondary">{plan.proteinGrams}g protein</Badge>
            <Badge variant="secondary">7 days</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plan.days.map((day, i) => (
              <motion.div
                key={day.dayNumber}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-surface p-5"
              >
                <div className="flex items-center gap-2">
                  <CalendarHeart className="h-4 w-4 text-primary" />
                  <h4 className="font-display text-sm font-bold uppercase tracking-widest text-primary">
                    Day {day.dayNumber}
                  </h4>
                </div>
                <div className="mt-3 space-y-2">
                  {day.meals.map((meal) => (
                    <div key={meal.name} className="rounded-lg bg-surface-2 px-3 py-2">
                      <p className="text-sm font-medium text-foreground">{meal.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {meal.calories} kcal · P {meal.protein} · C {meal.carbs} · F {meal.fat}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {day0 && (
            <p className="text-xs text-muted-foreground">
              Tip: Day 1 totals {day0.meals.reduce((a, m) => a + m.calories, 0)} kcal — adjust
              portion sizes to hit your exact target.
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
