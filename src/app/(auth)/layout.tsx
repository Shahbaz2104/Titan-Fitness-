import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import { Floating } from "@/components/ui/floating";
import { Zap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background relative flex min-h-screen">
      <div className="bg-grid pointer-events-none fixed inset-0" />
      <AnimatedGradient className="top-0 left-0 h-96 w-96 opacity-60" />

      <aside className="border-border bg-surface/40 relative hidden w-1/2 flex-col justify-between overflow-hidden border-r p-12 lg:flex">
        <Floating className="top-32 right-16" distance={20}>
          <div className="glass shadow-card rounded-2xl px-5 py-4">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Today&apos;s Workout
            </p>
            <p className="font-display text-foreground mt-1 text-xl font-bold">Leg Day · 45 min</p>
          </div>
        </Floating>
        <Floating className="bottom-40 left-16" duration={7} delay={1} distance={16}>
          <div className="glass shadow-card flex items-center gap-3 rounded-2xl px-5 py-4">
            <Zap className="text-accent h-5 w-5" />
            <div>
              <p className="text-foreground text-sm font-semibold">AI Coach Online</p>
              <p className="text-muted-foreground text-xs">Ready when you are</p>
            </div>
          </div>
        </Floating>
        <div className="relative z-10">
          <Logo />
          <h2 className="font-display text-foreground mt-8 max-w-md text-4xl leading-tight font-bold tracking-tight uppercase">
            Your transformation starts with <span className="text-gradient">one click</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-sm">
            Join 12,000+ members training smarter with AI-powered coaching.
          </p>
          <div className="text-muted-foreground mt-8 flex items-center gap-6 text-xs tracking-widest uppercase">
            <span>⚡ 85 Trainers</span>
            <span>🔥 240+ Classes</span>
            <span>🏆 12k Members</span>
          </div>
        </div>
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} Titan Fitness. All rights reserved.
        </p>
      </aside>

      <main className="relative flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-10 flex justify-center lg:hidden">
            <Logo />
          </div>
          {children}
          <p className="text-muted-foreground mt-8 text-center text-xs">
            <Link href="/" className="hover:text-primary transition-colors">
              ← Back to homepage
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
