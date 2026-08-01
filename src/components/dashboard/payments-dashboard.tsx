"use client";

import { motion } from "framer-motion";
import { CreditCard, Receipt, Wallet } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiQuery } from "@/lib/api-client";
import { QUERY_KEYS } from "@/lib/constants";

interface Payment {
  id: string;
  amount: string;
  currency: string;
  status: string;
  method: string;
  type: string;
  description: string | null;
  createdAt: string;
  membership: { plan: { name: string } } | null;
  coupon: { code: string } | null;
}

const STATUS_STYLES: Record<string, "success" | "warning" | "outline" | "default"> = {
  SUCCEEDED: "success",
  PENDING: "warning",
  FAILED: "outline",
  REFUNDED: "outline",
  PARTIALLY_REFUNDED: "outline",
};

export function PaymentsDashboard() {
  const { data: history, isLoading } = useApiQuery<Payment[]>(
    QUERY_KEYS.payments,
    "/api/payments/history"
  );

  const succeeded = (history ?? []).filter((p) => p.status === "SUCCEEDED");
  const totalSpent = succeeded.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Payments"
        description="Invoices, receipts, and billing history"
        icon={<Wallet className="h-5 w-5" />}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Total paid</p>
            <p className="mt-2 font-display text-2xl font-bold text-foreground">
              ${totalSpent.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Transactions</p>
            <p className="mt-2 font-display text-2xl font-bold text-foreground">{history?.length ?? "–"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Last payment</p>
            <p className="mt-2 font-display text-2xl font-bold text-foreground">
              {history?.[0]
                ? `$${Number(history[0].amount).toFixed(2)}`
                : "–"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-5">
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
            History
          </h3>
          {isLoading ? (
            <div className="mt-4 space-y-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : !history || history.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              No payments yet. Your membership purchases will appear here.
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {history.map((payment, i) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.5) }}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        payment.status === "SUCCEEDED"
                          ? "flex h-9 w-9 items-center justify-center rounded-xl bg-success/15 text-success"
                          : "flex h-9 w-9 items-center justify-center rounded-xl bg-surface-2 text-muted-foreground"
                      }
                    >
                      <Receipt className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {payment.membership?.plan.name ?? payment.description ?? payment.type.replaceAll("_", " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        · {payment.method.replaceAll("_", " ")}
                        {payment.coupon ? ` · Coupon ${payment.coupon.code}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={STATUS_STYLES[payment.status] ?? "outline"}>
                      {payment.status.replaceAll("_", " ")}
                    </Badge>
                    <span className="font-display text-base font-bold text-foreground">
                      ${Number(payment.amount).toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-xs text-muted-foreground">
        <CreditCard className="h-4 w-4" />
        Payments are processed securely via our payment partner. Receipts are sent to your email.
      </div>
    </div>
  );
}
