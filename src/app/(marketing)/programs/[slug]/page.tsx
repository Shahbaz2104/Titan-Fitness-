import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CalendarDays,
  Check,
  Clock,
  Dumbbell,
  Flame,
  Heart,
  PersonStanding,
  Sparkles,
  Trophy,
  Weight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

const PROGRAMS = [
  {
    slug: "weight-loss",
    name: "Weight Loss",
    icon: Flame,
    difficulty: "All Levels",
    duration: "8–12 weeks",
    trainer: "Emily Chen",
    price: 79,
    tagline: "Burn fat. Keep muscle. Transform your metabolism.",
    description:
      "Our Weight Loss program combines metabolic resistance training, zone-2 cardio, and AI-personalized nutrition to create sustainable fat loss — not crash diets.",
    schedule: [
      { day: "Mon", focus: "Metabolic Resistance" },
      { day: "Tue", focus: "HIIT + Core" },
      { day: "Wed", focus: "Zone-2 Cardio + Mobility" },
      { day: "Thu", focus: "Full-Body Strength" },
      { day: "Fri", focus: "HIIT + Core" },
      { day: "Sat", focus: "Active Recovery" },
      { day: "Sun", focus: "Rest" },
    ],
    features: [
      "4-5 workouts per week with AI progression",
      "Personalized calorie & macro targets",
      "Weekly AI nutrition plan + shopping lists",
      "Body composition tracking (DEXA scans)",
      "Monthly 1-on-1 coach check-in",
      "Progress photo & measurement logging",
    ],
    color: "text-accent",
    gradient: "from-accent/25",
  },
  {
    slug: "bodybuilding",
    name: "Bodybuilding",
    icon: Dumbbell,
    difficulty: "Intermediate",
    duration: "12 weeks",
    trainer: "Marcus Cole",
    price: 89,
    tagline: "Sculpt dense, proportionate muscle.",
    description:
      "A hypertrophy-focused split built on progressive overload, exercise variation, and meticulous volume tracking.",
    schedule: [
      { day: "Mon", focus: "Chest + Triceps" },
      { day: "Tue", focus: "Back + Biceps" },
      { day: "Wed", focus: "Shoulders + Core" },
      { day: "Thu", focus: "Rest" },
      { day: "Fri", focus: "Legs + Glutes" },
      { day: "Sat", focus: "Arms + Weak Points" },
      { day: "Sun", focus: "Rest" },
    ],
    features: [
      "6-day PPL hybrid split",
      "Progressive overload tracking (PRs)",
      "Muscle group volume analytics",
      "AI form & technique feedback",
      "Quarterly physique photo analysis",
      "Competition prep guidance",
    ],
    color: "text-primary",
    gradient: "from-primary/25",
  },
  {
    slug: "crossfit",
    name: "CrossFit",
    icon: Trophy,
    difficulty: "All Levels",
    duration: "Ongoing",
    trainer: "David Okoro",
    price: 99,
    tagline: "Forged in the WOD. Unbreakable everywhere else.",
    description:
      "Daily programmed WODs, Olympic lifting technique work, and conditioning circuits led by certified CrossFit coaches.",
    schedule: [
      { day: "Mon", focus: "Strength + WOD" },
      { day: "Tue", focus: "Gymnastics + WOD" },
      { day: "Wed", focus: "Oly Lifting + WOD" },
      { day: "Thu", focus: "Engine Builder" },
      { day: "Fri", focus: "Partner WOD" },
      { day: "Sat", focus: "Hero WOD" },
      { day: "Sun", focus: "Rest / Open Gym" },
    ],
    features: [
      "Unlimited classes (240+/week across branches)",
      "Scaled & RX options for every WOD",
      "Olympic lifting technique coaching",
      "Leaderboard & challenge tracking",
      "Mobility & recovery sessions",
      "Open Gym access 6am–11pm",
    ],
    color: "text-warning",
    gradient: "from-warning/25",
  },
  {
    slug: "yoga",
    name: "Yoga",
    icon: Sparkles,
    difficulty: "All Levels",
    duration: "Ongoing",
    trainer: "Sara Khan",
    price: 59,
    tagline: "Strength through stillness. Power through breath.",
    description:
      "Vinyasa flows, hatha foundations, and deep mobility work that balance intensity with recovery.",
    schedule: [
      { day: "Mon", focus: "Vinyasa Flow" },
      { day: "Tue", focus: "Hatha Foundations" },
      { day: "Wed", focus: "Yin + Breathwork" },
      { day: "Thu", focus: "Power Yoga" },
      { day: "Fri", focus: "Hip & Spine Mobility" },
      { day: "Sat", focus: "Morning Sun Salutations" },
      { day: "Sun", focus: "Rest / Meditation" },
    ],
    features: [
      "10+ yoga classes weekly",
      "All-level progression tracks",
      "Breathwork & meditation sessions",
      "Injury-recovery friendly flows",
      "Mats & props provided",
      "AI-posture feedback on request",
    ],
    color: "text-success",
    gradient: "from-success/25",
  },
  {
    slug: "cardio",
    name: "Cardio",
    icon: Heart,
    difficulty: "All Levels",
    duration: "8 weeks",
    trainer: "David Okoro",
    price: 69,
    tagline: "Build a heart that never quits.",
    description:
      "Heart-rate zone training, interval pyramids, and endurance progressions designed around your current fitness.",
    schedule: [
      { day: "Mon", focus: "Zone-3 Intervals" },
      { day: "Tue", focus: "Steady Zone-2 Run" },
      { day: "Wed", focus: "Stair + Row Circuit" },
      { day: "Thu", focus: "Tempo Run" },
      { day: "Fri", focus: "Zone-4 Pyramids" },
      { day: "Sat", focus: "Long Slow Distance" },
      { day: "Sun", focus: "Rest / Walk" },
    ],
    features: [
      "Heart-rate zone training plans",
      "Treadmill, rower, bike, stair programs",
      "5K → 10K → Half → Marathon pathways",
      "VO2 max estimation & tracking",
      "Recovery heart-rate analytics",
      "AI-pacing suggestions per session",
    ],
    color: "text-success",
    gradient: "from-success/25",
  },
  {
    slug: "hiit",
    name: "HIIT",
    icon: Zap,
    difficulty: "Intermediate",
    duration: "6 weeks",
    trainer: "Emily Chen",
    price: 65,
    tagline: "20 minutes. Maximum output. Done.",
    description:
      "Short, savage, science-backed sessions that maximize calorie burn and afterburn effect.",
    schedule: [
      { day: "Mon", focus: "Tabata Sprints" },
      { day: "Tue", focus: "Rest" },
      { day: "Wed", focus: "AMRAP Circuit" },
      { day: "Thu", focus: "Rest" },
      { day: "Fri", focus: "EMOM Power" },
      { day: "Sat", focus: "Rest" },
      { day: "Sun", focus: "Optional Flow" },
    ],
    features: [
      "20-minute sessions, 3x per week",
      "Modifiable for joint-safe options",
      "Post-workout calorie analytics",
      "AI intensity suggestions",
      "Rest timer built into app",
      "Ideal for busy schedules",
    ],
    color: "text-primary-light",
    gradient: "from-primary/25",
  },
  {
    slug: "powerlifting",
    name: "Powerlifting",
    icon: Weight,
    difficulty: "Advanced",
    duration: "16 weeks",
    trainer: "Marcus Cole",
    price: 99,
    tagline: "Squat. Bench. Deadlift. Repeat. Conquer.",
    description:
      "A 16-week periodized peak for the big three — with weekly volume waves and a meet simulation finale.",
    schedule: [
      { day: "Mon", focus: "Squat (Heavy)" },
      { day: "Tue", focus: "Bench (Volume)" },
      { day: "Wed", focus: "Deadlift (Moderate)" },
      { day: "Thu", focus: "Rest" },
      { day: "Fri", focus: "Squat (Volume) + Accessories" },
      { day: "Sat", focus: "Bench (Heavy) + Accessories" },
      { day: "Sun", focus: "Rest / Recovery" },
    ],
    features: [
      "16-week periodized peak cycle",
      "RPE & percentage-based programming",
      "Video form review by coaches",
      "Weekly PR testing protocol",
      "Meet-day preparation plan",
      "Belt & accessory guidance",
    ],
    color: "text-accent",
    gradient: "from-accent/25",
  },
  {
    slug: "calisthenics",
    name: "Calisthenics",
    icon: PersonStanding,
    difficulty: "All Levels",
    duration: "12 weeks",
    trainer: "Sara Khan",
    price: 69,
    tagline: "Master the machine you were born with.",
    description:
      "Progress from first pull-up to muscle-up and handstand — pure bodyweight strength and control.",
    schedule: [
      { day: "Mon", focus: "Pull + Core" },
      { day: "Tue", focus: "Push + Handstand Prep" },
      { day: "Wed", focus: "Legs + Mobility" },
      { day: "Thu", focus: "Rest" },
      { day: "Fri", focus: "Pull + Core" },
      { day: "Sat", focus: "Skill Practice" },
      { day: "Sun", focus: "Rest" },
    ],
    features: [
      "Pull-up & dip progression ladders",
      "Handstand & skill programming",
      "AI technique feedback on videos",
      "Bodyweight-only — train anywhere",
      "Strength milestone tracking",
      "Advanced: muscle-up, planche, front lever",
    ],
    color: "text-warning",
    gradient: "from-warning/25",
  },
];

