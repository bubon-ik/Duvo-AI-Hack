# Duvo Assignment SOP: Vendor Invoice Dispute Autopilot

Goal: process vendor invoice emails, validate them against purchase order data, log the review in Google Sheets, and request human approval before risky actions.

Inputs:

- Gmail messages sent to the AP inbox.
- Google Sheets tabs: `vendors`, `purchase_orders`, `invoice_reviews`.
- Uploaded policy files: `invoice_approval_policy.md` and `dispute_email_style.md`.

Procedure:

1. Find new Gmail messages that look like vendor invoices. Use the sender, subject, body, and attachments.
2. Extract these fields: vendor name, invoice number, PO number, amount, currency, VAT rate, due date, and any line item summary available.
3. Read the `vendors` and `purchase_orders` tabs from Google Sheets.
4. Check whether the invoice number already exists in `invoice_reviews`.
5. Validate the invoice against the uploaded approval policy.
6. Assign one status:
   - `approved` when the invoice matches all policy checks.
   - `needs_review` when data is missing or ambiguous.
   - `dispute` when the invoice appears incorrect or risky.
7. Write a row into `invoice_reviews` with timestamp, extracted fields, status, risk score, reasons, suggested action, approval requirement, and draft email if relevant.
8. If status is `approved` and amount is below EUR 5000, do not ask for approval. Mark suggested action as "Mark ready for payment".
9. If status is `needs_review`, ask a Human-in-the-Loop question with options: "Ask vendor for missing PO", "Escalate to AP owner", "Reject invoice".
10. If status is `dispute`, draft a vendor email using `dispute_email_style.md`. Request Human-in-the-Loop approval before sending. If denied, ask what to change and revise the draft.
11. Never send a vendor email, mark a high-value invoice ready for payment, or modify payment status without approval.

Approval title format:

`{status}: {vendor_name} {invoice_number} - {amount} {currency}`

Demo note:

During the live demo, open the Duvo live execution view and narrate the checks as they appear: extraction, Sheets lookup, policy reasoning, row write, approval request, and draft dispute email.
