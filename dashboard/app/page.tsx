import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Euro,
  ShieldAlert,
  UserCheck,
  Activity,
} from "lucide-react";
import { invoices, getStats } from "./data/invoices";
import StatCard from "./components/StatCard";
import InvoiceTable from "./components/InvoiceTable";

export default function Dashboard() {
  const stats = getStats(invoices);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <ShieldAlert size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Duvo AP Dashboard</h1>
            <p className="text-xs text-gray-400">Invoice Review Autopilot</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </span>
          <span className="text-xs text-gray-400">Last run: today 08:45 UTC</span>
        </div>
      </header>

      <main className="px-8 py-8 max-w-7xl mx-auto space-y-8">
        {/* Stats grid row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Reviewed"
            value={stats.total}
            icon={FileText}
            color="blue"
            subtitle="invoices this batch"
          />
          <StatCard
            title="Approved"
            value={stats.approved}
            icon={CheckCircle}
            color="green"
            subtitle="ready for payment"
          />
          <StatCard
            title="Needs Review"
            value={stats.needsReview}
            icon={Clock}
            color="yellow"
            subtitle="missing data"
          />
          <StatCard
            title="Disputes"
            value={stats.dispute}
            icon={AlertTriangle}
            color="red"
            subtitle="flagged for correction"
          />
        </div>

        {/* Stats grid row 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Amount"
            value={`€${stats.totalAmount.toLocaleString("cs-CZ")}`}
            icon={Euro}
            color="blue"
            subtitle="across all invoices"
          />
          <StatCard
            title="Money at Risk Caught"
            value="€900"
            icon={ShieldAlert}
            color="red"
            subtitle="overcharge detected"
          />
          <StatCard
            title="Human Approvals Waiting"
            value={stats.humanApprovalsWaiting}
            icon={UserCheck}
            color="orange"
            subtitle="require AP decision"
          />
          <StatCard
            title="Avg Risk Score"
            value={stats.avgRiskScore}
            icon={Activity}
            color="purple"
            subtitle="out of 100"
          />
        </div>

        {/* Table */}
        <InvoiceTable invoices={invoices} />
      </main>
    </div>
  );
}