export async function generateStaticParams() {
  return PROGRAMS.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return buildMetadata({
    title: "Program",
    path: `/programs/${slug}`,
  });
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = PROGRAMS.find((p) => p.slug === slug);
  if (!program) notFound();

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40">
        <div
          className={`pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-br ${program.gradient} blur-3xl`}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/programs"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            All programs
          </Link>
          <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="flex items-center gap-3">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${program.gradient} border border-border`}>
                  <program.icon className={`h-7 w-7 ${program.color}`} />
                </div>
                <Badge variant="secondary">{program.difficulty}</Badge>
                <Badge variant="secondary">{program.duration}</Badge>
              </div>
              <h1 className="mt-6 font-display text-5xl font-bold uppercase tracking-tight text-foreground sm:text-7xl">
                {program.name}
              </h1>
              <p className="mt-4 font-display text-lg uppercase tracking-wide text-primary">
                {program.tagline}
              </p>
              <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
                {program.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="h-4 w-4 text-accent" />
                  Coach: {program.trainer}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Weekly schedule below
                </div>
              </div>
              <div className="mt-8 flex items-center gap-5">
                <p className="font-display text-4xl font-bold text-foreground">
                  ${program.price}
                  <span className="text-sm font-normal text-muted-foreground">/month</span>
                </p>
                <Button asChild size="lg" className="group">
                  <Link href="/register">
                    Enroll Now
                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>

            <Reveal direction="left">
              <div className={`relative aspect-square overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${program.gradient} to-transparent`}>
                <div className="bg-grid absolute inset-0 opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <program.icon className={`h-40 w-40 ${program.color} opacity-30`} />
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="glass rounded-2xl p-5">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      This week
                    </p>
                    <p className="mt-1 font-display text-lg font-semibold text-foreground">
                      {program.schedule[0].day}: {program.schedule[0].focus}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground">
                Weekly <span className="text-gradient">Schedule</span>
              </h2>
              <div className="mt-8 space-y-3">
                {program.schedule.map((slot) => (
                  <div
                    key={slot.day}
                    className="flex items-center justify-between rounded-xl border border-border bg-surface/60 px-5 py-4 transition-all duration-300 hover:border-primary/30"
                  >
                    <span className="w-14 font-display text-sm font-bold uppercase tracking-widest text-primary">
                      {slot.day}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-foreground">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {slot.focus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground">
                What&apos;s <span className="text-gradient">Included</span>
              </h2>
              <ul className="mt-8 space-y-4">
                {program.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15">
                      <Check className="h-3 w-3 text-success" />
                    </span>
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" size="lg" className="mt-8 group">
                <Link href="/trainers">
                  Meet your coach — {program.trainer}
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
