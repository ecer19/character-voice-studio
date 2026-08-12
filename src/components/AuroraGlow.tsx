export function AuroraGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      <div
        className="animate-lux-glow-drift absolute left-1/2 top-1/2 h-[60rem] w-[60rem] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(52,32,79,0.9), transparent 70%)" }}
      />
      <div
        className="animate-lux-glow-drift-2 absolute right-[10%] top-[15%] h-[26rem] w-[26rem] rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(203,167,105,0.25), transparent 70%)" }}
      />
      <div
        className="animate-lux-glow-drift-2 absolute left-[8%] bottom-[10%] h-[24rem] w-[24rem] rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(52,32,79,0.7), transparent 70%)" }}
      />
    </div>
  );
}
