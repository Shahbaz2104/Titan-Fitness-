"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CalendarCheck2,
  ChevronDown,
  CreditCard,
  Search,
  UserRound,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { QUERY_KEYS } from "@/lib/constants";
import { useApiQuery, useApiMutation } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface AdminMember {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  memberships: { id: string; endDate: string; plan: { name: string } }[];
}

interface MembersResponse {
  members: AdminMember[];
  total: number;
  page: number;
  pages: number;
}

interface MemberDetail {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  heightCm: number | null;
  weightKg: number | null;
  fitnessGoal: string | null;
  memberships: { id: string; status: string; startDate: string; endDate: string; plan: { name: string } }[];
  payments: { id: string; amount: number; status: string; type: string; createdAt: string }[];
  attendance: { id: string; status: string; checkInTime: string }[];
}

const STATUS_FILTERS = ["ALL", "ACTIVE", "EXPIRED", "CANCELLED", "SUSPENDED", "PENDING"] as const;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function MembersAdmin() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState("");
  const [debounced, setDebounced] = React.useState("");
  const [status, setStatus] = React.useState<(typeof STATUS_FILTERS)[number]>("ALL");
  const [page, setPage] = React.useState(1);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError } = useApiQuery<MembersResponse>(
    [...QUERY_KEYS.adminMembers, status, debounced, page],
    "/api/admin/members",
    { search: debounced || undefined, status: status === "ALL" ? undefined : status, page, limit: 15 }
  );

  const { data: detail, isLoading: detailLoading } = useApiQuery<MemberDetail>(
    [...QUERY_KEYS.adminMemberDetail, expandedId ?? ""],
    `/api/admin/members/${expandedId ?? "none"}`
  );

  const toggleActive = useApiMutation<{ member: { isActive: boolean } }>(
    `/api/admin/members/${expandedId ?? ""}`,
    "PATCH"
  );

  const handleToggleActive = async (current: boolean) => {
    try {
      await toggleActive({ isActive: !current });
      toast.success(current ? "Member deactivated" : "Member activated");
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminMembers });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminMemberDetail });
    } catch {
      toast.error("Failed to update member status");
    }
  };

  const memberRows = data?.members ?? [];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Members"
        description={`${data?.total ?? "…"} members found`}
        icon={<Users className="h-5 w-5" />}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="pl-10"
          />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v as (typeof STATUS_FILTERS)[number]); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Membership status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "ALL" ? "All statuses" : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : isError || !data ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <AlertTriangle className="h-8 w-8 text-warning" />
            <p className="text-sm text-muted-foreground">Could not load members.</p>
          </CardContent>
        </Card>
      ) : memberRows.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <UserRound className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No members match your filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {memberRows.map((member) => {
            const activeMembership = member.memberships[0];
            return (
              <div key={member.id}>
                <motion.button
                  layout="position"
                  onClick={() => setExpandedId(expandedId === member.id ? null : member.id)}
                  className="flex w-full items-center gap-4 rounded-2xl border border-border bg-surface/60 p-4 text-left transition-all hover:border-primary/30"
                >
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={member.image ?? undefined} alt={member.name} />
                    <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{member.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                  </div>
                  <div className="hidden items-center gap-2 sm:flex">
                    {activeMembership ? (
                      <Badge variant="success">{activeMembership.plan.name}</Badge>
                    ) : (
                      <Badge variant="outline">No plan</Badge>
                    )}
                  </div>
                  <Badge variant={member.isActive ? "success" : "warning"}>
                    {member.isActive ? "Active" : "Deactivated"}
                  </Badge>
                  <span className="hidden text-xs text-muted-foreground md:block">
                    Joined {formatDate(member.createdAt)}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                      expandedId === member.id && "rotate-180"
                    )}
                  />
                </motion.button>

                {expandedId === member.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-2xl border border-border bg-surface/40 p-5">
                      {detailLoading ? (
                        <Skeleton className="h-40 rounded-xl" />
                      ) : !detail ? null : (
                        <div className="grid gap-6 lg:grid-cols-3">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-display text-xs font-bold uppercase tracking-widest text-foreground">
                                Details
                              </h4>
                              <Switch
                                checked={detail.isActive}
                                onCheckedChange={() => handleToggleActive(detail.isActive)}
                              />
                            </div>
                            <div className="space-y-2 rounded-xl border border-border bg-surface p-4 text-sm">
                              <p className="flex justify-between text-muted-foreground">
                                Role <span className="font-medium text-foreground">{detail.role}</span>
                              </p>
                              <p className="flex justify-between text-muted-foreground">
                                Height <span className="font-medium text-foreground">{detail.heightCm ?? "–"} cm</span>
                              </p>
                              <p className="flex justify-between text-muted-foreground">
                                Weight <span className="font-medium text-foreground">{detail.weightKg ?? "–"} kg</span>
                              </p>
                              <p className="flex justify-between text-muted-foreground">
                                Goal <span className="font-medium text-foreground">{detail.fitnessGoal ?? "–"}</span>
                              </p>
                            </div>
                            <div className="space-y-2">
                              {detail.memberships.map((m) => (
                                <div key={m.id} className="rounded-xl border border-border bg-surface p-3">
                                  <p className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-foreground">{m.plan.name}</span>
                                    <Badge variant={m.status === "ACTIVE" ? "success" : "outline"}>{m.status}</Badge>
                                  </p>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {formatDate(m.startDate)} → {formatDate(m.endDate)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-foreground">
                              Recent payments
                            </h4>
                            <div className="mt-3 space-y-2">
                              {detail.payments.length === 0 && (
                                <p className="rounded-xl border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                                  No payments yet
                                </p>
                              )}
                              {detail.payments.map((p) => (
                                <div key={p.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-3 text-sm">
                                  <span className="flex items-center gap-2 text-muted-foreground">
                                    <CreditCard className="h-3.5 w-3.5" />
                                    {p.type} · {formatDate(p.createdAt)}
                                  </span>
                                  <span className="flex items-center gap-2">
                                    <Badge variant={p.status === "SUCCEEDED" ? "success" : "outline"}>{p.status}</Badge>
                                    <span className="font-semibold text-foreground">${Number(p.amount).toFixed(2)}</span>
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-foreground">
                              Recent attendance
                            </h4>
                            <div className="mt-3 space-y-2">
                              {detail.attendance.length === 0 && (
                                <p className="rounded-xl border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                                  No check-ins yet
                                </p>
                              )}
                              {detail.attendance.map((a) => (
                                <div key={a.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-3 text-sm">
                                  <span className="flex items-center gap-2 text-muted-foreground">
                                    <CalendarCheck2 className="h-3.5 w-3.5" />
                                    {formatDate(a.checkInTime)}
                                  </span>
                                  <Badge variant={a.status === "PRESENT" ? "success" : "warning"}>{a.status}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}

          {data.pages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Page {data.page} of {data.pages}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
