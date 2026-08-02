"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface CountUpProps {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.8,
  className,
}: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (prefersReducedMotion()) {
        ref.current.textContent = format(to, decimals, prefix, suffix);
        return;
      }
      const state = { value: 0 };
      gsap.to(state, {
        value: to,
        duration,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        onUpdate: () => {
          if (ref.current) {
            ref.current.textContent = format(state.value, decimals, prefix, suffix);
          }
        },
      });
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {format(0, decimals, prefix, suffix)}
    </span>
  );
}

function format(value: number, decimals: number, prefix: string, suffix: string) {
  return `${prefix}${value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`;
}
