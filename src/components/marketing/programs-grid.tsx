"use client";

import Link from "next/link";
import { ArrowRight, Dumbbell, Flame, Heart, PersonStanding, Sparkles, Trophy, Weight, Zap } from "lucide-react";
import { TiltCard } from "@/components/ui/tilt-card";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";

const PROGRAMS = [
  {
    slug: "weight-loss",
    name: "Weight Loss",
    description: "Science-backed fat loss with metabolic conditioning and nutrition coaching.",
    icon: Flame,
    color: "text-accent",
    bg: "from-accent/20 to-transparent",
    tag: "Most Popular",
  },
  {
    slug: "bodybuilding",
    name: "Bodybuilding",
    description: "Hypertrophy-focused splits designed to sculpt lean, dense muscle.",
    icon: Dumbbell,
    color: "text-primary",
    bg: "from-primary/20 to-transparent",
    tag: null,
  },
  {
    slug: "crossfit",
    name: "CrossFit",
    description: "High-intensity functional training for unmatched conditioning.",
    icon: Trophy,
    color: "text-warning",
    bg: "from-warning/20 to-transparent",
    tag: null,
  },
  {
    slug: "yoga",
    name: "Yoga",
    description: "Flexibility, mobility, and mindfulness for body and mind balance.",
    icon: Sparkles,
    color: "text-success",
    bg: "from-success/20 to-transparent",
    tag: null,
  },
  {
    slug: "hiit",
    name: "HIIT",
    description: "Maximum burn in minimum time. 20 minutes that transform you.",
    icon: Zap,
    color: "text-primary-light",
    bg: "from-primary/20 to-transparent",
    tag: null,
  },
  {
    slug: "powerlifting",
    name: "Powerlifting",
    description: "Master the big three: squat, bench, and deadlift with elite coaches.",
    icon: Weight,
    color: "text-accent",
    bg: "from-accent/20 to-transparent",
    tag: null,
  },
  {
    slug: "cardio",
    name: "Cardio",
    description: "Heart-pumping endurance training for stamina that never quits.",
    icon: Heart,
    color: "text-success",
    bg: "from-success/20 to-transparent",
    tag: null,
  },
  {
    slug: "calisthenics",
    name: "Calisthenics",
    description: "Master your bodyweight — from first pull-up to planche.",
    icon: PersonStanding,
    color: "text-warning",
    bg: "from-warning/20 to-transparent",
    tag: null,
  },
];

export function ProgramsGrid() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="accent" className="mb-4">
            Our Programs
          </Badge>
          <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground sm:text-5xl">
            Train With <span className="text-gradient">Purpose</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every program is built by certified coaches and enhanced with AI personalization.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAMS.map((program, i) => (
            <Reveal key={program.slug} delay={i * 0.06}>
              <TiltCard maxTilt={8} className="h-full">
                <SpotlightCard className="h-full rounded-2xl border border-border bg-surface/60 backdrop-blur-xl">
                  <Link
                    href={`/programs/${program.slug}`}
                    className="group flex h-full flex-col p-6"
                  >
                    <div
                      className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${program.bg} border border-border`}
                    >
                      <program.icon className={`h-7 w-7 ${program.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`} />
                    </div>
                    <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-foreground">
                      {program.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {program.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
                      Explore
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    {program.tag && (
                      <Badge className="absolute right-4 top-4" variant="accent">
                        {program.tag}
                      </Badge>
                    )}
                  </Link>
                </SpotlightCard>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
