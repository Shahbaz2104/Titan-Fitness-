"use client";

import { Quote, Star } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import * as React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  {
    name: "James Rodriguez",
    role: "Lost 24 kg in 7 months",
    quote:
      "The AI workout generator feels like having a personal coach in my pocket. I lost 24 kg without ever feeling lost in the gym.",
    initials: "JR",
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
    rating: 5,
  },
];

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", skipSnaps: false });
  const [selected, setSelected] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="border-border bg-surface/30 relative overflow-hidden border-y py-24 sm:py-32">
      <div className="bg-accent/5 pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="success" className="mb-4">
            Member Stories
          </Badge>
          <h2 className="font-display text-foreground text-4xl font-bold tracking-tight uppercase sm:text-5xl">
            Real People. <span className="text-gradient">Real Results.</span>
          </h2>
        </Reveal>

        <div className="mt-14 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5">
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.name}
                className="relative min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <div className="group border-border bg-surface/60 hover:border-primary/30 hover:shadow-glow h-full rounded-2xl border p-8 backdrop-blur-xl transition-all duration-500">
                  <Quote className="text-primary/40 group-hover:text-primary h-8 w-8 transition-colors duration-300" />
                  <p className="text-foreground/90 mt-5 text-sm leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="fill-warning text-warning h-3.5 w-3.5" />
                    ))}
                  </div>
                  <div className="border-border mt-5 flex items-center gap-3 border-t pt-5">
                    <Avatar>
                      <AvatarFallback>{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-foreground text-sm font-semibold">{testimonial.name}</p>
                      <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
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
