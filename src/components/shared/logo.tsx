import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
}

export function Logo({ className, href = "/" }: LogoProps) {
  return (
    <Link href={href} className={cn("group flex items-center gap-2.5", className)}>
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-glow transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
        <Dumbbell className="h-5 w-5 text-white" />
        <span className="absolute -inset-1 -z-10 rounded-xl bg-primary/30 blur-lg opacity-0 transition-opacity group-hover:opacity-100" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-bold uppercase tracking-widest text-foreground">
          Titan<span className="text-primary">Fitness</span>
        </span>
        <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Train Harder
        </span>
      </span>
    </Link>
  );
}
