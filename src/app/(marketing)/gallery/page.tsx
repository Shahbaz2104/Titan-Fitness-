"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { SmartImage } from "@/components/ui/smart-image";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "strength", label: "Strength" },
  { id: "classes", label: "Classes" },
  { id: "members", label: "Members" },
  { id: "facility", label: "Facility" },
];

const TILES = [
  { id: "power-rack", category: "strength", caption: "Power rack zone", image: "/images/gallery/power-rack.jpg", h: "row-span-2" },
  { id: "hiit-studio", category: "classes", caption: "HIIT studio", image: "/images/gallery/hiit-studio.jpg", h: "" },
  { id: "member-month", category: "members", caption: "Member of the month", image: "/images/gallery/member-of-the-month.jpg", h: "" },
  { id: "main-floor", category: "facility", caption: "Main floor", image: "/images/gallery/main-floor.jpg", h: "row-span-2" },
  { id: "yoga-room", category: "classes", caption: "Yoga room", image: "/images/gallery/yoga-room.jpg", h: "" },
  { id: "challenge-winners", category: "members", caption: "Challenge winners", image: "/images/gallery/challenge-winners.jpg", h: "" },
  { id: "free-weights", category: "strength", caption: "Free weights", image: "/images/gallery/free-weights.jpg", h: "" },
  { id: "recovery-suite", category: "facility", caption: "Recovery suite", image: "/images/gallery/recovery-suite.jpg", h: "" },
  { id: "boxing-corner", category: "classes", caption: "Boxing corner", image: "/images/gallery/boxing-corner.jpg", h: "row-span-2" },
  { id: "community-night", category: "members", caption: "Community night", image: "/images/gallery/community-night.jpg", h: "" },
];

export default function GalleryPage() {
  const [filter, setFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<(typeof TILES)[number] | null>(null);

  const visible = TILES.filter((tile) => filter === "all" || tile.category === filter);

  return (
    <>
      <PageHeader
        badge="Gallery"
        title="Inside"
        highlight="the gym"
        description="3 branches, 240 weekly classes, and a community of 12,000+ — take a look inside."
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={cn(
                  "rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-200",
                  filter === cat.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="mt-10 grid auto-rows-[200px] grid-cols-2 gap-4 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {visible.map((tile) => (
                <motion.button
                  layout
                  key={tile.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setSelected(tile)}
                  className={cn(
                    "group border-border relative overflow-hidden rounded-xl border",
                    tile.h
                  )}
                  aria-label={`View ${tile.caption}`}
                >
                  <SmartImage
                    src={tile.image}
                    alt={tile.caption}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    fallbackClassName="bg-surface-2 absolute inset-0"
                    fallback={
                      <span className="text-muted-foreground/50 text-sm font-medium">
                        {tile.caption}
                      </span>
                    }
                  />
                  <div className="from-background/80 absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent p-4 pt-10">
                    <p className="text-foreground text-left text-sm font-medium">{tile.caption}</p>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm"
                onClick={() => setSelected(null)}
                role="dialog"
                aria-modal="true"
              >
                <motion.div
                  initial={{ scale: 0.94, y: 16 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.94, y: 16 }}
                  className="relative w-full max-w-3xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setSelected(null)}
                    aria-label="Close"
                    className="bg-background/60 text-foreground absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div className="border-border relative aspect-video overflow-hidden rounded-2xl border">
                    <SmartImage
                      src={selected.image}
                      alt={selected.caption}
                      className="absolute inset-0 h-full w-full object-cover"
                      fallbackClassName="bg-surface-2 absolute inset-0"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-foreground font-medium">{selected.caption}</p>
                    <p className="text-muted-foreground text-xs">Titan Fitness</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
