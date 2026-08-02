export default function Loading() {
  return (
    <div className="bg-background fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="bg-primary/30 absolute inset-0 animate-pulse rounded-full blur-2xl" />
        <div className="animate-spin-slow border-primary/20 border-t-primary relative h-16 w-16 rounded-full border-2" />
      </div>
      <div className="flex flex-col items-center gap-3">
        <p className="font-display text-foreground text-xl font-bold tracking-[-0.02em]">
          Titan<span className="text-primary">Fitness</span>
        </p>
        <div className="bg-surface-2 h-1 w-40 overflow-hidden rounded-full">
          <div className="shimmer-line h-full w-full" />
        </div>
      </div>
    </div>
  );
}
