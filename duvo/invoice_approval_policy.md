# Invoice Approval Policy

Approve invoices automatically only when all checks pass:

- Vendor exists in the `vendors` sheet.
- Invoice number has not already appeared in `invoice_reviews`.
- PO number exists in `purchase_orders`.
- PO belongs to the same vendor.
- PO delivery status is `delivered`.
- Invoice amount is less than or equal to the PO expected amount.
- Currency and VAT rate match the vendor and PO records.

Risk routing:

- `approved`: no issues; write the row and mark ready for payment.
- `needs_review`: missing PO or incomplete extraction; ask AP owner for guidance.
- `dispute`: duplicate invoice, unknown PO, wrong vendor, wrong VAT, wrong currency, pending delivery, or overcharge greater than EUR 50.

Human approval:

- Do not send dispute emails without approval.
- Do not mark invoices over EUR 5000 ready for payment without approval.
- In the approval title, include vendor, invoice number, amount, and status.
