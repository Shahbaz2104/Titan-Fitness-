"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import { Parallax } from "@/components/ui/parallax";
import { WordCycle } from "@/components/ui/word-cycle";
import { gsap } from "@/lib/gsap";

export function Hero() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.1]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 70]);

  useGSAP(
    () => {
      if (!ref.current) return;
      const lines = ref.current.querySelectorAll("[data-hero-line]");
      const fade = ref.current.querySelectorAll("[data-hero-fade]");
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        lines,
        { yPercent: 115 },
        { yPercent: 0, duration: 1.2, stagger: 0.12, ease: "power4.out" },
        0.15
      );
      tl.fromTo(fade, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, 0.6);
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="relative flex min-h-screen items-center overflow-hidden">
      <Parallax from={7} to={-7} className="absolute inset-0 scale-110">
        <video
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster="/images/hero-poster.jpg"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <SmartImage
          src="/images/hero-poster.jpg"
          alt="Titan Fitness training floor"
          className="h-full w-full object-cover"
          fallbackClassName="bg-surface-2 h-full w-full"
          priority
        />
        <div className="from-background via-background/70 to-background absolute inset-0 bg-gradient-to-b" />
      </Parallax>

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 pb-24 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl">
          <p
            data-hero-fade
            className="text-muted-foreground mb-7 flex items-center gap-3 text-sm font-medium"
          >
            <span className="bg-primary inline-block h-px w-10" />
            AI-powered coaching
          </p>
          <h1 className="font-display text-foreground text-5xl leading-[0.95] font-bold tracking-[-0.02em] sm:text-7xl lg:text-8xl">
            <span className="block overflow-hidden pb-1">
              <span data-hero-line className="block will-change-transform">
                Train with AI that
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span data-hero-line className="block will-change-transform">
                knows your{" "}
                <WordCycle
                  words={["body.", "strength.", "progress.", "goals."]}
                  className="text-primary"
                />
              </span>
            </span>
          </h1>
          <p data-hero-fade className="text-muted-foreground mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
            Titan builds your workouts, meal plans, and coaching around you — not a template. Log a
            session and watch the plan adapt.
          </p>
          <div
            data-hero-fade
            className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <Button asChild size="xl">
              <Link href="/register">
                Start training
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/programs">Explore programs</Link>
            </Button>
          </div>
        </div>
      </motion.div>

      <div data-hero-fade className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-muted-foreground text-xs">Scroll</span>
        <span className="bg-white/10 relative h-10 w-px overflow-hidden">
          <motion.span
            className="bg-primary absolute inset-x-0 top-0 h-1/2"
            animate={{ y: ["-100%", "220%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </div>
    </section>
  );
}
