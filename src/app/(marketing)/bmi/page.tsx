"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calculator, Gauge, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { calculateBMI, bmiCategory } from "@/lib/utils";

const RANGES = [
  { label: "Underweight", min: 0, max: 18.5, color: "#FFC107" },
  { label: "Healthy", min: 18.5, max: 25, color: "#00C853" },
  { label: "Overweight", min: 25, max: 30, color: "#FF6B35" },
  { label: "Obese", min: 30, max: 100, color: "#E63946" },
];

export default function BmiCalculatorPage() {
  const [weight, setWeight] = React.useState(80);
  const [height, setHeight] = React.useState(178);

  const bmi = calculateBMI(weight, height) ?? 0;
  const category = bmiCategory(bmi);
  const position = Math.min(Math.max((bmi - 10) / 45, 0), 1);
  const idealMin = 18.5 * (height / 100) ** 2;
  const idealMax = 25 * (height / 100) ** 2;

  return (
    <>
      <PageHeader
        badge="Health Calculator"
        title="Know Your"
        highlight="Numbers"
        description="Your BMI is the starting line. Get instant analysis, ideal weight ranges, and AI-powered recommendations."
      />

      <section className="pb-24">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* Input panel */}
          <div className="rounded-3xl border border-border bg-surface/60 p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15">
                <Calculator className="h-5 w-5 text-primary" />
              </span>
              <h2 className="font-display text-xl font-bold uppercase tracking-wide text-foreground">
                Enter Your Details
              </h2>
            </div>

            <div className="mt-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Badge variant="secondary">{weight} kg</Badge>
                </div>
                <Slider
                  id="weight"
                  min={30}
                  max={300}
                  step={0.5}
                  value={[weight]}
                  onValueChange={([v]) => setWeight(v ?? 80)}
                  className="py-1"
                />
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>30 kg</span>
                  <span>165 kg</span>
                  <span>300 kg</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Badge variant="secondary">{height} cm</Badge>
                </div>
                <Slider
                  id="height"
                  min={100}
                  max={250}
                  step={0.5}
                  value={[height]}
                  onValueChange={([v]) => setHeight(v ?? 178)}
                  className="py-1"
                />
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>100 cm</span>
                  <span>175 cm</span>
                  <span>250 cm</span>
                </div>
              </div>

              <Button type="button" size="lg" className="w-full group">
                BMI Updates Live
                <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </Button>
            </div>
          </div>

          {/* Result panel */}
          <div className="rounded-3xl border border-border bg-surface/60 p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-success/15">
                <Gauge className="h-5 w-5 text-success" />
              </span>
              <h2 className="font-display text-xl font-bold uppercase tracking-wide text-foreground">
                Your Result
              </h2>
            </div>

            <div className="mt-8 text-center">
              <motion.p
                key={bmi}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="font-display text-7xl font-bold"
                style={{ color: category.color }}
              >
                {bmi}
              </motion.p>
              <Badge
                className="mt-3"
                variant="secondary"
                style={{ color: category.color, borderColor: `${category.color}40` }}
              >
                {category.label}
              </Badge>
            </div>

            {/* Scale */}
            <div className="mt-8">
              <div className="relative h-3 overflow-hidden rounded-full">
                <div className="absolute inset-0 flex">
                  {RANGES.map((range) => (
                    <div
                      key={range.label}
                      className="h-full flex-1"
                      style={{ backgroundColor: `${range.color}30` }}
                    />
                  ))}
                </div>
                <motion.div
                  className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background shadow-lg"
                  style={{ backgroundColor: category.color, left: `${position * 100}%` }}
                  animate={{ left: `${position * 100}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>10</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>55</span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm leading-relaxed text-muted-foreground">{category.health}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Healthy weight range
                  </p>
                  <p className="mt-1 font-display text-lg font-bold text-success">
                    {idealMin.toFixed(0)}–{idealMax.toFixed(0)} kg
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Distance to ideal
                  </p>
                  <p className="mt-1 font-display text-lg font-bold text-foreground">
                    {weight > idealMax
                      ? `−${(weight - idealMax).toFixed(1)} kg`
                      : weight < idealMin
                        ? `+${(idealMin - weight).toFixed(1)} kg`
                        : "You're in range"}
                  </p>
                </div>
              </div>
            </div>

            <Button
              asChild
              variant="accent"
              size="lg"
              className="mt-6 w-full group"
            >
              <a href="/register">
                <Sparkles className="h-4 w-4" />
                Get AI-Powered Plan
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Button>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-surface to-accent/10 p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-accent" />
              <h2 className="font-display text-xl font-bold uppercase tracking-wide text-foreground">
                AI Recommendations
              </h2>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Training",
                  text:
                    category.label === "Obese"
                      ? "Start with low-impact strength training 3x/week — this preserves muscle while accelerating fat loss."
                      : category.label === "Underweight"
                        ? "Prioritize progressive overload with compound lifts 4x/week to build lean mass."
                        : "A balanced split of strength + cardio 4–5 days/week keeps your body composition optimal.",
                },
                {
                  title: "Nutrition",
                  text:
                    category.label === "Obese" || category.label === "Overweight"
                      ? "Target a 500 kcal deficit with 1.6–2.2g protein per kg of body weight."
                      : category.label === "Underweight"
                        ? "Aim for a 300–500 kcal surplus with 1.8–2.2g protein per kg."
                        : "Maintenance calories with 1.6–2g protein per kg keeps you lean and strong.",
                },
                {
                  title: "Next Step",
                  text: "Create a free account to generate your personalized AI workout and meal plan based on these numbers.",
                },
              ].map((rec) => (
                <div key={rec.title} className="rounded-2xl border border-border bg-surface/70 p-5">
                  <p className="font-display text-sm font-bold uppercase tracking-widest text-primary">
                    {rec.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{rec.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
