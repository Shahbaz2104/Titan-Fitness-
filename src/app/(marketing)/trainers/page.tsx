import Link from "next/link";
import { Award, CalendarCheck, Star } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "@/components/ui/smart-image";
import { GsapReveal } from "@/components/ui/gsap-reveal";
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
    hourly: 50,
    availability: ["Wed–Sun", "8am–4pm"],
  },
];

export default function TrainersPage() {
  return (
    <>
      <PageHeader
        badge="Elite Coaches"
        title="Meet the"
        highlight="Titan team"
        description="85+ certified professionals. Real experience. Real results. Book your first session today."
      />

      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {TRAINERS.map((trainer, i) => (
            <GsapReveal key={trainer.slug} delay={(i % 3) * 0.07}>
              <Link
                href={`/trainers/${trainer.slug}`}
                className="group border-border bg-surface/60 hover:border-white/15 flex h-full flex-col rounded-xl border transition-colors duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <SmartImage
                    src={`/images/trainers/${trainer.slug}.jpg`}
                    alt={trainer.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    fallbackClassName="bg-surface-2 h-full w-full"
                  />
                  <span className="border-border bg-background/70 text-warning absolute top-3 left-3 flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                    <Star className="fill-warning h-3 w-3" />
                    {trainer.rating}
                    <span className="text-muted-foreground">({trainer.reviews})</span>
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-display text-foreground text-xl font-bold tracking-[-0.01em]">
                    {trainer.name}
                  </h2>
                  <p className="text-accent mt-1 flex items-center gap-1.5 text-sm">
                    <Award className="h-4 w-4" />
                    {trainer.specialty}
                  </p>
                  <p className="text-muted-foreground mt-3 flex-1 text-sm leading-relaxed">
                    {trainer.bio}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {trainer.certifications.map((cert) => (
                      <Badge key={cert} variant="secondary">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                  <div className="border-border mt-5 flex items-center justify-between border-t pt-4">
                    <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                      <CalendarCheck className="text-success h-4 w-4" />
                      {trainer.availability.join(" · ")}
                    </span>
                    <span className="font-display text-foreground text-lg font-bold">
                      ${trainer.hourly}
                      <span className="text-muted-foreground text-xs font-normal">/hr</span>
                    </span>
                  </div>
                </div>
              </Link>
            </GsapReveal>
          ))}
        </div>
      </section>
    </>
  );
}
