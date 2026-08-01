"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Percent, Plus, Tag, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  maxUses: number | null;
  usedCount: number;
  minAmount: number | null;
  validFrom: string | null;
  validUntil: string | null;
  isActive: boolean;
  createdAt: string;
}

interface CouponForm {
  code: string;
  type: string;
  value: string;
  maxUses: string;
  minAmount: string;
  validUntil: string;
}

const EMPTY_FORM: CouponForm = {
  code: "",
  type: "PERCENTAGE",
  value: "",
  maxUses: "",
  minAmount: "",
  validUntil: "",
};

function formatDate(value: string | null) {
  if (!value) return "–";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CouponsAdmin() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [form, setForm] = React.useState<CouponForm>(EMPTY_FORM);
  const [saving, setSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const {
    data: coupons,
    isLoading,
    isError,
  } = useApiQuery<Coupon[]>(QUERY_KEYS.adminCoupons, "/api/admin/coupons");
  const createCoupon = useApiMutation("/api/admin/coupons");
  const deleteCoupon = useApiMutation(`/api/admin/coupons/${deletingId ?? ""}`, "DELETE");

  const refresh = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminCoupons });

  const handleCreate = async () => {
    if (!form.code.trim() || !form.value) {
      toast.error("Code and value are required");
      return;
    }
    setSaving(true);
    try {
      await createCoupon({
        code: form.code.trim().toUpperCase(),
        type: form.type,
        value: Number(form.value),
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        minAmount: form.minAmount ? Number(form.minAmount) : null,
        validFrom: null,
        validUntil: form.validUntil ? new Date(form.validUntil) : null,
      });
      toast.success("Coupon created");
      setDialogOpen(false);
      setForm(EMPTY_FORM);
      await refresh();
    } catch {
      toast.error("Failed to create coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (coupon: Coupon) => {
    setDeletingId(coupon.id);
    try {
      await deleteCoupon();
      toast.success("Coupon deleted");
      await refresh();
    } catch {
      toast.error("Failed to delete coupon");
    } finally {
      setDeletingId(null);
    }
  };

  const [now] = React.useState(() => Date.now());
  const expired = (coupon: Coupon) =>
    coupon.validUntil ? new Date(coupon.validUntil).getTime() < now : false;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Coupons"
        description="Discount codes for memberships and classes"
        icon={<Tag className="h-5 w-5" />}
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New coupon
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : isError || !coupons ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <AlertTriangle className="text-warning h-8 w-8" />
            <p className="text-muted-foreground text-sm">Could not load coupons.</p>
          </CardContent>
        </Card>
      ) : coupons.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <Percent className="text-muted-foreground h-8 w-8" />
            <p className="text-muted-foreground text-sm">
              No coupons yet. Create your first discount.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {coupons.map((coupon, i) => {
            const isExpired = expired(coupon);
            return (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border-border bg-surface/60 hover:border-primary/30 relative overflow-hidden rounded-2xl border p-6 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary/15 text-primary flex h-11 w-11 items-center justify-center rounded-xl">
                      <Percent className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-foreground font-mono text-lg font-bold tracking-wider">
                        {coupon.code}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {coupon.type === "PERCENTAGE"
                          ? `${coupon.value}% off`
                          : `$${coupon.value} off`}
                      </p>
                    </div>
                  </div>
                  <Badge variant={isExpired ? "warning" : coupon.isActive ? "success" : "outline"}>
                    {isExpired ? "Expired" : coupon.isActive ? "Active" : "Disabled"}
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-surface rounded-xl p-2">
                    <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                      Used
                    </p>
                    <p className="text-foreground text-sm font-semibold">
                      {coupon.usedCount}
                      {coupon.maxUses ? `/${coupon.maxUses}` : ""}
                    </p>
                  </div>
                  <div className="bg-surface rounded-xl p-2">
                    <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                      Min
                    </p>
                    <p className="text-foreground text-sm font-semibold">
                      {coupon.minAmount ? `$${coupon.minAmount}` : "–"}
                    </p>
                  </div>
                  <div className="bg-surface rounded-xl p-2">
                    <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                      Until
                    </p>
                    <p className="text-foreground text-xs font-semibold">
                      {formatDate(coupon.validUntil)}
                    </p>
                  </div>
                </div>

                <div className="border-border mt-4 flex items-center justify-between border-t pt-3">
                  <p className="text-muted-foreground text-xs">
                    Created {formatDate(coupon.createdAt)}
                  </p>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    className="text-destructive hover:border-destructive/50"
                    onClick={() => handleDelete(coupon)}
                    disabled={deletingId === coupon.id}
                    aria-label="Delete coupon"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New coupon</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Code</Label>
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="SUMMER20"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FIXED">Fixed amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{form.type === "PERCENTAGE" ? "Value (%)" : "Value ($)"}</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Max uses (optional)</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.maxUses}
                  onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                  placeholder="Unlimited"
                />
              </div>
              <div className="space-y-2">
                <Label>Min order $ (optional)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.minAmount}
                  onChange={(e) => setForm({ ...form, minAmount: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Expires (optional)</Label>
              <Input
                type="date"
                value={form.validUntil}
                onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving ? "Creating…" : "Create coupon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
