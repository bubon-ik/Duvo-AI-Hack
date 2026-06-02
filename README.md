# Vendor Invoice Dispute Autopilot

One-day hackathon demo for a Duvo automation that reviews vendor invoices before payment.

The workflow:

1. Vendor invoice arrives in Gmail.
2. Duvo extracts invoice fields from the attachment/body.
3. Duvo compares the invoice against Google Sheets purchase orders and uploaded policy files.
4. Duvo logs the review in `invoice_reviews`.
5. Duvo asks for human approval before sending dispute emails or marking high-value invoices ready for payment.

## What is in this repo

- `src/vendor_invoice_autopilot.py` - deterministic review engine used for local validation and demo output.
- `scripts/run_demo.py` - runs synthetic invoices through the review engine and writes a Sheets-ready CSV.
- `data/*.csv` - seed data for Google Sheets tabs.
- `demo_inbox/*.eml` - Gmail-style sample messages for the live story.
- `demo_invoices/*.json` - extracted invoice payloads matching the sample messages.
- `duvo/*.md` - assignment SOP, approval policy, and demo script to paste into Duvo.
- `tests/test_vendor_invoice_autopilot.py` - five acceptance scenarios from the plan.

## Local demo

```bash
python3 scripts/run_demo.py
python3 -m unittest tests/test_vendor_invoice_autopilot.py
```

The demo writes `out/invoice_reviews.csv`. Import `data/vendors.csv`, `data/purchase_orders.csv`, and `out/invoice_reviews.csv` into Google Sheets as the three tabs.

## Duvo setup

1. Connect Gmail and Google Sheets in Duvo.
2. Upload the files in `duvo/` as assignment reference files.
3. Create a Google Sheet with tabs named `vendors`, `purchase_orders`, and `invoice_reviews`.
4. Paste `duvo/assignment_sop.md` into the assignment SOP.
5. Send one of the `demo_inbox/*.eml` examples, or copy the email body into a real Gmail message.
6. Run the assignment and show Duvo's live execution/audit trail.

## Judging angle

- Real workflow: accounts payable invoice validation.
- Complexity: extraction, policy lookup, PO matching, duplicate detection, risk scoring, conditional approval.
- Duvo capabilities: Gmail, Google Sheets, Files, Human-in-the-Loop, audit/live execution.
- Business impact: prevents overpayment and reduces AP review time.
