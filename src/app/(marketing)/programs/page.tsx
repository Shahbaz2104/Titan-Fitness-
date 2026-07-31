import Link from "next/link";
import {
  ArrowRight,
  Dumbbell,
  Flame,
  Heart,
  PersonStanding,
  Sparkles,
  Trophy,
  Weight,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Programs",
  description:
    "Explore Titan Fitness programs — Weight Loss, Bodybuilding, CrossFit, Yoga, HIIT, Powerlifting, Cardio, and Calisthenics.",
  path: "/programs",
});

const PROGRAMS = [
  {
    slug: "weight-loss",
    name: "Weight Loss",
    icon: Flame,
    color: "text-accent",
    difficulty: "All Levels",
    duration: "8–12 weeks",
    trainer: "Emily Chen",
    description:
      "Metabolic conditioning, nutrition coaching, and AI meal plans engineered to burn fat while preserving muscle.",
    image: "/images/programs/weight-loss.jpg",
    gradient: "from-accent/25",
  },
  {
    slug: "bodybuilding",
    name: "Bodybuilding",
    icon: Dumbbell,
    color: "text-primary",
    difficulty: "Intermediate",
    duration: "12 weeks",
    trainer: "Marcus Cole",
    description:
      "Hypertrophy-focused splits, progressive overload tracking, and physique analytics for lean dense muscle.",
    image: "/images/programs/bodybuilding.jpg",
    gradient: "from-primary/25",
  },
  {
    slug: "crossfit",
    name: "CrossFit",
    icon: Trophy,
    color: "text-warning",
    difficulty: "All Levels",
    duration: "Ongoing",
    trainer: "David Okoro",
    description:
      "Constantly varied functional training — WODs, Olympic lifting, and conditioning for unmatched fitness.",
    image: "/images/programs/crossfit.jpg",
    gradient: "from-warning/25",
  },
  {
    slug: "yoga",
    name: "Yoga",
    icon: Sparkles,
    color: "text-success",
    difficulty: "All Levels",
    duration: "Ongoing",
    trainer: "Sara Khan",
    description:
      "Vinyasa, Hatha, and mobility flows that build flexibility, balance, and a calm, focused mind.",
    image: "/images/programs/yoga.jpg",
    gradient: "from-success/25",
  },
  {
    slug: "cardio",
    name: "Cardio",
    icon: Heart,
    color: "text-success",
    difficulty: "All Levels",
    duration: "8 weeks",
    trainer: "David Okoro",
    description:
      "Heart-rate zone training, intervals, and endurance building — from first mile to full marathon.",
    image: "/images/programs/cardio.jpg",
    gradient: "from-success/25",
  },
  {
    slug: "hiit",
    name: "HIIT",
    icon: Zap,
    color: "text-primary-light",
    difficulty: "Intermediate",
    duration: "6 weeks",
    trainer: "Emily Chen",
    description:
      "20-minute high-intensity sessions that torch calories and keep your metabolism elevated all day.",
    image: "/images/programs/hiit.jpg",
    gradient: "from-primary/25",
  },
  {
    slug: "powerlifting",
    name: "Powerlifting",
    icon: Weight,
    color: "text-accent",
    difficulty: "Advanced",
    duration: "16 weeks",
    trainer: "Marcus Cole",
    description:
      "Periodized programming for the squat, bench, and deadlift — with weekly PR testing and coaching.",
    image: "/images/programs/powerlifting.jpg",
    gradient: "from-accent/25",
  },
  {
    slug: "calisthenics",
    name: "Calisthenics",
    icon: PersonStanding,
    color: "text-warning",
    difficulty: "All Levels",
    duration: "12 weeks",
    trainer: "Sara Khan",
    description:
      "Master bodyweight strength — pull-ups, dips, handstands, and beyond. No weights, all control.",
    image: "/images/programs/calisthenics.jpg",
    gradient: "from-warning/25",
  },
];

export default function ProgramsPage() {
  return (
    <>
      <PageHeader
        badge="Programs"
        title="Choose Your"
        highlight="Battle"
        description="Eight elite programs, each designed by certified coaches and supercharged with AI personalization."
      />

      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {PROGRAMS.map((program) => (
            <Link
              key={program.slug}
              href={`/programs/${program.slug}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface/60 backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:shadow-glow"
            >
              <div className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${program.gradient} to-transparent`}>
                <div className="bg-grid absolute inset-0 opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <program.icon
                    className={`h-16 w-16 ${program.color} transition-all duration-500 group-hover:scale-125 group-hover:rotate-6`}
                  />
                </div>
                <span className="glass absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium text-foreground">
                  {program.difficulty}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="font-display text-xl font-bold uppercase tracking-wide text-foreground">
                  {program.name}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {program.description}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                  <span>{program.duration}</span>
                  <span>Coach: {program.trainer}</span>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  View Program
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
