"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets,
  Flame,
  Plus,
  Salad,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { apiDelete, apiPost, useApiQuery } from "@/lib/api-client";
import { QUERY_KEYS, WATER_DAILY_GOAL_ML } from "@/lib/constants";

interface CalorieLog {
  id: string;
  mealType: string;
  foodName: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  portion: string | null;
  date: string;
}

interface MealDay {
  id: string;
  dayNumber: number;
  meals: { id: string; mealType: string; name: string; calories: number; protein: number; carbs: number; fat: number }[];
}

interface MealPlan {
  id: string;
  name: string;
  goal: string | null;
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  isAiGenerated: boolean;
  days: MealDay[];
}

interface NutritionLogs {
  logs: CalorieLog[];
  totals: { calories: number; protein: number; carbs: number; fat: number };
  water: number;
  waterGoal: number;
}

const MEAL_TYPES = [
  { value: "BREAKFAST", label: "Breakfast" },
  { value: "LUNCH", label: "Lunch" },
  { value: "DINNER", label: "Dinner" },
  { value: "SNACK", label: "Snack" },
  { value: "PRE_WORKOUT", label: "Pre-workout" },
  { value: "POST_WORKOUT", label: "Post-workout" },
];

const MEAL_EMOJI: Record<string, string> = {
  BREAKFAST: "🌅",
  LUNCH: "🍗",
  DINNER: "🍛",
  SNACK: "🍎",
  PRE_WORKOUT: "⚡",
  POST_WORKOUT: "💪",
};

const CALORIE_GOAL = 2200;
const MACRO_TARGETS = { protein: 150, carbs: 250, fat: 70 };

