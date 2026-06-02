"use client";

interface Segment { label: string; value: number; color: string; }

export default function StatusDonut({ segments, total }: { segments: Segment[]; total: number }) {
  const radius = 60;
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  const approvedPct = Math.round(((segments.find(s => s.label === "Approved")?.value ?? 0) / total) * 100);

  return (
    <div
      className="animate-fade-up flex flex-col p-5"
      style={{ animationDelay: "300ms", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}
    >
      <h2 className="text-base font-semibold mb-4" style={{ color: "var(--text-strong)" }}>Review breakdown</h2>

      <div className="flex items-center justify-center relative my-2">
        <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="var(--bg-hover)" strokeWidth="16" />
          {segments.map((seg, i) => {
            const len = (seg.value / total) * circ;
            const el = (
              <circle
                key={i}
                cx="80" cy="80" r={radius} fill="none"
                stroke={seg.color} strokeWidth="16" strokeLinecap="round"
                strokeDasharray={`${len} ${circ - len}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return el;
          })}
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-semibold tracking-tight" style={{ color: "var(--text-strong)" }}>{approvedPct}%</span>
          <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>approved</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-3">
        {segments.map(seg => (
          <div key={seg.label} className="flex items-center justify-between text-[13px]">
            <span className="flex items-center gap-2" style={{ color: "var(--text-body)" }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: seg.color }} />
              {seg.label}
            </span>
            <span className="font-medium tabular-nums" style={{ color: "var(--text-strong)" }}>{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
