"use client";
import { Invoice } from "../data/invoices";

const statusConfig = {
  approved:     { label: "Approved",     color: "var(--ok)",     bg: "var(--ok-soft)" },
  needs_review: { label: "Needs review", color: "var(--warn)",   bg: "var(--warn-soft)" },
  dispute:      { label: "Dispute",      color: "var(--danger)", bg: "var(--danger-soft)" },
};

function RiskBar({ score }: { score: number }) {
  const color = score >= 80 ? "var(--danger)" : score >= 40 ? "var(--warn)" : "var(--ok)";
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)" }}>
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="font-mono text-xs font-semibold tabular-nums" style={{ color, minWidth: "1.75rem" }}>{score}</span>
    </div>
  );
}

export default function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  const risky = [...invoices].sort((a, b) => b.risk_score - a.risk_score);

  return (
    <div
      className="animate-fade-up overflow-hidden"
      style={{ animationDelay: "360ms", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}
    >
      <div className="px-6 py-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold" style={{ color: "var(--text-strong)" }}>Latest risky invoices</h2>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--text-muted)" }}>Sorted by risk score</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-lg" style={{ color: "var(--text-muted)", background: "var(--bg-subtle)" }}>
          <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "var(--accent)" }} />
          Live
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
              {["Invoice", "Vendor", "Amount", "Risk", "Status", "Issue"].map(h => (
                <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold tracking-wide uppercase" style={{ color: "var(--text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {risky.map((inv, i) => {
              const s = statusConfig[inv.status];
              return (
                <tr
                  key={inv.invoice_number}
                  className="transition-colors"
                  style={{ borderBottom: i < risky.length - 1 ? "1px solid var(--border)" : undefined }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg-subtle)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs font-semibold" style={{ color: "var(--accent)" }}>{inv.invoice_number}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium" style={{ color: "var(--text-strong)" }}>{inv.vendor_name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm tabular-nums" style={{ color: "var(--text-body)" }}>
                      {inv.amount != null ? `€${inv.amount.toLocaleString("cs-CZ")}` : <span style={{ color: "var(--text-muted)" }}>n/a</span>}
                    </span>
                  </td>
                  <td className="px-6 py-4"><RiskBar score={inv.risk_score} /></td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap" style={{ color: s.color, background: s.bg }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                      {s.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-[220px]">
                    <span className="text-[13px] truncate block" style={{ color: "var(--text-body)" }}>
                      {inv.reasons || <span style={{ color: "var(--text-muted)" }}>None</span>}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
