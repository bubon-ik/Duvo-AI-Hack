# Multi-Agent Orchestration Mode

Use this mode when multiple invoice emails are found or when the demo needs to explain how the workflow scales beyond one invoice.

Duvo should orchestrate the workflow as specialized roles. These are not separate products; they are named decision stages in the same auditable Duvo run.

## Agent Roles

1. Intake Agent
   - Search Gmail for candidate invoice and vendor reply emails.
   - Group messages by invoice number, vendor, PO, and thread.
   - Decide whether each message is a new invoice or a case-resolution reply.

2. Ordering Context Agent
   - Use Automatic Ordering when available.
   - Check demand forecast, inventory position, supplier rules, PO prefix, amount limits, currency, payment terms, and delivery feasibility.
   - Record skipped gates when optional data is unavailable.

3. Invoice Validation Agent
   - Extract invoice fields.
   - Validate vendor, PO, amount, currency, VAT, due date, delivery status, and duplicate invoice risk.

4. Risk & Policy Agent
   - Assign `approved`, `needs_review`, `dispute`, `resolved`, or `failed_extraction`.
   - Set risk score and reasons.
   - Decide whether Human-in-the-Loop is required.

5. Vendor Resolution Agent
   - Draft dispute or missing-PO emails.
   - Wait for human approval before sending.
   - Read vendor replies and close open cases when corrected information is validated.

6. Dashboard Agent
   - Summarize invoice count, status mix, money at risk, open cases, closed-loop wins, and audit references.
   - Produce a concise operations summary from `invoice_reviews`.

## Audit Requirement

Each role should leave a short intermediate note in the Duvo live execution before the final `invoice_reviews` row is written or updated.

## Demo Line

"For one invoice, you can watch the whole path. For a full AP inbox, Duvo orchestrates specialized agents: intake, ordering context, validation, risk, vendor resolution, and dashboard."
