// Reusable logo component using the actual favicon.svg
interface LogoProps {
  size?: number;
  showName?: boolean;
  className?: string;
}

export function Logo({ size = 32, showName = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/logo.jpg"
        alt="Blackhole logo"
        className="shrink-0 rounded-full object-cover shadow-[0_0_8px_rgba(134,59,255,0.4)] border border-[var(--border-subtle)]"
        style={{ width: size, height: size }}
      />
      {showName && (
        <span className="font-display font-bold text-xl tracking-tight">Blackhole</span>
      )}
    </div>
  );
}
