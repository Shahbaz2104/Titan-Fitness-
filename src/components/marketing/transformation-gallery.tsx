"use client";

import * as React from "react";
import { AnimeText } from "@/components/ui/anime-text";
import { cn } from "@/lib/utils";

const GALLERY = [
  {
    label: "Weight Loss",
    before: "/images/transformations/weight-loss-before.jpg",
    after: "/images/transformations/weight-loss-after.jpg",
  },
  {
    label: "Muscle Gain",
    before: "/images/transformations/muscle-gain-before.jpg",
    after: "/images/transformations/muscle-gain-after.jpg",
  },
  {
    label: "Endurance",
    before: "/images/transformations/endurance-before.jpg",
    after: "/images/transformations/endurance-after.jpg",
  },
  {
    label: "Strength",
    before: "/images/transformations/strength-before.jpg",
    after: "/images/transformations/strength-after.jpg",
  },
];

function useImage(src?: string | null) {
  const [state, setState] = React.useState<"loading" | "ready" | "failed">(() =>
    src ? "loading" : "failed"
  );

  React.useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => setState("ready");
    img.onerror = () => setState("failed");
    img.src = src;
  }, [src]);

  return state;
}

interface BeforeAfterProps {
  before?: string | null;
  after?: string | null;
  label: string;
}

function BeforeAfter({ before, after, label }: BeforeAfterProps) {
  const [value, setValue] = React.useState(50);
  const beforeState = useImage(before);
  const afterState = useImage(after);
  const hasImages = beforeState !== "failed" && afterState !== "failed";

  if (!hasImages) {
    return (
      <div className="border-border bg-surface-2 flex aspect-[4/3] items-end rounded-xl border p-8">
        <div>
          <p className="font-display text-foreground text-xl font-semibold">{label}</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Member success story · verified by Titan coaches
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-border relative aspect-[4/3] overflow-hidden rounded-xl border select-none">
      {after && (
        <img
          src={after}
          alt={`${label} after`}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      )}
      {before && (
        <img
          src={before}
          alt={`${label} before`}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 0 0 ${value}%)` }}
          draggable={false}
        />
      )}
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-label={`Compare ${label} before and after`}
        className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />
      <div
        className="absolute top-0 bottom-0 w-px bg-white/90 shadow-[0_0_8px_rgba(0,0,0,0.5)]"
        style={{ left: `${value}%` }}
      />
      <span className="bg-background/60 text-muted-foreground absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider backdrop-blur-sm">
        Before
      </span>
      <span className="bg-background/60 text-success absolute top-3 right-3 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider backdrop-blur-sm">
        After
      </span>
    </div>
  );
}

export function TransformationGallery() {
  const [active, setActive] = React.useState(0);

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-foreground text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
              <AnimeText text="The proof is in the mirror" effect="blur" scroll />
            </h2>
            <p className="text-muted-foreground mt-5 max-w-md leading-relaxed">
              Thousands of members have rewritten their stories at Titan. Track your own
              transformation with progress photos and body metrics — because the scale lies, but the
              mirror doesn&apos;t.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {GALLERY.map((item, i) => (
                <button
                  key={item.label}
                  onClick={() => setActive(i)}
                  className={cn(
                    "rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-200",
                    active === i
                      ? "border-primary text-primary bg-primary/5"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <BeforeAfter
            key={GALLERY[active].label}
            before={GALLERY[active].before}
            after={GALLERY[active].after}
            label={GALLERY[active].label}
          />
        </div>
      </div>
    </section>
  );
}
