"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface WordRevealProps {
  text: string;
  as?: React.ElementType;
  className?: string;
  stagger?: number;
  delay?: number;
}

export function WordReveal({
  text,
  as: Tag = "p",
  className,
  stagger = 0.02,
  delay = 0,
}: WordRevealProps) {
  const ref = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const words = ref.current?.querySelectorAll<HTMLElement>("[data-word]");
      if (!words || words.length === 0) return;
      if (prefersReducedMotion()) {
        gsap.set(words, { yPercent: 0, opacity: 1 });
        return;
      }
      gsap.fromTo(
        words,
        { yPercent: 45, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          stagger,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
        }
      );
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={cn("will-change-transform", className)}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-top">
          <span data-word className="inline-block will-change-transform">
            {word}
            {i < text.split(" ").length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
