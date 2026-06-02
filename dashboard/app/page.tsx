import { invoices, getStats } from "./data/invoices";
import StatCard from "./components/StatCard";
import InvoiceTable from "./components/InvoiceTable";

export default function Dashboard() {
  const stats = getStats(invoices);
  const now = new Date("2026-06-02T08:45:43Z");
  const dateStr = now.toISOString().replace("T", " ").slice(0, 19) + " UTC";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      {/* Header */}
      <header
        className="px-8 py-4 flex items-center justify-between sticky top-0 z-10"
        style={{
          background: "rgba(12,12,15,0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-4">
          {/* Logo mark */}
          <div
            className="w-7 h-7 rounded-sm flex items-center justify-center"
            style={{ background: "var(--accent-blue)", boxShadow: "0 0 12px rgba(68,138,255,0.4)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0c0c0f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold tracking-wide" style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                DUVO
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm" style={{ color: "var(--text-dim)", background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                AP AUTOPILOT
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "#00e676" }} />
            <span className="text-[10px] font-mono" style={{ color: "var(--text-dim)" }}>
              LIVE · {dateStr}
            </span>
          </div>
          <div
            className="px-3 py-1 rounded-sm text-[10px] font-mono font-medium tracking-wider"
            style={{ color: "var(--accent-blue)", background: "var(--accent-blue-dim)", border: "1px solid rgba(68,138,255,0.2)" }}
          >
            {stats.humanApprovalsWaiting} PENDING APPROVAL
          </div>
        </div>
      </header>

      <main className="px-8 py-8 max-w-7xl mx-auto space-y-6">

        {/* Section label */}
        <div className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: "0ms" }}>
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: "var(--text-dim)" }}>
            Batch overview
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </div>

        {/* Stats grid row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard title="Total Reviewed"  value={stats.total}       accent="blue"   subtitle="invoices this batch"   delay={60}  iconSvg={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>} />
          <StatCard title="Approved"        value={stats.approved}    accent="green"  subtitle="ready for payment"     delay={120} iconSvg={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
          <StatCard title="Needs Review"    value={stats.needsReview} accent="yellow" subtitle="missing data"          delay={180} iconSvg={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
          <StatCard title="Disputes"        value={stats.dispute}     accent="red"    subtitle="flagged for correction" delay={240} iconSvg={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} />
        </div>

        {/* Stats grid row 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard title="Total Amount"            value={`€${stats.totalAmount.toLocaleString("cs-CZ")}`} accent="blue"   subtitle="across all invoices"  delay={300} iconSvg={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
          <StatCard title="Money at Risk Caught"    value="€900"                                            accent="red"    subtitle="overcharge detected"  delay={360} iconSvg={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>} />
          <StatCard title="Human Approvals Waiting" value={stats.humanApprovalsWaiting}                    accent="yellow" subtitle="require AP decision"   delay={420} iconSvg={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
          <StatCard title="Avg Risk Score"          value={stats.avgRiskScore}                              accent="purple" subtitle="out of 100"            delay={480} iconSvg={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
        </div>

        {/* Section label */}
        <div className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: "480ms" }}>
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: "var(--text-dim)" }}>
            Risk queue
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </div>

        {/* Table */}
        <InvoiceTable invoices={invoices} />

        {/* Footer */}
        <div className="pb-8 flex items-center justify-between animate-fade-up" style={{ animationDelay: "700ms" }}>
          <span className="text-[10px] font-mono" style={{ color: "var(--text-dim)" }}>
            DUVO INVOICE REVIEW AUTOPILOT · HACKATHON DEMO
          </span>
          <span className="text-[10px] font-mono" style={{ color: "var(--text-dim)" }}>
            Powered by Claude + Gmail + Google Sheets
          </span>
        </div>
      </main>
    </div>
  );
}
