"use client";

export type AccentColor = "red" | "green" | "yellow" | "blue" | "purple";

interface StatCardProps {
  title: string;
  value: string | number;
  iconSvg: React.ReactNode;
  accent: AccentColor;
  subtitle?: string;
  delay?: number;
}

const accentMap: Record<AccentColor, { border: string; glow: string; icon: string; iconColor: string; val: string }> = {
  red:    { border: "#ff3b3b", glow: "rgba(255,59,59,0.15)",    icon: "rgba(255,59,59,0.12)",  iconColor: "#ff3b3b",  val: "#ff3b3b" },
  green:  { border: "#00e676", glow: "rgba(0,230,118,0.12)",    icon: "rgba(0,230,118,0.10)",  iconColor: "#00e676",  val: "#00e676" },
  yellow: { border: "#ffb300", glow: "rgba(255,179,0,0.12)",    icon: "rgba(255,179,0,0.10)",  iconColor: "#ffb300",  val: "#ffb300" },
  blue:   { border: "#448aff", glow: "rgba(68,138,255,0.12)",   icon: "rgba(68,138,255,0.10)", iconColor: "#448aff",  val: "#e8e8f0" },
  purple: { border: "#b388ff", glow: "rgba(179,136,255,0.12)",  icon: "rgba(179,136,255,0.10)", iconColor: "#b388ff", val: "#b388ff" },
};

export default function StatCard({ title, value, iconSvg, accent, subtitle, delay = 0 }: StatCardProps) {
  const a = accentMap[accent];

  return (
    <div
      className="animate-fade-up relative overflow-hidden rounded-sm p-5 flex flex-col gap-3 cursor-default"
      style={{
        animationDelay: `${delay}ms`,
        background: "var(--bg-panel)",
        border: "1px solid var(--border)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = a.border + "66";
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${a.glow}, inset 0 1px 0 rgba(255,255,255,0.04)`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.03)";
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${a.border}88, transparent)` }} />

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-medium tracking-[0.15em] uppercase" style={{ color: "var(--text-dim)" }}>
          {title}
        </span>
        <div className="p-1.5 rounded-sm flex items-center justify-center" style={{ background: a.icon, color: a.iconColor }}>
          {iconSvg}
        </div>
      </div>

      <div>
        <div className="text-3xl font-mono font-semibold leading-none tracking-tight" style={{ color: a.val }}>
          {value}
        </div>
        {subtitle && (
          <div className="mt-1.5 text-[11px] font-mono" style={{ color: "var(--text-dim)" }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
