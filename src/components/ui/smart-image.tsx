"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SmartImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  fallback?: React.ReactNode;
  priority?: boolean;
}

export function SmartImage({
  src,
  alt,
  className,
  fallbackClassName,
  fallback,
  priority,
}: SmartImageProps) {
  const [failed, setFailed] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex items-center justify-center",
          fallbackClassName ?? "bg-surface-2",
          className
        )}
      >
        {fallback}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      onError={() => setFailed(true)}
      onLoad={() => setLoaded(true)}
      className={cn(
        "transition-[opacity,transform] duration-500",
        loaded ? "opacity-100" : "opacity-0",
        className
      )}
    />
  );
}
