"use client";

import { Counter } from "@/components/ui/counter";
import { Reveal } from "@/components/ui/reveal";

const STATS = [
  { value: 12000, suffix: "+", label: "Active Members", decimals: 0 },
  { value: 85, suffix: "", label: "Expert Trainers", decimals: 0 },
  { value: 240, suffix: "+", label: "Classes Weekly", decimals: 0 },
  { value: 98, suffix: "%", label: "Member Satisfaction", decimals: 0 },
];

export function StatsBar() {
  return (
    <section className="relative border-y border-border bg-surface/40 py-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.1} className="text-center">
            <p className="font-display text-4xl font-bold text-foreground sm:text-5xl">
              <span className="text-gradient-red">
                <Counter to={stat.value} suffix={stat.suffix} />
              </span>
            </p>
            <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
