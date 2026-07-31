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
    <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </motion.div>

      <div className="bg-noise absolute inset-0 opacity-40" />

      <Floating className="left-[8%] top-[22%] hidden lg:block" duration={7} distance={24}>
        <div className="glass flex items-center gap-3 rounded-2xl px-5 py-4 shadow-card">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/20">
            <Flame className="h-5 w-5 text-success" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">2,480 kcal</p>
            <p className="text-xs text-muted-foreground">Burned this week</p>
          </div>
        </div>
      </Floating>

      <Floating className="right-[10%] top-[30%] hidden lg:block" duration={9} delay={1} distance={20}>
        <div className="glass flex items-center gap-3 rounded-2xl px-5 py-4 shadow-card">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-success" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">AI Coach Online</p>
            <p className="text-xs text-muted-foreground">Ask anything, anytime</p>
          </div>
        </div>
      </Floating>

      <Floating className="bottom-[18%] right-[22%] hidden lg:block" duration={8} delay={2} distance={18}>
        <div className="glass rounded-2xl px-5 py-4 shadow-card">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Workout Streak</p>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">
            21 <span className="text-sm font-medium text-success">days</span>
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
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-xs font-medium uppercase tracking-widest text-foreground">
            AI-Powered Training. Zero Guesswork.
          </span>
        </motion.div>

        <h1 className="font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-foreground sm:text-7xl lg:text-8xl">
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
          className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Titan Fitness combines world-class trainers with AI intelligence — generating
          personalized workouts, meal plans, and coaching that adapts to your body.
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
          className="mt-16 flex items-center gap-8 text-muted-foreground"
        >
          {["No contracts", "Cancel anytime", "30-day guarantee"].map((item) => (
            <span key={item} className="flex items-center gap-2 text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
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
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-muted/40 p-1.5">
          <motion.div
            className="h-2 w-1 rounded-full bg-primary"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
