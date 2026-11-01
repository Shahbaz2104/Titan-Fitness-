"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
      <span className="bg-warning/10 text-warning flex h-14 w-14 items-center justify-center rounded-2xl">
        <AlertTriangle className="h-7 w-7" />
      </span>
      <div>
        <h2 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
          Admin panel error
        </h2>
        <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
          {error.message || "This admin section could not be loaded. Please try again."}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>
          <RotateCcw className="h-4 w-4" />
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin">Back to overview</Link>
        </Button>
      </div>
    </div>
  );
}
