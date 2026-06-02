import csv
import json
import sys
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from src.vendor_invoice_autopilot import InvoiceAutopilot


FIELDNAMES = [
    "reviewed_at",
    "vendor_name",
    "invoice_number",
    "po_number",
    "amount",
    "currency",
    "vat_rate",
    "due_date",
    "status",
    "risk_score",
    "reasons",
    "suggested_action",
    "requires_human_approval",
    "draft_email",
    "case_state",
    "resolution_notes",
]


def main():
    autopilot = InvoiceAutopilot(
        vendors=read_csv(ROOT / "data" / "vendors.csv"),
        purchase_orders=read_csv(ROOT / "data" / "purchase_orders.csv"),
    )

    overcharged_invoice = read_json(ROOT / "live_cases" / "payloads" / "01_overcharged_invoice.json")
    overcharged_reply = read_json(ROOT / "live_cases" / "payloads" / "02_overcharged_correction_reply.json")
    missing_po_invoice = read_json(ROOT / "live_cases" / "payloads" / "03_missing_po_invoice.json")
    missing_po_reply = read_json(ROOT / "live_cases" / "payloads" / "04_missing_po_confirmation_reply.json")

    reviews = []

    acme_dispute = stamp(autopilot.review(overcharged_invoice))
    reviews.append(acme_dispute)
    reviews.append(stamp(autopilot.resolve_from_vendor_reply(overcharged_reply, acme_dispute)))

    prague_review = stamp(autopilot.review(missing_po_invoice))
    reviews.append(prague_review)
    reviews.append(stamp(autopilot.resolve_from_vendor_reply(missing_po_reply, prague_review)))

    out_path = ROOT / "out" / "real_case_invoice_reviews.csv"
    out_path.parent.mkdir(exist_ok=True)
    write_reviews(out_path, reviews)

    print(f"Wrote {out_path.relative_to(ROOT)}")
    for review in reviews:
        print(
            f"{review['invoice_number']}: {review['status']} "
            f"case={review['case_state']} risk={review['risk_score']} "
            f"action={review['suggested_action']}"
        )


def stamp(review):
    review = dict(review)
    review["reviewed_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    review["reasons"] = " | ".join(review["reasons"])
    return review


def read_csv(path):
    with path.open(newline="", encoding="utf-8") as file:
        return list(csv.DictReader(file))


def read_json(path):
    with path.open(encoding="utf-8") as file:
        return json.load(file)


def write_reviews(path, reviews):
    with path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(reviews)


if __name__ == "__main__":
    main()
