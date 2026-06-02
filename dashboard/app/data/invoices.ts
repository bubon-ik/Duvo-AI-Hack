export type InvoiceStatus = "approved" | "needs_review" | "dispute";

export interface Invoice {
  reviewed_at: string;
  vendor_name: string;
  invoice_number: string;
  po_number: string;
  amount: number | null;
  currency: string;
  status: InvoiceStatus;
  risk_score: number;
  reasons: string;
  suggested_action: string;
  requires_human_approval: boolean;
}

export const invoices: Invoice[] = [
  {
    reviewed_at: "2026-06-02T08:45:43+00:00",
    vendor_name: "Acme Packaging",
    invoice_number: "INV-ACME-1042",
    po_number: "PO-2026-ACME-1042",
    amount: 4200.0,
    currency: "EUR",
    status: "approved",
    risk_score: 0,
    reasons: "",
    suggested_action: "Mark ready for payment",
    requires_human_approval: false,
  },
  {
    reviewed_at: "2026-06-02T08:45:43+00:00",
    vendor_name: "Acme Packaging",
    invoice_number: "INV-ACME-1020",
    po_number: "PO-2026-ACME-1042",
    amount: 4200.0,
    currency: "EUR",
    status: "dispute",
    risk_score: 100,
    reasons: "Duplicate invoice number",
    suggested_action: "Send dispute email after approval",
    requires_human_approval: true,
  },
  {
    reviewed_at: "2026-06-02T08:45:43+00:00",
    vendor_name: "Unknown",
    invoice_number: "INV-UNKNOWN-1",
    po_number: "PO-2026-ACME-1042",
    amount: null,
    currency: "EUR",
    status: "needs_review",
    risk_score: 60,
    reasons: "Missing vendor name · Missing amount",
    suggested_action: "Ask AP owner for missing context",
    requires_human_approval: true,
  },
  {
    reviewed_at: "2026-06-02T08:45:43+00:00",
    vendor_name: "Prague Office Supplies",
    invoice_number: "INV-POS-881",
    po_number: "",
    amount: 850.0,
    currency: "EUR",
    status: "needs_review",
    risk_score: 45,
    reasons: "Missing PO number",
    suggested_action: "Ask AP owner for missing context",
    requires_human_approval: true,
  },
  {
    reviewed_at: "2026-06-02T08:45:43+00:00",
    vendor_name: "Acme Packaging",
    invoice_number: "INV-ACME-1043",
    po_number: "PO-2026-ACME-1042",
    amount: 5100.0,
    currency: "EUR",
    status: "dispute",
    risk_score: 80,
    reasons: "Invoice is €900 over the PO amount",
    suggested_action: "Send dispute email after approval",
    requires_human_approval: true,
  },
];

export function getStats(data: Invoice[]) {
  const total = data.length;
  const approved = data.filter((i) => i.status === "approved").length;
  const needsReview = data.filter((i) => i.status === "needs_review").length;
  const dispute = data.filter((i) => i.status === "dispute").length;
  const totalAmount = data.reduce((sum, i) => sum + (i.amount ?? 0), 0);
  const moneyAtRisk = 900;
  const humanApprovalsWaiting = data.filter((i) => i.requires_human_approval).length;
  const avgRiskScore = Math.round(
    data.reduce((sum, i) => sum + i.risk_score, 0) / total
  );

  return {
    total,
    approved,
    needsReview,
    dispute,
    totalAmount,
    moneyAtRisk,
    humanApprovalsWaiting,
    avgRiskScore,
  };
}
