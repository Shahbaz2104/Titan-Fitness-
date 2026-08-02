import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Award, CalendarCheck, Check, Clock, MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "@/components/ui/smart-image";
import { MaskReveal } from "@/components/ui/gsap-reveal";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const TRAINERS = [
  {
    slug: "marcus-cole",
    name: "Marcus Cole",
    specialty: "Strength & Powerlifting",
    bio: "Former national powerlifting champion with 12 years of coaching experience. Marcus has coached 200+ members to 100kg+ bench presses.",
    longBio:
      "Marcus walked into his first gym at 16, failed his first squat, and never left. Twelve years later he's a national champion, NSCA-CSCS certified, and the coach behind 200+ triple-digit bench presses.\n\nHis coaching philosophy is simple: master the basics, add weight over time, and never skip the details. Every program Marcus writes is periodized, percentage-based, and backed by years of competitive data.",
    years: 12,
    rating: 4.9,
    reviews: 214,
    certifications: ["NSCA-CSCS", "IPF Coach", "CPR/AED"],
    initials: "MC",
    hourly: 65,
    availability: ["Mon–Fri", "6am–2pm"],
    reviews_list: [
      {
        name: "Kevin M.",
        initials: "KM",
        rating: 5,
        text: "Went from 90kg to 132kg bench in 11 months. Marcus's programming is relentless but brilliant.",
      },
      {
        name: "Ahmed R.",
        initials: "AR",
        rating: 5,
        text: "The best coach I've ever had. Every session is intentional, every PR is earned.",
      },
      {
        name: "Daniel K.",
        initials: "DK",
        rating: 4.8,
        text: "Fixed my squat form in two sessions. My knees finally feel healthy while lifting heavy.",
      },
    ],
  },
  {
    slug: "sara-khan",
    name: "Sara Khan",
    specialty: "Yoga & Mobility",
    bio: "RYT-500 certified yoga instructor blending traditional practice with modern mobility science for athletes.",
    longBio:
      "Sara discovered yoga while recovering from a sports injury — it healed her body and quieted her mind. Now RYT-500 certified with 8 years of teaching, she helps athletes and busy professionals build mobility that lasts.\n\nHer classes blend vinyasa flow with FRS mobility assessments, making yoga practical for lifters, runners, and desk warriors alike.",
    years: 8,
    rating: 5.0,
    reviews: 168,
    certifications: ["RYT-500", "FRS Mobility Specialist"],
    initials: "SK",
    hourly: 55,
    availability: ["Tue–Sat", "7am–3pm"],
    reviews_list: [
      {
        name: "Lena F.",
        initials: "LF",
        rating: 5,
        text: "Sara's classes fixed my chronic back pain. I'm more flexible at 40 than I was at 25.",
      },
      {
        name: "Priya S.",
        initials: "PS",
        rating: 5,
        text: "Calm, precise, transformative. Her 7am flows are the best part of my week.",
      },
    ],
  },
  {
    slug: "david-okoro",
    name: "David Okoro",
    specialty: "CrossFit & HIIT",
    bio: "CF-L2 trainer and former competitive CrossFit athlete. David specializes in engine building and WOD pacing.",
    longBio:
      "David competed in CrossFit regionals for five straight years before stepping behind the whiteboard. His coaching is famous for one thing: making you fitter than you thought possible.\n\nFrom engine builders to hero WODs, David programs with a competitive athlete's eye and teaches pacing like a track coach.",
    years: 10,
    rating: 4.8,
    reviews: 192,
    certifications: ["CF-L2", "USAW Level 1"],
    initials: "DO",
    hourly: 60,
    availability: ["Mon–Sat", "5am–12pm"],
    reviews_list: [
      {
        name: "Amara O.",
        initials: "AO",
        rating: 5,
        text: "David took my WOD times from mid-pack to podium. The engine building works.",
      },
      {
        name: "Tom W.",
        initials: "TW",
        rating: 4.7,
        text: "Tough but fair. His pacing advice alone is worth the membership.",
      },
    ],
  },
  {
    slug: "emily-chen",
    name: "Emily Chen",
    specialty: "Weight Loss & Nutrition",
    bio: "Registered nutrition coach focused on sustainable fat loss. Emily pairs evidence-based nutrition with metabolic training.",
    longBio:
      "Emily has helped 300+ members lose weight without losing their sanity. No starvation, no 6-week challenges that bounce back — just sustainable habits, smart nutrition, and metabolic training.\n\nHer clients average 8kg lost in 12 weeks and — more importantly — keep it off.",
    years: 7,
    rating: 4.9,
    reviews: 150,
    certifications: ["PN-L2 Nutrition", "ACE-CPT"],
    initials: "EC",
    hourly: 70,
    availability: ["Mon–Fri", "9am–6pm"],
    reviews_list: [
      {
        name: "James R.",
        initials: "JR",
        rating: 5,
        text: "Lost 24kg in 7 months. Emily's meal plans are actually foods I enjoy.",
      },
      {
        name: "Hannah B.",
        initials: "HB",
        rating: 5,
        text: "First coach who told me to eat MORE and train smarter. Life-changing.",
      },
    ],
  },
];

