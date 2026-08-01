"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Building2, CalendarDays, Mail, MapPin, Phone, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { QUERY_KEYS } from "@/lib/constants";
import { useApiQuery } from "@/lib/api-client";

interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string | null;
  email: string | null;
  timezone: string;
  isActive: boolean;
  _count: { users: number; classes: number };
}

export function BranchesAdmin() {
  const { data: branches, isLoading, isError } = useApiQuery<Branch[]>(QUERY_KEYS.adminBranches, "/api/admin/branches");

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Branches"
        description={`${branches?.length ?? "…"} locations`}
        icon={<Building2 className="h-5 w-5" />}
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>
      ) : isError || !branches ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <AlertTriangle className="h-8 w-8 text-warning" />
            <p className="text-sm text-muted-foreground">Could not load branches.</p>
          </CardContent>
        </Card>
      ) : branches.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <Building2 className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No branches configured.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {branches.map((branch, i) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-surface/60 p-6 transition-all hover:border-primary/30 hover:shadow-glow"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
                  {branch.name}
                </h3>
                <Badge variant={branch.isActive ? "success" : "outline"}>
                  {branch.isActive ? "Open" : "Closed"}
                </Badge>
              </div>

              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  {branch.address}, {branch.city}
                </p>
                {branch.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-primary" />
                    {branch.phone}
                  </p>
                )}
                {branch.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-primary" />
                    {branch.email}
                  </p>
                )}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
                <div className="flex items-center gap-2 rounded-xl bg-surface p-3">
                  <Users className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{branch._count.users}</p>
                    <p className="text-[10px] text-muted-foreground">Members</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-surface p-3">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{branch._count.classes}</p>
                    <p className="text-[10px] text-muted-foreground">Classes</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
