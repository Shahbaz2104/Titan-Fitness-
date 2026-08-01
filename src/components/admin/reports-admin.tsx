"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Banknote,
  CalendarCheck2,
  CheckCircle2,
  Clock4,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { QUERY_KEYS } from "@/lib/constants";
import { useApiQuery } from "@/lib/api-client";
import { cn } from "@/lib/utils";

const DAY_RANGES = [7, 14, 30, 90] as const;

interface RevenueReport {
  series: { date: string; revenue: number }[];
  byType: Record<string, number>;
  total: number;
}

interface AttendanceReport {
  series: { date: string; count: number }[];
  total: number;
  present: number;
  late: number;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function BarChart({
  data,
  valueKey,
  formatValue,
}: {
  data: { date: string; [key: string]: string | number }[];
  valueKey: string;
  formatValue: (v: number) => string;
}) {
  const values = data.map((d) => Number(d[valueKey]));
  const max = Math.max(...values, 1);
  return (
    <div className="mt-6 flex h-48 items-end gap-1">
      {data.map((d, i) => {
        const v = Number(d[valueKey]);
        return (
          <div key={d.date} className="group relative flex-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(v / max) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.004, ease: "easeOut" }}
              className="w-full rounded-t-md bg-gradient-to-t from-primary/40 to-primary transition-all group-hover:from-accent/60 group-hover:to-accent"
            />
            <div className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-surface px-2 py-1 text-[10px] font-semibold text-foreground opacity-0 shadow-card transition-opacity group-hover:opacity-100">
              {formatValue(v)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ReportsAdmin() {
  const [days, setDays] = React.useState<number>(30);
  const [selected, setSelected] = React.useState<"revenue" | "attendance">("revenue");

  const revenue = useApiQuery<RevenueReport>(
    [...QUERY_KEYS.adminRevenue, days],
    "/api/admin/reports/revenue",
    { days }
  );
  const attendance = useApiQuery<AttendanceReport>(
    [...QUERY_KEYS.adminAttendance, days],
    "/api/admin/reports/attendance",
    { days }
  );

  const isLoading = selected === "revenue" ? revenue.isLoading : attendance.isLoading;
  const isError = selected === "revenue" ? revenue.isError : attendance.isError;

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Reports"
        description="Revenue and attendance analytics"
        icon={<TrendingUp className="h-5 w-5" />}
        actions={
          <div className="flex rounded-xl border border-border bg-surface p-1">
            {DAY_RANGES.map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  days === d
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {d}d
              </button>
            ))}
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        <Button
          variant={selected === "revenue" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelected("revenue")}
        >
          <Banknote className="h-4 w-4" />
          Revenue
        </Button>
        <Button
          variant={selected === "attendance" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelected("attendance")}
        >
          <CalendarCheck2 className="h-4 w-4" />
          Attendance
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 rounded-2xl" />
      ) : isError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <AlertTriangle className="h-8 w-8 text-warning" />
            <p className="text-sm text-muted-foreground">Could not load report data.</p>
          </CardContent>
        </Card>
      ) : selected === "revenue" && revenue.data ? (
        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
                  Revenue — last {days} days
                </h3>
                <p className="font-display text-2xl font-bold text-foreground">
                  {formatMoney(revenue.data.total)}
                </p>
              </div>
              <BarChart data={revenue.data.series} valueKey="revenue" formatValue={formatMoney} />
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">
                  {revenue.data.series[0]?.date} → {revenue.data.series[revenue.data.series.length - 1]?.date}
                </p>
                <Badge variant="success">SUCCEEDED payments only</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
                Revenue by type
              </h3>
              <div className="mt-4 space-y-3">
                {Object.entries(revenue.data.byType)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, amount]) => (
                    <div key={type} className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
                      <span className="text-sm font-medium text-foreground">{type}</span>
                      <span className="text-sm font-semibold text-primary">{formatMoney(amount)}</span>
                    </div>
                  ))}
                {Object.keys(revenue.data.byType).length === 0 && (
                  <p className="py-6 text-center text-sm text-muted-foreground">No payments in this period.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : attendance.data ? (
        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
                  Attendance — last {days} days
                </h3>
                <p className="font-display text-2xl font-bold text-foreground">
                  {attendance.data.total} check-ins
                </p>
              </div>
              <BarChart data={attendance.data.series} valueKey="count" formatValue={(v) => String(v)} />
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">
                  {attendance.data.series[0]?.date} → {attendance.data.series[attendance.data.series.length - 1]?.date}
                </p>
                <div className="flex gap-2">
                  <Badge variant="success">
                    <CheckCircle2 className="h-3 w-3" />
                    {attendance.data.present} present
                  </Badge>
                  <Badge variant="warning">
                    <Clock4 className="h-3 w-3" />
                    {attendance.data.late} late
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
                Summary
              </h3>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Total check-ins", value: attendance.data.total },
                  { label: "On time", value: attendance.data.present },
                  { label: "Late arrivals", value: attendance.data.late },
                  {
                    label: "Punctuality",
                    value: attendance.data.total > 0
                      ? `${Math.round((attendance.data.present / attendance.data.total) * 100)}%`
                      : "–",
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
                    <span className="text-sm font-medium text-foreground">{row.label}</span>
                    <span className="text-sm font-semibold text-primary">{row.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
