"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export function ScrollProgress() {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.to(ref.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: "max",
          scrub: 0.4,
        },
      });
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="bg-primary/40 fixed inset-x-0 top-0 z-[60] h-0.5 origin-left scale-x-0"
    />
  );
}
