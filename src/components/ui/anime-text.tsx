"use client";

import * as React from "react";
import { animate, stagger, set, type AnimationParams } from "animejs";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/gsap";

export type AnimeTextEffect = "rise" | "blur" | "flip";

interface AnimeTextProps {
  text: string;
  as?: React.ElementType;
  className?: string;
  effect?: AnimeTextEffect;
  stagger?: number;
  delay?: number;
  duration?: number;
  scroll?: boolean;
  threshold?: number;
}

const INITIAL_STATE: Record<AnimeTextEffect, AnimationParams> = {
  rise: { yPercent: 130, opacity: 0 },
  blur: { filter: "blur(14px)", opacity: 0 },
  flip: { rotateX: -85, opacity: 0 },
};

const FINAL_STATE: Record<AnimeTextEffect, AnimationParams> = {
  rise: { yPercent: 0, opacity: 1 },
  blur: { filter: "blur(0px)", opacity: 1 },
  flip: { rotateX: 0, opacity: 1 },
};

const EASE: Record<AnimeTextEffect, string> = {
  rise: "outExpo",
  blur: "outQuart",
  flip: "outQuart",
};

export function AnimeText({
  text,
  as: Tag = "span",
  className,
  effect = "rise",
  stagger: staggerStep = 22,
  delay = 0,
  duration = 900,
  scroll = false,
  threshold = 0.35,
}: AnimeTextProps) {
  const ref = React.useRef<HTMLElement>(null);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = Array.from(el.querySelectorAll<HTMLElement>("[data-anime-char]"));
    if (chars.length === 0) return;
    if (prefersReducedMotion()) return;

    if (effect === "flip") {
      el.style.perspective = "600px";
    }

    const play = () => {
      animate(chars, {
        ...FINAL_STATE[effect],
        duration,
        delay: stagger(staggerStep, { start: delay }),
        ease: EASE[effect],
      });
    };

    set(chars, INITIAL_STATE[effect]);

    if (!scroll) {
      play();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            play();
            io.disconnect();
          }
        });
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text, effect, staggerStep, delay, duration, scroll, threshold]);

  const words = text.split(" ");

  return (
    <Tag ref={ref} className={cn("inline-block", className)}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-pre">
          {word.split("").map((char, ci) => (
            <span key={ci} className="inline-block overflow-hidden pb-[0.08em] align-top">
              <span data-anime-char className="inline-block will-change-transform">
                {char}
              </span>
            </span>
          ))}
          {wi < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
