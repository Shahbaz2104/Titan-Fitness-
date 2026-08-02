import Link from "next/link";
import {
  Dumbbell,
  Flame,
  Heart,
  PersonStanding,
  Sparkles,
  Trophy,
  Weight,
  Zap,
} from "lucide-react";
import { ImageReveal } from "@/components/ui/image-reveal";
import { WordReveal } from "@/components/ui/word-reveal";
import { AnimeText } from "@/components/ui/anime-text";
import { GsapReveal } from "@/components/ui/gsap-reveal";

const PROGRAMS = [
  {
    slug: "weight-loss",
    name: "Weight Loss",
    description: "Science-backed fat loss with metabolic conditioning and nutrition coaching.",
    icon: Flame,
    tag: "Most Popular",
  },
  {
    slug: "bodybuilding",
    name: "Bodybuilding",
    description: "Hypertrophy-focused splits designed to sculpt lean, dense muscle.",
    icon: Dumbbell,
    tag: null,
  },
  {
    slug: "crossfit",
    name: "CrossFit",
    description: "High-intensity functional training for unmatched conditioning.",
    icon: Trophy,
    tag: null,
  },
  {
    slug: "yoga",
    name: "Yoga",
    description: "Flexibility, mobility, and mindfulness for body and mind balance.",
    icon: Sparkles,
    tag: null,
  },
  {
    slug: "hiit",
    name: "HIIT",
    description: "Maximum burn in minimum time. 20 minutes that transform you.",
    icon: Zap,
    tag: null,
  },
  {
    slug: "powerlifting",
    name: "Powerlifting",
    description: "Master the big three: squat, bench, and deadlift with elite coaches.",
    icon: Weight,
    tag: null,
  },
  {
    slug: "cardio",
    name: "Cardio",
    description: "Heart-pumping endurance training for stamina that never quits.",
    icon: Heart,
    tag: null,
  },
  {
    slug: "calisthenics",
    name: "Calisthenics",
    description: "Master your bodyweight — from first pull-up to planche.",
    icon: PersonStanding,
    tag: null,
  },
];

export function ProgramsGrid() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <h2 className="font-display text-foreground text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
              <AnimeText text="Programs built for how you train" effect="rise" scroll />
            </h2>
            <p className="text-muted-foreground mt-4">
              <WordReveal text="Every program is built by certified coaches and enhanced with AI personalization." />
            </p>
          </div>
          <Link
            href="/programs"
            className="text-primary hover:text-primary-light text-sm font-medium underline-offset-4 hover:underline"
          >
            View all programs
          </Link>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAMS.map((program, i) => (
            <GsapReveal key={program.slug} delay={(i % 4) * 0.07}>
              <Link
                href={`/programs/${program.slug}`}
                className="group flex flex-col"
              >
              <div className="border-border relative aspect-[4/3] overflow-hidden rounded-xl border">
                <ImageReveal
                  src={`/images/programs/${program.slug}.jpg`}
                  alt={program.name}
                  className="h-full w-full"
                  imgClassName="group-hover:scale-105"
                  fallbackClassName="bg-surface-2 h-full w-full"
                  fallback={
                    <program.icon className="text-muted-foreground h-10 w-10 opacity-60" />
                  }
                />
                {program.tag && (
                  <span className="bg-primary text-primary-foreground absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium">
                    {program.tag}
                  </span>
                )}
              </div>
              <div className="flex items-start justify-between gap-4 px-1 pt-4">
                <div>
                  <h3 className="font-display text-foreground text-lg font-semibold tracking-[-0.01em]">
                    {program.name}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {program.description}
                  </p>
                </div>
              </div>
            </Link>
            </GsapReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
