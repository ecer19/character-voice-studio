export function FloatingOrbs() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      <div className="absolute left-12 top-1/4 h-1 w-1 rounded-full bg-gold/70 animate-drift-slow" />
      <div className="absolute right-16 top-1/2 h-1 w-1 rounded-full bg-gold/50 animate-float-c" />
      <div className="absolute left-20 bottom-1/3 h-[3px] w-[3px] rounded-full bg-gold/60 animate-drift-slow" />
      <div className="absolute right-10 bottom-1/4 h-1 w-1 rounded-full bg-gold/60 animate-float-b" />
      <div className="absolute left-1/3 top-16 h-[3px] w-[3px] rounded-full bg-gold/40 animate-float-a" />
    </div>
  );
}
