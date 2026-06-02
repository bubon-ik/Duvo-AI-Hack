"use client";

const I = {
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  invoices: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>,
  vendors: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><line x1="9" y1="9" x2="9" y2="9.01"/><line x1="9" y1="13" x2="9" y2="13.01"/></svg>,
  approvals: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  analytics: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  help: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

const menu = [
  { key: "dashboard", label: "Dashboard", icon: I.dashboard, active: true },
  { key: "invoices", label: "Invoices", icon: I.invoices, badge: "5" },
  { key: "vendors", label: "Vendors", icon: I.vendors },
  { key: "approvals", label: "Approvals", icon: I.approvals, badge: "4" },
  { key: "analytics", label: "Analytics", icon: I.analytics },
];

const general = [
  { key: "settings", label: "Settings", icon: I.settings },
  { key: "help", label: "Help", icon: I.help },
];

function Item({ label, icon, active, badge }: { label: string; icon: React.ReactNode; active?: boolean; badge?: string }) {
  return (
    <button
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left"
      style={{
        background: active ? "var(--accent-soft)" : "transparent",
        color: active ? "var(--accent-ink)" : "var(--text-body)",
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      <span style={{ color: active ? "var(--accent)" : "var(--text-muted)" }}>{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span
          className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md"
          style={{ background: active ? "var(--accent)" : "var(--bg-hover)", color: active ? "#fff" : "var(--text-muted)" }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export default function Sidebar() {
  return (
    <aside
      className="hidden lg:flex flex-col w-64 shrink-0 h-[100dvh] sticky top-0 px-4 py-6"
      style={{ background: "var(--bg-card)", borderRight: "1px solid var(--border)" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: "var(--accent)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
        </div>
        <span className="text-lg font-semibold tracking-tight" style={{ color: "var(--text-strong)" }}>Duvo</span>
      </div>

      {/* Menu */}
      <div className="px-2 mb-2 text-[11px] font-semibold tracking-wide uppercase" style={{ color: "var(--text-muted)" }}>Menu</div>
      <nav className="flex flex-col gap-1 mb-7">
        {menu.map(({ key, ...rest }) => <Item key={key} {...rest} />)}
      </nav>

      <div className="px-2 mb-2 text-[11px] font-semibold tracking-wide uppercase" style={{ color: "var(--text-muted)" }}>General</div>
      <nav className="flex flex-col gap-1">
        {general.map(({ key, ...rest }) => <Item key={key} {...rest} />)}
      </nav>

      {/* Promo card */}
      <div
        className="mt-auto p-4 rounded-2xl relative overflow-hidden"
        style={{ background: "linear-gradient(150deg, var(--accent-deep), var(--accent-ink))" }}
      >
        <div className="text-sm font-semibold text-white">Audit trail ready</div>
        <p className="text-[12px] mt-1 mb-3 text-white/70 leading-snug">Every review logged to Google Sheets automatically.</p>
        <button className="text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-white" style={{ color: "var(--accent-ink)" }}>
          View log
        </button>
      </div>
    </aside>
  );
}
