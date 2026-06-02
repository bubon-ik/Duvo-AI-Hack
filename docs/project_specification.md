# Vendor Invoice Dispute Autopilot - Project Specification

## 1. Elevator Pitch

Vendor Invoice Dispute Autopilot is a Duvo-powered accounts payable automation that reads incoming vendor invoice emails, extracts invoice details, validates them against purchase order and vendor policy data, logs the decision in Google Sheets, and asks for human approval before risky actions.

The core promise:

"Stop manually checking invoices. Duvo catches overcharges, duplicate invoices, missing PO numbers, and policy mismatches before money leaves the company."

## 2. Problem

Accounts payable teams receive invoice emails every day. The work is repetitive but risky:

- Open email and attachment.
- Find invoice number, vendor, PO, amount, VAT, due date.
- Check whether the PO exists.
- Check whether the amount matches the PO.
- Check whether the invoice is a duplicate.
- Decide whether to approve, dispute, or ask someone for context.
- Update a tracking sheet.
- Draft an email to the vendor if something is wrong.

This work is slow, easy to get wrong, and expensive when mistakes slip through. One duplicate or overcharged invoice can cost more than many hours of manual review.

## 3. Target Users

Primary user:

- AP / finance operations manager at a small or mid-sized company.

Secondary users:

- Operations lead who owns vendor workflows.
- Founder/CFO in a lean company without a dedicated AP team.
- Shared services team handling many vendor invoices.

## 4. Success Criteria

The hackathon demo is successful if it shows:

- An invoice email enters the workflow.
- Duvo extracts key invoice fields.
- Duvo checks vendor and PO data in Google Sheets.
- Duvo identifies at least one clean invoice and one risky invoice.
- Duvo writes the result to an `invoice_reviews` Sheet tab.
- Duvo asks for human approval before sending a dispute email.
- The demo clearly shows business impact: time saved and overpayment risk caught.

Judging alignment:

- Real workflow and complexity: invoice intake, extraction, validation, routing, audit.
- Use of Duvo capabilities: Gmail, Google Sheets, Files, Human-in-the-Loop, live execution/audit trail.
- Business impact: fewer overpayments, faster AP processing, better compliance.
- Originality: not generic expense approval; focused on vendor invoice dispute prevention.

## 5. In Scope

The one-day build includes:

- Synthetic vendor and PO dataset.
- Three to five demo invoices.
- Duvo SOP for the assignment.
- Google Sheets schema.
- Policy files uploaded to Duvo.
- Human approval gate for disputes and high-value approvals.
- Local deterministic review engine for repeatable demo output.
- Demo script and pitch narrative.

## 6. Out of Scope

The one-day build does not need:

- Real payment execution.
- ERP writeback.
- Production-grade PDF OCR for arbitrary invoice layouts.
- Real vendor communication unless Gmail sending is available and safe.
- Multi-currency FX conversion.
- Full accounting approval hierarchy.

## 7. System Components

### Gmail Intake

Purpose:

- Provides incoming invoice messages for Duvo to process.

Expected input:

- Vendor email with invoice details in body or attachment.

Demo fallback:

- Use the sample `.eml` files in `demo_inbox/`.

### Google Sheets System of Record

Required tabs:

- `vendors`
- `purchase_orders`
- `invoice_reviews`

`vendors` fields:

- `vendor_name`
- `expected_vat_rate`
- `payment_terms_days`
- `approved_po_prefix`
- `ap_contact`

`purchase_orders` fields:

- `po_number`
- `vendor_name`
- `expected_amount`
- `currency`
- `delivery_status`
- `description`

`invoice_reviews` fields:

- `reviewed_at`
- `vendor_name`
- `invoice_number`
- `po_number`
- `amount`
- `currency`
- `vat_rate`
- `due_date`
- `status`
- `risk_score`
- `reasons`
- `suggested_action`
- `requires_human_approval`
- `draft_email`

### Duvo Files

Upload these as assignment reference files:

- `duvo/invoice_approval_policy.md`
- `duvo/dispute_email_style.md`

Purpose:

- Keep policy and tone outside the core workflow so the assignment can be adjusted by business users.

### Duvo Assignment

The assignment should:

- Monitor or process invoice emails.
- Extract structured invoice data.
- Read vendor and PO data from Google Sheets.
- Apply the policy checks.
- Write a review row.
- Ask for approval when required.
- Draft vendor dispute email for risky invoices.

### Local Demo Engine

Purpose:

- Gives the team a deterministic backup demo and validation layer.

Files:

- `src/vendor_invoice_autopilot.py`
- `scripts/run_demo.py`
- `tests/test_vendor_invoice_autopilot.py`

This engine mirrors the decision logic that Duvo should follow.

## 8. Workflow Logic

### Extraction

Duvo extracts:

