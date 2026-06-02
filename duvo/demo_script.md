# Demo Script

Opening:

"Accounts payable teams spend hours checking invoice emails against purchase orders. Procurement teams spend even more time proving why those POs should exist in the first place. We built a Duvo teammate that validates the purchasing intent, reviews every incoming invoice before payment, and closes vendor disputes from email replies."

Live run:

1. Show the Google Sheet tabs: demand forecasts, inventory position, supplier rules, purchase orders, and invoice reviews.
2. Point out that Duvo Automatic Ordering validates why the PO exists before the invoice is paid.
3. Show an invoice email from Acme Packaging.
4. Run the Duvo assignment.
5. Narrate the live execution:
   - It validates PO context with Automatic Ordering.
   - It extracts invoice fields.
   - It reads vendor and PO policy data.
   - It checks duplicate invoices, VAT, amount, currency, and delivery status.
   - It writes the review row.
6. For the overcharged invoice, show the Human-in-the-Loop approval request.
7. Approve the draft dispute email and show the generated message.
8. Send the vendor correction reply for the disputed invoice.
9. Run Duvo again and show that it links the reply to the open case instead of treating it as a new invoice.
10. Show the case move from `dispute/open` to `resolved/closed` with resolution notes.
11. Repeat with the missing-PO vendor reply and show `needs_review/open` become `approved/closed`.

Wow moment:

"Most invoice demos start too late and stop too early. We start before the invoice, with Duvo Automatic Ordering validating the PO context, and we continue until the business process is resolved. Duvo catches the issue, asks for human approval, sends the vendor email, reads the vendor's reply, validates the correction, and closes the case with an audit trail."

Closing:

"This is not a chatbot. It is an auditable procurement-to-payment workflow. Every check is logged, routine invoices move faster, and risky invoices pause before money leaves the company."

Metrics to claim in the pitch:

- Manual AP review: 5-10 minutes per invoice.
- Demo batch: 3 invoices reviewed in seconds.
- Caught overpayment: EUR 900 on one invoice.
- Upstream control: Automatic Ordering validates PO intent before invoice payment.
- Control improvement: dispute emails and high-value approvals require human sign-off.
- Closed-loop resolution: vendor corrections are linked back to the original case and update the system of record automatically.
