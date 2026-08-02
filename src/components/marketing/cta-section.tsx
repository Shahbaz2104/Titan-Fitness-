import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimeText } from "@/components/ui/anime-text";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="border-primary/25 relative mx-auto max-w-5xl overflow-hidden rounded-2xl border bg-surface px-6 py-16 text-center sm:px-16 sm:py-20">
        <div className="bg-primary/10 pointer-events-none absolute -top-24 left-1/2 h-64 w-[560px] -translate-x-1/2 rounded-full blur-3xl" />
        <div className="relative">
          <h2 className="font-display text-foreground mx-auto max-w-2xl text-3xl font-bold tracking-[-0.02em] sm:text-5xl">
            <AnimeText text="Your first month is 50% off." effect="rise" scroll />
          </h2>
          <p className="text-muted-foreground mx-auto mt-5 max-w-xl">
            Join 12,000+ members who chose to become unstoppable. Your AI coach is waiting.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="xl">
              <Link href="/register">
                Claim your offer
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/contact">
                <Mail className="h-5 w-5" />
                Talk to us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
