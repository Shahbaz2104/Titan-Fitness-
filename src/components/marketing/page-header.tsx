"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  className?: string;
}

export function PageHeader({ badge, title, highlight, description, className }: PageHeaderProps) {
  return (
    <section className={cn("relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-20", className)}>
      <div className="bg-primary/8 pointer-events-none absolute top-0 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full blur-3xl" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="accent" className="mb-5">
              {badge}
            </Badge>
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-foreground text-4xl leading-[1.05] font-bold tracking-tight uppercase sm:text-6xl lg:text-7xl"
        >
          {title}
          {highlight && (
            <>
              {" "}
              <span className="text-gradient">{highlight}</span>
            </>
          )}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-muted-foreground mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
