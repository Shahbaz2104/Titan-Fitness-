"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Plus, Trophy, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { QUERY_KEYS } from "@/lib/constants";
import { useApiQuery, useApiMutation } from "@/lib/api-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface Challenge {
  id: string;
  title: string;
  description: string | null;
  goalType: string;
  goalValue: number;
  startDate: string;
  endDate: string;
  rewardDescription: string | null;
  isActive: boolean;
  _count: { participants: number };
}

interface ChallengeForm {
  title: string;
  description: string;
  goalType: string;
  goalValue: string;
  startDate: string;
  endDate: string;
  rewardDescription: string;
}

const EMPTY_FORM: ChallengeForm = {
  title: "",
  description: "",
  goalType: "WORKOUTS",
  goalValue: "",
  startDate: "",
  endDate: "",
  rewardDescription: "",
};

const GOAL_TYPES = ["WORKOUTS", "CALORIES", "STEPS", "WATER", "ATTENDANCE", "STREAK_DAYS"];

function formatGoalType(goal: string) {
  return goal
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ChallengesAdmin() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [form, setForm] = React.useState<ChallengeForm>(EMPTY_FORM);
  const [saving, setSaving] = React.useState(false);

  const {
    data: challenges,
    isLoading,
    isError,
  } = useApiQuery<Challenge[]>(QUERY_KEYS.adminChallenges, "/api/admin/challenges");
  const createChallenge = useApiMutation("/api/admin/challenges");

  const refresh = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminChallenges });

  const handleCreate = async () => {
    if (!form.title.trim() || !form.goalValue || !form.startDate || !form.endDate) {
      toast.error("Title, goal value, and dates are required");
      return;
    }
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      toast.error("End date must be after start date");
      return;
    }
    setSaving(true);
    try {
      await createChallenge({
        title: form.title.trim(),
        description: form.description.trim() || null,
        goalType: form.goalType,
        goalValue: Number(form.goalValue),
        startDate: new Date(form.startDate),
        endDate: new Date(form.endDate),
        rewardDescription: form.rewardDescription.trim() || null,
      });
      toast.success("Challenge created");
      setDialogOpen(false);
      setForm(EMPTY_FORM);
      await refresh();
    } catch {
      toast.error("Failed to create challenge");
    } finally {
      setSaving(false);
    }
  };

  const [now] = React.useState(() => Date.now());

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Challenges"
        description="Create member challenges and track participation"
        icon={<Trophy className="h-5 w-5" />}
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New challenge
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : isError || !challenges ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <AlertTriangle className="text-warning h-8 w-8" />
            <p className="text-muted-foreground text-sm">Could not load challenges.</p>
          </CardContent>
        </Card>
      ) : challenges.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <Trophy className="text-muted-foreground h-8 w-8" />
            <p className="text-muted-foreground text-sm">
              No challenges yet. Launch one to boost engagement.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {challenges.map((challenge, i) => {
            const started = new Date(challenge.startDate).getTime() <= now;
            const ended = new Date(challenge.endDate).getTime() < now;
            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-border bg-surface/60 hover:border-primary/30 hover:shadow-glow rounded-2xl border p-6 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-foreground text-lg font-bold tracking-wide uppercase">
                    {challenge.title}
                  </h3>
                  <Badge variant={ended ? "outline" : started ? "success" : "warning"}>
                    {ended ? "Ended" : started ? "Live" : "Upcoming"}
                  </Badge>
                </div>

                <p className="text-muted-foreground mt-3 line-clamp-2 text-sm">
                  {challenge.description ?? "No description"}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline">{formatGoalType(challenge.goalType)}</Badge>
                  <Badge variant="outline">Goal: {challenge.goalValue}</Badge>
                  <Badge variant="outline">
                    <Users className="mr-1 h-3 w-3" />
                    {challenge._count.participants} joined
                  </Badge>
                </div>

                <div className="border-border mt-4 flex items-center justify-between border-t pt-3">
                  <p className="text-muted-foreground text-xs">
                    {formatDate(challenge.startDate)} → {formatDate(challenge.endDate)}
                  </p>
                  {challenge.rewardDescription && (
                    <Badge variant="secondary">🎁 {challenge.rewardDescription}</Badge>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New challenge</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="30-Day Shred"
              />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                placeholder="What members need to do"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Goal type</Label>
                <Select
                  value={form.goalType}
                  onValueChange={(v) => setForm({ ...form, goalType: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GOAL_TYPES.map((g) => (
                      <SelectItem key={g} value={g}>
                        {formatGoalType(g)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Goal value</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.goalValue}
                  onChange={(e) => setForm({ ...form, goalValue: e.target.value })}
                  placeholder="30"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Start date</Label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End date</Label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reward (optional)</Label>
              <Input
                value={form.rewardDescription}
                onChange={(e) => setForm({ ...form, rewardDescription: e.target.value })}
                placeholder="Free protein shake + 500 points"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving ? "Creating…" : "Create challenge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
