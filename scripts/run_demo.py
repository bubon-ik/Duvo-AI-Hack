import csv
import json
import sys
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from src.vendor_invoice_autopilot import InvoiceAutopilot


def main():
    vendors = read_csv(ROOT / "data" / "vendors.csv")
    purchase_orders = read_csv(ROOT / "data" / "purchase_orders.csv")
    invoices = read_invoices(ROOT / "demo_invoices")

    autopilot = InvoiceAutopilot(
        vendors=vendors,
        purchase_orders=purchase_orders,
        prior_invoice_numbers={"INV-ACME-1020"},
    )

    reviews = []
    for invoice in invoices:
        review = autopilot.review(invoice)
        review["reviewed_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
        review["reasons"] = " | ".join(review["reasons"])
        reviews.append(review)

    out_dir = ROOT / "out"
    out_dir.mkdir(exist_ok=True)
    write_reviews(out_dir / "invoice_reviews.csv", reviews)

    print("Wrote out/invoice_reviews.csv")
    for review in reviews:
        print(
            f"{review['invoice_number']}: {review['status']} "
            f"risk={review['risk_score']} action={review['suggested_action']}"
        )


def read_csv(path):
    with path.open(newline="", encoding="utf-8") as file:
        return list(csv.DictReader(file))


def read_invoices(directory):
    invoices = []
    for path in sorted(directory.glob("*.json")):
        with path.open(encoding="utf-8") as file:
            invoices.append(json.load(file))
    return invoices


def write_reviews(path, reviews):
    fieldnames = [
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
    ]
    with path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(reviews)


if __name__ == "__main__":
    main()
