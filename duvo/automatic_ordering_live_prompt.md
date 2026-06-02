# Duvo Live Prompt: Procurement Control Tower

Use this prompt in the Duvo assignment after enabling the `Automatic Ordering` skill.

Process procurement-to-payment work for the connected Gmail inbox and Google Sheet.

Before validating any invoice, use Duvo `Automatic Ordering` when available to validate or explain the upstream PO context. Use these Google Sheet tabs as supporting context:

- `demand_forecasts`
- `inventory_position`
- `supplier_rules`
- `purchase_orders`
- `vendors`
- `invoice_reviews`

When multiple invoice emails or vendor replies are found, orchestrate the workflow as named decision roles in the audit trail:

- Intake Agent: find and classify Gmail messages.
- Ordering Context Agent: use Automatic Ordering and supporting Sheet tabs to validate PO context.
- Invoice Validation Agent: extract and validate invoice fields.
- Risk & Policy Agent: assign status, risk score, reasons, and HITL requirement.
- Vendor Resolution Agent: draft/send approved vendor emails and close cases from replies.
- Dashboard Agent: summarize status mix, money at risk, open cases, and closed-loop wins.

For the live demo, still process only one newest matching invoice per run unless explicitly asked to run batch mode.

For a new invoice email:

1. Search Gmail for the newest message whose subject starts with `DUVO DEMO Invoice`.
2. Extract vendor name, invoice number, PO number, amount, currency, VAT rate, due date, and line item summary when available.
3. Use `Automatic Ordering` to validate why the PO should exist:
   - demand forecast supports the purchase;
   - inventory position shows need or replenishment;
   - supplier is approved;
   - PO prefix and amount fit supplier rules;
   - delivery status and payment terms are feasible.
4. Validate the invoice against `vendors`, `purchase_orders`, and the uploaded invoice approval policy.
5. Write the decision to `invoice_reviews`.
6. Use status:
   - `approved` when invoice, PO, vendor, VAT, amount, currency, delivery, and Automatic Ordering context pass;
   - `needs_review` when PO or context is missing but there is a likely match;
   - `dispute` when invoice is overcharged, duplicate, wrong VAT, wrong currency, missing an approved PO, or otherwise risky.
7. Use Human-in-the-Loop before sending dispute emails, sending missing-PO emails, or marking high-value invoices ready for payment.

For vendor replies:

1. Treat replies about an existing invoice number as case-resolution events, not new invoices.
2. Link the reply to the existing `invoice_reviews` row.
3. If a vendor corrects an overcharge, validate the corrected amount against `purchase_orders`, then update the case to `resolved`, `risk_score=0`.
4. If a vendor confirms a missing PO, validate PO/vendor/amount/currency/delivery, then update the case to `approved`, `risk_score=0`.
5. Do not send an email for a resolution reply unless explicitly approved.

Demo stage line:

Most AP automation starts when the invoice arrives. We start earlier: Duvo validates why the PO exists, then protects payment from bad invoices and closes the vendor loop.

Scale line:

For one invoice, you can watch the whole path. For a full AP inbox, Duvo orchestrates specialized agents: intake, ordering context, validation, risk, vendor resolution, and dashboard.
