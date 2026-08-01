import { PageHeader } from "@/components/marketing/page-header";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { Counter } from "@/components/ui/counter";
import { Trophy, Award, Medal, ShieldCheck, Target, Heart } from "lucide-react";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "The story of Titan Fitness — from a single warehouse gym to the AI-powered fitness platform trusted by 12,000+ members.",
  path: "/about",
});

const TIMELINE = [
  {
    year: "2018",
    title: "The First Rep",
    description:
      "Titan Fitness opens its doors as a single 2,000 sq ft warehouse gym with 3 squat racks and a dream.",
  },
  {
    year: "2020",
    title: "Going Digital",
    description:
      "We launch member tracking apps, QR check-ins, and online class booking — a first in our city.",
  },
  {
    year: "2022",
    title: "The Trainer Academy",
    description:
      "Our in-house certification program produces 85+ elite coaches with a 4.9-star average rating.",
  },
  {
    year: "2024",
    title: "AI Enters The Game",
    description:
      "Titan becomes the first gym in the region powered by AI — generating workouts, meal plans, and coaching in seconds.",
  },
  {
    year: "2026",
    title: "12,000+ Strong",
    description:
      "Three flagship branches, 240 weekly classes, and a community that shows up every single day.",
  },
];

const VALUES = [
  {
    icon: Target,
    title: "Results First",
    description: "Every program, every coach, every feature exists to move your numbers.",
  },
  {
    icon: Heart,
    title: "Community",
    description: "Nobody trains alone here. We lift each other — literally and figuratively.",
  },
  {
    icon: ShieldCheck,
    title: "Safety Always",
    description: "Certified coaching, clean equipment, and injury-prevention first training.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        badge="Our Story"
        title="Forged In"
        highlight="Iron & Discipline"
        description="From a single squat rack to an AI-powered fitness empire — this is the Titan story."
      />

      {/* Mission & Vision */}
      <section className="relative py-12">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="group border-border bg-surface/60 hover:border-primary/30 h-full rounded-2xl border p-8 backdrop-blur-xl transition-all duration-500">
              <div className="bg-primary/15 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                <Target className="text-primary h-6 w-6" />
              </div>
              <h2 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
                Our Mission
              </h2>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                To make world-class coaching accessible to everyone by pairing certified human
                trainers with AI intelligence — so that no member ever wonders what to do next.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="group border-border bg-surface/60 hover:border-accent/30 h-full rounded-2xl border p-8 backdrop-blur-xl transition-all duration-500">
              <div className="bg-accent/15 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                <Award className="text-accent h-6 w-6" />
              </div>
              <h2 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
                Our Vision
              </h2>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                A world where every person has a personal coach — where technology and training
                merge so deeply that reaching your goals becomes the default outcome.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal className="text-center">
            <Badge variant="default" className="mb-4">
              Our Journey
            </Badge>
            <h2 className="font-display text-foreground text-4xl font-bold tracking-tight uppercase sm:text-5xl">
              The <span className="text-gradient">Timeline</span>
            </h2>
          </Reveal>
          <div className="relative mt-16">
            <div className="from-primary via-border absolute top-0 left-4 h-full w-px bg-gradient-to-b to-transparent sm:left-1/2" />
            <div className="space-y-12">
              {TIMELINE.map((item, i) => (
                <Reveal key={item.year} delay={i * 0.05}>
                  <div
                    className={`relative flex flex-col gap-3 pl-12 sm:w-1/2 sm:pl-0 ${
                      i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:ml-auto sm:pl-12"
                    }`}
                  >
                    <span
                      className={`border-primary/40 bg-surface shadow-glow absolute top-1 left-4 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border sm:left-auto ${
                        i % 2 === 0
                          ? "sm:-right-4 sm:translate-x-1/2"
                          : "sm:-left-4 sm:-translate-x-1/2"
                      }`}
                    >
                      <Medal className="text-primary h-4 w-4" />
                    </span>
                    <div className="border-border bg-surface/60 hover:border-primary/30 rounded-2xl border p-6 backdrop-blur-xl transition-all duration-500">
                      <p className="font-display text-gradient-red text-2xl font-bold">
                        {item.year}
                      </p>
                      <h3 className="font-display text-foreground mt-1 text-lg font-semibold tracking-wide uppercase">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Certifications */}
      <section className="border-border bg-surface/30 relative border-y py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <Badge variant="warning" className="mb-4">
              Awards &amp; Certifications
            </Badge>
            <h2 className="font-display text-foreground text-4xl font-bold tracking-tight uppercase">
              Recognized <span className="text-gradient">Excellence</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Trophy,
                title: "Best Gym of the Year",
                org: "Fitness Awards 2025",
              },
              {
                icon: Medal,
                title: "Top 10 Fitness Tech",
                org: "Startup Weekly 2024",
              },
              {
                icon: ShieldCheck,
                title: "Certified Safe Facility",
                org: "National Fitness Council",
              },
              {
                icon: Award,
                title: "Outstanding Coaching",
                org: "Coach Excellence Program 2025",
              },
            ].map((award, i) => (
              <Reveal key={award.title} delay={i * 0.08}>
                <div className="group border-border bg-surface/60 hover:border-warning/40 rounded-2xl border p-7 text-center backdrop-blur-xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,193,7,0.15)]">
                  <div className="bg-warning/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    <award.icon className="text-warning h-7 w-7" />
                  </div>
                  <h3 className="font-display text-foreground text-base font-semibold tracking-wide uppercase">
                    {award.title}
                  </h3>
                  <p className="text-muted-foreground mt-1.5 text-xs">{award.org}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements stats */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 text-center sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { value: 12000, suffix: "+", label: "Members Transformed" },
            { value: 85, suffix: "", label: "Certified Trainers" },
            { value: 3, suffix: "", label: "Branches" },
            { value: 97, suffix: "%", label: "Renewal Rate" },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <p className="font-display text-foreground text-4xl font-bold sm:text-6xl">
                <span className="text-gradient-red">
                  <Counter to={stat.value} suffix={stat.suffix} />
                </span>
              </p>
              <p className="text-muted-foreground mt-2 text-sm tracking-widest uppercase">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-3">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.1}>
                <div className="group border-border bg-surface/60 h-full rounded-2xl border p-8 backdrop-blur-xl transition-all duration-500 hover:border-white/15">
                  <div className="border-border bg-surface-2 mb-5 flex h-12 w-12 items-center justify-center rounded-xl border transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    <value.icon className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="font-display text-foreground text-lg font-semibold tracking-wide uppercase">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
