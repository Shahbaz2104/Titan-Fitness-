import Link from "next/link";
import { Clock, ArrowRight, MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { GsapReveal } from "@/components/ui/gsap-reveal";
import { AnimeText } from "@/components/ui/anime-text";

const FAQS = [
  {
    q: "How does the AI workout generator work?",
    a: "Tell us your goal, experience level, available equipment, and how many days you can train. Our AI builds a complete weekly program with exercises, sets, reps, rest times, warm-up, and cool-down — all adapted as you log progress.",
  },
  {
    q: "Can I cancel my membership anytime?",
    a: "Yes. There are no contracts or cancellation fees. Manage your membership from the dashboard — cancellations take effect at the end of your current billing cycle.",
  },
  {
    q: "Do I need to be fit to join?",
    a: "Absolutely not. Our programs range from absolute beginner to elite. Every plan adapts to your current level, and our coaches will guide you every step of the way.",
  },
  {
    q: "What equipment do I need for AI-generated workouts?",
    a: "The generator supports everything from bodyweight-only to full gym. Select what you have — dumbbells, bands, machines — and we'll build around it.",
  },
  {
    q: "How do QR check-ins work?",
    a: "Each member gets a unique QR membership card in the app. Scan at the front desk on arrival — your attendance, streaks, and rewards update automatically.",
  },
  {
    q: "Can I book personal training sessions?",
    a: "Yes. Browse trainer profiles, check live availability, and book 1-on-1 sessions directly in the app. Elite members get 4 sessions included monthly.",
  },
];

export function FaqSection() {
  return (
    <section className="border-border bg-surface/30 relative border-y py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
        <GsapReveal className="lg:col-span-2">
          <h2 className="font-display text-foreground text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
            <AnimeText text="Questions? Answered." effect="rise" scroll />
          </h2>
          <p className="text-muted-foreground mt-5 max-w-sm">
            Everything you need to know before you start your journey.
          </p>
          <div className="text-muted-foreground mt-8 flex items-center gap-3 text-sm">
            <Clock className="text-primary h-4 w-4" />
            Average response time: under 2 hours
          </div>
          <Button asChild variant="outline" className="mt-5">
            <Link href="/faq">
              View all FAQs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </GsapReveal>

        <GsapReveal delay={0.15} className="lg:col-span-3">
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((faq, i) => (
              <AccordionItem key={faq.q} value={`item-${i}`}>
                <AccordionTrigger className="text-foreground font-medium">{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="text-muted-foreground mt-6 flex items-center gap-2 text-sm">
            <MessageCircle className="text-accent h-4 w-4" />
            Still have questions?{" "}
            <Link href="/contact" className="text-accent font-medium hover:underline">
              Chat with us
            </Link>
          </p>
        </GsapReveal>
      </div>
    </section>
  );
}
