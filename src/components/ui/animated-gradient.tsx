"use client";

import { motion } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  colors?: string[];
  animate?: boolean;
}

export function AnimatedGradient({
  className,
  colors = ["#E63946", "#FF6B35", "#00C853", "#E63946"],
  animate = true,
  ...props
}: AnimatedGradientProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
      {...props}
    >
      <div
        className={cn("absolute inset-[-50%] opacity-40 blur-3xl", animate && "animate-gradient-x")}
        style={{
          background: `linear-gradient(120deg, ${colors.join(", ")})`,
          backgroundSize: "300% 300%",
        }}
      />
    </div>
  );
}

export function AnimatedText({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.6,
            delay: i * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  );
}
