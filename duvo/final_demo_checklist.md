# Final Demo Checklist

## 1. Duvo Assignment

- `Automatic Ordering` skill enabled.
- Gmail connected.
- Google Sheets connected.
- Human-in-the-Loop enabled.
- Files uploaded:
  - `duvo/assignment_sop.md`
  - `duvo/invoice_approval_policy.md`
  - `duvo/dispute_email_style.md`
  - `duvo/automatic_ordering_live_prompt.md`
  - `duvo/multi_agent_orchestration.md`

## 2. Google Sheet Tabs

Required tabs:

- `vendors`
- `demand_forecasts`
- `inventory_position`
- `supplier_rules`
- `purchase_orders`
- `invoice_reviews`
- `demo_reviews_backup`

Demo rows to show:

- `INV-LIVE-ACME-3001`: overcharge caught, vendor corrected, status `resolved`, risk `0`.
- `INV-LIVE-POS-3002`: missing PO caught, vendor confirmed PO, status `approved`, risk `0`.

## 3. Live Demo Order

1. Show Sheet tabs for forecast, inventory, supplier rules, PO, and invoice reviews.
2. Say: "Duvo validates the purchasing intent before the invoice is paid."
3. Show Gmail invoice.
4. Run Duvo.
5. In live execution, point to:
   - orchestration role;
   - Automatic Ordering / PO context;
   - Gmail extraction;
   - Google Sheets lookup;
   - invoice validation;
   - Human-in-the-Loop;
   - Gmail send;
   - Sheet update.
6. Show closed-loop reply handling:
   - overcharge reply -> `resolved`;
   - missing PO reply -> `approved`.

## 4. Fallback

If live execution slows down:

- Show `invoice_reviews` rows 5 and 6 in the live Google Sheet.
- Show Duvo run IDs:
  - overcharge closed-loop: `1d00d8c0-e53f-481b-8d1c-69bd1a4f07b1`
  - missing PO closed-loop: `861329f4-96af-4ca7-ba04-ab6529c1c2cb`
- Run local deterministic proof:

```bash
python3 scripts/run_real_case_test.py
python3 -m unittest tests/test_vendor_invoice_autopilot.py tests/test_real_case_email_flow.py
```

## 5. Two-Minute Pitch

Opening:

"Most AP automation starts when the invoice arrives. We start earlier: Duvo validates why the PO exists, then protects payment from bad invoices."

Demo:

"Here is the forecast and supplier context. Automatic Ordering validates the PO. Then a vendor invoice arrives. Duvo checks the invoice against the PO and policy. When it finds an overcharge, it pauses for human approval, sends the dispute email, reads the vendor correction reply, and closes the case in Google Sheets."

Close:

"This is not a chatbot. It is an auditable procurement-to-payment control tower: demand, PO, invoice, approval, vendor reply, and final resolution in one Duvo execution trail."

Scale line:

"For one invoice, you can watch the whole path. For a full AP inbox, Duvo orchestrates specialized agents: intake, ordering context, validation, risk, vendor resolution, and dashboard."
