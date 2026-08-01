"use client";

import { motion } from "framer-motion";
import { Crown, Medal, Trophy, Users } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiQuery } from "@/lib/api-client";
import { QUERY_KEYS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  points: number;
  user: { id: string; name: string; image: string | null };
}

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  myRank: { rank: number; points: number };
}

const PODIUM_STYLES = [
  "border-warning/40 bg-warning/10 text-warning",
  "border-border bg-surface-2 text-muted-foreground",
  "border-accent/40 bg-accent/10 text-accent",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function LeaderboardDashboard() {
  const { data, isLoading } = useApiQuery<LeaderboardResponse>(QUERY_KEYS.leaderboard, "/api/me/leaderboard", {
    limit: 50,
  });

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Leaderboard"
        description="Where you stand against the Titan community"
        icon={<Trophy className="h-5 w-5" />}
      />

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      ) : !data || data.leaderboard.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 p-14 text-center">
          <Users className="h-10 w-10 text-muted-foreground" />
          <p className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
            No rankings yet
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Earn points by completing workouts, checking in, and joining challenges.
          </p>
        </Card>
      ) : (
        <>
          {/* My rank banner */}
          <div className="flex items-center justify-between rounded-2xl border border-primary/25 bg-primary/5 px-6 py-4">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-warning" />
              <p className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
                Your rank
              </p>
            </div>
            <p className="font-display text-xl font-bold text-foreground">
              #{data.myRank.rank}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                · {data.myRank.points} pts
              </span>
            </p>
          </div>

          {/* Podium */}
          <div className="grid gap-3 sm:grid-cols-3">
            {data.leaderboard.slice(0, 3).map((entry, i) => (
              <motion.div
                key={entry.user.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  "relative flex items-center gap-4 rounded-2xl border p-5",
                  PODIUM_STYLES[i],
                  i === 0 && "shadow-card"
                )}
              >
                <span className="font-display text-3xl font-bold">#{i + 1}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{entry.user.name}</p>
                  <p className="text-xs text-muted-foreground">{entry.points} points</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Full list */}
          <Card className="overflow-hidden">
            <div className="divide-y divide-border">
              {data.leaderboard.map((entry, i) => (
                <motion.div
                  key={entry.user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.02, 0.8) }}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "w-8 text-center font-display text-sm font-bold",
                        i < 3 ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {i + 1}
                    </span>
                    {entry.user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={entry.user.image}
                        alt={entry.user.name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 font-display text-xs font-bold text-muted-foreground">
                        {initials(entry.user.name)}
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{entry.user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {i === 0 && <Medal className="h-4 w-4 text-warning" />}
                    <span className="text-sm font-semibold text-muted-foreground">{entry.points} pts</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
