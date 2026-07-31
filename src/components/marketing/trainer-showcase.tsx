"use client";

import Link from "next/link";
import { ArrowRight, Award, Star } from "lucide-react";
import { TiltCard } from "@/components/ui/tilt-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";

const TRAINERS = [
  {
    slug: "marcus-cole",
    name: "Marcus Cole",
    specialty: "Strength & Powerlifting",
    years: 12,
    image: "/images/trainers/marcus.jpg",
    initials: "MC",
    rating: 4.9,
    reviews: 214,
  },
  {
    slug: "sara-khan",
    name: "Sara Khan",
    specialty: "Yoga & Mobility",
    years: 8,
    image: "/images/trainers/sara.jpg",
    initials: "SK",
    rating: 5.0,
    reviews: 168,
  },
  {
    slug: "david-okoro",
    name: "David Okoro",
    specialty: "CrossFit & HIIT",
    years: 10,
    image: "/images/trainers/david.jpg",
    initials: "DO",
    rating: 4.8,
    reviews: 192,
  },
  {
    slug: "emily-chen",
    name: "Emily Chen",
    specialty: "Weight Loss & Nutrition",
    years: 7,
    image: "/images/trainers/emily.jpg",
    initials: "EC",
    rating: 4.9,
    reviews: 150,
  },
];

export function TrainerShowcase() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal className="max-w-xl">
            <Badge variant="accent" className="mb-4">
              Elite Coaches
            </Badge>
            <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground sm:text-5xl">
              Learn From <span className="text-gradient">The Best</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href="/trainers"
              className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-accent"
            >
              All trainers
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TRAINERS.map((trainer, i) => (
            <Reveal key={trainer.slug} delay={i * 0.08}>
              <TiltCard maxTilt={10} className="h-full">
                <Link
                  href={`/trainers/${trainer.slug}`}
                  className="group relative block h-full overflow-hidden rounded-2xl border border-border bg-surface/60"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                    <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-white/20 transition-transform duration-700 group-hover:scale-110">
                      <Avatar className="h-full w-full rounded-none">
                        <AvatarImage src={trainer.image} alt={trainer.name} />
                        <AvatarFallback className="rounded-none bg-gradient-to-br from-primary/40 to-accent/40 text-4xl">
                          {trainer.initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    <span className="glass absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-warning">
                      <Star className="h-3 w-3 fill-warning" />
                      {trainer.rating}
                      <span className="text-muted-foreground">({trainer.reviews})</span>
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-xs font-medium uppercase tracking-widest text-accent">
                      {trainer.years} years experience
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold uppercase tracking-wide text-foreground">
                      {trainer.name}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Award className="h-3.5 w-3.5 text-primary" />
                      {trainer.specialty}
                    </p>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
