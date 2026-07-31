"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PHOTOS: { category: string; gradient: string; label: string }[] = [
  { category: "all", gradient: "from-primary/30 to-accent/10", label: "All" },
  { category: "strength", gradient: "from-primary/30 to-accent/10", label: "Strength" },
  { category: "classes", gradient: "from-accent/30 to-warning/10", label: "Classes" },
  { category: "members", gradient: "from-success/30 to-primary/10", label: "Members" },
  { category: "facility", gradient: "from-warning/30 to-accent/10", label: "Facility" },
];

const TILES = [
  { category: "strength", h: "row-span-2", gradient: "from-primary/30 to-accent/10", icon: "🏋️", caption: "Power Rack Zone" },
  { category: "classes", h: "", gradient: "from-accent/30 to-warning/10", icon: "🔥", caption: "HIIT Studio" },
  { category: "members", h: "", gradient: "from-success/30 to-primary/10", icon: "💪", caption: "Member of the Month" },
  { category: "facility", h: "row-span-2", gradient: "from-warning/30 to-accent/10", icon: "🏟️", caption: "Main Floor" },
  { category: "classes", h: "", gradient: "from-accent/30 to-warning/10", icon: "🧘", caption: "Yoga Room" },
  { category: "members", h: "", gradient: "from-success/30 to-primary/10", icon: "🏆", caption: "Challenge Winners" },
  { category: "strength", h: "", gradient: "from-primary/30 to-accent/10", icon: "🏋️‍♀️", caption: "Free Weights" },
  { category: "facility", h: "", gradient: "from-warning/30 to-accent/10", icon: "🚿", caption: "Recovery Suite" },
  { category: "classes", h: "row-span-2", gradient: "from-accent/30 to-warning/10", icon: "🥊", caption: "Boxing Corner" },
  { category: "members", h: "", gradient: "from-success/30 to-primary/10", icon: "🤝", caption: "Community Night" },
];

export default function GalleryPage() {
  const [filter, setFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<number | null>(null);

  const visible = TILES.map((tile, i) => ({ ...tile, index: i })).filter(
    (tile) => filter === "all" || tile.category === filter
  );

  const selectedTile = selected !== null ? TILES[selected] : null;

  return (
    <>
      <PageHeader
        badge="Gallery"
        title="Inside"
        highlight="The Temple"
        description="3 branches, 240 weekly classes, and a community of 12,000+ — take a look inside."
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {PHOTOS.map((photo) => (
              <button
                key={photo.category}
                onClick={() => setFilter(photo.category)}
                className={cn(
                  "rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300",
                  filter === photo.category
                    ? "border-primary bg-primary/10 text-primary shadow-glow"
                    : "border-border bg-surface text-muted-foreground hover:border-white/20 hover:text-foreground"
                )}
              >
                {photo.label}
              </button>
            ))}
          </div>

          <div className="mt-10 grid auto-rows-[200px] grid-cols-2 gap-4 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {visible.map((tile) => (
                <motion.button
                  layout
                  key={tile.index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setSelected(tile.index)}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-border",
                    tile.h
                  )}
                  aria-label={`View ${tile.caption}`}
                >
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center bg-gradient-to-br transition-transform duration-700 group-hover:scale-110",
                      tile.gradient
                    )}
                  >
                    <span className="text-5xl transition-transform duration-500 group-hover:scale-125">
                      {tile.icon}
                    </span>
                  </div>
                  <div className="bg-grid absolute inset-0 opacity-30" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-4">
                    <p className="flex items-center gap-2 text-left text-sm font-medium text-foreground">
                      <Eye className="h-3.5 w-3.5 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                      {tile.caption}
                    </p>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {selectedTile && (
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
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-border"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className={cn(
                      "relative flex aspect-video items-center justify-center bg-gradient-to-br",
                      selectedTile.gradient
                    )}
                  >
                    <span className="text-8xl">{selectedTile.icon}</span>
                    <div className="bg-grid absolute inset-0 opacity-40" />
                  </div>
                  <div className="flex items-center justify-between bg-surface p-5">
                    <div>
                      <p className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
                        {selectedTile.caption}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {PHOTOS.find((p) => p.category === selectedTile.category)?.label} · Titan Fitness
                      </p>
                    </div>
                    <Badge variant="secondary">Titan</Badge>
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
