"use client";

import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const GALLERY = [
  { label: "Weight Loss", gradient: "from-primary/30 to-accent/10", emoji: "🔥" },
  { label: "Muscle Gain", gradient: "from-accent/30 to-primary/10", emoji: "💪" },
  { label: "Endurance", gradient: "from-success/30 to-primary/10", emoji: "🏃" },
  { label: "Strength", gradient: "from-warning/30 to-accent/10", emoji: "🏋️" },
];

export function TransformationGallery() {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setActive((prev) => (prev + 1) % GALLERY.length);
    }, 4000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal direction="left">
            <Badge variant="default" className="mb-4">
              Transformations
            </Badge>
            <h2 className="font-display text-foreground text-4xl font-bold tracking-tight uppercase sm:text-5xl">
              Every Body Has A <span className="text-gradient">Before &amp; After</span>
            </h2>
            <p className="text-muted-foreground mt-5 max-w-md leading-relaxed">
              Thousands of members have rewritten their stories at Titan. Track your own
              transformation with progress photos and body metrics — because the scale lies, but the
              mirror doesn&apos;t.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {GALLERY.map((item, i) => (
                <button
                  key={item.label}
                  onClick={() => setActive(i)}
                  className={cn(
                    "rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300",
                    active === i
                      ? "border-primary bg-primary/10 text-primary shadow-glow"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground hover:border-white/20"
                  )}
                >
                  {item.emoji} {item.label}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.15}>
            <div className="border-border relative aspect-square overflow-hidden rounded-3xl border">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "absolute inset-0 flex items-end bg-gradient-to-br p-8",
                    GALLERY[active].gradient
                  )}
                >
                  <div className="bg-grid absolute inset-0 opacity-40" />
                  <div className="relative">
                    <p className="font-display text-foreground text-2xl font-bold uppercase">
                      {GALLERY[active].label}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Member success story · verified by Titan coaches
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="glass text-muted-foreground rounded-full px-3 py-1 text-[10px] font-medium tracking-widest uppercase">
                  Before
                </span>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <span className="glass text-success rounded-full px-3 py-1 text-[10px] font-medium tracking-widest uppercase">
                  After
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
