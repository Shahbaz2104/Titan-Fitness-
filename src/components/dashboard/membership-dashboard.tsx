"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BadgeCheck, Crown, Zap } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiPost, useApiQuery } from "@/lib/api-client";
import { QUERY_KEYS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  billingCycle: string;
  durationDays: number;
  features: string[] | Record<string, unknown>;
  isPopular: boolean;
}

interface Membership {
  id: string;
  planId: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  autoRenew: boolean;
  daysLeft: number | null;
  plan: Plan;
}

export function MembershipDashboard() {
  const queryClient = useQueryClient();
  const { data: membership, isLoading } = useApiQuery<Membership | null>(
    [...QUERY_KEYS.membership, "current"],
    "/api/payments/membership"
  );
  const { data: plans } = useApiQuery<Plan[]>(
    [...QUERY_KEYS.membership, "plans"],
    "/api/payments/plans"
  );

  const [activating, setActivating] = React.useState<string | null>(null);

  const activate = async (planId: string) => {
    setActivating(planId);
    try {
      const result = await apiPost<{
        mode?: "stripe" | "mock";
        url?: string | null;
        membership?: Membership;
      }>("/api/payments/checkout", { planId });
      if (result.mode === "stripe" && result.url) {
        window.location.href = result.url;
        return;
      }
    } finally {
      setActivating(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.membership });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    );
  }

  const planFeatures = (plan: Plan): string[] =>
    Array.isArray(plan.features) ? plan.features.map(String) : [];

  const checkoutResult =
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("checkout");

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Membership"
        description="Your plan, perks, and billing"
        icon={<Crown className="h-5 w-5" />}
      />

      {checkoutResult === "success" && (
        <Card className="border-success/40 bg-success/10 p-4">
          <p className="text-success flex items-center gap-2 text-sm font-semibold">
            <BadgeCheck className="h-4 w-4" />
            Payment successful — your membership is active!
          </p>
        </Card>
      )}
      {checkoutResult === "cancelled" && (
        <Card className="border-warning/40 bg-warning/10 p-4">
          <p className="text-warning text-sm font-semibold">
            Checkout cancelled — no charge was made. Pick a plan whenever you&apos;re ready.
          </p>
        </Card>
      )}

      {/* Current membership */}
      {membership ? (
        <Card className="border-primary/30 from-primary/10 via-surface to-surface relative overflow-hidden bg-gradient-to-br p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="bg-primary text-primary-foreground flex h-14 w-14 items-center justify-center rounded-2xl">
                <Crown className="h-7 w-7" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-foreground text-xl font-bold tracking-wide uppercase">
                    {membership.plan.name}
                  </h3>
                  <Badge variant={membership.status === "ACTIVE" ? "success" : "warning"}>
                    {membership.status}
                  </Badge>
                  {membership.autoRenew && <Badge variant="accent">Auto-renew</Badge>}
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {membership.endDate
                    ? `Renews ${new Date(membership.endDate).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}`
                    : "No expiry"}
                  {membership.daysLeft !== null && membership.daysLeft <= 30 && (
                    <span className="text-warning ml-2 font-semibold">
                      {membership.daysLeft} days left
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display text-foreground text-2xl font-bold">
                ${Number(membership.plan.price).toFixed(2)}
                <span className="text-muted-foreground text-sm font-normal">
                  /{membership.plan.billingCycle.toLowerCase()}
                </span>
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {membership.plan.description ?? "Titan Fitness membership"}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="flex flex-col items-center gap-3 p-10 text-center">
          <span className="bg-surface-2 text-muted-foreground flex h-14 w-14 items-center justify-center rounded-2xl">
            <Crown className="h-7 w-7" />
          </span>
          <p className="font-display text-foreground text-lg font-bold tracking-wide uppercase">
            No active membership
          </p>
          <p className="text-muted-foreground max-w-sm text-sm">
            Pick a plan below to unlock full access to classes, programs, and AI coaching.
          </p>
        </Card>
      )}

      {/* Plans */}
      <div className="grid gap-4 md:grid-cols-3">
        {(plans ?? []).map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.08, 0.5) }}
            className={cn(
              "relative rounded-2xl border p-6 transition-all duration-300",
              plan.isPopular
                ? "border-primary/50 bg-primary/5 shadow-card"
                : "border-border bg-surface hover:border-primary/30"
            )}
          >
            {plan.isPopular && (
              <Badge variant="default" className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                <Zap className="h-3 w-3" /> Most popular
              </Badge>
            )}
            <h3 className="font-display text-foreground text-lg font-bold tracking-wide uppercase">
              {plan.name}
            </h3>
            <p className="text-muted-foreground mt-1 min-h-10 text-sm">{plan.description}</p>
            <p className="font-display text-foreground mt-3 text-3xl font-bold">
              ${Number(plan.price).toFixed(2)}
              <span className="text-muted-foreground text-sm font-normal">
                /{plan.billingCycle.toLowerCase()}
              </span>
            </p>
            <ul className="mt-4 space-y-2">
              {planFeatures(plan).map((feature) => (
                <li key={feature} className="text-muted-foreground flex items-center gap-2 text-sm">
                  <BadgeCheck className="text-success h-4 w-4 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className="mt-6 w-full"
              variant={plan.isPopular ? "default" : "outline"}
              onClick={() => activate(plan.id)}
              disabled={activating === plan.id || membership?.planId === plan.id}
            >
              {activating === plan.id
                ? "Activating…"
                : membership?.planId === plan.id
                  ? "Current plan"
                  : "Choose plan"}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
