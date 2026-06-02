# Live Demo Runbook

## Current Duvo Assignment

- Agent ID: `6a59a0d6-7b63-4809-b389-a8b4a1b8f4c8`
- Build ID: `f5443026-0116-4cea-9469-f3e49148bd18`
- Team ID: `e0cf7830-28c0-47b7-a396-0833e3d59ef3`

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

## Fallback Demo

If live Gmail or Sheets writes fail:

- Show `demo_reviews_backup` in the workbook.
- Run `python3 scripts/run_demo.py`.
- Show `out/invoice_reviews.csv`.
- Narrate that the deterministic engine mirrors the policy Duvo follows.
