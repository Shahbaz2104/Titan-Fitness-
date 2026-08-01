"use client";

import * as React from "react";
import { AlertTriangle, Save, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { QUERY_KEYS } from "@/lib/constants";
import { useApiQuery, useApiMutation } from "@/lib/api-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

type SettingsMap = Record<string, string | number>;

const SETTING_FIELDS: { key: string; label: string; hint: string; numeric?: boolean }[] = [
  { key: "site_name", label: "Site name", hint: "Shown across the app", numeric: false },
  { key: "support_email", label: "Support email", hint: "Where member questions go", numeric: false },
  { key: "referral_reward_amount", label: "Referral reward ($)", hint: "Bonus for each successful referral", numeric: true },
  { key: "workout_points_per_session", label: "Points per workout", hint: "Gamification points per completed session", numeric: true },
  { key: "daily_water_goal_ml", label: "Daily water goal (ml)", hint: "Member hydration target", numeric: true },
];

function SettingsForm({ settings, onSaved }: { settings: SettingsMap; onSaved: () => void }) {
  const [values, setValues] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(SETTING_FIELDS.map((f) => [f.key, String(settings[f.key] ?? "")]))
  );
  const [saving, setSaving] = React.useState(false);

  const saveSettings = useApiMutation("/api/admin/settings", "PATCH");

  const handleSave = async () => {
    setSaving(true);
    try {
      const entries = SETTING_FIELDS.filter((f) => values[f.key] !== "").map((f) => ({
        key: f.key,
        value: String(values[f.key]),
      }));
      if (entries.length === 0) {
        toast.error("Nothing to save");
        return;
      }
      await saveSettings(entries);
      toast.success("Settings saved");
      onSaved();
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardContent className="space-y-5 p-6">
          {SETTING_FIELDS.slice(0, 3).map((field) => (
            <div key={field.key} className="space-y-2">
              <Label>{field.label}</Label>
              <Input
                type={field.numeric ? "number" : "text"}
                value={values[field.key] ?? ""}
                onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">{field.hint}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-5 p-6">
          {SETTING_FIELDS.slice(3).map((field) => (
            <div key={field.key} className="space-y-2">
              <Label>{field.label}</Label>
              <Input
                type={field.numeric ? "number" : "text"}
                value={values[field.key] ?? ""}
                onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">{field.hint}</p>
            </div>
          ))}
          <p className="rounded-xl border border-dashed border-border p-4 text-xs text-muted-foreground">
            Missing keys are saved on first update. Values apply immediately across the platform.
          </p>
          <Button onClick={handleSave} disabled={saving} className="w-full">
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function SettingsAdmin() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading, isError } = useApiQuery<SettingsMap>(QUERY_KEYS.adminSettings, "/api/admin/settings");
  const [saveCount, setSaveCount] = React.useState(0);

  const refresh = async () => {
    setSaveCount((c) => c + 1);
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminSettings });
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Settings"
        description="Configure the Titan Fitness platform"
        icon={<Settings className="h-5 w-5" />}
      />

      {isLoading ? (
        <Skeleton className="h-80 rounded-2xl" />
      ) : isError || !settings ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <AlertTriangle className="h-8 w-8 text-warning" />
            <p className="text-sm text-muted-foreground">Could not load settings.</p>
          </CardContent>
        </Card>
      ) : (
        <SettingsForm key={`${saveCount}-${JSON.stringify(settings)}`} settings={settings} onSaved={refresh} />
      )}
    </div>
  );
}
