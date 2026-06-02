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

Closing:

"This is not a chatbot. It is an auditable AP workflow. Every check is logged, routine invoices move faster, and risky invoices pause before money leaves the company."

Metrics to claim in the pitch:

- Manual AP review: 5-10 minutes per invoice.
- Demo batch: 3 invoices reviewed in seconds.
- Caught overpayment: EUR 900 on one invoice.
- Control improvement: dispute emails and high-value approvals require human sign-off.
