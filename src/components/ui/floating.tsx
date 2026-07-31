"use client";

import { motion } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

interface FloatingProps {
  className?: string;
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  distance?: number;
}

export function Floating({
  className,
  children,
  duration = 6,
  delay = 0,
  distance = 16,
}: FloatingProps) {
  return (
    <motion.div
      className={cn("absolute", className)}
      animate={{
        y: [0, -distance, 0],
        rotate: [0, 3, -3, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      aria-hidden
    >
      {children}
    </motion.div>
  );
}
