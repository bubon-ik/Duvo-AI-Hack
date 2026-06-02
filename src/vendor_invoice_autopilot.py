from decimal import Decimal, InvalidOperation


class InvoiceAutopilot:
    REQUIRED_FIELDS = ("vendor_name", "invoice_number", "amount", "currency", "vat_rate")

    def __init__(self, vendors, purchase_orders, prior_invoice_numbers=None):
        self.vendors = {row["vendor_name"]: row for row in vendors}
        self.purchase_orders = {row["po_number"]: row for row in purchase_orders}
        self.prior_invoice_numbers = set(prior_invoice_numbers or [])

    def review(self, invoice):
        reasons = []
        risk_score = 0

        for field in self.REQUIRED_FIELDS:
            if not str(invoice.get(field, "")).strip():
                reasons.append(f"Missing required field: {field}")
                risk_score += 30

        vendor = self.vendors.get(invoice.get("vendor_name", ""))
        if invoice.get("vendor_name") and not vendor:
            reasons.append("Unknown vendor")
            risk_score += 35

        if invoice.get("invoice_number") in self.prior_invoice_numbers:
            reasons.append("Duplicate invoice number")
            risk_score += 100

        po_number = invoice.get("po_number", "").strip()
        purchase_order = None
        if not po_number:
            reasons.append("Missing PO number")
            risk_score += 45
        else:
            purchase_order = self.purchase_orders.get(po_number)
            if not purchase_order:
                reasons.append("PO number not found")
                risk_score += 70

        if vendor and po_number and not po_number.startswith(vendor["approved_po_prefix"]):
            reasons.append("PO prefix is not approved for this vendor")
            risk_score += 70

        if vendor and invoice.get("vat_rate"):
            if _decimal(invoice["vat_rate"]) != _decimal(vendor["expected_vat_rate"]):
                reasons.append("VAT rate does not match vendor policy")
                risk_score += 60

        if purchase_order:
            if invoice.get("vendor_name") and purchase_order["vendor_name"] != invoice.get("vendor_name"):
                reasons.append("PO belongs to a different vendor")
                risk_score += 90
            if purchase_order["currency"] != invoice.get("currency"):
                reasons.append("Currency does not match PO")
                risk_score += 60
            if purchase_order["delivery_status"] != "delivered":
                reasons.append("Delivery is not confirmed")
                risk_score += 70
            risk_score += self._amount_risk(invoice, purchase_order, reasons)

        status = self._status_for(reasons, risk_score)
        suggested_action = self._suggested_action(status)
        requires_human_approval = status != "approved" or self._is_high_value(invoice)

        return {
            "vendor_name": invoice.get("vendor_name", ""),
            "invoice_number": invoice.get("invoice_number", ""),
            "po_number": po_number,
            "amount": invoice.get("amount", ""),
            "currency": invoice.get("currency", ""),
            "vat_rate": invoice.get("vat_rate", ""),
            "due_date": invoice.get("due_date", ""),
            "status": status,
            "risk_score": min(risk_score, 100),
            "reasons": reasons,
            "suggested_action": suggested_action,
            "requires_human_approval": requires_human_approval,
            "draft_email": self._draft_email(invoice, reasons) if status == "dispute" else "",
        }

    def _amount_risk(self, invoice, purchase_order, reasons):
        amount = _decimal(invoice.get("amount", ""))
        expected_amount = _decimal(purchase_order.get("expected_amount", ""))
        if amount is None or expected_amount is None:
            return 0

        difference = amount - expected_amount
        if difference <= Decimal("0"):
            return 0
        if difference <= Decimal("50.00"):
            reasons.append(f"Invoice is {difference} over the PO amount")
            return 30
        reasons.append(f"Invoice is {difference} over the PO amount")
        return 80

    def _is_high_value(self, invoice):
        amount = _decimal(invoice.get("amount", ""))
        return amount is not None and amount >= Decimal("5000.00")

    def _status_for(self, reasons, risk_score):
        dispute_reasons = {
            "Duplicate invoice number",
            "PO number not found",
            "PO prefix is not approved for this vendor",
            "PO belongs to a different vendor",
            "Currency does not match PO",
            "VAT rate does not match vendor policy",
            "Delivery is not confirmed",
        }
        if risk_score >= 70 or any(reason in dispute_reasons for reason in reasons):
            return "dispute"
        if reasons:
            return "needs_review"
        return "approved"

    def _suggested_action(self, status):
        if status == "approved":
            return "Mark ready for payment"
        if status == "needs_review":
            return "Ask AP owner for missing context"
        return "Send dispute email after approval"

    def _draft_email(self, invoice, reasons):
        reason_text = "; ".join(reasons)
        return (
            f"Subject: Invoice {invoice.get('invoice_number', '')} requires correction\n\n"
            f"Hi {invoice.get('vendor_name', 'team')},\n\n"
            "We reviewed your invoice and cannot approve it for payment yet.\n\n"
            f"Issues found: {reason_text}.\n\n"
            "Please send a corrected invoice or confirm the discrepancy so we can continue processing.\n\n"
            "Best,\nAP Operations"
        )


def _decimal(value):
    try:
        if value is None or str(value).strip() == "":
            return None
        return Decimal(str(value))
    except (InvalidOperation, ValueError):
        return None
