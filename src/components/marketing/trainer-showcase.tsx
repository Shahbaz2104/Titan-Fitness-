import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { ImageReveal } from "@/components/ui/image-reveal";
import { WordReveal } from "@/components/ui/word-reveal";
import { AnimeText } from "@/components/ui/anime-text";
import { GsapReveal } from "@/components/ui/gsap-reveal";

const TRAINERS = [
  {
    slug: "marcus-cole",
    name: "Marcus Cole",
    specialty: "Strength & Powerlifting",
    years: 12,
    image: "/images/trainers/marcus-cole.jpg",
    rating: 4.9,
    reviews: 214,
  },
  {
    slug: "sara-khan",
    name: "Sara Khan",
    specialty: "Yoga & Mobility",
    years: 8,
    image: "/images/trainers/sara-khan.jpg",
    rating: 5.0,
    reviews: 168,
  },
  {
    slug: "david-okoro",
    name: "David Okoro",
    specialty: "CrossFit & HIIT",
    years: 10,
    image: "/images/trainers/david-okoro.jpg",
    rating: 4.8,
    reviews: 192,
  },
  {
    slug: "emily-chen",
    name: "Emily Chen",
    specialty: "Weight Loss & Nutrition",
    years: 7,
    image: "/images/trainers/emily-chen.jpg",
    rating: 4.9,
    reviews: 150,
  },
];

export function TrainerShowcase() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <h2 className="font-display text-foreground text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
              <AnimeText text="Learn from coaches who compete" effect="blur" scroll />
            </h2>
            <p className="text-muted-foreground mt-4">
              <WordReveal text="Certified, results-driven trainers who have been where you are." />
            </p>
          </div>
          <Link
            href="/trainers"
            className="text-primary hover:text-primary-light inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
          >
            All trainers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRAINERS.map((trainer, i) => (
            <GsapReveal key={trainer.slug} delay={(i % 4) * 0.08}>
              <Link
                href={`/trainers/${trainer.slug}`}
                className="group relative block overflow-hidden rounded-xl"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <ImageReveal
                    src={trainer.image}
                    alt={trainer.name}
                    className="h-full w-full"
                    imgClassName="group-hover:scale-105"
                    fallbackClassName="bg-surface-2 h-full w-full"
                  />
                </div>
                <div className="from-background/95 via-background/40 absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent p-5 pt-16">
                  <p className="text-muted-foreground text-xs font-medium">{trainer.specialty}</p>
                  <div className="mt-1 flex items-end justify-between gap-3">
                    <h3 className="font-display text-foreground text-lg font-semibold tracking-[-0.01em]">
                      {trainer.name}
                    </h3>
                    <span className="text-warning flex items-center gap-1 text-xs font-medium">
                      <Star className="fill-warning h-3 w-3" />
                      {trainer.rating}
                    </span>
                  </div>
                </div>
              </Link>
            </GsapReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
