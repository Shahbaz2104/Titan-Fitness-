
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl animate-pulse" />
        <div className="relative h-16 w-16 animate-spin-slow rounded-full border-2 border-primary/20 border-t-primary" />
      </div>
      <div className="flex flex-col items-center gap-3">
        <p className="font-display text-xl font-bold uppercase tracking-widest text-foreground">
          Titan<span className="text-primary">Fitness</span>
        </p>
        <div className="h-1 w-40 overflow-hidden rounded-full bg-surface-2">
          <div className="shimmer-line h-full w-full" />
        </div>
      </div>
    </div>
  );
}
