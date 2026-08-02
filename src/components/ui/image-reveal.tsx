"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { SmartImage } from "@/components/ui/smart-image";
import { cn } from "@/lib/utils";

interface ImageRevealProps {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallbackClassName?: string;
  fallback?: React.ReactNode;
  priority?: boolean;
  scale?: number;
}

export function ImageReveal({
  src,
  alt,
  className,
  imgClassName,
  fallbackClassName,
  fallback,
  priority,
  scale = 1.18,
}: ImageRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const media = ref.current.querySelector<HTMLElement>("[data-image-scale]");
      if (prefersReducedMotion()) {
        gsap.set(ref.current, { clipPath: "inset(0% 0% 0% 0%)" });
        if (media) gsap.set(media, { scale: 1 });
        return;
      }
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
      });
      tl.fromTo(
        ref.current,
        { clipPath: "inset(10% 7% 10% 7%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }
      );
      if (media) {
        tl.fromTo(media, { scale }, { scale: 1, duration: 1.4 }, 0);
      }
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div data-image-scale className="h-full w-full">
        <SmartImage
          src={src}
          alt={alt}
          className={cn("h-full w-full object-cover", imgClassName)}
          fallbackClassName={cn("h-full w-full", fallbackClassName)}
          fallback={fallback}
          priority={priority}
        />
      </div>
    </div>
  );
}
