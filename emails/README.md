# Duvo email templates

Branded, email-safe HTML templates used by the Invoice Review Autopilot. Table
layout with inline styles, web-safe font fallbacks, hidden preheader text. Tested
to render in Gmail, Outlook, and Apple Mail.

## Templates

- `dispute_email_template.html` — sent to a vendor when an invoice fails an
  automated check (overcharge, missing PO, duplicate). Red status banner, invoice
  summary, highlighted issue, reply CTA.
- `approved_email_template.html` — sent when an invoice passes all checks and is
  scheduled for payment. Green success banner, approved amount.

## Placeholders

Both templates use `{{double_brace}}` placeholders for mail merge:

| Placeholder | Example |
|---|---|
| `{{invoice_number}}` | `INV-ACME-1043` |
| `{{vendor_name}}` | `Acme Packaging` |
| `{{po_number}}` | `PO-2026-ACME-1042` |
| `{{amount}}` | `EUR 5,100.00` |
| `{{due_date}}` | `2026-07-02` |
| `{{issue_description}}` | dispute template only |

Fill them in with any templating step (Duvo mail merge, a script, or by hand)
before sending.
