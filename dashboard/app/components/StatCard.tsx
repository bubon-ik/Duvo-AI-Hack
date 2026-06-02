"use client";

export type Tone = "neutral" | "ok" | "warn" | "danger";

interface StatCardProps {
  title: string;
  value: string | number;
  iconSvg: React.ReactNode;
  tone?: Tone;
  subtitle?: string;
  delay?: number;
}

const toneMap: Record<Tone, { val: string; chip: string; chipBg: string }> = {
  neutral: { val: "var(--text-primary)", chip: "var(--accent)",  chipBg: "var(--accent-soft)" },
  ok:      { val: "var(--ok)",           chip: "var(--ok)",      chipBg: "var(--ok-soft)" },
  warn:    { val: "var(--warn)",         chip: "var(--warn)",    chipBg: "var(--warn-soft)" },
  danger:  { val: "var(--danger)",       chip: "var(--danger)",  chipBg: "var(--danger-soft)" },
};

export default function StatCard({ title, value, iconSvg, tone = "neutral", subtitle, delay = 0 }: StatCardProps) {
  const t = toneMap[tone];

  return (
    <div
      className="animate-fade-up relative flex flex-col gap-4 p-5 cursor-default"
      style={{
        animationDelay: `${delay}ms`,
        background: "var(--bg-panel)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        transition: "border-color 0.18s, transform 0.18s",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--border-bright)";
        el.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--border)";
        el.style.transform = "translateY(0)";
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium tracking-wide uppercase" style={{ color: "var(--text-secondary)" }}>
          {title}
        </span>
        <div
          className="flex items-center justify-center w-7 h-7 rounded-md"
          style={{ background: t.chipBg, color: t.chip }}
        >
          {iconSvg}
        </div>
      </div>

      <div>
        <div className="text-[2rem] font-mono font-semibold leading-none tracking-tight" style={{ color: t.val }}>
          {value}
        </div>
        {subtitle && (
          <div className="mt-2 text-xs" style={{ color: "var(--text-dim)" }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
