import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GsapReveal } from "@/components/ui/gsap-reveal";
import { AnimeText } from "@/components/ui/anime-text";
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
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-foreground text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            <AnimeText text="Membership, minus the fine print" effect="blur" scroll />
          </h2>
          <p className="text-muted-foreground mt-4">No hidden fees. No contracts. Cancel anytime.</p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <GsapReveal key={plan.slug} delay={i * 0.1}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1",
                  plan.popular
                    ? "border-primary/50 bg-surface"
                    : "border-border bg-surface/60 hover:border-white/15"
                )}
              >
                {plan.popular && (
                  <span className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-medium">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-foreground text-xl font-bold tracking-[-0.01em]">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground mt-1.5 text-sm">{plan.tagline}</p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="font-display text-foreground text-5xl font-bold">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground pb-1.5 text-sm">{plan.period}</span>
                </div>
                <ul className="mt-7 flex-1 space-y-3.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-muted-foreground flex items-start gap-3 text-sm"
                    >
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
                  className="mt-8 w-full"
                  size="lg"
                >
                  <Link href="/register">
                    Get {plan.name}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </GsapReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
