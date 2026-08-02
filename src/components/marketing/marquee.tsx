"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
  speed?: number;
}

export function Marquee({ items, className, speed = 40 }: MarqueeProps) {
  const row = React.useMemo(() => [...items, ...items], [items]);
  const duration = items.length * (speed / 10);

  return (
    <div
      className={cn(
        "group relative overflow-hidden py-10",
        "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className
      )}
    >
      <div
        className="flex w-max items-center gap-0 whitespace-nowrap motion-reduce:animate-none group-hover:[animation-play-state:paused]"
        style={{
          animation: `marquee-scroll ${duration}s linear infinite`,
        }}
      >
        {row.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="font-display text-foreground/25 px-6 text-5xl font-bold tracking-[-0.02em] sm:text-6xl">
              {item}
            </span>
            <span className="text-primary text-2xl">*</span>
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
