"use client";

import { GsapReveal } from "@/components/ui/gsap-reveal";
import { CountUp } from "@/components/ui/count-up";

const STATS = [
  { to: 12000, suffix: "+", label: "Active members" },
  { to: 85, suffix: "", label: "Expert trainers" },
  { to: 240, suffix: "+", label: "Classes every week" },
  { to: 98, suffix: "%", label: "Member satisfaction" },
];

export function StatsBar() {
  return (
    <section className="border-border bg-surface/30 border-y">
      <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <GsapReveal
            key={stat.label}
            delay={i * 0.08}
            className="flex flex-col items-center gap-1 border-border px-4 py-10 border-b odd:border-r sm:py-12 lg:border-b-0 lg:odd:border-r-0 lg:[&:not(:first-child)]:border-l"
          >
            <p className="font-display text-foreground text-4xl font-bold tracking-[-0.02em] sm:text-5xl">
              <CountUp to={stat.to} suffix={stat.suffix} />
            </p>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
          </GsapReveal>
        ))}
      </div>
    </section>
  );
}
