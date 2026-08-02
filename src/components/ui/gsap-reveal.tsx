"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface GsapRevealProps {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
}

export function GsapReveal({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  y = 28,
  duration = 0.9,
}: GsapRevealProps) {
  const ref = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
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
      {children}
    </Tag>
  );
}

interface MaskRevealProps {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function MaskReveal({
  as: Tag = "span",
  children,
  className,
  delay = 0,
}: MaskRevealProps) {
  const ref = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          delay,
          ease: "power4.out",
          scrollTrigger: { trigger: ref.current, start: "top 92%", once: true },
        }
      );
    },
    { scope: ref }
  );

  return (
    <span className="block overflow-hidden">
      <Tag ref={ref} className={cn("will-change-transform", className)}>
        {children}
      </Tag>
    </span>
  );
}
