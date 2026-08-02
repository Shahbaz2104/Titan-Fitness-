"use client";

import * as React from "react";
import { createTimeline } from "animejs";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/gsap";

interface WordCycleProps {
  words: string[];
  className?: string;
  interval?: number;
}

export function WordCycle({ words, className, interval = 2600 }: WordCycleProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const index = React.useRef(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || words.length < 2) return;

    let timer: ReturnType<typeof setTimeout>;

    const swap = () => {
      const next = (index.current + 1) % words.length;
      const tl = createTimeline({ defaults: { ease: "outQuart", duration: 420 } });
      tl.add(el, { yPercent: 30, opacity: 0 }).add({
        duration: 0,
        onComplete: () => {
          el.textContent = words[next];
          index.current = next;
          el.style.transform = "translateY(-30%)";
          el.style.opacity = "0";
        },
      });
      tl.add(el, { yPercent: 0, opacity: 1 });
      timer = setTimeout(swap, interval);
    };

    timer = setTimeout(swap, interval);
    return () => clearTimeout(timer);
  }, [words, interval]);

  return (
    <span ref={ref} className={cn("inline-block", className)}>
      {words[0]}
    </span>
  );
}
