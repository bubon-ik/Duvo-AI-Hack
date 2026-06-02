"use client";
import { Invoice } from "../data/invoices";

const statusConfig = {
  approved:     { label: "APPROVED",     color: "#00e676", bg: "rgba(0,230,118,0.08)",     dot: "#00e676" },
  needs_review: { label: "NEEDS REVIEW", color: "#ffb300", bg: "rgba(255,179,0,0.08)",     dot: "#ffb300" },
  dispute:      { label: "DISPUTE",      color: "#ff3b3b", bg: "rgba(255,59,59,0.08)",     dot: "#ff3b3b" },
};

function RiskBar({ score }: { score: number }) {
  const color = score >= 80 ? "#ff3b3b" : score >= 40 ? "#ffb300" : "#00e676";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1 rounded-full" style={{ background: "var(--bg-surface)" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, background: color, boxShadow: `0 0 6px ${color}88` }}
        />
      </div>
      <span className="font-mono text-xs font-medium" style={{ color, minWidth: "2rem" }}>{score}</span>
    </div>
  );
}

export default function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  const risky = [...invoices].sort((a, b) => b.risk_score - a.risk_score);

  return (
    <div
      className="animate-fade-up rounded-sm overflow-hidden"
      style={{
        animationDelay: "500ms",
        background: "var(--bg-panel)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Table header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}
      >
        <div>
          <h2 className="text-xs font-mono font-semibold tracking-[0.15em] uppercase" style={{ color: "var(--text-primary)" }}>
            Latest Risky Invoices
          </h2>
          <p className="text-[10px] font-mono mt-0.5" style={{ color: "var(--text-dim)" }}>
            sorted by risk score — {risky.length} records
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "#ff3b3b" }} />
          <span className="text-[10px] font-mono" style={{ color: "var(--text-dim)" }}>LIVE</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Invoice #", "Vendor", "Amount", "Risk", "Status", "Issue", "Action"].map(h => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-[9px] font-mono font-medium tracking-[0.2em] uppercase"
                  style={{ color: "var(--text-dim)", background: "var(--bg-base)" }}
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
                  className="group transition-colors"
                  style={{
                    borderBottom: i < risky.length - 1 ? "1px solid var(--border)" : undefined,
                    animationDelay: `${600 + i * 60}ms`,
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg-panel-hover)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-medium" style={{ color: "#448aff" }}>
                      {inv.invoice_number}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {inv.vendor_name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {inv.amount != null
                        ? `€${inv.amount.toLocaleString("cs-CZ")}`
                        : <span style={{ color: "var(--text-dim)" }}>—</span>
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <RiskBar score={inv.risk_score} />
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono font-semibold tracking-wider"
                      style={{ color: s.color, background: s.bg, border: `1px solid ${s.color}33` }}
                    >
                      <span className="w-1 h-1 rounded-full" style={{ background: s.dot }} />
                      {s.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-[200px]">
                    <span className="text-xs font-mono truncate block" style={{ color: "var(--text-secondary)" }}>
                      {inv.reasons || <span style={{ color: "var(--text-dim)" }}>—</span>}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono" style={{ color: "var(--text-dim)" }}>
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
