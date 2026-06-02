# Duvo Assignment SOP: Procurement Control Tower

Goal: validate the upstream purchasing intent with Duvo Automatic Ordering, process vendor invoice emails, validate them against purchase order data, log the review in Google Sheets, request human approval before risky actions, and close the loop when vendors reply with corrections or missing PO information.

Inputs:

- Gmail messages sent to the AP inbox.
- Google Sheets tabs: `vendors`, `demand_forecasts`, `inventory_position`, `supplier_rules`, `purchase_orders`, `invoice_reviews`.
- Uploaded policy files: `invoice_approval_policy.md` and `dispute_email_style.md`.
- Duvo skill: `Automatic Ordering`.

Procedure for upstream PO context:

1. Before validating a new invoice, use `Automatic Ordering` when available to validate the PO context.
2. Read `demand_forecasts`, `inventory_position`, and `supplier_rules` if the skill or workflow needs supporting data.
3. Confirm that the PO being invoiced is backed by a real demand signal, inventory need, approved supplier rule, amount/currency limit, and delivery feasibility.
4. If `Automatic Ordering` produces a validated PO recommendation, use it as supporting context for the invoice decision.
5. If any optional Automatic Ordering data source is unavailable, continue with invoice validation and note the skipped gate in `reasons`.

Procedure for new invoices:

1. Find new Gmail messages that look like vendor invoices. Use the sender, subject, body, and attachments.
2. Extract these fields: vendor name, invoice number, PO number, amount, currency, VAT rate, due date, and any line item summary available.
3. Run or reference `Automatic Ordering` for the invoice's PO context when the PO number is present or a likely PO match exists.
4. Read the `vendors` and `purchase_orders` tabs from Google Sheets.
5. Check whether the invoice number already exists in `invoice_reviews`.
6. Validate the invoice against the uploaded approval policy and the Automatic Ordering result.
7. Assign one status:
   - `approved` when the invoice matches all policy checks.
   - `needs_review` when data is missing or ambiguous.
   - `dispute` when the invoice appears incorrect or risky.
8. Write a row into `invoice_reviews` with timestamp, extracted fields, status, risk score, reasons, suggested action, approval requirement, draft email if relevant, `case_state`, and `resolution_notes`.
9. If status is `approved` and amount is below EUR 5000, do not ask for approval. Mark suggested action as "Mark ready for payment".
10. If status is `needs_review`, ask a Human-in-the-Loop question with options: "Ask vendor for missing PO", "Escalate to AP owner", "Reject invoice".
11. If status is `dispute`, draft a vendor email using `dispute_email_style.md`. Request Human-in-the-Loop approval before sending. If denied, ask what to change and revise the draft.
12. Never send a vendor email, mark a high-value invoice ready for payment, or modify payment status without approval.

Procedure for vendor replies:

1. If a Gmail message is a reply about an existing invoice number, treat it as a case-resolution event, not a new invoice.
2. Search `invoice_reviews` for the latest row with the same `invoice_number` and `case_state=open` or status `dispute` / `needs_review`.
3. If the open case is `dispute` because of an overcharge:
   - extract corrected amount, PO number, currency, and any corrected invoice details;
   - compare the corrected amount against `purchase_orders.expected_amount`;
   - if it now matches the PO and policy, update or append a resolution row with status `resolved`, risk score `0`, `case_state=closed`, and `resolution_notes` explaining what changed;
   - if it still does not match, keep the case open and ask Human-in-the-Loop what to do.
4. If the open case is `needs_review` because of a missing PO:
   - extract the confirmed PO number from the vendor reply;
   - validate it against `purchase_orders`, vendor, amount, currency, and delivery status;
   - if it matches, update or append a resolution row with status `approved`, risk score `0`, `case_state=closed`, and `resolution_notes`;
   - if it does not match, keep the case open and ask Human-in-the-Loop.
5. Do not create a duplicate dispute for a vendor reply. Link the reply back to the original invoice case.
6. Show the full audit trail in the Duvo live execution: original invoice, decision, outgoing email, vendor reply, resolution update.

Approval title format:

`{status}: {vendor_name} {invoice_number} - {amount} {currency}`

Demo note:

During the live demo, open the Duvo live execution view and narrate the checks as they appear: Automatic Ordering PO context, extraction, Sheets lookup, policy reasoning, row write, approval request, draft dispute email, vendor reply handling, and final case closure.
