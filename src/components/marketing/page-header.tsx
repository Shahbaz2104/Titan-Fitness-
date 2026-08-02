"use client";

import * as React from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { AnimeText } from "@/components/ui/anime-text";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  className?: string;
}

export function PageHeader({
  badge,
  title,
  highlight,
  description,
  className,
}: PageHeaderProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const rest = ref.current.querySelectorAll("[data-header-fade]");
      if (rest.length === 0) return;
      gsap.fromTo(
        rest,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out", delay: 0.55 }
      );
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      className={cn("relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-20", className)}
    >
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h1 className="font-display text-foreground text-4xl leading-[1.02] font-bold tracking-[-0.02em] sm:text-6xl lg:text-7xl">
          <AnimeText text={title} effect="blur" stagger={16} duration={1000} />
          {highlight && <span className="text-primary">{` ${highlight}`}</span>}
        </h1>
        {description && (
          <p
            data-header-fade
            className="text-muted-foreground mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
          >
            {description}
          </p>
        )}
        {badge && (
          <p
            data-header-fade
            className="text-muted-foreground mt-4 text-xs font-medium tracking-[0.2em] uppercase"
          >
            {badge}
          </p>
        )}
      </div>
    </section>
  );
}
