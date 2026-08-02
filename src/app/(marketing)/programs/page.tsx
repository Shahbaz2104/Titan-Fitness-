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
import { SmartImage } from "@/components/ui/smart-image";
import { GsapReveal } from "@/components/ui/gsap-reveal";
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
    difficulty: "All Levels",
    duration: "8–12 weeks",
    trainer: "Emily Chen",
    description:
      "Metabolic conditioning, nutrition coaching, and AI meal plans engineered to burn fat while preserving muscle.",
    image: "/images/programs/weight-loss.jpg",
  },
  {
    slug: "bodybuilding",
    name: "Bodybuilding",
    icon: Dumbbell,
    difficulty: "Intermediate",
    duration: "12 weeks",
    trainer: "Marcus Cole",
    description:
      "Hypertrophy-focused splits, progressive overload tracking, and physique analytics for lean dense muscle.",
    image: "/images/programs/bodybuilding.jpg",
  },
  {
    slug: "crossfit",
    name: "CrossFit",
    icon: Trophy,
    difficulty: "All Levels",
    duration: "Ongoing",
    trainer: "David Okoro",
    description:
      "Constantly varied functional training — WODs, Olympic lifting, and conditioning for unmatched fitness.",
    image: "/images/programs/crossfit.jpg",
  },
  {
    slug: "yoga",
    name: "Yoga",
    icon: Sparkles,
    difficulty: "All Levels",
    duration: "Ongoing",
    trainer: "Sara Khan",
    description:
      "Vinyasa, Hatha, and mobility flows that build flexibility, balance, and a calm, focused mind.",
    image: "/images/programs/yoga.jpg",
  },
  {
    slug: "cardio",
    name: "Cardio",
    icon: Heart,
    difficulty: "All Levels",
    duration: "8 weeks",
    trainer: "David Okoro",
    description:
      "Heart-rate zone training, intervals, and endurance building — from first mile to full marathon.",
    image: "/images/programs/cardio.jpg",
  },
  {
    slug: "hiit",
    name: "HIIT",
    icon: Zap,
    difficulty: "Intermediate",
    duration: "6 weeks",
    trainer: "Emily Chen",
    description:
      "20-minute high-intensity sessions that torch calories and keep your metabolism elevated all day.",
    image: "/images/programs/hiit.jpg",
  },
  {
    slug: "powerlifting",
    name: "Powerlifting",
    icon: Weight,
    difficulty: "Advanced",
    duration: "16 weeks",
    trainer: "Marcus Cole",
    description:
      "Periodized programming for the squat, bench, and deadlift — with weekly PR testing and coaching.",
    image: "/images/programs/powerlifting.jpg",
  },
  {
    slug: "calisthenics",
    name: "Calisthenics",
    icon: PersonStanding,
    difficulty: "All Levels",
    duration: "12 weeks",
    trainer: "Sara Khan",
    description:
      "Master bodyweight strength — pull-ups, dips, handstands, and beyond. No weights, all control.",
    image: "/images/programs/calisthenics.jpg",
  },
];

export default function ProgramsPage() {
  return (
    <>
      <PageHeader
        badge="Programs"
        title="Choose your"
        highlight="battle"
        description="Eight elite programs, each designed by certified coaches and supercharged with AI personalization."
      />

      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {PROGRAMS.map((program, i) => (
            <GsapReveal key={program.slug} delay={(i % 3) * 0.07}>
              <Link
                href={`/programs/${program.slug}`}
                className="group flex h-full flex-col"
              >
                <div className="border-border relative aspect-[16/10] overflow-hidden rounded-xl border">
                  <SmartImage
                    src={program.image}
                    alt={program.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    fallbackClassName="bg-surface-2 h-full w-full"
                    fallback={<program.icon className="text-muted-foreground h-12 w-12 opacity-60" />}
                  />
                  <span className="border-border bg-background/70 text-muted-foreground absolute top-3 right-3 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm">
                    {program.difficulty}
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-1 pt-5">
                  <h2 className="font-display text-foreground text-xl font-bold tracking-[-0.01em]">
                    {program.name}
                  </h2>
                  <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
                    {program.description}
                  </p>
                  <div className="border-border text-muted-foreground mt-5 flex items-center justify-between border-t pt-4 text-xs">
                    <span>{program.duration}</span>
                    <span>Coach: {program.trainer}</span>
                  </div>
                  <span className="text-primary mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
                    View program
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </GsapReveal>
          ))}
        </div>
      </section>
    </>
  );
}
