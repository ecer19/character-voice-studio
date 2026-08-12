export function FloatingOrbs() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-purple-400/50 blur-3xl animate-float-a" />
      <div className="absolute -right-20 top-1/3 h-64 w-64 rounded-full bg-fuchsia-400/45 blur-3xl animate-float-b" />
      <div className="absolute left-8 bottom-24 h-52 w-52 rounded-full bg-violet-400/45 blur-3xl animate-float-c" />
      <div className="absolute -right-10 bottom-10 h-80 w-80 rounded-full bg-purple-300/50 blur-3xl animate-float-a" />

      <div className="absolute left-12 top-1/4 h-3 w-3 rounded-full bg-purple-500/70 animate-drift-slow" />
      <div className="absolute right-16 top-1/2 h-2 w-2 rounded-full bg-fuchsia-500/70 animate-float-c" />
      <div className="absolute left-20 bottom-1/3 h-2.5 w-2.5 rounded-full bg-violet-500/70 animate-drift-slow" />
      <div className="absolute right-10 bottom-1/4 h-3 w-3 rounded-full bg-purple-400/70 animate-float-b" />
    </div>
  );
}
