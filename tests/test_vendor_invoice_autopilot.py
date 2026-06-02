import unittest

from src.vendor_invoice_autopilot import InvoiceAutopilot


class InvoiceAutopilotTest(unittest.TestCase):
    def setUp(self):
        self.autopilot = InvoiceAutopilot(
            vendors=[
                {
                    "vendor_name": "Acme Packaging",
                    "expected_vat_rate": "21",
                    "payment_terms_days": "30",
                    "approved_po_prefix": "PO-2026-ACME",
                },
                {
                    "vendor_name": "Prague Office Supplies",
                    "expected_vat_rate": "21",
                    "payment_terms_days": "14",
                    "approved_po_prefix": "PO-2026-POS",
                },
            ],
            purchase_orders=[
                {
                    "po_number": "PO-2026-ACME-1042",
                    "vendor_name": "Acme Packaging",
                    "expected_amount": "4200.00",
                    "currency": "EUR",
                    "delivery_status": "delivered",
                },
                {
                    "po_number": "PO-2026-POS-0091",
                    "vendor_name": "Prague Office Supplies",
                    "expected_amount": "850.00",
                    "currency": "EUR",
                    "delivery_status": "delivered",
                },
            ],
            prior_invoice_numbers={"INV-ACME-1020"},
        )

    def test_clean_invoice_is_approved_without_human_review(self):
        result = self.autopilot.review(
            {
                "vendor_name": "Acme Packaging",
                "invoice_number": "INV-ACME-1042",
                "po_number": "PO-2026-ACME-1042",
                "amount": "4200.00",
                "currency": "EUR",
                "vat_rate": "21",
                "due_date": "2026-07-02",
            }
        )

        self.assertEqual(result["status"], "approved")
        self.assertEqual(result["risk_score"], 0)
        self.assertFalse(result["requires_human_approval"])
        self.assertEqual(result["suggested_action"], "Mark ready for payment")

    def test_overcharged_invoice_is_disputed_and_drafts_vendor_email(self):
        result = self.autopilot.review(
            {
                "vendor_name": "Acme Packaging",
                "invoice_number": "INV-ACME-1043",
                "po_number": "PO-2026-ACME-1042",
                "amount": "5100.00",
                "currency": "EUR",
                "vat_rate": "21",
                "due_date": "2026-07-02",
            }
        )

        self.assertEqual(result["status"], "dispute")
        self.assertGreaterEqual(result["risk_score"], 80)
        self.assertTrue(result["requires_human_approval"])
        self.assertIn("over the PO amount", result["reasons"][0])
        self.assertIn("INV-ACME-1043", result["draft_email"])

    def test_missing_po_routes_to_human_review(self):
        result = self.autopilot.review(
            {
                "vendor_name": "Prague Office Supplies",
                "invoice_number": "INV-POS-881",
                "po_number": "",
                "amount": "850.00",
                "currency": "EUR",
                "vat_rate": "21",
                "due_date": "2026-06-18",
            }
        )

        self.assertEqual(result["status"], "needs_review")
        self.assertTrue(result["requires_human_approval"])
        self.assertIn("Missing PO number", result["reasons"])

    def test_duplicate_invoice_is_disputed(self):
        result = self.autopilot.review(
            {
                "vendor_name": "Acme Packaging",
                "invoice_number": "INV-ACME-1020",
                "po_number": "PO-2026-ACME-1042",
                "amount": "4200.00",
                "currency": "EUR",
                "vat_rate": "21",
                "due_date": "2026-07-02",
            }
        )

        self.assertEqual(result["status"], "dispute")
        self.assertIn("Duplicate invoice number", result["reasons"])

    def test_incomplete_extraction_requests_human_input(self):
        result = self.autopilot.review(
            {
                "vendor_name": "",
                "invoice_number": "INV-UNKNOWN-1",
                "po_number": "PO-2026-ACME-1042",
                "amount": "",
                "currency": "EUR",
                "vat_rate": "21",
                "due_date": "2026-07-02",
            }
        )

        self.assertEqual(result["status"], "needs_review")
        self.assertTrue(result["requires_human_approval"])
        self.assertIn("Missing required field: vendor_name", result["reasons"])
        self.assertIn("Missing required field: amount", result["reasons"])

    def test_vendor_correction_resolves_overcharge_dispute(self):
        existing_review = self.autopilot.review(
            {
                "vendor_name": "Acme Packaging",
                "invoice_number": "INV-ACME-1043",
                "po_number": "PO-2026-ACME-1042",
                "amount": "5100.00",
                "currency": "EUR",
                "vat_rate": "21",
                "due_date": "2026-07-02",
            }
        )

        result = self.autopilot.resolve_from_vendor_reply(
            {
                "vendor_name": "Acme Packaging",
                "invoice_number": "INV-ACME-1043",
                "po_number": "PO-2026-ACME-1042",
                "corrected_amount": "4200.00",
                "currency": "EUR",
                "reply_summary": "Vendor sent a corrected invoice for EUR 4200.00.",
            },
            existing_review,
        )

        self.assertEqual(result["status"], "resolved")
        self.assertEqual(result["case_state"], "closed")
        self.assertEqual(result["risk_score"], 0)
        self.assertFalse(result["requires_human_approval"])
        self.assertIn("corrected amount matches", result["resolution_notes"])

    def test_vendor_po_reply_approves_missing_po_case(self):
        existing_review = self.autopilot.review(
            {
                "vendor_name": "Prague Office Supplies",
                "invoice_number": "INV-POS-881",
                "po_number": "",
                "amount": "850.00",
                "currency": "EUR",
                "vat_rate": "21",
                "due_date": "2026-06-18",
            }
        )

        result = self.autopilot.resolve_from_vendor_reply(
            {
                "vendor_name": "Prague Office Supplies",
                "invoice_number": "INV-POS-881",
                "confirmed_po_number": "PO-2026-POS-0091",
                "currency": "EUR",
                "reply_summary": "Vendor confirmed PO-2026-POS-0091.",
            },
            existing_review,
        )

        self.assertEqual(result["status"], "approved")
        self.assertEqual(result["case_state"], "closed")
        self.assertEqual(result["po_number"], "PO-2026-POS-0091")
        self.assertEqual(result["risk_score"], 0)
        self.assertFalse(result["requires_human_approval"])
        self.assertIn("confirmed PO matches", result["resolution_notes"])


if __name__ == "__main__":
    unittest.main()
