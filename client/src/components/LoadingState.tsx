export function LoadingState() {
  return (
    <div className="space-y-4" aria-live="polite" aria-busy="true">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="h-56 animate-pulse rounded-3xl bg-slate-200/70" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="h-24 animate-pulse rounded-3xl bg-slate-200/70" />
          <div className="h-24 animate-pulse rounded-3xl bg-slate-200/70" />
        </div>
      </div>
      <div className="rounded-3xl bg-white/80 p-5 shadow-glow ring-1 ring-slate-200/80">
        <div className="space-y-3">
          <div className="h-7 w-48 animate-pulse rounded-full bg-slate-200/80" />
          <div className="h-4 w-72 animate-pulse rounded-full bg-slate-200/70" />
          <div className="space-y-3 pt-3">
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
