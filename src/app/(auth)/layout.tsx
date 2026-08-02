import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background relative flex min-h-screen">
      <aside className="border-border bg-surface/40 relative hidden w-1/2 flex-col justify-between border-r p-12 lg:flex">
        <div>
          <Logo />
          <h2 className="font-display text-foreground mt-8 max-w-md text-4xl leading-tight font-bold tracking-[-0.02em]">
            Your transformation starts with <span className="text-primary">one click</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-sm">
            Join 12,000+ members training smarter with AI-powered coaching.
          </p>
          <div className="text-muted-foreground mt-8 flex items-center gap-6 text-xs">
            <span>85 trainers</span>
            <span>240+ classes weekly</span>
            <span>12k members</span>
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
