import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Button } from "@/components/ui/button";
import { GsapReveal, MaskReveal } from "@/components/ui/gsap-reveal";
import { cn } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Pricing",
  description:
    "Flexible Titan Fitness memberships — Essential, Pro, and Elite. No contracts, cancel anytime, first month 50% off.",
  path: "/pricing",
});

const PLANS = [
  {
    slug: "essential",
    name: "Essential",
    price: 29,
    period: "/month",
    tagline: "Everything you need to start strong.",
    cta: "Start Essential",
    features: [
      "Gym floor access",
      "8 group classes / month",
      "Basic workout tracking",
      "BMI calculator",
      "Community access",
      "Locker room access",
    ],
    popular: false,
  },
  {
    slug: "pro",
    name: "Pro",
    price: 59,
    period: "/month",
    tagline: "For those serious about transformation.",
    cta: "Get Pro",
    features: [
      "Unlimited gym & classes",
      "AI workout generator",
      "AI nutritionist + meal plans",
      "Advanced progress analytics",
      "QR check-in & attendance",
      "Priority support",
      "All Titan branches",
    ],
    popular: true,
  },
  {
    slug: "elite",
    name: "Elite",
    price: 99,
    period: "/month",
    tagline: "The complete performance package.",
    cta: "Go Elite",
    features: [
      "Everything in Pro",
      "4 personal training sessions / month",
      "AI fitness chatbot (unlimited)",
      "Recovery & physio sessions",
      "Free Titan gear pack",
      "Dedicated success coach",
      "Guest passes (2 / month)",
    ],
    popular: false,
  },
];

const COMPARE = [
  { feature: "Gym access", essential: true, pro: true, elite: true },
  { feature: "Group classes", essential: "8/mo", pro: "Unlimited", elite: "Unlimited" },
  { feature: "AI workout generator", essential: false, pro: true, elite: true },
  { feature: "AI nutritionist", essential: false, pro: true, elite: true },
  { feature: "AI fitness chatbot", essential: false, pro: "Limited", elite: "Unlimited" },
  { feature: "Personal training", essential: false, pro: false, elite: "4/mo" },
  { feature: "QR check-in & streaks", essential: true, pro: true, elite: true },
  { feature: "Progress analytics", essential: false, pro: true, elite: true },
  { feature: "Priority support", essential: false, pro: true, elite: true },
  { feature: "Recovery sessions", essential: false, pro: false, elite: true },
  { feature: "All branches", essential: false, pro: true, elite: true },
  { feature: "Success coach", essential: false, pro: false, elite: true },
];

export default function PricingPage() {
  return (
    <>
      <PageHeader
        badge="Membership"
        title="Simple, Honest"
        highlight="Pricing"
        description="No hidden fees. No contracts. Cancel anytime. First month 50% off for new members."
      />

      <section className="pb-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {PLANS.map((plan, i) => (
            <GsapReveal key={plan.slug} delay={i * 0.1}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-8 transition-colors duration-300",
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
                <h2 className="font-display text-foreground text-xl font-bold tracking-[-0.01em]">
                  {plan.name}
                </h2>
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
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </GsapReveal>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-foreground text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
              <MaskReveal as="span">Compare plans</MaskReveal>
            </h2>
          </div>
          <GsapReveal delay={0.1}>
            <div className="border-border bg-surface/60 mt-10 overflow-x-auto rounded-2xl border">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-border border-b">
                    <th className="text-muted-foreground px-6 py-4 font-medium">Feature</th>
                    <th className="text-foreground px-6 py-4 text-center font-semibold">
                      Essential
                    </th>
                    <th className="text-primary px-6 py-4 text-center font-semibold">Pro</th>
                    <th className="text-accent px-6 py-4 text-center font-semibold">Elite</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((row) => (
                    <tr
                      key={row.feature}
                      className="border-border/50 border-b transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="text-muted-foreground px-6 py-3.5">{row.feature}</td>
                      <td className="px-6 py-3.5 text-center">
                        {row.essential === true ? (
                          <Check className="text-success mx-auto h-4 w-4" />
                        ) : row.essential === false ? (
                          <span className="text-surface-2">—</span>
                        ) : (
                          <span className="text-muted-foreground">{row.essential}</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        {row.pro === true ? (
                          <Check className="text-success mx-auto h-4 w-4" />
                        ) : row.pro === false ? (
                          <span className="text-surface-2">—</span>
                        ) : (
                          <span className="text-primary">{row.pro}</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        {row.elite === true ? (
                          <Check className="text-success mx-auto h-4 w-4" />
                        ) : row.elite === false ? (
                          <span className="text-surface-2">—</span>
                        ) : (
                          <span className="text-accent">{row.elite}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GsapReveal>
        </div>
      </section>
    </>
  );
}
