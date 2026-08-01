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
  const { data, isLoading } = useApiQuery<ReferralInfo>(QUERY_KEYS.referrals, "/api/payments/referrals");
  const [copied, setCopied] = React.useState(false);

  const referralLink = data?.referralCode
    ? `${APP_URL}/register?ref=${data.referralCode}`
    : null;

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
                <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
                  Share your code
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Friends who sign up with your code earn you {data?.rewardPerReferral ?? REFERRAL_REWARD} points each.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-5 py-3">
                <span className="font-display text-lg font-bold tracking-widest text-primary">
                  {data?.referralCode}
                </span>
                <Button variant="outline" size="sm" onClick={copy}>
                  {copied ? <Share2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy link"}
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Friends invited</p>
                <p className="mt-2 font-display text-3xl font-bold text-foreground">
                  {(data?.referrals ?? []).length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Points earned</p>
                <p className="mt-2 font-display text-3xl font-bold text-foreground">{data?.points ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Reward per friend</p>
                <p className="mt-2 font-display text-3xl font-bold text-foreground">
                  {data?.rewardPerReferral ?? REFERRAL_REWARD} <span className="text-sm font-normal text-muted-foreground">pts</span>
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-5">
              <h3 className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
                Your referrals
              </h3>
              {!data || data.referrals.length === 0 ? (
                <p className="mt-4 rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
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
                      className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-success/15 text-success">
                          <Users className="h-4 w-4" />
                        </span>
                        <p className="text-sm font-medium text-foreground">{ref.referredUser.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
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
          <Gift className="h-10 w-10 text-muted-foreground" />
          <p className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
            No referral code yet
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Contact support to get your personal referral code.
          </p>
        </Card>
      )}
    </div>
  );
}
