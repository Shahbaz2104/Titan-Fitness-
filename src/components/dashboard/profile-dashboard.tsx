"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Award, Dumbbell, Save, Target } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { apiPatch, useApiQuery } from "@/lib/api-client";
import { EXPERIENCE_LEVELS, FITNESS_GOALS, QUERY_KEYS } from "@/lib/constants";

interface Profile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  phone: string | null;
  fitnessGoal: string | null;
  heightCm: number | null;
  weightKg: number | null;
  experience: string | null;
  referralCode: string | null;
  branch: { id: string; name: string; city: string } | null;
  createdAt: string;
}

interface Badge {
  id: string;
  badge: { id: string; name: string; description: string | null; icon: string | null };
}

interface PointsInfo {
  rank: number;
  points: number;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ProfileForm({ profile }: { profile: Profile }) {
  const queryClient = useQueryClient();
  const [name, setName] = React.useState(profile.name);
  const [phone, setPhone] = React.useState(profile.phone ?? "");
  const [fitnessGoal, setFitnessGoal] = React.useState<string | null>(profile.fitnessGoal);
  const [experience, setExperience] = React.useState<string | null>(profile.experience);
  const [heightCm, setHeightCm] = React.useState(profile.heightCm ? String(profile.heightCm) : "");
  const [weightKg, setWeightKg] = React.useState(profile.weightKg ? String(profile.weightKg) : "");
  const [saving, setSaving] = React.useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await apiPatch("/api/me/profile", {
        name,
        phone: phone || null,
        fitnessGoal,
        experience,
        heightCm: heightCm ? Number(heightCm) : null,
        weightKg: weightKg ? Number(weightKg) : null,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          Full name
        </label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Phone
          </label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 000 0000"
          />
        </div>
        <div className="space-y-2">
          <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Fitness goal
          </label>
          <Select value={fitnessGoal ?? undefined} onValueChange={setFitnessGoal}>
            <SelectTrigger>
              <SelectValue placeholder="Select goal" />
            </SelectTrigger>
            <SelectContent>
              {FITNESS_GOALS.map((goal) => (
                <SelectItem key={goal.value} value={goal.value}>
                  {goal.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Height (cm)
          </label>
          <Input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            placeholder="178"
          />
        </div>
        <div className="space-y-2">
          <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Weight (kg)
          </label>
          <Input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            placeholder="82"
          />
        </div>
        <div className="space-y-2">
          <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Experience
          </label>
          <Select value={experience ?? undefined} onValueChange={setExperience}>
            <SelectTrigger>
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={save} disabled={saving || !name.trim()}>
        <Save className="h-4 w-4" />
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}

export function ProfileDashboard() {
  const { data: profile, isLoading } = useApiQuery<Profile>(
    [...QUERY_KEYS.user, "profile"],
    "/api/me/profile"
  );
  const { data: badges } = useApiQuery<Badge[]>(QUERY_KEYS.badges, "/api/me/badges");
  const { data: points } = useApiQuery<PointsInfo>(
    [...QUERY_KEYS.user, "points"],
    "/api/me/points"
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (!profile) return null;

  const bmi =
    profile.heightCm && profile.weightKg
      ? (profile.weightKg / Math.pow(profile.heightCm / 100, 2)).toFixed(1)
      : null;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Profile"
        description="Your details, stats, and achievements"
        icon={<Target className="h-5 w-5" />}
      />

      {/* Header card */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-5">
          {profile.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.image}
              alt={profile.name}
              className="h-20 w-20 rounded-3xl object-cover"
            />
          ) : (
            <span className="bg-primary/15 font-display text-primary flex h-20 w-20 items-center justify-center rounded-3xl text-2xl font-bold">
              {initials(profile.name)}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
              {profile.name}
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">{profile.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.fitnessGoal && (
                <Badge variant="default">{profile.fitnessGoal.replaceAll("_", " ")}</Badge>
              )}
              {profile.experience && <Badge variant="secondary">{profile.experience}</Badge>}
              <Badge variant="outline">
                {profile.branch ? `${profile.branch.name}, ${profile.branch.city}` : "No branch"}
              </Badge>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="font-display text-primary text-3xl font-bold">
                {points?.points ?? "–"}
              </p>
              <p className="text-muted-foreground text-xs tracking-widest uppercase">Points</p>
            </div>
            <div className="text-center">
              <p className="font-display text-primary text-3xl font-bold">#{points?.rank ?? "–"}</p>
              <p className="text-muted-foreground text-xs tracking-widest uppercase">Rank</p>
            </div>
            <div className="text-center">
              <p className="font-display text-primary text-3xl font-bold">{bmi ?? "–"}</p>
              <p className="text-muted-foreground text-xs tracking-widest uppercase">BMI</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Edit form */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-display text-foreground text-sm font-bold tracking-widest uppercase">
              Personal details
            </h3>
            <div className="mt-5">
              <ProfileForm key={profile.id} profile={profile} />
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-foreground text-sm font-bold tracking-widest uppercase">
                Badges
              </h3>
              <Dumbbell className="text-muted-foreground h-4 w-4" />
            </div>
            {!badges || badges.length === 0 ? (
              <p className="border-border text-muted-foreground mt-4 rounded-2xl border border-dashed py-10 text-center text-sm">
                No badges yet. Keep training to unlock achievements!
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {badges.map((b) => (
                  <div
                    key={b.id}
                    className="border-border bg-surface flex flex-col items-center gap-2 rounded-2xl border p-4 text-center"
                  >
                    <span className="bg-warning/15 text-warning flex h-12 w-12 items-center justify-center rounded-2xl">
                      <Award className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-foreground text-sm font-semibold">{b.badge.name}</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">{b.badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
