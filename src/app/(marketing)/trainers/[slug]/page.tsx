import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Award,
  CalendarCheck,
  Check,
  Clock,
  MessageCircle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Reveal } from "@/components/ui/reveal";
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

export default async function TrainerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trainer = TRAINERS.find((t) => t.slug === slug);
  if (!trainer) notFound();

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/trainers"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            All trainers
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-5">
            <Reveal className="lg:col-span-2">
              <div className="overflow-hidden rounded-3xl border border-border bg-surface/60">
                <Avatar className="h-auto w-full rounded-none">
                  <AvatarImage src={`/images/trainers/${trainer.slug}.jpg`} alt={trainer.name} />
                  <AvatarFallback className="rounded-none bg-gradient-to-br from-primary/40 to-accent/40 py-32 text-7xl">
                    {trainer.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-warning">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(trainer.rating) ? "fill-warning" : "opacity-30"
                          }`}
                        />
                      ))}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {trainer.rating} · {trainer.reviews} reviews
                    </span>
                  </div>
                  <Button asChild className="mt-5 w-full" size="lg">
                    <Link href="/register">
                      <CalendarCheck className="h-4 w-4" />
                      Book a Session — ${trainer.hourly}/hr
                    </Link>
                  </Button>
                  <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Availability: {trainer.availability.join(" · ")}
                    </p>
                    <p className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-accent" />
                      {trainer.years} years experience
                    </p>
                    <p className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-success" />
                      Responds within 1 hour
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="lg:col-span-3">
              <Reveal>
                <Badge variant="accent" className="mb-4">
                  {trainer.specialty}
                </Badge>
                <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground sm:text-6xl">
                  {trainer.name}
                </h1>
                <p className="mt-6 whitespace-pre-line leading-relaxed text-muted-foreground">
                  {trainer.longBio}
                </p>
              </Reveal>

              <Reveal delay={0.1} className="mt-8">
                <h2 className="font-display text-xl font-bold uppercase tracking-wide text-foreground">
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
              </Reveal>

              <Reveal delay={0.15} className="mt-10">
                <h2 className="font-display text-xl font-bold uppercase tracking-wide text-foreground">
                  Member Reviews
                </h2>
                <div className="mt-5 space-y-4">
                  {trainer.reviews_list.map((review) => (
                    <div
                      key={review.name}
                      className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{review.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{review.name}</p>
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
                        <span className="text-xs text-muted-foreground">Verified member</span>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
