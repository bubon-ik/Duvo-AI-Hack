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
      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-surface)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="font-mono text-xs font-medium tabular-nums" style={{ color, minWidth: "1.75rem" }}>
        {score}
      </span>
    </div>
  );
}

export default function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  const risky = [...invoices].sort((a, b) => b.risk_score - a.risk_score);

  return (
    <div
      className="animate-fade-up overflow-hidden"
      style={{
        animationDelay: "500ms",
        background: "var(--bg-panel)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
      }}
    >
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div>
          <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Latest risky invoices
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
            Sorted by risk score, {risky.length} records
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "var(--accent)" }} />
          <span className="text-[10px] font-mono tracking-wide" style={{ color: "var(--text-dim)" }}>LIVE</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Invoice", "Vendor", "Amount", "Risk", "Status", "Issue", "Action"].map(h => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-[10px] font-medium tracking-wide uppercase"
                  style={{ color: "var(--text-dim)" }}
                >
                  {h}
                </th>
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
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg-panel-hover)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs font-medium" style={{ color: "var(--accent)" }}>
                      {inv.invoice_number}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                      {inv.vendor_name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm tabular-nums" style={{ color: "var(--text-primary)" }}>
                      {inv.amount != null
                        ? `€${inv.amount.toLocaleString("cs-CZ")}`
                        : <span style={{ color: "var(--text-dim)" }}>n/a</span>}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <RiskBar score={inv.risk_score} />
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap"
                      style={{ color: s.color, background: s.bg }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                      {s.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-[220px]">
                    <span className="text-xs truncate block" style={{ color: "var(--text-secondary)" }}>
                      {inv.reasons || <span style={{ color: "var(--text-dim)" }}>None</span>}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs" style={{ color: "var(--text-dim)" }}>
                      {inv.suggested_action}
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
