"use client";
import { Invoice } from "../data/invoices";

export default function ApprovalQueue({ invoices }: { invoices: Invoice[] }) {
  const pending = invoices.filter(i => i.requires_human_approval);

  return (
    <div
      className="animate-fade-up flex flex-col p-5"
      style={{ animationDelay: "260ms", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold" style={{ color: "var(--text-strong)" }}>Waiting on you</h2>
        <span className="text-[12px] font-semibold px-2 py-0.5 rounded-md" style={{ background: "var(--warn-soft)", color: "var(--warn)" }}>
          {pending.length} pending
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {pending.map(inv => (
          <div key={inv.invoice_number} className="flex items-center gap-3">
            <div
              className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center font-mono text-[11px] font-semibold"
              style={{ background: "var(--accent-soft)", color: "var(--accent-ink)" }}
            >
              {inv.vendor_name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate" style={{ color: "var(--text-strong)" }}>{inv.vendor_name}</div>
              <div className="text-[12px] truncate" style={{ color: "var(--text-muted)" }}>{inv.suggested_action}</div>
            </div>
            <button
              className="text-[12px] font-semibold px-3 py-1.5 rounded-lg shrink-0 transition-transform active:scale-95"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Review
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
