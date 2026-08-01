"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Copy, Gift, Share2, Users } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiQuery } from "@/lib/api-client";
import { APP_URL, QUERY_KEYS, REFERRAL_REWARD } from "@/lib/constants";

interface Referral {
  id: string;
  referredUser: { id: string; name: string; image: string | null; createdAt: string };
}

interface ReferralInfo {
  referralCode: string | null;
  referrals: Referral[];
  points: number;
  rewardPerReferral: number;
}

export function ReferralsDashboard() {
  const { data, isLoading } = useApiQuery<ReferralInfo>(
    QUERY_KEYS.referrals,
    "/api/payments/referrals"
  );
  const [copied, setCopied] = React.useState(false);

  const referralLink = data?.referralCode ? `${APP_URL}/register?ref=${data.referralCode}` : null;

  const copy = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
    } catch {
      // clipboard unavailable — still show feedback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Referrals"
        description={`Earn ${REFERRAL_REWARD} points per friend who joins`}
        icon={<Gift className="h-5 w-5" />}
      />

      {referralLink ? (
        <>
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-foreground text-lg font-bold tracking-wide uppercase">
                  Share your code
                </h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  Friends who sign up with your code earn you{" "}
                  {data?.rewardPerReferral ?? REFERRAL_REWARD} points each.
                </p>
              </div>
              <div className="border-primary/30 bg-primary/5 flex items-center gap-3 rounded-2xl border px-5 py-3">
                <span className="font-display text-primary text-lg font-bold tracking-widest">
                  {data?.referralCode}
                </span>
                <Button variant="outline" size="sm" onClick={copy}>
                  {copied ? (
                    <Share2 className="text-success h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "Copied!" : "Copy link"}
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-5">
                <p className="text-muted-foreground text-xs tracking-widest uppercase">
                  Friends invited
                </p>
                <p className="font-display text-foreground mt-2 text-3xl font-bold">
                  {(data?.referrals ?? []).length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-muted-foreground text-xs tracking-widest uppercase">
                  Points earned
                </p>
                <p className="font-display text-foreground mt-2 text-3xl font-bold">
                  {data?.points ?? 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-muted-foreground text-xs tracking-widest uppercase">
                  Reward per friend
                </p>
                <p className="font-display text-foreground mt-2 text-3xl font-bold">
                  {data?.rewardPerReferral ?? REFERRAL_REWARD}{" "}
                  <span className="text-muted-foreground text-sm font-normal">pts</span>
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-5">
              <h3 className="font-display text-foreground text-sm font-bold tracking-widest uppercase">
                Your referrals
              </h3>
              {!data || data.referrals.length === 0 ? (
                <p className="border-border text-muted-foreground mt-4 rounded-2xl border border-dashed py-10 text-center text-sm">
                  No friends joined yet. Share your link to start earning!
                </p>
              ) : (
                <div className="mt-4 space-y-2">
                  {data.referrals.map((ref, i) => (
                    <motion.div
                      key={ref.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.5) }}
                      className="border-border bg-surface flex items-center justify-between rounded-xl border px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="bg-success/15 text-success flex h-9 w-9 items-center justify-center rounded-full">
                          <Users className="h-4 w-4" />
                        </span>
                        <p className="text-foreground text-sm font-medium">
                          {ref.referredUser.name}
                        </p>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Joined{" "}
                        {new Date(ref.referredUser.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        · +{data.rewardPerReferral} pts
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="flex flex-col items-center gap-3 p-12 text-center">
          <Gift className="text-muted-foreground h-10 w-10" />
          <p className="font-display text-foreground text-lg font-bold tracking-wide uppercase">
            No referral code yet
          </p>
          <p className="text-muted-foreground max-w-sm text-sm">
            Contact support to get your personal referral code.
          </p>
        </Card>
      )}
    </div>
  );
}
