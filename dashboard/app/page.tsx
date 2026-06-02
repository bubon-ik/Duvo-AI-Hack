import { invoices, getStats } from "./data/invoices";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import InvoiceTable from "./components/InvoiceTable";
import StatusDonut from "./components/StatusDonut";
import ApprovalQueue from "./components/ApprovalQueue";

export default function Dashboard() {
  const stats = getStats(invoices);

  return (
    <div className="flex min-h-[100dvh]" style={{ background: "var(--bg-app)" }}>
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header
          className="flex items-center gap-4 px-6 lg:px-8 py-4 sticky top-0 z-10"
          style={{ background: "rgba(244,245,243,0.85)", backdropFilter: "blur(10px)" }}
        >
          <div
            className="flex items-center gap-2.5 flex-1 max-w-md px-4 py-2.5 rounded-xl"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>Search invoices, vendors</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-2 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-body)" }}>
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "var(--accent)" }} />
              Last run 08:45 UTC
            </span>
            <div className="flex items-center gap-2.5 pl-1">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: "var(--accent-soft)", color: "var(--accent-ink)" }}>AP</div>
              <div className="hidden md:block leading-tight">
                <div className="text-sm font-semibold" style={{ color: "var(--text-strong)" }}>AP Operations</div>
                <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>ap@duvo.demo</div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-6 lg:px-8 pb-10 pt-2 space-y-6 max-w-[1400px] w-full">
          {/* Page title */}
          <div className="animate-fade-up flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight" style={{ color: "var(--text-strong)" }}>Dashboard</h1>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Every vendor invoice checked against purchase orders and policy before payment.</p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-transform active:scale-95"
              style={{ background: "var(--accent)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New review run
            </button>
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard featured title="Total reviewed" value={stats.total}   delta="5"  subtitle="this batch"        delay={60} />
            <StatCard title="Approved"        value={stats.approved}        delta="1"  subtitle="ready to pay"      delay={120} />
            <StatCard title="Needs review"    value={stats.needsReview}     subtitle="missing data"  delay={180} />
            <StatCard title="Money at risk caught" value="€900"             subtitle="overcharge found"  delay={240} />
          </div>

          {/* Bento: queue + donut */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2"><ApprovalQueue invoices={invoices} /></div>
            <StatusDonut
              total={stats.total}
              segments={[
                { label: "Approved",     value: stats.approved,    color: "var(--ok)" },
                { label: "Needs review", value: stats.needsReview, color: "var(--warn)" },
                { label: "Dispute",      value: stats.dispute,     color: "var(--danger)" },
              ]}
            />
          </div>

          {/* Table */}
          <InvoiceTable invoices={invoices} />

          <div className="animate-fade-up flex items-center justify-between text-[12px]" style={{ animationDelay: "440ms", color: "var(--text-muted)" }}>
            <span>Duvo Invoice Review Autopilot</span>
            <span>Gmail, Google Sheets, human in the loop</span>
          </div>
        </main>
      </div>
    </div>
  );
}
