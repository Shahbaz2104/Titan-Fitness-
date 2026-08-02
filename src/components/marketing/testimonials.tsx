"use client";

import { Star } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import * as React from "react";
import { AnimeText } from "@/components/ui/anime-text";
import { SmartImage } from "@/components/ui/smart-image";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  {
    name: "James Rodriguez",
    role: "Lost 24 kg in 7 months",
    quote:
      "The AI workout generator feels like having a personal coach in my pocket. I lost 24 kg without ever feeling lost in the gym.",
    initials: "JR",
    avatar: "/marcus.jpg",
    rating: 5,
  },
  {
    name: "Amara Osei",
    role: "CrossFit Athlete",
    quote:
      "I've trained at gyms on three continents. Titan's classes, tracking, and community are on another level entirely.",
    initials: "AO",
    rating: 5,
  },
  {
    name: "Tom Walker",
    role: "Reached 140kg Bench Press",
    quote:
      "The strength program took me from 90kg to 140kg bench in a year. The trainer feedback and analytics kept me dialed in.",
    initials: "TW",
    avatar: "/male3.jpg",
    rating: 5,
  },
  {
    name: "Lena Fischer",
    role: "Yoga & Mobility",
    quote:
      "Beautiful studio, world-class instructors, and an app that actually works. The nutrition AI is shockingly good.",
    initials: "LF",
    rating: 5,
  },
  {
    name: "Omar Haddad",
    role: "Marathon Finisher",
    quote:
      "From couch to a full marathon in 9 months. The cardio program plus AI nutrition plan made it simple and sustainable.",
    initials: "OH",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Parent of two",
    quote:
      "As a busy mom, the 20-minute HIIT sessions and smart scheduling changed my life. I've never been more consistent.",
    initials: "PS",
    avatar: "/female2.jpg",
    rating: 5,
  },
];

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", skipSnaps: false });
  const [selected, setSelected] = React.useState(0);
  const [hovered, setHovered] = React.useState(false);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi || hovered) return;
    const id = setInterval(() => emblaApi.scrollNext(), 4200);
    return () => clearInterval(id);
  }, [emblaApi, hovered]);

  return (
    <section
      className="border-border bg-surface/30 border-y py-24 sm:py-32"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-foreground text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            <AnimeText text="What members are saying" effect="rise" scroll />
          </h2>
        </div>

        <div className="mt-14 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5">
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.name}
                className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <figure className="border-border bg-surface h-full rounded-xl border p-8">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="fill-warning text-warning h-3.5 w-3.5" />
                    ))}
                  </div>
                  <blockquote className="text-foreground/90 mt-5 text-sm leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <figcaption className="border-border mt-6 flex items-center gap-3 border-t pt-5">
                    {testimonial.avatar ? (
                      <SmartImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="border-border h-10 w-10 rounded-full border object-cover"
                        fallbackClassName="bg-surface-2 border-border h-10 w-10 rounded-full border"
                        fallback={
                          <span className="text-muted-foreground text-xs font-semibold">
                            {testimonial.initials}
                          </span>
                        }
                      />
                    ) : (
                      <div className="bg-surface-2 border-border flex h-10 w-10 items-center justify-center rounded-full border text-xs font-semibold text-muted-foreground">
                        {testimonial.initials}
                      </div>
                    )}
                    <div>
                      <p className="text-foreground text-sm font-semibold">{testimonial.name}</p>
                      <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                selected === i ? "bg-primary w-8" : "bg-surface-2 hover:bg-muted w-2"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
