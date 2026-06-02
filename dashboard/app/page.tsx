import { invoices, getStats } from "./data/invoices";
import StatCard from "./components/StatCard";
import InvoiceTable from "./components/InvoiceTable";

export default function Dashboard() {
  const stats = getStats(invoices);
  const now = new Date("2026-06-02T08:45:43Z");
  const dateStr = now.toISOString().replace("T", " ").slice(0, 19) + " UTC";

  return (
    <div className="min-h-[100dvh] relative" style={{ background: "var(--bg-base)" }}>
      {/* Header */}
      <header
        className="px-8 py-4 flex items-center justify-between sticky top-0 z-20"
        style={{
          background: "rgba(10,14,22,0.85)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 flex items-center justify-center"
            style={{ background: "var(--accent)", borderRadius: "8px" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0a0e16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-base font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Duvo
            </span>
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-md tracking-wide uppercase"
              style={{ color: "var(--text-secondary)", background: "var(--bg-surface)" }}
            >
              AP Autopilot
            </span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "var(--ok)" }} />
            <span className="text-[11px] font-mono" style={{ color: "var(--text-dim)" }}>
              Live, {dateStr}
            </span>
          </div>
          <div
            className="px-3 py-1.5 rounded-md text-[11px] font-medium tracking-wide"
            style={{ color: "var(--accent)", background: "var(--accent-soft)" }}
          >
            {stats.humanApprovalsWaiting} pending approval
          </div>
        </div>
      </header>

      <main className="relative z-10 px-8 py-8 max-w-7xl mx-auto space-y-6">

        {/* Page intro */}
        <div className="animate-fade-up">
          <h1 className="text-xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Invoice review overview
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Every vendor invoice checked against purchase orders and policy before payment.
          </p>
        </div>

        {/* Stats grid row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard title="Total reviewed" value={stats.total}       tone="neutral" subtitle="invoices this batch"     delay={60}  iconSvg={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>} />
          <StatCard title="Approved"       value={stats.approved}    tone="ok"      subtitle="ready for payment"       delay={120} iconSvg={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
          <StatCard title="Needs review"   value={stats.needsReview} tone="warn"    subtitle="missing data"            delay={180} iconSvg={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
          <StatCard title="Disputes"       value={stats.dispute}     tone="danger"  subtitle="flagged for correction"  delay={240} iconSvg={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} />
        </div>

        {/* Stats grid row 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard title="Total amount"            value={`€${stats.totalAmount.toLocaleString("cs-CZ")}`} tone="neutral" subtitle="across all invoices"  delay={300} iconSvg={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
          <StatCard title="Money at risk caught"    value="€900"                                            tone="danger"  subtitle="overcharge detected"  delay={360} iconSvg={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>} />
          <StatCard title="Approvals waiting"       value={stats.humanApprovalsWaiting}                    tone="warn"    subtitle="require AP decision"   delay={420} iconSvg={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
          <StatCard title="Avg risk score"          value={stats.avgRiskScore}                              tone="neutral" subtitle="out of 100"            delay={480} iconSvg={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
        </div>

        {/* Table */}
        <InvoiceTable invoices={invoices} />

        {/* Footer */}
        <div className="pt-2 pb-8 flex items-center justify-between animate-fade-up" style={{ animationDelay: "700ms" }}>
          <span className="text-[11px]" style={{ color: "var(--text-dim)" }}>
            Duvo Invoice Review Autopilot
          </span>
          <span className="text-[11px]" style={{ color: "var(--text-dim)" }}>
            Gmail, Google Sheets, human in the loop
          </span>
        </div>
      </main>
    </div>
  );
}
