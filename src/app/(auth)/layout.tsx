import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import { Floating } from "@/components/ui/floating";
import { Zap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen bg-background">
      <div className="bg-grid pointer-events-none fixed inset-0" />
      <AnimatedGradient className="left-0 top-0 h-96 w-96 opacity-60" />

      <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-border bg-surface/40 p-12 lg:flex">
        <Floating className="right-16 top-32" distance={20}>
          <div className="glass rounded-2xl px-5 py-4 shadow-card">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Today&apos;s Workout</p>
            <p className="mt-1 font-display text-xl font-bold text-foreground">Leg Day · 45 min</p>
          </div>
        </Floating>
        <Floating className="bottom-40 left-16" duration={7} delay={1} distance={16}>
          <div className="glass flex items-center gap-3 rounded-2xl px-5 py-4 shadow-card">
            <Zap className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm font-semibold text-foreground">AI Coach Online</p>
              <p className="text-xs text-muted-foreground">Ready when you are</p>
            </div>
          </div>
        </Floating>
        <div className="relative z-10">
          <Logo />
          <h2 className="mt-8 max-w-md font-display text-4xl font-bold uppercase leading-tight tracking-tight text-foreground">
            Your transformation starts with <span className="text-gradient">one click</span>
          </h2>
          <p className="mt-4 max-w-sm text-muted-foreground">
            Join 12,000+ members training smarter with AI-powered coaching.
          </p>
          <div className="mt-8 flex items-center gap-6 text-xs uppercase tracking-widest text-muted-foreground">
            <span>⚡ 85 Trainers</span>
            <span>🔥 240+ Classes</span>
            <span>🏆 12k Members</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Titan Fitness. All rights reserved.
        </p>
      </aside>

      <main className="relative flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-10 flex justify-center lg:hidden">
            <Logo />
          </div>
          {children}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">
              ← Back to homepage
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