export function NutritionDashboard() {
  const queryClient = useQueryClient();
  const { data: logs, isLoading: logsLoading } = useApiQuery<NutritionLogs>(
    [...QUERY_KEYS.nutrition, "logs"],
    "/api/nutrition/logs"
  );
  const { data: plans } = useApiQuery<MealPlan[]>(QUERY_KEYS.mealPlans, "/api/nutrition/plans");
  const { data: stats } = useApiQuery<Record<string, number>>(
    [...QUERY_KEYS.nutrition, "stats"],
    "/api/nutrition/stats"
  );

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [foodName, setFoodName] = React.useState("");
  const [mealType, setMealType] = React.useState("SNACK");
  const [calories, setCalories] = React.useState("");
  const [protein, setProtein] = React.useState("");
  const [carbs, setCarbs] = React.useState("");
  const [fat, setFat] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [selectedPlanId, setSelectedPlanId] = React.useState<string | null>(null);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.nutrition });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mealPlans });
  };

  const addWater = async (amountMl: number) => {
    await apiPost("/api/me/water", { amountMl });
    refresh();
  };

  const removeFood = async (id: string) => {
    await apiDelete(`/api/me/calories/${id}`);
    refresh();
  };

  const addFood = async () => {
    setSaving(true);
    try {
      await apiPost("/api/me/calories", {
        foodName,
        mealType,
        calories: Number(calories) || 0,
        protein: protein ? Number(protein) : undefined,
        carbs: carbs ? Number(carbs) : undefined,
        fat: fat ? Number(fat) : undefined,
      });
      setDialogOpen(false);
      setFoodName("");
      setCalories("");
      setProtein("");
      setCarbs("");
      setFat("");
      refresh();
    } finally {
      setSaving(false);
    }
  };

  if (logsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const today = logs ?? {
    logs: [],
    totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    water: 0,
    waterGoal: WATER_DAILY_GOAL_ML,
  };
  const waterPct = Math.min(100, Math.round((today.water / today.waterGoal) * 100));
  const selectedPlan = plans?.find((p) => p.id === selectedPlanId) ?? plans?.[0];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Nutrition"
        description="Track meals, macros, and hydration"
        icon={<Salad className="h-5 w-5" />}
        actions={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Log food
          </Button>
        }
      />

      {/* Macro stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Calories</p>
              <Flame className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-foreground">
              {today.totals.calories.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground"> / {CALORIE_GOAL.toLocaleString()} kcal</span>
            </p>
            <Progress value={Math.min(100, (today.totals.calories / CALORIE_GOAL) * 100)} className="mt-3" />
          </CardContent>
        </Card>
        {(["protein", "carbs", "fat"] as const).map((macro) => {
          const value = today.totals[macro];
          const target = MACRO_TARGETS[macro];
          return (
            <Card key={macro}>
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {macro} {macro === "protein" ? "🥩" : macro === "carbs" ? "🍚" : "🥑"}
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-foreground">
                  {value}
                  <span className="text-sm font-normal text-muted-foreground"> / {target}g</span>
                </p>
                <Progress value={Math.min(100, (value / target) * 100)} className="mt-3" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's meals */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Today&apos;s Meals</CardTitle>
            <Badge variant="secondary">{today.logs.length} entries</Badge>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {today.logs.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-10 text-center">
                <UtensilsCrossed className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No meals logged yet today.</p>
                <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Add your first meal
                </Button>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {today.logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{MEAL_EMOJI[log.mealType] ?? "🍽️"}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{log.foodName}</p>
                        <p className="text-xs text-muted-foreground">
                          {log.mealType.replaceAll("_", " ").toLowerCase()} · {log.calories} kcal
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="hidden text-xs text-muted-foreground sm:block">
                        P {log.protein ?? 0} · C {log.carbs ?? 0} · F {log.fat ?? 0}
                      </span>
                      <button
                        onClick={() => removeFood(log.id)}
                        className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Delete ${log.foodName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </CardContent>
        </Card>

        {/* Water tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hydration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-5">
              <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-blue-500/20">
                <div
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 transition-all duration-700"
                  style={{ transform: `rotate(${waterPct * 3.6}deg)` }}
                />
                <div className="text-center">
                  <p className="font-display text-xl font-bold text-foreground">
                    {(today.water / 1000).toFixed(1)}L
                  </p>
                  <p className="text-[10px] uppercase text-muted-foreground">{waterPct}%</p>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Goal: <span className="font-semibold text-foreground">{today.waterGoal / 1000}L</span>
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <Button size="sm" variant="outline" className="flex-1 justify-start" onClick={() => addWater(250)}>
                    <Droplets className="h-4 w-4 text-blue-400" /> +250ml
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 justify-start" onClick={() => addWater(500)}>
                    <Droplets className="h-4 w-4 text-blue-400" /> +500ml
                  </Button>
                </div>
              </div>
            </div>
            {stats && (
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Days logged (month)</p>
                  <p className="font-display text-lg font-bold text-foreground">{stats.monthDaysLogged ?? 0}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg daily intake</p>
                  <p className="font-display text-lg font-bold text-foreground">
                    {stats.avgCalories ?? 0} <span className="text-xs font-normal">kcal</span>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Meal plans */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Meal Plans</CardTitle>
          {plans && plans.length > 0 && (
            <Select value={selectedPlan?.id} onValueChange={setSelectedPlanId}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardHeader>
        <CardContent>
          {!plans || plans.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-10 text-center">
              <p className="text-sm text-muted-foreground">No meal plans yet. Generate one with the AI nutritionist!</p>
              <Button asChild size="sm" variant="outline">
                <a href="/dashboard/ai/nutritionist">
                  <Flame className="h-4 w-4" /> AI Nutritionist
                </a>
              </Button>
            </div>
          ) : selectedPlan ? (
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
                  {selectedPlan.name}
                </h3>
                {selectedPlan.isAiGenerated && <Badge variant="accent">AI Generated</Badge>}
                <Badge variant="secondary">
                  {selectedPlan.dailyCalories} kcal · P {selectedPlan.proteinGrams} · C{" "}
                  {selectedPlan.carbsGrams} · F {selectedPlan.fatGrams}
                </Badge>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {selectedPlan.days.map((day) => (
                  <div key={day.id} className="rounded-xl border border-border bg-surface p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">
                      Day {day.dayNumber}
                    </p>
                    <div className="mt-3 space-y-2">
                      {day.meals.map((meal) => (
                        <div key={meal.id} className="rounded-lg bg-surface-2 px-3 py-2">
                          <p className="text-sm font-medium text-foreground">{meal.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {meal.calories} kcal · P{meal.protein}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Add food dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display uppercase tracking-wide">Log Food</DialogTitle>
            <DialogDescription>Add a meal to today&apos;s nutrition log.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Food name
                </label>
                <Input
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Grilled chicken"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Meal type
                </label>
                <Select value={mealType} onValueChange={setMealType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEAL_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "kcal", value: calories, set: setCalories, placeholder: "350" },
                { label: "Protein", value: protein, set: setProtein, placeholder: "25g" },
                { label: "Carbs", value: carbs, set: setCarbs, placeholder: "30g" },
                { label: "Fat", value: fat, set: setFat, placeholder: "12g" },
              ].map((field) => (
                <div key={field.label} className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {field.label}
                  </label>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <Button className="flex-1" onClick={addFood} disabled={saving || !foodName || !calories}>
                <Plus className="h-4 w-4" />
                {saving ? "Adding…" : "Add meal"}
              </Button>
              <Button variant="outline" size="icon" onClick={() => setDialogOpen(false)} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
