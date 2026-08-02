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
      <span className="bg-primary flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105">
        <Dumbbell className="h-5 w-5 text-white" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-foreground text-xl font-bold tracking-tight">
          Titan<span className="text-primary">Fitness</span>
        </span>
        <span className="text-muted-foreground text-[9px] font-medium tracking-[0.25em] uppercase">
          Train Harder
        </span>
      </span>
    </Link>
  );
}
