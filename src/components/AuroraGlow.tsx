export function AuroraGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      <div className="animate-aurora-spin absolute left-1/2 top-1/2 h-[140vmax] w-[140vmax] -translate-x-1/2 -translate-y-1/2 opacity-40 dark:opacity-30">
        <div
          className="h-full w-full"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(168,85,247,0.35), rgba(217,70,239,0.25), rgba(255,255,255,0), rgba(139,92,246,0.35), rgba(168,85,247,0.35))",
          }}
        />
      </div>
      <div className="animate-glow-pulse absolute left-1/2 top-1/3 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-400/30 blur-[100px]" />
      <div className="animate-glow-pulse absolute right-1/4 bottom-0 h-[28rem] w-[28rem] rounded-full bg-purple-400/30 blur-[100px]" />
    </div>
  );
}
