"use client";

import { Brain, HeartPulse, Target, Timer, Users, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Coaching",
    description:
      "Workouts and meal plans generated in seconds, tuned to your body, goals, and equipment.",
    color: "text-primary",
    glow: "group-hover:shadow-[0_0_40px_rgba(230,57,70,0.2)]",
  },
  {
    icon: Target,
    title: "Personalized Plans",
    description:
      "From fat loss to powerlifting — every plan adapts as you progress. No generic templates.",
    color: "text-accent",
    glow: "group-hover:shadow-[0_0_40px_rgba(255,107,53,0.2)]",
  },
  {
    icon: Timer,
    title: "Real-Time Tracking",
    description:
      "Log workouts, water, calories, and body metrics with instant progress visualization.",
    color: "text-success",
    glow: "group-hover:shadow-[0_0_40px_rgba(0,200,83,0.2)]",
  },
  {
    icon: Users,
    title: "Elite Trainers",
    description:
      "Certified coaches with real results. Book 1-on-1 sessions right from the app.",
    color: "text-warning",
    glow: "group-hover:shadow-[0_0_40px_rgba(255,193,7,0.2)]",
  },
  {
    icon: HeartPulse,
    title: "Health Analytics",
    description:
      "BMI, body fat, muscle mass, and calorie trends — beautiful charts that keep you honest.",
    color: "text-primary-light",
    glow: "group-hover:shadow-[0_0_40px_rgba(255,90,102,0.2)]",
  },
  {
    icon: ShieldCheck,
    title: "Member-First",
    description:
      "Flexible memberships, QR check-ins, and a community that holds you accountable.",
    color: "text-success",
    glow: "group-hover:shadow-[0_0_40px_rgba(0,200,83,0.2)]",
  },
];

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="default" className="mb-4">
            Why Titan
          </Badge>
          <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground sm:text-5xl">
            Engineered For <span className="text-gradient">Results</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.08}>
              <div
                className={`group h-full rounded-2xl border border-border bg-surface/60 p-7 backdrop-blur-xl transition-all duration-500 hover:border-white/15 hover:bg-surface ${feature.glow}`}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface-2 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
