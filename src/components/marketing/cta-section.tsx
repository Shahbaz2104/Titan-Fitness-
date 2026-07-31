"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Floating } from "@/components/ui/floating";
import { Dumbbell, Zap } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/15 via-surface to-accent/10 p-10 text-center sm:p-16">
            <div className="bg-grid absolute inset-0 opacity-50" />
            <Floating className="left-8 top-8 hidden sm:block" distance={12}>
              <Dumbbell className="h-8 w-8 text-primary/50" />
            </Floating>
            <Floating className="bottom-10 right-10 hidden sm:block" duration={7} delay={1}>
              <Zap className="h-7 w-7 text-accent/50" />
            </Floating>

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Limited time offer
              </p>
              <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-bold uppercase leading-tight tracking-tight text-foreground sm:text-6xl">
                First Month <span className="text-gradient">50% Off</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
                Join 12,000+ members who chose to become unstoppable. Your AI
                coach is waiting.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <MagneticButton>
                  <Button asChild size="xl" className="group">
                    <Link href="/register">
                      Claim Your Offer
                      <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </MagneticButton>
                <Button asChild size="xl" variant="glass">
                  <Link href="/contact">
                    <Mail className="h-5 w-5" />
                    Talk to Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
