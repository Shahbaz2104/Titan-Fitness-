import Link from "next/link";
import { Compass, Home, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-2xl">
        <SearchX className="h-8 w-8" />
      </span>
      <div>
        <p className="text-primary font-display text-sm font-bold tracking-[0.3em] uppercase">
          404
        </p>
        <h1 className="font-display text-foreground mt-2 text-3xl font-bold tracking-tight uppercase">
          Page not found
        </h1>
        <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
          The page you are looking for was moved, removed, or never existed.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4" />
            Back home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <Compass className="h-4 w-4" />
            Open dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
