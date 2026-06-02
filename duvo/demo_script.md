# Demo Script

Opening:

"Accounts payable teams spend hours checking invoice emails against purchase orders. Small mistakes become overpayments, duplicate payments, or delayed month-end close. We built a Duvo teammate that reviews every incoming invoice before payment."

Live run:

1. Show the Google Sheet tabs: vendors, purchase orders, and empty invoice reviews.
2. Show an invoice email from Acme Packaging.
3. Run the Duvo assignment.
4. Narrate the live execution:
   - It extracts invoice fields.
   - It reads vendor and PO policy data.
   - It checks duplicate invoices, VAT, amount, currency, and delivery status.
   - It writes the review row.
5. For the overcharged invoice, show the Human-in-the-Loop approval request.
6. Approve the draft dispute email and show the generated message.
7. Send the vendor correction reply for the disputed invoice.
8. Run Duvo again and show that it links the reply to the open case instead of treating it as a new invoice.
9. Show the case move from `dispute/open` to `resolved/closed` with resolution notes.
10. Repeat with the missing-PO vendor reply and show `needs_review/open` become `approved/closed`.

Wow moment:

"Most invoice demos stop when AI detects a problem. We continue until the business process is resolved. Duvo catches the issue, asks for human approval, sends the vendor email, reads the vendor's reply, validates the correction, and closes the case with an audit trail."

Closing:

"This is not a chatbot. It is an auditable AP workflow. Every check is logged, routine invoices move faster, and risky invoices pause before money leaves the company."

Metrics to claim in the pitch:

- Manual AP review: 5-10 minutes per invoice.
- Demo batch: 3 invoices reviewed in seconds.
- Caught overpayment: EUR 900 on one invoice.
- Control improvement: dispute emails and high-value approvals require human sign-off.
- Closed-loop resolution: vendor corrections are linked back to the original case and update the system of record automatically.