export async function generateStaticParams() {
  return TRAINERS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return buildMetadata({
    title: "Trainer",
    path: `/trainers/${slug}`,
  });
}

export default async function TrainerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trainer = TRAINERS.find((t) => t.slug === slug);
  if (!trainer) notFound();

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/trainers"
            className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All trainers
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="border-border bg-surface/60 overflow-hidden rounded-2xl border">
                <div className="relative aspect-[4/5]">
                  <SmartImage
                    src={`/images/trainers/${trainer.slug}.jpg`}
                    alt={trainer.name}
                    className="h-full w-full object-cover"
                    fallbackClassName="bg-surface-2 h-full w-full"
                    fallback={
                      <span className="font-display text-foreground/20 text-7xl font-bold">
                        {trainer.initials}
                      </span>
                    }
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-warning flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(trainer.rating) ? "fill-warning" : "opacity-30"
                          }`}
                        />
                      ))}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {trainer.rating} · {trainer.reviews} reviews
                    </span>
                  </div>
                  <Button asChild className="mt-5 w-full" size="lg">
                    <Link href="/register">
                      <CalendarCheck className="h-4 w-4" />
                      Book a Session — ${trainer.hourly}/hr
                    </Link>
                  </Button>
                  <div className="border-border text-muted-foreground mt-5 space-y-3 border-t pt-5 text-sm">
                    <p className="flex items-center gap-2">
                      <Clock className="text-primary h-4 w-4" />
                      Availability: {trainer.availability.join(" · ")}
                    </p>
                    <p className="flex items-center gap-2">
                      <Award className="text-accent h-4 w-4" />
                      {trainer.years} years experience
                    </p>
                    <p className="flex items-center gap-2">
                      <MessageCircle className="text-success h-4 w-4" />
                      Responds within 1 hour
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <h1 className="font-display text-foreground text-4xl font-bold tracking-[-0.02em] sm:text-6xl">
                <MaskReveal as="span">{trainer.name}</MaskReveal>
              </h1>
              <p className="text-accent mt-3 text-sm font-medium">{trainer.specialty}</p>
              <p className="text-muted-foreground mt-6 leading-relaxed whitespace-pre-line">
                {trainer.longBio}
              </p>

              <div className="mt-8">
                <h2 className="text-foreground text-xl font-bold tracking-[-0.01em]">
                  Certifications
                </h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {trainer.certifications.map((cert) => (
                    <Badge key={cert} variant="success">
                      <Check className="h-3 w-3" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-foreground text-xl font-bold tracking-[-0.01em]">
                  Member reviews
                </h2>
                <div className="mt-5 space-y-4">
                  {trainer.reviews_list.map((review) => (
                    <div
                      key={review.name}
                      className="border-border bg-surface/60 rounded-xl border p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-surface-2 border-border flex h-10 w-10 items-center justify-center rounded-full border text-xs font-semibold text-muted-foreground">
                            {review.initials}
                          </div>
                          <div>
                            <p className="text-foreground text-sm font-semibold">{review.name}</p>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.round(review.rating)
                                      ? "fill-warning text-warning"
                                      : "text-surface-2"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-muted-foreground text-xs">Verified member</span>
                      </div>
                      <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
