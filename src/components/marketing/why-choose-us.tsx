"use client";

import * as React from "react";
import Link from "next/link";
import { Brain, HeartPulse, Target, Timer, Users, ShieldCheck } from "lucide-react";
import { AnimeText } from "@/components/ui/anime-text";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

const FEATURES = [
  {
    icon: Brain,
    title: "AI-powered coaching",
    description:
      "Workouts and meal plans generated in seconds, tuned to your body, goals, and equipment.",
  },
  {
    icon: Target,
    title: "Personalized plans",
    description:
      "From fat loss to powerlifting — every plan adapts as you progress. No generic templates.",
  },
  {
    icon: Timer,
    title: "Real-time tracking",
    description:
      "Log workouts, water, calories, and body metrics with instant progress visualization.",
  },
  {
    icon: Users,
    title: "Elite trainers",
    description: "Certified coaches with real results. Book 1-on-1 sessions right from the app.",
  },
  {
    icon: HeartPulse,
    title: "Health analytics",
    description:
      "BMI, body fat, muscle mass, and calorie trends — charts that keep you honest.",
  },
  {
    icon: ShieldCheck,
    title: "Member-first",
    description: "Flexible memberships, QR check-ins, and a community that holds you accountable.",
  },
];

function FeatureRow({ feature, index }: { feature: (typeof FEATURES)[number]; index: number }) {
  const ref = React.useRef<HTMLLIElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      gsap.fromTo(
        el,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: (index % 3) * 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        }
      );
      ScrollTrigger.create({
        trigger: el,
        start: "top 74%",
        end: "bottom 42%",
        toggleClass: { targets: el, className: "is-active" },
      });
    },
    { scope: ref }
  );

  return (
    <li
      ref={ref}
      className={`feature-row border-border flex gap-5 py-6 will-change-transform ${
        index < FEATURES.length - 1 ? "border-b" : ""
      }`}
    >
      <div className="feature-icon bg-surface-2 border-border mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300">
        <feature.icon className="text-primary h-5 w-5" />
      </div>
      <div>
        <h3 className="feature-title text-foreground text-base font-semibold transition-colors duration-300">
          {feature.title}
        </h3>
        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>
    </li>
  );
}

export function WhyChooseUs() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <h2 className="font-display text-foreground text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
                <AnimeText text="Everything you need to get results" effect="rise" scroll />
              </h2>
              <p className="text-muted-foreground mt-5 leading-relaxed">
                Titan combines elite coaching with AI that actually learns from your training. The
                more you log, the smarter your plan gets.
              </p>
              <Link
                href="/about"
                className="text-primary hover:text-primary-light mt-8 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
              >
                Learn more about Titan
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ul>
              {FEATURES.map((feature, i) => (
                <FeatureRow key={feature.title} feature={feature} index={i} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
