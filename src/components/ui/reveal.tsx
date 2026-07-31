"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.7,
  y = 32,
  once = true,
  direction = "up",
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  const offset = direction === "none" ? 0 : y;
  const xOffset = direction === "left" ? -offset : direction === "right" ? offset : 0;
  const yOffset = direction === "up" ? offset : direction === "down" ? -offset : 0;

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: reduceMotion ? 0 : xOffset,
      y: reduceMotion ? 0 : yOffset,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}
