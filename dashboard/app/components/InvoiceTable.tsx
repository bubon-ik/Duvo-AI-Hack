import { Invoice } from "../data/invoices";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

const statusConfig = {
  approved: {
    label: "Approved",
    className: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  needs_review: {
    label: "Needs Review",
    className: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  dispute: {
    label: "Dispute",
    className: "bg-red-100 text-red-700",
    icon: AlertTriangle,
  },
};

function RiskBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-red-100 text-red-700"
      : score >= 40
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {score}
    </span>
  );
}

export default function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  const risky = [...invoices].sort((a, b) => b.risk_score - a.risk_score);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Latest Risky Invoices</h2>
        <p className="text-xs text-gray-400 mt-0.5">Sorted by risk score</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-6 py-3 text-left">Invoice</th>
              <th className="px-6 py-3 text-left">Vendor</th>
              <th className="px-6 py-3 text-left">Amount</th>
              <th className="px-6 py-3 text-left">Risk</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Issue</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {risky.map((inv) => {
              const s = statusConfig[inv.status];
              const Icon = s.icon;
              return (
                <tr key={inv.invoice_number} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-700 font-medium">
                    {inv.invoice_number}
                  </td>
                  <td className="px-6 py-4 text-gray-800">{inv.vendor_name}</td>
                  <td className="px-6 py-4 text-gray-800">
                    {inv.amount != null
                      ? `€${inv.amount.toLocaleString("cs-CZ")}`
                      : <span className="text-gray-400 italic">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <RiskBadge score={inv.risk_score} />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${s.className}`}>
                      <Icon size={11} />
                      {s.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs max-w-[200px] truncate">
                    {inv.reasons || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{inv.suggested_action}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
