# Vendor Invoice Dispute Autopilot

One-day hackathon demo for a Duvo automation that reviews vendor invoices before payment.

The workflow:

1. Vendor invoice arrives in Gmail.
2. Duvo extracts invoice fields from the attachment/body.
3. Duvo compares the invoice against Google Sheets purchase orders and uploaded policy files.
4. Duvo logs the review in `invoice_reviews`.
5. Duvo asks for human approval before sending dispute emails or marking high-value invoices ready for payment.
6. Duvo handles vendor replies, links them back to the open invoice case, and closes the loop when a correction or missing PO is confirmed.

## What is in this repo

- `src/vendor_invoice_autopilot.py` - deterministic review engine used for local validation and demo output.
- `scripts/run_demo.py` - runs synthetic invoices through the review engine and writes a Sheets-ready CSV.
- `data/*.csv` - seed data for Google Sheets tabs.
- `demo_inbox/*.eml` - Gmail-style sample messages for the live story.
- `demo_invoices/*.json` - extracted invoice payloads matching the sample messages.
- `demo_replies/*.json` - vendor reply payloads that resolve open dispute and missing-PO cases.
- `duvo/*.md` - assignment SOP, approval policy, and demo script to paste into Duvo.
- `tests/test_vendor_invoice_autopilot.py` - acceptance scenarios for invoice review and closed-loop vendor replies.

## Local demo

```bash
python3 scripts/run_demo.py
python3 scripts/run_real_case_test.py
python3 -m unittest tests/test_vendor_invoice_autopilot.py tests/test_real_case_email_flow.py
```

The demo writes `out/invoice_reviews.csv`. Import `data/vendors.csv`, `data/purchase_orders.csv`, and `out/invoice_reviews.csv` into Google Sheets as the three tabs.
The real-case smoke test writes `out/real_case_invoice_reviews.csv` and uses the four email fixtures in `live_cases/emails/`.

For a faster Google Sheets setup, import `outputs/vendor_invoice_autopilot_workbook.xlsx`. It already contains the `vendors`, `purchase_orders`, `invoice_reviews`, and `demo_reviews_backup` tabs. Rebuild it with `scripts/create_workbook.py` after changing demo data.

## Duvo setup

1. Connect Gmail and Google Sheets in Duvo.
2. Upload the files in `duvo/` as assignment reference files.
3. Create a Google Sheet with tabs named `vendors`, `purchase_orders`, and `invoice_reviews`.
4. Paste `duvo/assignment_sop.md` into the assignment SOP.
5. Send one of the `demo_inbox/*.eml` examples, or copy the email body into a real Gmail message.
6. Run the assignment and show Duvo's live execution/audit trail.

## Judging angle

- Real workflow: accounts payable invoice validation.
- Complexity: extraction, policy lookup, PO matching, duplicate detection, risk scoring, conditional approval, and closed-loop vendor reply resolution.
- Duvo capabilities: Gmail, Google Sheets, Files, Human-in-the-Loop, audit/live execution.
- Business impact: prevents overpayment and reduces AP review time.
- Wow moment: Duvo does not stop at detecting a bad invoice. It emails the vendor with approval, reads the vendor's reply, updates the case state, and leaves a complete audit trail.
