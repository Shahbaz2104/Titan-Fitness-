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
  const { data: plans } = useApiQuery<Plan[]>([...QUERY_KEYS.membership, "plans"], "/api/payments/plans");

  const [activating, setActivating] = React.useState<string | null>(null);

  const activate = async (planId: string) => {
    setActivating(planId);
    try {
      await apiPost("/api/payments/activate", { planId });
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

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Membership"
        description="Your plan, perks, and billing"
        icon={<Crown className="h-5 w-5" />}
      />

      {/* Current membership */}
      {membership ? (
        <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-surface to-surface p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Crown className="h-7 w-7" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-xl font-bold uppercase tracking-wide text-foreground">
                    {membership.plan.name}
                  </h3>
                  <Badge variant={membership.status === "ACTIVE" ? "success" : "warning"}>
                    {membership.status}
                  </Badge>
                  {membership.autoRenew && <Badge variant="accent">Auto-renew</Badge>}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {membership.endDate
                    ? `Renews ${new Date(membership.endDate).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}`
                    : "No expiry"}
                  {membership.daysLeft !== null && membership.daysLeft <= 30 && (
                    <span className="ml-2 font-semibold text-warning">{membership.daysLeft} days left</span>
                  )}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-bold text-foreground">
                ${Number(membership.plan.price).toFixed(2)}
                <span className="text-sm font-normal text-muted-foreground">
                  /{membership.plan.billingCycle.toLowerCase()}
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {membership.plan.description ?? "Titan Fitness membership"}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="flex flex-col items-center gap-3 p-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-muted-foreground">
            <Crown className="h-7 w-7" />
          </span>
          <p className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
            No active membership
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
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
            <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
              {plan.name}
            </h3>
            <p className="mt-1 min-h-10 text-sm text-muted-foreground">{plan.description}</p>
            <p className="mt-3 font-display text-3xl font-bold text-foreground">
              ${Number(plan.price).toFixed(2)}
              <span className="text-sm font-normal text-muted-foreground">
                /{plan.billingCycle.toLowerCase()}
              </span>
            </p>
            <ul className="mt-4 space-y-2">
              {planFeatures(plan).map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BadgeCheck className="h-4 w-4 shrink-0 text-success" />
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
