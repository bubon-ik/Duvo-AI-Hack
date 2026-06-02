import csv
import json
import unittest
from pathlib import Path

from src.vendor_invoice_autopilot import InvoiceAutopilot


ROOT = Path(__file__).resolve().parents[1]


class RealCaseEmailFlowTest(unittest.TestCase):
    def setUp(self):
        self.autopilot = InvoiceAutopilot(
            vendors=read_csv(ROOT / "data" / "vendors.csv"),
            purchase_orders=read_csv(ROOT / "data" / "purchase_orders.csv"),
        )

    def test_overcharge_dispute_closes_after_corrected_vendor_reply(self):
        invoice = read_json(ROOT / "live_cases" / "payloads" / "01_overcharged_invoice.json")
        reply = read_json(ROOT / "live_cases" / "payloads" / "02_overcharged_correction_reply.json")

        dispute = self.autopilot.review(invoice)
        resolution = self.autopilot.resolve_from_vendor_reply(reply, dispute)

        self.assertEqual(dispute["status"], "dispute")
        self.assertEqual(dispute["case_state"], "open")
        self.assertGreaterEqual(dispute["risk_score"], 80)
        self.assertEqual(resolution["status"], "resolved")
        self.assertEqual(resolution["case_state"], "closed")
        self.assertEqual(resolution["amount"], "4200.00")
        self.assertEqual(resolution["risk_score"], 0)

    def test_missing_po_case_closes_after_vendor_confirms_po(self):
        invoice = read_json(ROOT / "live_cases" / "payloads" / "03_missing_po_invoice.json")
        reply = read_json(ROOT / "live_cases" / "payloads" / "04_missing_po_confirmation_reply.json")

        review = self.autopilot.review(invoice)
        resolution = self.autopilot.resolve_from_vendor_reply(reply, review)

        self.assertEqual(review["status"], "needs_review")
        self.assertEqual(review["case_state"], "open")
        self.assertEqual(resolution["status"], "approved")
        self.assertEqual(resolution["case_state"], "closed")
        self.assertEqual(resolution["po_number"], "PO-2026-POS-0091")
        self.assertEqual(resolution["risk_score"], 0)


def read_csv(path):
    with path.open(newline="", encoding="utf-8") as file:
        return list(csv.DictReader(file))


def read_json(path):
    with path.open(encoding="utf-8") as file:
        return json.load(file)


if __name__ == "__main__":
    unittest.main()
