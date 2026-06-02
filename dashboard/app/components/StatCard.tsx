"use client";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  delta?: string;
  featured?: boolean;
  delay?: number;
}

export default function StatCard({ title, value, subtitle, delta, featured, delay = 0 }: StatCardProps) {
  return (
    <div
      className="animate-fade-up relative flex flex-col justify-between p-5 transition-transform"
      style={{
        animationDelay: `${delay}ms`,
        background: featured ? "linear-gradient(155deg, var(--accent), var(--accent-deep))" : "var(--bg-card)",
        border: featured ? "none" : "1px solid var(--border)",
        borderRadius: "var(--radius)",
        minHeight: "150px",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "translateY(0)"}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium" style={{ color: featured ? "rgba(255,255,255,0.85)" : "var(--text-body)" }}>
          {title}
        </span>
        <span
          className="flex items-center justify-center w-7 h-7 rounded-full shrink-0"
          style={{
            border: `1px solid ${featured ? "rgba(255,255,255,0.4)" : "var(--border-strong)"}`,
            color: featured ? "#fff" : "var(--text-muted)",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
        </span>
      </div>

      <div>
        <div
          className="text-4xl font-semibold tracking-tight leading-none"
          style={{ color: featured ? "#fff" : "var(--text-strong)" }}
        >
          {value}
        </div>
        {(delta || subtitle) && (
          <div className="mt-3 flex items-center gap-1.5">
            {delta && (
              <span
                className="inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-md"
                style={{
                  background: featured ? "rgba(255,255,255,0.18)" : "var(--ok-soft)",
                  color: featured ? "#fff" : "var(--ok)",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
                {delta}
              </span>
            )}
            <span className="text-[12px]" style={{ color: featured ? "rgba(255,255,255,0.8)" : "var(--text-muted)" }}>
              {subtitle}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
