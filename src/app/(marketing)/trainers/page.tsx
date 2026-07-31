import Link from "next/link";
import { Award, CalendarCheck, Star } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/ui/tilt-card";
import { Reveal } from "@/components/ui/reveal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Trainers",
  description:
    "Meet the Titan Fitness coaching team — 85+ certified professionals specializing in strength, conditioning, yoga, and nutrition.",
  path: "/trainers",
});

const TRAINERS = [
  {
    slug: "marcus-cole",
    name: "Marcus Cole",
    specialty: "Strength & Powerlifting",
    bio: "Former national powerlifting champion with 12 years of coaching experience. Marcus has coached 200+ members to 100kg+ bench presses.",
    years: 12,
    rating: 4.9,
    reviews: 214,
    certifications: ["NSCA-CSCS", "IPF Coach", "CPR/AED"],
    initials: "MC",
    hourly: 65,
    availability: ["Mon–Fri", "6am–2pm"],
  },
  {
    slug: "sara-khan",
    name: "Sara Khan",
    specialty: "Yoga & Mobility",
    bio: "RYT-500 certified yoga instructor blending traditional practice with modern mobility science for athletes.",
    years: 8,
    rating: 5.0,
    reviews: 168,
    certifications: ["RYT-500", "FRS Mobility Specialist"],
    initials: "SK",
    hourly: 55,
    availability: ["Tue–Sat", "7am–3pm"],
  },
  {
    slug: "david-okoro",
    name: "David Okoro",
    specialty: "CrossFit & HIIT",
    bio: "CF-L2 trainer and former competitive CrossFit athlete. David specializes in engine building and WOD pacing.",
    years: 10,
    rating: 4.8,
    reviews: 192,
    certifications: ["CF-L2", "USAW Level 1"],
    initials: "DO",
    hourly: 60,
    availability: ["Mon–Sat", "5am–12pm"],
  },
  {
    slug: "emily-chen",
    name: "Emily Chen",
    specialty: "Weight Loss & Nutrition",
    bio: "Registered nutrition coach focused on sustainable fat loss. Emily pairs evidence-based nutrition with metabolic training.",
    years: 7,
    rating: 4.9,
    reviews: 150,
    certifications: ["PN-L2 Nutrition", "ACE-CPT"],
    initials: "EC",
    hourly: 70,
    availability: ["Mon–Fri", "9am–6pm"],
  },
  {
    slug: "james-carter",
    name: "James Carter",
    specialty: "Bodybuilding & Hypertrophy",
    bio: "NPC bodybuilder and coach focused on physique symmetry, contest prep, and evidence-based hypertrophy.",
    years: 9,
    rating: 4.7,
    reviews: 121,
    certifications: ["NASM-CPT", "PN-L1"],
    initials: "JC",
    hourly: 75,
    availability: ["Mon–Fri", "10am–7pm"],
  },
  {
    slug: "maya-patel",
    name: "Maya Patel",
    specialty: "Calisthenics & Gymnastics",
    bio: "Former gymnast who built one of the strongest bodyweight programs in the city. Pull-up progressions are her art.",
    years: 6,
    rating: 4.9,
    reviews: 98,
    certifications: ["CF-L1", "Gymnastics Coach"],
    initials: "MP",
    hourly: 50,
    availability: ["Wed–Sun", "8am–4pm"],
  },
];

export default function TrainersPage() {
  return (
    <>
      <PageHeader
        badge="Elite Coaches"
        title="Meet The"
        highlight="Titan Team"
        description="85+ certified professionals. Real experience. Real results. Book your first session today."
      />

      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {TRAINERS.map((trainer, i) => (
            <Reveal key={trainer.slug} delay={i * 0.08}>
              <TiltCard maxTilt={8} className="h-full">
                <Link
                  href={`/trainers/${trainer.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-surface/60 backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:shadow-glow"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Avatar className="h-full w-full rounded-none">
                      <AvatarImage src={`/images/trainers/${trainer.slug}.jpg`} alt={trainer.name} />
                      <AvatarFallback className="rounded-none bg-gradient-to-br from-primary/40 to-accent/40 text-4xl">
                        {trainer.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                    <span className="glass absolute left-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-warning">
                      <Star className="h-3 w-3 fill-warning" />
                      {trainer.rating}
                      <span className="text-muted-foreground">({trainer.reviews})</span>
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-display text-xl font-bold uppercase tracking-wide text-foreground">
                      {trainer.name}
                    </h2>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-accent">
                      <Award className="h-4 w-4" />
                      {trainer.specialty}
                    </p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {trainer.bio}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {trainer.certifications.map((cert) => (
                        <Badge key={cert} variant="secondary">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarCheck className="h-4 w-4 text-success" />
                        {trainer.availability.join(" · ")}
                      </span>
                      <span className="font-display text-lg font-bold text-foreground">
                        ${trainer.hourly}
                        <span className="text-xs font-normal text-muted-foreground">/hr</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
