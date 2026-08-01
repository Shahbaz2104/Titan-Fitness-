"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Dumbbell, Pencil, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { QUERY_KEYS } from "@/lib/constants";
import { useApiQuery, useApiMutation } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface Program {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  imageUrl: string | null;
  isActive: boolean;
  _count: { classes: number };
}

const CATEGORIES = ["WEIGHT_LOSS", "BODYBUILDING", "CROSSFIT", "YOGA", "CARDIO", "HIIT", "POWERLIFTING", "CALISTHENICS"];
const DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "ELITE"];

interface ProgramForm {
  name: string;
  category: string;
  difficulty: string;
  description: string;
  durationWeeks: string;
  sessionsPerWeek: string;
  imageUrl: string;
}

const EMPTY_FORM: ProgramForm = {
  name: "",
  category: "HIIT",
  difficulty: "BEGINNER",
  description: "",
  durationWeeks: "8",
  sessionsPerWeek: "3",
  imageUrl: "",
};

function formatCategory(cat: string) {
  return cat.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ProgramsAdmin() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Program | null>(null);
  const [form, setForm] = React.useState<ProgramForm>(EMPTY_FORM);
  const [saving, setSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const { data: programs, isLoading, isError } = useApiQuery<Program[]>(QUERY_KEYS.adminPrograms, "/api/admin/programs");

  const createProgram = useApiMutation("/api/admin/programs");
  const updateProgram = useApiMutation<Program>(`/api/admin/programs/${editing?.id ?? ""}`, "PATCH");
  const deleteProgram = useApiMutation(`/api/admin/programs/${deletingId ?? ""}`, "DELETE");

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (program: Program) => {
    setEditing(program);
    setForm({
      name: program.name,
      category: program.category,
      difficulty: program.difficulty,
      description: program.description,
      durationWeeks: String(program.durationWeeks),
      sessionsPerWeek: String(program.sessionsPerWeek),
      imageUrl: program.imageUrl ?? "",
    });
    setDialogOpen(true);
  };

  const refresh = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminPrograms });

  const handleSave = async () => {
    if (!form.name.trim() || form.description.trim().length < 10) {
      toast.error("Name is required and description needs at least 10 characters");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        difficulty: form.difficulty,
        description: form.description.trim(),
        durationWeeks: Number(form.durationWeeks) || 8,
        sessionsPerWeek: Number(form.sessionsPerWeek) || 3,
        imageUrl: form.imageUrl || undefined,
      };
      if (editing) {
        await updateProgram(payload);
        toast.success("Program updated");
      } else {
        await createProgram(payload);
        toast.success("Program created");
      }
      setDialogOpen(false);
      await refresh();
    } catch {
      toast.error("Failed to save program");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (program: Program) => {
    setDeletingId(program.id);
    try {
      await deleteProgram();
      toast.success("Program deleted");
      await refresh();
    } catch {
      toast.error("Failed to delete program");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Programs"
        description="Create and manage training programs"
        icon={<Dumbbell className="h-5 w-5" />}
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            New program
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : isError || !programs ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <AlertTriangle className="h-8 w-8 text-warning" />
            <p className="text-sm text-muted-foreground">Could not load programs.</p>
          </CardContent>
        </Card>
      ) : programs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <Dumbbell className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No programs yet. Create your first one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {programs.map((program, i) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-6 transition-all hover:border-primary/30 hover:shadow-glow",
                !program.isActive && "opacity-60"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
                    {program.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{formatCategory(program.category)}</p>
                </div>
                <Badge variant={program.isActive ? "success" : "outline"}>
                  {program.isActive ? "Active" : "Hidden"}
                </Badge>
              </div>

              <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">{program.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline">{program.difficulty}</Badge>
                <Badge variant="outline">{program.durationWeeks} weeks</Badge>
                <Badge variant="outline">{program.sessionsPerWeek}×/week</Badge>
                <Badge variant="outline">{program._count.classes} classes</Badge>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">
                  {program.isActive ? "Live on site" : "Not shown to members"}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon-sm" onClick={() => openEdit(program)} aria-label="Edit program">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    className="text-destructive hover:border-destructive/50"
                    onClick={() => handleDelete(program)}
                    disabled={deletingId === program.id}
                    aria-label="Delete program"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit program" : "New program"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Program name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Fat Burn Bootcamp" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{formatCategory(c)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map((d) => (
                      <SelectItem key={d} value={d}>{formatCategory(d)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What does this program include? (min 10 characters)"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Duration (weeks)</Label>
                <Input
                  type="number"
                  min={1}
                  max={52}
                  value={form.durationWeeks}
                  onChange={(e) => setForm({ ...form, durationWeeks: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Sessions / week</Label>
                <Input
                  type="number"
                  min={1}
                  max={7}
                  value={form.sessionsPerWeek}
                  onChange={(e) => setForm({ ...form, sessionsPerWeek: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Image URL (optional)</Label>
              <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://…" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : editing ? "Save changes" : "Create program"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
