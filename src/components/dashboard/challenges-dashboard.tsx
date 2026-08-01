"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Flag, Medal, Rocket, Swords } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { apiPost, useApiQuery } from "@/lib/api-client";
import { QUERY_KEYS } from "@/lib/constants";

interface Challenge {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  goalType: string;
  goalValue: number;
  badgeImage: string | null;
  isActive: boolean;
}

interface MyChallenge {
  id: string;
  progress: number;
  completedAt: string | null;
  challenge: Challenge;
}

interface ChallengesResponse {
  active: Challenge[];
  mine: MyChallenge[];
}

const GOAL_EMOJI: Record<string, string> = {
  WORKOUTS: "💪",
  ATTENDANCE: "📅",
  WATER: "💧",
  CALORIES: "🍎",
  STREAK: "🔥",
  POINTS: "⭐",
};

export function ChallengesDashboard() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useApiQuery<ChallengesResponse>(
    QUERY_KEYS.challenges,
    "/api/me/challenges"
  );
  const [joining, setJoining] = React.useState<string | null>(null);

  const joinedIds = new Set((data?.mine ?? []).map((m) => m.challenge.id));

  const join = async (challengeId: string) => {
    setJoining(challengeId);
    try {
      await apiPost(`/api/me/challenges/${challengeId}/join`);
    } finally {
      setJoining(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.challenges });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      </div>
    );
  }

  const active = data?.active ?? [];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Challenges"
        description="Join challenges, hit goals, earn rewards"
        icon={<Swords className="h-5 w-5" />}
      />

      {/* My challenges */}
      {data && data.mine.length > 0 && (
        <div>
          <h3 className="font-display text-foreground mb-3 text-sm font-bold tracking-widest uppercase">
            My challenges
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.mine.map((mine, i) => (
              <motion.div
                key={mine.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-primary/25 bg-primary/5 rounded-2xl border p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display text-foreground text-base font-bold tracking-wide uppercase">
                    {GOAL_EMOJI[mine.challenge.goalType] ?? "🏆"} {mine.challenge.title}
                  </p>
                  {mine.completedAt ? (
                    <Badge variant="success">Completed</Badge>
                  ) : (
                    <Badge variant="accent">In progress</Badge>
                  )}
                </div>
                <p className="text-muted-foreground mt-2 text-sm">{mine.challenge.description}</p>
                <div className="mt-4">
                  <div className="text-muted-foreground flex justify-between text-xs">
                    <span>Progress</span>
                    <span>
                      {mine.progress}/{mine.challenge.goalValue}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(100, (mine.progress / mine.challenge.goalValue) * 100)}
                    className="mt-2"
                  />
                </div>
                <p className="text-muted-foreground mt-3 text-xs">
                  Ends{" "}
                  {new Date(mine.challenge.endDate).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Active challenges */}
      <div>
        <h3 className="font-display text-foreground mb-3 text-sm font-bold tracking-widest uppercase">
          Open challenges
        </h3>
        {active.length === 0 ? (
          <Card className="flex flex-col items-center gap-3 p-12 text-center">
            <Flag className="text-muted-foreground h-10 w-10" />
            <p className="font-display text-foreground text-lg font-bold tracking-wide uppercase">
              No open challenges
            </p>
            <p className="text-muted-foreground max-w-sm text-sm">
              New challenges drop regularly. Check back soon!
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {active.map((challenge, i) => {
              const isJoined = joinedIds.has(challenge.id);
              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.6) }}
                  className="border-border bg-surface hover:border-primary/30 flex flex-col rounded-2xl border p-5 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-display text-foreground text-base font-bold tracking-wide uppercase">
                      {GOAL_EMOJI[challenge.goalType] ?? "🏆"} {challenge.title}
                    </p>
                    <Badge variant="secondary">{challenge.goalType}</Badge>
                  </div>
                  <p className="text-muted-foreground mt-2 flex-1 text-sm">
                    {challenge.description}
                  </p>
                  <div className="text-muted-foreground mt-4 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <Medal className="h-3.5 w-3.5" />
                      Goal: {challenge.goalValue} {challenge.goalType.toLowerCase()}
                    </span>
                    <span>
                      {new Date(challenge.startDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                      {" – "}
                      {new Date(challenge.endDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <Button
                    className="mt-4 w-full"
                    variant={isJoined ? "outline" : "default"}
                    onClick={() => join(challenge.id)}
                    disabled={isJoined || joining === challenge.id}
                  >
                    {isJoined ? (
                      <>
                        <Rocket className="h-4 w-4" /> Joined
                      </>
                    ) : joining === challenge.id ? (
                      "Joining…"
                    ) : (
                      "Join challenge"
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
