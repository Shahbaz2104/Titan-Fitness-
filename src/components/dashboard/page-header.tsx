import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DashboardPageHeader({
  title,
  description,
  actions,
  icon,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
            {icon}
          </span>
        )}
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground">
            {title}
          </h2>
          {description && (
            <p className={cn("text-sm text-muted-foreground")}>{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </motion.div>
  );
}
