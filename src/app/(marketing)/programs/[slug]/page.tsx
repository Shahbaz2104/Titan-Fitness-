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
import { SmartImage } from "@/components/ui/smart-image";
import { GsapReveal, MaskReveal } from "@/components/ui/gsap-reveal";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const PROGRAMS = [
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
    image: "/images/programs/weight-loss.jpg",
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
    image: "/images/programs/bodybuilding.jpg",
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
    image: "/images/programs/crossfit.jpg",
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
    image: "/images/programs/yoga.jpg",
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
    image: "/images/programs/cardio.jpg",
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
    image: "/images/programs/hiit.jpg",
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
    image: "/images/programs/powerlifting.jpg",
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
    image: "/images/programs/calisthenics.jpg",
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

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = PROGRAMS.find((p) => p.slug === slug);
  if (!program) notFound();

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/programs"
            className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All programs
          </Link>
          <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="flex items-center gap-3">
                <div className="border-border bg-surface-2 flex h-14 w-14 items-center justify-center rounded-xl border">
                  <program.icon className={`h-7 w-7 ${program.icon === Flame || program.icon === Weight ? "text-accent" : "text-primary"}`} />
                </div>
                <Badge variant="secondary">{program.difficulty}</Badge>
                <Badge variant="secondary">{program.duration}</Badge>
              </div>
              <h1 className="font-display text-foreground mt-6 text-4xl font-bold tracking-[-0.02em] sm:text-6xl">
                {program.name}
              </h1>
              <p className="text-primary mt-4 text-lg font-medium">{program.tagline}</p>
              <p className="text-muted-foreground mt-5 max-w-xl leading-relaxed">
                {program.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Award className="text-accent h-4 w-4" />
                  Coach: {program.trainer}
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <CalendarDays className="text-primary h-4 w-4" />
                  Weekly schedule below
                </div>
              </div>
              <div className="mt-8 flex items-center gap-5">
                <p className="font-display text-foreground text-4xl font-bold">
                  ${program.price}
                  <span className="text-muted-foreground text-sm font-normal">/month</span>
                </p>
                <Button asChild size="lg">
                  <Link href="/register">
                    Enroll now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="border-border relative aspect-[4/3] overflow-hidden rounded-2xl border">
              <SmartImage
                src={program.image}
                alt={program.name}
                className="h-full w-full object-cover"
                fallbackClassName="bg-surface-2 h-full w-full"
                fallback={<program.icon className="text-muted-foreground h-24 w-24 opacity-40" />}
              />
              <div className="absolute right-5 bottom-5 left-5">
                <div className="bg-background/70 rounded-xl p-5 backdrop-blur-sm">
                  <p className="text-muted-foreground text-xs">This week</p>
                  <p className="font-display text-foreground mt-1 text-lg font-semibold">
                    {program.schedule[0].day}: {program.schedule[0].focus}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-foreground text-3xl font-bold tracking-[-0.02em]">
                <MaskReveal as="span">Weekly schedule</MaskReveal>
              </h2>
              <div className="mt-8 space-y-3">
                {program.schedule.map((slot, i) => (
                  <GsapReveal key={slot.day} delay={i * 0.03}>
                    <div className="border-border bg-surface/60 hover:border-white/15 flex items-center justify-between rounded-xl border px-5 py-4 transition-colors duration-300">
                      <span className="text-primary text-sm font-semibold">{slot.day}</span>
                      <span className="text-foreground flex items-center gap-2 text-sm">
                        <Clock className="text-muted-foreground h-4 w-4" />
                        {slot.focus}
                      </span>
                    </div>
                  </GsapReveal>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-display text-foreground text-3xl font-bold tracking-[-0.02em]">
                <MaskReveal as="span">What&apos;s included</MaskReveal>
              </h2>
              <ul className="mt-8 space-y-4">
                {program.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="bg-success/15 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                      <Check className="text-success h-3 w-3" />
                    </span>
                    <span className="text-muted-foreground text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" size="lg" className="mt-8">
                <Link href="/trainers">
                  Meet your coach — {program.trainer}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
