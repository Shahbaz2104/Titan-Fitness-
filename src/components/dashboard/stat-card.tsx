"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  delta?: number;
  deltaLabel?: string;
  href?: string;
  delay?: number;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaLabel,
  href,
  delay = 0,
}: StatCardProps) {
  const positive = (delta ?? 0) >= 0;

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-primary/30 hover:shadow-glow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-foreground">{value}</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {delta !== undefined && (
        <div
          className={cn(
            "mt-4 flex items-center gap-1.5 text-xs",
            positive ? "text-success" : "text-primary"
          )}
        >
          {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          <span className="font-semibold">{Math.abs(delta)}%</span>
          <span className="text-muted-foreground">{deltaLabel ?? "vs last week"}</span>
        </div>
      )}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }
  return content;
}
