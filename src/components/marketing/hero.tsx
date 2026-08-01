"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Sparkles, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedText } from "@/components/ui/animated-gradient";
import { Floating } from "@/components/ui/floating";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function Hero() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <motion.div style={{ opacity, scale }} className="absolute inset-0">
        <video
          className="h-full w-full object-cover opacity-30"
          autoPlay
          loop
          muted
          playsInline
          poster="/images/hero-poster.jpg"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="from-background/80 via-background/60 to-background absolute inset-0 bg-gradient-to-b" />
      </motion.div>

      <div className="bg-noise absolute inset-0 opacity-40" />

      <Floating className="top-[22%] left-[8%] hidden lg:block" duration={7} distance={24}>
        <div className="glass shadow-card flex items-center gap-3 rounded-2xl px-5 py-4">
          <span className="bg-success/20 flex h-10 w-10 items-center justify-center rounded-xl">
            <Flame className="text-success h-5 w-5" />
          </span>
          <div>
            <p className="text-foreground text-sm font-semibold">2,480 kcal</p>
            <p className="text-muted-foreground text-xs">Burned this week</p>
          </div>
        </div>
      </Floating>

      <Floating
        className="top-[30%] right-[10%] hidden lg:block"
        duration={9}
        delay={1}
        distance={20}
      >
        <div className="glass shadow-card flex items-center gap-3 rounded-2xl px-5 py-4">
          <span className="bg-primary/20 relative flex h-10 w-10 items-center justify-center rounded-xl">
            <Sparkles className="text-primary h-5 w-5" />
            <span className="bg-success absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full" />
          </span>
          <div>
            <p className="text-foreground text-sm font-semibold">AI Coach Online</p>
            <p className="text-muted-foreground text-xs">Ask anything, anytime</p>
          </div>
        </div>
      </Floating>

      <Floating
        className="right-[22%] bottom-[18%] hidden lg:block"
        duration={8}
        delay={2}
        distance={18}
      >
        <div className="glass shadow-card rounded-2xl px-5 py-4">
          <p className="text-muted-foreground text-xs tracking-widest uppercase">Workout Streak</p>
          <p className="font-display text-foreground mt-1 text-2xl font-bold">
            21 <span className="text-success text-sm font-medium">days</span>
          </p>
        </div>
      </Floating>

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 pt-24 text-center sm:px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="glass mb-8 flex items-center gap-2 rounded-full px-4 py-2"
        >
          <span className="relative flex h-2 w-2">
            <span className="bg-success absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
            <span className="bg-success relative inline-flex h-2 w-2 rounded-full" />
          </span>
          <span className="text-foreground text-xs font-medium tracking-widest uppercase">
            AI-Powered Training. Zero Guesswork.
          </span>
        </motion.div>

        <h1 className="font-display text-foreground text-5xl leading-[0.95] font-bold tracking-tight uppercase sm:text-7xl lg:text-8xl">
          <AnimatedText text="Forge Your" />
          <br />
          <span className="text-gradient">
            <AnimatedText text="Strongest Self" />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="text-muted-foreground mt-8 max-w-2xl text-base leading-relaxed sm:text-lg"
        >
          Titan Fitness combines world-class trainers with AI intelligence — generating personalized
          workouts, meal plans, and coaching that adapts to your body.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticButton>
            <Button asChild size="xl" className="group">
              <Link href="/register">
                Join Titan Now
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </MagneticButton>
          <Button asChild size="xl" variant="glass" className="group">
            <Link href="/programs">
              <Play className="h-5 w-5 transition-transform duration-300 group-hover:scale-125" />
              Explore Programs
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="text-muted-foreground mt-16 flex items-center gap-8"
        >
          {["No contracts", "Cancel anytime", "30-day guarantee"].map((item) => (
            <span key={item} className="flex items-center gap-2 text-sm">
              <span className="bg-success h-1.5 w-1.5 rounded-full" />
              {item}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="border-muted/40 flex h-10 w-6 items-start justify-center rounded-full border-2 p-1.5">
          <motion.div
            className="bg-primary h-2 w-1 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
