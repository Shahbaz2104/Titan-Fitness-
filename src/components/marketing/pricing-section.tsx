"use client";

import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    slug: "essential",
    name: "Essential",
    price: 29,
    period: "/month",
    tagline: "Everything you need to start strong.",
    features: [
      "Gym floor access",
      "8 group classes / month",
      "Basic workout tracking",
      "BMI calculator",
      "Community access",
    ],
    popular: false,
  },
  {
    slug: "pro",
    name: "Pro",
    price: 59,
    period: "/month",
    tagline: "For those serious about transformation.",
    features: [
      "Unlimited gym & classes",
      "AI workout generator",
      "AI nutritionist + meal plans",
      "Advanced progress analytics",
      "QR check-in & attendance",
      "Priority support",
    ],
    popular: true,
  },
  {
    slug: "elite",
    name: "Elite",
    price: 99,
    period: "/month",
    tagline: "The complete performance package.",
    features: [
      "Everything in Pro",
      "4 personal training sessions / month",
      "AI fitness chatbot (unlimited)",
      "Recovery & physio sessions",
      "Free Titan gear pack",
      "Dedicated success coach",
    ],
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="accent" className="mb-4">
            Membership
          </Badge>
          <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground sm:text-5xl">
            Invest In <span className="text-gradient">Yourself</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            No hidden fees. No contracts. Cancel anytime.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.slug} delay={i * 0.1}>
              <TiltCard maxTilt={5} className="h-full">
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-2xl border p-8 backdrop-blur-xl transition-all duration-500",
                    plan.popular
                      ? "border-primary/40 bg-gradient-to-b from-primary/10 to-surface/60 shadow-glow"
                      : "border-border bg-surface/60 hover:border-white/15"
                  )}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="default">
                      <Sparkles className="h-3 w-3" /> Most Popular
                    </Badge>
                  )}
                  <h3 className="font-display text-xl font-bold uppercase tracking-widest text-foreground">
                    {plan.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{plan.tagline}</p>
                  <div className="mt-6 flex items-end gap-1">
                    <span
                      className={cn(
                        "font-display text-5xl font-bold",
                        plan.popular ? "text-gradient" : "text-foreground"
                      )}
                    >
                      ${plan.price}
                    </span>
                    <span className="pb-1.5 text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="mt-7 flex-1 space-y-3.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span
                          className={cn(
                            "mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full",
                            plan.popular ? "bg-primary/20" : "bg-success/15"
                          )}
                        >
                          <Check
                            className={cn(
                              "h-3 w-3",
                              plan.popular ? "text-primary" : "text-success"
                            )}
                          />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={plan.popular ? "default" : "outline"}
                    className="group mt-8 w-full"
                    size="lg"
                  >
                    <Link href="/register">
                      Get {plan.name}
                      <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
