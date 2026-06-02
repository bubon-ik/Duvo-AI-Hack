# Live Demo Runbook

## Current Duvo Assignment

- Agent ID: `45e90130-ea6f-4fce-ad06-e3e7694e7b58`
- Build ID: `c2c4295c-35c1-40b9-a25e-3d7b0ce13e8a`
- Team ID: `e0cf7830-28c0-47b7-a396-0833e3d59ef3`
- Google Sheet: `vendor_invoice_autopilot_workbook`
- Spreadsheet ID: `1kv_2Ggg_UOMkICiMH9a0IdhBhiSTuphFtYQpBNqn0gI`

## Successful Live Runs

| Scenario | Run ID | Sheet write | Outcome |
| --- | --- | --- | --- |
| Clean invoice `INV-ACME-1042` | `a0935dd7-1fc5-495f-ac36-c9fa2db8f437` | `invoice_reviews!A2:N2` | `approved`, risk `5`, no human approval required |
| Overcharged invoice `INV-ACME-1043` | `d846e86c-0f76-4efb-aa25-6a4123d2bf39` | `invoice_reviews!A3:N3` | `dispute`, risk `80`, caught EUR 900 overcharge, HITL approval before dispute email |
| Missing PO invoice `INV-POS-881` | `221b04f2-2e63-41de-b53d-250616b3e3a3` | `invoice_reviews!A4:N4` | `needs_review`, risk `55`, HITL question and approval before vendor follow-up |

## Closed-Loop Wow Moment

Most invoice demos stop after detecting a problem. This demo continues until the business process is resolved.

Use these reply emails after the initial dispute/review runs:

- `demo_inbox/04_corrected_acme_reply.eml`
  - Vendor admits `INV-ACME-1043` was overcharged.
  - Corrected amount is EUR 4200.00 for `PO-2026-ACME-1042`.
  - Expected Duvo outcome: find the open dispute row, validate the correction, write `resolved`, `case_state=closed`, and record resolution notes.
- `demo_inbox/05_prague_po_reply.eml`
  - Vendor confirms the missing PO for `INV-POS-881`.
  - Confirmed PO is `PO-2026-POS-0091`.
  - Expected Duvo outcome: find the open needs-review row, validate PO/vendor/amount/currency/delivery, write `approved`, `case_state=closed`, and record resolution notes.

Stage line:

`Most demos show detection. We show recovery: Duvo catches the issue, emails the vendor with approval, reads the vendor's reply, and closes the case with a full audit trail.`

## Demo Storyline

1. Show Gmail intake with the three `DUVO DEMO Invoice` messages.
2. Show Duvo live execution for the overcharged invoice: Gmail read, Sheets read, validation table, Sheet append, HITL approval, Gmail send.
3. Show `invoice_reviews` in Google Sheets:
   - clean invoice is approved automatically;
   - overcharged invoice is blocked before payment;
   - missing PO invoice is held for human/vendor clarification.
4. Close with the audit trail: every decision includes status, risk score, reason, suggested action, approval requirement, and sent-email message ID.

## One-Time Setup

1. Import `outputs/vendor_invoice_autopilot_workbook.xlsx` into Google Sheets.
2. Share or keep it accessible to the Google account connected in Duvo.
3. Copy the Google Sheet URL.
4. Publish a new Duvo build with the exact Sheet URL:

```bash
export DUVO_API_KEY="dv_..."
export GOOGLE_SHEET_URL="https://docs.google.com/spreadsheets/d/..."
scripts/create_duvo_build_with_sheet.sh
```

## Live Demo Sequence

1. Open the Google Sheet and keep `invoice_reviews` visible.
2. Send the Gmail draft with subject `DUVO DEMO Invoice INV-ACME-1042...`.
3. Start a Duvo run:

```bash
export DUVO_API_KEY="dv_..."
scripts/start_duvo_run.sh
```

4. Copy the returned `run.id` and poll status:

```bash
export DUVO_RUN_ID="..."
scripts/get_duvo_run.sh
scripts/get_duvo_run_messages.sh
```

5. Expected result: a new `approved` row appears in `invoice_reviews`.
6. Repeat with `DUVO DEMO Invoice INV-ACME-1043...`.
7. Expected result: `dispute`, risk score around `80`, and a human approval request before sending a dispute email.
8. Repeat with `DUVO DEMO Invoice INV-POS-881 missing PO`.
9. Expected result: `needs_review`, human question, then approval before emailing the vendor for the missing PO.
10. Send the corrected Acme reply.
11. Expected result: existing `INV-ACME-1043` case moves from `dispute/open` to `resolved/closed`.
12. Send the Prague Office PO reply.
13. Expected result: existing `INV-POS-881` case moves from `needs_review/open` to `approved/closed`.

## Fallback Demo

If live Gmail or Sheets writes fail:

- Show `demo_reviews_backup` in the workbook.
- Run `python3 scripts/run_demo.py`.
- Show `out/invoice_reviews.csv`.
- Narrate that the deterministic engine mirrors the policy Duvo follows.