- Vendor name.
- Invoice number.
- PO number.
- Amount.
- Currency.
- VAT rate.
- Due date.

If a required field is missing, the invoice is routed to `needs_review`.

### Validation Checks

Duvo checks:

- Vendor exists.
- Invoice number is not duplicate.
- PO number exists.
- PO belongs to the same vendor.
- PO prefix is approved for this vendor.
- PO delivery status is `delivered`.
- Currency matches PO.
- VAT matches vendor policy.
- Amount is not above PO expected amount.

### Status Rules

`approved`:

- No issues found.
- Invoice can be marked ready for payment unless it is high-value.

`needs_review`:

- Missing PO number.
- Missing required extraction fields.
- Ambiguous information where a human can provide context.

`dispute`:

- Duplicate invoice.
- Unknown PO.
- Wrong vendor for PO.
- Wrong VAT.
- Wrong currency.
- Delivery not confirmed.
- Overcharge above tolerance.

### Risk Score

Risk score is a simple 0-100 number used for demo clarity:

- `0`: clean invoice.
- `30-69`: needs human review.
- `70-100`: dispute or high-risk issue.

### Human-in-the-Loop

Duvo must request approval before:

- Sending a dispute email.
- Marking invoice over EUR 5000 ready for payment.
- Taking action on ambiguous `needs_review` invoices.

Approval title format:

`{status}: {vendor_name} {invoice_number} - {amount} {currency}`

## 9. Demo Dataset

The demo should include:

1. Clean invoice:
   - Vendor: Acme Packaging.
   - Invoice: `INV-ACME-1042`.
   - PO: `PO-2026-ACME-1042`.
   - Expected result: `approved`.

2. Overcharged invoice:
   - Vendor: Acme Packaging.
   - Invoice: `INV-ACME-1043`.
   - PO amount: EUR 4200.
   - Invoice amount: EUR 5100.
   - Expected result: `dispute`.
   - Demo impact: catches EUR 900 overpayment.

3. Missing PO invoice:
   - Vendor: Prague Office Supplies.
   - Invoice: `INV-POS-881`.
   - PO: missing.
   - Expected result: `needs_review`.

4. Duplicate invoice:
   - Invoice: `INV-ACME-1020`.
   - Expected result: `dispute`.

5. Incomplete extraction:
   - Missing vendor and amount.
   - Expected result: `needs_review`.

## 10. Acceptance Tests

The project must pass these scenarios:

- Clean invoice writes `approved`, risk score `0`, no human approval.
- Overcharged invoice writes `dispute`, creates vendor email draft, requires approval.
- Missing PO writes `needs_review`, asks human for direction.
- Duplicate invoice writes `dispute`.
- Incomplete extraction writes `needs_review` and lists missing fields.

Local verification command:

```bash
python3 -m unittest tests/test_vendor_invoice_autopilot.py
```

Demo output command:

```bash
python3 scripts/run_demo.py
```

## 11. Pitch Narrative

Start with the pain:

"AP teams still manually inspect invoice emails. This is repetitive, but the mistakes are expensive."

Show the automation:

"Duvo reads the email, checks the invoice against company policy and PO data, writes the audit row, and only interrupts a human when judgment or approval is needed."

Show the business result:

"In this batch, Duvo approved the clean invoice, caught a EUR 900 overcharge, and routed a missing PO to review."

Close with:

"This is real work automation: not a chatbot, not a prototype, but an auditable teammate for accounts payable."

## 12. Team Execution Plan

Person 1: Duvo workflow owner.

- Configure Gmail and Google Sheets connections.
- Paste the assignment SOP.
- Upload policy files.
- Configure human approval moments.
- Run live demo.

Person 2: Demo and data owner.

- Build Google Sheet tabs from CSV files.
- Prepare invoice emails.
- Run local demo engine.
- Prepare pitch and metrics.
- Keep backup screenshots/output ready.

## 13. Risks and Mitigations

Risk: Gmail or Sheets connection setup takes too long.

Mitigation: Use local demo output and screenshots as fallback, while still showing Duvo SOP and assignment setup.

Risk: Invoice extraction from attachments is inconsistent.

Mitigation: Put invoice fields in email body for the live demo; mention PDF extraction as next production hardening step.

Risk: Sending real vendor email is unsafe.

Mitigation: Use draft-only mode and Human-in-the-Loop approval. For demo, send to an internal test address or stop at draft approval.

Risk: Judges see it as ordinary approval automation.

Mitigation: Emphasize duplicate detection, PO validation, overcharge prevention, policy files, Sheets writeback, and audit trail.

## 14. Future Version

After the hackathon, extend the system with:

- PDF OCR across arbitrary vendor invoice formats.
- ERP integration for NetSuite, SAP, or Dynamics.
- Slack approval notifications.
- Vendor scorecards.
- Monthly AP leakage report.
- Learning loop from approved/denied human decisions.
